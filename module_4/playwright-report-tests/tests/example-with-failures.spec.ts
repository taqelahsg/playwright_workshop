import { test, expect } from '@playwright/test';

/**
 * Test suite with intentional failures to demonstrate
 * how different reporters display failures, errors, and screenshots
 */

test.describe('Tests with Failures (for Reporter Demo)', () => {
  test('should pass - successful test', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page).toHaveTitle(/React • TodoMVC/);
  });

  test('should fail - assertion error', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    // Intentional failure to demonstrate reporter
    await expect(page).toHaveTitle('This Title Does Not Exist');
  });

  test('should fail - element not found', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    // Intentional failure - non-existent element
    await expect(page.getByText('Non-existent element')).toBeVisible({ timeout: 2000 });
  });

  test('should fail - wrong URL', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    // Intentional failure - checking wrong URL
    await expect(page).toHaveURL('https://wrong-url.com');
  });

  test.skip('should skip - skipped test', async ({ page }) => {
    // This test will be skipped
    await page.goto('https://demo.playwright.dev/todomvc');
  });
});

test.describe('Visual Regression Failures', () => {
  test('should capture screenshot on failure', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Test screenshot capture');
    await input.press('Enter');

    // Intentional failure to trigger screenshot
    await expect(page.getByText('Wrong text content')).toBeVisible({ timeout: 2000 });
  });

  test('should demonstrate video recording', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Perform some actions
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');

    // Intentional failure to trigger video recording
    await expect(page.getByText('This will fail')).toBeVisible({ timeout: 2000 });
  });
});

test.describe('Slow Tests (for Performance Reporting)', () => {
  test('should complete quickly', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page).toHaveTitle(/React • TodoMVC/);
  });

  test('should simulate slow test', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Simulate slow operations
    await page.waitForTimeout(3000);

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Slow operation');
    await input.press('Enter');

    await page.waitForTimeout(2000);

    await expect(page.getByText('Slow operation')).toBeVisible();
  });
});

test.describe('Timeout Demonstrations', () => {
  test('should pass before timeout', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible({ timeout: 5000 });
  });

  test.skip('should timeout (SKIPPED for demo)', async ({ page }) => {
    // This would timeout - skipped to keep demo fast
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByText('Element that never appears')).toBeVisible({ timeout: 30000 });
  });
});
