package com.property.management.dto;

import com.property.management.dto.request.PropertyRequestDto;
import com.property.management.dto.request.UserRegisterRequestDto;
import com.property.management.dto.response.PropertyResponseDto;
import com.property.management.dto.response.UserResponseDto;
import com.property.management.entity.Property;
import com.property.management.entity.PropertyImage;
import com.property.management.entity.Role;
import com.property.management.entity.User;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ValidationAndDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("Should validate valid PropertyRequestDto with no violations")
    void shouldAcceptValidPropertyRequest() {
        PropertyRequestDto dto = new PropertyRequestDto(
                "Oceanview Villa",
                "Stunning beachfront property with modern architecture and infinity pool.",
                new BigDecimal("899000.00"),
                "12 Coastal Highway",
                "Miami"
        );

        Set<ConstraintViolation<PropertyRequestDto>> violations = validator.validate(dto);
        assertThat(violations).isEmpty();
    }

    @Test
    @DisplayName("Should reject negative or zero price in PropertyRequestDto")
    void shouldRejectZeroOrNegativePrice() {
        PropertyRequestDto zeroPrice = new PropertyRequestDto(
                "Oceanview Villa",
                "Stunning beachfront property with modern architecture and infinity pool.",
                BigDecimal.ZERO,
                "12 Coastal Highway",
                "Miami"
        );

        Set<ConstraintViolation<PropertyRequestDto>> violations = validator.validate(zeroPrice);
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("price"));
    }

    @Test
    @DisplayName("Should reject invalid email and short password in UserRegisterRequestDto")
    void shouldRejectInvalidRegistration() {
        UserRegisterRequestDto invalid = new UserRegisterRequestDto("not-an-email", "short", "A");

        Set<ConstraintViolation<UserRegisterRequestDto>> violations = validator.validate(invalid);
        assertThat(violations).hasSizeGreaterThanOrEqualTo(3);
    }

    @Test
    @DisplayName("Should map Property and images to PropertyResponseDto correctly")
    void shouldMapPropertyResponseDto() {
        Property property = new Property("Modern Villa", "Spacious villa with garden", new BigDecimal("750000.00"), "10 Sunset Blvd", "Austin");
        property.setId(42L);

        PropertyImage img = new PropertyImage("uploads/img1.webp", "img1.webp", "image/webp", 1024L, true, 1);
        img.setId(101L);
        property.addImage(img);

        PropertyResponseDto dto = PropertyResponseDto.fromEntity(property);

        assertThat(dto.getId()).isEqualTo(42L);
        assertThat(dto.getName()).isEqualTo("Modern Villa");
        assertThat(dto.getPrice()).isEqualByComparingTo(new BigDecimal("750000.00"));
        assertThat(dto.getPrimaryImagePath()).isEqualTo("uploads/img1.webp");
        assertThat(dto.getImages()).hasSize(1);
    }

    @Test
    @DisplayName("UserResponseDto should never expose password hashes")
    void userResponseDtoShouldNeverExposePasswordHash() {
        User user = new User("admin@haven.com", "$2a$12$e8w.SecretHashedPasswordNeverExposeToClient", "Admin User", Role.ADMIN);
        user.setId(1L);

        UserResponseDto dto = UserResponseDto.fromEntity(user);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getEmail()).isEqualTo("admin@haven.com");
        assertThat(dto.getRole()).isEqualTo(Role.ADMIN);
        // Ensure no method exists to get password from DTO
        assertThat(dto.getClass().getDeclaredMethods())
                .noneMatch(m -> m.getName().toLowerCase().contains("password"));
    }
}
