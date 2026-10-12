package com.property.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.property.management.entity.Property;
import com.property.management.entity.PropertyImage;
import com.property.management.entity.Role;
import com.property.management.entity.User;
import com.property.management.repository.PropertyImageRepository;
import com.property.management.repository.PropertyInquiryRepository;
import com.property.management.repository.PropertyRepository;
import com.property.management.repository.UserRepository;
import com.property.management.security.JwtTokenProvider;
import com.property.management.service.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PropertyIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyImageRepository propertyImageRepository;

    @Autowired
    private PropertyInquiryRepository propertyInquiryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ObjectMapper objectMapper;

    private String userToken;
    private String adminToken;

    private static final byte[] VALID_JPEG = new byte[]{
            (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0,
            0x00, 0x10, (byte) 'J', (byte) 'F', (byte) 'I', (byte) 'F', 0x00, 0x01
    };

    @BeforeEach
    void setUp() {
        propertyInquiryRepository.deleteAll();
        propertyRepository.deleteAll();

        User user = userRepository.findByEmailIgnoreCase("propuser@example.com")
                .orElseGet(() -> userRepository.save(new User(
                        "propuser@example.com",
                        passwordEncoder.encode("Password123!"),
                        "Property User",
                        Role.USER
                )));
        userToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        User admin = userRepository.findByEmailIgnoreCase("propadmin@example.com")
                .orElseGet(() -> userRepository.save(new User(
                        "propadmin@example.com",
                        passwordEncoder.encode("Password123!"),
                        "Property Admin",
                        Role.ADMIN
                )));
        adminToken = jwtTokenProvider.generateToken(admin.getId(), admin.getEmail(), admin.getRole());
    }

    @Test
    @DisplayName("Public user can browse properties with pagination, sorting, and metadata")
    void publicUserCanBrowsePropertiesWithPagination() throws Exception {
        propertyRepository.save(new Property("Austin Villa", "Hill country villa", new BigDecimal("750000.00"), "100 Trail", "Austin"));
        propertyRepository.save(new Property("Austin Condo", "Downtown high rise", new BigDecimal("450000.00"), "200 Congress", "Austin"));
        propertyRepository.save(new Property("Denver Cabin", "Mountain getaway", new BigDecimal("600000.00"), "50 Peak Rd", "Denver"));

        mockMvc.perform(get("/api/properties")
                        .param("page", "0")
                        .param("size", "2")
                        .param("sortBy", "price")
                        .param("sortDir", "desc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.pageNumber", is(0)))
                .andExpect(jsonPath("$.data.pageSize", is(2)))
                .andExpect(jsonPath("$.data.totalElements", is(3)))
                .andExpect(jsonPath("$.data.totalPages", is(2)))
                .andExpect(jsonPath("$.data.first", is(true)))
                .andExpect(jsonPath("$.data.last", is(false)))
                .andExpect(jsonPath("$.data.content", hasSize(2)))
                .andExpect(jsonPath("$.data.content[0].name", is("Austin Villa")));
    }

    @Test
    @DisplayName("Public user can filter properties by city case-insensitively")
    void publicUserCanFilterByCityCaseInsensitive() throws Exception {
        propertyRepository.save(new Property("Austin Villa", "Hill country villa", new BigDecimal("750000.00"), "100 Trail", "Austin"));
        propertyRepository.save(new Property("Denver Cabin", "Mountain getaway", new BigDecimal("600000.00"), "50 Peak Rd", "Denver"));

        mockMvc.perform(get("/api/properties").param("city", "austin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalElements", is(1)))
                .andExpect(jsonPath("$.data.content[0].city", is("Austin")));

        mockMvc.perform(get("/api/properties").param("city", "Seattle"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalElements", is(0)))
                .andExpect(jsonPath("$.data.empty", is(true)));
    }

    @Test
    @DisplayName("Public user can retrieve property detail by ID, or receive 404 when not found")
    void publicUserCanGetPropertyDetail() throws Exception {
        Property property = propertyRepository.save(new Property(
                "Modern Penthouse", "Panoramic views", new BigDecimal("990000.00"), "777 5th Ave", "New York"
        ));

        mockMvc.perform(get("/api/properties/" + property.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is(property.getId().intValue())))
                .andExpect(jsonPath("$.data.name", is("Modern Penthouse")));

        mockMvc.perform(get("/api/properties/999999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.message", containsString("not found")));
    }

    @Test
    @DisplayName("ADMIN can create a property with multiple image uploads")
    void adminCanCreatePropertyWithImages() throws Exception {
        MockMultipartFile image1 = new MockMultipartFile(
                "images", "house1.jpg", "image/jpeg", VALID_JPEG
        );
        MockMultipartFile image2 = new MockMultipartFile(
                "images", "house2.jpg", "image/jpeg", VALID_JPEG
        );

        mockMvc.perform(multipart("/api/admin/properties")
                        .file(image1)
                        .file(image2)
                        .param("name", "Lakeside Retreat")
                        .param("description", "Serene waterfront home with private dock.")
                        .param("price", "850000.00")
                        .param("location", "12 Waterway Blvd")
                        .param("city", "Orlando")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.name", is("Lakeside Retreat")))
                .andExpect(jsonPath("$.data.price", is(850000.00)))
                .andExpect(jsonPath("$.data.images", hasSize(2)))
                .andExpect(jsonPath("$.data.images[0].isPrimary", is(true)))
                .andExpect(jsonPath("$.data.primaryImagePath", notNullValue()));

        Property saved = propertyRepository.findAll().stream()
                .filter(p -> p.getName().equals("Lakeside Retreat"))
                .findFirst()
                .orElseThrow();

        Property savedWithImages = propertyRepository.findByIdWithImages(saved.getId()).orElseThrow();
        assertThat(savedWithImages.getImages()).hasSize(2);

        // Verify image streaming endpoint serves the uploaded file
        String filename = savedWithImages.getImages().get(0).getFileName();
        mockMvc.perform(get("/api/properties/images/" + filename))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_JPEG));
    }

    @Test
    @DisplayName("Normal USER receives 403 Forbidden when attempting to create a property")
    void normalUserCannotCreateProperty() throws Exception {
        mockMvc.perform(multipart("/api/admin/properties")
                        .param("name", "Unauthorized Property")
                        .param("description", "Should not be created")
                        .param("price", "500000.00")
                        .param("location", "Illegal Ln")
                        .param("city", "Nowhere")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is(403)));
    }

    @Test
    @DisplayName("Unauthenticated request to admin property API receives 401 Unauthorized")
    void unauthenticatedRequestReceives401() throws Exception {
        mockMvc.perform(multipart("/api/admin/properties")
                        .param("name", "No Token")
                        .param("description", "Should fail auth")
                        .param("price", "500000.00")
                        .param("location", "Secret Ln")
                        .param("city", "Nowhere"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }

    @Test
    @DisplayName("ADMIN can update property details, retain selected images, and delete removed image files")
    void adminCanUpdatePropertyAndRetainOrRemoveImages() throws Exception {
        // First create property with an image
        MockMultipartFile file1 = new MockMultipartFile("images", "img1.jpg", "image/jpeg", VALID_JPEG);
        MockMultipartFile file2 = new MockMultipartFile("images", "img2.jpg", "image/jpeg", VALID_JPEG);

        mockMvc.perform(multipart("/api/admin/properties")
                        .file(file1)
                        .file(file2)
                        .param("name", "Original Name")
                        .param("description", "Original Description with enough length")
                        .param("price", "400000.00")
                        .param("location", "100 Main St")
                        .param("city", "Phoenix")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isCreated());

        Property original = propertyRepository.findAll().stream()
                .filter(p -> p.getName().equals("Original Name"))
                .findFirst()
                .orElseThrow();

        Property originalWithImages = propertyRepository.findByIdWithImages(original.getId()).orElseThrow();
        Long keepImageId = originalWithImages.getImages().get(0).getId();
        Long removeImageId = originalWithImages.getImages().get(1).getId();
        String removedFileName = originalWithImages.getImages().get(1).getFileName();
        Path removedFilePath = fileStorageService.getRootStorageLocation().resolve(removedFileName);

        assertThat(Files.exists(removedFilePath)).isTrue();

        // Update: Keep only image 1, remove image 2, upload new image 3
        MockMultipartFile file3 = new MockMultipartFile("newImages", "img3.jpg", "image/jpeg", VALID_JPEG);

        mockMvc.perform(multipart(HttpMethod.PUT, "/api/admin/properties/" + original.getId())
                        .file(file3)
                        .param("name", "Updated Name")
                        .param("description", "Updated Description with enough length")
                        .param("price", "450000.00")
                        .param("location", "100 Main St")
                        .param("city", "Phoenix")
                        .param("keepImageIds", String.valueOf(keepImageId))
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name", is("Updated Name")))
                .andExpect(jsonPath("$.data.price", is(450000.00)))
                .andExpect(jsonPath("$.data.images", hasSize(2)));

        // Verify the removed image file was physically deleted from disk
        assertThat(Files.exists(removedFilePath)).isFalse();
    }

    @Test
    @DisplayName("ADMIN can delete property and all associated physical files are deleted from disk")
    void adminCanDeletePropertyAndCleanUpFiles() throws Exception {
        MockMultipartFile file = new MockMultipartFile("images", "delete_test.jpg", "image/jpeg", VALID_JPEG);

        mockMvc.perform(multipart("/api/admin/properties")
                        .file(file)
                        .param("name", "Delete Me House")
                        .param("description", "House to be deleted with images")
                        .param("price", "300000.00")
                        .param("location", "123 Bye St")
                        .param("city", "Dallas")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isCreated());

        Property saved = propertyRepository.findAll().stream()
                .filter(p -> p.getName().equals("Delete Me House"))
                .findFirst()
                .orElseThrow();

        Property savedWithImages = propertyRepository.findByIdWithImages(saved.getId()).orElseThrow();
        String imageFileName = savedWithImages.getImages().get(0).getFileName();
        Path imagePath = fileStorageService.getRootStorageLocation().resolve(imageFileName);
        assertThat(Files.exists(imagePath)).isTrue();

        // Delete property
        mockMvc.perform(delete("/api/admin/properties/" + saved.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        // Verify property is gone from DB
        assertThat(propertyRepository.findById(saved.getId())).isEmpty();

        // Verify physical file is deleted from disk
        assertThat(Files.exists(imagePath)).isFalse();
    }

    @Test
    @DisplayName("Validation fails when creating property with invalid inputs")
    void validationFailsOnInvalidPropertyInput() throws Exception {
        mockMvc.perform(multipart("/api/admin/properties")
                        .param("name", "") // Blank name
                        .param("description", "Too short")
                        .param("price", "-100.00") // Negative price
                        .param("location", "")
                        .param("city", "")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)));
    }
}
