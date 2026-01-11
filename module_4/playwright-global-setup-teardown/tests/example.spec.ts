import { test, expect } from '@playwright/test';

test.describe('Example tests with global setup/teardown', () => {
  test('should navigate to Playwright homepage', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Verify the page title
    await expect(page).toHaveTitle(/Playwright/);

    console.log('✅ Successfully loaded Playwright homepage');
  });

  test('should check documentation link', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Click on "Get Started" or "Docs" link
    const docsLink = page.getByRole('link', { name: 'Docs' }).first();
    await docsLink.click();

    // Verify we're on the docs page
    await expect(page).toHaveURL(/.*docs.*/);

    console.log('✅ Successfully navigated to documentation');
  });

  test('should search in documentation', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Open search
    await page.getByRole('button', { name: 'Search' }).click();

    // Type search query
    await page.getByPlaceholder('Search docs').fill('test');

    // Wait for search results
    await page.waitForTimeout(1000);

    console.log('✅ Search functionality works');
  });
});
