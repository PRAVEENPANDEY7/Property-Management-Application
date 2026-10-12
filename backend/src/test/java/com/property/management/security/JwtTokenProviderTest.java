package com.property.management.security;

import com.property.management.config.JwtProperties;
import com.property.management.entity.Role;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtTokenProviderTest {

    private static final String TEST_SECRET = "aVerySecureAndLongSecretKeyForTestingJwtTokenGenerationAndValidation123!";
    private JwtProperties jwtProperties;
    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        jwtProperties = new JwtProperties();
        jwtProperties.setSecret(TEST_SECRET);
        jwtProperties.setExpirationMs(3600000L); // 1 hour
        jwtProperties.setIssuer("property-management-api");

        tokenProvider = new JwtTokenProvider(jwtProperties);
        tokenProvider.init();
    }

    @Test
    @DisplayName("Should generate valid JWT token with claims and parse accurately")
    void shouldGenerateAndValidateToken() {
        String token = tokenProvider.generateToken(42L, "user@example.com", Role.USER);

        assertThat(token).isNotBlank();
        assertThat(tokenProvider.validateToken(token)).isTrue();
        assertThat(tokenProvider.getEmailFromToken(token)).isEqualTo("user@example.com");
        assertThat(tokenProvider.getUserIdFromToken(token)).isEqualTo(42L);
        assertThat(tokenProvider.getRoleFromToken(token)).isEqualTo("ROLE_USER");
    }

    @Test
    @DisplayName("Should reject token signed with an invalid or different secret key")
    void shouldRejectTokenWithInvalidSignature() {
        SecretKey untrustedKey = Keys.hmacShaKeyFor(
                "anUntrustedKeyDifferentFromConfiguredKeyThatShouldFailVerification!".getBytes(StandardCharsets.UTF_8)
        );

        String untrustedToken = Jwts.builder()
                .subject("hacker@example.com")
                .issuer("property-management-api")
                .claim("userId", 999L)
                .claim("role", "ROLE_ADMIN")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000L))
                .signWith(untrustedKey)
                .compact();

        assertThat(tokenProvider.validateToken(untrustedToken)).isFalse();
    }

    @Test
    @DisplayName("Should reject expired token")
    void shouldRejectExpiredToken() {
        SecretKey key = Keys.hmacShaKeyFor(TEST_SECRET.getBytes(StandardCharsets.UTF_8));
        Date past = new Date(System.currentTimeMillis() - 10000L);

        String expiredToken = Jwts.builder()
                .subject("expired@example.com")
                .issuer("property-management-api")
                .claim("userId", 10L)
                .claim("role", "ROLE_USER")
                .issuedAt(new Date(past.getTime() - 100000L))
                .expiration(past)
                .signWith(key)
                .compact();

        assertThat(tokenProvider.validateToken(expiredToken)).isFalse();
    }

    @Test
    @DisplayName("Should reject malformed or blank token")
    void shouldRejectMalformedToken() {
        assertThat(tokenProvider.validateToken("not-a-valid-jwt-token")).isFalse();
        assertThat(tokenProvider.validateToken("")).isFalse();
        assertThat(tokenProvider.validateToken(null)).isFalse();
    }

    @Test
    @DisplayName("Should derive secure 256-bit key if secret is shorter than 32 bytes and reject missing secret")
    void shouldHandleShortSecretAndRejectMissing() {
        JwtProperties shortProps = new JwtProperties();
        shortProps.setSecret("short_secret_under_32");
        shortProps.setExpirationMs(3600000L);

        JwtTokenProvider shortProvider = new JwtTokenProvider(shortProps);
        shortProvider.init();

        String token = shortProvider.generateToken(1L, "test@example.com", Role.USER);
        assertThat(token).isNotBlank();
        assertThat(shortProvider.validateToken(token)).isTrue();
        assertThat(shortProvider.getEmailFromToken(token)).isEqualTo("test@example.com");

        JwtProperties nullProps = new JwtProperties();
        nullProps.setSecret(null);
        JwtTokenProvider nullProvider = new JwtTokenProvider(nullProps);
        assertThatThrownBy(nullProvider::init)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not configured");
    }
}
