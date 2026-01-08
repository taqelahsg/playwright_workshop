import { test, expect } from '@playwright/test';

/**
 * Network Conditions Emulation
 * Demonstrates testing offline mode and JavaScript disabled
 */

test.describe('Network Conditions Emulation', () => {

  test('offline mode test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Go online first
    await page.goto('https://playwright.dev');
    await expect(page.locator('a.navbar__brand')).toBeVisible();
    console.log('✓ Page loaded while online');

    // Go offline
    await context.setOffline(true);
    console.log('✓ Network set to offline');

    // Try to navigate to a new page - should fail
    try {
      await page.goto('https://example.com', { timeout: 5000 });
    } catch (error) {
      console.log('✓ Navigation failed as expected in offline mode');
    }

    // Go back online
    await context.setOffline(false);
    console.log('✓ Network restored to online');

    // Should work now
    await page.goto('https://example.com');
    await expect(page.locator('h1')).toBeVisible();
    console.log('✓ Page loaded after going back online');

    await context.close();
  });

  test('offline and online workflow', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Load a page
    await page.goto('https://playwright.dev');
    console.log('Step 1: Initial page load');

    // Go offline
    await context.setOffline(true);
    console.log('Step 2: Set offline mode');

    // Try to reload - will use cache or fail
    try {
      await page.reload({ timeout: 5000 });
      console.log('Step 3: Reload succeeded (cached)');
    } catch (error) {
      console.log('Step 3: Reload failed (no cache)');
    }

    // Go back online
    await context.setOffline(false);
    console.log('Step 4: Set online mode');

    // Reload should work
    await page.reload();
    console.log('Step 5: Reload succeeded');

    await context.close();
  });

  test('check network status', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Check online status
    let isOnline = await page.evaluate(() => navigator.onLine);
    expect(isOnline).toBeTruthy();
    console.log('Navigator.onLine (before):', isOnline);

    // Go offline
    await context.setOffline(true);

    // Wait a bit for the browser to detect offline state
    await page.waitForTimeout(100);

    isOnline = await page.evaluate(() => navigator.onLine);
    console.log('Navigator.onLine (after offline):', isOnline);

    // Go back online
    await context.setOffline(false);
    await page.waitForTimeout(100);

    isOnline = await page.evaluate(() => navigator.onLine);
    console.log('Navigator.onLine (after online):', isOnline);

    await context.close();
  });

  test('JavaScript disabled', async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Try to execute JavaScript - should not work
    const canRunJS = await page.evaluate(() => {
      return true;
    }).catch(() => false);

    console.log('JavaScript execution:', canRunJS ? 'Enabled' : 'Disabled');

    await context.close();
  });

  test('compare with and without JavaScript', async ({ browser }) => {
    // With JavaScript
    const jsContext = await browser.newContext({
      javaScriptEnabled: true,
    });
    const jsPage = await jsContext.newPage();
    await jsPage.goto('https://playwright.dev');

    const withJS = await jsPage.evaluate(() => {
      return {
        hasJS: true,
        userAgent: navigator.userAgent,
      };
    });
    console.log('With JavaScript:', withJS);

    await jsContext.close();

    // Without JavaScript
    const noJSContext = await browser.newContext({
      javaScriptEnabled: false,
    });
    const noJSPage = await noJSContext.newPage();
    await noJSPage.goto('https://playwright.dev');

    // Can't evaluate JavaScript, but can check content
    const content = await noJSPage.content();
    console.log('Without JavaScript - Page loaded:', content.length > 0);

    await noJSContext.close();
  });

  test('simulate slow network', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Enable request interception to simulate slow network
    await page.route('**/*', async (route) => {
      // Add delay before continuing
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('https://playwright.dev');
    const loadTime = Date.now() - startTime;

    console.log(`Page load time with delay: ${loadTime}ms`);

    await context.close();
  });

  test('block specific resources', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Block images
    await page.route('**/*.{png,jpg,jpeg,gif,svg}', route => route.abort());

    await page.goto('https://playwright.dev');
    console.log('✓ Page loaded with images blocked');

    await context.close();
  });

  test('offline PWA simulation', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Load page first (install service worker if it's a PWA)
    await page.goto('https://playwright.dev');
    console.log('Step 1: Initial load (service worker may register)');

    // Wait for potential service worker registration
    await page.waitForTimeout(2000);

    // Go offline
    await context.setOffline(true);
    console.log('Step 2: Going offline');

    // Try to navigate - PWA should work if service worker is active
    await page.goto('https://playwright.dev');
    console.log('Step 3: Offline navigation attempted');

    await context.setOffline(false);
    await context.close();
  });

  test('network state transitions', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    const states = [
      { offline: false, label: 'Online' },
      { offline: true, label: 'Offline' },
      { offline: false, label: 'Online again' },
      { offline: true, label: 'Offline again' },
      { offline: false, label: 'Back online' },
    ];

    for (const state of states) {
      await context.setOffline(state.offline);
      await page.waitForTimeout(100);

      const isOnline = await page.evaluate(() => navigator.onLine);
      console.log(`${state.label}: navigator.onLine = ${isOnline}`);
    }

    await context.close();
  });
});
