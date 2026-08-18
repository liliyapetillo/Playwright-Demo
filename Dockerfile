FROM mcr.microsoft.com/playwright:v1.57.0-jammy
WORKDIR /tests

# Prevent the browser from opening
ENV PW_TEST_HTML_REPORT_OPEN='NEVER'

# Copy package files
COPY package*.json ./

# Install dependencies (browsers are already preinstalled in the base image)
RUN npm ci

# Copy the entire project
COPY . .

# Default command runs all tests
CMD ["npx", "playwright", "test"]
