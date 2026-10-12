package com.property.management.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    /**
     * Base64-encoded or raw HS256/HS384/HS512 secret key.
     * Minimum 256 bits (32 bytes). Must be set via JWT_SECRET env var.
     */
    private String secret;

    /**
     * Expiration time in milliseconds (e.g. 86400000 = 24 hours).
     */
    private long expirationMs = 86400000L;

    /**
     * Token issuer claim.
     */
    private String issuer = "property-management-api";

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    public void setExpirationMs(long expirationMs) {
        this.expirationMs = expirationMs;
    }

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }
}
