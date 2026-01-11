import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Projects Configuration
 *
 * Simplified configuration with only Chromium browser
 * - Headless: false (browser visible)
 * - SlowMo: 500ms (slowed down for observation)
 */
export default defineConfig({
  testDir: './tests',

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Test output folder
  outputDir: 'test-results',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Number of parallel workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL: 'https://playwright.dev',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Headless mode disabled - browser will be visible
    headless: false,

    // Slow down by 500ms (moved to launchOptions)
    launchOptions: {
      slowMo: 500,
    },
  },

  // Configure test projects
  projects: [
    // ============================================
    // SETUP PROJECT - Runs before other projects
    // ============================================
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // ============================================
    // CHROMIUM BROWSER ONLY
    // ============================================
    {
      name: 'chromium',
      testIgnore: /.*api.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        // Storage state from setup
        storageState: 'playwright/.auth/user.json',
        // Headless and slowMo inherited from global use settings
      },
      dependencies: ['setup'],
    },

    // ============================================
    // API TESTING PROJECT
    // ============================================
    {
      name: 'api',
      testMatch: /.*api.*\.spec\.ts/,
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
      },
    },

    // ============================================
    // CLEANUP PROJECT - Runs after all tests
    // ============================================
    {
      name: 'cleanup',
      testMatch: /.*\.cleanup\.ts/,
      dependencies: ['chromium'],
    },
  ],
});
