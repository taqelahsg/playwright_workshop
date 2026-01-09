import { test, expect } from '@playwright/test';

/**
 * Basic test examples for demonstrating different reporters
 * These tests will pass/fail to show how reporters display results
 */

test.describe('Basic Navigation Tests', () => {
  test('should navigate to homepage successfully', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page).toHaveTitle(/React • TodoMVC/);
  });

  test('should display todo input field', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    const input = page.getByPlaceholder('What needs to be done?');
    await expect(input).toBeVisible();
  });

  test('should add a new todo item', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Write test report');
    await input.press('Enter');

    const todoItem = page.getByText('Write test report');
    await expect(todoItem).toBeVisible();
  });
});

test.describe('Todo Operations', () => {
  test('should add multiple todos', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    const input = page.getByPlaceholder('What needs to be done?');

    // Add first todo
    await input.fill('Task 1');
    await input.press('Enter');

    // Add second todo
    await input.fill('Task 2');
    await input.press('Enter');

    // Add third todo
    await input.fill('Task 3');
    await input.press('Enter');

    // Verify all todos are present
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 2')).toBeVisible();
    await expect(page.getByText('Task 3')).toBeVisible();
  });

  test('should mark todo as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    const input = page.getByPlaceholder('What needs to be done?');

    // Add a todo
    await input.fill('Complete this task');
    await input.press('Enter');

    // Mark as complete - target the specific todo's checkbox
    await page.getByRole('checkbox', { name: 'Toggle Todo' }).check();

    // Verify todo is marked as completed
    const todoItem = page.locator('.todo-list li').first();
    await expect(todoItem).toHaveClass(/completed/);
  });

  test('should delete a todo item', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    const input = page.getByPlaceholder('What needs to be done?');

    // Add a todo
    await input.fill('Delete me');
    await input.press('Enter');

    // Hover and delete
    const todoItem = page.locator('.todo-list li').first();
    await todoItem.hover();
    await page.locator('.destroy').first().click();

    // Verify todo is deleted
    await expect(page.getByText('Delete me')).not.toBeVisible();
  });
});

test.describe('Filter Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Add some todos before each test
    await page.goto('https://demo.playwright.dev/todomvc');
    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Active task 1');
    await input.press('Enter');
    await input.fill('Active task 2');
    await input.press('Enter');
  });

  test('should filter active todos', async ({ page }) => {
    // Click Active filter
    await page.getByRole('link', { name: 'Active' }).click();

    // Verify active todos are visible
    await expect(page.getByText('Active task 1')).toBeVisible();
    await expect(page.getByText('Active task 2')).toBeVisible();
  });

  test('should filter completed todos', async ({ page }) => {
    // Complete first todo
    await page.getByRole('checkbox').first().check();

    // Click Completed filter
    await page.getByRole('link', { name: 'Completed' }).click();

    // Should see only completed todo
    await expect(page.getByText('Active task 1')).toBeVisible();
  });

  test('should show all todos', async ({ page }) => {
    // Complete first todo
    await page.getByRole('checkbox').first().check();

    // Click All filter
    await page.getByRole('link', { name: 'All' }).click();

    // Should see all todos
    await expect(page.getByText('Active task 1')).toBeVisible();
    await expect(page.getByText('Active task 2')).toBeVisible();
  });
});
