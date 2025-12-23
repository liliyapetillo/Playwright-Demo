import { Page } from '@playwright/test';
import { clickButton } from '../utils/resilience';

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
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
}
