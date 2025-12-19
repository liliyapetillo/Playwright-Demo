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
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    }
  }
}
