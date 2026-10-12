package com.property.management.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.admin")
public class AdminProperties {

    private String initialEmail;
    private String initialPassword;

    public String getInitialEmail() {
        return initialEmail;
    }

    public void setInitialEmail(String initialEmail) {
        this.initialEmail = initialEmail;
    }

    public String getInitialPassword() {
        return initialPassword;
    }

    public void setInitialPassword(String initialPassword) {
        this.initialPassword = initialPassword;
    }
}
