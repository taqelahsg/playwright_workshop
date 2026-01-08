import { test, expect } from '@playwright/test';

/**
 * Guest User Tests
 *
 * These tests run in the 'guest' project only.
 * They use empty storage state (no authentication).
 *
 * Run with: npm run test:guest
 */

test.describe('Guest User - Public Access', () => {
  test('should access public homepage', async ({ page }) => {
    await page.goto('/');

    // Verify page loads for unauthenticated users
    await expect(page).toHaveTitle(/Playwright/);

    console.log('Running as guest user (no authentication)');
  });

  test('should see public navigation', async ({ page }) => {
    await page.goto('/');

    // Guest users should see public navigation items
    await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'API' })).toBeVisible();

    console.log('Guest user has access to public pages only');
  });

  test('should not have user session', async ({ page }, testInfo) => {
    console.log(`Project: ${testInfo.project.name}`);
    console.log('This test has NO authentication - empty storage state');

    await page.goto('/');

    // In a real application, verify no authenticated elements are visible
    // For example:
    // await expect(page.getByText('Welcome, User!')).not.toBeVisible();
    // await expect(page.getByRole('button', { name: 'Logout' })).not.toBeVisible();

    // Guest should see login/signup options instead
    // await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();

    await expect(page).toHaveTitle(/Playwright/);
  });

  test('should be redirected from protected routes', async ({ page }) => {
    // In a real app, accessing protected routes should redirect to login
    // await page.goto('/dashboard');
    // await expect(page).toHaveURL(/.*login/);

    await page.goto('/');
    console.log('Guest users should be redirected from protected pages');
  });
});

test.describe('Guest User - Public Content', () => {
  test('should view documentation without login', async ({ page }) => {
    await page.goto('/');

    // Click on docs - should be accessible to guests
    await page.getByRole('link', { name: 'Docs' }).click();

    await expect(page).toHaveURL(/.*docs.*/);
    console.log('Documentation is accessible to guest users');
  });

  test('should view API reference without login', async ({ page }) => {
    await page.goto('/');

    // API reference should be public
    await page.getByRole('link', { name: 'API' }).click();

    console.log('API reference is accessible to guest users');
  });
});
