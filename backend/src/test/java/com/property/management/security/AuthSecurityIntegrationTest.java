package com.property.management.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.property.management.dto.request.LoginRequestDto;
import com.property.management.dto.request.UserRegisterRequestDto;
import com.property.management.entity.Role;
import com.property.management.entity.User;
import com.property.management.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // Keep bootstrap admin if present, but clean test users
        userRepository.findByEmailIgnoreCase("testuser@example.com")
                .ifPresent(userRepository::delete);
        userRepository.findByEmailIgnoreCase("alice@example.com")
                .ifPresent(userRepository::delete);
        userRepository.findByEmailIgnoreCase("bob@example.com")
                .ifPresent(userRepository::delete);
    }

    @Test
    @DisplayName("Should successfully register a new user with USER role and BCrypt password hash")
    void shouldRegisterUserSuccessfully() throws Exception {
        UserRegisterRequestDto request = new UserRegisterRequestDto(
                "alice@example.com",
                "Password123!",
                "Alice Smith"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.email", is("alice@example.com")))
                .andExpect(jsonPath("$.data.fullName", is("Alice Smith")))
                .andExpect(jsonPath("$.data.role", is("USER")))
                .andExpect(jsonPath("$.data.password").doesNotExist())
                .andExpect(jsonPath("$.data.passwordHash").doesNotExist());

        // Verify password in database is hashed with BCrypt
        User persisted = userRepository.findByEmailIgnoreCase("alice@example.com").orElseThrow();
        assertThat(persisted.getPasswordHash()).startsWith("$2a$10$");
        assertThat(passwordEncoder.matches("Password123!", persisted.getPasswordHash())).isTrue();
    }

    @Test
    @DisplayName("Should reject duplicate email registration with 409 Conflict")
    void shouldRejectDuplicateEmail() throws Exception {
        UserRegisterRequestDto request = new UserRegisterRequestDto(
                "alice@example.com",
                "Password123!",
                "Alice Smith"
        );

        // First registration
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Second registration with same email
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.message", containsString("already exists")));
    }

    @Test
    @DisplayName("Public registration must strictly assign USER role and ignore client role override")
    void shouldIgnoreClientRoleAndAssignUserRole() throws Exception {
        String payloadWithAdminAttempt = "{" +
                "\"email\":\"bob@example.com\"," +
                "\"password\":\"Password123!\"," +
                "\"fullName\":\"Bob Attempted Admin\"," +
                "\"role\":\"ADMIN\"" +
                "}";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payloadWithAdminAttempt))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.role", is("USER")));

        User bob = userRepository.findByEmailIgnoreCase("bob@example.com").orElseThrow();
        assertThat(bob.getRole()).isEqualTo(Role.USER);
    }

    @Test
    @DisplayName("Should login successfully with valid credentials and return signed JWT and user info")
    void shouldLoginSuccessfully() throws Exception {
        // Register user
        User user = new User("alice@example.com", passwordEncoder.encode("Password123!"), "Alice Smith", Role.USER);
        userRepository.save(user);

        LoginRequestDto loginRequest = new LoginRequestDto("alice@example.com", "Password123!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.data.expiresIn", is(3600000)))
                .andExpect(jsonPath("$.data.user.email", is("alice@example.com")))
                .andExpect(jsonPath("$.data.user.role", is("USER")))
                .andExpect(jsonPath("$.data.user.password").doesNotExist());
    }

    @Test
    @DisplayName("Should return 401 Unauthorized for invalid login credentials")
    void shouldRejectInvalidCredentials() throws Exception {
        User user = new User("alice@example.com", passwordEncoder.encode("Password123!"), "Alice Smith", Role.USER);
        userRepository.save(user);

        // Wrong password
        LoginRequestDto wrongPass = new LoginRequestDto("alice@example.com", "WrongPassword123!");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wrongPass)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)))
                .andExpect(jsonPath("$.message", is("Invalid email or password")));

        // Non-existent email
        LoginRequestDto wrongEmail = new LoginRequestDto("nonexistent@example.com", "Password123!");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wrongEmail)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)))
                .andExpect(jsonPath("$.message", is("Invalid email or password")));
    }

    @Test
    @DisplayName("Should allow authenticated user to access GET /api/auth/me and return profile")
    void shouldGetAuthenticatedUserProfile() throws Exception {
        User user = new User("alice@example.com", passwordEncoder.encode("Password123!"), "Alice Smith", Role.USER);
        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is(user.getId().intValue())))
                .andExpect(jsonPath("$.data.email", is("alice@example.com")))
                .andExpect(jsonPath("$.data.fullName", is("Alice Smith")))
                .andExpect(jsonPath("$.data.role", is("USER")));
    }

    @Test
    @DisplayName("Should return 401 when accessing GET /api/auth/me without token or with malformed token")
    void shouldRejectUnauthenticatedMe() throws Exception {
        // Missing token
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));

        // Malformed token
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer invalid.token.payload"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }

    @Test
    @DisplayName("Normal USER should receive 403 Forbidden when attempting to access ADMIN endpoint")
    void normalUserCannotAccessAdminEndpoint() throws Exception {
        User user = new User("alice@example.com", passwordEncoder.encode("Password123!"), "Alice Smith", Role.USER);
        user = userRepository.save(user);

        String userToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        mockMvc.perform(get("/api/admin/ping")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is(403)))
                .andExpect(jsonPath("$.message", containsString("Access is denied")));
    }

    @Test
    @DisplayName("ADMIN role should successfully access ADMIN endpoint")
    void adminCanAccessAdminEndpoint() throws Exception {
        User admin = new User("admin@haven.com", passwordEncoder.encode("AdminPass123!"), "Super Admin", Role.ADMIN);
        admin = userRepository.save(admin);

        String adminToken = jwtTokenProvider.generateToken(admin.getId(), admin.getEmail(), admin.getRole());

        mockMvc.perform(get("/api/admin/ping")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", is("Admin access granted")));
    }

    @Test
    @DisplayName("Should respond properly to CORS preflight requests from configured origin")
    void shouldHandleCorsPreflight() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().string("Access-Control-Allow-Credentials", "true"));
    }

    @Test
    @DisplayName("Authenticated user can update full name profile")
    void shouldUpdateUserProfileWhenAuthenticated() throws Exception {
        User user = new User("profileuser@haven.com", passwordEncoder.encode("SecretPassword123!"), "Original Name", Role.USER);
        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/auth/profile")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\": \"Updated Full Name\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.fullName", is("Updated Full Name")));

        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        assertThat(updatedUser.getFullName()).isEqualTo("Updated Full Name");
    }

    @Test
    @DisplayName("Authenticated user can change password with correct current password")
    void shouldChangePasswordWhenCurrentPasswordCorrect() throws Exception {
        User user = new User("pwduser@haven.com", passwordEncoder.encode("InitialPassword123!"), "Password Test User", Role.ADMIN);
        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/auth/change-password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPassword\": \"InitialPassword123!\", \"newPassword\": \"BrandNewSecurePassword123!\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        User reloaded = userRepository.findById(user.getId()).orElseThrow();
        assertThat(passwordEncoder.matches("BrandNewSecurePassword123!", reloaded.getPasswordHash())).isTrue();
    }

    @Test
    @DisplayName("Reject password change if current password is incorrect")
    void shouldRejectChangePasswordWhenCurrentPasswordIncorrect() throws Exception {
        User user = new User("badpwduser@haven.com", passwordEncoder.encode("RealPassword123!"), "User", Role.USER);
        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/auth/change-password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPassword\": \"WrongPassword123!\", \"newPassword\": \"BrandNewSecurePassword123!\"}"))
                .andExpect(status().isUnauthorized());
    }
}
