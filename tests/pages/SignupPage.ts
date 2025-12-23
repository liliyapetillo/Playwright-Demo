import { Page } from '@playwright/test';
import { fillInput, clickButton } from '../utils/resilience';

export class SignupPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/addUser');
  }

  async signUp(firstName: string, lastName: string, email: string, password: string) {
    await fillInput(this.page, firstName, [
      { placeholder: 'First Name' },
      { id: '#firstName' },
      { label: 'First Name' },
    ]);
    await fillInput(this.page, lastName, [
      { placeholder: 'Last Name' },
      { id: '#lastName' },
      { label: 'Last Name' },
    ]);
    await fillInput(this.page, email, [
      { placeholder: 'Email' },
      { id: '#email' },
      { label: 'Email' },
    ]);
    await fillInput(this.page, password, [
      { placeholder: 'Password' },
      { id: '#password' },
      { label: 'Password' },
    ]);
    await clickButton(this.page, ['Submit', 'Sign Up', 'Create Account']);
  }
}
