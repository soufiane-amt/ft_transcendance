#!/bin/bash

set -e

echo "🚀 Starting Deployment Script..."

# 1. Apply Migrations (The Fix)
# We use 'deploy' instead of 'dev'. This runs non-interactively and is safe for production.
# It automatically uses the 'directUrl' you configured in schema.prisma.
echo "🔄 Running Database Migrations..."
npx prisma migrate deploy

# 2. Start the App (The Speed Fix)
# We run the COMPILED JavaScript directly.
# This skips 'nest build' (which saves 30+ seconds) and prevents timeouts.
echo "✅ Starting NestJS Server..."
exec node dist/main.js