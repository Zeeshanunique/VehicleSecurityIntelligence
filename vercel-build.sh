#!/bin/bash
# Install root dependencies
npm install

# Build client
cd client
npm install
npm run build
cd ..

# Build server
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Make sure output directories exist
mkdir -p client/dist/public
mkdir -p dist

# Ensure files are in the right place
if [ -d "dist/public" ] && [ ! -d "client/dist/public" ]; then
  cp -R dist/public/* client/dist/public/
fi 