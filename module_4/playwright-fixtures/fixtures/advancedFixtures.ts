import { test as base } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

/**
 * Advanced fixture examples demonstrating different patterns
 */

/**
 * Example 1: Multiple Page Object Fixtures
 */
type PageFixtures = {
  todoPage: TodoPage;
  secondTodoPage: TodoPage;
};

/**
 * Example 2: Test Data Fixtures
 */
type DataFixtures = {
  testTodos: string[];
};

/**
 * Example 3: Configuration Fixtures
 */
type ConfigFixtures = {
  slowMo: number;
};

/**
 * Example 4: Worker-scoped Fixtures
 */
type WorkerFixtures = {
  workerInfo: { workerId: string; startTime: number };
};

/**
 * Combine all fixture types
 */
export const test = base.extend<
  PageFixtures & DataFixtures & ConfigFixtures,
  WorkerFixtures
>({
  // Test-scoped fixture: TodoPage with automatic cleanup
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
    await todoPage.removeAll();
  },

  // Test-scoped fixture: Second TodoPage instance (for multi-page tests)
  secondTodoPage: async ({ context }, use) => {
    const page = await context.newPage();
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
    await todoPage.removeAll();
    await page.close();
  },

  // Test-scoped fixture: Pre-defined test data
  testTodos: async ({}, use) => {
    const todos = [
      'Buy groceries',
      'Walk the dog',
      'Read a book',
      'Write tests',
    ];
    await use(todos);
    // No cleanup needed for simple data
  },

  // Test-scoped fixture: Configuration option
  slowMo: async ({}, use) => {
    // This could be read from environment variables
    const slowMo = process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0;
    await use(slowMo);
  },

  // Worker-scoped fixture: Shared worker information
  workerInfo: [
    async ({}, use, workerInfo) => {
      const info = {
        workerId: `worker-${workerInfo.workerIndex}`,
        startTime: Date.now(),
      };
      console.log(`Worker ${info.workerId} started`);
      await use(info);
      const duration = Date.now() - info.startTime;
      console.log(`Worker ${info.workerId} ran for ${duration}ms`);
    },
    { scope: 'worker' },
  ],
});

export { expect } from '@playwright/test';
