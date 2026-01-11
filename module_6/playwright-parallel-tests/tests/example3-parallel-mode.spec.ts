import { test, expect } from '@playwright/test';

/**
 * Example 3: Explicitly Parallel Mode
 *
 * Use test.describe.parallel() to explicitly mark tests to run in parallel.
 * This is useful when you want to be explicit about parallelization.
 */

test.describe.parallel('explicitly parallel suite', () => {
  test('parallel test A', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000); // Simulate longer test
    await expect(page).toHaveTitle(/Playwright/);
    console.log('Parallel test A completed');
  });

  test('parallel test B', async ({ page }) => {
    await page.goto('/docs/intro');
    await page.waitForTimeout(1000); // Simulate longer test
    await expect(page.locator('h1')).toBeVisible();
    console.log('Parallel test B completed');
  });

  test('parallel test C', async ({ page }) => {
    await page.goto('/community/welcome');
    await page.waitForTimeout(1000); // Simulate longer test
    await expect(page.locator('h1')).toBeVisible();
    console.log('Parallel test C completed');
  });

  test('parallel test D', async ({ page }) => {
    await page.goto('/docs/api/class-playwright');
    await page.waitForTimeout(1000); // Simulate longer test
    await expect(page.locator('h1')).toBeVisible();
    console.log('Parallel test D completed');
  });
});
