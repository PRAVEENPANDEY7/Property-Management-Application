package com.property.management.dto.response;

import com.property.management.entity.Property;
import com.property.management.entity.PropertyImage;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class PropertyResponseDto {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String location;
    private String city;
    private String primaryImagePath;
    private List<PropertyImageResponseDto> images = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;

    public PropertyResponseDto() {
    }

    public static PropertyResponseDto fromEntity(Property property) {
        if (property == null) return null;

        PropertyResponseDto dto = new PropertyResponseDto();
        dto.setId(property.getId());
        dto.setName(property.getName());
        dto.setDescription(property.getDescription());
        dto.setPrice(property.getPrice());
        dto.setLocation(property.getLocation());
        dto.setCity(property.getCity());
        dto.setCreatedAt(property.getCreatedAt());
        dto.setUpdatedAt(property.getUpdatedAt());

        if (property.getImages() != null && !property.getImages().isEmpty()) {
            List<PropertyImageResponseDto> imageDtos = property.getImages().stream()
                    .map(PropertyImageResponseDto::fromEntity)
                    .toList();
            dto.setImages(imageDtos);

            // Find primary image or fall back to the first image
            String primary = property.getImages().stream()
                    .filter(PropertyImage::getIsPrimary)
                    .findFirst()
                    .map(PropertyImage::getFilePath)
                    .orElseGet(() -> property.getImages().get(0).getFilePath());
            dto.setPrimaryImagePath(primary);
        }

        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPrimaryImagePath() {
        return primaryImagePath;
    }

    public void setPrimaryImagePath(String primaryImagePath) {
        this.primaryImagePath = primaryImagePath;
    }

    public List<PropertyImageResponseDto> getImages() {
        return images;
    }

    public void setImages(List<PropertyImageResponseDto> images) {
        this.images = images != null ? images : new ArrayList<>();
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
