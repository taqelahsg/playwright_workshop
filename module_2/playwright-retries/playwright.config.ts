import { defineConfig, devices } from '@playwright/test';

/**
 * Test Retries Configuration
 * This configuration demonstrates various retry strategies
 */
export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry configuration based on environment */
  retries: process.env.CI ? 2 : 0, // 2 retries on CI, 0 locally

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

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on retry */
    video: 'retain-on-failure',
  },

  /* Configure project with retry strategy */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      retries: 2,
    },
  ],
});
