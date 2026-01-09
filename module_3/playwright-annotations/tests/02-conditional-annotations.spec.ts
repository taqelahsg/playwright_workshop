import { test, expect } from '@playwright/test';
import os from 'os';

/**
 * Conditional Annotations Examples
 *
 * This file demonstrates how to use annotations conditionally based on:
 * - Browser type
 * - Platform/OS
 * - Environment variables
 * - Other runtime conditions
 */

// Skip test based on browser
test('skip on Firefox', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'This feature is not supported on Firefox yet');

  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
  console.log(`Running on browser: ${browserName}`);
});

// Skip test on multiple browsers
test('skip on Firefox and WebKit', async ({ page, browserName }) => {
  test.skip(
    browserName === 'firefox' || browserName === 'webkit',
    'This feature only works on Chromium browsers'
  );

  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

// Only run on specific browser
test('run only on Chromium', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'This test is Chromium-specific');

  await page.goto('https://example.com');
  await expect(page.locator('h1')).toContainText('Example');
});

// Skip based on platform/OS
test('skip on macOS', async ({ page }) => {
  test.skip(os.platform() === 'darwin', 'Not supported on macOS');

  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

test('skip on Windows', async ({ page }) => {
  test.skip(os.platform() === 'win32', 'Known issue on Windows');

  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

test('skip on Linux', async ({ page }) => {
  test.skip(os.platform() === 'linux', 'Linux-specific configuration needed');

  await page.goto('https://example.com');
  await expect(page.locator('body')).toBeVisible();
});

// Skip based on environment variable
test('skip in CI environment', async ({ page }) => {
  test.skip(!!process.env.CI, 'This test requires local setup');

  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

test('run only in CI', async ({ page }) => {
  test.skip(!process.env.CI, 'This test should only run in CI');

  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

// Conditional fail annotation
test('fail on WebKit - known bug', async ({ page, browserName }) => {
  test.fail(browserName === 'webkit', 'Known rendering issue on WebKit - Bug #123');

  await page.goto('https://example.com');
  // This might fail on WebKit, and that's expected
  await expect(page.locator('h1')).toHaveCSS('color', 'rgb(0, 0, 0)');
});

// Conditional slow annotation
test('slow on Firefox', async ({ page, browserName }) => {
  test.slow(browserName === 'firefox', 'Firefox needs more time for this test');

  await page.goto('https://example.com');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('h1')).toBeVisible();
});

// Complex conditional logic
test('complex conditional skip', async ({ page, browserName }) => {
  const isCI = !!process.env.CI;
  const isMac = os.platform() === 'darwin';

  test.skip(
    isCI && isMac && browserName === 'webkit',
    'Skipping WebKit on macOS in CI due to flakiness'
  );

  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Conditional annotation based on viewport
test('skip on mobile viewport', async ({ page, viewport }) => {
  test.skip(
    viewport !== null && viewport.width < 768,
    'This test requires desktop viewport'
  );

  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Group with conditional annotations
test.describe('Browser-specific tests', () => {
  test.describe('Chromium only', () => {
    test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium-only tests');

    test('test 1 - chromium feature', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });

    test('test 2 - another chromium feature', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test.describe('Firefox only', () => {
    test.skip(({ browserName }) => browserName !== 'firefox', 'Firefox-only tests');

    test('test 1 - firefox feature', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });
  });
});
