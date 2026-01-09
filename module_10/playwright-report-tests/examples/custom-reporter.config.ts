import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Example: Custom Reporter
 *
 * This config demonstrates using custom reporters
 *
 * Usage:
 * npx playwright test --config=examples/custom-reporter.config.ts
 */
export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: undefined,

  // Use custom reporter
  reporter: [
    // Custom reporter (relative path from config file)
    ['./reporters/custom-reporter.ts'],

    // Optional: Also generate HTML report
    ['html', {
      outputFolder: 'playwright-report-custom',
      open: 'never',
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
