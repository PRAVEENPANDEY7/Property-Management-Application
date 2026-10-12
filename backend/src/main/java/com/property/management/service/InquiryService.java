package com.property.management.service;

import com.property.management.dto.request.InquiryRequestDto;
import com.property.management.dto.response.InquiryResponseDto;
import com.property.management.dto.response.PagedResponse;
import com.property.management.entity.Property;
import com.property.management.entity.PropertyInquiry;
import com.property.management.exception.BadRequestException;
import com.property.management.exception.ResourceNotFoundException;
import com.property.management.repository.PropertyInquiryRepository;
import com.property.management.repository.PropertyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InquiryService {

    private final PropertyInquiryRepository inquiryRepository;
    private final PropertyRepository propertyRepository;

    public InquiryService(PropertyInquiryRepository inquiryRepository, PropertyRepository propertyRepository) {
        this.inquiryRepository = inquiryRepository;
        this.propertyRepository = propertyRepository;
    }

    @Transactional
    public InquiryResponseDto createInquiry(Long propertyId, InquiryRequestDto request) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        PropertyInquiry inquiry = new PropertyInquiry(
                property,
                request.getName().trim(),
                request.getEmail().trim().toLowerCase(),
                request.getPhone().trim(),
                request.getMessage() != null ? request.getMessage().trim() : null
        );

        PropertyInquiry saved = inquiryRepository.save(inquiry);
        return InquiryResponseDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public PagedResponse<InquiryResponseDto> getInquiries(Pageable pageable) {
        Page<PropertyInquiry> page = inquiryRepository.findAllWithProperty(pageable);
        return PagedResponse.of(page, InquiryResponseDto::fromEntity);
    }

    @Transactional
    public InquiryResponseDto updateInquiryStatus(Long inquiryId, String statusStr) {
        PropertyInquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("PropertyInquiry", "id", inquiryId));

        try {
            PropertyInquiry.Status status = PropertyInquiry.Status.valueOf(statusStr.toUpperCase());
            inquiry.setStatus(status);
            return InquiryResponseDto.fromEntity(inquiry);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid inquiry status: " + statusStr + ". Allowed: NEW, CONTACTED, CLOSED");
        }
    }

    @Transactional(readOnly = true)
    public long getNewInquiriesCount() {
        return inquiryRepository.countByStatus(PropertyInquiry.Status.NEW);
    }
}
