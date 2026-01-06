import { test, expect } from '../fixtures/automaticFixtures';

/**
 * Tests using automatic fixtures
 *
 * The testLogger automatic fixture will run for every test
 * even though we don't explicitly request it in the test function.
 */

test.describe('Automatic Fixture Demo', () => {
  test('first test with auto logger', async ({ todoPage }) => {
    // The testLogger fixture automatically logs test start/end
    // You don't need to request it in the function parameters

    await todoPage.addTodo('Test with auto logging');
    await expect(todoPage.todoItems).toHaveCount(1);
  });

  test('second test also gets auto logger', async ({ todoPage }) => {
    // Every test in this file gets automatic logging
    // Check the console output to see the logs

    await todoPage.addTodo('Another test');
    await expect(todoPage.todoItems).toHaveCount(1);
  });

  test('passing test example', async ({ todoPage }) => {
    await todoPage.addTodo('This test will pass');
    await expect(todoPage.todoItems).toHaveCount(1);
  });

  test.skip('skipped test still logs', async ({ todoPage }) => {
    // Even skipped tests trigger the automatic fixture
    await todoPage.addTodo('This is skipped');
  });
});

test.describe('Automatic Fixture with Multiple Tests', () => {
  test('test 1', async ({ todoPage }) => {
    await todoPage.addTodo('Task 1');
    await expect(todoPage.todoItems).toHaveCount(1);
  });

  test('test 2', async ({ todoPage }) => {
    await todoPage.addTodo('Task 2');
    await expect(todoPage.todoItems).toHaveCount(1);
  });

  test('test 3', async ({ todoPage }) => {
    await todoPage.addTodo('Task 3');
    await expect(todoPage.todoItems).toHaveCount(1);
  });

  // All three tests above will have automatic logging
  // Check console output to see:
  // - Test start messages
  // - Test duration
  // - Pass/fail status
});
