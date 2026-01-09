import { test, expect } from '@playwright/test';

/**
 * Test Tags Examples
 *
 * This file demonstrates how to use test tags for organizing and filtering tests.
 *
 * Run tests with tags:
 * - npm test -- --grep @smoke
 * - npm test -- --grep @critical
 * - npm test -- --grep "@smoke|@regression"
 * - npm test -- --grep-invert @slow
 */

// Single tag in test name
test('user login @smoke', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
  console.log('Smoke test: Basic login flow');
});

// Multiple tags in test name
test('checkout process @smoke @critical @e2e', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
  console.log('Critical smoke test for checkout');
});

// Tag using options object - single tag
test('search functionality', {
  tag: '@search',
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toContainText('Example');
});

// Tag using options object - multiple tags (array)
test('payment processing', {
  tag: ['@payment', '@critical', '@integration'],
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
  console.log('Critical payment integration test');
});

// Slow tests with tag
test('data export @slow', async ({ page }) => {
  test.slow(); // Mark as slow
  await page.goto('https://example.com');
  await page.waitForTimeout(1000); // Simulate slow operation
  await expect(page.locator('h1')).toBeVisible();
});

// Fast tests
test('quick validation @fast', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

// Different priority levels
test('critical user flow @critical @priority-high', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

test('medium priority feature @priority-medium', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

test('low priority test @priority-low', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('body')).toBeVisible();
});

// Test types
test('smoke test for homepage @smoke @homepage', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

test('regression test for login @regression @auth', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

test('integration test for API @integration @api', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

test('end-to-end user journey @e2e @user-journey', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Feature-based tags
test.describe('Authentication Tests', () => {
  test('login functionality @auth @login', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('logout functionality @auth @logout', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('password reset @auth @password', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Shopping Cart Tests', () => {
  test('add item to cart @cart @smoke', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('remove item from cart @cart', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('update cart quantity @cart', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page.locator('h1')).toBeVisible();
  });
});

// Environment-specific tags
test('production smoke test @prod @smoke', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

test('staging test @staging', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

test('local development test @local @dev', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Combined tags for complex filtering
test('critical checkout flow @critical @e2e @checkout @smoke', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
  console.log('Running critical checkout flow test');
});

// Tags with test.describe
test.describe('Payment Tests @payment', () => {
  test('credit card payment @credit-card @critical', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('paypal payment @paypal', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('payment failure handling @error-handling', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page.locator('h1')).toBeVisible();
  });
});

// Nightly build tests
test('full regression suite @nightly @regression @slow', async ({ page }) => {
  test.slow();
  await page.goto('https://example.com');
  await page.waitForTimeout(500);
  await expect(page).toHaveTitle(/Example/);
  console.log('Nightly regression test');
});

// Mobile-specific tags
test('mobile navigation @mobile @nav', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Accessibility tests
test('accessibility check @a11y @accessibility', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Performance tests
test('page load performance @performance @perf', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('https://example.com');
  const loadTime = Date.now() - startTime;
  console.log(`Page loaded in ${loadTime}ms`);
  await expect(page).toHaveTitle(/Example/);
});

// Security tests
test('XSS protection @security @xss', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

test('CSRF protection @security @csrf', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});
