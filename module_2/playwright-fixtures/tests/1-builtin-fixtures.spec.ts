import { test, expect } from '@playwright/test';

/**
 * Example 1: Using the built-in `page` fixture
 *
 * The page fixture is the most commonly used fixture.
 * It provides an isolated browser page for each test.
 */
test.describe('Built-in Page Fixture', () => {
  test('should use page fixture', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Add a todo
    await page.locator('.new-todo').fill('Buy groceries');
    await page.locator('.new-todo').press('Enter');

    // Verify todo was added
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li')).toHaveText('Buy groceries');
  });

  test('should have isolated page for each test', async ({ page }) => {
    // This test gets a fresh page - no leftover data from previous test
    await page.goto('https://demo.playwright.dev/todomvc');

    await expect(page.locator('.todo-list li')).toHaveCount(0);
  });
});

/**
 * Example 2: Using the `context` fixture
 *
 * The context fixture allows you to create multiple pages
 * that share cookies and storage.
 */
test.describe('Built-in Context Fixture', () => {
  test('should create multiple pages in same context', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    await page1.goto('https://demo.playwright.dev/todomvc');
    await page1.locator('.new-todo').fill('Page 1 todo');
    await page1.locator('.new-todo').press('Enter');

    await page2.goto('https://demo.playwright.dev/todomvc');

    // Both pages share the same context, so storage is shared
    // Note: In this demo app, todos are stored in localStorage
    const todoCount1 = await page1.locator('.todo-list li').count();
    const todoCount2 = await page2.locator('.todo-list li').count();

    console.log(`Page 1 todos: ${todoCount1}`);
    console.log(`Page 2 todos: ${todoCount2}`);

    await page1.close();
    await page2.close();
  });
});

/**
 * Example 3: Using the `browser` fixture
 *
 * The browser fixture is worker-scoped (shared across tests)
 * and allows custom context creation.
 */
test.describe('Built-in Browser Fixture', () => {
  test('should create custom context with browser', async ({ browser }) => {
    // Create a context with custom viewport
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Custom Test Agent',
    });

    const page = await context.newPage();
    await page.goto('https://demo.playwright.dev/todomvc');

    const viewport = page.viewportSize();
    expect(viewport).toEqual({ width: 1920, height: 1080 });

    await context.close();
  });

  test('should emulate mobile device', async ({ browser }) => {
    const iPhone = {
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      hasTouch: true,
      isMobile: true,
    };

    const context = await browser.newContext(iPhone);
    const page = await context.newPage();

    await page.goto('https://demo.playwright.dev/todomvc');

    const viewport = page.viewportSize();
    expect(viewport).toEqual({ width: 375, height: 667 });

    await context.close();
  });
});

/**
 * Example 4: Using the `browserName` fixture
 *
 * The browserName fixture returns the name of the current browser
 * being used for the test.
 */
test.describe('Built-in BrowserName Fixture', () => {
  test('should show browser name', async ({ page, browserName }) => {
    console.log(`Running on browser: ${browserName}`);

    await page.goto('https://demo.playwright.dev/todomvc');

    // You can use browserName for conditional logic
    if (browserName === 'chromium') {
      console.log('Running Chromium-specific test logic');
    } else if (browserName === 'firefox') {
      console.log('Running Firefox-specific test logic');
    } else if (browserName === 'webkit') {
      console.log('Running WebKit-specific test logic');
    }
  });
});

/**
 * Example 5: Using the `request` fixture
 *
 * The request fixture provides an API request context
 * for making HTTP requests without a browser.
 */
test.describe('Built-in Request Fixture', () => {
  test('should make API request', async ({ request }) => {
    const response = await request.get('https://api.github.com/repos/microsoft/playwright');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.name).toBe('playwright');
    expect(data.owner.login).toBe('microsoft');
  });

  test('should post data via API', async ({ request }) => {
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: {
        title: 'Test Post',
        body: 'This is a test post',
        userId: 1,
      },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.title).toBe('Test Post');
    expect(data.body).toBe('This is a test post');
  });
});
