# Test Annotations in Playwright

## Overview

Test annotations in Playwright provide a powerful way to control test behavior, mark test states, and organize your test suite. Annotations help you skip tests conditionally, mark failing tests, slow down timeouts, focus on specific tests, and add custom metadata for better organization and reporting.

## Table of Contents

1. [Built-in Annotations](#built-in-annotations)
2. [Conditional Annotations](#conditional-annotations)
3. [Test Tags](#test-tags)
4. [Custom Annotations](#custom-annotations)
5. [Runtime Annotations](#runtime-annotations)
6. [Best Practices](#best-practices)

---

## Built-in Annotations

Playwright provides several built-in annotations to control test execution:

### 1. test.skip()

Marks tests as irrelevant or not applicable. Playwright will not run tests marked with `skip`.

**Usage:**
```typescript
test.skip('this test is not ready yet', async ({ page }) => {
  // This test will not run
});
```

**Use Cases:**
- Test is not applicable in certain configurations
- Feature is not yet implemented
- Test needs to be temporarily disabled

### 2. test.only()

Focuses test execution on specific tests. Only tests marked with `only` will run.

**Usage:**
```typescript
test.only('focus on this test', async ({ page }) => {
  // Only this test will run
});

test('this will be skipped', async ({ page }) => {
  // This test won't run when test.only is present
});
```

**Warning:** Remove `test.only()` before committing to version control to avoid accidentally skipping other tests in CI/CD.

### 3. test.fail()

Marks a test as expected to fail. Playwright will run the test and ensure it fails. If the test passes, it will be marked as failed.

**Usage:**
```typescript
test.fail('this test should fail', async ({ page }) => {
  expect(1).toBe(2); // This is expected to fail
});
```

**Use Cases:**
- Known bugs that haven't been fixed yet
- Tests that verify error conditions
- Temporarily marking broken tests while working on fixes

### 4. test.fixme()

Marks a test as failing and skips execution. Unlike `test.fail()`, Playwright will not run tests marked with `fixme`.

**Usage:**
```typescript
test.fixme('this test crashes', async ({ page }) => {
  // This test will not run
});
```

**Use Cases:**
- Test crashes the browser or test runner
- Test is extremely slow
- Test has known issues that need fixing

### 5. test.slow()

Marks a test as slow and triples the test timeout.

**Usage:**
```typescript
test.slow('this is a slow test', async ({ page }) => {
  // Timeout is tripled for this test
  await page.waitForTimeout(10000);
});
```

**Use Cases:**
- Tests that involve long-running operations
- Tests with multiple network requests
- Integration tests with external services

---

## Conditional Annotations

Annotations can be applied conditionally based on test fixtures, environment variables, or runtime values.

### Basic Conditional Syntax

```typescript
test.skip(condition, 'reason for skipping');
```

### Examples

**Skip based on browser:**
```typescript
test.skip(({ browserName }) => browserName === 'firefox', 'Firefox not supported yet');

test('browser-specific test', async ({ page }) => {
  // This test will skip on Firefox
});
```

**Skip based on platform:**
```typescript
import os from 'os';

test.skip(os.platform() === 'darwin', 'Not supported on macOS');

test('platform test', async ({ page }) => {
  // This test will skip on macOS
});
```

**Skip based on environment:**
```typescript
test.skip(process.env.CI !== undefined, 'Skip in CI environment');

test('local only test', async ({ page }) => {
  // This test will skip in CI
});
```

**Conditional fail:**
```typescript
test.fail(({ browserName }) => browserName === 'webkit', 'Known issue on WebKit');

test('flaky on webkit', async ({ page }) => {
  // Expected to fail on WebKit
});
```

---

## Test Tags

Tags provide a flexible way to organize and filter tests. Tags are prefixed with `@` symbol.

### Defining Tags

```typescript
test('user login @smoke @auth', async ({ page }) => {
  // Test with multiple tags
});

// Alternative syntax
test('user login', {
  tag: '@smoke',
}, async ({ page }) => {
  // Test with single tag
});

// Multiple tags using array
test('user login', {
  tag: ['@smoke', '@auth'],
}, async ({ page }) => {
  // Test with multiple tags
});
```

### Running Tagged Tests

```bash
# Run tests with @smoke tag
npx playwright test --grep @smoke

# Run tests with @smoke OR @regression
npx playwright test --grep "@smoke|@regression"

# Run tests with @smoke AND @critical
npx playwright test --grep "(?=.*@smoke)(?=.*@critical)"

# Run all tests EXCEPT @slow
npx playwright test --grep-invert @slow
```

### Common Tag Categories

- **Priority:** `@critical`, `@high`, `@medium`, `@low`
- **Type:** `@smoke`, `@regression`, `@integration`, `@e2e`
- **Feature:** `@auth`, `@payment`, `@checkout`, `@search`
- **Speed:** `@fast`, `@slow`
- **Environment:** `@prod`, `@staging`, `@local`

---

## Custom Annotations

Create custom annotations with `type` and `description` fields for detailed reporting and tracking.

### Adding Custom Annotations

```typescript
test('test with custom annotation', {
  annotation: {
    type: 'issue',
    description: 'https://github.com/project/issues/123',
  },
}, async ({ page }) => {
  // Your test code
});

// Multiple custom annotations
test('test with multiple annotations', {
  annotation: [
    { type: 'issue', description: 'https://github.com/project/issues/123' },
    { type: 'performance', description: 'Should complete under 2s' },
  ],
}, async ({ page }) => {
  // Your test code
});
```

### Custom Annotation Use Cases

- **Issue Tracking:** Link tests to bug reports or feature requests
- **Documentation:** Add performance expectations or special requirements
- **Metadata:** Store additional context for reporting
- **Team Communication:** Note ownership or review status

---

## Runtime Annotations

Annotations can be added dynamically during test execution using `test.info().annotations`.

### Adding Runtime Annotations

```typescript
test('runtime annotation example', async ({ page }) => {
  // Add annotation during test execution
  test.info().annotations.push({
    type: 'browser-version',
    description: await page.evaluate(() => navigator.userAgent),
  });

  // Your test code
});
```

### Conditional Runtime Annotations

```typescript
test('conditional runtime annotation', async ({ page }) => {
  const startTime = Date.now();

  await page.goto('https://example.com');

  const loadTime = Date.now() - startTime;

  if (loadTime > 3000) {
    test.info().annotations.push({
      type: 'performance',
      description: `Slow page load: ${loadTime}ms`,
    });
  }
});
```

---

## Best Practices

### 1. Use Descriptive Reasons

Always provide clear reasons when using annotations:

```typescript
// Good
test.skip('Feature not implemented in mobile view');

// Bad
test.skip('doesn\'t work');
```

### 2. Clean Up test.only()

Never commit `test.only()` to version control. Use git hooks or linters to prevent this:

```typescript
// Use in development only
test.only('debug this test', async ({ page }) => {
  // Remove before committing
});
```

### 3. Prefer test.fixme() for Broken Tests

Use `test.fixme()` instead of commenting out tests:

```typescript
// Good
test.fixme('crashes on WebKit', async ({ page }) => {
  // Test code
});

// Bad
// test('crashes on WebKit', async ({ page }) => {
//   // Test code
// });
```

### 4. Use Tags for Organization

Organize tests with meaningful tags:

```typescript
test('login flow @smoke @auth @critical', async ({ page }) => {
  // Critical smoke test for authentication
});
```

### 5. Document Custom Annotations

Create a convention for custom annotations in your project:

```typescript
// Project convention:
// - type: 'issue' - Link to GitHub issue
// - type: 'performance' - Performance expectations
// - type: 'flaky' - Known flaky test with investigation status

test('checkout process', {
  annotation: [
    { type: 'issue', description: 'https://github.com/project/issues/456' },
    { type: 'performance', description: 'Should complete under 5s' },
  ],
}, async ({ page }) => {
  // Test code
});
```

### 6. Conditional Annotations Over Commented Code

Use conditional annotations instead of commenting/uncommenting code:

```typescript
// Good
test.skip(({ browserName }) => browserName === 'webkit', 'WebKit support pending');

// Bad
// Commenting out for WebKit
// test('feature test', async ({ page }) => {
```

### 7. Review Skipped Tests Regularly

Periodically review and clean up skipped and fixme tests to ensure they're still relevant:

```bash
# Find all skipped tests
npx playwright test --list --grep skip

# Review fixme tests
npx playwright test --list --grep fixme
```

---

## Summary

Test annotations are essential for:
- **Controlling test execution** with skip, only, fail, and fixme
- **Managing test timeouts** with slow annotation
- **Organizing tests** with tags for filtering
- **Adding metadata** with custom annotations
- **Dynamic behavior** with conditional and runtime annotations

For more information, visit the [official Playwright documentation on test annotations](https://playwright.dev/docs/test-annotations).
