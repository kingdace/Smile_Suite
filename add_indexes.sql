-- Add performance indexes for Find Clinics Page optimization

-- Add indexes to clinics table
CREATE INDEX IF NOT EXISTS idx_clinics_is_active ON clinics(is_active);
CREATE INDEX IF NOT EXISTS idx_clinics_slug ON clinics(slug);
CREATE INDEX IF NOT EXISTS idx_clinics_active_name ON clinics(is_active, name);

-- Add indexes to users table
CREATE INDEX IF NOT EXISTS idx_users_clinic_role ON users(clinic_id, role);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Show confirmation
SELECT 'Indexes created successfully!' AS status;

