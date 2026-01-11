# Parallel Test Execution in Playwright

## Overview

Playwright Test executes tests in parallel by default, significantly reducing test suite execution time. Understanding how parallelization works and how to control it is crucial for building efficient and reliable test suites.

## Practical Examples

This tutorial includes a complete working project with examples demonstrating all parallel execution concepts:

**Location:** [playwright-parallel-tests](playwright-parallel-tests/)

The project contains 8 detailed examples covering:
1. Basic parallel execution
2. Serial mode
3. Explicitly parallel mode
4. Worker control
5. Test sharding
6. Worker index information
7. Fully parallel mode
8. Real-world scenario (e-commerce testing with mixed parallelization strategies)

See the [README](playwright-parallel-tests/README.md) for installation and usage instructions.

## Table of Contents

1. [How Parallel Execution Works](#how-parallel-execution-works)
2. [Worker Processes](#worker-processes)
3. [Configuring Parallel Execution](#configuring-parallel-execution)
4. [Fully Parallel Mode](#fully-parallel-mode)
5. [Serial Mode](#serial-mode)
6. [Worker Indexing and Isolation](#worker-indexing-and-isolation)
7. [Test Sharding](#test-sharding)
8. [Controlling Test Order](#controlling-test-order)
9. [Best Practices](#best-practices)

---

## How Parallel Execution Works

### Default Behavior

By default, Playwright Test runs:
- **Test files in parallel** - Different test files run simultaneously
- **Tests within a file sequentially** - Tests in the same file run one after another in the same worker process

```
File 1 (Worker 1)    File 2 (Worker 2)    File 3 (Worker 3)
  test 1               test 1               test 1
  test 2               test 2               test 2
  test 3               test 3               test 3
```

### Key Concepts

- Each worker process gets its own browser instance
- Workers operate independently with no communication between them
- Tests in the same file share the same worker process
- Workers are reused to improve speed when possible

---

## Worker Processes

Workers are OS processes that run independently, orchestrated by the test runner.

### Worker Characteristics

- **Isolated**: Each worker has its own environment
- **Independent**: Workers cannot communicate with each other
- **Clean State**: Workers automatically shut down after test failures to ensure a fresh environment
- **Reusable**: Workers are reused across test files for performance

### How Many Workers?

By default, Playwright uses:
- **Locally**: Half of your CPU cores
- **CI**: Typically configured to a fixed number (e.g., 2)

---

## Configuring Parallel Execution

### Limit Worker Count

**Via Command Line:**

```bash
# Run with 4 workers
npx playwright test --workers 4

# Run with 1 worker (disable parallelism)
npx playwright test --workers=1
```

**Via Configuration File:**

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Use 2 workers in CI, auto-detect locally
  workers: process.env.CI ? 2 : undefined,
});
```

### Disable Parallelism Completely

```typescript
export default defineConfig({
  workers: 1,
});
```

Or via command line:

```bash
npx playwright test --workers=1
```

### Limit Failures

Stop test execution after reaching a failure threshold:

```bash
npx playwright test --max-failures=10
```

Configuration:

```typescript
export default defineConfig({
  maxFailures: process.env.CI ? 10 : undefined,
});
```

---

## Fully Parallel Mode

By default, tests within a single file run sequentially. Enable parallel execution within files using `fullyParallel`.

### Per File (Describe Block)

```typescript
import { test } from '@playwright/test';

// Configure this describe block to run tests in parallel
test.describe.configure({ mode: 'parallel' });

test('test 1', async ({ page }) => {
  await page.goto('https://example.com');
  // This test runs in parallel with test 2
});

test('test 2', async ({ page }) => {
  await page.goto('https://example.com');
  // This test runs in parallel with test 1
});
```

### Global Configuration

Enable fully parallel mode for all test files:

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
});
```

**Important**: When `fullyParallel` is enabled, tests within the same file may run in different worker processes.

### Opt Out of Fully Parallel Mode

Override global setting for specific test suites:

```typescript
test.describe('runs sequentially', () => {
  // Override global fullyParallel setting
  test.describe.configure({ mode: 'default' });

  test('runs first', async ({ page }) => {
    // Executes before test 2
  });

  test('runs second', async ({ page }) => {
    // Executes after test 1
  });
});
```

---

## Serial Mode

Serial mode forces tests to run sequentially and skips remaining tests if one fails.

### Use Serial Mode

```typescript
import { test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('step 1: login', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.fill('#username', 'user');
  await page.fill('#password', 'pass');
  await page.click('button[type="submit"]');
});

test('step 2: navigate to profile', async ({ page }) => {
  // If step 1 fails, this test is skipped
  await page.goto('https://example.com/profile');
});

test('step 3: update profile', async ({ page }) => {
  // If step 1 or 2 fails, this test is skipped
  await page.fill('#bio', 'New bio');
  await page.click('button[type="submit"]');
});
```

### When to Use Serial Mode

- **Multi-step workflows**: Tests that represent sequential steps in a user journey
- **Dependent tests**: When later tests rely on earlier test state
- **Setup sequences**: When tests need specific ordering

**Note**: Generally, prefer independent tests. Use serial mode sparingly as it reduces parallelization benefits.

---

## Worker Indexing and Isolation

Access unique worker identifiers to isolate test data.

### Environment Variables

```typescript
// Unique worker ID
const workerId = process.env.TEST_WORKER_INDEX;

// Worker index (0 to workers-1)
const parallelIndex = process.env.TEST_PARALLEL_INDEX;
```

### TestInfo Properties

```typescript
test('example', async ({ page }, testInfo) => {
  console.log(`Worker Index: ${testInfo.workerIndex}`);
  console.log(`Parallel Index: ${testInfo.parallelIndex}`);
});
```

### Isolate Test Data Per Worker

Create separate database users for each worker:

```typescript
// tests/fixtures.ts
import { test as baseTest } from '@playwright/test';

type WorkerFixtures = {
  dbUserName: string;
};

export const test = baseTest.extend<{}, WorkerFixtures>({
  dbUserName: [async ({ }, use) => {
    // Create unique user for this worker
    const userName = `test-user-${test.info().workerIndex}`;
    await createUserInDatabase(userName);

    // Use the user in tests
    await use(userName);

    // Cleanup after all tests in this worker
    await deleteUserFromDatabase(userName);
  }, { scope: 'worker' }],
});
```

Usage in tests:

```typescript
import { test } from './fixtures';

test('user test 1', async ({ page, dbUserName }) => {
  // Each worker uses its own database user
  console.log(`Using database user: ${dbUserName}`);
});

test('user test 2', async ({ page, dbUserName }) => {
  // Same user as test 1 (in same worker)
  console.log(`Using database user: ${dbUserName}`);
});
```

### Port Isolation Example

Assign unique ports per worker:

```typescript
export const test = baseTest.extend<{}, { workerPort: number }>({
  workerPort: [async ({ }, use) => {
    const port = 3000 + test.info().workerIndex;
    await use(port);
  }, { scope: 'worker' }],
});

test('server test', async ({ page, workerPort }) => {
  await page.goto(`http://localhost:${workerPort}`);
});
```

---

## Test Sharding

Distribute test execution across multiple machines for even faster test runs.

### How Sharding Works

Sharding splits your test suite into chunks that can run on different machines:

```
Machine 1: Shard 1/3 (Files 1-3)
Machine 2: Shard 2/3 (Files 4-6)
Machine 3: Shard 3/3 (Files 7-9)
```

### Run Specific Shard

```bash
# Run shard 1 of 3
npx playwright test --shard=1/3

# Run shard 2 of 3
npx playwright test --shard=2/3

# Run shard 3 of 3
npx playwright test --shard=3/3
```

### CI/CD Integration Example (GitHub Actions)

```yaml
name: Playwright Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-${{ matrix.shardIndex }}
          path: playwright-report/
```

### Benefits of Sharding

- Faster CI pipeline execution
- Better resource utilization across multiple machines
- Reduced wait times for test results

---

## Controlling Test Order

### Alphabetical Ordering

When parallelism is disabled (`--workers=1`), test files execute alphabetically.

Use naming conventions:

```
tests/
  001-authentication.spec.ts
  002-user-profile.spec.ts
  003-shopping-cart.spec.ts
```

### Test List Files

Create explicit test execution order:

```typescript
// test.list.ts
import { test } from '@playwright/test';

// Import test suites
import authenticationTests from './001-authentication.spec';
import profileTests from './002-user-profile.spec';
import cartTests from './003-shopping-cart.spec';

// Execute in specific order
test.describe('Authentication Flow', authenticationTests);
test.describe('User Profile', profileTests);
test.describe('Shopping Cart', cartTests);
```

Individual test files export their tests:

```typescript
// 001-authentication.spec.ts
import { test, expect } from '@playwright/test';

export default () => {
  test('login', async ({ page }) => {
    // Test implementation
  });

  test('logout', async ({ page }) => {
    // Test implementation
  });
};
```

Configuration:

```typescript
// playwright.config.ts
export default defineConfig({
  workers: 1,
  testMatch: 'test.list.ts',
});
```

---

## Best Practices

### 1. Keep Tests Independent

```typescript
// ✅ Good: Each test is self-contained
test('create user', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('#email', `user-${Date.now()}@example.com`);
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});

test('login user', async ({ page }) => {
  // Create its own user, doesn't depend on previous test
  const email = `user-${Date.now()}@example.com`;
  await createUser(email, 'password123');

  await page.goto('/login');
  await page.fill('#email', email);
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

### 2. Avoid Shared State

```typescript
// ❌ Bad: Shared state between tests
let userId: string;

test('create user', async ({ page }) => {
  userId = await createUser(); // Sets global variable
});

test('update user', async ({ page }) => {
  await updateUser(userId); // Depends on global variable
});

// ✅ Good: Use fixtures for shared state
type MyFixtures = {
  authenticatedPage: Page;
};

const test = baseTest.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
    await use(page);
  },
});

test('test 1', async ({ authenticatedPage }) => {
  // Use authenticated page
});

test('test 2', async ({ authenticatedPage }) => {
  // Gets its own authenticated page
});
```

### 3. Use Appropriate Worker Count

```typescript
export default defineConfig({
  workers: process.env.CI
    ? 2  // CI: Limited resources
    : undefined,  // Local: Auto-detect (50% of CPU cores)
});
```

### 4. Leverage Worker Fixtures for Expensive Operations

```typescript
// ✅ Good: One-time setup per worker
export const test = baseTest.extend<{}, WorkerFixtures>({
  testDatabase: [async ({ }, use) => {
    const dbName = `test-db-${test.info().workerIndex}`;
    await createDatabase(dbName);
    await use(dbName);
    await dropDatabase(dbName);
  }, { scope: 'worker' }],
});
```

### 5. Use Serial Mode Sparingly

```typescript
// ❌ Bad: Overusing serial mode
test.describe.configure({ mode: 'serial' });

test('independent test 1', async ({ page }) => { /* ... */ });
test('independent test 2', async ({ page }) => { /* ... */ });

// ✅ Good: Only for truly dependent tests
test.describe('user flow', () => {
  test.describe.configure({ mode: 'serial' });

  test('step 1: signup', async ({ page }) => { /* ... */ });
  test('step 2: verify email', async ({ page }) => { /* ... */ });
  test('step 3: complete profile', async ({ page }) => { /* ... */ });
});
```

### 6. Monitor Test Execution

```bash
# See which tests run on which workers
npx playwright test --reporter=line

# More detailed output
npx playwright test --reporter=list
```

### 7. Balance Sharding

When using sharding, distribute tests evenly:

```bash
# Good: 4 shards for 40 test files (10 files per shard)
npx playwright test --shard=1/4

# Suboptimal: 10 shards for 12 test files (uneven distribution)
npx playwright test --shard=1/10
```

---

## Common Patterns

### Pattern 1: Environment-Based Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : undefined,
  fullyParallel: !process.env.SERIAL_MODE,
  maxFailures: process.env.CI ? 5 : undefined,
});
```

### Pattern 2: Mixed Parallelization

```typescript
// Most tests run in parallel
export default defineConfig({
  fullyParallel: true,
});

// Specific suite runs serially
test.describe('critical user journey', () => {
  test.describe.configure({ mode: 'serial' });
  // Tests run in order
});
```

### Pattern 3: Worker-Scoped Test Data

```typescript
// Create isolated test data per worker
export const test = baseTest.extend<{}, WorkerFixtures>({
  workerStorageState: [async ({ browser }, use) => {
    const id = test.info().workerIndex;
    const fileName = `playwright/.auth/user-${id}.json`;

    if (!fs.existsSync(fileName)) {
      const page = await browser.newPage();
      await page.goto('/login');
      await page.fill('#email', `user-${id}@example.com`);
      await page.fill('#password', 'password');
      await page.click('button[type="submit"]');
      await page.context().storageState({ path: fileName });
      await page.close();
    }

    await use(fileName);
  }, { scope: 'worker' }],
});

// Use in tests
test.use({ storageState: ({ workerStorageState }, use) => use(workerStorageState) });
```

---

## Troubleshooting

### Issue: Flaky Tests in Parallel Mode

**Symptom**: Tests pass when run with `--workers=1` but fail in parallel.

**Causes**:
- Shared state between tests
- Race conditions
- Port conflicts
- Database conflicts

**Solutions**:
```typescript
// Use worker-scoped fixtures for isolation
// Use unique identifiers per test
// Avoid global state
```

### Issue: Tests Timeout in Parallel Mode

**Symptom**: Tests timeout when running with multiple workers but pass with `--workers=1`.

**Causes**:
- Resource contention (CPU, memory, network)
- Too many workers for available resources

**Solutions**:
```typescript
export default defineConfig({
  workers: process.env.CI ? 2 : 4,  // Reduce worker count
  timeout: 60000,  // Increase timeout
});
```

### Issue: Inconsistent Test Results Across Workers

**Symptom**: Same test passes on some workers and fails on others.

**Causes**:
- Not properly isolating test data
- Timing issues
- Browser state not properly reset

**Solutions**:
```typescript
// Use worker fixtures for isolation
// Ensure proper cleanup in fixtures
// Use unique test data per worker
```

---

## Summary

- **Default**: Test files run in parallel, tests within files run sequentially
- **Workers**: Independent OS processes with isolated browser instances
- **Configuration**: Control parallelization via `workers`, `fullyParallel`, and `serial` mode
- **Worker Indexing**: Use `testInfo.workerIndex` for data isolation
- **Sharding**: Distribute tests across multiple machines for faster execution
- **Best Practice**: Keep tests independent and isolated for effective parallelization

---

## Additional Resources

- [Official Playwright Parallelization Docs](https://playwright.dev/docs/test-parallel)
- [Playwright Configuration](https://playwright.dev/docs/test-configuration)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
- [CI/CD Integration](https://playwright.dev/docs/ci)
