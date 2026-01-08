import { test, expect } from '@playwright/test';

/**
 * Basic Test Parameterization Examples
 *
 * Demonstrates:
 * - Simple forEach loops for data-driven tests
 * - Multiple test data scenarios
 * - Different input combinations
 */

// ============================================
// Example 1: Basic forEach Parameterization
// ============================================

const greetingData = [
  { name: 'Alice', greeting: 'Hello, Alice!' },
  { name: 'Bob', greeting: 'Hello, Bob!' },
  { name: 'Charlie', greeting: 'Hello, Charlie!' },
];

test.describe('Basic Parameterization', () => {
  greetingData.forEach(({ name, greeting }) => {
    test(`should greet user ${name}`, async ({ page }) => {
      console.log(`Testing greeting for: ${name}`);
      console.log(`Expected greeting: ${greeting}`);

      // This is a demonstration - in real tests you'd navigate to actual pages
      await page.goto('https://demo.playwright.dev/todomvc');

      // Example assertion
      await expect(page).toHaveTitle(/TodoMVC/);
    });
  });
});

// ============================================
// Example 2: Multiple Parameters
// ============================================

const searchTestData = [
  {
    description: 'should handle normal text search',
    query: 'Playwright',
    expectedBehavior: 'finds results',
  },
  {
    description: 'should handle special characters',
    query: 'test@#$%',
    expectedBehavior: 'handles gracefully',
  },
  {
    description: 'should handle empty query',
    query: '',
    expectedBehavior: 'shows validation',
  },
  {
    description: 'should handle very long text',
    query: 'a'.repeat(100),
    expectedBehavior: 'truncates or handles',
  },
];

test.describe('Search Parameterization', () => {
  searchTestData.forEach(({ description, query, expectedBehavior }) => {
    test(description, async ({ page }) => {
      console.log(`Query: "${query}"`);
      console.log(`Expected: ${expectedBehavior}`);

      await page.goto('https://demo.playwright.dev/todomvc');

      // Demonstration of using parameterized data
      const input = page.getByPlaceholder('What needs to be done?');
      if (query) {
        await input.fill(query);
      }

      await expect(page).toHaveTitle(/TodoMVC/);
    });
  });
});

// ============================================
// Example 3: Boolean Flags
// ============================================

const loginScenarios = [
  {
    username: 'admin',
    password: 'admin123',
    shouldSucceed: true,
    expectedRole: 'Administrator',
  },
  {
    username: 'user',
    password: 'user123',
    shouldSucceed: true,
    expectedRole: 'User',
  },
  {
    username: 'invalid',
    password: 'wrong',
    shouldSucceed: false,
    expectedRole: '',
  },
];

test.describe('Login Scenarios', () => {
  loginScenarios.forEach(({ username, password, shouldSucceed, expectedRole }) => {
    test(`login as ${username} - ${shouldSucceed ? 'success' : 'failure'}`, async ({ page }) => {
      console.log(`Testing login for: ${username}`);
      console.log(`Should succeed: ${shouldSucceed}`);
      console.log(`Expected role: ${expectedRole || 'none'}`);

      await page.goto('https://demo.playwright.dev/todomvc');

      // This is a demonstration
      if (shouldSucceed) {
        console.log(`✓ Login should succeed with role: ${expectedRole}`);
      } else {
        console.log(`✗ Login should fail`);
      }

      await expect(page).toHaveTitle(/TodoMVC/);
    });
  });
});

// ============================================
// Example 4: Numeric Range Testing
// ============================================

const quantityTests = [
  { quantity: 0, isValid: false, description: 'zero quantity' },
  { quantity: 1, isValid: true, description: 'minimum valid quantity' },
  { quantity: 10, isValid: true, description: 'normal quantity' },
  { quantity: 99, isValid: true, description: 'maximum valid quantity' },
  { quantity: 100, isValid: false, description: 'exceeds maximum' },
  { quantity: -1, isValid: false, description: 'negative quantity' },
];

test.describe('Quantity Validation', () => {
  quantityTests.forEach(({ quantity, isValid, description }) => {
    test(`should handle ${description} (${quantity})`, async ({ page }) => {
      console.log(`Testing quantity: ${quantity}`);
      console.log(`Is valid: ${isValid}`);

      await page.goto('https://demo.playwright.dev/todomvc');

      if (isValid) {
        console.log(`✓ Quantity ${quantity} should be accepted`);
      } else {
        console.log(`✗ Quantity ${quantity} should be rejected`);
      }

      await expect(page).toHaveTitle(/TodoMVC/);
    });
  });
});

// ============================================
// Example 5: Edge Cases
// ============================================

const edgeCases = [
  { description: 'empty string', input: '', type: 'string' },
  { description: 'whitespace only', input: '   ', type: 'string' },
  { description: 'very long string', input: 'x'.repeat(1000), type: 'string' },
  { description: 'special characters', input: '!@#$%^&*()', type: 'string' },
  { description: 'unicode characters', input: '你好世界', type: 'string' },
  { description: 'emoji', input: '😀🎉🚀', type: 'string' },
  { description: 'HTML tags', input: '<script>alert("xss")</script>', type: 'string' },
  { description: 'SQL injection attempt', input: "'; DROP TABLE users; --", type: 'string' },
];

test.describe('Edge Case Testing', () => {
  edgeCases.forEach(({ description, input, type }) => {
    test(`should handle ${description}`, async ({ page }) => {
      console.log(`Testing edge case: ${description}`);
      console.log(`Input type: ${type}`);
      console.log(`Input value: ${input.length > 50 ? input.substring(0, 50) + '...' : input}`);

      await page.goto('https://demo.playwright.dev/todomvc');

      const inputField = page.getByPlaceholder('What needs to be done?');
      await inputField.fill(input);

      await expect(page).toHaveTitle(/TodoMVC/);
    });
  });
});
