# Playwright Test Annotations - Example Project

This project demonstrates various Playwright test annotation techniques with practical examples.

## Overview

Test annotations in Playwright provide powerful ways to control test behavior, organize tests, and add metadata. This project includes comprehensive examples of all annotation types.

## Project Structure

```
playwright-annotations/
├── tests/
│   ├── 01-basic-annotations.spec.ts       # Basic annotations (skip, only, fail, fixme, slow)
│   ├── 02-conditional-annotations.spec.ts # Conditional annotations based on browser, OS, etc.
│   ├── 03-test-tags.spec.ts              # Test tags for filtering and organization
│   ├── 04-custom-annotations.spec.ts      # Custom annotations for metadata
│   ├── 05-runtime-annotations.spec.ts     # Dynamic annotations added at runtime
│   └── 06-advanced-annotations.spec.ts    # Advanced patterns combining techniques
├── playwright.config.ts
├── package.json
└── README.md
```

## Installation

```bash
npm install
npx playwright install
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npx playwright test tests/01-basic-annotations.spec.ts
```

### Run Tests by Tag

```bash
# Run smoke tests
npm run test:smoke

# Run critical tests
npm run test:critical

# Run tests with specific tag
npx playwright test --grep @smoke

# Run multiple tags (OR)
npx playwright test --grep "@smoke|@critical"

# Run multiple tags (AND)
npx playwright test --grep "(?=.*@smoke)(?=.*@critical)"

# Exclude tests with tag
npx playwright test --grep-invert @slow
```

### Run Tests with UI Mode

```bash
npm run test:ui
```

### Run Tests in Headed Mode

```bash
npm run test:headed
```

### Run Tests on Specific Browser

```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# WebKit only
npx playwright test --project=webkit
```

## Test Files Overview

### 01-basic-annotations.spec.ts

Demonstrates fundamental annotations:
- `test.skip()` - Skip tests
- `test.only()` - Focus on specific tests
- `test.fail()` - Mark tests as expected to fail
- `test.fixme()` - Mark broken tests
- `test.slow()` - Triple timeout for slow tests

**Run:**
```bash
npx playwright test tests/01-basic-annotations.spec.ts
```

### 02-conditional-annotations.spec.ts

Shows how to apply annotations conditionally:
- Browser-based conditions (`browserName === 'firefox'`)
- Platform-based conditions (`os.platform() === 'darwin'`)
- Environment-based conditions (`process.env.CI`)
- Complex conditional logic

**Run:**
```bash
# Run on specific browser to see conditional behavior
npx playwright test tests/02-conditional-annotations.spec.ts --project=firefox
npx playwright test tests/02-conditional-annotations.spec.ts --project=webkit
```

### 03-test-tags.spec.ts

Demonstrates test organization using tags:
- Priority tags: `@critical`, `@high`, `@medium`, `@low`
- Type tags: `@smoke`, `@regression`, `@e2e`, `@integration`
- Feature tags: `@auth`, `@payment`, `@cart`
- Environment tags: `@prod`, `@staging`, `@local`

**Run:**
```bash
# Run smoke tests
npx playwright test --grep @smoke

# Run critical tests
npx playwright test --grep @critical

# Run payment-related tests
npx playwright test --grep @payment

# Run smoke AND critical tests
npx playwright test --grep "(?=.*@smoke)(?=.*@critical)"
```

### 04-custom-annotations.spec.ts

Shows how to add custom metadata:
- Issue tracking
- Documentation links
- Performance expectations
- Team ownership
- Test coverage information

**Run:**
```bash
npx playwright test tests/04-custom-annotations.spec.ts
```

### 05-runtime-annotations.spec.ts

Demonstrates dynamic annotations:
- Adding annotations during test execution
- Performance tracking
- Browser version capture
- Network monitoring
- Error tracking

**Run:**
```bash
npx playwright test tests/05-runtime-annotations.spec.ts
```

### 06-advanced-annotations.spec.ts

Advanced patterns combining multiple techniques:
- Comprehensive annotation examples
- Performance benchmarks
- Accessibility testing
- Security testing
- CI/CD integration

**Run:**
```bash
npx playwright test tests/06-advanced-annotations.spec.ts
```

## Common Use Cases

### 1. Running Only Smoke Tests

```bash
npx playwright test --grep @smoke
```

### 2. Running Tests for Specific Feature

```bash
npx playwright test --grep @auth
npx playwright test --grep @payment
npx playwright test --grep @checkout
```

### 3. Running Critical Tests Before Deployment

```bash
npx playwright test --grep @critical
```

### 4. Excluding Slow Tests

```bash
npx playwright test --grep-invert @slow
```

### 5. Running Tests on Specific Browser

```bash
# Tests will respect conditional annotations
npx playwright test --project=webkit
```

## Viewing Test Results

### HTML Report

After running tests, view the HTML report:

```bash
npx playwright show-report
```

The report will show:
- Test results
- Custom annotations
- Runtime annotations
- Performance metrics
- Screenshots and traces (if configured)

## Best Practices Demonstrated

1. **Use descriptive reasons for annotations**
   - Always explain why a test is skipped or marked as failing

2. **Never commit test.only()**
   - Remove `test.only()` before committing to version control

3. **Prefer test.fixme() for broken tests**
   - Use instead of commenting out tests

4. **Use tags for organization**
   - Apply meaningful, consistent tags across your test suite

5. **Document custom annotations**
   - Establish conventions for annotation types in your project

6. **Add runtime annotations for debugging**
   - Capture performance metrics, browser versions, etc.

## Integration with CI/CD

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run smoke tests
  run: npx playwright test --grep @smoke

- name: Run critical tests
  run: npx playwright test --grep @critical

- name: Run full regression suite
  run: npx playwright test --grep @regression
```

## Learn More

- [Test Annotations Documentation](../../8_test_annotations.md)
- [Official Playwright Docs](https://playwright.dev/docs/test-annotations)
- [Playwright Test Configuration](https://playwright.dev/docs/test-configuration)

## Troubleshooting

### Tests are being skipped unexpectedly

Check for:
- Conditional skip annotations based on browser or platform
- Environment variables (e.g., `CI`)
- `test.only()` in other test files

### test.only() is preventing other tests from running

Search for and remove all `test.only()` calls:

```bash
grep -r "test.only" tests/
```

### Tags not working

Make sure you're using the correct grep syntax:

```bash
# Correct
npx playwright test --grep @smoke

# Incorrect (missing @)
npx playwright test --grep smoke
```
