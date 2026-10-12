package com.property.management.dto.response;

import com.property.management.entity.Role;
import com.property.management.entity.User;

import java.time.Instant;

public class UserResponseDto {

    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private Instant createdAt;

    public UserResponseDto() {
    }

    public UserResponseDto(Long id, String email, String fullName, Role role, Instant createdAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.createdAt = createdAt;
    }

    public static UserResponseDto fromEntity(User user) {
        if (user == null) return null;
        return new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
