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

# Make render-start.sh and render-worker-start.sh executable (they should be copied by COPY . . above)
RUN if [ -f render-start.sh ]; then \
        chmod +x render-start.sh && \
        echo "✅ render-start.sh found and made executable"; \
    else \
        echo "⚠️ render-start.sh not found, will create inline script"; \
    fi

RUN if [ -f render-worker-start.sh ]; then \
        chmod +x render-worker-start.sh && \
        echo "✅ render-worker-start.sh found and made executable"; \
    else \
        echo "⚠️ render-worker-start.sh not found"; \
    fi

# Create fallback startup script (only if render-start.sh doesn't exist)
RUN echo '#!/bin/sh\n\
set -e\n\
export TZ=Asia/Manila\n\
echo "🚀 Starting Smile Suite application on Render..."\n\
echo "📋 Running database migrations..."\n\
php artisan migrate --force || true\n\
echo "🔗 Creating storage symlink..."\n\
php artisan storage:link || ln -sf ../storage/app/public public/storage || true\n\
echo "🌐 Starting PHP server on port ${PORT:-10000}..."\n\
exec php artisan serve --host=0.0.0.0 --port=${PORT:-10000}' > /var/www/html/docker-entrypoint.sh && \
    chmod +x /var/www/html/docker-entrypoint.sh

# Use render-start.sh if it exists, otherwise use fallback
CMD ["/bin/sh", "-c", "if [ -x /var/www/html/render-start.sh ]; then /var/www/html/render-start.sh; else /var/www/html/docker-entrypoint.sh; fi"]

