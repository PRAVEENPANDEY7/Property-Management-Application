package com.property.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.property.management.dto.request.InquiryRequestDto;
import com.property.management.entity.Property;
import com.property.management.entity.Role;
import com.property.management.entity.User;
import com.property.management.repository.PropertyInquiryRepository;
import com.property.management.repository.PropertyRepository;
import com.property.management.repository.UserRepository;
import com.property.management.security.JwtTokenProvider;
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

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class InquiryIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyInquiryRepository inquiryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private Property testProperty;
    private String adminToken;

    @BeforeEach
    void setUp() {
        inquiryRepository.deleteAll();
        propertyRepository.deleteAll();
        userRepository.deleteAll();

        Property property = new Property(
                "Inquiry Test Villa",
                "Luxury villa for testing lead inquiry submission and admin management.",
                new BigDecimal("950000.00"),
                "123 Ocean Lane",
                "Miami"
        );
        testProperty = propertyRepository.save(property);

        User admin = new User("inquiryadmin@example.com", passwordEncoder.encode("Secret123!"), "Admin", Role.ADMIN);
        User savedAdmin = userRepository.save(admin);
        adminToken = jwtTokenProvider.generateToken(savedAdmin.getId(), savedAdmin.getEmail(), savedAdmin.getRole());
    }

    @Test
    @DisplayName("Public user can submit an inquiry and it is stored in database with NEW status")
    void publicUserCanSubmitInquiry() throws Exception {
        InquiryRequestDto request = new InquiryRequestDto(
                "Jane Doe",
                "janedoe@example.com",
                "+1 (555) 123-4567",
                "I would like to schedule a private viewing for this villa."
        );

        mockMvc.perform(post("/api/properties/" + testProperty.getId() + "/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.name", is("Jane Doe")))
                .andExpect(jsonPath("$.data.email", is("janedoe@example.com")))
                .andExpect(jsonPath("$.data.phone", is("+1 (555) 123-4567")))
                .andExpect(jsonPath("$.data.status", is("NEW")))
                .andExpect(jsonPath("$.data.propertyId", is(testProperty.getId().intValue())));
    }

    @Test
    @DisplayName("Admin can view paginated inquiries and update status")
    void adminCanViewAndUpdateInquiries() throws Exception {
        InquiryRequestDto request = new InquiryRequestDto(
                "Alex Smith",
                "alex@example.com",
                "+1 (555) 987-6543",
                "Looking to purchase."
        );

        mockMvc.perform(post("/api/properties/" + testProperty.getId() + "/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        Long inquiryId = inquiryRepository.findAll().get(0).getId();

        // Admin lists inquiries
        mockMvc.perform(get("/api/admin/inquiries")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(1)))
                .andExpect(jsonPath("$.data.content[0].name", is("Alex Smith")));

        // Admin updates status to CONTACTED
        mockMvc.perform(patch("/api/admin/inquiries/" + inquiryId + "/status")
                        .param("status", "CONTACTED")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status", is("CONTACTED")));
    }
}
