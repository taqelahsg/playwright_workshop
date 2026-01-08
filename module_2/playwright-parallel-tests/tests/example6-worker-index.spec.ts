import { test, expect } from '@playwright/test';

/**
 * Example 6: Worker Index and Parallel Worker Info
 *
 * Access worker information to understand which worker is running the test.
 * This is useful for debugging and understanding parallel execution.
 */

test('check worker index', async ({ page }, testInfo) => {
  const workerIndex = testInfo.parallelIndex;
  console.log(`Running on worker index: ${workerIndex}`);
  console.log(`Test title: ${testInfo.title}`);
  console.log(`Project name: ${testInfo.project.name}`);

  await page.goto('/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('worker info test 1', async ({ page }, testInfo) => {
  console.log(`Worker ${testInfo.parallelIndex}: Test 1`);
  await page.goto('/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('worker info test 2', async ({ page }, testInfo) => {
  console.log(`Worker ${testInfo.parallelIndex}: Test 2`);
  await page.goto('/docs/intro');
  await expect(page.locator('h1')).toBeVisible();
});

test('worker info test 3', async ({ page }, testInfo) => {
  console.log(`Worker ${testInfo.parallelIndex}: Test 3`);
  await page.goto('/community/welcome');
  await expect(page.locator('h1')).toBeVisible();
});

test('worker info test 4', async ({ page }, testInfo) => {
  console.log(`Worker ${testInfo.parallelIndex}: Test 4`);
  await page.goto('/docs/api/class-playwright');
  await expect(page.locator('h1')).toBeVisible();
});

test('detailed worker info', async ({ page }, testInfo) => {
  console.log('=== Detailed Worker Information ===');
  console.log(`Parallel Index: ${testInfo.parallelIndex}`);
  console.log(`Worker Index: ${testInfo.workerIndex}`);
  console.log(`Title: ${testInfo.title}`);
  console.log(`Status: ${testInfo.status}`);
  console.log(`Duration: ${testInfo.duration}ms`);
  console.log(`Project: ${testInfo.project.name}`);

  await page.goto('/');
  await expect(page).toHaveTitle(/Playwright/);
});
