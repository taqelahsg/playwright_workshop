import { test, expect } from '@playwright/test';

/**
 * Authenticated User Tests
 *
 * These tests run in the 'authenticated' project only.
 * They assume user is already logged in via the setup project.
 *
 * Run with: npm run test:authenticated
 */

test.describe('Authenticated User - Dashboard', () => {
  test('should access authenticated areas', async ({ page }) => {
    // This test assumes authentication state is loaded
    await page.goto('/');

    // For demo purposes, just verify we can navigate
    await expect(page).toHaveTitle(/Playwright/);

    console.log('Running as authenticated user');
    console.log('Storage state loaded from: playwright/.auth/user.json');
  });

  test('should have user session', async ({ page }, testInfo) => {
    console.log(`Project: ${testInfo.project.name}`);
    console.log('This test has access to authenticated user cookies and storage');

    await page.goto('/');

    // In a real application, you would check for user-specific elements
    // For example:
    // await expect(page.getByText('Welcome, User!')).toBeVisible();
    // await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

    await expect(page).toHaveTitle(/Playwright/);
  });

  test('should access user profile', async ({ page }) => {
    await page.goto('/');

    // This is a mock test - in real app you'd navigate to profile
    // await page.getByRole('link', { name: 'Profile' }).click();
    // await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();

    await expect(page).toHaveTitle(/Playwright/);
    console.log('Authenticated user can access protected routes');
  });
});

test.describe('Authenticated User - Settings', () => {
  test('should access settings page', async ({ page }) => {
    await page.goto('/');

    // Mock example - in real app:
    // await page.getByRole('link', { name: 'Settings' }).click();
    // await expect(page).toHaveURL(/.*settings/);

    console.log('Testing settings with authenticated session');
  });
});
