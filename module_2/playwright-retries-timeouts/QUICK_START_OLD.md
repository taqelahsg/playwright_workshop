# Playwright Retries - Quick Start Guide

## 🎯 What's Included

This project contains 8 comprehensive test files demonstrating various retry patterns:

| File | Description | Retry Config |
|------|-------------|--------------|
| `00-demo.standard.spec.ts` | Working examples with Playwright.dev | 2 retries |
| `01-basic-retry.standard.spec.ts` | Basic retry concepts | 2 retries |
| `02-retry-detection.standard.spec.ts` | Detecting & responding to retries | 2 retries |
| `03-simulated-flaky.flaky.spec.ts` | Simulated flaky test scenarios | 3 retries |
| `04-serial-mode.serial.spec.ts` | Retries with serial execution | 2 retries |
| `05-no-retry.no-retry.spec.ts` | Tests without retries | 0 retries |
| `06-flaky-detection.standard.spec.ts` | Detecting and logging flaky tests | 2 retries |
| `07-exponential-backoff.standard.spec.ts` | Backoff strategies | 2 retries |
| `08-real-world-scenarios.standard.spec.ts` | Real-world retry scenarios | 2 retries |

## 🚀 Quick Start

```bash
# Run all tests
npm test

# Run a specific demo
npx playwright test 00-demo.standard.spec.ts

# Run only passing tests (demo)
npx playwright test 00-demo.standard.spec.ts -g "simple passing test"

# Run with UI mode
npm run test:ui

# View HTML report
npm run test:report
```

## 📖 Learning Path

### Step 1: Start with the Demo (5 minutes)
```bash
npx playwright test 00-demo.standard.spec.ts
```

**What you'll see:**
- ✅ Tests that pass immediately
- ⚠️ Tests that fail first but pass on retry (flaky)
- ❌ Tests that eventually pass after multiple retries

**Key concepts:**
- How retries work
- The difference between passed, flaky, and failed tests
- Basic retry detection using `testInfo.retry`

### Step 2: Understand Retry Detection (10 minutes)
```bash
npx playwright test 02-retry-detection.standard.spec.ts
```

**What you'll learn:**
- How to detect which attempt is running
- Performing cleanup on retry
- Escalating wait strategies
- Different strategies per retry attempt

**Key APIs:**
```typescript
test('example', async ({ page }, testInfo) => {
  console.log(`Attempt ${testInfo.retry + 1}`);

  if (testInfo.retry > 0) {
    // This is a retry - do cleanup
  }
});
```

### Step 3: Learn Backoff Strategies (10 minutes)
```bash
npx playwright test 07-exponential-backoff.standard.spec.ts
```

**What you'll learn:**
- Exponential backoff: 1s, 2s, 4s, 8s...
- Adding jitter to prevent thundering herd
- Capped backoff to limit wait time
- Linear backoff alternative
- Fibonacci backoff pattern

**Example:**
```typescript
if (testInfo.retry > 0) {
  const backoffTime = Math.pow(2, testInfo.retry) * 1000;
  await page.waitForTimeout(backoffTime);
}
```

### Step 4: Explore Flaky Test Detection (10 minutes)
```bash
npx playwright test 06-flaky-detection.standard.spec.ts
```

**What you'll learn:**
- Automatically detecting flaky tests
- Logging flaky tests for analysis
- Collecting test metrics
- Viewing flaky test reports

**Output:**
```
⚠️⚠️⚠️ FLAKY TEST DETECTED!
⚠️ Test: timing-dependent test
⚠️ Failed 1 time(s) before passing
⚠️ Total duration: 2500ms
```

### Step 5: Real-World Scenarios (15 minutes)
```bash
npx playwright test 08-real-world-scenarios.standard.spec.ts
```

**What you'll see:**
- Database connection retries
- API timeout handling
- Payment gateway retry logic
- Network flakiness scenarios
- Browser-specific issues
- Race conditions

## 🎮 Interactive Examples

### Example 1: Run a Test That Always Passes
```bash
npx playwright test 00-demo.standard.spec.ts -g "simple passing test"
```

**Expected output:**
```
✅ Running simple test that passes on first attempt
✅ Test completed successfully
  ✓ 1 passed (500ms)
```

### Example 2: Run a Test That Demonstrates Retry
```bash
npx playwright test 00-demo.standard.spec.ts -g "demonstrates retry success"
```

**Expected output:**
```
==================================================
Attempt 1 of 3
❌ First attempt - intentionally failing
  ✘ Failed (1.2s)

Attempt 2 of 3
✅ Retry attempt - now checking correct element
✅ Test passed on retry!
  ⚠ Flaky (2.4s)
```

### Example 3: Run a Test With Exponential Backoff
```bash
npx playwright test 00-demo.standard.spec.ts -g "demonstrates backoff"
```

**Expected output:**
```
Attempt 1: simulating failure
⏳ Retry 1: Backing off for 2000ms
Attempt 2: simulating failure
⏳ Retry 2: Backing off for 4000ms
✅ Test passed after backoff
```

## 📊 Understanding Test Output

### Test Result Icons
- `✓` **Passed**: Test succeeded on first attempt
- `⚠` **Flaky**: Test failed but passed on retry
- `✘` **Failed**: Test failed after all retries

### Console Output
Each test provides detailed logging:
```
📊 Test Information:
   Test name: detect which attempt is running
   Attempt number: 1
   Max retries: 2
   Is this a retry? No
```

## 🛠️ Common Commands

```bash
# Run all tests
npm test

# Run specific project
npm run test:standard      # 2 retries
npm run test:no-retry      # 0 retries
npm run test:flaky         # 3 retries
npm run test:serial        # 2 retries (serial mode)

# Run with browser visible
npm run test:headed

# Debug mode
npm run test:debug

# View HTML report
npm run test:report

# Run tests in UI mode
npm run test:ui

# Run specific file
npx playwright test 00-demo.standard.spec.ts

# Run specific test by name
npx playwright test -g "simple passing test"

# Run with custom retries
npx playwright test --retries=5
```

## 🔍 Exploring Test Files

### Demo File Structure
Each test file follows this pattern:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('test description', async ({ page }, testInfo) => {
    // Log attempt information
    console.log(`Attempt ${testInfo.retry + 1}`);

    // Perform actions
    await page.goto('/');

    // Make assertions
    await expect(page.locator('.element')).toBeVisible();
  });
});
```

### Key Patterns to Learn

**1. Basic Retry Detection:**
```typescript
if (testInfo.retry > 0) {
  console.log('This is a retry!');
}
```

**2. Cleanup on Retry:**
```typescript
if (testInfo.retry > 0) {
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
}
```

**3. Exponential Backoff:**
```typescript
if (testInfo.retry > 0) {
  const backoffTime = Math.pow(2, testInfo.retry) * 1000;
  await page.waitForTimeout(backoffTime);
}
```

**4. Progressive Timeout:**
```typescript
const timeout = (testInfo.retry + 1) * 5000;
await page.goto('/', { timeout });
```

## 📈 Next Steps

1. **Run the demo tests** to see retries in action
2. **Read the comments** in each test file to understand the patterns
3. **Modify the tests** to experiment with different retry strategies
4. **Create your own tests** using the patterns you've learned
5. **Read the full documentation** in [README.md](README.md)
6. **Check the markdown guide** at [../15_test_retries.md](../15_test_retries.md)

## 🎯 Key Takeaways

1. **Retries are a safety net**, not a solution for flaky tests
2. **Always investigate flaky tests** and fix the root cause
3. **Use different retry strategies** for different environments (CI vs local)
4. **Implement backoff strategies** for rate-limited APIs
5. **Keep tests isolated** so they can be retried independently
6. **Monitor and log flaky tests** for continuous improvement

## 💡 Tips

- Start with `00-demo.standard.spec.ts` for working examples
- Use `--headed` flag to see tests run in the browser
- Check the HTML report for detailed test results
- Look at the `flaky-tests.log` file for flaky test history
- Use traces (captured on first retry) for debugging

## 🆘 Troubleshooting

**Tests taking too long?**
```bash
# Run fewer tests
npx playwright test 00-demo.standard.spec.ts

# Skip flaky tests
npx playwright test --project=no-retries
```

**Want to see what's happening?**
```bash
# Run in headed mode
npm run test:headed

# Run in debug mode
npm run test:debug
```

**Tests failing?**
```bash
# View the HTML report
npm run test:report

# Check traces (captured on retry)
npx playwright show-trace test-results/.../trace.zip
```

## 📚 Additional Resources

- [Full README](README.md) - Complete project documentation
- [Test Retries Guide](../15_test_retries.md) - Comprehensive markdown guide
- [Playwright Docs](https://playwright.dev/docs/test-retries) - Official documentation

Happy Testing! 🎭
