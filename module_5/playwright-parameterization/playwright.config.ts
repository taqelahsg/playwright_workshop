import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Parameterization Configuration
 *
 * This configuration demonstrates various parameterization approaches:
 * - Test-level parameterization with forEach loops
 * - Project-level parameterization with custom options
 * - Environment-based parameterization
 * - CSV-based test generation
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
    baseURL: 'https://demo.playwright.dev/todomvc',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Headless mode disabled - browser will be visible
    headless: false,

    // Slow down by 500ms for better observation
    launchOptions: {
      slowMo: 500,
    },
  },

  // Configure test projects for parameterization examples
  projects: [
    // ============================================
    // BASIC PARAMETERIZATION EXAMPLES
    // ============================================
    {
      name: 'basic-parameterization',
      testMatch: /.*basic-param.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // ============================================
    // PROJECT-LEVEL PARAMETERIZATION
    // Custom user type parameter examples
    // ============================================
    {
      name: 'user-alice',
      testMatch: /.*project-param.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        // Custom options passed to tests
        person: 'Alice',
        environment: 'staging',
      },
    },
    {
      name: 'user-bob',
      testMatch: /.*project-param.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        person: 'Bob',
        environment: 'staging',
      },
    },
    {
      name: 'user-charlie-prod',
      testMatch: /.*project-param.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        person: 'Charlie',
        environment: 'production',
      },
    },

    // ============================================
    // ROLE-BASED PARAMETERIZATION
    // Different user roles for testing
    // ============================================
    {
      name: 'role-admin',
      testMatch: /.*role-param.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        userRole: 'admin',
        locale: 'en-US',
      },
    },
    {
      name: 'role-user',
      testMatch: /.*role-param.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        userRole: 'user',
        locale: 'en-US',
      },
    },
    {
      name: 'role-guest',
      testMatch: /.*role-param.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        userRole: 'guest',
        locale: 'en-US',
      },
    },

    // ============================================
    // CSV-BASED PARAMETERIZATION
    // Tests generated from CSV data files
    // ============================================
    {
      name: 'csv-tests',
      testMatch: /.*csv-param.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // ============================================
    // ENVIRONMENT VARIABLE PARAMETERIZATION
    // Uses .env files for configuration
    // ============================================
    {
      name: 'env-tests',
      testMatch: /.*env-param.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // ============================================
    // MATRIX TESTING
    // Cross-browser and viewport combinations
    // ============================================
    {
      name: 'matrix-chrome-mobile',
      testMatch: /.*matrix-param.*\.spec\.ts/,
      use: {
        ...devices['iPhone 13'],
      },
    },
    {
      name: 'matrix-chrome-desktop',
      testMatch: /.*matrix-param.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
