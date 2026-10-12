package com.property.management.dto.response;

import com.property.management.entity.PropertyInquiry;

import java.time.Instant;

public class InquiryResponseDto {

    private Long id;
    private Long propertyId;
    private String propertyName;
    private String propertyCity;
    private String name;
    private String email;
    private String phone;
    private String message;
    private String status;
    private Instant createdAt;

    public InquiryResponseDto() {
    }

    public static InquiryResponseDto fromEntity(PropertyInquiry entity) {
        InquiryResponseDto dto = new InquiryResponseDto();
        dto.setId(entity.getId());
        if (entity.getProperty() != null) {
            dto.setPropertyId(entity.getProperty().getId());
            dto.setPropertyName(entity.getProperty().getName());
            dto.setPropertyCity(entity.getProperty().getCity());
        }
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setMessage(entity.getMessage());
        dto.setStatus(entity.getStatus() != null ? entity.getStatus().name() : "NEW");
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public String getPropertyName() {
        return propertyName;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public String getPropertyCity() {
        return propertyCity;
    }

    public void setPropertyCity(String propertyCity) {
        this.propertyCity = propertyCity;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
