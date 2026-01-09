import { test, expect } from '@playwright/test';

/**
 * Example 7: Fully Parallel Mode
 *
 * When fullyParallel is enabled in config, all tests run in parallel.
 * You can also enable it per file using test.describe.configure().
 */

// Enable fully parallel mode for this file
test.describe.configure({ mode: 'parallel' });

test.describe('fully parallel feature tests', () => {
  test('feature test 1 - homepage', async ({ page }) => {
    console.log('Feature test 1 executing');
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
    await page.waitForTimeout(1000); // Simulate work
  });

  test('feature test 2 - documentation', async ({ page }) => {
    console.log('Feature test 2 executing');
    await page.goto('/docs/intro');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(1000); // Simulate work
  });

  test('feature test 3 - API docs', async ({ page }) => {
    console.log('Feature test 3 executing');
    await page.goto('/docs/api/class-playwright');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(1000); // Simulate work
  });

  test('feature test 4 - community', async ({ page }) => {
    console.log('Feature test 4 executing');
    await page.goto('/community/welcome');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(1000); // Simulate work
  });

  test('feature test 5 - navigation', async ({ page }) => {
    console.log('Feature test 5 executing');
    await page.goto('/');
    await page.click('text=Docs');
    await expect(page).toHaveURL(/.*docs.*/);
    await page.waitForTimeout(1000); // Simulate work
  });

  test('feature test 6 - search', async ({ page }) => {
    console.log('Feature test 6 executing');
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
    await page.waitForTimeout(1000); // Simulate work
  });
});

test.describe('another fully parallel suite', () => {
  test('parallel suite test 1', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('parallel suite test 2', async ({ page }) => {
    await page.goto('/docs/intro');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('parallel suite test 3', async ({ page }) => {
    await page.goto('/community/welcome');
    await expect(page.locator('h1')).toBeVisible();
  });
});
