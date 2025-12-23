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
