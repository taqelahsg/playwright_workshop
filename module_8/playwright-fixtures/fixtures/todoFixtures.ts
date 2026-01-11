import { test as base } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

/**
 * Custom fixture types definition
 */
type TodoFixtures = {
  todoPage: TodoPage;
};

/**
 * Example 1: Basic Page Object Fixture
 *
 * This fixture creates a TodoPage instance and automatically
 * cleans up todos after each test.
 */
export const test = base.extend<TodoFixtures>({
  todoPage: async ({ page }, use) => {
    // Setup: Create the page object
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    // Provide the fixture to the test
    await use(todoPage);

    // Teardown: Clean up all todos after the test
    await todoPage.removeAll();
  },
});

export { expect } from '@playwright/test';
