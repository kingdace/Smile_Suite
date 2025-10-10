#!/bin/bash

# Get the port from Railway or use default
PORT=${PORT:-8080}

echo "Starting Smile Suite on port $PORT"

# Start the Laravel server
php artisan serve --host=0.0.0.0 --port=$PORT
