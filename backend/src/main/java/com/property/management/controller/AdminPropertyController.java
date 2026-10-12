package com.property.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.property.management.dto.request.PropertyRequestDto;
import com.property.management.dto.response.ApiResponse;
import com.property.management.dto.response.PagedResponse;
import com.property.management.dto.response.PropertyResponseDto;
import com.property.management.exception.BadRequestException;
import com.property.management.service.PropertyService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/properties")
public class AdminPropertyController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("createdAt", "price", "name", "city", "id");

    private final PropertyService propertyService;
    private final ObjectMapper objectMapper;
    private final Validator validator;

    public AdminPropertyController(PropertyService propertyService,
                                   ObjectMapper objectMapper,
                                   Validator validator) {
        this.propertyService = propertyService;
        this.objectMapper = objectMapper;
        this.validator = validator;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponseDto>>> getAdminProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        if (page < 0) {
            throw new BadRequestException("Page index cannot be negative");
        }
        if (size < 1 || size > 100) {
            throw new BadRequestException("Page size must be between 1 and 100");
        }

        String validSortBy = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "createdAt";
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, validSortBy));

        PagedResponse<PropertyResponseDto> response = propertyService.getProperties(city, search, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ApiResponse<PropertyResponseDto>> createProperty(
            @ModelAttribute PropertyRequestDto formDto,
            @RequestPart(value = "property", required = false) String propertyJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        PropertyRequestDto requestDto = resolvePropertyRequest(formDto, propertyJson);
        validatePropertyRequest(requestDto);

        PropertyResponseDto created = propertyService.createProperty(requestDto, images);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Property created successfully", created));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<PropertyResponseDto>> updatePropertyMultipart(
            @PathVariable Long id,
            @ModelAttribute PropertyRequestDto formDto,
            @RequestPart(value = "property", required = false) String propertyJson,
            @RequestPart(value = "newImages", required = false) List<MultipartFile> newImages,
            @RequestParam(value = "keepImageIds", required = false) List<Long> keepImageIds,
            @RequestParam(value = "primaryImageId", required = false) Long primaryImageId) {

        PropertyRequestDto requestDto = resolvePropertyRequest(formDto, propertyJson);
        validatePropertyRequest(requestDto);

        PropertyResponseDto updated = propertyService.updateProperty(id, requestDto, newImages, keepImageIds, primaryImageId);
        return ResponseEntity.ok(ApiResponse.success("Property updated successfully", updated));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<PropertyResponseDto>> updatePropertyJson(
            @PathVariable Long id,
            @RequestBody PropertyRequestDto jsonBody,
            @RequestParam(value = "keepImageIds", required = false) List<Long> keepImageIds,
            @RequestParam(value = "primaryImageId", required = false) Long primaryImageId) {

        validatePropertyRequest(jsonBody);

        PropertyResponseDto updated = propertyService.updateProperty(id, jsonBody, null, keepImageIds, primaryImageId);
        return ResponseEntity.ok(ApiResponse.success("Property updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok(ApiResponse.success("Property and associated images deleted successfully", null));
    }

    private PropertyRequestDto resolvePropertyRequest(PropertyRequestDto formDto, String propertyJson) {
        if (formDto != null && formDto.getName() != null && !formDto.getName().isBlank()) {
            return formDto;
        }
        if (propertyJson != null && !propertyJson.isBlank()) {
            try {
                return objectMapper.readValue(propertyJson, PropertyRequestDto.class);
            } catch (Exception e) {
                throw new BadRequestException("Invalid property JSON payload: " + e.getMessage());
            }
        }
        return formDto != null ? formDto : new PropertyRequestDto();
    }

    private void validatePropertyRequest(PropertyRequestDto dto) {
        Set<ConstraintViolation<PropertyRequestDto>> violations = validator.validate(dto);
        if (!violations.isEmpty()) {
            ConstraintViolation<PropertyRequestDto> first = violations.iterator().next();
            throw new BadRequestException(first.getPropertyPath() + ": " + first.getMessage());
        }
    }
}
