-- ==============================================================================
-- Flyway Migration V1: Initial Schema for Property Management Platform
-- Compatible with PostgreSQL 18+ and standard SQL-compliant engines
-- ==============================================================================

-- 1. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('USER', 'ADMIN'))
);

CREATE UNIQUE INDEX idx_users_email_lower ON users (LOWER(email));
CREATE INDEX idx_users_role ON users (role);

-- 2. Properties Table
CREATE TABLE properties (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_properties_price CHECK (price >= 0)
);

CREATE INDEX idx_properties_city ON properties (city);
CREATE INDEX idx_properties_city_lower ON properties (LOWER(city));
CREATE INDEX idx_properties_created_at ON properties (created_at DESC);
CREATE INDEX idx_properties_price ON properties (price);

-- 3. Property Images Table (Metadata only, binaries stored on persistent filesystem)
CREATE TABLE property_images (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_property_images_property
        FOREIGN KEY (property_id)
        REFERENCES properties (id)
        ON DELETE CASCADE,
    CONSTRAINT chk_property_images_file_size CHECK (file_size > 0)
);

CREATE INDEX idx_property_images_property_id ON property_images (property_id);
CREATE INDEX idx_property_images_primary ON property_images (property_id, is_primary);
