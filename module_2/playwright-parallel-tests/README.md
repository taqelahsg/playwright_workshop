# Playwright Parallel Test Execution Examples

This project demonstrates various approaches to parallel test execution in Playwright.

## Installation

```bash
npm install
npx playwright install
```

## Test Examples

### Example 1: Basic Parallel Execution
**File:** `tests/example1-parallel-tests.spec.ts`

Demonstrates default parallel execution where tests run concurrently across multiple workers.

```bash
npm run test:example1
```

### Example 2: Serial Mode
**File:** `tests/example2-serial-mode.spec.ts`

Shows how to use `test.describe.serial()` to run tests sequentially within a describe block. Useful when tests depend on each other or share state.

```bash
npm run test:example2
```

### Example 3: Explicitly Parallel Mode
**File:** `tests/example3-parallel-mode.spec.ts`

Demonstrates using `test.describe.parallel()` to explicitly mark tests for parallel execution.

```bash
npm run test:example3
```

### Example 4: Worker Control
**File:** `tests/example4-worker-control.spec.ts`

Shows how to control worker count and execution mode using `test.describe.configure()`.

```bash
npm run test:example4
```

### Example 5: Test Sharding
**File:** `tests/example5-sharding.spec.ts`

Demonstrates sharding tests across multiple machines or CI jobs.

```bash
# Run first shard
npm run test:shard1

# Run second shard (on different machine)
npm run test:shard2

# Run third shard (on different machine)
npm run test:shard3
```

### Example 6: Worker Index Information
**File:** `tests/example6-worker-index.spec.ts`

Shows how to access worker information during test execution for debugging and logging.

```bash
npm run test:example6
```

### Example 7: Fully Parallel Mode
**File:** `tests/example7-fully-parallel.spec.ts`

Demonstrates fully parallel execution mode where all tests run in parallel.

```bash
npm run test:example7
```

### Example 8: Real-World Scenario
**File:** `tests/example8-real-world-scenario.spec.ts`

Comprehensive example demonstrating realistic e-commerce testing scenarios including:
- Homepage verification tests (parallel)
- Documentation navigation tests (parallel)
- User journey tests (serial)
- Performance tests (controlled parallelism)
- Responsive design tests (parallel)
- Accessibility tests (parallel)

```bash
npm run test:example8
```

## Running Tests

### Run all tests (default parallel)
```bash
npm test
```

### Run with specific number of workers
```bash
npm run test:parallel  # 4 workers
npm run test:serial    # 1 worker (sequential)
```

### Run in headed mode (see browser)
```bash
npm run test:headed
```

### Run specific test file
```bash
npx playwright test example1-parallel-tests.spec.ts
```

### Run tests for specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### View test report
```bash
npm run test:report
```

## Key Concepts

### Parallel Execution (Default)
- Tests run concurrently across multiple worker processes
- Each worker has its own browser instance
- Significantly reduces total test execution time
- Configured via `workers` option in `playwright.config.ts`

### Serial Execution
- Tests run sequentially in order
- Use `test.describe.serial()` for dependent tests
- If one test fails, subsequent tests in the block are skipped
- Useful for workflows that share state

### Worker Control
- `fullyParallel: true` - All tests run in parallel (default)
- `workers: number` - Specify number of parallel workers
- `test.describe.configure({ mode: 'serial' })` - Force serial execution
- `test.describe.configure({ mode: 'parallel' })` - Force parallel execution

### Test Sharding
- Split test suite across multiple machines
- Use `--shard=X/Y` flag where X is current shard and Y is total shards
- Useful for CI/CD pipelines to reduce overall execution time
- Each shard runs approximately 1/Y of the total tests

### Worker Information
- Access `testInfo.parallelIndex` to get worker index
- Useful for debugging and understanding test execution
- Each worker runs tests independently with isolated context

## Configuration

The `playwright.config.ts` file controls parallel execution:

```typescript
export default defineConfig({
  // Run tests in parallel
  fullyParallel: true,

  // Number of workers (undefined = auto-detect CPU cores)
  workers: process.env.CI ? 2 : undefined,

  // Other options...
});
```

## Best Practices

1. **Design for Parallelism**: Write independent tests that don't rely on shared state
2. **Use Serial Mode Sparingly**: Only use when tests must run in sequence
3. **Optimize Worker Count**: Balance between speed and resource usage
4. **Leverage Sharding**: Split tests across machines in CI/CD for faster pipelines
5. **Monitor Worker Load**: Use worker index logging to debug load distribution
6. **Isolate Test Data**: Each test should create/clean up its own data
7. **Avoid Test Dependencies**: Tests should not depend on execution order

## Performance Tips

- **Parallel by Default**: Let Playwright run tests in parallel unless there's a specific reason not to
- **Group Related Tests**: Use describe blocks to organize related tests
- **Balance Worker Count**: Too many workers can cause resource contention
- **Use Sharding in CI**: Split tests across multiple CI jobs for faster builds
- **Profile Slow Tests**: Identify and optimize slow-running tests
- **Reuse Browser Contexts**: Share contexts within a worker when possible

## Troubleshooting

### Tests failing in parallel but passing serially?
- Check for shared state between tests
- Ensure tests are independent
- Look for race conditions

### Too many workers causing issues?
- Reduce worker count: `npx playwright test --workers=2`
- Check system resources (CPU, memory)

### Inconsistent test results?
- Review test isolation
- Check for timing issues
- Ensure proper waits and assertions

## Additional Resources

- [Playwright Parallelism Documentation](https://playwright.dev/docs/test-parallel)
- [Test Sharding Guide](https://playwright.dev/docs/test-sharding)
- [CI/CD Configuration](https://playwright.dev/docs/ci)
