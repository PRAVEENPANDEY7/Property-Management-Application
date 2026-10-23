package com.property.management.controller;

import com.property.management.dto.request.ChangePasswordRequestDto;
import com.property.management.dto.request.LoginRequestDto;
import com.property.management.dto.request.UpdateProfileRequestDto;
import com.property.management.dto.request.UserRegisterRequestDto;
import com.property.management.dto.response.ApiResponse;
import com.property.management.dto.response.AuthResponseDto;
import com.property.management.dto.response.UserResponseDto;
import com.property.management.security.UserPrincipal;
import com.property.management.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDto>> register(@Valid @RequestBody UserRegisterRequestDto request) {
        UserResponseDto user = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> login(@Valid @RequestBody LoginRequestDto request) {
        AuthResponseDto authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDto>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal) {
        UserResponseDto user = authService.getCurrentUser(principal);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequestDto request) {
        UserResponseDto updated = authService.updateProfile(principal, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<UserResponseDto>> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequestDto request) {
        UserResponseDto updated = authService.changePassword(principal, request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", updated));
    }
}
