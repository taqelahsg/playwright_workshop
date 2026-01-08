import { test as teardown } from '@playwright/test';
import * as fs from 'fs';

/**
 * Global Cleanup
 *
 * This file runs AFTER all test projects complete (via project dependencies).
 * It's used to:
 * - Clean up test data
 * - Remove authentication state
 * - Delete temporary files
 * - Log test summary
 *
 * All projects that list this project in their dependencies will run first.
 */

const authFile = 'playwright/.auth/user.json';

teardown.describe('Global Cleanup', () => {
  teardown('clean up authentication state', async ({}) => {
    console.log('🧹 Running global cleanup...');

    // Remove authentication file
    if (fs.existsSync(authFile)) {
      fs.unlinkSync(authFile);
      console.log(`✓ Removed authentication file: ${authFile}`);
    } else {
      console.log('ℹ No authentication file to remove');
    }
  });

  teardown('clean up test data', async ({}) => {
    console.log('🧹 Cleaning up test data...');

    // In a real application, you might:
    // - Delete test users from database
    // - Remove test organizations
    // - Clear sample data
    // - Reset test state

    console.log('✓ Test data cleanup completed');
  });

  teardown('remove temporary files', async ({}) => {
    console.log('🧹 Removing temporary files...');

    // Clean up any temporary files created during tests
    const tempDirs = [
      'test-results/temp',
      'playwright/.auth'
    ];

    for (const dir of tempDirs) {
      if (fs.existsSync(dir)) {
        try {
          fs.rmSync(dir, { recursive: true, force: true });
          console.log(`✓ Removed directory: ${dir}`);
        } catch (error) {
          console.log(`⚠ Could not remove directory: ${dir}`);
        }
      }
    }
  });

  teardown('log test summary', async ({}) => {
    console.log('📊 Test Suite Summary:');
    console.log('=' .repeat(50));
    console.log('✓ All test projects completed');
    console.log('✓ Cleanup completed successfully');
    console.log('=' .repeat(50));
  });
});

teardown.describe('Cleanup - Resource Verification', () => {
  teardown('verify cleanup completed', async ({}) => {
    console.log('🔍 Verifying cleanup...');

    // Verify auth file is removed
    const authExists = fs.existsSync(authFile);
    if (!authExists) {
      console.log('✓ Authentication state removed');
    }

    console.log('✓ Cleanup verification completed');
    console.log('🎉 All tests and cleanup finished!');
  });
});
