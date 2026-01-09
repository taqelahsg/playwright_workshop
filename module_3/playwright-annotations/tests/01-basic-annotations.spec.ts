import { test, expect } from '@playwright/test';

/**
 * Basic Test Annotations Examples
 *
 * This file demonstrates the fundamental test annotations:
 * - test.skip()
 * - test.only()
 * - test.fail()
 * - test.fixme()
 * - test.slow()
 */

// Regular test - runs normally
test('regular test that passes', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
});

// test.skip() - Skip this test entirely
test.skip('skipped test - not ready yet', async ({ page }) => {
  // This test will not run
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toHaveText('Not implemented yet');
});

// test.only() - Run only this test (comment out to run all tests)
// WARNING: Remove before committing to version control!
// test.only('focus on this test only', async ({ page }) => {
//   await page.goto('https://example.com');
//   await expect(page.locator('h1')).toBeVisible();
// });

// test.fail() - This test is expected to fail
test.fail('expected to fail - known bug', async ({ page }) => {
  await page.goto('https://example.com');
  // This assertion will fail, but that's expected
  await expect(page.locator('h1')).toHaveText('This will not match');
});

// test.fixme() - Test is broken and should not run
test.fixme('broken test - needs fixing', async ({ page }) => {
  // This test will not run because it's broken
  await page.goto('https://broken-url-that-doesnt-exist.com');
});

// test.slow() - Triple the timeout for slow tests
test.slow('slow test with extended timeout', async ({ page }) => {
  await page.goto('https://example.com');

  // Simulate a slow operation
  await page.waitForTimeout(2000);

  await expect(page.locator('h1')).toBeVisible();
});

// Multiple tests to demonstrate how annotations work together
test.describe('Annotation Group', () => {
  test('test 1 in group', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test.skip('test 2 - skipped in group', async ({ page }) => {
    // This will be skipped
    await page.goto('https://example.com');
  });

  test('test 3 in group', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page.locator('h1')).toBeVisible();
  });
});
