-- Migration: Create role_permissions table
-- File: 2025_10_17_101515_create_role_permissions_table.sql

CREATE TABLE role_permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(255) NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    UNIQUE KEY role_permissions_role_permission_id_unique (role, permission_id),
    KEY role_permissions_permission_id_foreign (permission_id),
    CONSTRAINT role_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);
