#!/bin/bash

# Green Deployment
# This script handles the complete green environment deployment

set -e  # Exit on any error

echo "🚀 Starting Green deployment..."

# Debug: Check current directory and list contents
echo "Current directory: $(pwd)"
echo "Available directories:"
ls -la

# Navigate to application directory
cd /green-app/BG || {
    echo "❌ Failed to navigate to /green-app/BG"
    echo "Current directory: $(pwd)"
    echo "Available directories:"
    ls -la /green-app/ || echo "Directory /green-app/ does not exist"
    ls -la / || echo "Root directory contents:"
    exit 1
}

# Pull latest code from deploy branch
echo "📥 Pulling latest code from deploy branch..."
git fetch origin
git reset --hard origin/deploy

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Run database seeding
echo "🌱 Running database seeding..."
npm run seed

# Restart application with PM2
echo "🔄 Restarting application..."
pm2 restart green-app

# Wait for application to start
echo "⏳ Waiting for application to start..."
sleep 10

# Health check
echo "🏥 Performing health check..."
curl -f http://localhost:3000/health || {
    echo "❌ Health check failed"
    exit 1
}

echo "✅ Green deployment completed successfully!"
