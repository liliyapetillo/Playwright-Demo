import { test, expect } from './fixtures';

test.describe('Session Management & Auth', () => {
  test('[TC-AUTH-007] Unauthorized request without token', async ({ request }) => {
    const resp = await request.get('/contacts', {
      headers: { 'Authorization': 'Bearer invalid-token' }
    });
    expect(resp.status()).toBe(401);
  });

  test('[TC-AUTH-006] Profile endpoint protected by auth', async ({ request }) => {
    const resp = await request.get('/users/me');
    expect(resp.status()).toBe(401);
  });

  test('[TC-NAV-001] Contacts endpoint requires valid token', async ({ request }) => {
    // No auth = 401
    const noAuth = await request.get('/contacts');
    expect(noAuth.status()).toBe(401);
  });
});
