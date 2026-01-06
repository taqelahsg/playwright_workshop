import { test, expect } from '../fixtures/advancedFixtures';

/**
 * Tests using advanced fixture patterns
 */

test.describe('Multiple Page Object Fixtures', () => {
  test('should use two todo pages simultaneously', async ({ todoPage, secondTodoPage }) => {
    // Add todos to first page
    await todoPage.addTodo('First page todo');
    await expect(todoPage.todoItems).toHaveCount(1);

    // Add todos to second page (different browser page)
    await secondTodoPage.addTodo('Second page todo');
    await expect(secondTodoPage.todoItems).toHaveCount(1);

    // Verify isolation between pages
    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(secondTodoPage.todoItems).toHaveCount(1);
  });
});

test.describe('Test Data Fixtures', () => {
  test('should use pre-defined test data', async ({ todoPage, testTodos }) => {
    // testTodos fixture provides an array of test todo items
    console.log(`Adding ${testTodos.length} todos from fixture`);

    // Add all test todos
    for (const todo of testTodos) {
      await todoPage.addTodo(todo);
    }

    await expect(todoPage.todoItems).toHaveCount(testTodos.length);

    // Verify each todo was added
    for (const todo of testTodos) {
      await expect(todoPage.getTodoByText(todo)).toBeVisible();
    }
  });

  test('should filter and complete todos from test data', async ({ todoPage, testTodos }) => {
    // Add todos
    for (const todo of testTodos) {
      await todoPage.addTodo(todo);
    }

    // Complete the first todo
    await todoPage.toggleTodo(testTodos[0]);

    await expect(todoPage.getTodoByText(testTodos[0])).toHaveClass(/completed/);
    await expect(todoPage.getTodoByText(testTodos[1])).not.toHaveClass(/completed/);
  });
});

test.describe('Configuration Fixtures', () => {
  test('should use configuration from fixture', async ({ todoPage, slowMo }) => {
    console.log(`Running with slowMo: ${slowMo}ms`);

    await todoPage.addTodo('Test with config');
    await expect(todoPage.todoItems).toHaveCount(1);
  });
});

test.describe('Worker-Scoped Fixtures', () => {
  test('first test with worker info', async ({ todoPage, workerInfo }) => {
    console.log(`Test running on ${workerInfo.workerId}`);

    await todoPage.addTodo('Worker test 1');
    await expect(todoPage.todoItems).toHaveCount(1);
  });

  test('second test with same worker', async ({ todoPage, workerInfo }) => {
    console.log(`Test running on ${workerInfo.workerId}`);

    await todoPage.addTodo('Worker test 2');
    await expect(todoPage.todoItems).toHaveCount(1);
  });

  test('third test shares worker fixture', async ({ todoPage, workerInfo }) => {
    // Worker fixture is created once per worker and shared
    console.log(`Test running on ${workerInfo.workerId}`);
    console.log(`Worker started at: ${workerInfo.startTime}`);

    await todoPage.addTodo('Worker test 3');
    await expect(todoPage.todoItems).toHaveCount(1);
  });
});

test.describe('Fixture Dependency Chain', () => {
  test('should handle fixture dependencies', async ({ todoPage, testTodos }) => {
    // todoPage depends on page fixture (built-in)
    // testTodos is independent
    // Both can be used together

    // Add one todo from test data
    await todoPage.addTodo(testTodos[0]);

    // Add a custom todo
    await todoPage.addTodo('Custom todo');

    await expect(todoPage.todoItems).toHaveCount(2);
  });
});

test.describe('Combining Multiple Fixtures', () => {
  test('should use all fixtures together', async ({
    todoPage,
    testTodos,
    slowMo,
    workerInfo,
  }) => {
    console.log(`Worker: ${workerInfo.workerId}`);
    console.log(`SlowMo: ${slowMo}ms`);
    console.log(`Test todos: ${testTodos.length}`);

    // Use testTodos fixture
    await todoPage.addTodo(testTodos[0]);
    await todoPage.addTodo(testTodos[1]);

    await expect(todoPage.todoItems).toHaveCount(2);
  });
});
