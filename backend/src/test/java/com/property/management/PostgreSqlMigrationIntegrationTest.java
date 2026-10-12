package com.property.management;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.output.MigrateResult;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.sql.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PostgreSqlMigrationIntegrationTest {

    private static final String DB_URL = "jdbc:postgresql://localhost:5432/propertymanagement_test";
    private static final String DB_USER = "postgres";
    private static final String DB_PASS = "762446388138";

    @Test
    @DisplayName("Verify Flyway V1 migration and schema constraints against real PostgreSQL 18 database")
    void shouldExecuteFlywayMigrationAndEnforceConstraintsOnPostgreSql() throws Exception {
        // 1. Connect to PostgreSQL and reset test schema cleanly
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
             Statement stmt = conn.createStatement()) {
            stmt.execute("DROP TABLE IF EXISTS property_inquiries, property_images, properties, users, flyway_schema_history CASCADE;");
        }

        // 2. Run Flyway migration
        Flyway flyway = Flyway.configure()
                .dataSource(DB_URL, DB_USER, DB_PASS)
                .locations("classpath:db/migration")
                .cleanDisabled(false)
                .baselineOnMigrate(true)
                .load();

        MigrateResult result = flyway.migrate();
        assertThat(result.success).isTrue();
        assertThat(result.migrationsExecuted).isGreaterThanOrEqualTo(1);

        // 3. Test data persistence and constraints directly on PostgreSQL
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS)) {

            // Test 3a: Insert User and verify email uniqueness on PostgreSQL
            try (PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?) RETURNING id")) {
                ps.setString(1, "pgadmin@test.com");
                ps.setString(2, "hashed_secret");
                ps.setString(3, "Postgres Admin");
                ps.setString(4, "ADMIN");
                ResultSet rs = ps.executeQuery();
                assertThat(rs.next()).isTrue();
                long userId = rs.getLong("id");
                assertThat(userId).isPositive();
            }

            // Test 3b: Unique constraint rejection on PostgreSQL
            try (PreparedStatement psDuplicate = conn.prepareStatement(
                    "INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)")) {
                psDuplicate.setString(1, "pgadmin@test.com");
                psDuplicate.setString(2, "different_hash");
                psDuplicate.setString(3, "Duplicate User");
                psDuplicate.setString(4, "USER");
                assertThatThrownBy(psDuplicate::executeUpdate)
                        .isInstanceOf(SQLException.class)
                        .hasMessageContaining("uq_users_email");
            }

            // Test 3c: Insert Property with NUMERIC(12, 2) price
            long propertyId;
            try (PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO properties (name, description, price, location, city) VALUES (?, ?, ?, ?, ?) RETURNING id")) {
                ps.setString(1, "Postgres Luxury Estate");
                ps.setString(2, "High-end villa verified against PostgreSQL 18");
                ps.setBigDecimal(3, new BigDecimal("1850000.50"));
                ps.setString(4, "100 Ocean Drive");
                ps.setString(5, "Miami");
                ResultSet rs = ps.executeQuery();
                assertThat(rs.next()).isTrue();
                propertyId = rs.getLong("id");
                assertThat(propertyId).isPositive();
            }

            // Test 3d: Insert PropertyImage and verify CASCADE deletion
            long imageId;
            try (PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO property_images (property_id, file_path, file_name, content_type, file_size, is_primary, display_order) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id")) {
                ps.setLong(1, propertyId);
                ps.setString(2, "uploads/properties/pg_img1.webp");
                ps.setString(3, "pg_img1.webp");
                ps.setString(4, "image/webp");
                ps.setLong(5, 102400L);
                ps.setBoolean(6, true);
                ps.setInt(7, 1);
                ResultSet rs = ps.executeQuery();
                assertThat(rs.next()).isTrue();
                imageId = rs.getLong("id");
                assertThat(imageId).isPositive();
            }

            // Test 3e: Delete property and verify foreign key ON DELETE CASCADE deleted the image in PostgreSQL
            try (PreparedStatement psDelete = conn.prepareStatement("DELETE FROM properties WHERE id = ?")) {
                psDelete.setLong(1, propertyId);
                int rows = psDelete.executeUpdate();
                assertThat(rows).isEqualTo(1);
            }

            try (PreparedStatement psCheck = conn.prepareStatement("SELECT COUNT(*) FROM property_images WHERE id = ?")) {
                psCheck.setLong(1, imageId);
                ResultSet rs = psCheck.executeQuery();
                assertThat(rs.next()).isTrue();
                assertThat(rs.getInt(1)).isZero();
            }
        }
    }
}
