import { defineConfig, devices } from '@playwright/test';

/**
 * Test Retries and Timeouts Configuration
 * This configuration demonstrates various retry strategies and timeout configurations
 */
export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Global timeout for entire test run (1 hour) */
  globalTimeout: process.env.CI ? 3600000 : undefined,

  /* Default timeout for each test (30 seconds) */
  timeout: 30000,

  /* Expect timeout for assertions (10 seconds) */
  expect: {
    timeout: 10000,
  },

  /* Retry configuration based on environment */
  retries: process.env.CI ? 2 : 2, // 2 retries for demonstration

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use */
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results.json' }]
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: 'https://playwright.dev',

    /* Run in headed mode */
    headless: false,

    /* Action timeout (10 seconds) - for individual actions */
    actionTimeout: 10000,

    /* Navigation timeout (30 seconds) - for page navigations */
    navigationTimeout: 30000,

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on retry */
    video: 'retain-on-failure',
  },

  /* Configure projects with different retry and timeout strategies */
  projects: [
    {
      name: 'chromium-standard',
      use: {
        ...devices['Desktop Chrome'],
      },
      retries: 2,
      timeout: 30000,
    },

    {
      name: 'chromium-no-retries',
      use: {
        ...devices['Desktop Chrome'],
      },
      retries: 0, // No retries
      timeout: 30000,
    },

    {
      name: 'chromium-aggressive-retries',
      use: {
        ...devices['Desktop Chrome'],
      },
      retries: 3, // More retries for flaky tests
      timeout: 45000, // Longer timeout
    },

    {
      name: 'chromium-fast-tests',
      testMatch: /.*timeout-examples\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
      retries: 1,
      timeout: 15000, // Shorter timeout for fast tests
    },

    {
      name: 'chromium-slow-tests',
      testMatch: /.*retry-timeout-combined\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
      retries: 3,
      timeout: 60000, // Longer timeout for complex tests
      expect: {
        timeout: 15000, // Longer expect timeout
      },
    },
  ],
});
