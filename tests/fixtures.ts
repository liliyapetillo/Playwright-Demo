import { test as base, expect } from '@playwright/test';
import { ensureUserExists, contextIdFor } from './utils/testHelpers';
import { LoginPage } from './pages/LoginPage';
import type { TestUser } from './utils/user';

export type Fixtures = {
  testUser: TestUser;
  loggedInPage: any;
};

export const test = base.extend<Fixtures>({
  testUser: async ({ page, request }, use, testInfo) => {
    const contextId = contextIdFor(testInfo);
    const user = await ensureUserExists(contextId, page, request);
    await use(user);
  },
  loggedInPage: async ({ page, request, testUser }, use) => {
    const login = new LoginPage(page, request);
    await page.goto('/');
    await login.loginWithUser(testUser);
    await page.waitForURL('**/contactList');
    await use(page);
  }
});

export { expect };
