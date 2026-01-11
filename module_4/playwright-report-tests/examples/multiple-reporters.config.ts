import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Example: Multiple Reporters
 *
 * This config demonstrates running multiple reporters simultaneously
 * to get different types of output from a single test run
 *
 * Usage:
 * npx playwright test --config=examples/multiple-reporters.config.ts
 */
export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: undefined,

  // Configure multiple reporters
  reporter: [
    // 1. List reporter for console output
    ['list'],

    // 2. HTML reporter for interactive viewing
    ['html', {
      outputFolder: 'playwright-report-multiple',
      open: 'never', // 'always' | 'never' | 'on-failure'
    }],

    // 3. JSON reporter for programmatic access
    ['json', {
      outputFile: 'test-results/results-multiple.json',
    }],

    // 4. JUnit reporter for CI integration
    ['junit', {
      outputFile: 'test-results/results-multiple.xml',
      embedAnnotationsAsProperties: true,
    }],
  ],

  use: {
    baseURL: 'https://demo.playwright.dev',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
