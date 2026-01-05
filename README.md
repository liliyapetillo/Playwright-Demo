# Playwright Contact List Tests

[![Playwright Tests](https://github.com/liliyapetillo/Playwright-Demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/liliyapetillo/Playwright-Demo/actions/workflows/playwright.yml)
[![Allure Report](https://img.shields.io/badge/Allure%20Report-View%20Live-blue)](https://liliyapetillo.github.io/Playwright-Demo/)

Automated test suite for contact management application. Implements Page Object Model, API+UI dual validation, and Allure reporting with historical trends.

## Setup

**Prerequisites:** Docker or Node.js 20+

**Docker:**
```bash
git clone https://github.com/liliyapetillo/Playwright-Demo.git
cd Playwright-Demo
./docker-run.sh  # Builds image, runs tests, serves report at localhost:8000
```

**Node.js:**
```bash
npm install && npx playwright install --with-deps
npm test
```

**Live Report:** https://liliyapetillo.github.io/Playwright-Demo/

## Test Coverage

28 test cases across 5 suites:

| Suite | Count | Scope |
|-------|-------|-------|
| E2E Smoke | 4 | Signup → login → add → edit contact |
| Auth | 4 | Login, tokens, session management |
| Contacts | 2 | CRUD operations |
| API | 3 | REST endpoints, status validation |
| Accessibility | 2 | ARIA labels, keyboard navigation |
| Other | 13 | Security, validation, edge cases |

Full matrix: [docs/test-matrix.md](docs/test-matrix.md)

## Architecture

```
tests/
├── pages/              # Page Object Model
├── utils/              # Data generators, resilience helpers, persistence
├── fixtures.ts         # Custom fixtures (loggedInPage, testUser)
└── *.spec.ts           # Test suites
```

**Key patterns:**
- Page Object Model for maintainability
- Auto-generated test data with timestamps
- Persistent user/token storage in `test-results/`
- Resilient selectors with fallbacks
- API verification for UI actions
- Custom fixtures for login state

## Commands

```bash
npm test                                  # Run all tests
npm run test:report                       # Generate Allure report with trends
npx playwright test --headed              # Headed mode
npx playwright test auth.spec.ts          # Specific suite
npx playwright test --debug               # Debug mode
npx playwright test --project=chromium    # Single browser
```

**Docker:**
```bash
docker build -t playwright-test-image .
docker run --rm -v "$(pwd)/allure-results:/tests/allure-results" playwright-test-image
```

## Configuration

**playwright.config.ts:**
- Base URL: `thinking-tester-contact-list.herokuapp.com`
- Browsers: Chromium, Firefox
- Workers: 4 (parallel execution)
- Retries: 2 on CI, 0 locally
- Timeout: 30s per test
- Reporter: Allure + line

## CI/CD

**Workflow:**
1. PR push → Tests run in Docker (both browsers)
2. Pass → merge allowed | Fail → PR blocked
3. Merge to main → Allure report deploys to GitHub Pages

**Required checks:**
- `test (chromium)`
- `test (firefox)`

**Docker benefits:**
- Consistent environment across local/CI
- No manual dependency installation
- Reproducible builds
- Isolated execution

## Allure Reports

**Features:**
- Automatic failure categorization (product defects, test defects, flakes, infrastructure)
- Historical trends and flakiness detection
- Cross-browser comparison
- Screenshots and step-by-step timelines

**View:** https://liliyapetillo.github.io/Playwright-Demo/

**Generate locally:**
```bash
npm run test:report
npx allure open allure-report
```

## API + UI Validation

Tests combine UI interactions with API verification:
- UI actions trigger backend changes
- API calls verify state
- Bearer token auth from localStorage/cookies
- Persistent tokens stored in `test-results/`
- Status code validation (200, 401, 403)

Example:
```typescript
await contactListPage.addContact(contact);  // UI action
const response = await request.get('/contacts');  // API verification
expect(response.ok()).toBeTruthy();
```

## Data Management

**Auto-generation:**
```typescript
const contact = generateContact();  // Unique timestamp-based data
const user = generateUser();
```

**Persistence:**
- Users, contacts, tokens saved to `test-results/`
- Worker-safe for parallel execution
- Reusable across test runs

## Fixtures

Custom fixtures reduce boilerplate:
```typescript
import { test } from './tests/fixtures';

test('Add contact', async ({ loggedInPage, testUser }) => {
  // Already logged in, user available
});
```

## Links

- [Test Matrix](docs/test-matrix.md)
- [GitHub Actions](https://github.com/liliyapetillo/Playwright-Demo/actions)
- [Live Report](https://liliyapetillo.github.io/Playwright-Demo/)


