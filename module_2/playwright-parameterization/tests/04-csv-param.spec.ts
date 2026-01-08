import { test, expect } from '@playwright/test';
import { loadCsvData } from '../utils/csv-helper';

/**
 * CSV-Based Parameterization Examples
 *
 * Demonstrates:
 * - Loading test data from CSV files
 * - Generating tests dynamically from CSV data
 * - Type-safe CSV data handling
 */

// ============================================
// Define TypeScript interfaces for CSV data
// ============================================

interface UserRecord {
  username: string;
  password: string;
  role: string;
  shouldSucceed: string; // CSV values are strings
}

interface TodoRecord {
  taskId: string;
  description: string;
  priority: string;
  category: string;
  estimatedMinutes: string;
}

// ============================================
// Load CSV data
// ============================================

const users = loadCsvData<UserRecord>('test-data/users.csv');
const todos = loadCsvData<TodoRecord>('test-data/todos.csv');

// ============================================
// Generate tests from user CSV data
// ============================================

test.describe('CSV User Login Tests', () => {
  users.forEach((user) => {
    const shouldSucceed = user.shouldSucceed === 'true';
    const testName = `login as ${user.username} - ${shouldSucceed ? 'success' : 'failure'}`;

    test(testName, async ({ page }) => {
      console.log('─'.repeat(50));
      console.log(`Username: ${user.username}`);
      console.log(`Role: ${user.role}`);
      console.log(`Expected: ${shouldSucceed ? 'Success' : 'Failure'}`);
      console.log('─'.repeat(50));

      await page.goto('https://demo.playwright.dev/todomvc');

      // This is a demonstration - in a real app you'd have a login page
      // For demo purposes, we'll just verify the page loads
      await expect(page).toHaveTitle(/TodoMVC/);

      if (shouldSucceed) {
        console.log(`✓ Login should succeed for ${user.username} with role: ${user.role}`);
      } else {
        console.log(`✗ Login should fail for ${user.username}`);
      }
    });
  });
});

// ============================================
// Generate tests from todo CSV data
// ============================================

test.describe('CSV Todo Creation Tests', () => {
  todos.forEach((todo) => {
    test(`create todo: ${todo.description}`, async ({ page }) => {
      console.log('─'.repeat(50));
      console.log(`Task ID: ${todo.taskId}`);
      console.log(`Description: ${todo.description}`);
      console.log(`Priority: ${todo.priority}`);
      console.log(`Category: ${todo.category}`);
      console.log(`Estimated Time: ${todo.estimatedMinutes} minutes`);
      console.log('─'.repeat(50));

      await page.goto('https://demo.playwright.dev/todomvc');

      const input = page.getByPlaceholder('What needs to be done?');

      // Create a formatted task string
      const taskText = `[${todo.priority.toUpperCase()}] ${todo.description} (${todo.category})`;
      await input.fill(taskText);
      await input.press('Enter');

      // Verify todo was created
      const todoItem = page.locator('.todo-list li').first();
      await expect(todoItem).toContainText(todo.description);

      console.log(`✓ Created task: ${todo.description}`);
    });
  });
});

// ============================================
// Filtered CSV data tests
// ============================================

test.describe('CSV Filtered Tests', () => {
  // Filter for high priority tasks only
  const highPriorityTodos = todos.filter(
    (todo) => todo.priority === 'high' || todo.priority === 'critical'
  );

  test('should display count of high priority tasks', async () => {
    console.log(`High priority tasks: ${highPriorityTodos.length}`);
    highPriorityTodos.forEach((todo, index) => {
      console.log(`  ${index + 1}. ${todo.description} [${todo.priority}]`);
    });

    expect(highPriorityTodos.length).toBeGreaterThan(0);
  });

  // Generate tests only for high priority tasks
  highPriorityTodos.forEach((todo) => {
    test(`urgent task: ${todo.description}`, async ({ page }) => {
      console.log(`Testing urgent task: ${todo.description}`);
      console.log(`Priority: ${todo.priority}`);

      await page.goto('https://demo.playwright.dev/todomvc');

      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill(`URGENT: ${todo.description}`);
      await input.press('Enter');

      const todoItem = page.locator('.todo-list li').first();
      await expect(todoItem).toContainText('URGENT');
    });
  });
});

// ============================================
// CSV data with custom transformations
// ============================================

test.describe('CSV Transformed Tests', () => {
  // Group todos by category
  const todosByCategory = todos.reduce((acc, todo) => {
    if (!acc[todo.category]) {
      acc[todo.category] = [];
    }
    acc[todo.category].push(todo);
    return acc;
  }, {} as Record<string, TodoRecord[]>);

  Object.entries(todosByCategory).forEach(([category, categoryTodos]) => {
    test(`category ${category} has ${categoryTodos.length} task(s)`, async ({ page }) => {
      console.log(`Category: ${category}`);
      console.log(`Number of tasks: ${categoryTodos.length}`);

      categoryTodos.forEach((todo, index) => {
        console.log(`  ${index + 1}. ${todo.description}`);
      });

      await page.goto('https://demo.playwright.dev/todomvc');
      await expect(page).toHaveTitle(/TodoMVC/);
    });
  });
});

// ============================================
// Successful users only tests
// ============================================

test.describe('Valid User Tests', () => {
  const validUsers = users.filter((user) => user.shouldSucceed === 'true');

  validUsers.forEach((user) => {
    test(`valid user ${user.username} workflow`, async ({ page }) => {
      console.log(`Testing workflow for valid user: ${user.username}`);
      console.log(`Role: ${user.role}`);

      await page.goto('https://demo.playwright.dev/todomvc');

      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill(`${user.username}'s task`);
      await input.press('Enter');

      const todoItem = page.locator('.todo-list li').first();
      await expect(todoItem).toContainText(user.username);

      console.log(`✓ Workflow completed for ${user.username}`);
    });
  });
});
