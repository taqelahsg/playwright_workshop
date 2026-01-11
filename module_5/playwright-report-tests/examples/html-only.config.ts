import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Example: HTML Reporter Only
 *
 * This config demonstrates using only the HTML reporter
 * with various configuration options
 *
 * Usage:
 * npx playwright test --config=examples/html-only.config.ts
 */
export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: undefined,

  // HTML reporter with custom settings
  reporter: [
    ['html', {
      // Output folder for the report
      outputFolder: 'playwright-report-html',

      // When to open the report
      // Options: 'always' | 'never' | 'on-failure'
      open: 'on-failure',

      // Host to serve the report (default: localhost)
      // host: 'localhost',

      // Port to serve the report
      // port: 9323,
    }],
  ],

  use: {
    baseURL: 'https://demo.playwright.dev',

    // Maximize artifacts for HTML report viewing
    trace: 'on', // Always capture trace
    screenshot: 'on', // Always capture screenshots
    video: 'on', // Always capture video

    // These will be visible in the HTML report
    actionTimeout: 15000,
    navigationTimeout: 30000,
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
  ],
});
