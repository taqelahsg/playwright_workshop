/**
 * CONFIGURATION DEMO: Retries
 *
 * This test file demonstrates how test retries work in Playwright.
 * Retries help handle flaky tests by automatically re-running failed tests.
 *
 * Configuration in playwright.config.ts:
 * retries: process.env.CI ? 2 : 0  // Retry twice on CI, no retries locally
 *
 * Reference: https://playwright.dev/docs/test-configuration#retries
 */

import { test, expect } from '@playwright/test';

test.describe('Retry Configuration Examples', () => {

  test('should pass on first attempt - stable test', async ({ page }) => {
    // This test should always pass, no retries needed
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  // You can configure retries at the test level
  test('should retry on failure - test level config', async ({ page }) => {
    // Override retries for this specific test
    test.info().annotations.push({ type: 'retries', description: '2 retries' });

    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);

    // Note: To see retries in action, you would need to make this test fail intermittently
  });

  test('should demonstrate retry information in test context', async ({ page }, testInfo) => {
    // testInfo contains information about the current test execution
    console.log(`Attempt number: ${testInfo.retry + 1}`);
    console.log(`Max retries configured: ${testInfo.project.retries}`);

    await page.goto('https://playwright.dev/');

    // You can use retry information to add conditional logic
    if (testInfo.retry > 0) {
      console.log('This is a retry attempt - may want to add extra wait time');
      await page.waitForTimeout(1000);
    }

    await expect(page).toHaveTitle(/Playwright/);
  });

  test('should show trace collection on retry', async ({ page }) => {
    // In playwright.config.ts, trace is set to 'on-first-retry'
    // This means traces are only collected when a test is retried
    //
    // Trace options:
    // - 'off': Never collect traces
    // - 'on': Always collect traces
    // - 'retain-on-failure': Keep traces only for failed tests
    // - 'on-first-retry': Start collecting from first retry

    await page.goto('https://playwright.dev/');
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  });
});

/**
 * SIMULATED FLAKY TEST (Commented out to prevent actual failures)
 *
 * This is an example of a flaky test that would benefit from retries:
 */
/*
test('flaky test - sometimes passes, sometimes fails', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Simulate flakiness with random failure
  const shouldFail = Math.random() > 0.5;
  if (shouldFail) {
    throw new Error('Simulated flaky test failure');
  }

  await expect(page).toHaveTitle(/Playwright/);

  // With retries configured (e.g., 2 retries), this test has 3 chances to pass:
  // 1. Initial attempt
  // 2. First retry
  // 3. Second retry

  // The test passes if ANY attempt succeeds
});
*/

/**
 * CONFIGURATION TIP: When to Use Retries
 *
 * GOOD use cases for retries:
 * - Tests that interact with third-party services
 * - Tests with network-dependent operations
 * - E2E tests with complex timing scenarios
 * - CI environments where occasional failures are expected
 *
 * BAD use cases (fix the test instead):
 * - Tests with incorrect selectors
 * - Tests with race conditions (use proper waits)
 * - Tests with incorrect logic
 * - Unit tests (should be deterministic)
 *
 * Best Practice:
 * - Use retries on CI (retries: process.env.CI ? 2 : 0)
 * - Don't use retries locally (helps identify flaky tests during development)
 * - Investigate and fix tests that frequently need retries
 *
 * Example configuration in playwright.config.ts:
 *
 * export default defineConfig({
 *   // Different retry strategies for different environments
 *   retries: process.env.CI ? 2 : 0,
 *
 *   use: {
 *     // Capture trace on retry to debug failures
 *     trace: 'on-first-retry',
 *
 *     // Keep screenshots and videos for failed tests
 *     screenshot: 'only-on-failure',
 *     video: 'retain-on-failure',
 *   },
 * });
 */
