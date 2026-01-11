import { test, expect } from '@playwright/test';

/**
 * Basic Example Test
 *
 * This test will run on all configured browser projects:
 * - chromium
 * - firefox
 * - webkit
 * - Google Chrome
 * - Microsoft Edge
 * - mobile-chrome
 * - mobile-safari
 * - tablet-ipad
 */

test.describe('Cross-Browser Testing Example', () => {
  test('should display the Playwright homepage title', async ({ page }) => {
    // Navigate to Playwright homepage
    await page.goto('/');

    // Verify page title
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('should have "Get Started" link', async ({ page }) => {
    await page.goto('/');

    // Click the get started link
    const getStarted = page.getByRole('link', { name: 'Get started' });
    await expect(getStarted).toBeVisible();
  });

  test('should navigate to docs', async ({ page }) => {
    await page.goto('/');

    // Click on docs
    await page.getByRole('link', { name: 'Docs' }).click();

    // Verify navigation
    await expect(page).toHaveURL(/.*docs.*/);
  });
});

test.describe('Project Info Test', () => {
  test('should display current project name', async ({ page }, testInfo) => {
    // Display which project is running
    console.log(`Running on project: ${testInfo.project.name}`);

    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
  });
});
