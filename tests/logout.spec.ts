import { test, expect } from './fixtures';
import { ContactListPage } from './pages/ContactListPage';
import { attachOnFailure } from './utils/testHelpers';

test.afterEach(async ({ page }, testInfo) => {
  await attachOnFailure(page, testInfo);
});

// [TC-AUTH-006] Logout clears session storage and returns to login page
test('[TC-AUTH-006] Logout clears session and returns to login page', async ({ loggedInPage }) => {
  const page = loggedInPage;
  const contactList = new ContactListPage(page);

  await test.step('Log out via UI', async () => {
    await contactList.logout();
  });

  await test.step('Verify redirected away from contact list', async () => {
    await page.waitForURL((url) => !url.pathname.includes('contactList'));
  });

  await test.step('Verify session storage cleared', async () => {
    const token = await page.evaluate(() => {
      try {
        return (
          localStorage.getItem('token') ||
          localStorage.getItem('authToken') ||
          sessionStorage.getItem('token') ||
          sessionStorage.getItem('authToken')
        );
      } catch {
        return null;
      }
    });
    expect(token).toBeFalsy();
  });
});

// [TC-AUTH-007] Unauthorized API request without a valid token is rejected
test('[TC-AUTH-007] Unauthorized request without token', async ({ request }) => {
  const resp = await request.get('/contacts', {
    headers: { 'Authorization': 'Bearer invalid-token' }
  });
  expect(resp.status()).toBe(401);
});
