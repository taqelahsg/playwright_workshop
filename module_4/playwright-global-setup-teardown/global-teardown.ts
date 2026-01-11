import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Running global teardown...');

  // Example: Clean up resources, delete test data, etc.
  // await fs.rm('auth.json', { force: true });

  console.log('✅ Global teardown completed successfully');
}

export default globalTeardown;
