# Playwright Test Annotations - Quick Reference

## Basic Annotations

### test.skip()
Skip a test - it will not run.

```typescript
test.skip('not ready yet', async ({ page }) => {
  // This test won't run
});
```

### test.only()
Run only this test (remove before commit!).

```typescript
test.only('debug this test', async ({ page }) => {
  // Only this test will run
});
```

### test.fail()
Mark test as expected to fail - Playwright will run it and expect failure.

```typescript
test.fail('known bug', async ({ page }) => {
  // This test should fail
});
```

### test.fixme()
Mark test as broken - Playwright will NOT run it.

```typescript
test.fixme('crashes browser', async ({ page }) => {
  // This test won't run
});
```

### test.slow()
Triple the timeout for this test.

```typescript
test.slow('takes a long time', async ({ page }) => {
  // Timeout is tripled
});
```

---

## Conditional Annotations

### Skip based on browser

```typescript
test('test name', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'Not supported on Firefox');
  // Test code
});
```

### Skip based on platform

```typescript
import os from 'os';

test('test name', async ({ page }) => {
  test.skip(os.platform() === 'darwin', 'macOS not supported');
  // Test code
});
```

### Skip in CI

```typescript
test('test name', async ({ page }) => {
  test.skip(!!process.env.CI, 'CI environment not supported');
  // Test code
});
```

### Conditional fail

```typescript
test('test name', async ({ page, browserName }) => {
  test.fail(browserName === 'webkit', 'Known WebKit issue');
  // Test code
});
```

---

## Test Tags

### In test name

```typescript
test('user login @smoke @critical', async ({ page }) => {
  // Test code
});
```

### Using tag option (single)

```typescript
test('test name', {
  tag: '@smoke',
}, async ({ page }) => {
  // Test code
});
```

### Using tag option (multiple)

```typescript
test('test name', {
  tag: ['@smoke', '@critical', '@auth'],
}, async ({ page }) => {
  // Test code
});
```

### Running tagged tests

```bash
# Single tag
npx playwright test --grep @smoke

# Multiple tags (OR)
npx playwright test --grep "@smoke|@critical"

# Multiple tags (AND)
npx playwright test --grep "(?=.*@smoke)(?=.*@critical)"

# Exclude tag
npx playwright test --grep-invert @slow
```

---

## Custom Annotations

### Single annotation

```typescript
test('test name', {
  annotation: {
    type: 'issue',
    description: 'https://github.com/project/issues/123',
  },
}, async ({ page }) => {
  // Test code
});
```

### Multiple annotations

```typescript
test('test name', {
  annotation: [
    { type: 'issue', description: 'https://github.com/project/issues/123' },
    { type: 'owner', description: 'team-auth' },
    { type: 'priority', description: 'P0' },
  ],
}, async ({ page }) => {
  // Test code
});
```

### Common annotation types

```typescript
{ type: 'issue', description: 'Issue URL or ID' }
{ type: 'owner', description: 'Team or person responsible' }
{ type: 'priority', description: 'P0, P1, P2, etc.' }
{ type: 'performance', description: 'Performance expectations' }
{ type: 'documentation', description: 'Link to docs' }
{ type: 'requirement', description: 'Requirement ID' }
```

---

## Runtime Annotations

### Add annotation during test

```typescript
test('test name', async ({ page }) => {
  test.info().annotations.push({
    type: 'custom-type',
    description: 'Custom description',
  });
  // Test code
});
```

### Performance tracking

```typescript
test('performance test', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('https://example.com');
  const loadTime = Date.now() - startTime;

  test.info().annotations.push({
    type: 'performance',
    description: `Load time: ${loadTime}ms`,
  });
});
```

### Browser info

```typescript
test('browser test', async ({ page, browserName }) => {
  const userAgent = await page.evaluate(() => navigator.userAgent);

  test.info().annotations.push({
    type: 'browser-version',
    description: userAgent,
  });
});
```

### Retry tracking

```typescript
test('retry test', async ({ page }) => {
  const retryCount = test.info().retry;

  test.info().annotations.push({
    type: 'retry-count',
    description: `Attempt ${retryCount + 1}`,
  });
});
```

---

## Combining Techniques

### Tags + Custom Annotations

```typescript
test('comprehensive test @smoke @critical', {
  annotation: [
    { type: 'issue', description: 'PROJ-123' },
    { type: 'owner', description: 'team-core' },
  ],
}, async ({ page }) => {
  // Test code
});
```

### Conditional + Tags + Runtime

```typescript
test('complex test @smoke', {
  annotation: { type: 'issue', description: 'PROJ-456' },
}, async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'WebKit not supported');

  const startTime = Date.now();
  await page.goto('https://example.com');

  test.info().annotations.push({
    type: 'load-time',
    description: `${Date.now() - startTime}ms`,
  });
});
```

---

## Common Tag Naming Conventions

### Priority
- `@critical`, `@high`, `@medium`, `@low`
- `@p0`, `@p1`, `@p2`, `@p3`

### Test Type
- `@smoke` - Critical path tests
- `@regression` - Full regression suite
- `@integration` - Integration tests
- `@e2e` - End-to-end tests
- `@unit` - Unit tests

### Features
- `@auth` - Authentication
- `@payment` - Payment flow
- `@cart` - Shopping cart
- `@checkout` - Checkout process
- `@search` - Search functionality

### Environment
- `@prod` - Production tests
- `@staging` - Staging tests
- `@local` - Local development

### Speed
- `@fast` - Quick tests
- `@slow` - Long-running tests

### Quality
- `@a11y` - Accessibility tests
- `@security` - Security tests
- `@performance` - Performance tests
- `@visual` - Visual regression tests

---

## CLI Commands Cheat Sheet

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/example.spec.ts

# Run with specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run with tags
npx playwright test --grep @smoke
npx playwright test --grep @critical
npx playwright test --grep "@smoke|@critical"

# Exclude tags
npx playwright test --grep-invert @slow

# UI Mode
npx playwright test --ui

# Headed mode
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Show report
npx playwright show-report
```

---

## Best Practices

1. ✅ **DO** use descriptive reasons for annotations
2. ✅ **DO** use tags for organization
3. ✅ **DO** add custom annotations for tracking
4. ✅ **DO** use runtime annotations for debugging
5. ❌ **DON'T** commit `test.only()`
6. ❌ **DON'T** comment out tests (use `test.fixme()` instead)
7. ❌ **DON'T** use annotations as a substitute for fixing tests
8. ✅ **DO** review skipped tests regularly

---

## Troubleshooting

### Issue: test.only() preventing other tests
**Solution:** Remove all `test.only()` calls
```bash
grep -r "test.only" tests/
```

### Issue: Tests being skipped unexpectedly
**Solution:** Check for conditional skip annotations based on browser/platform

### Issue: Tags not working
**Solution:** Ensure you're using `@` prefix and correct grep syntax
```bash
# Correct
npx playwright test --grep @smoke

# Wrong
npx playwright test --grep smoke
```

### Issue: Custom annotations not showing in report
**Solution:** View HTML report to see all annotations
```bash
npx playwright show-report
```
