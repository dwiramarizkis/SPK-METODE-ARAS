#!/bin/bash

echo "🚀 Starting deployment..."

# Clear cache
echo "📦 Clearing cache..."
php artisan config:clear
php artisan cache:clear

# Run migrations
echo "🗄️  Running migrations..."
php artisan migrate:fresh --force --seed

# Check migration status
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed!"
    exit 1
fi

# Start server
echo "🌐 Starting server..."
php artisan serve --host=0.0.0.0 --port=$PORT
