#!/bin/bash

echo "🚀 Starting application..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 5

# Run migrations
echo "📦 Running migrations..."
php artisan migrate --force

# Run seeders
echo "🌱 Running seeders..."
php artisan db:seed --force

# Cache config
echo "⚡ Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start server
echo "✅ Starting server..."
php artisan serve --host=0.0.0.0 --port=$PORT
