import { test, expect } from '@playwright/test';

/**
 * Smoke Tests
 *
 * These tests run ONLY in the 'smoke' project.
 * Smoke tests verify critical functionality and should be fast.
 *
 * Run with: npm run test:smoke
 */

test.describe('Smoke Tests - Critical Path', () => {
  test('homepage loads successfully', async ({ page }) => {
    // This should complete quickly
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('main navigation is visible', async ({ page }) => {
    await page.goto('/');

    // Verify key navigation elements
    await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'API' })).toBeVisible();
  });

  test('search functionality exists', async ({ page }) => {
    await page.goto('/');

    // Check if search is available
    const searchButton = page.getByRole('button', { name: /search/i }).first();
    await expect(searchButton).toBeVisible();
  });
});

test.describe('Smoke Tests - Quick Checks', () => {
  test('footer is rendered', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer and verify
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });
});
