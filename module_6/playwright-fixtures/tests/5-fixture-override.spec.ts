import { test as base, expect } from '@playwright/test';

/**
 * Overriding Built-in Fixtures
 *
 * You can override built-in Playwright fixtures to customize their behavior.
 * This is useful for adding common setup to all pages or contexts.
 */

// Override the page fixture to add custom initialization
const test = base.extend({
  page: async ({ page }, use) => {
    // Custom page setup before each test
    console.log('Setting up custom page configuration');

    // Add initialization script that runs on every page load
    await page.addInitScript(() => {
      // This runs in the browser context
      (window as any).testMode = true;
      console.log('Page initialized with test mode');
    });

    // Set a custom viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    // Add custom headers
    await page.setExtraHTTPHeaders({
      'X-Test-Header': 'Playwright-Test',
    });

    // Provide the customized page to the test
    await use(page);

    // Custom cleanup (optional)
    console.log('Cleaning up custom page');
  },
});

test.describe('Overridden Page Fixture', () => {
  test('should use customized page', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Check that our custom viewport was applied
    const viewport = page.viewportSize();
    expect(viewport).toEqual({ width: 1280, height: 720 });

    // Check that initialization script ran
    const testMode = await page.evaluate(() => (window as any).testMode);
    expect(testMode).toBe(true);

    // Use the page normally
    await page.locator('.new-todo').fill('Custom page test');
    await page.locator('.new-todo').press('Enter');

    await expect(page.locator('.todo-list li')).toHaveCount(1);
  });

  test('every test gets the customized page', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // All tests get the custom viewport
    const viewport = page.viewportSize();
    expect(viewport).toEqual({ width: 1280, height: 720 });
  });
});

/**
 * Overriding Context Fixture
 */
const testWithContext = base.extend({
  context: async ({ context }, use) => {
    console.log('Setting up custom context');

    // Add authentication state to all pages in this context
    await context.addInitScript(() => {
      (window as any).authenticated = true;
    });

    await use(context);

    console.log('Cleaning up custom context');
  },
});

testWithContext.describe('Overridden Context Fixture', () => {
  testWithContext('should use customized context', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Check that context initialization script ran
    const authenticated = await page.evaluate(() => (window as any).authenticated);
    expect(authenticated).toBe(true);
  });

  testWithContext('should maintain context state across pages', async ({ context }) => {
    const page1 = await context.newPage();
    await page1.goto('https://demo.playwright.dev/todomvc');

    const auth1 = await page1.evaluate(() => (window as any).authenticated);
    expect(auth1).toBe(true);

    const page2 = await context.newPage();
    await page2.goto('https://demo.playwright.dev/todomvc');

    const auth2 = await page2.evaluate(() => (window as any).authenticated);
    expect(auth2).toBe(true);

    await page1.close();
    await page2.close();
  });
});

/**
 * Combining Override with Extension
 */
type CustomFixtures = {
  slowPage: typeof base extends { page: infer P } ? P : never;
};

const testWithSlow = base.extend<CustomFixtures>({
  // Override page to add slowMo
  page: async ({ page }, use) => {
    // Note: slowMo should be set in browser context, this is just a demo
    console.log('Page with extra setup');
    await use(page);
  },

  // Add new fixture that uses the overridden page
  slowPage: async ({ page }, use) => {
    console.log('Creating slow page for debugging');
    // This uses the already-overridden page fixture
    await use(page);
  },
});

testWithSlow.describe('Combined Override and Extension', () => {
  testWithSlow('should use both overridden and new fixtures', async ({ slowPage }) => {
    await slowPage.goto('https://demo.playwright.dev/todomvc');

    await slowPage.locator('.new-todo').fill('Slow page test');
    await slowPage.locator('.new-todo').press('Enter');

    await expect(slowPage.locator('.todo-list li')).toHaveCount(1);
  });
});
