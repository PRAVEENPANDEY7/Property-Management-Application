package com.property.management.config;

import com.property.management.entity.Role;
import com.property.management.entity.User;
import com.property.management.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Component
public class AdminBootstrapRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapRunner.class);
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    private final AdminProperties adminProperties;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminBootstrapRunner(AdminProperties adminProperties,
                                UserRepository userRepository,
                                PasswordEncoder passwordEncoder) {
        this.adminProperties = adminProperties;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        String email = adminProperties.getInitialEmail();
        String password = adminProperties.getInitialPassword();

        boolean hasEmail = email != null && !email.isBlank();
        boolean hasPassword = password != null && !password.isBlank();

        // If either is not configured, skip bootstrap cleanly without crashing the server
        if (!hasEmail || !hasPassword) {
            log.info("Administrator bootstrap credentials not fully configured (email: {}, password: {}); skipping bootstrap.",
                    hasEmail ? "configured" : "missing",
                    hasPassword ? "configured" : "missing");
            return;
        }

        String normalizedEmail = email.trim().toLowerCase();

        if (!EMAIL_PATTERN.matcher(normalizedEmail).matches()) {
            log.warn("INITIAL_ADMIN_EMAIL is not a valid email address: '{}'. Skipping bootstrap.", normalizedEmail);
            return;
        }

        if (password.length() < 8) {
            log.warn("INITIAL_ADMIN_PASSWORD must be at least 8 characters long. Skipping bootstrap.");
            return;
        }

        // Check if an administrator already exists in the system
        boolean adminExists = userRepository.findByRole(Role.ADMIN, Pageable.ofSize(1)).hasContent();
        if (adminExists) {
            log.info("Administrator account already exists in database; bootstrap skipped to preserve existing credentials.");
            return;
        }

        // Check if a non-admin user already has this email to prevent silent privilege escalation
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            log.warn("User with email '{}' already exists with ordinary role. Silently promoting existing users is prohibited. Bootstrap skipped.", normalizedEmail);
            return;
        }

        // Create bootstrap administrator
        User admin = new User(
                normalizedEmail,
                passwordEncoder.encode(password),
                "System Administrator",
                Role.ADMIN
        );

        userRepository.save(admin);
        log.info("Initial administrator successfully bootstrapped with email: '{}'.", normalizedEmail);
    }
}
