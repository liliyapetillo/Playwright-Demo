import { Page, expect } from '@playwright/test';

export class ContactListPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectHeadingToContainText(text: string) {
    await expect(this.page.getByRole('heading')).toContainText(text);
  }

  async clickLogout() {
    await this.page.getByRole('button', { name: 'Logout' }).click();
  }

  async logout() {
    await this.clickLogout();
  }

  async getPageTitle() {
    return await this.page.locator('h1, h2').first().textContent();
  }

  async isContactListVisible() {
    return await this.page.getByRole('heading', { name: /contact list/i }).isVisible().catch(() => false);
  }

  async logoutIfPossible() {
    const logoutButton = this.page.getByRole('button', { name: 'Logout' });
    try {
      const visible = await logoutButton.isVisible();
      if (visible) {
        // Avoid teardown navigation: clear storage and cookies instead
        await this.page.evaluate(() => {
          try { localStorage.clear(); } catch {}
          try { sessionStorage.clear(); } catch {}
        });
        try {
          await this.page.context().clearCookies();
        } catch {}
      }
    } catch {}
  }
}
