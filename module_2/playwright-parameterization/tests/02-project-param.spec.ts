import { test, expect } from '../fixtures/custom-test';

/**
 * Project-Level Parameterization Examples
 *
 * Demonstrates:
 * - Using custom test options
 * - Running same tests with different project configurations
 * - Accessing parameterized options as fixtures
 */

test.describe('Project Parameterization', () => {
  test('should use person and environment from project config', async ({ page, person, environment }) => {
    console.log(`Person: ${person}`);
    console.log(`Environment: ${environment}`);

    // The person and environment values come from the project configuration
    // Different projects will run this test with different values

    await page.goto('https://demo.playwright.dev/todomvc');

    // You can use these parameters in your test logic
    const header = page.locator('h1');
    await expect(header).toBeVisible();

    console.log(`Testing as ${person} on ${environment} environment`);
  });

  test('should perform user-specific workflow', async ({ page, person, environment }) => {
    console.log(`Running workflow for ${person} on ${environment}`);

    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill(`${person}'s task on ${environment}`);
    await input.press('Enter');

    // Verify the todo was added
    const todoText = page.locator('.todo-list li').first();
    await expect(todoText).toContainText(person);

    console.log(`✓ Workflow completed for ${person}`);
  });

  test('should handle environment-specific URLs', async ({ page, environment }) => {
    // In a real scenario, you might construct different URLs based on environment
    const baseUrl = environment === 'production'
      ? 'https://demo.playwright.dev/todomvc'
      : 'https://demo.playwright.dev/todomvc';

    console.log(`Testing on ${environment} environment`);
    console.log(`URL: ${baseUrl}`);

    await page.goto(baseUrl);
    await expect(page).toHaveTitle(/TodoMVC/);
  });

  test('should demonstrate multiple parameters', async ({ page, person, environment, locale }) => {
    console.log(`Person: ${person}`);
    console.log(`Environment: ${environment}`);
    console.log(`Locale: ${locale}`);

    await page.goto('https://demo.playwright.dev/todomvc');

    // You can use all custom parameters together
    const taskDescription = `Task for ${person} in ${locale} on ${environment}`;
    console.log(`Creating task: ${taskDescription}`);

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill(taskDescription);

    await expect(input).toHaveValue(taskDescription);
  });
});

test.describe('Conditional Test Logic', () => {
  test('should adapt based on person parameter', async ({ page, person }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Different test behavior based on the person
    if (person === 'Alice') {
      console.log('Running Alice-specific test logic');
      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill('Alice likes detailed tasks');
      await input.press('Enter');
    } else if (person === 'Bob') {
      console.log('Running Bob-specific test logic');
      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill('Bob prefers quick tasks');
      await input.press('Enter');
    } else {
      console.log(`Running default test logic for ${person}`);
      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill(`Generic task for ${person}`);
      await input.press('Enter');
    }

    // Common assertions
    const todos = page.locator('.todo-list li');
    await expect(todos).toHaveCount(1);
  });

  test('should use different timeouts per environment', async ({ page, environment }) => {
    // Adjust test behavior based on environment
    const timeout = environment === 'production' ? 10000 : 5000;
    console.log(`Using timeout: ${timeout}ms for ${environment}`);

    await page.goto('https://demo.playwright.dev/todomvc', {
      timeout: timeout
    });

    await expect(page).toHaveTitle(/TodoMVC/);
  });
});
