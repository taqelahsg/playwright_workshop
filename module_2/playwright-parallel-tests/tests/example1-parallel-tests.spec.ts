import { test, expect } from '@playwright/test';

/**
 * Example 1: Basic Parallel Execution
 *
 * By default, Playwright runs tests in parallel across multiple worker processes.
 * Each test in this file will run in parallel with others.
 */

test('parallel test 1 - check homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Playwright/);
  console.log('Test 1 completed');
});

test('parallel test 2 - check docs page', async ({ page }) => {
  await page.goto('/docs/intro');
  await expect(page.locator('h1')).toContainText('Installation');
  console.log('Test 2 completed');
});

test('parallel test 3 - check API page', async ({ page }) => {
  await page.goto('/docs/api/class-playwright');
  await expect(page.locator('h1')).toContainText('Playwright');
  console.log('Test 3 completed');
});

test('parallel test 4 - check community page', async ({ page }) => {
  await page.goto('/community/welcome');
  await expect(page.locator('h1')).toBeVisible();
  console.log('Test 4 completed');
});

test('parallel test 5 - verify navigation', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Docs');
  await expect(page).toHaveURL(/.*docs.*/);
  console.log('Test 5 completed');
});
