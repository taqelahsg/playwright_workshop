/**
 * CONFIGURATION DEMO: Parallel Execution
 *
 * This test file demonstrates how parallel test execution works in Playwright.
 * Playwright can run tests in parallel to speed up test execution.
 *
 * Configuration in playwright.config.ts:
 * fullyParallel: true  // Run all tests across all files in parallel
 * workers: 4           // Use 4 parallel workers
 *
 * Reference: https://playwright.dev/docs/test-configuration#parallel-tests
 */

import { test, expect } from '@playwright/test';

// By default, tests in a single file run in order
// Use test.describe.configure({ mode: 'parallel' }) to run them in parallel

test.describe('Parallel Execution Examples', () => {

  test('test 1 - runs in order by default', async ({ page }) => {
    console.log('Starting test 1');
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
    console.log('Finished test 1');
  });

  test('test 2 - runs after test 1', async ({ page }) => {
    console.log('Starting test 2');
    await page.goto('https://playwright.dev/');
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
    console.log('Finished test 2');
  });

  test('test 3 - runs after test 2', async ({ page }) => {
    console.log('Starting test 3');
    await page.goto('https://playwright.dev/');
    await expect(page.getByRole('heading', { name: 'Playwright enables' })).toBeVisible();
    console.log('Finished test 3');
  });
});

test.describe('Parallel Tests Within Same File', () => {
  // Configure this describe block to run tests in parallel
  test.describe.configure({ mode: 'parallel' });

  test('parallel test 1 - runs concurrently', async ({ page }) => {
    console.log('Starting parallel test 1');
    await page.goto('https://playwright.dev/');
    await page.waitForTimeout(2000); // Simulate slow operation
    await expect(page).toHaveTitle(/Playwright/);
    console.log('Finished parallel test 1');
  });

  test('parallel test 2 - runs concurrently', async ({ page }) => {
    console.log('Starting parallel test 2');
    await page.goto('https://playwright.dev/');
    await page.waitForTimeout(2000); // Simulate slow operation
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
    console.log('Finished parallel test 2');
  });

  test('parallel test 3 - runs concurrently', async ({ page }) => {
    console.log('Starting parallel test 3');
    await page.goto('https://playwright.dev/');
    await page.waitForTimeout(2000); // Simulate slow operation
    await expect(page.getByRole('heading', { name: 'Playwright enables' })).toBeVisible();
    console.log('Finished parallel test 3');
  });
});

test.describe('Serial Tests - Stop on First Failure', () => {
  // Configure this describe block to run tests serially (in order)
  test.describe.configure({ mode: 'serial' });

  // In serial mode, tests run in order
  // If one test fails, remaining tests are skipped

  test('serial test 1 - must pass for others to run', async ({ page }) => {
    console.log('Starting serial test 1');
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
    console.log('Finished serial test 1');
  });

  test('serial test 2 - runs only if test 1 passed', async ({ page }) => {
    console.log('Starting serial test 2');
    // This test reuses the page from test 1
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
    console.log('Finished serial test 2');
  });

  test('serial test 3 - runs only if test 2 passed', async ({ page }) => {
    console.log('Starting serial test 3');
    // This test continues from test 2
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*docs\/intro/);
    console.log('Finished serial test 3');
  });
});

test.describe('Worker Information', () => {

  test('should show worker index', async ({ page }, testInfo) => {
    // Each test runs in a worker process
    // testInfo contains information about the worker
    console.log(`Worker index: ${testInfo.workerIndex}`);
    console.log(`Parallel index: ${testInfo.parallelIndex}`);
    console.log(`Project name: ${testInfo.project.name}`);

    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });
});

/**
 * CONFIGURATION TIP: Parallel Execution Modes
 *
 * 1. File-level Parallelization (fullyParallel: true)
 *    - Tests in different files run in parallel
 *    - Controlled by 'workers' config
 *    - Default behavior with modern Playwright
 *
 * 2. Within-file Parallelization
 *    - Use test.describe.configure({ mode: 'parallel' })
 *    - Tests in same file run concurrently
 *    - Each test gets its own browser context
 *
 * 3. Serial Execution
 *    - Use test.describe.configure({ mode: 'serial' })
 *    - Tests run in order
 *    - Stop on first failure
 *    - Share browser context (useful for dependent tests)
 *
 * Example configuration in playwright.config.ts:
 *
 * export default defineConfig({
 *   // Run all tests in all files in parallel
 *   fullyParallel: true,
 *
 *   // Number of parallel workers
 *   workers: 4,  // Use 4 parallel workers
 *   // OR
 *   workers: '50%',  // Use 50% of CPU cores
 *   // OR
 *   workers: process.env.CI ? 1 : undefined,  // 1 worker on CI, default locally
 * });
 *
 * PERFORMANCE TIP:
 * - More workers = faster execution (up to a point)
 * - Too many workers can cause resource contention
 * - On CI, use fewer workers for stability (usually 1)
 * - Locally, use more workers for speed (default is 50% of CPU cores)
 *
 * ISOLATION TIP:
 * - Each test gets a fresh browser context
 * - Tests don't share cookies, local storage, etc.
 * - This ensures test independence
 * - Serial mode is an exception (shares context)
 */
