package com.property.management.service;

import com.property.management.dto.request.PropertyRequestDto;
import com.property.management.dto.response.PagedResponse;
import com.property.management.dto.response.PropertyResponseDto;
import com.property.management.entity.Property;
import com.property.management.entity.PropertyImage;
import com.property.management.exception.ResourceNotFoundException;
import com.property.management.repository.PropertyImageRepository;
import com.property.management.repository.PropertyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class PropertyService {

    private static final Logger log = LoggerFactory.getLogger(PropertyService.class);

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final FileStorageService fileStorageService;

    public PropertyService(PropertyRepository propertyRepository,
                           PropertyImageRepository propertyImageRepository,
                           FileStorageService fileStorageService) {
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponseDto> getProperties(String city, String search, Pageable pageable) {
        Page<Property> page;

        boolean hasCity = city != null && !city.isBlank();
        boolean hasSearch = search != null && !search.isBlank();

        if (hasCity && hasSearch) {
            page = propertyRepository.findByCityIgnoreCaseAndNameContainingIgnoreCase(city.trim(), search.trim(), pageable);
        } else if (hasCity) {
            page = propertyRepository.findByCityIgnoreCase(city.trim(), pageable);
        } else if (hasSearch) {
            page = propertyRepository.findByNameContainingIgnoreCase(search.trim(), pageable);
        } else {
            page = propertyRepository.findAll(pageable);
        }

        return PagedResponse.of(page, PropertyResponseDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public PropertyResponseDto getPropertyById(Long id) {
        Property property = propertyRepository.findByIdWithImages(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        return PropertyResponseDto.fromEntity(property);
    }

    @Transactional
    public PropertyResponseDto createProperty(PropertyRequestDto request, List<MultipartFile> images) {
        Property property = new Property(
                request.getName().trim(),
                request.getDescription().trim(),
                request.getPrice(),
                request.getLocation().trim(),
                request.getCity().trim()
        );

        List<FileStorageService.StoredFileInfo> storedFiles = new ArrayList<>();

        try {
            if (images != null && !images.isEmpty()) {
                int order = 0;
                for (MultipartFile file : images) {
                    if (file != null && !file.isEmpty()) {
                        FileStorageService.StoredFileInfo fileInfo = fileStorageService.storeFile(file);
                        storedFiles.add(fileInfo);

                        boolean isPrimary = (order == 0);
                        PropertyImage imageEntity = new PropertyImage(
                                fileInfo.relativePath(),
                                fileInfo.fileName(),
                                fileInfo.contentType(),
                                fileInfo.fileSize(),
                                isPrimary,
                                order++
                        );
                        property.addImage(imageEntity);
                    }
                }
            }

            Property savedProperty = propertyRepository.save(property);
            log.info("Created property ID: {} with {} images", savedProperty.getId(), storedFiles.size());
            return PropertyResponseDto.fromEntity(savedProperty);

        } catch (Exception ex) {
            // Clean up any files saved in this transaction to prevent orphans
            for (FileStorageService.StoredFileInfo info : storedFiles) {
                fileStorageService.deleteFile(info.fileName());
            }
            throw ex;
        }
    }

    @Transactional
    public PropertyResponseDto updateProperty(Long id,
                                              PropertyRequestDto request,
                                              List<MultipartFile> newImages,
                                              List<Long> keepImageIds,
                                              Long primaryImageId) {

        Property property = propertyRepository.findByIdWithImages(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        // Update basic attributes
        property.setName(request.getName().trim());
        property.setDescription(request.getDescription().trim());
        property.setPrice(request.getPrice());
        property.setLocation(request.getLocation().trim());
        property.setCity(request.getCity().trim());

        // Handle image retention / removal
        if (keepImageIds != null) {
            List<PropertyImage> toRemove = new ArrayList<>();
            for (PropertyImage existingImage : property.getImages()) {
                if (!keepImageIds.contains(existingImage.getId())) {
                    toRemove.add(existingImage);
                }
            }

            for (PropertyImage removed : toRemove) {
                property.removeImage(removed);
                fileStorageService.deleteFile(removed.getFilePath());
            }
        }

        // Handle addition of new images
        List<FileStorageService.StoredFileInfo> newlyStoredFiles = new ArrayList<>();
        try {
            if (newImages != null && !newImages.isEmpty()) {
                int currentMaxOrder = property.getImages().stream()
                        .mapToInt(PropertyImage::getDisplayOrder)
                        .max()
                        .orElse(-1);

                for (MultipartFile file : newImages) {
                    if (file != null && !file.isEmpty()) {
                        FileStorageService.StoredFileInfo fileInfo = fileStorageService.storeFile(file);
                        newlyStoredFiles.add(fileInfo);

                        currentMaxOrder++;
                        PropertyImage newImageEntity = new PropertyImage(
                                fileInfo.relativePath(),
                                fileInfo.fileName(),
                                fileInfo.contentType(),
                                fileInfo.fileSize(),
                                false,
                                currentMaxOrder
                        );
                        property.addImage(newImageEntity);
                    }
                }
            }
        } catch (Exception ex) {
            for (FileStorageService.StoredFileInfo info : newlyStoredFiles) {
                fileStorageService.deleteFile(info.fileName());
            }
            throw ex;
        }

        // Handle primary image assignment
        if (primaryImageId != null) {
            for (PropertyImage img : property.getImages()) {
                img.setIsPrimary(img.getId() != null && img.getId().equals(primaryImageId));
            }
        }

        // Ensure at least one image is primary if images exist
        if (!property.getImages().isEmpty()) {
            boolean hasPrimary = property.getImages().stream().anyMatch(PropertyImage::getIsPrimary);
            if (!hasPrimary) {
                property.getImages().get(0).setIsPrimary(true);
            }
        }

        Property updatedProperty = propertyRepository.save(property);
        log.info("Updated property ID: {}", updatedProperty.getId());
        return PropertyResponseDto.fromEntity(updatedProperty);
    }

    @Transactional
    public void deleteProperty(Long id) {
        Property property = propertyRepository.findByIdWithImages(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        // Collect all image paths to delete from disk
        List<String> filesToDelete = property.getImages().stream()
                .map(PropertyImage::getFilePath)
                .toList();

        // Delete entity (cascades image database records)
        propertyRepository.delete(property);

        // Delete physical files from disk
        for (String filePath : filesToDelete) {
            fileStorageService.deleteFile(filePath);
        }

        log.info("Deleted property ID: {} and cleaned up {} physical files", id, filesToDelete.size());
    }
}
