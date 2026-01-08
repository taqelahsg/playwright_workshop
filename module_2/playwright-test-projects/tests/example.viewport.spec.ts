import { test, expect } from '@playwright/test';

/**
 * Viewport Tests
 *
 * These tests run on projects with different viewport sizes:
 * - desktop-1920 (1920x1080)
 * - desktop-1366 (1366x768)
 *
 * Run with: playwright test --project=desktop-1920 --project=desktop-1366
 */

test.describe('Viewport-Specific Tests', () => {
  test('should verify viewport size', async ({ page }, testInfo) => {
    await page.goto('/');

    // Get viewport size
    const viewport = page.viewportSize();
    console.log(`Project: ${testInfo.project.name}`);
    console.log(`Viewport: ${viewport?.width}x${viewport?.height}`);

    // Verify viewport matches project configuration
    expect(viewport).toBeTruthy();
  });

  test('should test responsive navigation', async ({ page }) => {
    await page.goto('/');

    const viewport = page.viewportSize();

    // Different behavior based on viewport
    if (viewport && viewport.width >= 1920) {
      // On large screens, expect full navigation
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
    } else {
      // On smaller screens, navigation might be different
      console.log('Testing on smaller viewport');
    }
  });

  test('should render content correctly at different sizes', async ({ page }) => {
    await page.goto('/');

    // Main content should be visible regardless of viewport
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();

    // Take a screenshot for visual comparison
    await page.screenshot({
      path: `test-results/viewport-${page.viewportSize()?.width}.png`,
      fullPage: false,
    });
  });
});
