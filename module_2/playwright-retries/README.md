# Playwright Test Retries Examples

This project demonstrates various test retry strategies and patterns in Playwright. It includes practical examples of how to configure, detect, and handle test retries effectively.

## 📋 Project Structure

```
playwright-retries/
├── tests/
│   ├── 01-basic-retry.standard.spec.ts           # Basic retry concepts
│   ├── 02-retry-detection.standard.spec.ts       # Detecting and responding to retries
│   ├── 03-simulated-flaky.flaky.spec.ts          # Simulated flaky test scenarios
│   ├── 04-serial-mode.serial.spec.ts             # Retries with serial test execution
│   ├── 05-no-retry.no-retry.spec.ts              # Tests without retries
│   ├── 06-flaky-detection.standard.spec.ts       # Detecting and logging flaky tests
│   ├── 07-exponential-backoff.standard.spec.ts   # Backoff strategies
│   └── 08-real-world-scenarios.standard.spec.ts  # Real-world retry scenarios
├── playwright.config.ts                           # Configuration with retry strategies
├── package.json
└── README.md
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test 01-basic-retry.standard.spec.ts

# Run tests from a specific project
npx playwright test --project=standard-retries

# Run tests without retries
npx playwright test --project=no-retries

# Run tests with aggressive retries (for flaky tests)
npx playwright test --project=aggressive-retries

# Run serial mode tests
npx playwright test --project=serial-with-retries

# Run with custom retry count
npx playwright test --retries=3

# Show browser while testing
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run specific test by name
npx playwright test -g "should pass on first attempt"
```

### View Reports

```bash
# Open HTML report
npx playwright show-report

# Open trace viewer
npx playwright show-trace trace.zip
```

## 📚 Test Examples Overview

### 1. Basic Retry Tests (`01-basic-retry.standard.spec.ts`)

Demonstrates fundamental retry concepts:
- Tests that pass on first attempt
- Tests that fail initially but pass on retry (flaky)
- Tests that fail even after all retries

```typescript
test('will eventually pass after retry', async ({ page }, testInfo) => {
  if (testInfo.retry === 0) {
    // First attempt - will fail
  } else {
    // Retry attempt - will pass
  }
});
```

### 2. Retry Detection (`02-retry-detection.standard.spec.ts`)

Shows how to detect and respond to retry attempts:
- Logging retry information
- Performing cleanup on retry
- Escalating wait strategies
- Different strategies per retry attempt

```typescript
test('perform cleanup on retry', async ({ page }, testInfo) => {
  if (testInfo.retry > 0) {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  }
  // Test logic
});
```

### 3. Simulated Flaky Tests (`03-simulated-flaky.flaky.spec.ts`)

Simulates real-world flaky scenarios:
- Timing-dependent tests (race conditions)
- Random failures
- Network-dependent tests
- Animation-dependent tests
- Intermittent API responses
- Stale element references

```typescript
test('timing-dependent test', async ({ page }, testInfo) => {
  if (testInfo.retry === 0) {
    await expect(element).toBeVisible({ timeout: 100 }); // Too short
  } else {
    await expect(element).toBeVisible({ timeout: 5000 }); // Proper timeout
  }
});
```

### 4. Serial Mode with Retries (`04-serial-mode.serial.spec.ts`)

Demonstrates retry behavior with serial test execution:
- Multiple steps that depend on each other
- Entire group retries from the beginning if any test fails
- Shopping cart flow example

```typescript
test.describe.serial('checkout flow', () => {
  test.describe.configure({ retries: 2 });

  test('add item to cart', async ({ page }) => { /* ... */ });
  test('proceed to checkout', async ({ page }) => { /* ... */ });
  test('complete purchase', async ({ page }) => { /* ... */ });
});
```

### 5. No Retry Tests (`05-no-retry.no-retry.spec.ts`)

Examples of tests that shouldn't use retries:
- Stable, deterministic tests
- Fast sanity checks
- Mocked API tests
- Tests that should fail fast

```typescript
test('stable test - always passes', async ({ page }) => {
  // Deterministic test that doesn't need retries
});
```

### 6. Flaky Test Detection (`06-flaky-detection.standard.spec.ts`)

Shows how to detect and log flaky tests:
- Automatic flaky test detection
- Logging to file for analysis
- Metrics collection
- Test analytics

```typescript
test.afterEach(async ({}, testInfo) => {
  if (testInfo.status === 'passed' && testInfo.retry > 0) {
    console.warn(`FLAKY TEST: ${testInfo.title}`);
    // Log to monitoring system
  }
});
```

### 7. Exponential Backoff (`07-exponential-backoff.standard.spec.ts`)

Demonstrates various backoff strategies:
- Simple exponential backoff (2^n)
- Exponential backoff with jitter
- Capped exponential backoff
- Linear backoff
- Fibonacci backoff
- API rate limit handling

```typescript
test('exponential backoff', async ({ page }, testInfo) => {
  if (testInfo.retry > 0) {
    const backoffTime = Math.pow(2, testInfo.retry) * 1000;
    await page.waitForTimeout(backoffTime);
  }
  // Test logic
});
```

### 8. Real-World Scenarios (`08-real-world-scenarios.standard.spec.ts`)

Practical examples from real-world situations:
- Database connection retries
- External service integration
- Payment gateway retry logic
- CI/CD environment issues
- Network flakiness
- Browser-specific issues
- Data race conditions

```typescript
test('third-party API timeout handling', async ({ page }, testInfo) => {
  if (testInfo.retry > 0) {
    const backoff = Math.pow(2, testInfo.retry) * 2000;
    await page.waitForTimeout(backoff);
  }
  // Interact with external API
});
```

## ⚙️ Configuration

The project uses different configurations for different test types:

```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0, // Global default

  projects: [
    {
      name: 'no-retries',
      testMatch: /.*no-retry.*\.spec\.ts/,
      retries: 0,
    },
    {
      name: 'standard-retries',
      testMatch: /.*standard.*\.spec\.ts/,
      retries: 2,
    },
    {
      name: 'aggressive-retries',
      testMatch: /.*flaky.*\.spec\.ts/,
      retries: 3,
    },
  ],
});
```

## 🎯 Best Practices Demonstrated

1. **Fix Flaky Tests, Don't Mask Them**
   - Use retries as a safety net, not a permanent solution
   - Track and investigate flaky tests

2. **Different Strategies for Different Environments**
   - More retries on CI (transient issues more common)
   - Fewer/no retries locally (fast feedback)

3. **Proper Cleanup on Retry**
   - Clear browser state
   - Reset test data
   - Clear caches

4. **Use Appropriate Backoff Strategies**
   - Exponential backoff for rate-limited APIs
   - Linear backoff for simple delays
   - Jitter to prevent thundering herd

5. **Monitor Flaky Tests**
   - Log flaky test occurrences
   - Track retry patterns
   - Investigate and fix root causes

6. **Keep Tests Isolated**
   - Each test should set up its own state
   - Don't depend on other tests
   - Makes retries more reliable

## 📊 Understanding Test Results

### Test Outcomes

- **✅ Passed**: Test succeeded on first attempt
- **⚠️ Flaky**: Test failed initially but passed on retry
- **❌ Failed**: Test failed on all retry attempts

### Viewing Results

```bash
# Console output shows retry information
Attempt 1 of 3
❌ First attempt failed
Attempt 2 of 3
✅ Retry successful - Test marked as FLAKY

# HTML report categorizes tests
npx playwright show-report
```

## 🔍 Debugging Flaky Tests

### Using Trace Viewer

```bash
# Traces are automatically captured on first retry
npx playwright show-trace trace.zip
```

### Viewing Flaky Test Log

The project logs flaky tests to `flaky-tests.log`:

```json
{"timestamp":"2024-01-09T12:00:00.000Z","test":"timing-dependent test","file":"03-simulated-flaky.flaky.spec.ts","retries":1,"duration":2500}
```

### Debug Mode

```bash
# Step through test execution
npx playwright test --debug

# Pause on failure
npx playwright test --headed --debug
```

## 📈 Test Execution Time

Consider the impact of retries on execution time:

```
Test with 2 retries:
- First attempt: 5s (fails)
- First retry: 5s (fails)
- Second retry: 5s (passes)
Total: 15s

Same test without retries:
- First attempt: 5s (fails immediately)
Total: 5s
```

## 🌍 Environment Variables

```bash
# Run with CI configuration (more retries)
CI=true npm test

# Custom retry count
RETRIES=5 npx playwright test

# Specific base URL
BASE_URL=https://example.com npm test
```

## 📝 Common Patterns

### Pattern 1: Cleanup on Retry
```typescript
if (testInfo.retry > 0) {
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
}
```

### Pattern 2: Exponential Backoff
```typescript
if (testInfo.retry > 0) {
  const backoffTime = Math.pow(2, testInfo.retry) * 1000;
  await page.waitForTimeout(backoffTime);
}
```

### Pattern 3: Progressive Timeout
```typescript
const timeout = (testInfo.retry + 1) * 5000;
await page.goto('/', { timeout });
```

### Pattern 4: Flaky Test Detection
```typescript
test.afterEach(async ({}, testInfo) => {
  if (testInfo.status === 'passed' && testInfo.retry > 0) {
    // Log flaky test
  }
});
```

## 🎓 Learning Path

1. Start with `01-basic-retry.standard.spec.ts` to understand core concepts
2. Move to `02-retry-detection.standard.spec.ts` to learn detection
3. Study `03-simulated-flaky.flaky.spec.ts` for common flaky patterns
4. Explore `07-exponential-backoff.standard.spec.ts` for advanced strategies
5. Review `08-real-world-scenarios.standard.spec.ts` for practical applications

## 📚 Additional Resources

- [Official Playwright Test Retries Documentation](https://playwright.dev/docs/test-retries)
- [Test Retries Markdown Guide](../15_test_retries.md)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

## 🤝 Contributing

Feel free to add more examples or improve existing ones!

## 📄 License

MIT
