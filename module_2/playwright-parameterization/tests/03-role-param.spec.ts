import { test, expect } from '../fixtures/custom-test';

/**
 * Role-Based Parameterization Examples
 *
 * Demonstrates:
 * - Testing different user roles
 * - Permission-based test logic
 * - Role-specific feature access
 */

test.describe('Role-Based Testing', () => {
  test('should have different capabilities based on role', async ({ page, userRole }) => {
    console.log(`Testing with role: ${userRole}`);

    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.getByPlaceholder('What needs to be done?');

    // Simulate different role capabilities
    switch (userRole) {
      case 'admin':
        console.log('Admin can perform all operations');
        await input.fill('Admin task: Configure system');
        await input.press('Enter');
        console.log('✓ Admin has full access');
        break;

      case 'user':
        console.log('Regular user has standard access');
        await input.fill('User task: Complete assignment');
        await input.press('Enter');
        console.log('✓ User has standard access');
        break;

      case 'guest':
        console.log('Guest has limited access');
        await input.fill('Guest task: View demo');
        await input.press('Enter');
        console.log('✓ Guest has read-only access');
        break;

      default:
        console.log(`Unknown role: ${userRole}`);
    }

    // Common assertion
    const todos = page.locator('.todo-list li');
    await expect(todos).toHaveCount(1);
  });

  test('should display role-appropriate features', async ({ page, userRole, locale }) => {
    console.log(`Testing features for ${userRole} in ${locale}`);

    await page.goto('https://demo.playwright.dev/todomvc');

    // Demonstrate role-based feature visibility
    const header = page.locator('h1');
    await expect(header).toBeVisible();

    console.log(`Role: ${userRole}`);
    console.log(`Locale: ${locale}`);

    // In a real application, you might check for role-specific UI elements
    if (userRole === 'admin') {
      console.log('Checking for admin panel...');
      // await expect(page.locator('.admin-panel')).toBeVisible();
    } else if (userRole === 'user') {
      console.log('Checking for user dashboard...');
      // await expect(page.locator('.user-dashboard')).toBeVisible();
    } else {
      console.log('Checking for guest view...');
      // await expect(page.locator('.guest-view')).toBeVisible();
    }
  });

  test('should enforce role-based permissions', async ({ page, userRole }) => {
    console.log(`Testing permissions for: ${userRole}`);

    await page.goto('https://demo.playwright.dev/todomvc');

    // Create tasks to test permissions
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill(`Task created by ${userRole}`);
    await input.press('Enter');

    await input.fill('Another task');
    await input.press('Enter');

    const todos = page.locator('.todo-list li');
    await expect(todos).toHaveCount(2);

    // Test deletion permissions (demo only)
    if (userRole === 'admin' || userRole === 'user') {
      console.log(`${userRole} can delete tasks`);
      // In a real app, you would test actual deletion
    } else {
      console.log(`${userRole} cannot delete tasks`);
      // Verify delete button is not available
    }
  });
});

test.describe('Locale-Based Testing', () => {
  test('should display content in correct locale', async ({ page, locale }) => {
    console.log(`Testing locale: ${locale}`);

    await page.goto('https://demo.playwright.dev/todomvc');

    // In a real application, you might check for localized text
    console.log(`Expected locale: ${locale}`);

    // Example: checking page language
    const html = page.locator('html');
    // In a real app, you'd verify the lang attribute matches locale
    await expect(html).toBeVisible();

    // Create a task with locale-specific text
    const input = page.getByPlaceholder('What needs to be done?');
    const localizedTask = locale === 'en-US' ? 'Task in English' :
                         locale === 'es-ES' ? 'Tarea en español' :
                         locale === 'fr-FR' ? 'Tâche en français' :
                         'Task in default language';

    await input.fill(localizedTask);
    await input.press('Enter');

    const todo = page.locator('.todo-list li').first();
    await expect(todo).toContainText(localizedTask.split(' ')[0]);
  });

  test('should format data according to locale', async ({ page, locale, userRole }) => {
    console.log(`Testing data formatting for ${locale} as ${userRole}`);

    await page.goto('https://demo.playwright.dev/todomvc');

    // Example: Date and number formatting would differ by locale
    const timestamp = new Date().toLocaleString(locale);
    console.log(`Timestamp in ${locale}: ${timestamp}`);

    // In a real app, you'd verify localized date/number formats
    await expect(page).toHaveTitle(/TodoMVC/);
  });
});

test.describe('Combined Role and Locale Testing', () => {
  test('should work with both role and locale parameters', async ({ page, userRole, locale }) => {
    console.log(`Testing ${userRole} role with ${locale} locale`);

    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.getByPlaceholder('What needs to be done?');

    // Combine role and locale in test logic
    const taskPrefix = userRole.charAt(0).toUpperCase() + userRole.slice(1);
    const localeCode = locale.split('-')[0].toUpperCase();
    const taskText = `${taskPrefix} task (${localeCode})`;

    await input.fill(taskText);
    await input.press('Enter');

    const todo = page.locator('.todo-list li').first();
    await expect(todo).toContainText(taskPrefix);

    console.log(`✓ Test completed for ${userRole} in ${locale}`);
  });
});
