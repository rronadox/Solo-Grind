#!/bin/bash
# This script runs the build process for Vercel deployment

# Run environment setup
echo "Setting up environment variables..."
node setup-env.js

# Run the build
echo "Building the application..."
npm run build

# Create API folder in dist if it doesn't exist
echo "Setting up API folder..."
mkdir -p dist/api

# Copy API endpoints to dist
echo "Copying API endpoints..."
cp -r api/* dist/api/

# Fix server.js import paths if needed
echo "Adjusting server.js paths..."
sed -i 's|../shared/schema|../shared/schema.js|g' dist/api/server.js

# Ensure correct permissions
chmod -R 755 dist

# Done!
echo "Build complete!"