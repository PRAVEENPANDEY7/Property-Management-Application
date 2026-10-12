package com.property.management.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "app.storage")
public class StorageProperties {

    /**
     * Directory path where property images are stored persistently.
     */
    private String location = "uploads/properties";

    /**
     * Maximum allowed file size in bytes (e.g. 5MB = 5242880).
     */
    private long maxFileSize = 5 * 1024 * 1024;

    /**
     * Allowed MIME types for uploaded property images.
     */
    private List<String> allowedMimeTypes = List.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public long getMaxFileSize() {
        return maxFileSize;
    }

    public void setMaxFileSize(long maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    public List<String> getAllowedMimeTypes() {
        return allowedMimeTypes;
    }

    public void setAllowedMimeTypes(List<String> allowedMimeTypes) {
        this.allowedMimeTypes = allowedMimeTypes;
    }
}
