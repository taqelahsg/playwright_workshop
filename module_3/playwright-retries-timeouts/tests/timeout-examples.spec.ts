import { test, expect } from '@playwright/test';

/**
 * Test Timeout Examples
 * Demonstrates various timeout configurations and patterns
 */

test.describe('Basic Timeout Tests', () => {
  test('1. Default timeout test', async ({ page }) => {
    // Uses default 30-second timeout
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('2. Custom test timeout', async ({ page }) => {
    // Override timeout for this specific test
    test.setTimeout(60000); // 60 seconds
    await page.goto('https://playwright.dev');
    await expect(page.locator('.navbar__title')).toBeVisible();
  });

  test('3. Test with test.slow()', async ({ page }) => {
    // Triple the default timeout
    test.slow();
    await page.goto('https://playwright.dev');
    await page.waitForTimeout(2000); // Simulate slow operation
    await expect(page.locator('.navbar__title')).toBeVisible();
  });

  test('4. Conditional timeout based on browser', async ({ page, browserName }, testInfo) => {
    // Webkit is slower on some operations
    if (browserName === 'webkit') {
      test.slow();
    }

    console.log(`Browser: ${browserName}, Timeout: ${testInfo.timeout}ms`);
    await page.goto('https://playwright.dev');
    await expect(page.locator('.navbar__title')).toBeVisible();
  });
});

test.describe('Expect Timeout Tests', () => {
  test('5. Default expect timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Uses default 5-second expect timeout
    await expect(page.locator('.navbar__title')).toBeVisible();
  });

  test('6. Custom expect timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Override timeout for specific assertion
    await expect(page.locator('.navbar__title')).toBeVisible({
      timeout: 10000
    });
  });

  test('7. Multiple assertions with different timeouts', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Fast element - short timeout
    await expect(page.locator('.navbar')).toBeVisible({ timeout: 2000 });

    // Normal element - default timeout
    await expect(page.locator('.navbar__title')).toBeVisible();

    // Slow element - longer timeout
    await expect(page.locator('.hero')).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Action Timeout Tests', () => {
  test('8. Navigation with custom timeout', async ({ page }) => {
    // Override timeout for navigation
    await page.goto('https://playwright.dev', { timeout: 30000 });
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('9. Click with custom timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Click with custom timeout
    await page.click('text=Docs', { timeout: 10000 });
    await expect(page).toHaveURL(/.*docs.*/);
  });

  test('10. Wait for selector with timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Wait for specific element with timeout
    await page.waitForSelector('.navbar__title', {
      timeout: 5000,
      state: 'visible'
    });
  });
});

test.describe('Hook-Based Timeout Configuration', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // Extend timeout for all tests in this describe block
    testInfo.setTimeout(testInfo.timeout + 10000);

    console.log(`Extended timeout to: ${testInfo.timeout}ms`);
    await page.goto('https://playwright.dev');
  });

  test('11. Test with beforeEach timeout extension', async ({ page }, testInfo) => {
    console.log(`Test timeout: ${testInfo.timeout}ms`);
    await expect(page.locator('.navbar__title')).toBeVisible();
  });

  test('12. Another test benefiting from extended timeout', async ({ page }) => {
    await page.click('text=Docs');
    await expect(page).toHaveURL(/.*docs.*/);
  });
});

test.describe('Timeout Monitoring', () => {
  test.afterEach(async ({}, testInfo) => {
    // Monitor timeout usage
    const duration = testInfo.duration;
    const timeout = testInfo.timeout;
    const percentage = (duration / timeout) * 100;

    console.log(`\n📊 Timeout Usage for "${testInfo.title}":`);
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Timeout: ${timeout}ms`);
    console.log(`   Used: ${percentage.toFixed(1)}%`);

    if (percentage > 80) {
      console.warn(`⚠️  Warning: Test used ${percentage.toFixed(1)}% of timeout!`);
    }
  });

  test('13. Quick test - low timeout usage', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('14. Slower test - higher timeout usage', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await page.waitForTimeout(2000); // Simulate slow operation
    await page.click('text=Docs');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*docs.*/);
  });
});

test.describe('Timeout Best Practices', () => {
  test('15. Wait for proper state before assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Wait for network to be idle
    await page.waitForLoadState('networkidle');

    // Now assertions are more reliable
    await expect(page.locator('.navbar__title')).toBeVisible();
  });

  test('16. Use efficient locators', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Role-based locators are more reliable
    await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
  });

  test('17. Combined retry and timeout strategy', async ({ page }, testInfo) => {
    console.log(`Attempt: ${testInfo.retry + 1}`);

    // Increase timeout on retry
    if (testInfo.retry > 0) {
      test.setTimeout(testInfo.timeout * 1.5);
      console.log(`Extended timeout to: ${testInfo.timeout}ms on retry`);
    }

    await page.goto('https://playwright.dev');
    await expect(page.locator('.navbar__title')).toBeVisible();
  });
});

test.describe('Load State and Timeout', () => {
  test('18. Different load states', async ({ page }) => {
    // Fast - waits for DOM to be ready
    await page.goto('https://playwright.dev', {
      waitUntil: 'domcontentloaded'
    });

    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('19. Network idle wait', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Wait for network to be idle (no network activity for 500ms)
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.hero')).toBeVisible();
  });

  test('20. Multiple state checks', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Check multiple states
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.navbar__title')).toBeVisible();
  });
});
