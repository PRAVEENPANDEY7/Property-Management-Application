package com.property.management.service;

import com.property.management.dto.request.ChangePasswordRequestDto;
import com.property.management.dto.request.LoginRequestDto;
import com.property.management.dto.request.UpdateProfileRequestDto;
import com.property.management.dto.request.UserRegisterRequestDto;
import com.property.management.dto.response.AuthResponseDto;
import com.property.management.dto.response.UserResponseDto;
import com.property.management.entity.Role;
import com.property.management.entity.User;
import com.property.management.exception.DuplicateResourceException;
import com.property.management.exception.ResourceNotFoundException;
import com.property.management.repository.UserRepository;
import com.property.management.security.JwtTokenProvider;
import com.property.management.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public UserResponseDto register(UserRegisterRequestDto request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new DuplicateResourceException("User", "email", normalizedEmail);
        }

        // Public registrations are strictly assigned Role.USER
        User user = new User(
                normalizedEmail,
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                Role.USER
        );

        User savedUser = userRepository.save(user);
        return UserResponseDto.fromEntity(savedUser);
    }

    @Transactional(readOnly = true)
    public AuthResponseDto login(LoginRequestDto request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
            );

            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

            String token = tokenProvider.generateToken(principal.getId(), principal.getEmail(), principal.getRole());

            UserResponseDto userDto = new UserResponseDto(
                    principal.getId(),
                    principal.getEmail(),
                    principal.getFullName(),
                    principal.getRole(),
                    principal.getCreatedAt()
            );

            return new AuthResponseDto(
                    token,
                    "Bearer",
                    tokenProvider.getExpirationMs(),
                    userDto
            );
        } catch (BadCredentialsException ex) {
            // Never reveal whether an email exists or not
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    @Transactional(readOnly = true)
    public UserResponseDto getCurrentUser(UserPrincipal principal) {
        if (principal == null) {
            throw new BadCredentialsException("User is not authenticated");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        return UserResponseDto.fromEntity(user);
    }

    @Transactional
    public UserResponseDto updateProfile(UserPrincipal principal, UpdateProfileRequestDto request) {
        if (principal == null) {
            throw new BadCredentialsException("User is not authenticated");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        user.setFullName(request.getFullName().trim());
        User updated = userRepository.save(user);
        return UserResponseDto.fromEntity(updated);
    }

    @Transactional
    public UserResponseDto changePassword(UserPrincipal principal, ChangePasswordRequestDto request) {
        if (principal == null) {
            throw new BadCredentialsException("User is not authenticated");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        User updated = userRepository.save(user);
        return UserResponseDto.fromEntity(updated);
    }
}
