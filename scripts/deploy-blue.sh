#!/bin/bash

# Blue Deployment Script
# This script handles the complete blue environment deployment

set -e  # Exit on any error

echo "🚀 Starting Blue deployment (Production)..."

# Debug: Check current directory and list contents
echo "Current directory: $(pwd)"
echo "Available directories:"
ls -la

# Navigate to application directory
cd /blue-app/BG || {
    echo "❌ Failed to navigate to /blue-app/BG"
    echo "Current directory: $(pwd)"
    echo "Available directories:"
    ls -la /blue-app/ || echo "Directory /blue-app/ does not exist"
    ls -la / || echo "Root directory contents:"
    exit 1
}

# Pull latest code from main branch
echo "📥 Pulling latest code from main branch..."
git fetch origin
git reset --hard origin/main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Restart application with PM2
echo "🔄 Restarting application..."
pm2 restart blue-app

# Wait for application to start
echo "⏳ Waiting for application to start..."
sleep 10

# Health check
echo "🏥 Performing health check..."
curl -f http://localhost:3000/health || {
    echo "❌ Health check failed"
    exit 1
}

echo "✅ Blue deployment completed successfully!"
