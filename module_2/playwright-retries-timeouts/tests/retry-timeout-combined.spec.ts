import { test, expect } from '@playwright/test';

/**
 * Combined Retry and Timeout Examples
 * Demonstrates how retries and timeouts work together
 */

test.describe('Retry with Timeout Strategy', () => {
  test('1. Escalating timeout on retry', async ({ page }, testInfo) => {
    // Increase timeout with each retry
    const baseTimeout = 30000;
    const timeoutMultiplier = testInfo.retry + 1;
    const currentTimeout = baseTimeout * timeoutMultiplier;

    test.setTimeout(currentTimeout);

    console.log(`\n🔄 Attempt ${testInfo.retry + 1}:`);
    console.log(`   Timeout: ${currentTimeout}ms`);

    await page.goto('https://playwright.dev');
    await expect(page.locator('.navbar__title')).toBeVisible();
  });

  test('2. Conditional behavior based on retry count', async ({ page }, testInfo) => {
    if (testInfo.retry === 0) {
      // First attempt - use strict timeout
      console.log('First attempt - strict timeout');
      await expect(page.goto('https://playwright.dev')).resolves.toBeDefined();
      await expect(page.locator('.navbar__title')).toBeVisible({ timeout: 5000 });
    } else {
      // Retry - be more lenient
      console.log(`Retry attempt ${testInfo.retry} - lenient timeout`);
      test.slow(); // Triple timeout
      await page.goto('https://playwright.dev');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.navbar__title')).toBeVisible({ timeout: 15000 });
    }
  });

  test('3. Exponential backoff with timeout', async ({ page }, testInfo) => {
    if (testInfo.retry > 0) {
      // Wait longer before each retry
      const backoffTime = Math.pow(2, testInfo.retry) * 1000;
      console.log(`⏰ Waiting ${backoffTime}ms before retry`);
      await page.waitForTimeout(backoffTime);

      // Also increase test timeout
      const newTimeout = 30000 + (testInfo.retry * 10000);
      test.setTimeout(newTimeout);
      console.log(`📊 Extended timeout to ${newTimeout}ms`);
    }

    await page.goto('https://playwright.dev');
    await expect(page.locator('.navbar__title')).toBeVisible();
  });
});

test.describe('Cleanup and Retry', () => {
  test('4. State cleanup on retry', async ({ page }, testInfo) => {
    if (testInfo.retry > 0) {
      console.log('🧹 Performing cleanup on retry...');

      // Clear browser state
      await page.context().clearCookies();
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Increase timeout for retry
      test.setTimeout(45000);
    }

    await page.goto('https://playwright.dev');
    await expect(page.locator('.navbar__title')).toBeVisible();
  });

  test('5. Progressive wait strategy', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');

    if (testInfo.retry === 0) {
      // First attempt - quick check
      console.log('Quick check (first attempt)');
      await expect(page.locator('.navbar__title')).toBeVisible({ timeout: 3000 });
    } else if (testInfo.retry === 1) {
      // First retry - wait for load
      console.log('Wait for load state (first retry)');
      await page.waitForLoadState('load');
      await expect(page.locator('.navbar__title')).toBeVisible({ timeout: 10000 });
    } else {
      // Second retry - wait for network idle
      console.log('Wait for network idle (second retry)');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.navbar__title')).toBeVisible({ timeout: 15000 });
    }
  });
});

test.describe('Flaky Test Patterns', () => {
  test('6. Simulated flaky test with recovery', async ({ page }, testInfo) => {
    console.log(`\n🎲 Attempt ${testInfo.retry + 1} of ${testInfo.project.retries + 1}`);

    // Simulate flakiness - fail first 2 attempts
    if (testInfo.retry < 2) {
      console.log('❌ Simulating failure...');
      await page.goto('https://playwright.dev');
      // Force a timeout by looking for non-existent element
      await expect(page.locator('.does-not-exist')).toBeVisible({ timeout: 1000 });
    } else {
      console.log('✅ Recovering on final attempt...');
      test.slow(); // Give it more time
      await page.goto('https://playwright.dev');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.navbar__title')).toBeVisible();
    }
  });

  test('7. Network-dependent test with retry', async ({ page }, testInfo) => {
    // Increase assertion timeout with each retry
    const expectTimeout = 5000 + (testInfo.retry * 5000);
    console.log(`Assertion timeout: ${expectTimeout}ms`);

    await page.goto('https://playwright.dev');

    // Wait for network activity to settle
    if (testInfo.retry > 0) {
      await page.waitForLoadState('networkidle');
    }

    await expect(page.locator('.hero')).toBeVisible({ timeout: expectTimeout });
  });
});

test.describe('Timeout Monitoring with Retries', () => {
  test.afterEach(async ({}, testInfo) => {
    const status = testInfo.status;
    const retry = testInfo.retry;
    const duration = testInfo.duration;
    const timeout = testInfo.timeout;
    const percentage = (duration / timeout) * 100;

    console.log('\n' + '='.repeat(60));
    console.log(`📊 Test Report: "${testInfo.title}"`);
    console.log('='.repeat(60));
    console.log(`Status: ${status}`);
    console.log(`Attempt: ${retry + 1}`);
    console.log(`Duration: ${duration}ms`);
    console.log(`Timeout: ${timeout}ms`);
    console.log(`Timeout Usage: ${percentage.toFixed(1)}%`);

    if (status === 'passed' && retry > 0) {
      console.log(`⚠️  FLAKY TEST DETECTED - Passed after ${retry} retry/retries`);
    }

    if (percentage > 80) {
      console.log(`⚠️  High timeout usage - consider optimization`);
    }

    console.log('='.repeat(60) + '\n');
  });

  test('8. Test with comprehensive monitoring', async ({ page }, testInfo) => {
    console.log(`Starting test (Attempt ${testInfo.retry + 1})`);

    await page.goto('https://playwright.dev');
    await expect(page.locator('.navbar__title')).toBeVisible();
  });

  test('9. Slow test with monitoring', async ({ page }, testInfo) => {
    test.slow(); // Triple timeout
    console.log(`Starting slow test (Timeout: ${testInfo.timeout}ms)`);

    await page.goto('https://playwright.dev');
    await page.waitForTimeout(3000); // Simulate slow operation
    await page.click('text=Docs');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/.*docs.*/);
  });
});

test.describe('Best Practices', () => {
  test('10. Reliable test with proper waits', async ({ page }) => {
    // Use proper waiting strategies instead of relying on retries
    await page.goto('https://playwright.dev');

    // Wait for network to be idle
    await page.waitForLoadState('networkidle');

    // Use generous but reasonable timeout
    await expect(page.locator('.navbar__title')).toBeVisible({ timeout: 10000 });

    // Verify multiple elements
    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.hero')).toBeVisible({ timeout: 15000 });
  });

  test('11. Efficient error recovery', async ({ page }, testInfo) => {
    if (testInfo.retry > 0) {
      console.log('🔄 Retry detected - implementing recovery strategy');

      // Clear state
      await page.context().clearCookies();

      // Increase timeout
      test.setTimeout(testInfo.timeout + 15000);

      // Use network idle wait
      await page.goto('https://playwright.dev', { waitUntil: 'networkidle' });
    } else {
      // Normal first attempt
      await page.goto('https://playwright.dev');
    }

    await expect(page.locator('.navbar__title')).toBeVisible();
  });

  test('12. Timeout and retry coordination', async ({ page }, testInfo) => {
    // Coordinate test timeout with expect timeouts
    const testTimeout = 45000;
    const expectTimeout = 15000;

    test.setTimeout(testTimeout);

    console.log(`Test timeout: ${testTimeout}ms`);
    console.log(`Expect timeout: ${expectTimeout}ms`);
    console.log(`Retry count: ${testInfo.retry}`);

    await page.goto('https://playwright.dev');

    // Multiple assertions with appropriate timeouts
    await expect(page.locator('.navbar')).toBeVisible({ timeout: expectTimeout });
    await expect(page.locator('.navbar__title')).toBeVisible({ timeout: expectTimeout });
  });
});

test.describe('Real-World Scenarios', () => {
  test('13. E2E flow with retry and timeout strategy', async ({ page }, testInfo) => {
    // Set generous timeout for E2E test
    test.setTimeout(90000);

    if (testInfo.retry > 0) {
      console.log('🔄 Retry - using extra caution');
      await page.waitForTimeout(2000); // Brief pause before retry
    }

    // Navigate
    await page.goto('https://playwright.dev', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Interact
    await page.click('text=Docs', { timeout: 10000 });
    await expect(page).toHaveURL(/.*docs.*/, { timeout: 15000 });

    // Verify
    await expect(page.locator('.theme-doc-markdown')).toBeVisible({ timeout: 20000 });
  });

  test('14. API-dependent UI test', async ({ page }, testInfo) => {
    // Higher timeout for API-dependent content
    test.setTimeout(60000);

    await page.goto('https://playwright.dev');

    // Wait for potential API calls to complete
    await page.waitForLoadState('networkidle');

    // Allow longer for dynamic content
    const dynamicContentTimeout = testInfo.retry > 0 ? 20000 : 10000;

    await expect(page.locator('.hero')).toBeVisible({
      timeout: dynamicContentTimeout
    });
  });

  test('15. Complex user journey', async ({ page }, testInfo) => {
    test.slow(); // Triple timeout for complex flow

    console.log(`\n🚀 Starting complex journey (Attempt ${testInfo.retry + 1})`);

    // Step 1: Navigate
    await page.goto('https://playwright.dev');
    await page.waitForLoadState('load');

    // Step 2: Search
    const searchTimeout = testInfo.retry > 0 ? 15000 : 10000;
    await expect(page.locator('.navbar__title')).toBeVisible({ timeout: searchTimeout });

    // Step 3: Navigate to docs
    await page.click('text=Docs', { timeout: 10000 });
    await expect(page).toHaveURL(/.*docs.*/);

    // Step 4: Verify content loaded
    await expect(page.locator('.theme-doc-markdown')).toBeVisible({ timeout: 20000 });

    console.log('✅ Journey completed successfully');
  });
});
