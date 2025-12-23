import { test, expect } from '@playwright/test';
import { contextIdFor, ensureUserExists } from './utils/testHelpers';

// [TC-API-001][TC-API-002] Login returns token; /users/me returns profile
test('[TC-API-001,002] Login token and /users/me profile', async ({ page, request }, testInfo) => {
  const contextId = contextIdFor(testInfo);
  const user = await ensureUserExists(contextId, page, request);

  const resp = await request.post('/users/login', {
    data: { email: user.email, password: 'password' },
  });
  expect(resp.status()).toBe(200);
  const body = await resp.json();
  expect(body.token).toBeDefined();

  const me = await request.get('/users/me', {
    headers: { Authorization: `Bearer ${body.token}` },
  });
  expect(me.status()).toBe(200);
  const profile = await me.json();
  expect(profile.email).toBe(user.email);
});

// [TC-API-005] Invalid input returns an error (unauthorized example)
test('[TC-API-005] Unauthorized /users/me returns 401/403', async ({ request }) => {
  const me = await request.get('/users/me');
  expect([401, 403]).toContain(me.status());
});
