import { test, expect } from '@playwright/test';
import { env } from '../utils/env-config';

/**
 * Environment Variable Parameterization Examples
 *
 * Demonstrates:
 * - Using environment variables in tests
 * - Type-safe environment configuration
 * - Different configurations per environment
 */

test.describe('Environment Variable Tests', () => {
  test('should use base URL from environment', async ({ page }) => {
    console.log(`Base URL: ${env.baseUrl}`);
    console.log(`Environment: ${env.environment}`);

    await page.goto('/');
    await expect(page).toHaveTitle(/TodoMVC/);

    console.log(`✓ Navigated to ${env.baseUrl}`);
  });

  test('should use test user credentials from environment', async ({ page }) => {
    console.log('Test User Credentials:');
    console.log(`  Email: ${env.testUser.email}`);
    console.log(`  Password: ${'*'.repeat(env.testUser.password.length)}`);

    await page.goto(env.baseUrl);

    // In a real application, you would use these credentials to log in
    // For demo purposes, we just verify they're available
    expect(env.testUser.email).toBeTruthy();
    expect(env.testUser.password).toBeTruthy();

    console.log('✓ Credentials loaded from environment');
  });

  test('should use API configuration from environment', async ({ page }) => {
    console.log('API Configuration:');
    console.log(`  API Key: ${env.api.key.substring(0, 10)}...`);
    console.log(`  API Version: ${env.api.version}`);

    await page.goto(env.baseUrl);

    // In a real application, you might add API key to headers
    // page.setExtraHTTPHeaders({ 'X-API-Key': env.api.key });

    expect(env.api.version).toBeTruthy();
    console.log(`✓ Using API version ${env.api.version}`);
  });

  test('should respect feature flags from environment', async ({ page }) => {
    console.log('Feature Flags:');
    console.log(`  Advanced Features: ${env.features.advancedFeatures ? 'Enabled' : 'Disabled'}`);
    console.log(`  Debug Mode: ${env.features.debugMode ? 'Enabled' : 'Disabled'}`);

    await page.goto(env.baseUrl);

    const input = page.getByPlaceholder('What needs to be done?');

    if (env.features.advancedFeatures) {
      console.log('Testing with advanced features enabled');
      await input.fill('Advanced feature task');
    } else {
      console.log('Testing with basic features only');
      await input.fill('Basic task');
    }

    await input.press('Enter');

    const todo = page.locator('.todo-list li').first();
    await expect(todo).toBeVisible();
  });

  test('should use custom timeouts from environment', async ({ page }) => {
    console.log('Timeout Configuration:');
    console.log(`  Default: ${env.timeouts.default}ms`);
    console.log(`  Navigation: ${env.timeouts.navigation}ms`);

    await page.goto(env.baseUrl, {
      timeout: env.timeouts.navigation
    });

    await expect(page).toHaveTitle(/TodoMVC/);
    console.log('✓ Page loaded within configured timeout');
  });
});

test.describe('Environment-Specific Behavior', () => {
  test('should adapt based on environment', async ({ page }) => {
    console.log(`Testing on: ${env.environment} environment`);

    await page.goto(env.baseUrl);

    const input = page.getByPlaceholder('What needs to be done?');

    // Different behavior based on environment
    switch (env.environment) {
      case 'production':
        console.log('Running production test flow');
        await input.fill('Production task');
        break;

      case 'staging':
        console.log('Running staging test flow');
        await input.fill('Staging test task');
        break;

      case 'development':
      default:
        console.log('Running development test flow');
        await input.fill('Dev task with debug info');
        break;
    }

    await input.press('Enter');

    const todo = page.locator('.todo-list li').first();
    await expect(todo).toBeVisible();
  });

  test('should enable debug logging based on environment', async ({ page }) => {
    if (env.features.debugMode) {
      console.log('=== DEBUG MODE ENABLED ===');
      console.log('Full Environment Config:', JSON.stringify(env, null, 2));
    }

    await page.goto(env.baseUrl);

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Task with debug logging');

    if (env.features.debugMode) {
      console.log('Input value:', await input.inputValue());
    }

    await input.press('Enter');

    const todo = page.locator('.todo-list li').first();
    await expect(todo).toBeVisible();

    if (env.features.debugMode) {
      console.log('Todo text:', await todo.textContent());
      console.log('=== DEBUG MODE END ===');
    }
  });
});

test.describe('Multiple Environment Scenarios', () => {
  const scenarios = [
    { name: 'quick task', timeout: 5000 },
    { name: 'normal task', timeout: env.timeouts.default },
    { name: 'complex task', timeout: env.timeouts.default * 2 },
  ];

  scenarios.forEach(({ name, timeout }) => {
    test(`create ${name} with ${timeout}ms timeout`, async ({ page }) => {
      console.log(`Task: ${name}`);
      console.log(`Timeout: ${timeout}ms`);

      test.setTimeout(timeout);

      await page.goto(env.baseUrl);

      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill(name);
      await input.press('Enter');

      const todo = page.locator('.todo-list li').first();
      await expect(todo).toContainText(name);

      console.log(`✓ Completed ${name} within ${timeout}ms`);
    });
  });
});
