#!/bin/bash
# This script runs Playwright tests in Docker and generates an Allure report locally

# Build the Docker image
echo "Building Docker image..."
docker build -t playwright-test-image .

# Create results directory
mkdir -p allure-results

# Run tests in Docker
echo "Running tests in Docker..."
docker run --rm \
  -v "$(pwd)/allure-results:/tests/allure-results" \
  playwright-test-image

# Check if allure-commandline is installed
if ! command -v allure &> /dev/null; then
    echo "Installing allure-commandline..."
    npm install -g allure-commandline
fi

# Generate Allure report
echo "Generating Allure report..."
node scripts/allure-categories.js allure-results
allure generate allure-results -o allure-report --clean

# Kill any existing server on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# Start HTTP server to view report
echo "Starting server at http://localhost:8000"
echo "Press Ctrl+C to stop"
cd allure-report && python3 -m http.server 8000