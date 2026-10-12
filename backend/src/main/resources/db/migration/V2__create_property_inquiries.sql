-- ==============================================================================
-- Flyway Migration V2: Create Property Inquiries Table for Lead Capture
-- Compatible with PostgreSQL 18+ and standard SQL-compliant engines
-- ==============================================================================

CREATE TABLE property_inquiries (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_property_inquiries_property
        FOREIGN KEY (property_id)
        REFERENCES properties (id)
        ON DELETE CASCADE,
    CONSTRAINT chk_inquiry_status
        CHECK (status IN ('NEW', 'CONTACTED', 'CLOSED'))
);

CREATE INDEX idx_property_inquiries_property_id ON property_inquiries (property_id);
CREATE INDEX idx_property_inquiries_status ON property_inquiries (status);
CREATE INDEX idx_property_inquiries_created_at ON property_inquiries (created_at DESC);
