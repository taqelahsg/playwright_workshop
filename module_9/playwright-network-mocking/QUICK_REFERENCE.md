# Network Mocking Quick Reference

Quick reference guide for Playwright network mocking patterns.

## 🎯 Basic Patterns

### Block Requests

```typescript
// Block by resource type
await page.route('**/*', route => {
  if (route.request().resourceType() === 'image') {
    return route.abort();
  }
  return route.continue();
});

// Block by URL pattern
await page.route(/\.(png|jpg|jpeg)$/, route => route.abort());

// Block specific domain
await page.route('**/*', route => {
  if (route.request().url().includes('google-analytics.com')) {
    return route.abort();
  }
  return route.continue();
});
```

### Mock Responses

```typescript
// Simple mock
await page.route('**/api/items', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Item' }])
  });
});

// Mock error
await page.route('**/api/items', route => {
  route.fulfill({
    status: 404,
    body: JSON.stringify({ error: 'Not found' })
  });
});

// Dynamic mock
await page.route('**/api/items/**', route => {
  const id = route.request().url().split('/').pop();
  route.fulfill({
    status: 200,
    body: JSON.stringify({ id, name: `Item ${id}` })
  });
});
```

### Modify Requests

```typescript
// Add headers
await page.route('**/api/**', async route => {
  await route.continue({
    headers: {
      ...route.request().headers(),
      'Authorization': 'Bearer token'
    }
  });
});

// Modify body
await page.route('**/api/items', async route => {
  if (route.request().method() === 'POST') {
    const data = route.request().postDataJSON();
    await route.continue({
      postData: JSON.stringify({
        ...data,
        modified: true
      })
    });
  } else {
    await route.continue();
  }
});
```

### Modify Responses

```typescript
// Fetch and modify
await page.route('**/api/items', async route => {
  const response = await route.fetch();
  const json = await response.json();

  json.forEach(item => item.mocked = true);

  await route.fulfill({
    response,
    body: JSON.stringify(json)
  });
});

// Add delay
await page.route('**/api/items', async route => {
  await page.waitForTimeout(2000);
  await route.fulfill({
    status: 200,
    body: '[]'
  });
});
```

## 📊 Monitoring

### Listen to Events

```typescript
// Log requests
page.on('request', request => {
  console.log('>>', request.method(), request.url());
});

// Log responses
page.on('response', response => {
  console.log('<<', response.status(), response.url());
});

// Failed requests
page.on('requestfailed', request => {
  console.log('Failed:', request.url());
});
```

### Wait for Responses

```typescript
// Wait for specific URL
const response = await page.waitForResponse('**/api/items');

// Wait with predicate
const response = await page.waitForResponse(
  resp => resp.url().includes('/api/') && resp.status() === 200
);

// Wait for multiple
const [r1, r2] = await Promise.all([
  page.waitForResponse('**/api/items'),
  page.waitForResponse('**/api/users'),
  page.click('button')
]);
```

## 🎨 URL Pattern Matching

```typescript
// Glob patterns
'**/api/items'              // Exact path
'**/api/**'                 // Any API path
'**/*.{png,jpg,jpeg}'       // Multiple extensions
'https://api.example.com/**' // Specific domain

// Regular expressions
/\/api\/items\/\d+/         // Items with numbers
/\.(css|js)$/               // CSS or JS files
/(google-analytics|facebook)/ // Multiple domains

// Predicate functions
url => url.pathname.includes('api')
url => url.hostname === 'api.example.com'
```

## 🔧 Common Scenarios

### Test Error Handling

```typescript
// 404 Not Found
await page.route('**/api/items/999', route => {
  route.fulfill({ status: 404, body: JSON.stringify({ error: 'Not found' }) });
});

// 500 Server Error
await page.route('**/api/items', route => {
  route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) });
});

// Network failure
await page.route('**/api/items', route => route.abort('failed'));
```

### Test Loading States

```typescript
await page.route('**/api/items', async route => {
  await page.waitForTimeout(2000); // 2s delay
  await route.fulfill({ status: 200, body: '[]' });
});

// Verify loading indicator appears
await expect(page.getByTestId('loading')).toBeVisible();
```

### Test Authentication

```typescript
// Mock login
await page.route('**/api/login', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({
      token: 'mock-token',
      user: { id: 1, email: 'test@example.com' }
    })
  });
});

// Add auth to all requests
await page.route('**/api/**', async route => {
  await route.continue({
    headers: {
      ...route.request().headers(),
      'Authorization': 'Bearer mock-token'
    }
  });
});
```

### Test Pagination

```typescript
await page.route('**/api/items*', route => {
  const url = new URL(route.request().url());
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 10;

  const items = Array.from({ length: limit }, (_, i) => ({
    id: (page - 1) * limit + i + 1,
    name: `Item ${(page - 1) * limit + i + 1}`
  }));

  route.fulfill({
    status: 200,
    body: JSON.stringify({ items, page, total: 50 })
  });
});
```

### Stateful Mock (CRUD)

```typescript
let items = [{ id: 1, name: 'Item 1' }];
let nextId = 2;

await page.route('**/api/items', route => {
  if (route.request().method() === 'GET') {
    route.fulfill({ status: 200, body: JSON.stringify(items) });
  } else if (route.request().method() === 'POST') {
    const newItem = { ...route.request().postDataJSON(), id: nextId++ };
    items.push(newItem);
    route.fulfill({ status: 201, body: JSON.stringify(newItem) });
  }
});

await page.route('**/api/items/**', route => {
  const id = parseInt(route.request().url().split('/').pop());

  if (route.request().method() === 'DELETE') {
    items = items.filter(i => i.id !== id);
    route.fulfill({ status: 200, body: '{}' });
  }
});
```

## 🚀 Performance Optimization

### Speed Up Tests

```typescript
// Block unnecessary resources
await page.route('**/*', route => {
  const type = route.request().resourceType();
  if (['image', 'stylesheet', 'font', 'media'].includes(type)) {
    return route.abort();
  }
  return route.continue();
});

// Block analytics
await page.route('**/*', route => {
  const url = route.request().url();
  if (/(google-analytics|facebook|doubleclick)/.test(url)) {
    return route.abort();
  }
  return route.continue();
});
```

### Measure Performance

```typescript
const responseTimes: number[] = [];

page.on('response', response => {
  const timing = response.request().timing();
  if (timing && response.url().includes('/api/')) {
    responseTimes.push(timing.responseEnd);
  }
});

await page.goto('https://example.com');

const avg = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
console.log(`Avg response time: ${avg.toFixed(2)}ms`);
expect(avg).toBeLessThan(1000);
```

## 🎭 Advanced Patterns

### Conditional Mocking

```typescript
const useMocks = process.env.USE_MOCKS === 'true';

if (useMocks) {
  await page.route('**/api/items', route => {
    route.fulfill({ status: 200, body: JSON.stringify([]) });
  });
}
```

### Fallback to Real API

```typescript
await page.route('**/api/items/**', async route => {
  const id = route.request().url().split('/').pop();

  if (id === '1' || id === '2') {
    // Mock specific IDs
    route.fulfill({ status: 200, body: JSON.stringify({ id }) });
  } else {
    // Let others go to real API
    await route.continue();
  }
});
```

### Request Counter

```typescript
let requestCount = 0;

await page.route('**/api/items', route => {
  requestCount++;
  route.fulfill({
    status: 200,
    body: JSON.stringify({ requestNumber: requestCount })
  });
});
```

### Rotating Responses

```typescript
let callCount = 0;
const responses = [
  [{ id: 1, name: 'Response 1' }],
  [{ id: 2, name: 'Response 2' }],
  [{ id: 3, name: 'Response 3' }]
];

await page.route('**/api/items', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify(responses[callCount++ % responses.length])
  });
});
```

## 🐛 Troubleshooting

### Service Workers

If routes aren't working, Service Workers might be intercepting requests:

```typescript
// In playwright.config.ts
export default defineConfig({
  use: {
    serviceWorkers: 'block',
  }
});
```

### Route Not Matching

```typescript
// Debug route matching
await page.route('**/*', route => {
  console.log('Intercepted:', route.request().url());
  route.continue();
});
```

### Check Request Details

```typescript
page.on('request', request => {
  console.log('Method:', request.method());
  console.log('URL:', request.url());
  console.log('Headers:', request.headers());
  console.log('Body:', request.postData());
});
```

## 📚 Resource Types

Available resource types for filtering:
- `document` - HTML documents
- `stylesheet` - CSS files
- `image` - Images
- `media` - Audio/video
- `font` - Web fonts
- `script` - JavaScript
- `texttrack` - Text tracks
- `xhr` - XMLHttpRequest
- `fetch` - Fetch API
- `eventsource` - Server-sent events
- `websocket` - WebSocket connections
- `manifest` - Web app manifests
- `other` - Other types

## 🎯 Best Practices

1. **Mock at the right level** - Be specific with URL patterns
2. **Keep mock data realistic** - Include all expected fields
3. **Test both mocked and real** - Use mocks for speed, real APIs for integration
4. **Clean routes automatically** - They clean up after each test
5. **Use helper functions** - Create reusable mocking utilities
6. **Document your mocks** - Explain why you're mocking
7. **Test error scenarios** - Don't just test happy paths
8. **Monitor performance** - Track response times
9. **Validate requests** - Check that correct requests are made
10. **Use realistic delays** - Don't make tests too slow

---

**For full examples, see the test files in the `tests/` directory!**
