import { Page, APIRequestContext, expect, TestInfo } from '@playwright/test';
import { TestUser } from '../utils/user';
import { saveToken } from '../utils/token';
import { fillInput, clickButton } from '../utils/resilience';

export class LoginPage {
  private page: Page;
  private request: APIRequestContext;

  constructor(page: Page, request: APIRequestContext) {
    this.page = page;
    this.request = request;
  }

  async loginWithUser(user: TestUser) {
    console.log(user.email);
    await fillInput(this.page, user.email, [
      { placeholder: 'Email' },
      { id: '#email' },
      { label: 'Email' },
    ]);
    await fillInput(this.page, 'password', [
      { placeholder: 'Password' },
      { id: '#password' },
      { label: 'Password' },
    ]);
    await clickButton(this.page, ['Submit', 'Log in', 'Login']);
  }

  async verifyAPILoginSuccess(user: TestUser, testInfo: TestInfo) {
    // Poll UI storage briefly after login (helps when storage writes are delayed)
    const grabUiToken = async () => {
      return await this.page.evaluate(() => {
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
    };

    let token: string | null = null;
    for (let i = 0; i < 5 && !token; i++) {
      token = await grabUiToken();
      if (!token) await this.page.waitForTimeout(200);
    }

    // Cookie-based auth fallback (some deployments set a token cookie only)
    if (!token) {
      const cookies = await this.page.context().cookies();
      const cookieToken = cookies.find((c) => ['token', 'authToken', 'jwt'].includes(c.name))?.value;
      if (cookieToken) token = cookieToken;
    }

    // Fallback to API login if UI storage/cookie didn’t populate
    const apiLogin = async () => {
      const apiResp = await this.request.post('/users/login', {
        data: { email: user.email, password: 'password' }
      });
      if (apiResp.status() !== 200) {
        const failureBody = await apiResp.text();
        throw new Error(`API login failed with status ${apiResp.status()}: ${failureBody}`);
      }
      const body = await apiResp.json();
      return (body.token as string) || (body.accessToken as string) || null;
    };

    if (!token) {
      let apiError: Error | null = null;
      for (let attempt = 0; attempt < 2 && !token; attempt++) {
        try {
          token = await apiLogin();
        } catch (err: any) {
          apiError = err;
          await this.page.waitForTimeout(300);
        }
      }
      if (!token && apiError) throw apiError;
    }

    expect(token, 'Auth token should be present from UI or API').toBeTruthy();

    const contextId = `${testInfo.project.name}-${testInfo.workerIndex}`;
    await saveToken(token as string, user.email, contextId);

    const profileResponse = await this.request.get('/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    expect(profileResponse.status()).toBe(200);
    const profile = await profileResponse.json();
    expect(profile.email).toBe(user.email);
    console.log(`Verified user profile for: ${user.email}`);
  }
}
