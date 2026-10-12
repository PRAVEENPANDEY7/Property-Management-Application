package com.property.management.service;

import com.property.management.config.StorageProperties;
import com.property.management.exception.BadRequestException;
import com.property.management.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class FileStorageServiceTest {

    @TempDir
    Path tempDir;

    private FileStorageService fileStorageService;

    // Valid 12-byte JPEG header: FF D8 FF E0 00 10 4A 46 49 46 00 01
    private static final byte[] VALID_JPEG_BYTES = new byte[]{
            (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0,
            0x00, 0x10, (byte) 'J', (byte) 'F', (byte) 'I', (byte) 'F', 0x00, 0x01
    };

    // Valid 12-byte PNG header: 89 50 4E 47 0D 0A 1A 0A 00 00 00 0D
    private static final byte[] VALID_PNG_BYTES = new byte[]{
            (byte) 0x89, (byte) 0x50, (byte) 0x4E, (byte) 0x47,
            0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D
    };

    @BeforeEach
    void setUp() {
        StorageProperties properties = new StorageProperties();
        properties.setLocation(tempDir.toString());
        properties.setMaxFileSize(1024 * 1024); // 1 MB limit

        fileStorageService = new FileStorageService(properties);
        fileStorageService.init();
    }

    @Test
    @DisplayName("Should successfully store valid JPEG image and retrieve as readable resource")
    void shouldStoreValidImageAndLoadResource() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "image", "villa.jpg", "image/jpeg", VALID_JPEG_BYTES
        );

        FileStorageService.StoredFileInfo info = fileStorageService.storeFile(file);

        assertThat(info.fileName()).endsWith(".jpg");
        assertThat(info.relativePath()).contains("uploads/properties/");
        assertThat(info.contentType()).isEqualTo("image/jpeg");

        // Verify resource retrieval
        Resource resource = fileStorageService.loadFileAsResource(info.fileName());
        assertThat(resource.exists()).isTrue();
        assertThat(resource.contentLength()).isEqualTo(VALID_JPEG_BYTES.length);
    }

    @Test
    @DisplayName("Should reject file when content type does not match magic bytes")
    void shouldRejectSpoofedImageFile() {
        // Disguised HTML text as JPEG
        byte[] fakeBytes = "<html><script>alert(1)</script></html>".getBytes();
        MockMultipartFile fakeFile = new MockMultipartFile(
                "image", "fake.jpg", "image/jpeg", fakeBytes
        );

        assertThatThrownBy(() -> fileStorageService.storeFile(fakeFile))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("File content does not match a valid image format");
    }

    @Test
    @DisplayName("Should reject disallowed MIME types like PDF")
    void shouldRejectDisallowedMimeType() {
        MockMultipartFile pdfFile = new MockMultipartFile(
                "doc", "contract.pdf", "application/pdf", new byte[]{1, 2, 3, 4}
        );

        assertThatThrownBy(() -> fileStorageService.storeFile(pdfFile))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Invalid file type");
    }

    @Test
    @DisplayName("Should reject path traversal attempts in filename")
    void shouldRejectPathTraversalInFilename() {
        MockMultipartFile malicious = new MockMultipartFile(
                "image", "../../etc/passwd", "image/jpeg", VALID_JPEG_BYTES
        );

        assertThatThrownBy(() -> fileStorageService.storeFile(malicious))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("path traversal");
    }

    @Test
    @DisplayName("Should reject files exceeding configured maximum file size")
    void shouldRejectOversizedFiles() {
        byte[] oversizedBytes = new byte[2 * 1024 * 1024]; // 2 MB
        System.arraycopy(VALID_PNG_BYTES, 0, oversizedBytes, 0, VALID_PNG_BYTES.length);

        MockMultipartFile largeFile = new MockMultipartFile(
                "image", "huge.png", "image/png", oversizedBytes
        );

        assertThatThrownBy(() -> fileStorageService.storeFile(largeFile))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("exceeds maximum allowed limit");
    }

    @Test
    @DisplayName("Should delete physical file from disk safely and ignore missing files")
    void shouldDeleteFileSafely() {
        MockMultipartFile file = new MockMultipartFile(
                "image", "delete_me.png", "image/png", VALID_PNG_BYTES
        );
        FileStorageService.StoredFileInfo info = fileStorageService.storeFile(file);

        Path physicalFile = tempDir.resolve(info.fileName());
        assertThat(Files.exists(physicalFile)).isTrue();

        fileStorageService.deleteFile(info.fileName());
        assertThat(Files.exists(physicalFile)).isFalse();

        // Safe idempotent delete on already deleted file
        fileStorageService.deleteFile(info.fileName());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when requesting non-existent image")
    void shouldThrowWhenResourceNotFound() {
        assertThatThrownBy(() -> fileStorageService.loadFileAsResource("non-existent-uuid.jpg"))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
