import { test as base } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

/**
 * Automatic Fixtures Example
 *
 * Automatic fixtures run for every test without being explicitly requested.
 * They're useful for logging, monitoring, or global setup/teardown.
 */

type AutoFixtures = {
  todoPage: TodoPage;
  testLogger: void; // void type for automatic fixtures that don't provide a value
};

export const test = base.extend<AutoFixtures>({
  // Regular fixture: TodoPage
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
    await todoPage.removeAll();
  },

  // Automatic fixture: Runs for every test automatically
  testLogger: [
    async ({}, use, testInfo) => {
      const startTime = Date.now();
      console.log(`\n▶ Starting test: ${testInfo.title}`);
      console.log(`  Project: ${testInfo.project.name}`);
      console.log(`  File: ${testInfo.file}`);

      // Let the test run
      await use();

      // After test completes
      const duration = Date.now() - startTime;
      const status = testInfo.status;
      const emoji = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⚠️';

      console.log(`${emoji} Test ${status}: ${testInfo.title} (${duration}ms)`);

      if (status === 'failed') {
        console.log(`  Error: ${testInfo.error?.message}`);
      }
    },
    { auto: true }, // This makes the fixture automatic
  ],
});

export { expect } from '@playwright/test';
