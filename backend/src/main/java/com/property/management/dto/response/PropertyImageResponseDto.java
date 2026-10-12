package com.property.management.dto.response;

import com.property.management.entity.PropertyImage;

import java.time.Instant;

public class PropertyImageResponseDto {

    private Long id;
    private String fileName;
    private String filePath;
    private String contentType;
    private Long fileSize;
    private Boolean isPrimary;
    private Integer displayOrder;
    private Instant createdAt;

    public PropertyImageResponseDto() {
    }

    public PropertyImageResponseDto(Long id, String fileName, String filePath, String contentType, Long fileSize, Boolean isPrimary, Integer displayOrder, Instant createdAt) {
        this.id = id;
        this.fileName = fileName;
        this.filePath = filePath;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.isPrimary = isPrimary;
        this.displayOrder = displayOrder;
        this.createdAt = createdAt;
    }

    public static PropertyImageResponseDto fromEntity(PropertyImage image) {
        if (image == null) return null;
        return new PropertyImageResponseDto(
                image.getId(),
                image.getFileName(),
                image.getFilePath(),
                image.getContentType(),
                image.getFileSize(),
                image.getIsPrimary(),
                image.getDisplayOrder(),
                image.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public Boolean getIsPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
