import { test, expect } from '@playwright/test';

/**
 * Example 4: Controlling Worker Count
 *
 * You can control the number of parallel workers at the describe level.
 * Use test.describe.configure() to limit parallelism for specific test suites.
 */

test.describe('limited parallelism suite', () => {
  // Configure this suite to use only 1 worker (run tests serially)
  test.describe.configure({ mode: 'serial' });

  test('limited parallel test 1', async ({ page }) => {
    console.log('Limited test 1 started at:', new Date().toISOString());
    await page.goto('/');
    await page.waitForTimeout(500);
    await expect(page).toHaveTitle(/Playwright/);
    console.log('Limited test 1 completed at:', new Date().toISOString());
  });

  test('limited parallel test 2', async ({ page }) => {
    console.log('Limited test 2 started at:', new Date().toISOString());
    await page.goto('/docs/intro');
    await page.waitForTimeout(500);
    await expect(page.locator('h1')).toBeVisible();
    console.log('Limited test 2 completed at:', new Date().toISOString());
  });

  test('limited parallel test 3', async ({ page }) => {
    console.log('Limited test 3 started at:', new Date().toISOString());
    await page.goto('/community/welcome');
    await page.waitForTimeout(500);
    await expect(page.locator('h1')).toBeVisible();
    console.log('Limited test 3 completed at:', new Date().toISOString());
  });
});

test.describe('parallel execution suite', () => {
  // This suite will use default parallel execution
  test.describe.configure({ mode: 'parallel' });

  test('parallel worker test 1', async ({ page }) => {
    console.log('Parallel worker test 1 started at:', new Date().toISOString());
    await page.goto('/');
    await page.waitForTimeout(500);
    await expect(page).toHaveTitle(/Playwright/);
    console.log('Parallel worker test 1 completed at:', new Date().toISOString());
  });

  test('parallel worker test 2', async ({ page }) => {
    console.log('Parallel worker test 2 started at:', new Date().toISOString());
    await page.goto('/docs/intro');
    await page.waitForTimeout(500);
    await expect(page.locator('h1')).toBeVisible();
    console.log('Parallel worker test 2 completed at:', new Date().toISOString());
  });

  test('parallel worker test 3', async ({ page }) => {
    console.log('Parallel worker test 3 started at:', new Date().toISOString());
    await page.goto('/community/welcome');
    await page.waitForTimeout(500);
    await expect(page.locator('h1')).toBeVisible();
    console.log('Parallel worker test 3 completed at:', new Date().toISOString());
  });
});
