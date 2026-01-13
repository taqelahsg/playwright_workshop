import { test, expect } from '@playwright/test';

/**
 * Handling Dynamic Content in Visual Tests
 *
 * Dynamic content causes flaky visual tests. This file demonstrates
 * techniques to handle:
 * - Timestamps
 * - User avatars
 * - Advertisements
 * - Live data
 * - Animations
 */
test.describe('Handling Dynamic Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');
    await page.waitForLoadState('networkidle');
  });

  test('mask dynamic elements', async ({ page }) => {
    // Mask elements that change between runs
    await expect(page).toHaveScreenshot('page-masked.png', {
      mask: [
        // Mask any elements with dynamic content
        page.locator('.timestamp'),
        page.locator('.user-avatar'),
        page.locator('[data-testid="dynamic-content"]'),
      ],
    });
  });

  test('hide elements with CSS injection', async ({ page }) => {
    // Inject CSS to hide dynamic elements
    await page.addStyleTag({
      content: `
        .timestamp,
        .dynamic-content,
        .advertisement,
        .live-counter {
          visibility: hidden !important;
        }
      `
    });

    await expect(page).toHaveScreenshot('page-hidden-dynamic.png');
  });

  test('remove elements before screenshot', async ({ page }) => {
    // Remove elements entirely from DOM
    await page.evaluate(() => {
      const dynamicElements = document.querySelectorAll('.dynamic, .ad-banner');
      dynamicElements.forEach(el => el.remove());
    });

    await expect(page).toHaveScreenshot('page-removed-dynamic.png');
  });

  test('disable animations globally', async ({ page }) => {
    // Inject CSS to disable all animations
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });

    await expect(page).toHaveScreenshot('page-no-animations.png', {
      animations: 'disabled',
    });
  });

  test('wait for animations to complete', async ({ page }) => {
    // Wait for specific animations to finish
    await page.waitForFunction(() => {
      const animatedElements = document.querySelectorAll('.animated');
      return animatedElements.length === 0;
    });

    await expect(page).toHaveScreenshot('page-animations-complete.png');
  });

  test('set fixed viewport for consistent screenshots', async ({ page }) => {
    // Ensure consistent viewport regardless of test environment
    await page.setViewportSize({ width: 1280, height: 720 });

    await expect(page).toHaveScreenshot('page-fixed-viewport.png');
  });

  test('wait for fonts to load', async ({ page }) => {
    // Ensure all fonts are loaded before screenshot
    await page.waitForFunction(() => document.fonts.ready);

    await expect(page).toHaveScreenshot('page-fonts-loaded.png');
  });

  test('wait for images to load', async ({ page }) => {
    // Ensure all images are fully loaded
    await page.waitForFunction(() => {
      const images = document.querySelectorAll('img');
      return Array.from(images).every(img => img.complete && img.naturalHeight > 0);
    });

    await expect(page).toHaveScreenshot('page-images-loaded.png');
  });

  test('replace dynamic text with placeholder', async ({ page }) => {
    // Replace dynamic text with static placeholder
    await page.evaluate(() => {
      const dateElements = document.querySelectorAll('.date, .time');
      dateElements.forEach(el => {
        el.textContent = 'XX/XX/XXXX';
      });
    });

    await expect(page).toHaveScreenshot('page-placeholder-dates.png');
  });

  test('freeze clock for time-dependent content', async ({ page }) => {
    // Install clock mocking before navigating
    await page.addInitScript(() => {
      // Mock Date to return consistent value
      const fixedDate = new Date('2024-01-15T10:00:00Z');
      const OriginalDate = Date;

      // @ts-ignore
      window.Date = class extends OriginalDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(fixedDate.getTime());
          } else {
            // @ts-ignore
            super(...args);
          }
        }
        static now() {
          return fixedDate.getTime();
        }
      };
    });

    await page.goto('/taqelah-demo-site.html');

    await expect(page).toHaveScreenshot('page-frozen-time.png');
  });
});
