import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Example: CI/CD Reporters
 *
 * This config is optimized for CI/CD environments with:
 * - Minimal console output (dot reporter)
 * - HTML report for artifact upload
 * - JUnit XML for test management integration
 * - GitHub Actions annotations (if running on GitHub)
 *
 * Usage:
 * CI=true npx playwright test --config=examples/ci-reporters.config.ts
 */
export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: true, // Fail if test.only is left in code
  retries: 2, // Retry failed tests in CI
  workers: 1, // Sequential execution in CI for stability

  // CI-optimized reporters
  reporter: [
    // 1. Dot reporter - minimal console output
    ['dot'],

    // 2. HTML reporter - for artifact storage
    ['html', {
      outputFolder: 'playwright-report-ci',
      open: 'never',
    }],

    // 3. JUnit reporter - for CI dashboards
    ['junit', {
      outputFile: 'test-results/junit-results.xml',
      embedAnnotationsAsProperties: true,
    }],

    // 4. JSON reporter - for custom processing
    ['json', {
      outputFile: 'test-results/test-results.json',
    }],

    // 5. GitHub Actions reporter (only if on GitHub Actions)
    ...(process.env.GITHUB_ACTIONS ? [['github' as const]] : []),
  ],

  use: {
    baseURL: 'https://demo.playwright.dev',
    trace: 'on', // Always capture trace in CI
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // CI-specific settings
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

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Example web server configuration for CI */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: false, // Always start fresh in CI
  //   timeout: 120000,
  // },
});
