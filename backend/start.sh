#!/bin/bash

# Ensure Redis is running
echo "Checking Redis connection..."
if command -v redis-cli &> /dev/null; then
  if ! redis-cli ping &> /dev/null; then
    echo "Redis is not running. Starting Redis..."
    if command -v docker &> /dev/null; then
      docker run --name redis -p 6379:6379 -d redis || echo "Failed to start Redis with Docker"
    else
      echo "Please start Redis manually before running the application"
    fi
  else
    echo "Redis is running"
  fi
else
  echo "redis-cli not found. Please ensure Redis is running"
fi

# Set NODE_PATH and start the application
echo "Starting application..."
NODE_PATH=./dist node dist/backend/src/main.js