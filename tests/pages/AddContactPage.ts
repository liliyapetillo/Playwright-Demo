import { Page, expect } from '@playwright/test';
import { clickButton, waitForRowWithText } from '../utils/resilience';

export class AddContactPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async addContact(contact: {
    firstName: string;
    lastName: string;
    dob: string;
    email: string;
    phone: string;
    country: string;
    postalCode: string;
    city: string;
    state: string;
    address: string;
  }) {
    await expect(this.page.getByRole('heading')).toContainText('Contact List', { timeout: 10000 });
    await clickButton(this.page, ['Add a New Contact', 'Add New Contact', 'Add Contact']);
    await this.page.locator('#firstName').fill(contact.firstName);
    await this.page.locator('#lastName').fill(contact.lastName);
    await this.page.locator('#birthdate').fill(contact.dob);
    await this.page.locator('#email').fill(contact.email);
    await this.page.locator('#phone').fill(contact.phone);
    await this.page.locator('#street1').fill(contact.address);
    await this.page.locator('#city').fill(contact.city);
    await this.page.locator('#stateProvince').fill(contact.state);
    await this.page.locator('#postalCode').fill(contact.postalCode);
    await this.page.locator('#country').fill(contact.country);
    await clickButton(this.page, ['Submit', 'Save']);

    // Handle both flows: contactDetails or direct back to list
    try {
      await this.page.waitForURL('**/contactDetails', { timeout: 5000 });
      await clickButton(this.page, ['Return to Contact List', 'Back to List', 'Back']);
      await this.page.waitForURL('**/contactList', { timeout: 10000 });
    } catch {
      await this.page.waitForURL('**/contactList', { timeout: 10000 }).catch(() => {});
    }

    await waitForRowWithText(this.page, '#myTable', contact.email, { timeout: 15000 });
  }
}
