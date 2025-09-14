import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveTitle(/Frames/);
});

test('homepage navigation works', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Check if main navigation elements exist
  await expect(page.getByText('Iscriviti').first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Scopri Newsletter')).toBeVisible({ timeout: 10000 });
});

test('newsletter registration form loads', async ({ page }) => {
  await page.goto('/dashboard/newsletters');
  
  // Should redirect to login if not authenticated
  await expect(page).toHaveURL(/\/auth\/sign-in/);
});

test('homepage hero section loads', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Check for hero section content
  await expect(page.getByText('Monetizza la tua newsletter')).toBeVisible({ timeout: 10000 });
});

test('homepage client logos section loads', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Check if client section loads
  await expect(page.getByText('Utilizzato da centinaia di aziende')).toBeVisible({ timeout: 10000 });
});