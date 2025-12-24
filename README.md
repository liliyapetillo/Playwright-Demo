# Playwright Contact List Tests

[![Playwright Tests](https://github.com/liliyapetillo/Playwright-Demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/liliyapetillo/Playwright-Demo/actions/workflows/playwright.yml)
[Allure Report (GitHub Pages)](https://liliyapetillo.github.io/Playwright-Demo/)

Automated tests for a contact list app using Playwright + TypeScript. Features Page Object Model, data persistence, and auto-generated test data.

## Quick Start

```bash
npm install
npx playwright install
npm test
```

## What's Inside

```
tests/
├── pages/              # Page objects (SignupPage, LoginPage, etc.)
├── utils/              # Helper functions
│   ├── contactGenerator.ts  # Auto-generates contact data
│   ├── email.ts            # Unique email generation
│   ├── user.ts             # User persistence
│   ├── contact.ts          # Contact persistence + workflow
│   ├── token.ts            # Auth token storage
│   ├── testHelpers.ts      # Shared helpers (context, attachments, ensure*)
│   └── resilience.ts       # Selector fallbacks and robust waits
├── fixtures.ts         # Playwright fixtures (loggedInPage, testUser)
├── e2e-smoke.spec.ts   # E2E golden path (signup → login → add → edit)
├── auth.spec.ts        # Authentication & security tests
├── contacts.spec.ts    # Contact CRUD operations
├── api.spec.ts         # API contract tests
└── a11y.spec.ts        # Accessibility checks
docs/
└── test-matrix.md      # Test case mapping & coverage tracking
```

## Test Suites

**E2E Smoke** (`e2e-smoke.spec.ts`) - Golden path flow
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

## Key Features

**Auto-generated data** - No more manual test data!
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

## Run Commands

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

## Allure Reports & Trends

**Quick workflow:**
```bash
npx playwright test                                    # Run tests
npx allure generate allure-results --clean -o allure-report  # Generate report
npx allure open allure-report                          # Open in browser
```

**With trends tracking:**
```bash
npm run test:report
```

This command:
1. Clears previous test results
2. Runs all tests
3. Preserves history from the previous report
4. Generates and opens the Allure report with trends

Run this command **twice** to see trends comparing the two runs.

**Note:** Each test runs on 2 browsers (Chromium, Firefox), so you'll see results grouped by test case with browser breakdowns in the Allure report.

### Allure Categories

We classify failures automatically using `categories.json`:

- Suite categories: failures grouped by spec file
	- Suite: Contacts — matches `contacts.spec.ts`
	- Suite: Auth — matches `auth.spec.ts`
	- Suite: API — matches `api.spec.ts`
	- Suite: E2E Smoke — matches `e2e-smoke.spec.ts`
- Product defects: assertion failures (UI mismatch)
- Test defects: coding errors (TypeError, bad locator)
- Flaky tests: timeouts, intermittent selector visibility
- Infrastructure issues: network errors, browser launch problems

This file is generated during `npm run test:report` at `allure-results/categories.json`. To adjust rules, edit [scripts/allure-categories.js](scripts/allure-categories.js).

## Config

- Base URL: `thinking-tester-contact-list.herokuapp.com`
- Runs in Chromium and Firefox
- Parallel execution enabled
- Auto-retry: 1 retry locally, 2 retries on CI
- HTML and Allure reporting enabled
- Allure trends tracking enabled via history preservation

That's it! Clone, install, and run. All test data is auto-generated with timestamps for uniqueness.
