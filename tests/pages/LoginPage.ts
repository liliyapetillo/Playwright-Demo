import { Page, APIRequestContext, expect, TestInfo } from '@playwright/test';
import { TestUser } from '../utils/user';
import { saveToken } from '../utils/token';

export class LoginPage {
  private page: Page;
  private request: APIRequestContext;

  constructor(page: Page, request: APIRequestContext) {
    this.page = page;
    this.request = request;
  }

  async loginWithUser(user: TestUser) {
    console.log(user.email);
    await this.page.getByPlaceholder('Email').fill(user.email);
    await this.page.getByPlaceholder('Password').fill('password');
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }

  async verifyAPILoginSuccess(user: TestUser, testInfo: TestInfo) {
    const response = await this.request.post('/users/login', {
      data: {
        email: user.email,
        password: 'password'
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeDefined();
    
    await saveToken(body.token, user.email, testInfo.workerIndex.toString());

    const profileResponse = await this.request.get('/users/me', {
      headers: {
        'Authorization': `Bearer ${body.token}`
      }
    });

    expect(profileResponse.status()).toBe(200);
    const profile = await profileResponse.json();
    expect(profile.email).toBe(user.email);
    console.log(`Verified user profile for: ${user.email}`);
  }
}
