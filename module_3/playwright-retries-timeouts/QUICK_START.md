# Quick Start Guide: Test Retries and Timeouts

Get up and running with Playwright test retries and timeouts in 5 minutes!

## 🚀 Installation

```bash
# Navigate to project directory
cd module_2/playwright-retries-timeouts

# Install dependencies
npm install

# Install Chromium browser
npx playwright install chromium
```

## ⚡ Run Your First Tests

### Option 1: Run All Tests

```bash
npm test
```

This will run all 45 tests across different configurations.

### Option 2: Run Individual Test Suites

```bash
# Basic retry patterns (10 tests)
npm run test:retry-examples

# Timeout configurations (20 tests)
npm run test:timeout-examples

# Combined strategies (15 tests)
npm run test:combined
```

### Option 3: Run Specific Projects

```bash
# Standard configuration (2 retries, 30s timeout)
npm run test:standard

# No retries configuration
npm run test:no-retry

# Aggressive retries (3 retries, 45s timeout)
npm run test:aggressive

# Fast tests (1 retry, 15s timeout)
npm run test:fast

# Slow tests (3 retries, 60s timeout)
npm run test:slow
```

## 📊 View Results

### HTML Report

```bash
npm run test:report
```

Opens an interactive HTML report showing:
- Passed, flaky, and failed tests
- Retry attempts and durations
- Screenshots and videos on failure
- Traces for debugging

### Console Output

Tests display comprehensive information:

```
🔄 Attempt 1:
   Timeout: 30000ms
   Status: Passed

📊 Test Report: "basic timeout example"
Status: passed
Attempt: 1
Duration: 1234ms
Timeout: 30000ms
Timeout Usage: 4.1%
```

## 🎯 What's Included?

### Test Files

| File | Tests | Description |
|------|-------|-------------|
| `retry-examples.spec.ts` | 10 | Basic retry patterns, backoff strategies |
| `timeout-examples.spec.ts` | 20 | All timeout types and configurations |
| `retry-timeout-combined.spec.ts` | 15 | Combined retry and timeout strategies |

### Configuration Projects

| Project | Retries | Timeout | Use Case |
|---------|---------|---------|----------|
| `chromium-standard` | 2 | 30s | Standard tests |
| `chromium-no-retries` | 0 | 30s | Stable, deterministic tests |
| `chromium-aggressive-retries` | 3 | 45s | Flaky or integration tests |
| `chromium-fast-tests` | 1 | 15s | Quick unit tests |
| `chromium-slow-tests` | 3 | 60s | Complex E2E tests |

## 📚 Key Concepts

### Retries

**What are retries?**
When a test fails, Playwright can automatically re-run it. If it passes on a retry, it's marked as "flaky."

**Example:**
```typescript
test('example', async ({ page }, testInfo) => {
  // Check if this is a retry
  console.log(`Attempt ${testInfo.retry + 1}`);

  // Perform cleanup on retry
  if (testInfo.retry > 0) {
    await page.context().clearCookies();
  }

  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});
```

**When to use:**
- CI/CD pipelines (handle transient failures)
- Tests with external dependencies
- Network-dependent operations
- As a temporary measure while fixing flakiness

### Timeouts

**What are timeouts?**
Time limits for different parts of test execution:
- **Test timeout**: Max duration for entire test (default: 30s)
- **Expect timeout**: Max wait for assertions (default: 5s)
- **Action timeout**: Max wait for actions like click (default: no limit)
- **Navigation timeout**: Max wait for page load (default: no limit)

**Example:**
```typescript
test('example', async ({ page }) => {
  // Set test timeout
  test.setTimeout(60000); // 60 seconds

  await page.goto('https://playwright.dev');

  // Custom expect timeout
  await expect(page.locator('.navbar')).toBeVisible({
    timeout: 10000
  });
});
```

**Triple timeout with `test.slow()`:**
```typescript
test('slow test', async ({ page }) => {
  test.slow(); // 30s → 90s
  // Test logic
});
```

## 🎨 Common Patterns

### 1. Exponential Backoff

Wait longer between retries:

```typescript
test('backoff example', async ({ page }, testInfo) => {
  if (testInfo.retry > 0) {
    const backoffTime = Math.pow(2, testInfo.retry) * 1000;
    console.log(`Waiting ${backoffTime}ms before retry`);
    await page.waitForTimeout(backoffTime);
  }

  // Test logic
});
```

### 2. Cleanup on Retry

Clear state before retry:

```typescript
test('cleanup example', async ({ page }, testInfo) => {
  if (testInfo.retry > 0) {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  // Test logic
});
```

### 3. Escalating Timeout

Increase timeout on retry:

```typescript
test('escalating timeout', async ({ page }, testInfo) => {
  const baseTimeout = 30000;
  const currentTimeout = baseTimeout * (testInfo.retry + 1);
  test.setTimeout(currentTimeout);

  console.log(`Timeout: ${currentTimeout}ms`);

  // Test logic
});
```

### 4. Progressive Wait Strategy

More thorough checks on retry:

```typescript
test('progressive wait', async ({ page }, testInfo) => {
  await page.goto('https://playwright.dev');

  if (testInfo.retry === 0) {
    // Quick check on first attempt
    await expect(page.locator('.navbar')).toBeVisible({
      timeout: 5000
    });
  } else {
    // Thorough check on retry
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.navbar')).toBeVisible({
      timeout: 15000
    });
  }
});
```

### 5. Flaky Test Detection

Monitor and log flaky tests:

```typescript
test.afterEach(async ({}, testInfo) => {
  if (testInfo.status === 'passed' && testInfo.retry > 0) {
    console.warn('⚠️  FLAKY TEST DETECTED');
    console.warn(`   Test: ${testInfo.title}`);
    console.warn(`   Retries: ${testInfo.retry}`);
  }

  const percentage = (testInfo.duration / testInfo.timeout) * 100;
  if (percentage > 80) {
    console.warn(`⚠️  High timeout usage: ${percentage.toFixed(1)}%`);
  }
});
```

## 🔧 Debugging

### Headed Mode

See the browser while tests run:

```bash
npm run test:headed
```

### Debug Mode

Step through test execution:

```bash
npm run test:debug
```

### Traces

Automatically captured on first retry. View with:

```bash
npx playwright show-trace test-results/.../trace.zip
```

### UI Mode

Interactive test runner:

```bash
npm run test:ui
```

## 🎓 Next Steps

1. **Read the detailed README**: `README_UPDATED.md`
2. **Study the test files**: Start with `retry-examples.spec.ts`
3. **Experiment**: Try modifying retry counts and timeouts
4. **Read the markdown guide**: `../15_test_retries.md`

## 📋 Cheat Sheet

### Retry Commands

```typescript
// Detect retry
testInfo.retry                    // Current retry number (0, 1, 2...)
testInfo.project.retries          // Max retries configured

// Conditional logic
if (testInfo.retry > 0) {
  // This is a retry
}

// Backoff
await page.waitForTimeout(Math.pow(2, testInfo.retry) * 1000);
```

### Timeout Commands

```typescript
// Set test timeout
test.setTimeout(60000);           // 60 seconds
test.slow();                      // Triple timeout

// Expect timeout
await expect(element).toBeVisible({ timeout: 10000 });

// Navigation timeout
await page.goto(url, { timeout: 30000 });

// Wait for load state
await page.waitForLoadState('networkidle');
await page.waitForLoadState('domcontentloaded');
```

### Configuration

```typescript
// In playwright.config.ts
export default defineConfig({
  timeout: 30000,              // Test timeout
  globalTimeout: 3600000,      // Global timeout
  retries: 2,                  // Retry count
  expect: {
    timeout: 10000,            // Expect timeout
  },
  use: {
    actionTimeout: 10000,      // Action timeout
    navigationTimeout: 30000,  // Navigation timeout
  },
});
```

## 💡 Tips

1. **Start with no retries locally** - Get fast feedback and fix issues immediately
2. **Use more retries on CI** - Handle transient infrastructure issues
3. **Monitor flaky tests** - Track and fix them, don't rely on retries forever
4. **Use `test.slow()` instead of manual calculations** - It's clearer and easier
5. **Wait for proper states** - Use `waitForLoadState()` instead of just increasing timeouts
6. **Coordinate timeouts** - Make sure expect timeouts fit within test timeouts
7. **Monitor timeout usage** - Log tests that use >80% of their timeout

## ⚠️ Common Mistakes

### ❌ Don't: Mask problems with retries

```typescript
// Bad - hiding a genuine issue
test.describe.configure({ retries: 10 });
```

### ✅ Do: Fix the underlying issue

```typescript
// Good - proper wait strategy
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible();
```

### ❌ Don't: Use excessive timeouts globally

```typescript
// Bad - too long for all tests
export default defineConfig({
  timeout: 300000, // 5 minutes!
});
```

### ✅ Do: Use appropriate timeouts per test type

```typescript
// Good - different timeouts for different needs
projects: [
  { name: 'unit', timeout: 10000 },
  { name: 'integration', timeout: 30000 },
  { name: 'e2e', timeout: 60000 },
]
```

## 🎉 You're Ready!

Start exploring the examples and experiment with different configurations. Happy testing!

## 📞 Need Help?

- View the HTML report: `npm run test:report`
- Read the full README: `README_UPDATED.md`
- Check the detailed guide: `../15_test_retries.md`
- Official docs: https://playwright.dev/docs/test-retries
- Official docs: https://playwright.dev/docs/test-timeouts
