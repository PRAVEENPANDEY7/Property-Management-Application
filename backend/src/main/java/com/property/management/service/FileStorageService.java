package com.property.management.service;

import com.property.management.config.StorageProperties;
import com.property.management.exception.BadRequestException;
import com.property.management.exception.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    private final StorageProperties storageProperties;
    private Path rootStorageLocation;

    public FileStorageService(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    @PostConstruct
    public void init() {
        try {
            this.rootStorageLocation = Paths.get(storageProperties.getLocation()).toAbsolutePath().normalize();
            Files.createDirectories(this.rootStorageLocation);
            log.info("Initialized property image storage directory at: {}", this.rootStorageLocation);
        } catch (IOException e) {
            throw new IllegalStateException("Could not initialize storage directory: " + storageProperties.getLocation(), e);
        }
    }

    public record StoredFileInfo(String fileName, String relativePath, String contentType, long fileSize) {}

    public StoredFileInfo storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file");
        }

        if (file.getSize() > storageProperties.getMaxFileSize()) {
            throw new BadRequestException(String.format("File size %d bytes exceeds maximum allowed limit of %d bytes",
                    file.getSize(), storageProperties.getMaxFileSize()));
        }

        String rawOriginalFilename = file.getOriginalFilename();
        String cleanOriginalFilename = StringUtils.cleanPath(Objects.requireNonNullElse(rawOriginalFilename, "image.jpg"));

        // Strictly block path traversal characters in incoming filename
        if (cleanOriginalFilename.contains("..") || cleanOriginalFilename.contains("/") || cleanOriginalFilename.contains("\\")) {
            throw new BadRequestException("Invalid path traversal sequence detected in filename");
        }

        String contentType = file.getContentType();
        if (contentType == null || !storageProperties.getAllowedMimeTypes().contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid file type: " + contentType + ". Allowed types: " + storageProperties.getAllowedMimeTypes());
        }

        // Validate actual image content via magic bytes
        validateImageContent(file, contentType);

        String extension = extractExtension(cleanOriginalFilename, contentType);
        String uniqueFilename = UUID.randomUUID() + extension;

        try {
            Path targetLocation = this.rootStorageLocation.resolve(uniqueFilename).normalize();

            // Guard against path traversal breakout
            if (!targetLocation.startsWith(this.rootStorageLocation)) {
                throw new BadRequestException("Cannot store file outside current storage directory");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            String relativePath = "uploads/properties/" + uniqueFilename;
            return new StoredFileInfo(uniqueFilename, relativePath, contentType, file.getSize());

        } catch (IOException ex) {
            throw new IllegalStateException("Failed to store file: " + uniqueFilename, ex);
        }
    }

    public Resource loadFileAsResource(String filename) {
        try {
            String cleanFilename = StringUtils.cleanPath(filename);
            if (cleanFilename.contains("..") || cleanFilename.contains("/") || cleanFilename.contains("\\")) {
                throw new BadRequestException("Invalid path traversal sequence in filename");
            }

            Path filePath = this.rootStorageLocation.resolve(cleanFilename).normalize();
            if (!filePath.startsWith(this.rootStorageLocation)) {
                throw new BadRequestException("Access denied: File outside storage directory");
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Property image", "filename", filename);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("Property image", "filename", filename);
        }
    }

    public void deleteFile(String filePathOrName) {
        if (filePathOrName == null || filePathOrName.isBlank()) {
            return;
        }

        try {
            // Extract the actual filename
            Path p = Paths.get(filePathOrName);
            String filename = p.getFileName().toString();
            String cleanFilename = StringUtils.cleanPath(filename);

            if (cleanFilename.contains("..")) {
                log.warn("Path traversal sequence prevented in deleteFile: {}", filePathOrName);
                return;
            }

            Path target = this.rootStorageLocation.resolve(cleanFilename).normalize();
            if (target.startsWith(this.rootStorageLocation)) {
                boolean deleted = Files.deleteIfExists(target);
                if (deleted) {
                    log.debug("Successfully deleted physical file: {}", target);
                }
            }
        } catch (IOException ex) {
            log.warn("Could not delete file {}: {}", filePathOrName, ex.getMessage());
        }
    }

    private void validateImageContent(MultipartFile file, String declaredMimeType) {
        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[12];
            int read = is.read(header);
            if (read < 4) {
                throw new BadRequestException("File is too small to be a valid image");
            }

            boolean isJpeg = (header[0] == (byte) 0xFF && header[1] == (byte) 0xD8 && header[2] == (byte) 0xFF);
            boolean isPng = (header[0] == (byte) 0x89 && header[1] == (byte) 0x50 && header[2] == (byte) 0x4E && header[3] == (byte) 0x47);
            boolean isWebp = (read >= 12 &&
                    header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F' &&
                    header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P');

            if (!isJpeg && !isPng && !isWebp) {
                throw new BadRequestException("File content does not match a valid image format (JPEG, PNG, or WebP)");
            }

            if (declaredMimeType.equalsIgnoreCase("image/jpeg") && !isJpeg) {
                throw new BadRequestException("Declared image/jpeg does not match actual file signature");
            }
            if (declaredMimeType.equalsIgnoreCase("image/png") && !isPng) {
                throw new BadRequestException("Declared image/png does not match actual file signature");
            }
            if (declaredMimeType.equalsIgnoreCase("image/webp") && !isWebp) {
                throw new BadRequestException("Declared image/webp does not match actual file signature");
            }

        } catch (IOException e) {
            throw new BadRequestException("Unable to read image file content: " + e.getMessage());
        }
    }

    private String extractExtension(String filename, String contentType) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex != -1 && dotIndex < filename.length() - 1) {
            String ext = filename.substring(dotIndex).toLowerCase();
            if (Arrays.asList(".jpg", ".jpeg", ".png", ".webp").contains(ext)) {
                return ext;
            }
        }

        // Fallback by MIME type
        return switch (contentType.toLowerCase()) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }

    public Path getRootStorageLocation() {
        return rootStorageLocation;
    }
}
