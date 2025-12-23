import { test, expect } from '@playwright/test';

// Basic accessibility checks without external deps

test('[TC-A11Y-001] Page has main heading and form labels', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading')).toContainText('Contact List App');
  await expect(page.getByPlaceholder('Email')).toBeVisible();
  await expect(page.getByPlaceholder('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
});

test('[TC-A11Y-002] Buttons have accessible names', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
});
