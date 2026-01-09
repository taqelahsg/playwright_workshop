import { test, expect } from '@playwright/test';

/**
 * Test 1: Verify page title
 * This test navigates to playwright.dev and checks if the title contains "Playwright"
 */
test('has title', async ({ page }) => {
  // Navigate to the Playwright website
  await page.goto('https://playwright.dev/');

  // Expect the page title to contain "Playwright"
  await expect(page).toHaveTitle(/Playwright/);
});

/**
 * Test 2: Verify navigation to Get Started page
 * This test clicks the "Get started" link and verifies the Installation heading appears
 */
test('get started link', async ({ page }) => {
  // Navigate to the Playwright website
  await page.goto('https://playwright.dev/');

  // Click on the "Get started" link
  await page.getByRole('link', { name: 'Get started' }).click();

  // Verify that we're on the installation page by checking for the "Installation" heading
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

/**
 * Test 3: Search functionality
 * This test demonstrates using the search feature
 */
test('search functionality', async ({ page }) => {
  // Navigate to the Playwright website
  await page.goto('https://playwright.dev/');

  // Click the search button
  await page.getByRole('button', { name: 'Search' }).click();

  // Type in the search box
  await page.getByPlaceholder('Search docs').fill('locators');

  // Wait a moment for search results
  await page.waitForTimeout(1000);

  // Verify search results are visible
  await expect(page.getByRole('link', { name: /locators/i }).first()).toBeVisible();
});

/**
 * Test 4: Verify navigation menu
 * This test checks if the main navigation menu items are present
 */
test('has navigation menu', async ({ page }) => {
  // Navigate to the Playwright website
  await page.goto('https://playwright.dev/');

  // Verify key navigation items are visible
  await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'API' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Community' })).toBeVisible();
});

/**
 * Test 5: Verify footer links
 * This test scrolls to the footer and checks for important links
 */
test('has footer with links', async ({ page }) => {
  // Navigate to the Playwright website
  await page.goto('https://playwright.dev/');

  // Scroll to the bottom of the page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Wait for footer to be in view
  await page.waitForTimeout(500);

  // Verify GitHub link exists in footer
  const githubLink = page.locator('footer').getByRole('link', { name: /github/i });
  await expect(githubLink).toBeVisible();
});
