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

## Additional Resources

- [Official Playwright Test Retries Documentation](https://playwright.dev/docs/test-retries)
- [Playwright Test Configuration](https://playwright.dev/docs/test-configuration)
- [Playwright Test Reporters](https://playwright.dev/docs/test-reporters)
- [Best Practices for Reliable Tests](https://playwright.dev/docs/best-practices)
- [Debugging Flaky Tests](https://playwright.dev/docs/debug)
