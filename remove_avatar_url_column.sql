-- ROLLBACK SQL script to remove avatar_url column from users table
-- ONLY USE THIS IF YOU NEED TO ROLLBACK THE CHANGES
-- This script is safe to run as it checks if the column exists first

-- Check if the column exists before removing it
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'avatar_url'
);

-- Only remove the column if it exists
SET @sql = IF(@column_exists > 0, 
    'ALTER TABLE `users` DROP COLUMN `avatar_url`',
    'SELECT "Column avatar_url does not exist" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify the column was removed
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'avatar_url';
