import { test, expect } from '../fixtures/custom-test';
import { browserConfigs } from '../test-data/test-users';

/**
 * Matrix Parameterization Examples
 *
 * Demonstrates:
 * - Cross-browser testing
 * - Multiple viewport combinations
 * - Device emulation
 * - Nested parameterization
 */

test.describe('Matrix Testing - Browser and Viewport', () => {
  test('should display browser and viewport info', async ({ page, browserName }) => {
    console.log('='.repeat(60));
    console.log(`Browser: ${browserName}`);
    console.log(`Viewport: ${page.viewportSize()?.width}x${page.viewportSize()?.height}`);
    console.log('='.repeat(60));

    await page.goto('https://demo.playwright.dev/todomvc');

    const header = page.locator('h1');
    await expect(header).toBeVisible();

    console.log(`✓ Page loaded successfully on ${browserName}`);
  });

  test('should create todo on different configurations', async ({ page, browserName }) => {
    const viewport = page.viewportSize();
    console.log(`Testing on ${browserName} with ${viewport?.width}x${viewport?.height}`);

    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill(`Task on ${browserName}`);
    await input.press('Enter');

    const todo = page.locator('.todo-list li').first();
    await expect(todo).toContainText(browserName);

    console.log(`✓ Todo created on ${browserName}`);
  });
});

// ============================================
// Viewport-specific tests using TypeScript data
// ============================================

test.describe('Viewport Configuration Tests', () => {
  browserConfigs.forEach((config) => {
    test(`test on ${config.name}`, async ({ page }) => {
      console.log(`Testing configuration: ${config.name}`);
      console.log(`Viewport: ${config.viewport.width}x${config.viewport.height}`);

      // Set viewport size
      await page.setViewportSize(config.viewport);

      await page.goto('https://demo.playwright.dev/todomvc');

      const header = page.locator('h1');
      await expect(header).toBeVisible();

      // Add a task with viewport info
      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill(`Task on ${config.name}`);
      await input.press('Enter');

      const todo = page.locator('.todo-list li').first();
      await expect(todo).toBeVisible();

      console.log(`✓ Test passed on ${config.name}`);
    });
  });
});

// ============================================
// Responsive testing with different viewports
// ============================================

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
  ];

  viewports.forEach((viewport) => {
    test(`should be responsive on ${viewport.name}`, async ({ page }) => {
      console.log(`Testing responsive design on ${viewport.name}`);
      console.log(`Viewport: ${viewport.width}x${viewport.height}`);

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto('https://demo.playwright.dev/todomvc');

      // Check if header is visible
      const header = page.locator('h1');
      await expect(header).toBeVisible();

      // Check if input is accessible
      const input = page.getByPlaceholder('What needs to be done?');
      await expect(input).toBeVisible();

      // Verify input is usable
      await input.fill(`Task on ${viewport.name}`);
      await input.press('Enter');

      const todo = page.locator('.todo-list li').first();
      await expect(todo).toBeVisible();

      // Get element dimensions for verification
      const headerBox = await header.boundingBox();
      if (headerBox) {
        console.log(`Header width: ${headerBox.width}px`);
      }

      console.log(`✓ Responsive test passed on ${viewport.name}`);
    });
  });
});

// ============================================
// Cross-browser and cross-viewport matrix
// ============================================

test.describe('Full Matrix Testing', () => {
  const browsers = ['chromium', 'firefox', 'webkit'];
  const sizes = [
    { name: 'small', width: 375, height: 667 },
    { name: 'large', width: 1920, height: 1080 },
  ];

  // Note: This creates a matrix of tests
  // In playwright.config.ts, different projects handle different browsers
  sizes.forEach((size) => {
    test(`create and complete todo on ${size.name} screen`, async ({ page, browserName }) => {
      console.log(`Browser: ${browserName}, Size: ${size.name}`);

      await page.setViewportSize({
        width: size.width,
        height: size.height,
      });

      await page.goto('https://demo.playwright.dev/todomvc');

      // Create todo
      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill(`Matrix test: ${browserName} on ${size.name}`);
      await input.press('Enter');

      // Verify todo created
      const todo = page.locator('.todo-list li').first();
      await expect(todo).toBeVisible();

      // Mark as complete
      const checkbox = todo.locator('input[type="checkbox"]');
      await checkbox.check();

      // Verify completion
      await expect(todo).toHaveClass(/completed/);

      console.log(`✓ Matrix test passed: ${browserName} on ${size.name}`);
    });
  });
});

// ============================================
// Device emulation tests
// ============================================

test.describe('Device Emulation Tests', () => {
  const devices = [
    {
      name: 'iPhone 13',
      viewport: { width: 390, height: 844 },
      isMobile: true,
    },
    {
      name: 'iPad Pro',
      viewport: { width: 1024, height: 1366 },
      isMobile: false,
    },
    {
      name: 'Desktop',
      viewport: { width: 1920, height: 1080 },
      isMobile: false,
    },
  ];

  devices.forEach((device) => {
    test(`should work on ${device.name}`, async ({ page }) => {
      console.log(`Emulating device: ${device.name}`);
      console.log(`Mobile: ${device.isMobile ? 'Yes' : 'No'}`);
      console.log(`Viewport: ${device.viewport.width}x${device.viewport.height}`);

      await page.setViewportSize(device.viewport);

      await page.goto('https://demo.playwright.dev/todomvc');

      const input = page.getByPlaceholder('What needs to be done?');
      await expect(input).toBeVisible();

      // Different interaction based on device type
      if (device.isMobile) {
        console.log('Using mobile interaction pattern');
        await input.tap();
      } else {
        console.log('Using desktop interaction pattern');
        await input.click();
      }

      await input.fill(`Task on ${device.name}`);
      await input.press('Enter');

      const todo = page.locator('.todo-list li').first();
      await expect(todo).toContainText(device.name);

      console.log(`✓ Device emulation test passed for ${device.name}`);
    });
  });
});

// ============================================
// Orientation testing
// ============================================

test.describe('Orientation Tests', () => {
  const orientations = [
    { name: 'portrait', width: 375, height: 667 },
    { name: 'landscape', width: 667, height: 375 },
  ];

  orientations.forEach((orientation) => {
    test(`should work in ${orientation.name} orientation`, async ({ page }) => {
      console.log(`Testing ${orientation.name} orientation`);
      console.log(`Dimensions: ${orientation.width}x${orientation.height}`);

      await page.setViewportSize({
        width: orientation.width,
        height: orientation.height,
      });

      await page.goto('https://demo.playwright.dev/todomvc');

      const header = page.locator('h1');
      await expect(header).toBeVisible();

      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill(`Task in ${orientation.name}`);
      await input.press('Enter');

      const todo = page.locator('.todo-list li').first();
      await expect(todo).toBeVisible();

      console.log(`✓ ${orientation.name} orientation test passed`);
    });
  });
});
