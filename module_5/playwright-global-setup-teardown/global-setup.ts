import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('='.repeat(60));
  console.log('🚀 Global Setup Started');
  console.log('='.repeat(60));

  const startTime = Date.now();

  // Example: Launch browser and perform one-time operation
  console.log('📱 Launching browser for initial setup...');

  const browser = await chromium.launch({
    headless: true, // Use headless for setup
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Example: Navigate to a page to warm up or verify site is accessible
  console.log('🌐 Verifying Playwright website is accessible...');
  await page.goto('https://playwright.dev');

  const title = await page.title();
  console.log(`✅ Successfully accessed: ${title}`);

  // Example: Store authentication state or other setup data
  // await context.storageState({ path: 'auth.json' });

  // Close browser - we're done with the one-time setup
  await browser.close();

  // Example: You could also set up environment variables
  process.env.SETUP_TIMESTAMP = new Date().toISOString();

  const duration = Date.now() - startTime;
  console.log('='.repeat(60));
  console.log(`✅ Global setup completed successfully in ${duration}ms`);
  console.log(`⏰ Setup timestamp: ${process.env.SETUP_TIMESTAMP}`);
  console.log('='.repeat(60));
  console.log('');
}

export default globalSetup;
