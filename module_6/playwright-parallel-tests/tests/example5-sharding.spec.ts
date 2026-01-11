import { test, expect } from '@playwright/test';

/**
 * Example 5: Test Sharding
 *
 * Sharding allows you to split your test suite across multiple machines or CI jobs.
 * Run with: npx playwright test --shard=1/3
 *
 * This will run the first third of tests. You can run --shard=2/3 and --shard=3/3
 * on different machines to parallelize across infrastructure.
 */

test.describe('sharding example', () => {
  for (let i = 1; i <= 10; i++) {
    test(`shard test ${i}`, async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/Playwright/);
      console.log(`Shard test ${i} completed`);
    });
  }
});

/**
 * To run this with sharding:
 *
 * Machine 1: npx playwright test example5-sharding.spec.ts --shard=1/3
 * Machine 2: npx playwright test example5-sharding.spec.ts --shard=2/3
 * Machine 3: npx playwright test example5-sharding.spec.ts --shard=3/3
 *
 * Each machine will run approximately 1/3 of the tests.
 */
