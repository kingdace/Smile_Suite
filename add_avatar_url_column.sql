-- Safe SQL script to add avatar_url column to users table
-- This script is safe to run on production as it checks if the column exists first

-- Check if the column already exists before adding it
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'avatar_url'
);

-- Only add the column if it doesn't exist
SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `users` ADD COLUMN `avatar_url` VARCHAR(255) NULL AFTER `email`',
    'SELECT "Column avatar_url already exists" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify the column was added (or already existed)
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'avatar_url';
