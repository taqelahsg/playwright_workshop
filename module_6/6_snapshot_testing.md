# Lesson 3: Snapshot Testing with toMatchSnapshot()

## Overview

While `toHaveScreenshot()` compares images, `toMatchSnapshot()` compares any serializable data. This is useful for testing API responses, page structure, computed values, and more.

## Basic Data Snapshots

### Object Snapshots

```typescript
test('API response snapshot', async ({ request }) => {
  const response = await request.get('https://api.example.com/user/1');
  const data = await response.json();

  // Compare entire response
  expect(data).toMatchSnapshot('user-response.json');
});
```

### Array Snapshots

```typescript
test('navigation links snapshot', async ({ page }) => {
  await page.goto('/');

  const links = await page.locator('nav a').allTextContents();

  expect(links).toMatchSnapshot('nav-links.json');
});
```

## Handling Dynamic Values

### Removing Dynamic Fields

```typescript
test('user data without timestamps', async ({ request }) => {
  const response = await request.get('/api/user/1');
  const data = await response.json();

  // Remove dynamic fields before snapshot
  delete data.createdAt;
  delete data.updatedAt;
  delete data.id;

  expect(data).toMatchSnapshot('user-static-fields.json');
});
```

### Partial Matching

```typescript
test('response structure', async ({ request }) => {
  const response = await request.get('/api/products');
  const data = await response.json();

  // Snapshot only structure, not values
  const structure = data.map(item => ({
    hasName: typeof item.name === 'string',
    hasPrice: typeof item.price === 'number',
    hasId: typeof item.id !== 'undefined',
  }));

  expect(structure).toMatchSnapshot('products-structure.json');
});
```

## Page Structure Snapshots

### HTML Structure

```typescript
test('form structure', async ({ page }) => {
  await page.goto('/contact');

  const formHTML = await page.locator('form').innerHTML();

  // Normalize whitespace
  const normalized = formHTML.replace(/\s+/g, ' ').trim();

  expect(normalized).toMatchSnapshot('contact-form.txt');
});
```

### Accessibility Tree

```typescript
test('accessibility tree', async ({ page }) => {
  await page.goto('/');

  const snapshot = await page.accessibility.snapshot();

  expect(snapshot).toMatchSnapshot('a11y-tree.json');
});
```

### Computed Styles

```typescript
test('button styles snapshot', async ({ page }) => {
  await page.goto('/');

  const button = page.getByRole('button').first();

  const styles = await button.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      backgroundColor: computed.backgroundColor,
      color: computed.color,
      fontSize: computed.fontSize,
      padding: computed.padding,
      borderRadius: computed.borderRadius,
    };
  });

  expect(styles).toMatchSnapshot('primary-button-styles.json');
});
```

## Text Snapshots

### Plain Text

```typescript
test('error message text', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'invalid');
  await page.click('button[type="submit"]');

  const errorText = await page.locator('.error').textContent();

  expect(errorText).toMatchSnapshot('login-error.txt');
});
```

### Multi-line Content

```typescript
test('terms of service', async ({ page }) => {
  await page.goto('/terms');

  const content = await page.locator('article').textContent();

  expect(content).toMatchSnapshot('terms-content.txt');
});
```

## API Response Testing

### Full Response Snapshot

```typescript
test.describe('API Snapshots', () => {
  test('GET /users', async ({ request }) => {
    const response = await request.get('/api/users');
    const data = await response.json();

    // Remove dynamic fields from each user
    const sanitized = data.map(({ id, createdAt, ...user }) => user);

    expect(sanitized).toMatchSnapshot('users-list.json');
  });

  test('GET /products with pagination', async ({ request }) => {
    const response = await request.get('/api/products?page=1&limit=10');
    const data = await response.json();

    // Snapshot pagination structure
    expect({
      totalItems: typeof data.total,
      itemsPerPage: data.limit,
      hasItems: data.items.length > 0,
    }).toMatchSnapshot('products-pagination.json');
  });
});
```

## Configuration

### Custom Serializer

```typescript
// playwright.config.ts
export default defineConfig({
  expect: {
    toMatchSnapshot: {
      // Custom threshold for text diffs
      maxDiffPixelRatio: 0.1,
    },
  },
});
```

### Snapshot Directory

```typescript
export default defineConfig({
  snapshotDir: './snapshots',
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
});
```

## Snapshot File Structure

```
tests/
├── api.spec.ts
├── api.spec.ts-snapshots/
│   ├── users-list.json
│   └── products-pagination.json
├── ui.spec.ts
└── ui.spec.ts-snapshots/
    ├── nav-links.json
    └── primary-button-styles.json
```

## Updating Snapshots

```bash
# Update all snapshots
npx playwright test --update-snapshots

# Update specific test
npx playwright test api.spec.ts --update-snapshots

# Update with grep
npx playwright test --grep "API" --update-snapshots
```

## Best Practices

### 1. Remove Dynamic Data

```typescript
// Good - predictable snapshot
const sanitized = {
  name: data.name,
  email: data.email,
  role: data.role,
};
expect(sanitized).toMatchSnapshot();

// Bad - will fail on every run
expect(data).toMatchSnapshot();  // includes timestamps, IDs
```

### 2. Use Descriptive Names

```typescript
// Good
expect(data).toMatchSnapshot('user-profile-response.json');

// Bad
expect(data).toMatchSnapshot();  // auto-generated name
```

### 3. Keep Snapshots Small and Focused

```typescript
// Good - focused on what matters
expect({
  status: response.status,
  hasData: data.items.length > 0,
}).toMatchSnapshot();

// Bad - too large, hard to review
expect(entirePageContent).toMatchSnapshot();
```

### 4. Review Snapshot Changes

Always review snapshot changes in code review:

```diff
// users-list.json
{
-  "name": "John Doe",
+  "name": "John Smith",
   "email": "john@example.com"
}
```

## Common Use Cases

| Use Case | What to Snapshot |
|----------|------------------|
| API contracts | Response structure |
| Navigation | Link text and order |
| Forms | Field names and types |
| Error messages | Error text content |
| SEO | Meta tags and titles |
| Computed styles | Key CSS properties |

## Next Steps

In the next lesson, we'll cover best practices for integrating visual testing into CI/CD pipelines.
