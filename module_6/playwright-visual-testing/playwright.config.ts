import { defineConfig, devices } from '@playwright/test';

/**
 * Visual Testing Configuration
 *
 * Key settings for consistent visual regression testing:
 * - Fixed viewport size for reproducible screenshots
 * - Single browser (Chromium) for consistency
 * - Disabled animations to prevent flakiness
 * - Custom threshold settings
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  // Single worker in CI for consistent screenshots
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
  ],

  // Visual testing configuration
  expect: {
    toHaveScreenshot: {
      // Maximum pixels that can differ
      maxDiffPixels: 100,

      // Color comparison threshold (0-1)
      // Lower = more strict
      threshold: 0.2,

      // Disable CSS animations and transitions
      animations: 'disabled',
    },
    toMatchSnapshot: {
      // For data snapshots
      maxDiffPixelRatio: 0.05,
    },
  },

  // Snapshot storage configuration
  snapshotDir: './snapshots',
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',

  use: {
    baseURL: 'https://taqelah.sg',

    // Consistent viewport for all tests
    viewport: { width: 1280, height: 720 },

    // Trace on first retry for debugging
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Visual tests typically run on single browser
    // Add more projects only if cross-browser visual testing is needed
  ],
});
