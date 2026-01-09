import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Example: Blob Reporter for Sharding
 *
 * This config demonstrates using blob reporter for sharded test execution
 * Blob reports allow you to run tests in parallel across multiple machines
 * and then merge the results into a single report
 *
 * Usage - Run sharded tests:
 * npx playwright test --config=examples/blob-sharding.config.ts --shard=1/3
 * npx playwright test --config=examples/blob-sharding.config.ts --shard=2/3
 * npx playwright test --config=examples/blob-sharding.config.ts --shard=3/3
 *
 * Then merge the reports:
 * npx playwright merge-reports --reporter html ./blob-report
 */
export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: undefined,

  // Blob reporter for sharding
  reporter: [
    ['blob', {
      // Output folder for blob reports
      outputDir: 'blob-report',

      // Optional: file name pattern
      // fileName: `report-${process.env.SHARD_INDEX || 'unknown'}.zip`,
    }],

    // Also show progress in console
    ['line'],
  ],

  use: {
    baseURL: 'https://demo.playwright.dev',
    trace: 'on',
    screenshot: 'on',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
