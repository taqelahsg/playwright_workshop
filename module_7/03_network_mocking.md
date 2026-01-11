# Network Mocking and Interception

## What is Network Mocking?

**Network mocking** (also called network interception) is the ability to intercept, monitor, and modify network traffic between your application and servers. Instead of making actual HTTP requests to real APIs, you can:

- **Mock API responses** - Return fake data without calling real APIs
- **Block requests** - Prevent certain requests from being made
- **Modify requests** - Change headers, methods, or payloads before they're sent
- **Modify responses** - Alter the data returned from APIs
- **Monitor traffic** - Track all network activity for debugging

Playwright provides powerful APIs to monitor and modify **all browser network traffic**, including HTTP, HTTPS, XHR, and fetch requests.

## Why Use Network Mocking?

### 1. **Faster Test Execution**
- No waiting for real API responses
- No network latency
- Tests run in milliseconds instead of seconds

### 2. **Test Reliability**
- No dependency on external services
- Tests work offline
- No API rate limiting or downtime issues
- Consistent test results

### 3. **Test Edge Cases**
- Simulate API errors (500, 503, etc.)
- Test timeout scenarios
- Validate error handling
- Test with specific data patterns

### 4. **Data Control**
- Use predictable test data
- Test with edge case data (empty arrays, null values, etc.)
- Avoid polluting production/staging databases
- No cleanup required

### 5. **Security Testing**
- Test authentication failures
- Simulate unauthorized access (403)
- Test missing tokens
- Validate security error handling

### 6. **Isolation**
- Test frontend independently from backend
- Continue testing even if backend is down
- Parallel test execution without conflicts

## Network Mocking Fundamentals

### Basic Route Setup

Routes can be defined at two levels:

```typescript
// Page-level route (affects single page only)
await page.route('**/api/items', route => {
  route.fulfill({ status: 200, body: '[]' });
});

// Context-level route (affects all pages in context)
await context.route('**/api/items', route => {
  route.fulfill({ status: 200, body: '[]' });
});
```

**When to use each:**
- **Page-level** - For test-specific mocking
- **Context-level** - For global mocking across multiple pages

### URL Pattern Matching

Playwright supports three types of URL matching:

```typescript
// 1. Glob patterns (simplified wildcards)
await page.route('**/api/items', handler);          // Exact path
await page.route('**/api/**', handler);              // Any path under /api/
await page.route('**/*.{png,jpg,jpeg}', handler);    // Multiple extensions
await page.route('https://api.example.com/**', handler); // Specific domain

// 2. Regular expressions
await page.route(/\/api\/items\/\d+/, handler);     // Items with numeric IDs
await page.route(/\.(css|js)$/, handler);            // CSS and JS files

// 3. Predicate functions
await page.route(url => url.pathname.includes('api'), handler);
await page.route(url => url.hostname === 'api.example.com', handler);
```

**Glob pattern syntax:**
- `*` - Matches any characters **except** `/`
- `**` - Matches any characters **including** `/`
- `{}` - Comma-separated alternatives
- `\` - Escape special characters

### Route Handler Actions

A route handler can perform three actions:

```typescript
await page.route('**/api/items', async route => {
  // 1. Continue - Let the request proceed (optionally modified)
  await route.continue();

  // 2. Fulfill - Return a mocked response
  await route.fulfill({ status: 200, body: '[]' });

  // 3. Abort - Block the request
  await route.abort();
});
```

## Blocking Requests

### Block by Resource Type

```typescript
test('Block images to speed up tests', async ({ page }) => {
  await page.route('**/*', route => {
    return route.request().resourceType() === 'image'
      ? route.abort()
      : route.continue();
  });

  await page.goto('https://example.com');
  // Images won't load
});
```

**Common resource types:**
- `document` - HTML pages
- `stylesheet` - CSS files
- `image` - Images (png, jpg, gif, etc.)
- `media` - Audio/video
- `font` - Web fonts
- `script` - JavaScript files
- `xhr` - XMLHttpRequest
- `fetch` - Fetch API requests

### Block by File Extension

```typescript
// Block all CSS files
await page.route(/\.css$/, route => route.abort());

// Block images
await page.route(/\.(png|jpg|jpeg|gif|svg)$/, route => route.abort());

// Block analytics and tracking
await page.route(/google-analytics|analytics\.js/, route => route.abort());
```

### Block Specific Domains

```typescript
test('Block third-party tracking', async ({ page }) => {
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url.includes('google-analytics.com') ||
        url.includes('facebook.com') ||
        url.includes('doubleclick.net')) {
      return route.abort();
    }
    return route.continue();
  });

  await page.goto('https://example.com');
});
```

## Mocking API Responses

### Basic Mock Response

```typescript
test('Mock empty items list', async ({ page }) => {
  await page.route('**/api/items', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });

  await page.goto('http://localhost:3000');
  // Page will receive empty array from API
});
```

### Mock with Test Data

```typescript
test('Mock items with test data', async ({ page }) => {
  const mockItems = [
    { id: 1, name: 'Laptop', price: 999.99, quantity: 5 },
    { id: 2, name: 'Mouse', price: 29.99, quantity: 20 },
    { id: 3, name: 'Keyboard', price: 79.99, quantity: 15 }
  ];

  await page.route('**/api/items', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockItems)
    });
  });

  await page.goto('http://localhost:3000');
  // Page will display these items
});
```

### Mock API Errors

```typescript
test('Mock 404 Not Found', async ({ page }) => {
  await page.route('**/api/items/999', route => {
    route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Item not found',
        message: 'Item with ID 999 does not exist'
      })
    });
  });

  await page.goto('http://localhost:3000/items/999');
  // Should display error message
});

test('Mock 500 Server Error', async ({ page }) => {
  await page.route('**/api/items', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'Database connection failed'
      })
    });
  });

  await page.goto('http://localhost:3000');
  // Should handle error gracefully
});

test('Mock 401 Unauthorized', async ({ page }) => {
  await page.route('**/api/protected', route => {
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Unauthorized',
        message: 'Authentication required'
      })
    });
  });

  await page.goto('http://localhost:3000/protected');
  // Should redirect to login
});
```

### Mock with Dynamic Responses

```typescript
test('Mock different responses based on request', async ({ page }) => {
  await page.route('**/api/items/**', route => {
    const url = route.request().url();
    const itemId = url.split('/').pop();

    if (itemId === '1') {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ id: 1, name: 'Laptop', price: 999.99 })
      });
    } else if (itemId === '2') {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ id: 2, name: 'Mouse', price: 29.99 })
      });
    } else {
      route.fulfill({
        status: 404,
        body: JSON.stringify({ error: 'Not found' })
      });
    }
  });

  await page.goto('http://localhost:3000/items/1');
  // Shows laptop
  await page.goto('http://localhost:3000/items/2');
  // Shows mouse
  await page.goto('http://localhost:3000/items/999');
  // Shows error
});
```

## Modifying Requests

### Modify Request Headers

```typescript
test('Add authentication header', async ({ page }) => {
  await page.route('**/api/**', async route => {
    await route.continue({
      headers: {
        ...route.request().headers(),
        'Authorization': 'Bearer fake-test-token',
        'X-Test-User': 'test@example.com'
      }
    });
  });

  await page.goto('http://localhost:3000');
});

test('Remove sensitive headers', async ({ page }) => {
  await page.route('**/api/**', async route => {
    const headers = route.request().headers();
    delete headers['X-Secret-Key'];
    delete headers['X-Internal-Token'];

    await route.continue({ headers });
  });

  await page.goto('http://localhost:3000');
});
```

### Modify Request Method

```typescript
test('Change GET to POST', async ({ page }) => {
  await page.route('**/api/items', route => {
    route.continue({ method: 'POST' });
  });

  await page.goto('http://localhost:3000');
});
```

### Modify Request Body

```typescript
test('Modify POST request data', async ({ page }) => {
  await page.route('**/api/items', async route => {
    const request = route.request();

    if (request.method() === 'POST') {
      const postData = request.postDataJSON();

      // Add or modify fields
      postData.modifiedBy = 'test-suite';
      postData.timestamp = new Date().toISOString();

      await route.continue({
        postData: JSON.stringify(postData)
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('http://localhost:3000');
});
```

## Modifying Responses

### Fetch and Modify Real Responses

```typescript
test('Modify response body', async ({ page }) => {
  await page.route('**/api/items', async route => {
    // Fetch the real response
    const response = await route.fetch();

    // Get response body as text
    let body = await response.text();

    // Modify the response
    body = body.replace('Laptop', 'Modified Laptop');

    // Return modified response
    await route.fulfill({
      response,
      body
    });
  });

  await page.goto('http://localhost:3000');
  // Will show "Modified Laptop" instead of "Laptop"
});

test('Add field to JSON response', async ({ page }) => {
  await page.route('**/api/items', async route => {
    const response = await route.fetch();
    const json = await response.json();

    // Add new field to each item
    json.forEach(item => {
      item.isMocked = true;
      item.mockedAt = new Date().toISOString();
    });

    await route.fulfill({
      response,
      body: JSON.stringify(json)
    });
  });

  await page.goto('http://localhost:3000');
});
```

### Modify Response Headers

```typescript
test('Add custom response headers', async ({ page }) => {
  await page.route('**/api/items', async route => {
    const response = await route.fetch();

    await route.fulfill({
      response,
      headers: {
        ...response.headers(),
        'X-Custom-Header': 'Mocked',
        'X-Mock-Time': new Date().toISOString()
      }
    });
  });

  await page.goto('http://localhost:3000');
});
```

### Simulate Slow Responses

```typescript
test('Add delay to response', async ({ page }) => {
  await page.route('**/api/items', async route => {
    // Wait 2 seconds before responding
    await new Promise(resolve => setTimeout(resolve, 2000));

    await route.fulfill({
      status: 200,
      body: JSON.stringify([])
    });
  });

  await page.goto('http://localhost:3000');
  // Loading state should be visible for 2 seconds
});
```

## Monitoring Network Traffic

### Listen to Network Events

```typescript
test('Monitor all requests', async ({ page }) => {
  // Listen to request events
  page.on('request', request => {
    console.log('>>', request.method(), request.url());
  });

  // Listen to response events
  page.on('response', response => {
    console.log('<<', response.status(), response.url());
  });

  await page.goto('http://localhost:3000');
  // Console will show all requests and responses
});

test('Track API calls', async ({ page }) => {
  const apiCalls = [];

  page.on('request', request => {
    if (request.url().includes('/api/')) {
      apiCalls.push({
        method: request.method(),
        url: request.url(),
        headers: request.headers(),
        postData: request.postData()
      });
    }
  });

  await page.goto('http://localhost:3000');

  console.log('Total API calls:', apiCalls.length);
  console.log('API calls:', apiCalls);
});
```

### Wait for Specific Requests

```typescript
test('Wait for API response', async ({ page }) => {
  // Start waiting for response before triggering the request
  const responsePromise = page.waitForResponse('**/api/items');

  await page.getByText('Load Items').click();

  // Wait for the response to complete
  const response = await responsePromise;

  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).toHaveLength(3);
});

test('Wait for multiple responses', async ({ page }) => {
  const [itemsResponse, usersResponse] = await Promise.all([
    page.waitForResponse('**/api/items'),
    page.waitForResponse('**/api/users'),
    page.getByText('Load Dashboard').click()
  ]);

  expect(itemsResponse.status()).toBe(200);
  expect(usersResponse.status()).toBe(200);
});

test('Wait with custom predicate', async ({ page }) => {
  const responsePromise = page.waitForResponse(
    response => response.url().includes('/api/') && response.status() === 200
  );

  await page.getByText('Submit').click();
  const response = await responsePromise;

  console.log('API call successful:', response.url());
});
```

### Assert Request Was Made

```typescript
test('Verify API was called', async ({ page }) => {
  let apiCalled = false;

  page.on('request', request => {
    if (request.url().includes('/api/items')) {
      apiCalled = true;
    }
  });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000); // Wait for async calls

  expect(apiCalled).toBeTruthy();
});
```

## WebSocket Mocking

### Monitor WebSocket Connections

```typescript
test('Monitor WebSocket messages', async ({ page }) => {
  page.on('websocket', ws => {
    console.log('WebSocket opened:', ws.url());

    ws.on('framesent', event => {
      console.log('Sent:', event.payload);
    });

    ws.on('framereceived', event => {
      console.log('Received:', event.payload);
    });

    ws.on('close', () => {
      console.log('WebSocket closed');
    });
  });

  await page.goto('http://localhost:3000/chat');
});
```

## Authentication Handling

### Mock Authentication Flow

```typescript
test('Mock login response', async ({ page }) => {
  await page.route('**/api/login', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'fake-jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User'
        }
      })
    });
  });

  await page.goto('http://localhost:3000/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Should be logged in with mocked response
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
});
```

### Add Auth Token to All Requests

```typescript
test('Add auth to all API calls', async ({ page }) => {
  await page.route('**/api/**', async route => {
    await route.continue({
      headers: {
        ...route.request().headers(),
        'Authorization': 'Bearer fake-test-token'
      }
    });
  });

  await page.goto('http://localhost:3000');
  // All API calls will include the token
});
```

## Advanced Patterns

### HAR (HTTP Archive) Recording and Replay

```typescript
// Record network traffic
test('Record HAR', async ({ page }) => {
  await page.routeFromHAR('./hars/example.har', {
    update: true, // Create/update HAR file
  });

  await page.goto('http://localhost:3000');
});

// Replay from HAR file
test('Replay from HAR', async ({ page }) => {
  await page.routeFromHAR('./hars/example.har', {
    url: '**/api/**', // Only mock API calls
  });

  await page.goto('http://localhost:3000');
  // All API calls will use recorded responses
});
```

### Conditional Mocking

```typescript
test('Mock only in certain conditions', async ({ page }) => {
  const useMocks = process.env.USE_MOCKS === 'true';

  if (useMocks) {
    await page.route('**/api/items', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([{ id: 1, name: 'Mocked Item' }])
      });
    });
  }

  await page.goto('http://localhost:3000');
});
```

### Mock Different Environments

```typescript
const API_RESPONSES = {
  development: {
    items: [{ id: 1, name: 'Dev Item' }]
  },
  staging: {
    items: [{ id: 1, name: 'Staging Item' }]
  },
  production: {
    items: [{ id: 1, name: 'Prod Item' }]
  }
};

test('Mock based on environment', async ({ page }) => {
  const env = process.env.NODE_ENV || 'development';

  await page.route('**/api/items', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(API_RESPONSES[env].items)
    });
  });

  await page.goto('http://localhost:3000');
});
```

### Count API Calls

```typescript
test('Ensure API called only once', async ({ page }) => {
  let callCount = 0;

  await page.route('**/api/items', route => {
    callCount++;
    route.fulfill({
      status: 200,
      body: JSON.stringify([])
    });
  });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  expect(callCount).toBe(1);
});
```

## Service Workers and MSW

If you're using Service Workers or Mock Service Worker (MSW) in your application, you may need to disable them for Playwright tests:

```typescript
// In playwright.config.ts
export default defineConfig({
  use: {
    serviceWorkers: 'block', // Disable service workers
  }
});
```

**Why?** Service Workers can intercept network requests before Playwright's routing, causing network events to be missing or routes to not work as expected.

## Best Practices

### 1. **Mock at the Right Level**

```typescript
// ✅ Good - Mock only what you need
test('Mock specific endpoint', async ({ page }) => {
  await page.route('**/api/items', handler);
  await page.goto('http://localhost:3000');
});

// ❌ Bad - Too broad, might break other functionality
test('Mock everything', async ({ page }) => {
  await page.route('**/*', handler);
  await page.goto('http://localhost:3000');
});
```

### 2. **Keep Mock Data Realistic**

```typescript
// ✅ Good - Realistic test data
const mockItem = {
  id: 123,
  name: 'Laptop',
  price: 999.99,
  quantity: 5,
  created_at: '2026-01-09T10:00:00Z',
  updated_at: '2026-01-09T10:00:00Z'
};

// ❌ Bad - Minimal data might miss validation issues
const mockItem = {
  id: 1,
  name: 'Item'
};
```

### 3. **Test Both Mocked and Real APIs**

```typescript
// Mock for fast UI tests
test('UI with mocked data', async ({ page }) => {
  await page.route('**/api/items', route => {
    route.fulfill({ status: 200, body: '[]' });
  });
  await page.goto('http://localhost:3000');
});

// Real API for integration tests
test('Real API integration', async ({ request }) => {
  const response = await request.get('http://localhost:8080/api/items');
  expect(response.status()).toBe(200);
});
```

### 4. **Clean Up Routes**

```typescript
test('Isolated route mocking', async ({ page }) => {
  // Route only affects this test
  await page.route('**/api/items', route => {
    route.fulfill({ status: 200, body: '[]' });
  });

  await page.goto('http://localhost:3000');
  // Route is automatically cleaned up after test
});
```

### 5. **Use Helper Functions**

```typescript
// helpers/mockApi.ts
export async function mockEmptyItems(page) {
  await page.route('**/api/items', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });
}

export async function mockItemsWithData(page, items) {
  await page.route('**/api/items', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(items)
    });
  });
}

// In tests
import { mockEmptyItems, mockItemsWithData } from './helpers/mockApi';

test('Test with empty items', async ({ page }) => {
  await mockEmptyItems(page);
  await page.goto('http://localhost:3000');
});

test('Test with items', async ({ page }) => {
  await mockItemsWithData(page, [
    { id: 1, name: 'Laptop', price: 999 }
  ]);
  await page.goto('http://localhost:3000');
});
```

### 6. **Document Why You're Mocking**

```typescript
test('Handle API timeout gracefully', async ({ page }) => {
  // Mock slow API to test loading state and timeout handling
  await page.route('**/api/items', async route => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await route.fulfill({ status: 200, body: '[]' });
  });

  await page.goto('http://localhost:3000');

  // Should show loading state, then timeout message
  await expect(page.getByText('Loading...')).toBeVisible();
  await expect(page.getByText('Request timed out')).toBeVisible({ timeout: 6000 });
});
```

## Common Use Cases

### 1. **Testing Error Handling**

```typescript
test.describe('Error handling', () => {
  test('Handle 404 error', async ({ page }) => {
    await page.route('**/api/items/**', route => {
      route.fulfill({ status: 404, body: JSON.stringify({ error: 'Not found' }) });
    });

    await page.goto('http://localhost:3000/items/999');
    await expect(page.getByText('Item not found')).toBeVisible();
  });

  test('Handle 500 error', async ({ page }) => {
    await page.route('**/api/items', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) });
    });

    await page.goto('http://localhost:3000');
    await expect(page.getByText('Something went wrong')).toBeVisible();
  });

  test('Handle network failure', async ({ page }) => {
    await page.route('**/api/items', route => route.abort('failed'));

    await page.goto('http://localhost:3000');
    await expect(page.getByText('Network error')).toBeVisible();
  });
});
```

### 2. **Testing Loading States**

```typescript
test('Show loading indicator during API call', async ({ page }) => {
  await page.route('**/api/items', async route => {
    // Delay response to ensure loading state is visible
    await page.waitForTimeout(1000);
    await route.fulfill({ status: 200, body: '[]' });
  });

  await page.goto('http://localhost:3000');

  // Loading indicator should appear
  await expect(page.getByTestId('loading-spinner')).toBeVisible();

  // Then disappear when data loads
  await expect(page.getByTestId('loading-spinner')).not.toBeVisible();
});
```

### 3. **Testing Empty States**

```typescript
test('Show empty state message', async ({ page }) => {
  await page.route('**/api/items', route => {
    route.fulfill({ status: 200, body: '[]' });
  });

  await page.goto('http://localhost:3000');
  await expect(page.getByText('No items found')).toBeVisible();
});
```

### 4. **Testing Pagination**

```typescript
test('Paginate through items', async ({ page }) => {
  await page.route('**/api/items*', route => {
    const url = new URL(route.request().url());
    const pageNum = parseInt(url.searchParams.get('page') || '1');

    const itemsPerPage = 10;
    const totalItems = 25;
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const items = Array.from(
      { length: endIndex - startIndex },
      (_, i) => ({ id: startIndex + i + 1, name: `Item ${startIndex + i + 1}` })
    );

    route.fulfill({
      status: 200,
      body: JSON.stringify({
        items,
        page: pageNum,
        totalPages: Math.ceil(totalItems / itemsPerPage)
      })
    });
  });

  await page.goto('http://localhost:3000');

  // Page 1 shows items 1-10
  await expect(page.getByText('Item 1')).toBeVisible();

  // Click next page
  await page.getByText('Next').click();

  // Page 2 shows items 11-20
  await expect(page.getByText('Item 11')).toBeVisible();
});
```

## Summary

In this section, you learned:
- ✅ What network mocking is and why it's useful
- ✅ How to block requests (images, CSS, tracking)
- ✅ How to mock API responses with custom data
- ✅ How to simulate API errors and edge cases
- ✅ How to modify requests (headers, methods, body)
- ✅ How to modify responses (body, headers, delays)
- ✅ How to monitor network traffic
- ✅ How to handle WebSockets
- ✅ Best practices for network mocking
- ✅ Common use cases and patterns

## Next Steps

Now you're ready to practice network mocking with:
1. The lab exercises in the main [README](README.md)
2. Your own application's network requests
3. Testing edge cases and error scenarios

**Remember:** Network mocking is powerful for testing, but also run integration tests with real APIs to ensure your application works correctly end-to-end!
