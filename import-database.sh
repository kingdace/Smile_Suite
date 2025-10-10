#!/bin/bash

# Database import script for Railway
echo "Starting database import..."

# Wait for database to be ready
echo "Waiting for database connection..."
until mysql -h$RAILWAY_DATABASE_HOST -P$RAILWAY_DATABASE_PORT -u$RAILWAY_DATABASE_USER -p$RAILWAY_DATABASE_PASSWORD -e "SELECT 1" >/dev/null 2>&1; do
    echo "Waiting for database..."
    sleep 2
done

echo "Database is ready!"

# Import the SQL dump if it exists
if [ -f "database/smilesuite.sql" ]; then
    echo "Importing database from smilesuite.sql..."
    mysql -h$RAILWAY_DATABASE_HOST -P$RAILWAY_DATABASE_PORT -u$RAILWAY_DATABASE_USER -p$RAILWAY_DATABASE_PASSWORD $RAILWAY_DATABASE_NAME < database/smilesuite.sql
    echo "Database imported successfully!"
elif [ -f "database/dump.sql" ]; then
    echo "Importing database from dump.sql..."
    mysql -h$RAILWAY_DATABASE_HOST -P$RAILWAY_DATABASE_PORT -u$RAILWAY_DATABASE_USER -p$RAILWAY_DATABASE_PASSWORD $RAILWAY_DATABASE_NAME < database/dump.sql
    echo "Database imported successfully!"
else
    echo "No SQL dump found, running migrations instead..."
    php artisan migrate --force
fi

echo "Database setup complete!"
