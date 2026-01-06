/**
 * CONFIGURATION DEMO: Timeout Settings
 *
 * This test file demonstrates how timeouts work in Playwright.
 * Timeouts can be configured at multiple levels:
 * 1. Global config (playwright.config.ts)
 * 2. Test file level (test.setTimeout)
 * 3. Individual test level (test.setTimeout inside test)
 *
 * Reference: https://playwright.dev/docs/test-configuration#timeout
 */

import { test, expect } from '@playwright/test';

// Set timeout for all tests in this file to 60 seconds
test.setTimeout(60000);

test.describe('Timeout Configuration Examples', () => {

  test('should respect default timeout from config', async ({ page }) => {
    // This test uses the timeout set above (60 seconds)
    // In playwright.config.ts, default timeout is 30 seconds
    // This test overrides it with the test.setTimeout() call above

    await page.goto('https://playwright.dev/');

    // Web-first assertions have their own timeout (default 5 seconds)
    // This is configured in playwright.config.ts under expect.timeout
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('should handle slow operations with custom timeout', async ({ page }) => {
    // Override timeout for this specific test only
    test.setTimeout(90000); // 90 seconds for this test

    await page.goto('https://playwright.dev/');

    // Simulate a slow operation by waiting
    await page.waitForTimeout(2000);

    // Assertions still use the expect timeout (5 seconds by default)
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  });

  test('should demonstrate assertion timeout', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // This assertion will wait up to 5 seconds (default expect.timeout)
    // for the element to become visible
    // If it doesn't appear within 5 seconds, the test fails
    await expect(page.getByRole('heading', { name: 'Playwright enables' })).toBeVisible();

    // You can override assertion timeout for specific assertions
    await expect(page.getByRole('banner')).toBeVisible({ timeout: 10000 }); // Wait 10 seconds
  });

  test('should demonstrate navigation timeout', async ({ page }) => {
    // Navigation operations (goto, click, etc.) use the test timeout
    // You can also set a specific navigation timeout in the config
    // under use.navigationTimeout

    await page.goto('https://playwright.dev/', {
      timeout: 30000, // Wait max 30 seconds for page to load
    });

    await expect(page).toHaveURL(/playwright.dev/);
  });
});

/**
 * CONFIGURATION TIP: Timeout Hierarchy
 *
 * 1. Test timeout (test.setTimeout) - Applies to entire test
 * 2. Navigation timeout (use.navigationTimeout) - Applies to page navigations
 * 3. Action timeout (use.actionTimeout) - Applies to user actions (click, fill, etc.)
 * 4. Assertion timeout (expect.timeout) - Applies to assertions only
 *
 * Each level can override the previous one.
 *
 * Example configuration in playwright.config.ts:
 *
 * export default defineConfig({
 *   timeout: 30000,  // Test timeout: 30 seconds
 *
 *   use: {
 *     navigationTimeout: 20000,  // Navigation: 20 seconds
 *     actionTimeout: 10000,      // Actions: 10 seconds
 *   },
 *
 *   expect: {
 *     timeout: 5000,  // Assertions: 5 seconds
 *   },
 * });
 */
