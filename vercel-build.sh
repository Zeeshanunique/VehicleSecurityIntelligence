#!/bin/bash
npm install
npm run build
# Make sure the dist/public directory exists
mkdir -p dist/public
# If files aren't already in the expected location, copy them there
if [ ! -f dist/public/index.html ] && [ -f dist/index.html ]; then
  cp -R dist/* dist/public/
fi 