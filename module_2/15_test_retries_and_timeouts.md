# Test Retries in Playwright

## Overview

Test retries are a powerful feature in Playwright that automatically re-run failing tests to handle test flakiness. Flaky tests are tests that sometimes pass and sometimes fail without any changes to the code. Retries help improve test reliability by giving tests multiple chances to pass, reducing false negatives in your CI/CD pipeline.

## Table of Contents

1. [What are Test Retries?](#what-are-test-retries)
2. [Why Use Test Retries?](#why-use-test-retries)
3. [Configuring Test Retries](#configuring-test-retries)
4. [Test Outcome Classification](#test-outcome-classification)
5. [Detecting Retry State in Tests](#detecting-retry-state-in-tests)
6. [Worker Process Behavior](#worker-process-behavior)
7. [Retries in Serial Mode](#retries-in-serial-mode)
8. [Best Practices](#best-practices)
9. [Examples](#examples)

---

## What are Test Retries?

Test retries are a mechanism to automatically re-run a test when it fails. Instead of immediately marking a test as failed after the first failure, Playwright can attempt to run it again for a specified number of times. If the test passes on any retry attempt, it's marked as "flaky" rather than "failed".

### How It Works

1. Test runs and fails
2. Playwright discards the entire worker process (including the browser)
3. A new worker process is started
4. Test is re-run in the fresh environment
5. Process repeats until test passes or max retries reached

---

## Why Use Test Retries?

### Benefits

- **Handle Flaky Tests**: Reduce false negatives from intermittent test failures
- **Improve CI/CD Reliability**: Prevent builds from failing due to transient issues
- **Identify Flaky Tests**: Track which tests are inconsistent and need improvement
- **Save Time**: Avoid manual re-runs of test suites
- **Better Reporting**: Distinguish between truly broken tests and flaky ones

### Common Causes of Flaky Tests

- Network timing issues
- Race conditions in application code
- External service dependencies
- Resource contention
- Non-deterministic animations
- Insufficient wait conditions

---

## Configuring Test Retries

Playwright provides multiple ways to configure test retries at different levels of granularity.

### Command Line Configuration

Run tests with retries using the `--retries` flag:

```bash
# Retry failed tests up to 3 times
npx playwright test --retries=3

# No retries (default behavior)
npx playwright test --retries=0
```

### Global Configuration

Set retries globally in `playwright.config.ts`:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Retry failed tests up to 2 times
  retries: 2,
});
```

### Environment-Specific Configuration

Configure different retry strategies for CI vs local development:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
});
```

### Test File Level Configuration

Configure retries for all tests in a specific file:

```typescript
import { test, expect } from '@playwright/test';

// Set retries for all tests in this file
test.describe.configure({ retries: 3 });

test('test 1', async ({ page }) => {
  // This test will retry up to 3 times
});

test('test 2', async ({ page }) => {
  // This test will also retry up to 3 times
});
```

### Test Suite Level Configuration

Configure retries for a specific test suite:

```typescript
import { test, expect } from '@playwright/test';

test.describe('flaky test suite', () => {
  // Configure retries for this describe block only
  test.describe.configure({ retries: 3 });

  test('potentially flaky test', async ({ page }) => {
    // Will retry up to 3 times
  });
});

test.describe('stable test suite', () => {
  // These tests use the default retry configuration
  test('stable test', async ({ page }) => {
    // Uses global retry setting
  });
});
```

### Individual Test Configuration

Configure retries for a single test:

```typescript
import { test, expect } from '@playwright/test';

// Regular test with default retries
test('normal test', async ({ page }) => {
  // Uses global configuration
});

// Specific test with custom retries
test('flaky test', async ({ page }) => {
  // This specific test gets 5 retries
  test.setTimeout(60000);
  // Test logic
});

// You can also use test.describe.configure for single tests
test.describe('single test with retries', () => {
  test.describe.configure({ retries: 5 });

  test('this one test', async ({ page }) => {
    // Will retry 5 times
  });
});
```

---

## Test Outcome Classification

Playwright categorizes test results based on retry behavior:

### Passed ✅

Test succeeded on the first attempt without any retries.

```typescript
test('passed test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle('Example Domain');
  // Passes immediately - marked as "passed"
});
```

### Flaky ⚠️

Test failed on the first attempt but passed on a retry. This indicates the test is inconsistent and may need investigation.

```typescript
test('flaky test', async ({ page }) => {
  await page.goto('https://example.com');
  // Sometimes this element loads slowly
  await expect(page.locator('.dynamic-content')).toBeVisible();
  // If it fails first time but passes on retry - marked as "flaky"
});
```

### Failed ❌

Test failed on the first attempt and all retry attempts. This indicates a genuine issue.

```typescript
test('failed test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle('Wrong Title');
  // Fails every time - marked as "failed"
});
```

### Test Report Example

```
Running 10 tests using 5 workers

  ✓ test1.spec.ts:3:1 › successful test (1.2s)
  ⚠ test2.spec.ts:8:1 › flaky test (3.4s)
    - Attempt 1: Failed
    - Attempt 2: Passed
  ✗ test3.spec.ts:15:1 › broken test (5.6s)
    - Attempt 1: Failed
    - Attempt 2: Failed
    - Attempt 3: Failed

Summary:
- 8 passed
- 1 flaky (1 retries)
- 1 failed
```

---

## Detecting Retry State in Tests

Access retry information during test execution using `testInfo.retry` to implement custom logic for retries.

### Basic Retry Detection

```typescript
import { test, expect } from '@playwright/test';

test('detect retry attempt', async ({ page }, testInfo) => {
  console.log(`Attempt number: ${testInfo.retry + 1}`);

  if (testInfo.retry > 0) {
    console.log('This is a retry attempt');
  } else {
    console.log('This is the first attempt');
  }

  // Test logic
});
```

### Conditional Cleanup on Retry

Perform cleanup operations before retry attempts to ensure a fresh state:

```typescript
import { test, expect } from '@playwright/test';

test('cleanup on retry', async ({ page }, testInfo) => {
  // Perform cleanup if this is a retry
  if (testInfo.retry > 0) {
    console.log('Cleaning up from previous failed attempt...');

    // Clear browser cache
    await page.context().clearCookies();

    // Clear local storage
    await page.evaluate(() => localStorage.clear());

    // Reset server state (if you have an API)
    // await fetch('https://api.example.com/reset-test-data');
  }

  // Run the actual test
  await page.goto('https://example.com');
  await expect(page.locator('.user-data')).toBeVisible();
});
```

### Different Strategies per Retry

Implement different strategies for different retry attempts:

```typescript
import { test, expect } from '@playwright/test';

test('escalating retry strategy', async ({ page }, testInfo) => {
  if (testInfo.retry === 0) {
    // First attempt: normal speed
    await page.goto('https://example.com');
  } else if (testInfo.retry === 1) {
    // First retry: wait a bit before starting
    console.log('First retry - waiting 2 seconds before starting');
    await page.waitForTimeout(2000);
    await page.goto('https://example.com');
  } else {
    // Subsequent retries: use slower network
    console.log('Later retry - using slower network profile');
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100);
    });
    await page.goto('https://example.com');
  }

  // Test assertions
  await expect(page).toHaveTitle('Example Domain');
});
```

### Logging Retry Information

```typescript
import { test, expect } from '@playwright/test';

test('log retry info', async ({ page }, testInfo) => {
  const attemptNumber = testInfo.retry + 1;
  const maxAttempts = testInfo.project.retries + 1;

  console.log(`Attempt ${attemptNumber} of ${maxAttempts}`);
  console.log(`Test: ${testInfo.title}`);
  console.log(`File: ${testInfo.file}`);

  if (testInfo.retry > 0) {
    console.log('Previous attempt(s) failed - investigating...');
    // Add extra logging or debugging for retry attempts
  }

  // Test logic
});
```

---

## Worker Process Behavior

Understanding how Playwright handles worker processes during retries is crucial for writing reliable tests.

### Worker Process Isolation

When a test fails, Playwright completely discards the worker process to ensure test isolation:

1. **Test Fails**: First attempt fails for any reason
2. **Worker Disposal**: Entire worker process is terminated
3. **Browser Cleanup**: Browser instance is completely closed
4. **Fresh Start**: New worker process is created
5. **Test Retry**: Test runs in the clean environment

### Why Full Worker Disposal?

```typescript
// Example: Why worker disposal matters
test('test with side effects', async ({ page }) => {
  // This might set browser state
  await page.goto('https://example.com');
  await page.evaluate(() => {
    window.globalState = 'modified';
  });

  // If this fails, the globalState would persist
  // Without worker disposal, retry would run in dirty state
  await expect(page.locator('.content')).toBeVisible();
});
```

Full worker disposal ensures:
- No state leakage between attempts
- Fresh browser instance for each retry
- Clean cookies, local storage, and cache
- No lingering event listeners or timers

### Worker Process Configuration

Configure the number of workers in `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Number of parallel workers
  workers: process.env.CI ? 2 : 4,

  // Retry configuration
  retries: process.env.CI ? 2 : 0,
});
```

---

## Retries in Serial Mode

Serial mode tests have special retry behavior to maintain test dependencies.

### Serial Test Behavior

When using `test.describe.serial()`, tests run in order and are dependent on each other:

```typescript
import { test, expect } from '@playwright/test';

test.describe.serial('checkout flow', () => {
  test.describe.configure({ retries: 2 });

  test('add item to cart', async ({ page }) => {
    await page.goto('https://example.com');
    await page.click('.add-to-cart');
    await expect(page.locator('.cart-count')).toHaveText('1');
  });

  test('proceed to checkout', async ({ page }) => {
    // Depends on previous test having added item
    await page.click('.checkout-button');
    await expect(page.locator('.checkout-page')).toBeVisible();
  });

  test('complete purchase', async ({ page }) => {
    // Depends on previous tests
    await page.fill('#credit-card', '4111111111111111');
    await page.click('.submit-order');
    await expect(page.locator('.confirmation')).toBeVisible();
  });
});
```

### Serial Mode Retry Behavior

If any test in a serial group fails:
1. The entire group is retried from the beginning
2. All tests in the serial group run again
3. Tests maintain their order and dependencies

```
Attempt 1:
  ✓ add item to cart
  ✗ proceed to checkout (failed)
  ⊘ complete purchase (skipped)

Attempt 2 (retry):
  ✓ add item to cart (re-run)
  ✓ proceed to checkout (passed this time)
  ✓ complete purchase (now runs)
```

### Serial Mode Best Practices

```typescript
// ❌ Bad: Serial tests are harder to retry reliably
test.describe.serial('dependent tests', () => {
  test('step 1', async ({ page }) => {
    // Sets up state for step 2
  });

  test('step 2', async ({ page }) => {
    // Relies on step 1
  });
});

// ✅ Good: Independent tests are easier to retry
test.describe('independent tests', () => {
  test.beforeEach(async ({ page }) => {
    // Each test sets up its own state
    await setupTestState(page);
  });

  test('test scenario 1', async ({ page }) => {
    // Self-contained test
  });

  test('test scenario 2', async ({ page }) => {
    // Self-contained test
  });
});
```

---

## Best Practices

### 1. Fix Flaky Tests Instead of Relying on Retries

Retries are a safety net, not a solution for poor test design.

```typescript
// ❌ Bad: Relying on retries to pass
test('flaky test', async ({ page }) => {
  await page.goto('https://example.com');
  // Race condition - element might not be ready
  await expect(page.locator('.dynamic-content')).toBeVisible();
});

// ✅ Good: Proper waiting eliminates flakiness
test('reliable test', async ({ page }) => {
  await page.goto('https://example.com');
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
  // Use built-in retry mechanisms
  await expect(page.locator('.dynamic-content')).toBeVisible({ timeout: 10000 });
});
```

### 2. Use Different Retry Strategies for CI vs Local

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // More retries on CI where flakiness is more common
  retries: process.env.CI ? 2 : 0,

  // More workers locally for faster feedback
  workers: process.env.CI ? 2 : 4,
});
```

### 3. Monitor and Track Flaky Tests

```typescript
import { test, expect } from '@playwright/test';

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status === 'passed' && testInfo.retry > 0) {
    // Log flaky test for investigation
    console.warn(`⚠️  FLAKY TEST DETECTED: ${testInfo.title}`);
    console.warn(`   Failed ${testInfo.retry} time(s) before passing`);
    console.warn(`   File: ${testInfo.file}`);

    // Send to monitoring system
    // await reportFlakyTest({
    //   test: testInfo.title,
    //   retries: testInfo.retry,
    //   file: testInfo.file,
    // });
  }
});
```

### 4. Clean Up State on Retries

```typescript
import { test, expect } from '@playwright/test';

test('test with cleanup', async ({ page }, testInfo) => {
  if (testInfo.retry > 0) {
    // Clear browser state
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Reset test data via API
    // await fetch('https://api.example.com/test/reset', {
    //   method: 'POST',
    //   body: JSON.stringify({ testId: testInfo.testId })
    // });
  }

  // Test logic
});
```

### 5. Use Appropriate Timeout Values

```typescript
import { test, expect } from '@playwright/test';

test.describe('api tests', () => {
  // Configure timeout and retries together
  test.describe.configure({
    retries: 3,
    timeout: 30000, // 30 seconds per attempt
  });

  test('api call with retry', async ({ request }) => {
    const response = await request.get('https://api.example.com/data');
    expect(response.ok()).toBeTruthy();
  });
});
```

### 6. Keep Tests Isolated

```typescript
// ✅ Good: Each test is independent
test.describe('isolated tests', () => {
  test.beforeEach(async ({ page }) => {
    // Fresh state for each test
    await page.goto('https://example.com');
    await loginUser(page);
  });

  test('test 1', async ({ page }) => {
    // Independent test
  });

  test('test 2', async ({ page }) => {
    // Independent test
  });
});
```

The official documentation states: "It is recommended to make your tests as isolated as possible so that they can be efficiently run and retried independently."

### 7. Consider Test Retry Budget

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Balance between reliability and execution time
  // Each retry doubles the potential execution time
  retries: 2, // Max 3 attempts: 1 initial + 2 retries

  // Timeout should account for potential retries
  timeout: 30000, // 30 seconds per attempt
});
```

### 8. Use Retries Strategically

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'stable-features',
      testMatch: /stable.*\.spec\.ts/,
      retries: 0, // No retries for stable tests
    },
    {
      name: 'e2e-flows',
      testMatch: /e2e.*\.spec\.ts/,
      retries: 2, // More retries for complex E2E tests
    },
    {
      name: 'api-tests',
      testMatch: /api.*\.spec\.ts/,
      retries: 3, // Most retries for external API tests
    },
  ],
});
```

---

## Examples

### Example 1: Basic Retry Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: 2,
  use: {
    baseURL: 'https://example.com',
  },
});
```

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('basic test with retries', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Example Domain');
});
```

### Example 2: Conditional Retry Logic

```typescript
import { test, expect } from '@playwright/test';

test('conditional retry behavior', async ({ page }, testInfo) => {
  if (testInfo.retry > 0) {
    console.log(`Retry attempt ${testInfo.retry}`);

    // Wait longer on retry attempts
    const waitTime = testInfo.retry * 2000;
    console.log(`Waiting ${waitTime}ms before retry`);
    await page.waitForTimeout(waitTime);
  }

  await page.goto('https://example.com');
  await expect(page.locator('.content')).toBeVisible();
});
```

### Example 3: Serial Mode with Retries

```typescript
import { test, expect } from '@playwright/test';

test.describe.serial('shopping cart flow', () => {
  test.describe.configure({ retries: 2 });

  let cartCount = 0;

  test('add first item', async ({ page }) => {
    await page.goto('https://example.com/shop');
    await page.click('[data-testid="product-1"] .add-to-cart');
    cartCount++;
    await expect(page.locator('.cart-count')).toHaveText(cartCount.toString());
  });

  test('add second item', async ({ page }) => {
    await page.click('[data-testid="product-2"] .add-to-cart');
    cartCount++;
    await expect(page.locator('.cart-count')).toHaveText(cartCount.toString());
  });

  test('checkout', async ({ page }) => {
    await page.click('.checkout-button');
    await expect(page).toHaveURL(/.*checkout/);
  });
});
```

### Example 4: Flaky Test Detection

```typescript
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status === 'passed' && testInfo.retry > 0) {
    // Log flaky test to file
    const flakyLog = {
      timestamp: new Date().toISOString(),
      test: testInfo.title,
      file: testInfo.file,
      retries: testInfo.retry,
      duration: testInfo.duration,
    };

    fs.appendFileSync(
      'flaky-tests.log',
      JSON.stringify(flakyLog) + '\n'
    );
  }
});

test('potentially flaky test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('.dynamic-content')).toBeVisible();
});
```

### Example 5: API Retry with Exponential Backoff

```typescript
import { test, expect } from '@playwright/test';

test.describe('api tests with smart retry', () => {
  test.describe.configure({ retries: 3 });

  test('api call with backoff', async ({ request }, testInfo) => {
    if (testInfo.retry > 0) {
      // Exponential backoff: 2s, 4s, 8s
      const backoffTime = Math.pow(2, testInfo.retry) * 1000;
      console.log(`Retry ${testInfo.retry}: waiting ${backoffTime}ms`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }

    const response = await request.get('https://api.example.com/data');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('results');
  });
});
```

### Example 6: Environment-Specific Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Retry configuration based on environment
  retries: process.env.CI
    ? 2  // CI: 2 retries
    : process.env.STAGING
      ? 1  // Staging: 1 retry
      : 0, // Local: No retries

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
});
```

---

## Summary

### Key Takeaways

1. **Retries Handle Flakiness**: Automatically re-run failing tests to reduce false negatives
2. **Three Outcomes**: Tests are classified as passed, flaky, or failed
3. **Worker Isolation**: Failed tests trigger complete worker process disposal
4. **Multiple Configuration Levels**: Configure retries globally, per-project, per-file, or per-test
5. **Retry Detection**: Use `testInfo.retry` to implement custom retry logic
6. **Serial Mode**: Tests in serial groups retry together as a unit
7. **Fix, Don't Mask**: Use retries as a safety net, not a substitute for fixing flaky tests

### When to Use Retries

✅ **Good Use Cases:**
- CI/CD pipelines to handle transient failures
- Tests involving external services
- Complex E2E scenarios with timing challenges
- As a temporary measure while investigating flakiness

❌ **Poor Use Cases:**
- Masking genuinely broken tests
- Avoiding proper wait strategies
- Covering up race conditions in tests
- As a permanent solution for known issues

### Configuration Recommendations

| Environment | Retries | Reason |
|-------------|---------|--------|
| Local Development | 0 | Fast feedback, fix issues immediately |
| CI/CD | 2-3 | Handle transient failures, reduce false negatives |
| Staging | 1-2 | Balance between speed and reliability |
| Production Monitoring | 3-5 | Maximize reliability of synthetic tests |

---

# Test Timeouts in Playwright

## Overview

Test timeouts are a crucial mechanism in Playwright that control how long different parts of your test execution can run before being terminated. Playwright implements a hierarchical timeout system with multiple timeout types, each serving a specific purpose in ensuring tests don't run indefinitely and providing clear failure signals.

## Table of Contents (Timeouts)

1. [Types of Timeouts](#types-of-timeouts)
2. [Default Timeout Values](#default-timeout-values)
3. [Timeout Hierarchy and Scope](#timeout-hierarchy-and-scope)
4. [Configuring Timeouts](#configuring-timeouts)
5. [Timeout Best Practices](#timeout-best-practices)
6. [Common Timeout Scenarios](#common-timeout-scenarios)
7. [Timeout Examples](#timeout-examples)

---

## Types of Timeouts

Playwright provides several distinct timeout types, each controlling different aspects of test execution:

### 1. Test Timeout

Controls the maximum duration for an individual test, including all hooks (`beforeEach`, `afterEach`) that run with it.

```typescript
import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  // This test has 30 seconds (default) to complete
  test.setTimeout(60000); // Override to 60 seconds
});
```

### 2. Expect Timeout

Governs how long auto-retrying assertions will wait before failing. This timeout is independent from the test timeout.

```typescript
import { test, expect } from '@playwright/test';

test('expect example', async ({ page }) => {
  await page.goto('https://example.com');

  // This assertion will retry for 5 seconds (default) before failing
  await expect(page.locator('.content')).toBeVisible();

  // Override timeout for specific assertion
  await expect(page.locator('.slow-content')).toBeVisible({ timeout: 10000 });
});
```

### 3. Action Timeout

Low-level timeout for individual Playwright actions like `click()`, `fill()`, `hover()`, etc.

```typescript
import { test, expect } from '@playwright/test';

test('action timeout example', async ({ page }) => {
  await page.goto('https://example.com');

  // Override timeout for specific action
  await page.click('.button', { timeout: 10000 });
});
```

### 4. Navigation Timeout

Low-level timeout specifically for page navigation operations like `goto()`, `reload()`, `goBack()`, etc.

```typescript
import { test, expect } from '@playwright/test';

test('navigation timeout example', async ({ page }) => {
  // Override timeout for this navigation
  await page.goto('https://example.com', { timeout: 30000 });
});
```

### 5. Global Timeout

Controls the maximum duration for the entire test run across all test files and workers.

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalTimeout: 3600000, // 1 hour for entire test run
});
```

### 6. Fixture Timeout

Separate timeout for fixture execution, particularly useful for worker-scoped fixtures that perform slow initialization.

```typescript
import { test as base } from '@playwright/test';

const test = base.extend<{ slowFixture: string }>({
  slowFixture: [async ({}, use) => {
    // Slow operation like database setup
    await performSlowSetup();
    await use('fixture value');
  }, { timeout: 60000 }], // 60 seconds for fixture
});
```

### 7. Hook Timeouts

Timeouts applied to `beforeAll`, `afterAll`, `beforeEach`, and `afterEach` hooks.

```typescript
import { test, expect } from '@playwright/test';

test.beforeAll(async () => {
  // beforeAll has its own 30-second timeout by default
  test.setTimeout(60000); // Override to 60 seconds
  // Slow setup operations
});

test.beforeEach(async ({ page }, testInfo) => {
  // beforeEach shares time within test timeout
  // Extend test timeout if needed
  testInfo.setTimeout(testInfo.timeout + 30000);
});
```

---

## Default Timeout Values

Playwright provides sensible defaults for different timeout types:

| Timeout Type | Default Duration | Can Be Overridden |
|--------------|------------------|-------------------|
| Test timeout | 30,000 ms (30 seconds) | Yes |
| Expect timeout | 5,000 ms (5 seconds) | Yes |
| Action timeout | No default (inherits from test) | Yes |
| Navigation timeout | No default (inherits from test) | Yes |
| Global timeout | No default (unlimited) | Yes |
| `beforeAll`/`afterAll` timeout | 30,000 ms (30 seconds) | Yes |
| Fixture timeout | No default (inherits from test) | Yes |

### Understanding "No Default"

When a timeout type shows "No default", it means:
- The operation will wait as long as needed within the test timeout
- You can still set explicit timeouts if desired
- The operation won't have an artificial time limit separate from the test

```typescript
import { test, expect } from '@playwright/test';

test('no default timeout example', async ({ page }) => {
  // Test has 30-second timeout
  test.setTimeout(30000);

  // This click has no separate timeout - it uses the remaining test timeout
  await page.click('.button');

  // You can still set an explicit timeout if needed
  await page.click('.slow-button', { timeout: 10000 });
});
```

---

## Timeout Hierarchy and Scope

Understanding how timeouts interact is crucial for effective test configuration.

### Test Execution Timeline

```
┌─────────────────────────────────────────────────────────────┐
│ beforeAll hooks (30s timeout - independent)                 │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Test Timeout (30s default)                              │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ beforeEach hooks (shares test timeout)              │ │ │
│ │ ├─────────────────────────────────────────────────────┤ │ │
│ │ │ Test function (shares test timeout)                 │ │ │
│ │ │   ├─ Expect assertions (5s timeout - independent)   │ │ │
│ │ │   ├─ Actions (no separate timeout)                  │ │ │
│ │ │   └─ Navigation (no separate timeout)               │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ afterEach hooks (separate 30s timeout after test)   │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ afterAll hooks (30s timeout - independent)                  │
└─────────────────────────────────────────────────────────────┘

All of the above runs within Global Timeout (if configured)
```

### Key Timeout Rules

1. **Test Timeout includes `beforeEach` and test function**
   - Both share the same timeout budget
   - If `beforeEach` takes 20 seconds and timeout is 30 seconds, test has 10 seconds

2. **`afterEach` gets a separate timeout**
   - Runs after test completes or times out
   - Has its own timeout budget equal to test timeout
   - Ensures cleanup happens even if test times out

3. **`beforeAll` and `afterAll` are independent**
   - Have their own 30-second timeout by default
   - Don't count toward test timeout
   - Run once per worker

4. **Expect timeout is independent**
   - Doesn't count toward test timeout
   - Can exceed without failing the test timeout
   - Each assertion gets its own timeout budget

```typescript
import { test, expect } from '@playwright/test';

test('timeout hierarchy example', async ({ page }) => {
  test.setTimeout(30000); // 30 seconds for test

  // Test starts with 30 seconds
  await page.goto('https://example.com'); // Uses some time

  // This expect has its own 5-second budget (doesn't reduce test timeout)
  await expect(page.locator('.content')).toBeVisible();

  // Remaining test time continues to count down
  await page.click('.button');
});

test.beforeEach(async ({ page }) => {
  // This shares the 30-second test timeout
  await page.goto('https://example.com');
  // If this takes 10 seconds, test has 20 seconds left
});

test.afterEach(async ({ page }) => {
  // This gets a separate 30-second timeout after test completes
  await page.close();
});
```

### Fixture Timeout Scope

```typescript
import { test as base } from '@playwright/test';

const test = base.extend<{
  slowFixture: string;
}>({
  // Fixture with custom timeout
  slowFixture: [async ({}, use) => {
    console.log('Starting slow fixture setup');
    await performDatabaseSetup(); // Takes 45 seconds
    await use('fixture value');
    console.log('Tearing down slow fixture');
  }, {
    scope: 'worker', // Runs once per worker
    timeout: 60000    // Gets 60 seconds independent of test timeout
  }],
});

test('using slow fixture', async ({ slowFixture }) => {
  // Test has normal 30-second timeout
  // Fixture setup already completed with its own 60-second timeout
  console.log(slowFixture);
});
```

---

## Configuring Timeouts

Playwright provides multiple levels for configuring timeouts, from global defaults to per-action overrides.

### Global Configuration

Set default timeouts for all tests in `playwright.config.ts`:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Global timeout for entire test run
  globalTimeout: 3600000, // 1 hour

  // Default timeout for each test
  timeout: 120000, // 2 minutes

  // Expect timeout
  expect: {
    timeout: 10000, // 10 seconds
  },

  // Low-level timeouts (rarely need to change)
  use: {
    actionTimeout: 10000,      // 10 seconds for actions
    navigationTimeout: 30000,  // 30 seconds for navigation
  },
});
```

### Environment-Specific Configuration

Configure different timeouts for different environments:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Longer timeouts on CI where resources are constrained
  timeout: process.env.CI ? 90000 : 30000,

  expect: {
    timeout: process.env.CI ? 10000 : 5000,
  },

  globalTimeout: process.env.CI ? 3600000 : undefined,
});
```

### Project-Specific Configuration

Set different timeouts for different test projects:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'fast-unit-tests',
      testMatch: /unit.*\.spec\.ts/,
      timeout: 10000, // Unit tests should be fast
    },
    {
      name: 'e2e-tests',
      testMatch: /e2e.*\.spec\.ts/,
      timeout: 60000, // E2E tests can be slower
    },
    {
      name: 'api-tests',
      testMatch: /api.*\.spec\.ts/,
      timeout: 30000,
      use: {
        actionTimeout: 15000, // API calls may be slower
      },
    },
  ],
});
```

### File-Level Configuration

Configure timeouts for all tests in a file:

```typescript
import { test, expect } from '@playwright/test';

// All tests in this file get 60 seconds
test.use({ timeout: 60000 });

test('test 1', async ({ page }) => {
  // Has 60-second timeout
});

test('test 2', async ({ page }) => {
  // Has 60-second timeout
});
```

### Describe Block Configuration

Configure timeouts for a group of tests:

```typescript
import { test, expect } from '@playwright/test';

test.describe('slow test suite', () => {
  // Configure timeout for all tests in this describe block
  test.setTimeout(90000);

  test('slow test 1', async ({ page }) => {
    // Has 90-second timeout
  });

  test('slow test 2', async ({ page }) => {
    // Has 90-second timeout
  });
});
```

### Individual Test Configuration

Override timeout for a specific test:

```typescript
import { test, expect } from '@playwright/test';

// Method 1: Set absolute timeout
test('very slow test', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes
  // Test logic
});

// Method 2: Use test.slow() to triple timeout
test('moderately slow test', async ({ page }) => {
  test.slow(); // Triples the default timeout (30s -> 90s)
  // Test logic
});

// Method 3: Conditional slow
test('conditionally slow test', async ({ page, browserName }) => {
  if (browserName === 'webkit') {
    test.slow(); // Webkit is slower on this operation
  }
  // Test logic
});
```

### Hook-Based Configuration

Modify timeouts dynamically in hooks:

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  // Extend timeout for all tests
  testInfo.setTimeout(testInfo.timeout + 30000);

  // Or set absolute timeout
  testInfo.setTimeout(60000);

  // Conditional timeout based on test name
  if (testInfo.title.includes('slow')) {
    testInfo.setTimeout(90000);
  }
});

test('normal test', async ({ page }) => {
  // Gets extended timeout from beforeEach
});

test('slow integration test', async ({ page }) => {
  // Gets 90-second timeout from beforeEach
});
```

### Per-Assertion Timeout

Override timeout for specific assertions:

```typescript
import { test, expect } from '@playwright/test';

test('assertion timeout example', async ({ page }) => {
  await page.goto('https://example.com');

  // Use default expect timeout (5 seconds)
  await expect(page.locator('.fast-element')).toBeVisible();

  // Override for slow-loading element
  await expect(page.locator('.slow-element')).toBeVisible({
    timeout: 15000
  });

  // Multiple assertions with different timeouts
  await expect(page.locator('.title')).toHaveText('Welcome', { timeout: 3000 });
  await expect(page.locator('.content')).toContainText('loaded', { timeout: 10000 });
});
```

### Per-Action Timeout

Override timeout for specific actions:

```typescript
import { test, expect } from '@playwright/test';

test('action timeout example', async ({ page }) => {
  // Normal navigation
  await page.goto('https://example.com');

  // Slow navigation with custom timeout
  await page.goto('https://slow-site.example.com', {
    timeout: 60000
  });

  // Click with custom timeout
  await page.click('.slow-button', { timeout: 15000 });

  // Fill with custom timeout
  await page.fill('#slow-input', 'text', { timeout: 10000 });

  // Wait for specific condition with timeout
  await page.waitForSelector('.result', { timeout: 20000 });
});
```

---

## Timeout Best Practices

### 1. Don't Modify Low-Level Timeouts Unless Necessary

```typescript
// ❌ Bad: Changing low-level timeouts globally
export default defineConfig({
  use: {
    actionTimeout: 30000,      // Usually unnecessary
    navigationTimeout: 60000,  // Usually unnecessary
  },
});

// ✅ Good: Override only when needed for specific actions
test('example', async ({ page }) => {
  // Most actions use default behavior
  await page.click('.button');

  // Override only for genuinely slow operations
  await page.goto('https://very-slow-site.com', { timeout: 60000 });
});
```

The official documentation states: "These are the low-level timeouts that are pre-configured by the test runner, you should not need to change these."

### 2. Use `test.slow()` for Moderately Slower Tests

```typescript
import { test, expect } from '@playwright/test';

// ❌ Bad: Manual calculation
test('slow test', async ({ page }) => {
  test.setTimeout(90000); // Had to calculate 3x
});

// ✅ Good: Use test.slow() to triple timeout
test('slow test', async ({ page }) => {
  test.slow(); // Automatically triples timeout (30s -> 90s)
});

// ✅ Good: Conditional slow based on browser
test('browser-specific slow test', async ({ page, browserName }) => {
  if (browserName === 'webkit') {
    test.slow(); // Only slow on webkit
  }
});
```

### 3. Set Global Timeout for CI/CD

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Prevent entire test suite from hanging indefinitely
  globalTimeout: process.env.CI ? 3600000 : undefined, // 1 hour on CI

  timeout: 30000, // Per-test timeout
});
```

Benefits:
- Prevents CI jobs from running forever
- Provides clear feedback when widespread issues occur
- Helps identify systemic problems (like service being down)

### 4. Configure Fixture Timeouts Separately

```typescript
import { test as base } from '@playwright/test';

// ✅ Good: Separate timeout for slow fixture
const test = base.extend<{ database: Database }>({
  database: [async ({}, use) => {
    // Slow database setup
    const db = await connectToDatabase();
    await db.migrate();
    await use(db);
    await db.close();
  }, {
    scope: 'worker',
    timeout: 120000  // 2 minutes for database setup
  }],
});

// Tests can have normal timeout
test('database test', async ({ database }) => {
  // Test has 30-second timeout
  // Database fixture had 2 minutes for setup
});
```

### 5. Different Timeouts for Different Test Types

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'unit',
      testMatch: /.*\.unit\.spec\.ts/,
      timeout: 10000, // Unit tests should be fast
    },
    {
      name: 'integration',
      testMatch: /.*\.integration\.spec\.ts/,
      timeout: 30000, // Integration tests are moderate
    },
    {
      name: 'e2e',
      testMatch: /.*\.e2e\.spec\.ts/,
      timeout: 60000, // E2E tests can be slower
      expect: {
        timeout: 10000, // E2E assertions may need more time
      },
    },
  ],
});
```

### 6. Investigate Flakiness, Don't Just Increase Timeouts

```typescript
// ❌ Bad: Masking flakiness with longer timeout
test('flaky test', async ({ page }) => {
  test.setTimeout(120000); // Very long timeout to hide flakiness
  await page.click('.button');
  await expect(page.locator('.result')).toBeVisible();
});

// ✅ Good: Fix the underlying issue
test('reliable test', async ({ page }) => {
  // Wait for proper state
  await page.click('.button');

  // Wait for network to settle
  await page.waitForLoadState('networkidle');

  // Now check with reasonable timeout
  await expect(page.locator('.result')).toBeVisible({ timeout: 10000 });
});
```

### 7. Use Appropriate Timeouts for External Services

```typescript
import { test, expect } from '@playwright/test';

test.describe('external API tests', () => {
  // External APIs may be slower
  test.setTimeout(60000);

  test('fetch data from API', async ({ request }) => {
    // API calls can be slow
    const response = await request.get('https://api.example.com/data', {
      timeout: 30000,
    });
    expect(response.ok()).toBeTruthy();
  });
});

test.describe('internal UI tests', () => {
  // Internal tests should be fast
  test.setTimeout(30000);

  test('click button', async ({ page }) => {
    await page.click('.button');
  });
});
```

### 8. Monitor Timeout Patterns

```typescript
import { test, expect } from '@playwright/test';

test.afterEach(async ({}, testInfo) => {
  // Log tests that take a long time
  const timeoutPercentage = (testInfo.duration / testInfo.timeout) * 100;

  if (timeoutPercentage > 80) {
    console.warn(`⚠️  Test used ${timeoutPercentage.toFixed(1)}% of timeout`);
    console.warn(`   Test: ${testInfo.title}`);
    console.warn(`   Duration: ${testInfo.duration}ms`);
    console.warn(`   Timeout: ${testInfo.timeout}ms`);
    console.warn(`   Consider increasing timeout or optimizing test`);
  }
});
```

---

## Common Timeout Scenarios

### Scenario 1: Test Timeout Exceeded

**Error:**
```
example.spec.ts:3:1 › basic test ===========================
Timeout of 30000ms exceeded.
```

**Cause:** Test took longer than 30 seconds to complete.

**Solutions:**

```typescript
// Solution 1: Increase test timeout
test('slow test', async ({ page }) => {
  test.setTimeout(60000);
  // Test logic
});

// Solution 2: Use test.slow()
test('slow test', async ({ page }) => {
  test.slow(); // 3x timeout
  // Test logic
});

// Solution 3: Optimize the test
test('optimized test', async ({ page }) => {
  // Use faster locators
  await page.getByRole('button').click();

  // Wait for specific states
  await page.waitForLoadState('networkidle');

  // Use efficient assertions
  await expect(page.getByText('Result')).toBeVisible();
});
```

### Scenario 2: Expect Timeout Exceeded

**Error:**
```
Error: expect(received).toHaveText(expected)
Expected string: "my text"
Received string: ""
Call log:
  - expect.toHaveText with timeout 5000ms
  - waiting for "locator('button')"
```

**Cause:** Assertion waited 5 seconds but element didn't reach expected state.

**Solutions:**

```typescript
// Solution 1: Increase expect timeout
test('example', async ({ page }) => {
  await expect(page.locator('.slow-element')).toHaveText('text', {
    timeout: 15000
  });
});

// Solution 2: Global expect timeout increase
// playwright.config.ts
export default defineConfig({
  expect: {
    timeout: 10000, // 10 seconds for all assertions
  },
});

// Solution 3: Wait for proper state first
test('example', async ({ page }) => {
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.element')).toHaveText('text');
});
```

### Scenario 3: Global Timeout Exceeded

**Error:**
```
Running 1000 tests using 10 workers
514 skipped  486 passed
Timed out waiting 3600s for the entire test run
```

**Cause:** Entire test suite took longer than global timeout.

**Solutions:**

```typescript
// Solution 1: Increase global timeout
// playwright.config.ts
export default defineConfig({
  globalTimeout: 7200000, // 2 hours
});

// Solution 2: Run fewer tests in parallel
export default defineConfig({
  workers: 5, // Reduce worker count
});

// Solution 3: Optimize slow tests
// Identify and fix slow tests that are dragging down the suite
```

### Scenario 4: Action Timeout

**Error:**
```
TimeoutError: page.click: Timeout 10000ms exceeded.
```

**Cause:** Click action couldn't complete within timeout.

**Solutions:**

```typescript
// Solution 1: Increase action timeout
test('example', async ({ page }) => {
  await page.click('.slow-button', { timeout: 30000 });
});

// Solution 2: Wait for element to be ready
test('example', async ({ page }) => {
  await page.waitForSelector('.button', { state: 'visible' });
  await page.click('.button');
});

// Solution 3: Use more reliable locators
test('example', async ({ page }) => {
  // More reliable than CSS selector
  await page.getByRole('button', { name: 'Submit' }).click();
});
```

### Scenario 5: Navigation Timeout

**Error:**
```
TimeoutError: page.goto: Timeout 30000ms exceeded.
```

**Cause:** Page didn't load within navigation timeout.

**Solutions:**

```typescript
// Solution 1: Increase navigation timeout
test('example', async ({ page }) => {
  await page.goto('https://slow-site.com', { timeout: 60000 });
});

// Solution 2: Wait for specific load state
test('example', async ({ page }) => {
  await page.goto('https://example.com', {
    waitUntil: 'domcontentloaded' // Faster than default 'load'
  });
});

// Solution 3: Global navigation timeout
// playwright.config.ts
export default defineConfig({
  use: {
    navigationTimeout: 60000,
  },
});
```

### Scenario 6: Fixture Timeout

**Error:**
```
TimeoutError: fixture "database" timeout of 30000ms exceeded.
```

**Cause:** Fixture setup took longer than allowed.

**Solutions:**

```typescript
// Solution 1: Increase fixture timeout
const test = base.extend<{ database: Database }>({
  database: [async ({}, use) => {
    const db = await setupDatabase();
    await use(db);
  }, { timeout: 120000 }], // 2 minutes for setup
});

// Solution 2: Optimize fixture setup
const test = base.extend<{ database: Database }>({
  database: [async ({}, use) => {
    // Use cached database or faster setup
    const db = await getOrCreateDatabase();
    await use(db);
  }, { scope: 'worker' }], // Share across tests
});
```

---

## Timeout Examples

### Example 1: Basic Timeout Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30000, // 30 seconds per test

  expect: {
    timeout: 5000, // 5 seconds for assertions
  },

  use: {
    actionTimeout: 10000,     // 10 seconds for actions
    navigationTimeout: 30000, // 30 seconds for navigation
  },
});
```

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('basic timeout example', async ({ page }) => {
  await page.goto('https://example.com');
  await page.click('.button');
  await expect(page.locator('.result')).toBeVisible();
});
```

### Example 2: Conditional Timeout Adjustment

```typescript
import { test, expect } from '@playwright/test';

test('conditional timeout', async ({ page, browserName }, testInfo) => {
  // Webkit is slower for this specific operation
  if (browserName === 'webkit') {
    test.slow();
  }

  // Increase timeout on CI
  if (process.env.CI) {
    testInfo.setTimeout(testInfo.timeout + 30000);
  }

  await page.goto('https://example.com');
  await expect(page.locator('.content')).toBeVisible();
});
```

### Example 3: Progressive Timeout Strategy

```typescript
import { test, expect } from '@playwright/test';

test.describe('progressive timeout strategy', () => {
  test('fast unit test', async ({ page }) => {
    test.setTimeout(10000); // 10 seconds
    // Fast UI test
  });

  test('medium integration test', async ({ page }) => {
    test.setTimeout(30000); // 30 seconds
    // Integration test with API calls
  });

  test('slow e2e test', async ({ page }) => {
    test.setTimeout(60000); // 60 seconds
    test.slow(); // Triple to 180 seconds if needed
    // Complex end-to-end flow
  });
});
```

### Example 4: Dynamic Timeout in Hooks

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  // Analyze test title to determine timeout needs
  if (testInfo.title.includes('slow')) {
    testInfo.setTimeout(90000);
  } else if (testInfo.title.includes('fast')) {
    testInfo.setTimeout(15000);
  }

  // Setup
  await page.goto('https://example.com');
});

test('fast test', async ({ page }) => {
  // Gets 15-second timeout
});

test('slow integration test', async ({ page }) => {
  // Gets 90-second timeout
});
```

### Example 5: Per-Assertion Timeout Variation

```typescript
import { test, expect } from '@playwright/test';

test('varied assertion timeouts', async ({ page }) => {
  await page.goto('https://example.com');

  // Fast element - short timeout
  await expect(page.locator('.header')).toBeVisible({ timeout: 2000 });

  // Normal element - default timeout (5s)
  await expect(page.locator('.content')).toBeVisible();

  // Slow-loading element - longer timeout
  await expect(page.locator('.lazy-loaded')).toBeVisible({ timeout: 15000 });

  // API-dependent element - very long timeout
  await expect(page.locator('.api-data')).toHaveText(/data/, { timeout: 30000 });
});
```

### Example 6: Environment-Specific Timeout Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const isLocal = !isCI;

export default defineConfig({
  timeout: isCI ? 60000 : 30000,

  expect: {
    timeout: isCI ? 10000 : 5000,
  },

  globalTimeout: isCI ? 3600000 : undefined,

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Chromium is fastest
        actionTimeout: 5000,
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        // Webkit needs more time
        actionTimeout: 10000,
        navigationTimeout: 45000,
      },
    },
  ],
});
```

### Example 7: Fixture with Custom Timeout

```typescript
import { test as base } from '@playwright/test';

type TestFixtures = {
  authenticatedPage: Page;
};

const test = base.extend<TestFixtures>({
  authenticatedPage: [async ({ page }, use) => {
    // Slow authentication process
    await page.goto('https://example.com/login');
    await page.fill('#username', 'user');
    await page.fill('#password', 'pass');
    await page.click('button[type="submit"]');

    // Wait for authentication to complete
    await page.waitForURL('**/dashboard');

    await use(page);

    // Cleanup
    await page.click('.logout');
  }, {
    timeout: 60000, // 1 minute for auth flow
    scope: 'test',  // New auth per test
  }],
});

test('use authenticated page', async ({ authenticatedPage }) => {
  // Test has normal 30-second timeout
  // Authentication took up to 60 seconds separately
  await expect(authenticatedPage.locator('.welcome')).toBeVisible();
});
```

### Example 8: Monitoring Timeout Usage

```typescript
import { test, expect } from '@playwright/test';

test.afterEach(async ({}, testInfo) => {
  const duration = testInfo.duration;
  const timeout = testInfo.timeout;
  const percentage = (duration / timeout) * 100;

  console.log(`Test "${testInfo.title}" completed:`);
  console.log(`  Duration: ${duration}ms`);
  console.log(`  Timeout: ${timeout}ms`);
  console.log(`  Used: ${percentage.toFixed(1)}%`);

  if (percentage > 90) {
    console.warn('⚠️  Test used >90% of timeout - consider increasing!');
  } else if (percentage < 30 && timeout > 30000) {
    console.info('ℹ️  Test used <30% of timeout - consider decreasing for faster failures');
  }

  // Log to file or monitoring system
  if (process.env.CI) {
    // await logToMonitoring({ test: testInfo.title, duration, timeout, percentage });
  }
});
```

---

## Summary (Timeouts)

### Key Takeaways

1. **Multiple Timeout Types**: Test, expect, action, navigation, global, fixture, and hook timeouts serve different purposes
2. **Hierarchical System**: Timeouts work together with specific scope and inheritance rules
3. **Sensible Defaults**: 30s for tests, 5s for expects - usually sufficient for most scenarios
4. **Independent Timeouts**: Expect timeout and test timeout are separate and independent
5. **Hook Behavior**: `beforeAll`/`afterAll` have independent timeouts; `beforeEach` shares test timeout; `afterEach` gets separate timeout
6. **Configuration Flexibility**: Set timeouts globally, per-project, per-file, per-test, or per-action
7. **Don't Over-Configure**: Avoid changing low-level timeouts unless genuinely needed

### Timeout Configuration Quick Reference

| Level | Method | Example |
|-------|--------|---------|
| Global | `playwright.config.ts` | `timeout: 30000` |
| Project | `projects[].timeout` | Different per browser/test type |
| File | `test.use()` | All tests in file |
| Describe | `test.setTimeout()` | All tests in describe block |
| Test | `test.setTimeout()` | Single test |
| Hook | `testInfo.setTimeout()` | Dynamic adjustment |
| Action | `{ timeout }` option | Individual action |
| Assertion | `{ timeout }` option | Individual expect |

### Common Patterns

✅ **Good Practices:**
- Use `test.slow()` for moderately slower tests
- Set global timeout on CI to prevent infinite runs
- Configure fixture timeouts separately for slow setup
- Use different timeouts for unit, integration, and E2E tests
- Monitor timeout usage to identify slow tests

❌ **Avoid:**
- Increasing timeouts to mask flaky tests
- Setting very high global action/navigation timeouts
- Using same timeout for all test types
- Ignoring timeout warnings

---

## Additional Resources

- [Official Playwright Test Retries Documentation](https://playwright.dev/docs/test-retries)
- [Official Playwright Test Timeouts Documentation](https://playwright.dev/docs/test-timeouts)
- [Playwright Test Configuration](https://playwright.dev/docs/test-configuration)
- [Playwright Test Reporters](https://playwright.dev/docs/test-reporters)
- [Best Practices for Reliable Tests](https://playwright.dev/docs/best-practices)
- [Debugging Flaky Tests](https://playwright.dev/docs/debug)
