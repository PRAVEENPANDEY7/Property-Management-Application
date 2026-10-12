package com.property.management.controller;

import com.property.management.dto.response.ApiResponse;
import com.property.management.dto.response.PagedResponse;
import com.property.management.dto.response.PropertyResponseDto;
import com.property.management.exception.BadRequestException;
import com.property.management.service.FileStorageService;
import com.property.management.service.PropertyService;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("createdAt", "price", "name", "city", "id");

    private final PropertyService propertyService;
    private final FileStorageService fileStorageService;
    private final com.property.management.service.InquiryService inquiryService;

    public PropertyController(PropertyService propertyService,
                              FileStorageService fileStorageService,
                              com.property.management.service.InquiryService inquiryService) {
        this.propertyService = propertyService;
        this.fileStorageService = fileStorageService;
        this.inquiryService = inquiryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponseDto>>> getProperties(
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

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyResponseDto>> getPropertyById(@PathVariable Long id) {
        PropertyResponseDto property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(ApiResponse.success(property));
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        Resource resource = fileStorageService.loadFileAsResource(filename);

        String lower = filename.toLowerCase();
        MediaType mediaType = MediaType.IMAGE_JPEG;
        if (lower.endsWith(".png")) {
            mediaType = MediaType.IMAGE_PNG;
        } else if (lower.endsWith(".webp")) {
            mediaType = MediaType.parseMediaType("image/webp");
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "max-age=86400, public")
                .body(resource);
    }

    @PostMapping("/{id}/inquiries")
    public ResponseEntity<ApiResponse<com.property.management.dto.response.InquiryResponseDto>> submitInquiry(
            @PathVariable Long id,
            @jakarta.validation.Valid @RequestBody com.property.management.dto.request.InquiryRequestDto inquiryRequest) {

        com.property.management.dto.response.InquiryResponseDto response = inquiryService.createInquiry(id, inquiryRequest);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                .body(ApiResponse.success("Thank you! Your inquiry has been submitted successfully.", response));
    }
}
