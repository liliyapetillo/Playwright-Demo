FROM node:latest
WORKDIR /tests

# Prevent the browser from opening 
ENV PW_TEST_HTML_REPORT_OPEN='NEVER'

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers with dependencies
RUN npx playwright install --with-deps

# Copy the entire project
COPY . .

# Default command runs all tests
CMD ["npx", "playwright", "test"]
