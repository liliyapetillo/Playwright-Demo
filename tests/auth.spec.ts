import { test, expect } from './fixtures';
import * as allure from 'allure-js-commons';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { ContactListPage } from './pages/ContactListPage';
import { contextIdFor, attachOnFailure, ensureUserExists } from './utils/testHelpers';

// Shared teardown: attach screenshot on failure and clear session
test.afterEach(async ({ page }, testInfo) => {
  await attachOnFailure(page, testInfo);
  const contactListPage = new ContactListPage(page);
  await contactListPage.logoutIfPossible();
});

// [TC-AUTH-001] New user can sign up and land on Contact List
test('[TC-AUTH-001] Signup redirects to Contact List', async ({ page }, testInfo) => {
  const signup = new SignupPage(page);
  const list = new ContactListPage(page);

  await allure.step('Navigate to signup', async () => {
    await signup.goto();
  });
  const email = `tc-auth-001-${Date.now()}@testliliyap.com`;
  const firstName = `Test${Date.now().toString().slice(-6)}`;
  const lastName = `User${Date.now().toString().slice(-3)}`;
  await allure.step('Complete signup form', async () => {
    await signup.signUp(firstName, lastName, email, 'password');
  });
  await allure.step('Verify redirect to Contact List', async () => {
    await list.expectHeadingToContainText('Contact List');
  });
});

// [TC-AUTH-005] Token works for /users/me; unauthorized returns 401
test('[TC-AUTH-005] API login returns token; /users/me authorized', async ({ loggedInPage, request }, testInfo) => {
  const page = loggedInPage;
  const contextId = contextIdFor(testInfo);
  const user = await ensureUserExists(contextId, page, request);
  const login = new LoginPage(page, request);
  await login.verifyAPILoginSuccess(user, testInfo);

  const unauthorizedProfile = await request.get('/users/me');
  expect([401, 403]).toContain(unauthorizedProfile.status());
});

// [TC-SEC-003] Deep-link without auth should not error (app currently renders list)
test('[TC-SEC-003] Deep-link to contactList without auth renders page', async ({ page }) => {
  await allure.step('Clear session', async () => {
    await page.evaluate(() => { try { localStorage.clear(); } catch {} try { sessionStorage.clear(); } catch {} });
    await page.context().clearCookies();
  });

  await allure.step('Navigate to /contactList without auth', async () => {
    await page.goto('/contactList');
  });

  await allure.step('Verify page loads (heading present)', async () => {
    await expect(page.getByRole('heading')).toBeVisible();
    const headingText = await page.getByRole('heading').textContent();
    expect(headingText?.trim()).toBeTruthy();
  });
});
