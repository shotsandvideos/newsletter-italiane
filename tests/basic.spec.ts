import { test, expect } from '@playwright/test';

test('basic homepage loads', async ({ page }) => {
  await page.goto('/');
  
  // Simple checks that should always work
  await expect(page).toHaveTitle(/Frames/);
  
  // Check if page has loaded by looking for any text
  await expect(page.locator('body')).toContainText('newsletter', { timeout: 10000 });
});

test('authentication redirect works', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Should redirect to sign-in
  await page.waitForURL(/\/auth\/sign-in/, { timeout: 5000 });
  await expect(page).toHaveURL(/\/auth\/sign-in/);
});

test('homepage has navigation', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  
  // Look for common navigation patterns
  const navigation = page.locator('nav').first();
  await expect(navigation).toBeVisible({ timeout: 10000 });
});