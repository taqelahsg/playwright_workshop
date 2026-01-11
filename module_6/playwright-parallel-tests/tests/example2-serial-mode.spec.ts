import { test, expect } from '@playwright/test';

/**
 * Example 2: Serial Mode
 *
 * Use test.describe.serial() to run tests in a specific order within a describe block.
 * If one test fails, all subsequent tests in the serial block are skipped.
 */

test.describe.serial('serial test suite', () => {
  let sharedData: string;

  test('serial test 1 - setup data', async ({ page }) => {
    await page.goto('/');
    sharedData = 'Data from test 1';
    console.log('Serial test 1: Setting up shared data');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('serial test 2 - use shared data', async ({ page }) => {
    console.log('Serial test 2: Using shared data:', sharedData);
    await page.goto('/docs/intro');
    await expect(page.locator('h1')).toBeVisible();
    expect(sharedData).toBe('Data from test 1');
  });

  test('serial test 3 - continue workflow', async ({ page }) => {
    console.log('Serial test 3: Continuing with shared data:', sharedData);
    await page.goto('/community/welcome');
    await expect(page.locator('h1')).toBeVisible();
  });
});

// These tests outside the serial block will run in parallel
test('parallel test outside serial block 1', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Playwright/);
  console.log('Parallel test 1 executed');
});

test('parallel test outside serial block 2', async ({ page }) => {
  await page.goto('/docs/intro');
  await expect(page.locator('h1')).toBeVisible();
  console.log('Parallel test 2 executed');
});
