# Use PHP 8.2 CLI (for Laravel's built-in server)
FROM php:8.2-cli-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    nodejs \
    npm \
    oniguruma-dev \
    postgresql-dev \
    mariadb-client \
    mariadb-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring zip exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --ignore-platform-reqs --no-scripts

# Copy package files
COPY package.json package-lock.json ./

# Install Node dependencies
RUN npm ci

# Copy application files
COPY . .

# Build assets
RUN npm run build

# Set permissions
RUN chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Create storage directories
RUN mkdir -p storage/app/public/clinic-gallery \
    && mkdir -p storage/app/public/clinic-logos \
    && mkdir -p storage/app/public/clinics \
    && mkdir -p storage/app/public/clinics/treatments \
    && mkdir -p storage/app/public/user-avatars \
    && chmod -R 755 storage

# Expose port (Render sets PORT env var)
EXPOSE 10000

# Start command (Render will override this)
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-10000}

