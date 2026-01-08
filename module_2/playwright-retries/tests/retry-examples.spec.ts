import { test, expect } from '@playwright/test';

/**
 * Minimal Retry Examples - 10 Essential Tests
 */

test.describe('Basic Retry Tests', () => {
  test('1. Simple passing test', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('2. Test that passes on retry', async ({ page }, testInfo) => {
    await page.goto('/');

    // Fail on first attempt, pass on retry
    if (testInfo.retry === 0) {
      await expect(page.locator('.non-existent')).toBeVisible({ timeout: 1000 });
    } else {
      await expect(page.locator('.navbar__title')).toBeVisible();
    }
  });

  test('3. Navigation test', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Docs');
    await expect(page).toHaveURL(/.*docs.*/);
  });

  test('4. Detect retry attempt', async ({ page }, testInfo) => {
    console.log(`Attempt: ${testInfo.retry + 1}, Max retries: ${testInfo.project.retries}`);
    await page.goto('/');
    await expect(page.locator('.navbar__title')).toBeVisible();
  });

  test('5. Wait strategy test', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.navbar__title')).toBeVisible();
  });
});

test.describe('Retry Patterns', () => {
  test('6. Exponential backoff', async ({ page }, testInfo) => {
    if (testInfo.retry > 0) {
      const backoffTime = Math.pow(2, testInfo.retry) * 1000;
      console.log(`Backoff: ${backoffTime}ms`);
      await page.waitForTimeout(backoffTime);
    }

    await page.goto('/');

    if (testInfo.retry < 2) {
      throw new Error('Simulated failure');
    }

    await expect(page.locator('.navbar__title')).toBeVisible();
  });

  test('7. Cleanup on retry', async ({ page }, testInfo) => {
    if (testInfo.retry > 0) {
      await page.context().clearCookies();
    }

    await page.goto('/');
    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('8. Multiple elements check', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.navbar__title')).toBeVisible();
    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('9. Complete user flow', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Docs');
    await expect(page).toHaveURL(/.*docs.*/);
    await expect(page.locator('.theme-doc-markdown')).toBeVisible();
  });

  test('10. Test with proper assertions', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
    await expect(page.locator('.navbar__title')).toHaveText(/Playwright/);
  });
});
