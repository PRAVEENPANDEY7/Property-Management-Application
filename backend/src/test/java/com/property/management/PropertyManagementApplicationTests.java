package com.property.management;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class PropertyManagementApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring ApplicationContext boots successfully with configured properties
    }
}
