/**
 * CONFIGURATION DEMO: Base URL
 *
 * This test file demonstrates how to use the baseURL configuration.
 * Base URL allows you to use relative paths in your tests, making it
 * easier to test different environments (dev, staging, production).
 *
 * Configuration in playwright.config.ts:
 * use: {
 *   baseURL: 'http://localhost:3000',
 * }
 *
 * Reference: https://playwright.dev/docs/test-configuration#basic-options
 */

import { test, expect } from '@playwright/test';

test.describe('Base URL Configuration', () => {

  test('should use relative path with baseURL', async ({ page, baseURL }) => {
    // When baseURL is configured, you can use relative paths
    // If baseURL is 'https://playwright.dev', then:
    // await page.goto('/') navigates to 'https://playwright.dev/'
    // await page.goto('/docs/intro') navigates to 'https://playwright.dev/docs/intro'

    console.log(`Base URL configured: ${baseURL}`);

    // Since we don't have baseURL configured in the example config,
    // we'll use absolute URLs
    // Uncomment the line below if you set baseURL in playwright.config.ts
    // await page.goto('/');

    // With absolute URL (works without baseURL)
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('should navigate to different pages with relative URLs', async ({ page }) => {
    // If baseURL is set, you can navigate easily between pages
    // await page.goto('/'); // Home page
    // await page.goto('/docs/intro'); // Docs page
    // await page.goto('/community/welcome'); // Community page

    // Without baseURL (using absolute URLs)
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);

    await page.goto('https://playwright.dev/docs/intro');
    await expect(page).toHaveURL(/.*docs\/intro/);
  });

  test('should allow absolute URLs to override baseURL', async ({ page }) => {
    // Even with baseURL configured, absolute URLs work
    // This is useful when testing external links or different domains

    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);

    // Navigate to a different domain (absolute URL always works)
    await page.goto('https://github.com/microsoft/playwright');
    await expect(page).toHaveURL(/.*github\.com/);
  });
});

/**
 * CONFIGURATION TIP: Environment-Specific Base URLs
 *
 * You can use environment variables to set different base URLs
 * for different environments:
 *
 * Example configuration in playwright.config.ts:
 *
 * export default defineConfig({
 *   use: {
 *     // Use environment variable or default to localhost
 *     baseURL: process.env.BASE_URL || 'http://localhost:3000',
 *
 *     // Alternative: Define specific environments
 *     baseURL: {
 *       dev: 'http://localhost:3000',
 *       staging: 'https://staging.example.com',
 *       production: 'https://example.com',
 *     }[process.env.ENV || 'dev'],
 *   },
 * });
 *
 * RUNNING TESTS WITH DIFFERENT BASE URLs:
 *
 * Development:
 * npx playwright test
 *
 * Staging:
 * BASE_URL=https://staging.example.com npx playwright test
 *
 * Production:
 * BASE_URL=https://example.com npx playwright test
 *
 * Or set environment variable:
 * export BASE_URL=https://staging.example.com
 * npx playwright test
 *
 * BENEFITS OF USING BASE URL:
 *
 * 1. Cleaner test code:
 *    await page.goto('/login')  // vs await page.goto('http://localhost:3000/login')
 *
 * 2. Easy environment switching:
 *    Same tests work on dev, staging, and production
 *
 * 3. Single source of truth:
 *    Change URL in one place (config) rather than in every test
 *
 * 4. Better maintenance:
 *    If domain changes, update only the config file
 *
 * EXAMPLE WITH DIFFERENT ENVIRONMENTS:
 *
 * // playwright.config.ts
 * const environments = {
 *   local: 'http://localhost:3000',
 *   dev: 'https://dev.example.com',
 *   staging: 'https://staging.example.com',
 *   prod: 'https://example.com',
 * };
 *
 * export default defineConfig({
 *   use: {
 *     baseURL: environments[process.env.ENV || 'local'],
 *   },
 * });
 *
 * // test.spec.ts
 * test('login flow', async ({ page }) => {
 *   await page.goto('/login');  // Works in all environments!
 *   await page.fill('[name="email"]', 'test@example.com');
 *   await page.fill('[name="password"]', 'password');
 *   await page.click('[type="submit"]');
 *   await expect(page).toHaveURL('/dashboard');
 * });
 *
 * COMBINING WITH WEB SERVER:
 *
 * export default defineConfig({
 *   webServer: {
 *     command: 'npm run start',
 *     port: 3000,
 *     reuseExistingServer: !process.env.CI,
 *   },
 *   use: {
 *     baseURL: 'http://localhost:3000',
 *   },
 * });
 *
 * This configuration:
 * 1. Starts your dev server automatically
 * 2. Waits for it to be ready on port 3000
 * 3. Uses that URL as the base URL for tests
 * 4. Shuts down the server after tests complete
 */
