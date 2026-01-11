# Locator Strategies in Playwright

## Introduction

Locators are the foundation of Playwright test automation. They represent a way to find element(s) on the page at any moment. Playwright's locators come with **auto-waiting** and **retry-ability** built-in, making tests more reliable and resilient.

## Key Concept: How Locators Work

Every time a locator is used for an action, Playwright finds an up-to-date DOM element in the page. This means:
- Locators handle dynamic content automatically
- Elements can re-render and locators will still work
- No need to worry about stale element references

## Recommended Locator Types (Priority Order)

Playwright recommends using locators that reflect how users interact with the page:

### 1. Role Locators - `page.getByRole()`

Role locators reflect how users and assistive technology perceive the page, following W3C ARIA specifications.

```javascript
// Locate a button by its role and name
await page.getByRole('button', { name: 'Submit' }).click();

// Locate a heading
await page.getByRole('heading', { name: 'Welcome' });

// Locate a checkbox
await page.getByRole('checkbox', { name: 'Accept terms' }).check();

// Locate a link
await page.getByRole('link', { name: 'Learn more' }).click();
```

**Supported roles:** button, checkbox, heading, link, list, listitem, table, row, cell, and many more.

### 2. Text Locators - `page.getByText()`

Locates elements by their visible text content.

```javascript
// Exact text match
await page.getByText('Welcome back');

// Partial text match with regex
await page.getByText(/welcome/i);

// Click element containing text
await page.getByText('Click here').click();
```

### 3. Label Locators - `page.getByLabel()`

Finds form controls by their associated label text.

```javascript
// Locate input by label
await page.getByLabel('Email address').fill('test@example.com');

// Locate and interact with form fields
await page.getByLabel('Password').fill('secret123');
await page.getByLabel('Remember me').check();
```

### 4. Placeholder Locators - `page.getByPlaceholder()`

Targets input elements with placeholder text.

```javascript
// Locate by placeholder
await page.getByPlaceholder('Enter your email').fill('user@test.com');

// Search input example
await page.getByPlaceholder('Search...').fill('playwright');
```

### 5. Alt Text Locators - `page.getByAltText()`

Identifies images by their alternative text.

```javascript
// Locate image by alt text
await page.getByAltText('Company logo').click();

// Verify image is visible
await expect(page.getByAltText('Profile picture')).toBeVisible();
```

### 6. Title Locators - `page.getByTitle()`

Uses the title attribute for matching.

```javascript
// Locate by title attribute
await page.getByTitle('Close dialog').click();

// Hover over element with title
await page.getByTitle('More information').hover();
```

### 7. Test ID Locators - `page.getByTestId()`

Queries elements by `data-testid` attribute (customizable).

```javascript
// Locate by test ID
await page.getByTestId('submit-button').click();

// Best for elements without clear user-facing attributes
await page.getByTestId('cart-item-count').textContent();
```

**Note:** You can customize the test ID attribute in `playwright.config.ts`:

```javascript
export default defineConfig({
  use: {
    testIdAttribute: 'data-test-id' // Use custom attribute
  }
});
```

## CSS and XPath Locators - `page.locator()`

The `page.locator()` method accepts CSS selectors or XPath expressions.

```javascript
// CSS selector
await page.locator('.submit-button').click();
await page.locator('#username').fill('testuser');

// XPath (not recommended)
await page.locator('//button[@type="submit"]').click();
```

**Warning:** CSS and XPath are **NOT recommended** as they create brittle tests. The DOM structure can change frequently, leading to test failures. Use them only as a last resort.

## Advanced Locator Features

### Chaining Locators

Narrow down searches by chaining locators:

```javascript
// Find button within a specific section
const product = page.getByRole('article').filter({ hasText: 'Product 1' });
await product.getByRole('button', { name: 'Add to cart' }).click();
```

### Filtering Locators

**Filter by text:**
```javascript
// Has specific text
await page.getByRole('listitem').filter({ hasText: 'Active' });

// Does NOT have specific text
await page.getByRole('listitem').filter({ hasNotText: 'Completed' });
```

**Filter by child elements:**
```javascript
// Has a specific child element
await page.getByRole('listitem').filter({
  has: page.getByRole('button', { name: 'Delete' })
});

// Does NOT have a specific child
await page.getByRole('listitem').filter({
  hasNot: page.getByRole('button', { name: 'Delete' })
});
```

### Combining Locators

**AND operator** - Match multiple criteria:
```javascript
const button = page.getByRole('button').and(page.getByTitle('Subscribe'));
await button.click();
```

**OR operator** - Match alternative locators:
```javascript
const newEmail = page.getByRole('button', { name: 'New' })
  .or(page.getByRole('button', { name: 'New email' }));
await newEmail.click();
```

### Working with Lists

**Count items:**
```javascript
await expect(page.getByRole('listitem')).toHaveCount(5);
```

**Assert all text:**
```javascript
await expect(page.getByRole('listitem')).toHaveText([
  'Item 1',
  'Item 2',
  'Item 3'
]);
```

**Select specific items:**
```javascript
// First item
await page.getByRole('listitem').first().click();

// Last item
await page.getByRole('listitem').last().click();

// Nth item (zero-indexed)
await page.getByRole('listitem').nth(2).click();
```

**Warning:** Avoid positional selectors like `.nth()` when possible, as they break when the DOM order changes.

## Locator Strictness

Playwright locators enforce **strictness** by default:
- Actions like `.click()` throw an error if the locator matches multiple elements
- Multi-element operations like `.count()` work fine with multiple matches
- Use `.first()`, `.last()`, or `.nth()` to explicitly select from multiple matches

```javascript
// This throws if multiple buttons match
await page.getByRole('button').click(); // Error: strict mode violation

// This works - explicitly selecting first
await page.getByRole('button').first().click();

// This works - counting multiple matches
const count = await page.getByRole('button').count();
```

## Shadow DOM Support

All Playwright locators work with Shadow DOM by default, **except**:
- XPath (doesn't pierce shadow roots)
- Closed-mode shadow roots

## Best Practices

1. **Prioritize user-facing locators**: Use role, text, and label locators before test IDs
2. **Avoid positional selectors**: Methods like `.nth()` are fragile and break with DOM changes
3. **Use test IDs sparingly**: Only when role/text identification isn't feasible
4. **Avoid CSS and XPath**: They create brittle tests that break with DOM changes
5. **Leverage filtering**: Use `.filter()` to narrow down matches without complex selectors
6. **Chain locators**: Combine locators to create precise, readable queries
7. **Test accessibility**: Role-based locators encourage accessible markup

## Common Patterns

### Login Form
```javascript
await page.getByLabel('Username').fill('admin');
await page.getByLabel('Password').fill('password123');
await page.getByRole('button', { name: 'Log in' }).click();
```

### Navigation
```javascript
await page.getByRole('link', { name: 'Products' }).click();
await expect(page.getByRole('heading', { name: 'Our Products' })).toBeVisible();
```

### Forms with Multiple Fields
```javascript
await page.getByLabel('First name').fill('John');
await page.getByLabel('Last name').fill('Doe');
await page.getByLabel('Email').fill('john.doe@example.com');
await page.getByRole('checkbox', { name: 'Subscribe to newsletter' }).check();
await page.getByRole('button', { name: 'Submit' }).click();
```

### Dynamic Content
```javascript
// Locate product card and interact with it
const product = page.getByRole('article').filter({ hasText: 'Laptop' });
await product.getByRole('button', { name: 'Add to cart' }).click();

// Verify cart count updated
await expect(page.getByTestId('cart-count')).toHaveText('1');
```

## Summary

- Locators are resilient and auto-wait for elements
- Prioritize user-facing attributes (role, text, label)
- Avoid brittle selectors (CSS, XPath)
- Use filtering and chaining for precision
- Leverage strictness to catch ambiguous locators early
- Write tests that reflect how users interact with your application

## Next Steps

In the next module, we'll explore:
- Advanced locator techniques
- Handling complex UI patterns
- Custom locator strategies
- Performance optimization with locators
