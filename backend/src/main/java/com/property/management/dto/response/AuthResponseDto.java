package com.property.management.dto.response;

public class AuthResponseDto {

    private String token;
    private String tokenType = "Bearer";
    private long expiresIn;
    private UserResponseDto user;

    public AuthResponseDto() {
    }

    public AuthResponseDto(String token, String tokenType, long expiresIn, UserResponseDto user) {
        this.token = token;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.expiresIn = expiresIn;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public UserResponseDto getUser() {
        return user;
    }

    public void setUser(UserResponseDto user) {
        this.user = user;
    }
}
