# Playwright Test Retries and Timeouts Examples

This project demonstrates comprehensive test retry strategies and timeout configurations in Playwright. It includes practical examples of how to configure, detect, and handle test retries and timeouts effectively.

## 📋 Project Structure

```
playwright-retries-timeouts/
├── tests/
│   ├── retry-examples.spec.ts              # Basic retry patterns (10 tests)
│   ├── timeout-examples.spec.ts            # Timeout configurations (20 tests)
│   └── retry-timeout-combined.spec.ts      # Combined strategies (15 tests)
├── playwright.config.ts                     # Configuration with multiple projects
├── package.json
└── README.md
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test files
npm run test:retry-examples       # Basic retry patterns
npm run test:timeout-examples     # Timeout configurations
npm run test:combined             # Combined strategies

# Run tests with specific strategies
npm run test:standard             # Standard retries (2 retries, 30s timeout)
npm run test:no-retry             # No retries
npm run test:aggressive           # Aggressive retries (3 retries, 45s timeout)
npm run test:fast                 # Fast tests (1 retry, 15s timeout)
npm run test:slow                 # Slow tests (3 retries, 60s timeout)

# Other useful commands
npm run test:headed               # Show browser
npm run test:debug                # Debug mode
npm run test:ui                   # Interactive UI mode
npm run test:report               # View HTML report
```

### Run with Custom Configurations

```bash
# Custom retry count
npx playwright test --retries=3

# Run specific project
npx playwright test --project=chromium-standard

# Run specific test
npx playwright test -g "timeout test"

# Headed mode with specific browser
npx playwright test --headed --project=chromium-no-retries
```

## 📚 Test Examples Overview

### 1. Retry Examples (`retry-examples.spec.ts`)

**10 essential tests demonstrating retry patterns:**

#### Basic Retry Tests
- Simple passing test (baseline)
- Test that passes on retry (flaky simulation)
- Navigation test
- Detect retry attempt (logging)
- Wait strategy test

#### Retry Patterns
- Exponential backoff pattern
- Cleanup on retry
- Multiple elements check
- Complete user flow
- Proper assertions

**Key Concepts:**
```typescript
// Detecting retry
test('example', async ({ page }, testInfo) => {
  console.log(`Attempt: ${testInfo.retry + 1}`);
  console.log(`Max retries: ${testInfo.project.retries}`);
});

// Conditional behavior on retry
if (testInfo.retry > 0) {
  // Clear cookies on retry
  await page.context().clearCookies();
}

// Exponential backoff
if (testInfo.retry > 0) {
  const backoffTime = Math.pow(2, testInfo.retry) * 1000;
  await page.waitForTimeout(backoffTime);
}
```

### 2. Timeout Examples (`timeout-examples.spec.ts`)

**20 tests covering all timeout types:**

#### Basic Timeout Tests
- Default timeout (30s)
- Custom test timeout
- Using `test.slow()` (3x multiplier)
- Conditional browser-specific timeouts

#### Expect Timeout Tests
- Default expect timeout (5s)
- Custom expect timeout
- Multiple assertions with different timeouts

#### Action Timeout Tests
- Navigation with custom timeout
- Click with custom timeout
- Wait for selector with timeout

#### Hook-Based Timeout Configuration
- Extend timeout in `beforeEach`
- Dynamic timeout adjustment

#### Timeout Monitoring
- Track timeout usage percentage
- Identify slow tests
- Warning for high timeout usage

#### Best Practices
- Wait for proper state before assertions
- Use efficient locators
- Combined retry and timeout strategy

#### Load State and Timeout
- Different load states (`domcontentloaded`, `load`, `networkidle`)
- Network idle wait
- Multiple state checks

**Key Concepts:**
```typescript
// Set test timeout
test.setTimeout(60000); // 60 seconds

// Triple timeout
test.slow();

// Custom expect timeout
await expect(element).toBeVisible({ timeout: 10000 });

// Custom navigation timeout
await page.goto(url, { timeout: 30000 });

// Monitor timeout usage
const percentage = (testInfo.duration / testInfo.timeout) * 100;
if (percentage > 80) {
  console.warn('High timeout usage!');
}

// Wait for load states
await page.waitForLoadState('networkidle');
```

### 3. Combined Retry and Timeout (`retry-timeout-combined.spec.ts`)

**15 tests demonstrating coordinated strategies:**

#### Retry with Timeout Strategy
- Escalating timeout on retry (increase timeout per attempt)
- Conditional behavior based on retry count
- Exponential backoff with timeout adjustment

#### Cleanup and Retry
- State cleanup on retry (cookies, localStorage)
- Progressive wait strategy (quick → load → networkidle)

#### Flaky Test Patterns
- Simulated flaky test with recovery
- Network-dependent test with retry
- Timeout adjustment per retry

#### Timeout Monitoring with Retries
- Comprehensive test reports
- Flaky test detection
- Performance metrics

#### Best Practices
- Reliable tests with proper waits
- Efficient error recovery
- Timeout and retry coordination

#### Real-World Scenarios
- E2E flow with combined strategy
- API-dependent UI tests
- Complex user journeys

**Key Concepts:**
```typescript
// Escalating timeout
const baseTimeout = 30000;
const currentTimeout = baseTimeout * (testInfo.retry + 1);
test.setTimeout(currentTimeout);

// Progressive strategy
if (testInfo.retry === 0) {
  // Quick check
  await expect(element).toBeVisible({ timeout: 3000 });
} else if (testInfo.retry === 1) {
  // Wait for load
  await page.waitForLoadState('load');
  await expect(element).toBeVisible({ timeout: 10000 });
} else {
  // Wait for network idle
  await page.waitForLoadState('networkidle');
  await expect(element).toBeVisible({ timeout: 15000 });
}

// Cleanup on retry
if (testInfo.retry > 0) {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}
```

## ⚙️ Configuration

The project demonstrates multiple configuration strategies:

### Global Configuration

```typescript
export default defineConfig({
  timeout: 30000,              // Default test timeout
  globalTimeout: 3600000,      // 1 hour for entire test run
  expect: { timeout: 10000 },  // Assertion timeout
  retries: 2,                  // Default retries
  use: {
    actionTimeout: 10000,      // Action timeout
    navigationTimeout: 30000,  // Navigation timeout
  },
});
```

### Project-Specific Configuration

```typescript
projects: [
  {
    name: 'chromium-standard',
    retries: 2,
    timeout: 30000,
  },
  {
    name: 'chromium-no-retries',
    retries: 0,
    timeout: 30000,
  },
  {
    name: 'chromium-aggressive-retries',
    retries: 3,
    timeout: 45000,
  },
  {
    name: 'chromium-fast-tests',
    retries: 1,
    timeout: 15000,
  },
  {
    name: 'chromium-slow-tests',
    retries: 3,
    timeout: 60000,
    expect: { timeout: 15000 },
  },
]
```

## 🎯 Best Practices Demonstrated

### Retry Best Practices

1. **Fix Flaky Tests, Don't Mask Them**
   - Use retries as a safety net, not a permanent solution
   - Track and investigate flaky tests
   - Monitor retry patterns

2. **Different Strategies for Different Environments**
   - More retries on CI (transient issues more common)
   - Fewer/no retries locally (fast feedback)

3. **Proper Cleanup on Retry**
   - Clear browser state (cookies, localStorage, sessionStorage)
   - Reset test data
   - Clear caches

4. **Use Appropriate Backoff Strategies**
   - Exponential backoff: `Math.pow(2, retry) * 1000`
   - Helps with rate-limited APIs
   - Prevents overwhelming services

5. **Keep Tests Isolated**
   - Each test should set up its own state
   - Don't depend on other tests
   - Makes retries more reliable

### Timeout Best Practices

1. **Don't Modify Low-Level Timeouts Unnecessarily**
   - Keep action/navigation timeouts at defaults
   - Override only when genuinely needed

2. **Use `test.slow()` for Moderately Slower Tests**
   - Automatically triples timeout (30s → 90s)
   - Better than manual calculation

3. **Set Global Timeout for CI/CD**
   - Prevents infinite test runs
   - Helps identify systemic issues

4. **Different Timeouts for Different Test Types**
   - Unit tests: 10s
   - Integration tests: 30s
   - E2E tests: 60s+

5. **Monitor Timeout Usage**
   - Track percentage of timeout used
   - Identify tests that need optimization
   - Log warnings for high usage (>80%)

6. **Investigate Flakiness, Don't Just Increase Timeouts**
   - Fix underlying issues
   - Use proper wait strategies
   - Don't mask problems with longer timeouts

## 📊 Understanding Test Results

### Test Outcomes

- **✅ Passed**: Test succeeded on first attempt
- **⚠️ Flaky**: Test failed initially but passed on retry
- **❌ Failed**: Test failed on all retry attempts

### Reading Output

```bash
🔄 Attempt 1:
   Timeout: 30000ms
   Status: Failed

🔄 Attempt 2:
   Timeout: 60000ms  (escalated)
   Status: Passed

📊 Test Report: "example test"
Status: passed
Attempt: 2
Duration: 5234ms
Timeout: 60000ms
Timeout Usage: 8.7%
⚠️  FLAKY TEST DETECTED - Passed after 1 retry
```

### Viewing HTML Report

```bash
npm run test:report
# Opens interactive HTML report showing:
# - Passed, flaky, and failed tests
# - Retry attempts and durations
# - Traces for failures
# - Screenshots and videos
```

## 🔍 Debugging

### Enable Traces

Traces are automatically captured on first retry (configured in `playwright.config.ts`):

```typescript
use: {
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

### View Traces

```bash
# Traces are saved in test-results/
npx playwright show-trace test-results/.../trace.zip
```

### Debug Mode

```bash
# Step through test execution
npm run test:debug

# Debug specific test
npx playwright test --debug -g "specific test name"
```

### Headed Mode

```bash
# See browser while tests run
npm run test:headed

# Headed mode with specific project
npx playwright test --headed --project=chromium-standard
```

## 📈 Performance Considerations

### Impact of Retries on Execution Time

```
Without retries:
Test fails → Total: 5s

With 2 retries:
Attempt 1 fails (5s)
Attempt 2 fails (5s)
Attempt 3 passes (5s)
Total: 15s (3x longer)
```

### Optimizing Timeout Configuration

```typescript
// ❌ Too aggressive - may cause false failures
test.setTimeout(5000);
await expect(element).toBeVisible({ timeout: 1000 });

// ✅ Balanced - allows reasonable time without being excessive
test.setTimeout(30000);
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible({ timeout: 10000 });
```

## 🌍 Environment Variables

```bash
# Run with CI configuration
CI=true npm test

# Custom retry count
npx playwright test --retries=5

# Custom timeout
npx playwright test --timeout=60000
```

## 📝 Common Patterns

### Pattern 1: Cleanup on Retry

```typescript
if (testInfo.retry > 0) {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}
```

### Pattern 2: Exponential Backoff

```typescript
if (testInfo.retry > 0) {
  const backoffTime = Math.pow(2, testInfo.retry) * 1000;
  console.log(`⏰ Backoff: ${backoffTime}ms`);
  await page.waitForTimeout(backoffTime);
}
```

### Pattern 3: Escalating Timeout

```typescript
const baseTimeout = 30000;
const timeoutMultiplier = testInfo.retry + 1;
test.setTimeout(baseTimeout * timeoutMultiplier);
```

### Pattern 4: Progressive Wait Strategy

```typescript
if (testInfo.retry === 0) {
  // Quick check
  await expect(element).toBeVisible({ timeout: 5000 });
} else {
  // Thorough check
  await page.waitForLoadState('networkidle');
  await expect(element).toBeVisible({ timeout: 15000 });
}
```

### Pattern 5: Flaky Test Detection

```typescript
test.afterEach(async ({}, testInfo) => {
  if (testInfo.status === 'passed' && testInfo.retry > 0) {
    console.warn(`⚠️  FLAKY TEST: ${testInfo.title}`);
    console.warn(`   Passed after ${testInfo.retry} retries`);
    // Log to monitoring system
  }
});
```

### Pattern 6: Timeout Monitoring

```typescript
test.afterEach(async ({}, testInfo) => {
  const percentage = (testInfo.duration / testInfo.timeout) * 100;
  if (percentage > 80) {
    console.warn(`⚠️  Test used ${percentage.toFixed(1)}% of timeout`);
    console.warn(`   Consider optimization or increasing timeout`);
  }
});
```

## 🎓 Learning Path

### Beginner Path
1. **retry-examples.spec.ts** - Understand basic retry concepts
2. **timeout-examples.spec.ts** - Learn timeout configurations
3. Run with different projects to see behavior differences

### Intermediate Path
1. **retry-timeout-combined.spec.ts** - See how retries and timeouts work together
2. Experiment with custom configurations
3. Practice debugging with traces and reports

### Advanced Path
1. Study the configuration strategies in `playwright.config.ts`
2. Implement flaky test monitoring
3. Optimize timeout values for your specific use case
4. Create custom retry strategies

## 📚 Additional Resources

- [Official Playwright Test Retries Documentation](https://playwright.dev/docs/test-retries)
- [Official Playwright Test Timeouts Documentation](https://playwright.dev/docs/test-timeouts)
- [Test Retries and Timeouts Markdown Guide](../15_test_retries.md)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)

## 🎯 Key Takeaways

### Retries
- Use retries as a safety net, not a solution
- Different retry counts for different environments (CI vs local)
- Monitor and fix flaky tests
- Implement cleanup on retry
- Use backoff strategies for rate-limited services

### Timeouts
- Default timeouts (30s test, 5s expect) work for most cases
- Use `test.slow()` to triple timeout when needed
- Different timeout strategies for different test types
- Monitor timeout usage to identify slow tests
- Investigate root causes instead of just increasing timeouts

### Combined Strategy
- Escalate timeout on retry attempts
- Progressive wait strategies (quick → thorough)
- Coordinate test and expect timeouts
- Clear state between retries
- Comprehensive monitoring and logging

## 🤝 Contributing

Feel free to add more examples or improve existing ones!

## 📄 License

MIT
