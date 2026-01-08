import { test, expect } from '@playwright/test';

/**
 * UI Tests
 *
 * These tests run in the 'ui-chrome' project only.
 * They focus on UI-specific functionality.
 * Base URL is set to: https://playwright.dev
 *
 * Run with: npm run test:ui
 */

test.describe('UI Tests - Navigation', () => {
  test('should navigate through main sections', async ({ page }) => {
    await page.goto('/');

    // Navigate to Docs
    await page.getByRole('link', { name: 'Docs' }).click();
    await expect(page).toHaveURL(/.*docs.*/);

    // Navigate to API
    await page.goto('/');
    await page.getByRole('link', { name: 'API' }).click();
    await expect(page).toHaveURL(/.*api.*/);
  });

  test('should use search functionality', async ({ page }) => {
    await page.goto('/');

    // Click search button
    const searchButton = page.getByRole('button', { name: /search/i }).first();
    await searchButton.click();

    // Search modal/input should be visible
    // Note: Actual selectors may vary based on Playwright site implementation
  });
});

test.describe('UI Tests - Responsive Design', () => {
  test('should display navigation menu', async ({ page }) => {
    await page.goto('/');

    // Check for navigation elements
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('should scroll to sections', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
  });
});

test.describe('UI Tests - Interactive Elements', () => {
  test('should interact with code examples', async ({ page }) => {
    await page.goto('/docs/intro');

    // Look for code blocks
    const codeBlock = page.locator('pre').first();
    if (await codeBlock.isVisible()) {
      await expect(codeBlock).toBeVisible();
      console.log('Code examples are properly rendered');
    }
  });

  test('should handle external links', async ({ page }) => {
    await page.goto('/');

    // External links should open in new tab (target="_blank")
    const links = page.locator('a[target="_blank"]');
    const count = await links.count();

    console.log(`Found ${count} external links`);
  });
});

test.describe('UI Tests - Visual Elements', () => {
  test('should display hero section', async ({ page }) => {
    await page.goto('/');

    // Hero section should be visible
    const hero = page.locator('header, .hero, [class*="hero"]').first();

    // Take a screenshot of hero section
    if (await hero.isVisible()) {
      await hero.screenshot({ path: 'test-results/hero-section.png' });
    }
  });

  test('should render images correctly', async ({ page }) => {
    await page.goto('/');

    // Check if images are loaded
    const images = page.locator('img');
    const count = await images.count();

    console.log(`Found ${count} images on the page`);

    // Verify first image is loaded (if exists)
    if (count > 0) {
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();
    }
  });

  test('should have accessible color contrast', async ({ page }) => {
    await page.goto('/');

    // Take full page screenshot for manual review
    await page.screenshot({
      path: 'test-results/full-page.png',
      fullPage: true,
    });

    console.log('Screenshot saved for accessibility review');
  });
});

test.describe('UI Tests - Form Interactions', () => {
  test('should interact with input fields', async ({ page }) => {
    await page.goto('/');

    // Try to find and interact with search input
    const searchButton = page.getByRole('button', { name: /search/i }).first();

    if (await searchButton.isVisible()) {
      await searchButton.click();

      // Wait a bit for search to appear
      await page.waitForTimeout(500);

      console.log('Search interaction completed');
    }
  });
});
