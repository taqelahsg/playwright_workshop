import { test, expect } from '@playwright/test';

/**
 * Basic Screenshot Tests
 *
 * Demonstrates fundamental visual testing concepts:
 * - Full page screenshots
 * - Element-level screenshots
 * - Configuration options
 */
test.describe('Basic Screenshot Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('full page screenshot comparison', async ({ page }) => {
    // Basic screenshot - compares entire viewport
    // First run creates baseline, subsequent runs compare
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('full page screenshot with custom options', async ({ page }) => {
    await expect(page).toHaveScreenshot('login-page-options.png', {
      // Capture entire scrollable page
      fullPage: true,

      // Disable animations for consistency
      animations: 'disabled',

      // Allow small differences (anti-aliasing)
      maxDiffPixels: 100,

      // Color comparison sensitivity
      threshold: 0.2,
    });
  });

  test('screenshot with percentage threshold', async ({ page }) => {
    await expect(page).toHaveScreenshot('login-percentage.png', {
      // Allow up to 5% of pixels to differ
      maxDiffPixelRatio: 0.05,
    });
  });

  test('screenshot with timeout for slow pages', async ({ page }) => {
    await expect(page).toHaveScreenshot('login-timeout.png', {
      // Wait up to 10 seconds for page to stabilize
      timeout: 10000,
    });
  });
});
