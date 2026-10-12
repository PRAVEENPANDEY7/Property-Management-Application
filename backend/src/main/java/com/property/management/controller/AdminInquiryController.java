package com.property.management.controller;

import com.property.management.dto.response.ApiResponse;
import com.property.management.dto.response.InquiryResponseDto;
import com.property.management.dto.response.PagedResponse;
import com.property.management.service.InquiryService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/inquiries")
public class AdminInquiryController {

    private final InquiryService inquiryService;

    public AdminInquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<InquiryResponseDto>>> getInquiries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(100, Math.max(1, size)), Sort.by(Sort.Direction.DESC, "createdAt"));
        PagedResponse<InquiryResponseDto> response = inquiryService.getInquiries(pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getInquiryStats() {
        long newCount = inquiryService.getNewInquiriesCount();
        return ResponseEntity.ok(ApiResponse.success(Map.of("newInquiriesCount", newCount)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<InquiryResponseDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        InquiryResponseDto updated = inquiryService.updateInquiryStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Inquiry status updated successfully", updated));
    }
}
