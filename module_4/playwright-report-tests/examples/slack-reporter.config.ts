import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Example: Slack Reporter
 *
 * This config demonstrates sending test results to Slack
 *
 * Setup:
 * 1. Create a Slack webhook URL at: https://api.slack.com/messaging/webhooks
 * 2. Set the environment variable:
 *    export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
 *
 * Usage:
 * npx playwright test --config=examples/slack-reporter.config.ts
 */
export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: undefined,

  // Use Slack reporter
  reporter: [
    // Slack reporter for notifications
    ['./reporters/slack-reporter.ts'],

    // Also use list reporter for console output
    ['list'],

    // And HTML for detailed viewing
    ['html', {
      outputFolder: 'playwright-report-slack',
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
