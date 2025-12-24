# Contact List App – Testing Matrix and Case List

## Scope Overview
- **Core features:** Sign up, login, logout, view contact list, add contact, edit contact.
- **Platforms:** Chromium, Firefox (desktop profiles configured in Playwright).
- **Tech:** UI + REST API (`/users`, `/contacts`), Allure reporting.

## Automation Mapping (latest)
- TC-AUTH-001 • Signup redirect • Automated in [tests/e2e-smoke.spec.ts](tests/e2e-smoke.spec.ts)
- TC-AUTH-002 • UI login happy path • Automated in [tests/e2e-smoke.spec.ts](tests/e2e-smoke.spec.ts)
- TC-AUTH-005 • Token + /users/me • Automated in [tests/auth.spec.ts](tests/auth.spec.ts)
- TC-SEC-003 • Deep-link without auth • Automated in [tests/auth.spec.ts](tests/auth.spec.ts)
- TC-CONTACT-001 • Add contact in list • Automated in [tests/contacts.spec.ts](tests/contacts.spec.ts)
- TC-CONTACT-002 • Edit contact shows changes • Automated in [tests/contacts.spec.ts](tests/contacts.spec.ts)
- TC-NAV-002/003 • Header visible, add form opens/returns • Automated in [tests/e2e-smoke.spec.ts](tests/e2e-smoke.spec.ts)
- TC-API-001/002 • Login token + /users/me profile • Automated in [tests/api.spec.ts](tests/api.spec.ts)
- TC-A11Y-001/002 • Headings/buttons accessible names • Automated in [tests/a11y.spec.ts](tests/a11y.spec.ts)

## Status Tracking
- Status codes: **Done** = automated and passing; **Planned** = defined but not yet automated; **Gap** = needs test design.
- Update the rows below as you add coverage.

| TC ID | Title | Status | Automation |
| --- | --- | --- | --- |
| TC-AUTH-001 | Signup redirects to Contact List | Done | [tests/e2e-smoke.spec.ts](tests/e2e-smoke.spec.ts) |
| TC-AUTH-002 | UI login happy path | Done | [tests/e2e-smoke.spec.ts](tests/e2e-smoke.spec.ts) |
| TC-AUTH-003 | Wrong password rejected | Planned | — |
| TC-AUTH-004 | Unknown email handled | Planned | — |
| TC-AUTH-005 | Token + /users/me authorized | Done | [tests/auth.spec.ts](tests/auth.spec.ts) |
| TC-SEC-003 | Deep-link without auth | Done | [tests/auth.spec.ts](tests/auth.spec.ts) |
| TC-CONTACT-001 | Add contact appears in list | Done | [tests/contacts.spec.ts](tests/contacts.spec.ts) |
| TC-CONTACT-002 | Edit contact shows changes | Done | [tests/contacts.spec.ts](tests/contacts.spec.ts) |
| TC-CONTACT-003 | Required fields validated | Planned | — |
| TC-CONTACT-004 | Duplicate email prevented | Planned | — |
| TC-API-001/002 | Login token + /users/me | Done | [tests/api.spec.ts](tests/api.spec.ts) |
| TC-A11Y-001/002 | Headings/buttons accessible names | Done | [tests/a11y.spec.ts](tests/a11y.spec.ts) |

## Priority & Impact Definitions
- **Priority P0:** Critical path; blocks primary user workflows.
- **Priority P1:** Important; common scenarios and validations.
- **Priority P2:** Nice-to-have; edge cases, resilience.
- **Impact High:** Break affects many users or core data.
- **Impact Medium:** Limited scope or workaround exists.
- **Impact Low:** Cosmetic or low-frequency edge.

## Regression Core (P0 / High)
- **TC-AUTH-001:** New user can sign up, redirected to Contact List (P0, High).
- **TC-AUTH-002:** Existing user can log in via UI and receives valid token via API (P0, High).
- **TC-CONTACT-001:** Add a new valid contact appears in list (P0, High).
- **TC-CONTACT-002:** Edit an existing contact, changes visible in list (P0, High).
- **TC-NAV-001:** Logout clears session and returns to login page (P0, High).

## Authentication & Sessions
- **TC-AUTH-003:** Login rejects wrong password with error message (P1, High).
- **TC-AUTH-004:** Login with non-existent email handled gracefully (P1, Medium).
- **TC-AUTH-005:** Token works for `/users/me`; unauthorized without token returns 401 (P0, High).
- **TC-AUTH-006:** Session cleared on logout (`localStorage`, cookies) (P0, High).
- **TC-AUTH-007:** Token expiry behavior—API denies after expiry (P2, Medium).

## Contacts – Create/Read/Update
- **TC-CONTACT-003:** Required fields validated (first/last/email, birthdate format) (P1, High).
- **TC-CONTACT-004:** Email must be unique per user; duplicate prevented (P1, Medium).
- **TC-CONTACT-005:** Phone and postal code format validation (P1, Medium).
- **TC-CONTACT-006:** Country/state/city persisted and displayed (P1, Medium).
- **TC-CONTACT-007:** Edit preserves unchanged fields and updates targeted ones (P1, Medium).
- **TC-CONTACT-008:** Large input lengths capped and error shown (P2, Low).

## Navigation & UI Behavior
- **TC-NAV-002:** Contact list header shows "Contact List" after login (P0, High).
- **TC-NAV-003:** Add contact button opens form; submit returns to list (P0, High).
- **TC-NAV-004:** Refresh on list keeps session; refresh on edit preserves draft? (P2, Low).
- **TC-NAV-005:** Back/forward navigation does not break session (P2, Medium).

## API Integration & Contract
- **TC-API-001:** `/users/login` returns 200 + token on valid creds (P0, High).
- **TC-API-002:** `/users/me` returns correct profile for token (P0, High).
- **TC-API-003:** Contact creation returns 201; list includes created item (P0, High).
- **TC-API-004:** Edit contact returns 200 and list reflects changes (P1, High).
- **TC-API-005:** Error codes/messages for invalid input (P1, Medium).

## Error Handling & Messaging
- **TC-ERR-001:** Inline form errors shown near fields (P1, Medium).
- **TC-ERR-002:** Global error banner for API failures/timeouts (P2, Medium).
- **TC-ERR-003:** Graceful handling of network loss on submit (P2, Medium).

## Security & Data Protection
- **TC-SEC-001:** No PII in logs; console free of secrets (P1, High).
- **TC-SEC-002:** Token stored securely; no XSS via contact fields (P1, High).
- **TC-SEC-003:** Unauthorized access blocked (deep-link to `contactList` without token) (P0, High).

## Performance & Reliability
- **TC-PERF-001:** Contact list loads under threshold (e.g., < 3s) (P2, Medium).
- **TC-PERF-002:** Add/edit completes under threshold (P2, Medium).
- **TC-REL-001:** Retries recover on transient 5xx (P2, Low).

## Cross-Browser
- **TC-CROSS-001:** Core flows pass on Chromium (P0, High), Firefox (P0, High).
- **TC-CROSS-002:** Inputs behave consistently across browsers (P1, Medium).

## Accessibility (A11y)
- **TC-A11Y-001:** Headings and form labels associated correctly (P1, Medium).
- **TC-A11Y-002:** Buttons have accessible names (P1, Medium).
- **TC-A11Y-003:** Keyboard navigation through forms works (P2, Medium).

## Observability & Reporting
- **TC-OBS-001:** Failure screenshots attached in Allure (P0, High).
- **TC-OBS-002:** Allure results generated per project (Chromium/Firefox) (P1, Medium).

## Mapping to Current Automation
- **Covers:** [tests/e2e-smoke.spec.ts](tests/e2e-smoke.spec.ts) contains sign-up, login, add, edit (golden path E2E).
- **Helpers:** [tests/utils/testHelpers.ts](tests/utils/testHelpers.ts) provide context IDs, user/contact setup, and failure attachments.
- **Pages:** [tests/pages/SignupPage.ts](tests/pages/SignupPage.ts), [tests/pages/LoginPage.ts](tests/pages/LoginPage.ts), [tests/pages/AddContactPage.ts](tests/pages/AddContactPage.ts), [tests/pages/ContactListPage.ts](tests/pages/ContactListPage.ts).

## Automation Backlog Suggestions
- **New specs:**
  - `auth.spec.ts` for negative auth (TC-AUTH-003/004/007, TC-SEC-003).
  - `contacts.spec.ts` for validations and duplicate checks (TC-CONTACT-003/004/005/008).
  - `api.spec.ts` for direct API contract checks (TC-API-001..005).
  - `a11y.spec.ts` with axe checks for headings/labels (TC-A11Y-001..003).
- **Infra:** Add Playwright fixtures for token/session, reusable API client.
- **Reporting:** Ensure Allure attaches per-project and include traces on retry.

## Exit Criteria
- **Core P0s green on all browsers** and **key P1s** stable.
- **Allure artifacts present** (results + screenshots for failures).
- **No critical accessibility violations** on core pages.
