# Test Assertions in Playwright

## Introduction

Assertions are the core of testing - they verify that your application behaves as expected. Playwright includes a powerful `expect` function with **auto-retrying** capabilities built-in, making tests more reliable and resilient to timing issues.

## Key Concept: Auto-Retrying Assertions

Playwright's assertions automatically retry until the expected condition is met or a timeout occurs. This eliminates the need for manual waits and reduces flakiness in tests.

- **Default timeout:** 5 seconds
- **Configurable:** Set custom timeouts in `playwright.config.ts` or per assertion
- **Smart waiting:** Assertions keep checking until conditions are met

```javascript
// This will automatically retry for up to 5 seconds
await expect(page.getByRole('button')).toBeVisible();

// Custom timeout for this assertion
await expect(page.getByText('Loading...')).toBeHidden({ timeout: 10000 });
```

## Auto-Retrying Assertions

These assertions automatically wait and retry until the condition is met:

### Visibility & State

```javascript
// Element is visible
await expect(page.getByRole('button')).toBeVisible();

// Element is hidden
await expect(page.getByText('Error')).toBeHidden();

// Element is attached to the DOM
await expect(page.getByTestId('modal')).toBeAttached();

// Element is detached from the DOM
await expect(page.getByTestId('loading')).not.toBeAttached();

// Element is disabled
await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();

// Element is enabled
await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();

// Element is focused
await expect(page.getByLabel('Email')).toBeFocused();

// Element is editable (input, textarea)
await expect(page.getByLabel('Comment')).toBeEditable();

// Element is in viewport
await expect(page.getByRole('heading')).toBeInViewport();
```

### Content Assertions

```javascript
// Element has specific text (exact match)
await expect(page.getByRole('heading')).toHaveText('Welcome');

// Element contains text (partial match)
await expect(page.getByTestId('message')).toContainText('success');

// Element has specific value (for inputs)
await expect(page.getByLabel('Username')).toHaveValue('john_doe');

// Element is empty
await expect(page.getByRole('textbox')).toBeEmpty();

// Multiple elements have text (array match)
await expect(page.getByRole('listitem')).toHaveText([
  'Item 1',
  'Item 2',
  'Item 3'
]);

// Text with regex
await expect(page.getByTestId('status')).toHaveText(/active|pending/i);
```

### Attribute Assertions

```javascript
// Element has specific attribute value
await expect(page.getByRole('link')).toHaveAttribute('href', '/about');

// Element has attribute with regex pattern
await expect(page.getByRole('img')).toHaveAttribute('src', /logo\.png$/);

// Element has specific class
await expect(page.getByTestId('alert')).toHaveClass('error');

// Element has specific CSS property
await expect(page.getByRole('button')).toHaveCSS('background-color', 'rgb(0, 123, 255)');

// Element has specific ID
await expect(page.locator('div').first()).toHaveId('main-content');

// Element has specific count
await expect(page.getByRole('row')).toHaveCount(10);
```

### Form & Input Assertions

```javascript
// Checkbox or radio is checked
await expect(page.getByRole('checkbox', { name: 'Accept terms' })).toBeChecked();

// Checkbox is not checked
await expect(page.getByRole('checkbox', { name: 'Subscribe' })).not.toBeChecked();

// Input has specific value
await expect(page.getByLabel('Email')).toHaveValue('test@example.com');

// Select/dropdown has selected values
await expect(page.getByLabel('Country')).toHaveValues(['USA', 'Canada']);
```

### Accessibility Assertions

```javascript
// Element has accessible name
await expect(page.getByRole('button')).toHaveAccessibleName('Submit form');

// Element has accessible description
await expect(page.getByRole('button')).toHaveAccessibleDescription('Click to submit');

// Element has specific role
await expect(page.locator('nav')).toHaveRole('navigation');
```

### Page & URL Assertions

```javascript
// Page has specific URL
await expect(page).toHaveURL('https://example.com/dashboard');

// URL matches pattern
await expect(page).toHaveURL(/\/products\/\d+/);

// Page has specific title
await expect(page).toHaveTitle('Dashboard - My App');

// Title contains text
await expect(page).toHaveTitle(/Dashboard/);
```

### Screenshot Assertions

```javascript
// Element matches screenshot
await expect(page.getByRole('banner')).toHaveScreenshot('header.png');

// Full page screenshot
await expect(page).toHaveScreenshot('dashboard.png');

// With options
await expect(page.getByTestId('chart')).toHaveScreenshot('chart.png', {
  maxDiffPixels: 100,
  threshold: 0.2
});
```

## Non-Retrying Assertions

These are standard Jest/Expect assertions that test a condition once without retrying:

### Value Comparison

```javascript
// Exact equality (===)
expect(await page.textContent('.count')).toBe('5');

// Deep equality for objects/arrays
expect(await page.evaluate(() => ({ user: 'john' }))).toEqual({ user: 'john' });

// Truthiness
expect(await page.isVisible('.modal')).toBeTruthy();
expect(await page.isHidden('.modal')).toBeFalsy();
```

### String & Array Assertions

```javascript
// String contains substring
const title = await page.title();
expect(title).toContain('Dashboard');

// String matches regex
expect(title).toMatch(/^Dashboard/);

// Array contains item
const items = await page.$$eval('.item', els => els.map(e => e.textContent));
expect(items).toContain('Apple');

// Array length
expect(items).toHaveLength(3);
```

### Numeric Assertions

```javascript
const count = await page.locator('.item').count();

expect(count).toBeGreaterThan(0);
expect(count).toBeGreaterThanOrEqual(1);
expect(count).toBeLessThan(10);
expect(count).toBeLessThanOrEqual(10);
expect(count).toBeCloseTo(5, 0); // Within 0.5 of 5
```

### Type Checking

```javascript
const result = await page.evaluate(() => window.appConfig);

expect(result).toBeDefined();
expect(result).not.toBeNull();
expect(result).not.toBeUndefined();
expect(typeof result).toBe('object');
```

### Exception Assertions

```javascript
// Function throws error
expect(() => {
  throw new Error('Invalid input');
}).toThrow('Invalid input');

// Async function throws
await expect(async () => {
  await page.getByRole('button', { name: 'Missing' }).click({ timeout: 100 });
}).rejects.toThrow();
```

## Negating Assertions

Use `.not` to test the opposite condition:

```javascript
// Element should NOT be visible
await expect(page.getByText('Error message')).not.toBeVisible();

// Element should NOT contain text
await expect(page.getByTestId('status')).not.toContainText('failed');

// Value should NOT equal
expect(await page.inputValue('#username')).not.toBe('');

// Element should NOT have class
await expect(page.getByRole('button')).not.toHaveClass('disabled');
```

## Soft Assertions

Soft assertions allow tests to continue even after failures, collecting all errors:

```javascript
import { test, expect } from '@playwright/test';

test('check multiple conditions', async ({ page }) => {
  await page.goto('https://example.com');

  // These will all be checked even if some fail
  await expect.soft(page.getByRole('heading')).toHaveText('Welcome');
  await expect.soft(page.getByRole('button')).toBeVisible();
  await expect.soft(page).toHaveTitle('Home Page');

  // Test continues and all failures are reported at the end
});
```

**Use cases for soft assertions:**
- Checking multiple independent conditions
- Visual regression testing with multiple screenshots
- Comprehensive validation of a complex UI state

**Warning:** Use sparingly - tests should typically fail fast on critical issues.

## Custom Assertion Messages

Add custom messages to provide context when assertions fail:

```javascript
// Custom message as second argument
await expect(page.getByRole('button'), 'Submit button should be visible').toBeVisible();

// Useful for debugging
await expect(
  page.getByTestId('cart-count'),
  'Cart count should update after adding item'
).toHaveText('1');
```

## Polling Assertions

Use `expect.poll()` to repeatedly execute a function until an assertion passes:

```javascript
// Poll an async function
await expect.poll(async () => {
  const response = await page.request.get('/api/status');
  return response.status();
}).toBe(200);

// Custom polling interval and timeout
await expect.poll(async () => {
  return await page.textContent('.counter');
}, {
  intervals: [100, 250, 500], // Wait intervals in ms
  timeout: 5000
}).toBe('Completed');

// Poll synchronous value
await expect.poll(() => {
  return someValue;
}).toBeGreaterThan(10);
```

**Use cases:**
- API polling
- Waiting for background processes
- Custom async conditions

## Configuring Timeouts

### Global Configuration

Set default timeout in `playwright.config.ts`:

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    timeout: 10000 // 10 seconds for all assertions
  }
});
```

### Per-Test Configuration

```javascript
test.use({
  expect: { timeout: 15000 }
});

test('slow test', async ({ page }) => {
  // All assertions use 15 second timeout
  await expect(page.getByText('Slow content')).toBeVisible();
});
```

### Per-Assertion Timeout

```javascript
// Override timeout for specific assertion
await expect(page.getByText('Slow loading')).toBeVisible({ timeout: 30000 });

// Reduce timeout for fast operations
await expect(page.getByText('Cached data')).toBeVisible({ timeout: 1000 });
```

## Custom Matchers

Extend Playwright's assertions with custom matchers:

```javascript
import { expect as baseExpect } from '@playwright/test';

export const expect = baseExpect.extend({
  async toHaveValidEmail(locator: Locator) {
    const value = await locator.inputValue();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(value);

    return {
      message: () => `Expected ${value} to be a valid email`,
      pass
    };
  }
});

// Usage
await expect(page.getByLabel('Email')).toHaveValidEmail();
```

## Best Practices

### 1. Use Auto-Retrying Assertions

```javascript
// ✅ GOOD - Auto-retrying
await expect(page.getByText('Success')).toBeVisible();

// ❌ BAD - Manual waiting
await page.waitForTimeout(1000);
const isVisible = await page.getByText('Success').isVisible();
expect(isVisible).toBe(true);
```

### 2. Be Specific with Locators

```javascript
// ✅ GOOD - Specific locator
await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();

// ❌ BAD - Generic locator
await expect(page.locator('button')).toBeEnabled();
```

### 3. Assert User-Visible State

```javascript
// ✅ GOOD - Tests what user sees
await expect(page.getByRole('alert')).toContainText('Success');

// ❌ BAD - Tests implementation details
expect(await page.getAttribute('.alert', 'data-status')).toBe('success');
```

### 4. Use Appropriate Assertion Types

```javascript
// ✅ GOOD - Use toContainText for partial match
await expect(page.getByTestId('message')).toContainText('successful');

// ❌ BAD - Exact match too brittle
await expect(page.getByTestId('message')).toHaveText('Operation completed successfully at 10:30 AM');
```

### 5. Avoid Over-Asserting

```javascript
// ✅ GOOD - Assert what matters
await expect(page.getByRole('heading')).toBeVisible();

// ❌ BAD - Unnecessary detailed assertions
await expect(page.getByRole('heading')).toBeVisible();
await expect(page.getByRole('heading')).toBeAttached();
await expect(page.getByRole('heading')).toBeInViewport();
await expect(page.getByRole('heading')).toBeEnabled();
```

### 6. Group Related Assertions

```javascript
// ✅ GOOD - Logical grouping
test('login form validation', async ({ page }) => {
  // Arrange
  await page.goto('/login');

  // Act
  await page.getByRole('button', { name: 'Login' }).click();

  // Assert
  await expect(page.getByText('Email is required')).toBeVisible();
  await expect(page.getByText('Password is required')).toBeVisible();
  await expect(page).toHaveURL('/login');
});
```

## Common Patterns

### Form Validation

```javascript
test('validates registration form', async ({ page }) => {
  await page.goto('/register');

  // Submit empty form
  await page.getByRole('button', { name: 'Register' }).click();

  // Verify error messages
  await expect(page.getByText('Name is required')).toBeVisible();
  await expect(page.getByText('Email is required')).toBeVisible();

  // Fill form with invalid data
  await page.getByLabel('Email').fill('invalid-email');
  await page.getByRole('button', { name: 'Register' }).click();

  // Verify validation error
  await expect(page.getByText('Invalid email format')).toBeVisible();
});
```

### Loading States

```javascript
test('handles loading state', async ({ page }) => {
  await page.goto('/dashboard');

  // Loading indicator appears
  await expect(page.getByText('Loading...')).toBeVisible();

  // Content loads
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // Loading indicator disappears
  await expect(page.getByText('Loading...')).not.toBeVisible();
});
```

### Dynamic Content

```javascript
test('updates cart count', async ({ page }) => {
  await page.goto('/products');

  // Initial state
  await expect(page.getByTestId('cart-count')).toHaveText('0');

  // Add item
  await page.getByRole('button', { name: 'Add to cart' }).first().click();

  // Verify update
  await expect(page.getByTestId('cart-count')).toHaveText('1');
  await expect(page.getByRole('alert')).toContainText('Item added');
});
```

### Navigation

```javascript
test('navigates through pages', async ({ page }) => {
  await page.goto('/');

  // Click navigation link
  await page.getByRole('link', { name: 'Products' }).click();

  // Verify navigation
  await expect(page).toHaveURL(/\/products/);
  await expect(page).toHaveTitle(/Products/);
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
});
```

### API Response Validation

```javascript
test('validates API response', async ({ page }) => {
  const response = await page.request.get('/api/users');

  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(data).toHaveProperty('users');
  expect(data.users).toHaveLength(10);
});
```

### Multiple Elements

```javascript
test('verifies list items', async ({ page }) => {
  await page.goto('/todos');

  // Count items
  await expect(page.getByRole('listitem')).toHaveCount(5);

  // Verify all text content
  await expect(page.getByRole('listitem')).toHaveText([
    'Buy groceries',
    'Walk the dog',
    'Read a book',
    'Write code',
    'Exercise'
  ]);

  // Check first item
  await expect(page.getByRole('listitem').first()).toContainText('Buy groceries');
});
```

## Debugging Failed Assertions

### 1. Use Custom Messages

```javascript
await expect(
  page.getByRole('button', { name: 'Submit' }),
  'Submit button should be enabled after form is filled'
).toBeEnabled();
```

### 2. Check Element State

```javascript
const button = page.getByRole('button', { name: 'Submit' });

// Debug: Log element state
console.log('Is visible:', await button.isVisible());
console.log('Is enabled:', await button.isEnabled());
console.log('Text:', await button.textContent());

await expect(button).toBeEnabled();
```

### 3. Take Screenshots on Failure

Configured in `playwright.config.ts`:

```javascript
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  }
});
```

### 4. Use Playwright Inspector

```bash
# Run with inspector
npx playwright test --debug

# Pause on specific test
await page.pause();
```

## Summary

- **Auto-retrying assertions** eliminate timing issues and reduce flakiness
- Use **specific locators** to make assertions clear and maintainable
- **Soft assertions** collect multiple failures for comprehensive validation
- **Custom timeouts** handle slow operations gracefully
- **Negation with `.not`** tests opposite conditions
- **Polling** handles complex async scenarios
- Focus on **user-visible behavior** rather than implementation details
- Use **custom messages** to make failures easier to debug

## Next Steps

In the next module, we'll explore:
- Advanced testing patterns
- Handling complex interactions
- Performance testing
- Accessibility testing
