import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global Setup
 *
 * This file runs BEFORE all test projects (via project dependencies).
 * It's used to:
 * - Perform authentication
 * - Set up test data
 * - Create necessary directories
 * - Save authentication state for other tests
 *
 * All projects with dependencies: ['setup'] will wait for this to complete.
 */

const authFile = 'playwright/.auth/user.json';

setup.describe('Global Setup', () => {
  setup('create auth directory', async ({}) => {
    // Create .auth directory if it doesn't exist
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
      console.log(`✓ Created directory: ${authDir}`);
    }
  });

  setup('authenticate user', async ({ page }) => {
    console.log('🔧 Running global setup...');

    // In a real application, you would:
    // 1. Navigate to login page
    // 2. Fill in credentials
    // 3. Submit form
    // 4. Wait for successful login
    // 5. Save authentication state

    // Example (mock):
    // await page.goto('https://example.com/login');
    // await page.fill('input[name="username"]', process.env.TEST_USERNAME || 'testuser');
    // await page.fill('input[name="password"]', process.env.TEST_PASSWORD || 'testpass');
    // await page.click('button[type="submit"]');
    // await page.waitForURL('https://example.com/dashboard');

    // For this demo, we'll just create a mock authentication state
    await page.goto('https://playwright.dev');

    // Verify page loaded
    await expect(page).toHaveTitle(/Playwright/);

    // Save storage state (cookies, localStorage, sessionStorage)
    await page.context().storageState({ path: authFile });

    console.log(`✓ Authentication state saved to: ${authFile}`);
    console.log('✓ Global setup completed successfully');
  });

  setup('verify authentication state', async ({}) => {
    // Verify the auth file was created
    const authExists = fs.existsSync(authFile);
    expect(authExists).toBe(true);

    if (authExists) {
      const authData = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
      console.log(`✓ Auth file contains ${authData.cookies?.length || 0} cookies`);
      console.log(`✓ Auth file contains ${authData.origins?.length || 0} origins`);
    }
  });
});

setup.describe('Setup - Test Data Preparation', () => {
  setup('prepare test data', async ({}) => {
    console.log('🔧 Preparing test data...');

    // In a real application, you might:
    // - Create test users in database
    // - Set up test organizations
    // - Generate sample data
    // - Initialize test state

    console.log('✓ Test data preparation completed');
  });

  setup('verify environment', async ({}) => {
    console.log('🔧 Verifying environment...');

    // Check environment variables
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`CI: ${process.env.CI ? 'Yes' : 'No'}`);

    // Verify necessary files or configurations exist
    const configExists = fs.existsSync('playwright.config.ts');
    expect(configExists).toBe(true);

    console.log('✓ Environment verification completed');
  });
});
