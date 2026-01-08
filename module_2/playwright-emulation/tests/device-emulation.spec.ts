import { test, expect, devices } from '@playwright/test';

/**
 * Device Emulation Examples
 * Demonstrates testing across different devices
 */

test.describe('Device Emulation Tests', () => {

  test('test on iPhone 13', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 13'],
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Verify viewport size matches device configuration
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(390);
    // Note: Actual height may vary based on device configuration
    expect(viewport?.height).toBeGreaterThan(600);

    // Verify user agent contains iPhone
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toContain('iPhone');

    await context.close();
  });

  test('test on iPad Pro', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Pro 11'],
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Verify viewport size is tablet-sized
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThanOrEqual(834);
    expect(viewport?.height).toBeGreaterThan(1000);

    await context.close();
  });

  test('test on Desktop Chrome', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['Desktop Chrome'],
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Desktop should have larger viewport
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThanOrEqual(1280);

    await context.close();
  });

  test('responsive design - multiple breakpoints', async ({ page }) => {
    const breakpoints = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ];

    for (const breakpoint of breakpoints) {
      await page.setViewportSize({
        width: breakpoint.width,
        height: breakpoint.height,
      });

      await page.goto('https://playwright.dev');

      // Verify page loads at each breakpoint
      await expect(page.locator('a.navbar__brand').first()).toBeVisible();

      console.log(`✓ ${breakpoint.name}: ${breakpoint.width}x${breakpoint.height}`);
    }
  });

  test('high DPI display (Retina)', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 2, // 2x pixel density
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Check device pixel ratio
    const devicePixelRatio = await page.evaluate(() => window.devicePixelRatio);
    expect(devicePixelRatio).toBe(2);

    await context.close();
  });

  test('mobile with touch support', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 13'],
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Verify touch support
    const hasTouch = await page.evaluate(() => 'ontouchstart' in window);
    expect(hasTouch).toBeTruthy();

    // Simulate touch event
    await page.locator('a.navbar__brand').first().tap();

    await context.close();
  });
});
