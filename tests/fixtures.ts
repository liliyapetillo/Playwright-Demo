import { test as base, expect } from '@playwright/test';
import { ensureUserExists, contextIdFor } from './utils/testHelpers';
import { LoginPage } from './pages/LoginPage';
import type { TestUser } from './utils/user';
import path from 'path';
import fs from 'fs';

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
  loggedInPage: async ({ page, request, testUser }, use, testInfo) => {
    const login = new LoginPage(page, request);
    await page.goto('/');
    await login.loginWithUser(testUser);
    await page.waitForURL('**/contactList');
    
    // Attach screenshot on failure
    await use(page);
    
    if (testInfo.status !== 'passed') {
      const screenshotPath = path.join(testInfo.outputPath(''), `failure-screenshot.png`);
      fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
      await page.screenshot({ path: screenshotPath });
      await testInfo.attach('screenshot', { path: screenshotPath, contentType: 'image/png' });
    }
  }
});

export { expect };
