import { test, expect } from '../fixtures/todoFixtures';

/**
 * Tests using custom TodoPage fixture
 *
 * The todoPage fixture:
 * - Automatically navigates to the todo app
 * - Provides a TodoPage instance
 * - Cleans up todos after each test
 */

test.describe('Custom TodoPage Fixture', () => {
  test('should add todo using fixture', async ({ todoPage }) => {
    // The page is already on the todo app thanks to the fixture
    await todoPage.addTodo('Buy groceries');

    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.getTodoByText('Buy groceries')).toBeVisible();
  });

  test('should add multiple todos', async ({ todoPage }) => {
    await todoPage.addTodo('First todo');
    await todoPage.addTodo('Second todo');
    await todoPage.addTodo('Third todo');

    await expect(todoPage.todoItems).toHaveCount(3);
  });

  test('should toggle todo completion', async ({ todoPage }) => {
    await todoPage.addTodo('Complete this task');

    await todoPage.toggleTodo('Complete this task');

    // Verify the todo is marked as completed
    await expect(todoPage.getTodoByText('Complete this task')).toHaveClass(/completed/);
  });

  test('should remove todo', async ({ todoPage }) => {
    await todoPage.addTodo('Remove me');
    await expect(todoPage.todoItems).toHaveCount(1);

    await todoPage.removeTodo('Remove me');

    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test('should start with clean state', async ({ todoPage }) => {
    // This test demonstrates that the fixture cleanup works
    // Even though previous tests added todos, this test starts fresh
    const count = await todoPage.getTodoCount();
    expect(count).toBe(0);
  });
});

/**
 * Demonstrating fixture reusability across test files
 */
test.describe('Fixture Reusability', () => {
  test('first test adds todos', async ({ todoPage }) => {
    await todoPage.addTodo('Task 1');
    await todoPage.addTodo('Task 2');

    await expect(todoPage.todoItems).toHaveCount(2);
  });

  test('second test has clean state', async ({ todoPage }) => {
    // Thanks to fixture cleanup, this test starts fresh
    await expect(todoPage.todoItems).toHaveCount(0);

    await todoPage.addTodo('New task');
    await expect(todoPage.todoItems).toHaveCount(1);
  });
});

/**
 * Using page fixture alongside custom fixture
 */
test.describe('Combining Fixtures', () => {
  test('can use both page and todoPage fixtures', async ({ page, todoPage }) => {
    // todoPage provides convenient methods
    await todoPage.addTodo('Test todo');

    // But you still have access to the raw page for custom actions
    const title = await page.title();
    console.log(`Page title: ${title}`);

    // Use todoPage for verification
    await expect(todoPage.todoItems).toHaveCount(1);
  });
});
