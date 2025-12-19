# Playwright Contact List Tests

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
├── pages/         # Page objects (SignupPage, LoginPage, etc.)
├── utils/         # Helper functions
│   ├── contactGenerator.ts  # Auto-generates contact data
│   ├── email.ts            # Unique email generation
│   ├── user.ts             # User persistence
│   ├── contact.ts          # Contact persistence + workflow
│   └── token.ts            # Auth token storage
└── test-1.spec.ts # Main tests
```

## Tests

1. **Sign Up** - Creates new user with unique data
2. **Login** - Tests UI auth + API token retrieval & validation
3. **Add Contact** - Creates single contact using `generateContact()`
4. **Add Multiple Contacts** - Bulk creation
5. **Edit Contact** - Updates existing contact

All tests combine UI and API validation where applicable.

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

**API + UI testing** - Dual validation approach
- Login test validates both UI flow and API token retrieval
- `LoginPage.verifyAPILoginSuccess()` hits `/users/me` endpoint
- Auth tokens persisted for reuse in API-based tests
- Demonstrates Bearer token authentication

**Page Object Model** - Clean, maintainable test code

## Run Commands

```bash
npm test                               # Run all tests
npm run test:report                    # Run tests + generate Allure report with trends
npx playwright test --headed           # See browser
npx playwright test -g "Add contact"   # Run specific test
npx playwright show-report             # View HTML report
npx playwright test --debug            # Debug mode
```

## Allure Reports & Trends

To see test trends (pass rates, duration changes over time):

```bash
npm run test:report
```

This command:
1. Clears previous test results
2. Runs all tests
3. Preserves history from the previous report
4. Generates and opens the Allure report with trends

Run this command **twice** to see trends comparing the two runs.

## Config

- Base URL: `thinking-tester-contact-list.herokuapp.com`
- Runs in Chromium, Firefox, and WebKit
- Parallel execution enabled
- Auto-retry: 1 retry locally, 2 retries on CI
- HTML and Allure reporting enabled
- Allure trends tracking enabled via history preservation

That's it! Clone, install, and run. All test data is auto-generated with timestamps for uniqueness.
