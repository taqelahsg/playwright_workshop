/**
 * CONFIGURATION DEMO: Projects and Multi-Browser Testing
 *
 * This test file demonstrates how projects work in Playwright.
 * Projects allow you to run the same tests across multiple browsers,
 * devices, and configurations.
 *
 * Configuration in playwright.config.ts:
 * projects: [
 *   { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
 *   { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
 *   { name: 'webkit', use: { ...devices['Desktop Safari'] } },
 * ]
 *
 * Reference: https://playwright.dev/docs/test-configuration#projects
 */

import { test, expect, devices } from '@playwright/test';

test.describe('Multi-Browser Testing', () => {

  test('should work across all configured browsers', async ({ page, browserName }) => {
    // This test will run in chromium, firefox, and webkit
    // as defined in playwright.config.ts
    console.log(`Running in browser: ${browserName}`);

    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);

    // You can add browser-specific logic if needed
    if (browserName === 'chromium') {
      console.log('Chrome-specific behavior');
    } else if (browserName === 'firefox') {
      console.log('Firefox-specific behavior');
    } else if (browserName === 'webkit') {
      console.log('Safari-specific behavior');
    }
  });

  test('should detect viewport size', async ({ page, viewport }) => {
    // Different projects can have different viewport sizes
    console.log(`Viewport: ${viewport?.width}x${viewport?.height}`);

    await page.goto('https://playwright.dev/');

    // You can test responsive behavior
    if (viewport && viewport.width < 768) {
      console.log('Mobile viewport - testing mobile menu');
      // Test mobile-specific elements
    } else {
      console.log('Desktop viewport - testing desktop menu');
      // Test desktop-specific elements
    }

    await expect(page).toHaveTitle(/Playwright/);
  });

  test('should access project metadata', async ({ page }, testInfo) => {
    // testInfo contains information about the current project
    console.log(`Project name: ${testInfo.project.name}`);
    console.log(`Project timeout: ${testInfo.project.timeout}`);
    console.log(`Project retries: ${testInfo.project.retries}`);

    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });
});

// Run only on specific browsers
test.describe('Browser-Specific Tests', () => {

  test('should run only on chromium', async ({ page, browserName }) => {
    // Skip this test if not running on chromium
    test.skip(browserName !== 'chromium', 'This test only runs on Chromium');

    console.log('Running Chromium-specific test');
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('should run only on firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'This test only runs on Firefox');

    console.log('Running Firefox-specific test');
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('should run only on webkit', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'This test only runs on WebKit');

    console.log('Running WebKit-specific test');
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });
});

test.describe('User Agent Testing', () => {

  test('should show user agent', async ({ page }) => {
    // User agent can be configured per project
    const userAgent = await page.evaluate(() => navigator.userAgent);
    console.log(`User Agent: ${userAgent}`);

    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });
});

/**
 * CONFIGURATION TIP: Advanced Project Setup
 *
 * Example configuration in playwright.config.ts:
 *
 * export default defineConfig({
 *   projects: [
 *     // Desktop Browsers
 *     {
 *       name: 'chromium',
 *       use: { ...devices['Desktop Chrome'] },
 *     },
 *     {
 *       name: 'firefox',
 *       use: { ...devices['Desktop Firefox'] },
 *     },
 *     {
 *       name: 'webkit',
 *       use: { ...devices['Desktop Safari'] },
 *     },
 *
 *     // Mobile Browsers
 *     {
 *       name: 'Mobile Chrome',
 *       use: { ...devices['Pixel 5'] },
 *     },
 *     {
 *       name: 'Mobile Safari',
 *       use: { ...devices['iPhone 12'] },
 *     },
 *
 *     // Tablet Browsers
 *     {
 *       name: 'iPad',
 *       use: { ...devices['iPad Pro'] },
 *     },
 *
 *     // Custom Project with Overrides
 *     {
 *       name: 'chromium-slow',
 *       use: {
 *         ...devices['Desktop Chrome'],
 *         viewport: { width: 1920, height: 1080 },
 *         launchOptions: {
 *           slowMo: 1000,  // Slow down by 1 second
 *         },
 *       },
 *       timeout: 60000,  // Custom timeout for this project
 *     },
 *
 *     // Project with Authentication Setup
 *     {
 *       name: 'setup',
 *       testMatch: '**\/*.setup.ts',
 *     },
 *     {
 *       name: 'chromium-authenticated',
 *       use: { ...devices['Desktop Chrome'] },
 *       dependencies: ['setup'],  // Run setup project first
 *     },
 *   ],
 * });
 *
 * RUNNING SPECIFIC PROJECTS:
 *
 * Run all projects (default):
 * npx playwright test
 *
 * Run specific project:
 * npx playwright test --project=chromium
 * npx playwright test --project=firefox
 * npx playwright test --project="Mobile Chrome"
 *
 * Run multiple specific projects:
 * npx playwright test --project=chromium --project=firefox
 *
 * AVAILABLE DEVICE PRESETS:
 *
 * Desktop:
 * - Desktop Chrome
 * - Desktop Firefox
 * - Desktop Safari
 * - Desktop Edge
 *
 * Mobile:
 * - iPhone 11, iPhone 12, iPhone 13, iPhone 14
 * - iPhone SE, iPhone XR
 * - Pixel 5, Pixel 4, Pixel 2
 * - Galaxy S8, Galaxy S9+, Galaxy Note 10
 *
 * Tablet:
 * - iPad (gen 7), iPad Pro 11, iPad Pro
 * - Galaxy Tab S4
 *
 * CUSTOM PROJECT OPTIONS:
 *
 * Each project can override:
 * - Browser type (chromium, firefox, webkit)
 * - Device emulation (viewport, user agent, etc.)
 * - Timeout settings
 * - Retry settings
 * - Screenshot/video settings
 * - Trace settings
 * - Base URL
 * - Browser launch options
 *
 * Example custom project:
 *
 * {
 *   name: 'custom-chrome',
 *   use: {
 *     browserName: 'chromium',
 *     viewport: { width: 1920, height: 1080 },
 *     userAgent: 'Custom User Agent String',
 *     baseURL: 'https://staging.example.com',
 *     screenshot: 'on',
 *     video: 'on',
 *     trace: 'on',
 *     launchOptions: {
 *       args: ['--start-maximized'],
 *     },
 *   },
 *   timeout: 60000,
 *   retries: 3,
 * }
 */
