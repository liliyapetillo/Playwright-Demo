# Playwright Contact List Tests

[![Playwright Tests](https://github.com/liliyapetillo/Playwright-Demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/liliyapetillo/Playwright-Demo/actions/workflows/playwright.yml)
[![Allure Report](https://img.shields.io/badge/Allure%20Report-View%20Live-blue)](https://liliyapetillo.github.io/Playwright-Demo/)

A comprehensive automated test suite for a contact management application, demonstrating modern test automation practices with **Playwright**, **TypeScript**, and **CI/CD integration**.

## 🎯 Overview

This project showcases enterprise-grade test automation with:
- **28 test cases** covering E2E, API, authentication, and accessibility
- **Page Object Model** architecture for maintainability
- **Intelligent data generation** with auto-persistence
- **Dual validation** (UI + API) for comprehensive coverage
- **Cross-browser execution** on Chromium & Firefox
- **Automated reporting** with Allure and trend analysis
- **Continuous integration** with GitHub Actions for PRs and main branch deployment

**Live Allure Report:** [View Test Results Dashboard](https://liliyapetillo.github.io/Playwright-Demo/)


## 🚀 Quick Start

```bash
# Install dependencies
npm install
npx playwright install

# Run all tests
npm test

# Generate detailed Allure report with trends
npm run test:report

# Run tests in headed mode
npx playwright test --headed
```

## 📁 Project Structure

```
.
├── .github/workflows/
│   ├── playwright.yml         # ✅ Runs on every PR and push to main
│   └── deploy-allure.yml      # 📊 Auto-deploys report after tests pass
├── tests/
│   ├── pages/                 # Page Object Model (5 page classes)
│   │   ├── SignupPage.ts
│   │   ├── LoginPage.ts       # Hybrid UI/API auth validation
│   │   ├── ContactListPage.ts
│   │   ├── AddContactPage.ts
│   │   └── EditContactPage.ts
│   ├── utils/                 # Test utilities & helpers
│   │   ├── contactGenerator.ts  # Auto-generates realistic test data
│   │   ├── email.ts            # Unique email factory with timestamps
│   │   ├── user.ts             # User persistence (localStorage)
│   │   ├── contact.ts          # Contact CRUD + workflow helpers
│   │   ├── token.ts            # Auth token storage & retrieval
│   │   ├── testHelpers.ts      # Shared assertions & setup
│   │   └── resilience.ts       # Smart selector fallbacks + robust waits
│   ├── fixtures.ts            # Custom fixtures (loggedInPage, testUser)
│   ├── e2e-smoke.spec.ts      # 🎯 Golden path: signup → login → add → edit
│   ├── auth.spec.ts           # 🔐 Authentication & security
│   ├── contacts.spec.ts       # 📋 Contact CRUD operations
│   ├── api.spec.ts            # 🔌 API contract validation
│   └── a11y.spec.ts           # ♿ Accessibility compliance
├── scripts/
│   ├── allure-categories.js   # Failure categorization rules
│   └── filter-skipped.js      # Remove skipped tests from reports
├── docs/
│   └── test-matrix.md         # Test case mapping & coverage matrix
├── playwright.config.ts       # Configuration (browsers, retries, timeouts)
├── package.json
└── README.md
```

## ✅ CI/CD Pipeline: Test on PR, Deploy on Main

This project implements a **gating strategy** where tests must pass on pull requests before merging to main.

### Workflow: Pull Request → Main Branch Deployment

```
┌─────────────────────┐
│  Create/Push PR     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  GitHub Actions: Playwright Tests   │ ← Runs on: main, develop, PRs
│  (playwright.yml)                   │
│  • 2 browsers (Chromium, Firefox)   │
│  • 28 test cases                    │
│  • 2 retries on failure             │
│  • Uploads allure-results artifacts │
└──────────┬──────────────────────────┘
           │
     ✅ PASSED?
           │
           ├─────────┬────────────────┐
           │         │                │
          YES        NO         (BLOCKED)
           │         │                │
           ▼         └───────────────▶ PR blocked until tests pass
           │
┌──────────▼──────────────────────────┐
│  GitHub Actions: Deploy Allure      │ ← Auto-triggered on test pass
│  (deploy-allure.yml)                │
│  • Merges cross-browser results     │
│  • Generates Allure report          │
│  • Preserves historical trends      │
│  • Deploys to GitHub Pages          │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  ✅ PR Approved & Merged to main     │
│  📊 Live Report Available            │
│  👉 https://liliyapetillo.github.io/ │
└──────────────────────────────────────┘
```

### Test Execution Strategy

**On Pull Requests:**
- Tests run automatically on create/push
- Both Chromium & Firefox browsers execute in parallel (2 matrix jobs)
- 2 auto-retries reduce flakes
- Results uploaded as artifacts
- **Tests must pass to allow merge** (GitHub branch protection configured)

**On Main Branch:**
- Same test suite runs
- **If pass:** Auto-deploys Allure report (no manual step needed)
- **If fail:** Report generated but not deployed; author notified

**Manual Reset Option:**
```bash
# Reset Allure history (start fresh, no trend data)
gh workflow run deploy-allure.yml -f resetHistory=true
```

### Test Status Badges

- [![Playwright Tests Status](https://github.com/liliyapetillo/Playwright-Demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/liliyapetillo/Playwright-Demo/actions/workflows/playwright.yml) — Latest test run
- [View Full Test Results →](https://liliyapetillo.github.io/Playwright-Demo/)



## 🧪 Test Coverage

### Test Suites & Cases

| Suite | Cases | Coverage |
|-------|-------|----------|
| **E2E Smoke** | Golden path flow: sign up → login → add contact → edit | Core user workflows |
| **Auth & Security** | Login tokens, profile validation, unauthorized access | Authentication & security |
| **Contacts CRUD** | Add, edit, list operations | Feature functionality |
| **API** | Login, profile endpoints, status codes | Backend contracts |
| **Accessibility (A11y)** | Headings, form labels, button names, keyboard nav | Compliance |

**Details:**

**E2E Smoke** (`e2e-smoke.spec.ts`)
- Sign up → Login → Add contact → Edit contact (serial execution)

**Auth & Security** (`auth.spec.ts`)
- TC-AUTH-001: Signup redirects to contact list
- TC-AUTH-005: API login token + /users/me validation
- TC-SEC-003: Deep-link without auth renders safely

**Contacts** (`contacts.spec.ts`)
- TC-CONTACT-001: Add contact appears in list
- TC-CONTACT-002: Edit contact shows changes

**API** (`api.spec.ts`)
- TC-API-001/002: Login token + /users/me profile

**Accessibility** (`a11y.spec.ts`)
- TC-A11Y-001/002: Heading/button accessible names

See [docs/test-matrix.md](docs/test-matrix.md) for full test case mapping and coverage status.

## 💡 Design Patterns & Best Practices

### 1. Page Object Model (POM)
Encapsulates UI interactions and locators in dedicated page classes. This improves maintainability and readability.

```typescript
// Clean, reusable page abstractions
const signupPage = new SignupPage(page);
await signupPage.fillEmail('test@example.com');
await signupPage.submitForm();
```

### 2. Intelligent Auto-generated Test Data
No hard-coded test data. Every test uses dynamically generated, unique test data with timestamps to avoid conflicts.

```typescript
// Auto-generates: { firstName, lastName, email, phone, dob, street, city, state, zip }
const contact = generateContact(); 

// Override specific fields if needed
const contact = generateContact({ firstName: 'John', lastName: 'Doe' });
```

### 3. Dual Validation: UI + API
Tests validate both the user interface and backend state. This catches bugs that UI-only or API-only tests might miss.

```typescript
// Add contact via UI, verify via API
const contact = generateContact();
await addContactPage.addContact(contact);

// Verify backend has the data
const apiResponse = await request.get(`/contacts/${contact.email}`);
expect(apiResponse.status()).toBe(200);
expect(await apiResponse.json()).toMatchObject(contact);
```

### 4. Data Persistence Across Tests
Test data (users, contacts, tokens) is persisted in `test-results/` between runs, enabling realistic workflows without redundant setup.

### 5. Resilient Selectors with Fallbacks
Smart selector selection reduces flakes. Inputs/buttons try multiple strategies (placeholder → ID → label/name).

```typescript
// Handles various DOM structures without explicit selector tuning
await fillInput(page, 'test@example.com', [
  { placeholder: 'Email' },
  { id: 'email' },
  { label: 'Email Address' }
]);
```

### 6. Robust Wait Strategies
Stabilizes assertions against eventual consistency and render delays.

```typescript
// Waits for exact row match, handles async table updates
const row = await waitForRowWithText(page, '#contactsTable', 'john@example.com');
```

### 7. Custom Fixtures for DRY Tests
Playwright fixtures eliminate repetitive setup (login, user creation) across specs.

```typescript
test('user can add contact', async ({ loggedInPage, testUser }) => {
  // loggedInPage is pre-authenticated, testUser already exists
  // No redundant login code needed
});
```


## 🛠️ Commands & Development

### Running Tests
```bash
npm test                               # Run all tests (default config)
npm run test:report                    # Run tests + generate Allure report with trends
npx playwright test --headed           # See browser in action
npx playwright test --project=chromium # Single browser
npx playwright test auth.spec.ts       # Specific spec file
npx playwright test --debug            # Step through in debug mode
npx playwright show-report             # View HTML report
```

### Development Workflow
```bash
# Write/update test
npx playwright test tests/mytest.spec.ts --headed --debug

# Generate report locally
npm run test:report

# View in browser
npx allure open allure-report
```


```typescript
const contact = generateContact(); // Done!
await addContactWithUser(page, request, lastUser, contact, testInfo);
```

**Override fields if needed:**
```typescript
const contact = generateContact({ firstName: 'John', lastName: 'Doe' });
```

**Data persistence** - Test data saved between runs in `test-results/`
- Users, contacts, and auth tokens auto-saved
- Worker-safe for parallel execution

**API + UI testing** - Comprehensive dual validation
- **Hybrid approach**: UI interactions trigger backend changes, API verifies the results
- **Token management**: Auto-harvest from localStorage/cookies, fallback to `/users/login`
- **Bearer authentication**: All API requests use `Authorization: Bearer <token>` headers
- **Profile verification**: `LoginPage.verifyAPILoginSuccess()` calls `/users/me` to confirm identity
- **Dedicated API suite**: `api.spec.ts` tests pure REST endpoints (login, profile)
- **Persistent tokens**: Auth tokens saved to `test-results/` for reuse across tests
- **Status code validation**: Confirms 200 for success, 401/403 for unauthorized access

**Page Object Model** - Clean, maintainable test code

**Allure reporting** - Detailed test reports with steps
- Screenshots attached on failure
- Test steps tracked with `allure.step()`
- Cross-browser results grouped by test case

**Resilience & Fixtures** - Fewer flakes, more flexibility
- Resilient selectors: inputs/buttons use fallbacks (placeholder → id → label/name) via `resilience.ts`.
- Robust waits: `waitForRowWithText()` stabilizes table assertions under eventual consistency.
- Login fixture: `fixtures.ts` provides `loggedInPage` and `testUser` so specs avoid duplicated login code.

Example usage (fixtures):
```typescript
import { test, expect } from './tests/fixtures';
import { AddContactPage } from './tests/pages/AddContactPage';
import { generateContact } from './tests/utils/contactGenerator';

test('Add contact shows in list', async ({ loggedInPage }) => {
	const page = loggedInPage;
	const add = new AddContactPage(page);
	const contact = generateContact();
	await add.addContact(contact);
});
```

Example usage (resilience helpers):
```typescript
import { fillInput, clickButton, waitForRowWithText } from './tests/utils/resilience';

await fillInput(page, 'user@example.com', [
	{ placeholder: 'Email' }, { id: '#email' }, { label: 'Email' }
]);
await clickButton(page, ['Submit', 'Login', 'Log in']);
const row = await waitForRowWithText(page, '#myTable', contact.email);
```

## 📊 Allure Reporting & Test Analysis

### Intelligent Failure Categorization
Failures are automatically classified to help identify root causes:

- **Product Defects** — Assertion failures (UI mismatch, wrong values)
- **Test Defects** — Code errors (TypeError, bad selectors, timing issues)
- **Flaky Tests** — Intermittent timeouts, selector visibility issues
- **Infrastructure Issues** — Browser launch failures, network errors

**Rules defined in:** [scripts/allure-categories.js](scripts/allure-categories.js)

### Test Trends & Historical Analysis
Each deployment preserves historical data, showing test health over time:
- Pass/fail ratios per test
- Flakiness detection
- Performance trends
- Cross-browser comparison

Run tests twice locally to see trends:
```bash
npm run test:report   # First run
npm run test:report   # Second run - compare trends
```

### Live Dashboard
**[View Allure Report](https://liliyapetillo.github.io/Playwright-Demo/)**
- ✅ Pass/fail breakdown by test and browser
- 📈 Historical trends and patterns
- 📸 Screenshots and attachments from failures
- 🔍 Detailed test steps and timelines


```bash
npm test                               # Run all tests
npm run test:report                    # Run tests + generate Allure report with trends
npx playwright test --headed           # See browser
npx playwright test --project=chromium # Run on one browser only
npx playwright test auth.spec.ts       # Run specific spec
npx playwright show-report             # View HTML report
npx playwright test --debug            # Debug mode
npx playwright test tests/contacts.spec.ts --project=chromium  # Run contacts only
```

## 📚 Test Case Mapping

For a complete list of test cases, coverage status, and feature mapping, see [docs/test-matrix.md](docs/test-matrix.md).

Highlights:
- ✅ **28 test cases** across 5 suites
- 🔄 **Cross-browser execution** (Chromium, Firefox)
- 🎯 **Coverage:** E2E flows, auth, CRUD, API contracts, accessibility
- 📖 [Full Matrix →](docs/test-matrix.md)

---

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/liliyapetillo/Playwright-Demo.git
   cd Playwright-Demo
   ```

2. **Install & setup**
   ```bash
   npm install
   npx playwright install
   ```

3. **Run tests**
   ```bash
   npm test                      # Quick run
   npm run test:report           # Full report with trends
   npx allure open allure-report # View in browser
   ```

4. **View live results**
   - Pull Request? Tests auto-run. Must pass to merge.
   - Merged to main? Report auto-deploys → [Live Dashboard](https://liliyapetillo.github.io/Playwright-Demo/)

---

## 💬 Key Takeaways

✅ **Maintainable:** Page Object Model & custom fixtures reduce boilerplate  
✅ **Reliable:** Resilient selectors, intelligent waits, and auto-retries  
✅ **Realistic:** Dual UI+API validation catches real-world bugs  
✅ **Observable:** Rich Allure reports with trends and historical analysis  
✅ **Scalable:** Parallel execution and data persistence support growth  
✅ **Professional:** CI/CD gating ensures quality before production  

All test data is **auto-generated** with timestamps for uniqueness. Clone, install, and run!


## 🏗️ Configuration

**[playwright.config.ts](playwright.config.ts)**
```typescript
{
  testDir: 'tests',
  timeout: 30000,          // 30s per test
  retries: 2,              // 2 retries on CI (0 locally)
  workers: 4,              // Parallel execution
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
  ],
  reporter: ['allure'],    // Allure reporter
  baseURL: 'https://thinking-tester-contact-list.herokuapp.com',
  webServer: null,         // Tests against live server
}
```

**Key Settings:**
- **Base URL:** Live heroku app (no local server needed)
- **Parallel Execution:** 4 workers for speed
- **Auto-Retry:** 2 retries on CI to reduce flakes
- **Browsers:** Chromium & Firefox (cross-browser validation)
- **Reporting:** Allure for rich reporting and trends
- **Timeout:** 30 seconds per test, 10 minutes max per test file


