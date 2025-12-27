# Playwright Contact List Tests

[![Playwright Tests](https://github.com/liliyapetillo/Playwright-Demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/liliyapetillo/Playwright-Demo/actions/workflows/playwright.yml)
[![Allure Report](https://img.shields.io/badge/Allure%20Report-View%20Live-blue)](https://liliyapetillo.github.io/Playwright-Demo/)

Automated test suite for a contact management app using **Playwright**, **TypeScript**, and **CI/CD integration**. Features include Page Object Model, auto-generated test data, dual UI+API validation, and Allure reporting with trends.

## 🚀 Quick Start

```bash
npm install && npx playwright install
npm test                          # Run all tests
npm run test:report               # Run + generate Allure report with trends
npx playwright test --headed      # See tests run in browser
```

**Live Report:** [View Test Results](https://liliyapetillo.github.io/Playwright-Demo/)

## 🧪 Test Coverage (28 cases)

| Suite | Count | Focus |
|-------|-------|-------|
| **E2E Smoke** | 4 | Golden path: signup → login → add → edit contact |
| **Auth** | 4 | Login, tokens, session management |
| **Contacts** | 2 | Add/edit/list operations |
| **API** | 3 | REST endpoints, status codes |
| **Accessibility** | 2 | Labels, headings, keyboard nav |
| **Other** | 13 | Security, navigation, validation |

## 📁 Key Files

```
tests/
├── pages/           # Page Object Model (5 pages)
├── utils/           # Helpers: data gen, resilience, persistence
├── fixtures.ts      # Custom fixtures (loggedInPage, testUser)
├── e2e-smoke.spec.ts, auth.spec.ts, contacts.spec.ts, api.spec.ts, a11y.spec.ts
└── ...
docs/test-matrix.md  # Full test case mapping
```

## ✅ CI/CD: PR Tests → Deploy on Main

**Workflow:**
1. Create/push PR → Playwright Tests auto-run (both browsers)
2. ✅ Pass? → Merge allowed
3. ❌ Fail? → PR blocked until fixed
4. Merge to main → Auto-deploy Allure report

**Status checks required on main:**
- `test (chromium)` ✅
- `test (firefox)` ✅

## 💡 Key Features

- **Auto-generated test data** — Unique timestamps, no hard-coded values
- **Page Object Model** — Clean, maintainable page abstractions
- **Dual validation** — UI interactions + API verification
- **Data persistence** — Users/tokens saved between runs
- **Resilient selectors** — Smart fallbacks for robust selection
- **Custom fixtures** — Pre-logged-in pages, test users, reusable setup
- **Allure reporting** — Rich reports with steps, screenshots, trends
- **Parallel execution** — 4 workers for speed, cross-browser testing

## 🛠️ Commands

```bash
npm test                                  # Default run
npm run test:report                       # With Allure report
npx playwright test --headed              # Headed mode
npx playwright test auth.spec.ts          # Specific file
npx playwright test --debug               # Debug mode
npx allure open allure-report             # View report
```

## 📊 Allure Reporting

- Automatic failure categorization (product defects, test defects, flakes, infrastructure)
- Historical trends across runs
- Cross-browser comparison
- Screenshots & attachments from failures
- Test step timeline

[View Live Dashboard](https://liliyapetillo.github.io/Playwright-Demo/)

## 🔧 Configuration

**playwright.config.ts:**
- **Browsers:** Chromium, Firefox (desktop)
- **Base URL:** `thinking-tester-contact-list.herokuapp.com`
- **Retries:** 0 local, 2 on CI
- **Workers:** 4 parallel
- **Timeout:** 30s per test

## 📚 Documentation

- [Test Matrix & Cases](docs/test-matrix.md) — Full coverage mapping
- [GitHub Actions](https://github.com/liliyapetillo/Playwright-Demo/actions) — Workflow runs
- [Allure Report](https://liliyapetillo.github.io/Playwright-Demo/) — Live results

## 🚀 Getting Started

1. Clone & install: `git clone ...; npm install; npx playwright install`
2. Run tests: `npm test`
3. View report: `npm run test:report`
4. Create PR → Tests auto-run → Merge when pass ✅

All test data auto-generates with unique timestamps. Clone, install, and run!

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


