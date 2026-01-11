# API Testing Basics

## What is API Testing?

API (Application Programming Interface) testing involves directly testing the backend services and business logic layer of an application. Unlike UI testing, which interacts with the graphical interface, API testing validates:

- **Data exchange** between client and server
- **Business logic** implementation
- **Data integrity** and accuracy
- **Security** and authentication
- **Performance** and response times
- **Error handling** mechanisms

## Why API Testing Matters

### 1. **Faster Test Execution**
API tests run significantly faster than UI tests because they:
- Skip browser rendering
- Avoid waiting for page loads
- Don't require UI element location
- Execute direct HTTP requests

### 2. **Earlier Bug Detection**
- Test backend logic before UI is developed
- Catch issues at the service layer
- Validate data processing independently

### 3. **Better Test Coverage**
- Test scenarios difficult to replicate in UI
- Validate edge cases and error conditions
- Test security vulnerabilities
- Verify API contracts

### 4. **More Stable Tests**
- No dependency on UI changes
- Less prone to flakiness
- Independent of frontend frameworks
- Easier to maintain

## API Testing vs UI Testing

| Aspect | API Testing | UI Testing |
|--------|-------------|------------|
| **Speed** | Very fast (milliseconds) | Slower (seconds) |
| **Reliability** | More stable | Can be flaky |
| **Coverage** | Backend logic, data | User workflows, UX |
| **Maintenance** | Lower | Higher |
| **Setup** | Simpler | More complex |
| **Cost** | Less resource-intensive | More resources needed |

### When to Use Each

**Use API Testing for:**
- ✅ Data validation
- ✅ Business logic verification
- ✅ Integration testing
- ✅ Setting up test data
- ✅ Performance testing
- ✅ Security testing

**Use UI Testing for:**
- ✅ User experience validation
- ✅ Visual regression testing
- ✅ End-to-end user workflows
- ✅ Cross-browser compatibility
- ✅ Accessibility testing

**Best Approach:** Combine both!
- Use API tests for backend validation and setup
- Use UI tests for critical user journeys

## REST API Fundamentals

### HTTP Methods

REST APIs use HTTP methods to perform operations:

| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| **GET** | Retrieve data | Yes | Yes |
| **POST** | Create new resource | No | No |
| **PUT** | Update entire resource | Yes | No |
| **PATCH** | Update partial resource | No | No |
| **DELETE** | Remove resource | Yes | No |

**Idempotent:** Making the same request multiple times produces the same result
**Safe:** Does not modify server state

### Common HTTP Status Codes

#### 2xx Success
- **200 OK** - Request succeeded
- **201 Created** - Resource created successfully
- **204 No Content** - Success, no response body

#### 3xx Redirection
- **301 Moved Permanently** - Resource moved
- **304 Not Modified** - Cached version is valid

#### 4xx Client Errors
- **400 Bad Request** - Invalid request syntax
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - No permission
- **404 Not Found** - Resource doesn't exist
- **422 Unprocessable Entity** - Validation error

#### 5xx Server Errors
- **500 Internal Server Error** - Server error
- **502 Bad Gateway** - Invalid response
- **503 Service Unavailable** - Server overloaded

### Request Structure

```
POST /api/items HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: Bearer eyJhbGc...
Accept: application/json

{
  "name": "Laptop",
  "price": 1299.99,
  "quantity": 5
}
```

Components:
1. **Method** - POST
2. **Path** - /api/items
3. **Headers** - Metadata (Content-Type, Authorization, etc.)
4. **Body** - Request data (JSON, XML, etc.)

### Response Structure

```
HTTP/1.1 201 Created
Content-Type: application/json
Date: Thu, 09 Jan 2026 10:30:00 GMT

{
  "id": "abc123",
  "name": "Laptop",
  "price": 1299.99,
  "quantity": 5,
  "created_at": "2026-01-09T10:30:00Z"
}
```

Components:
1. **Status Code** - 201 Created
2. **Headers** - Response metadata
3. **Body** - Response data (JSON, XML, etc.)

## Playwright's APIRequestContext

Playwright provides a powerful `APIRequestContext` for making HTTP requests.

### Key Features

1. **Built-in retry logic** - Automatic retries for network issues
2. **Request interception** - Modify requests before they're sent
3. **Response validation** - Easy assertion methods
4. **Cookie handling** - Automatic cookie management
5. **Tracing support** - Full request/response logging
6. **TypeScript support** - Type-safe API testing

### Creating an API Context

```typescript
import { test, expect, request } from '@playwright/test';

// Method 1: Use the request fixture (most common)
test('Use request fixture', async ({ request }) => {
  const response = await request.get('http://localhost:8080/items');
  expect(response.status()).toBe(200);
});

// Method 2: Create a new context
test('Create new context', async () => {
  const apiContext = await request.newContext({
    baseURL: 'http://localhost:8080',
    extraHTTPHeaders: {
      'Accept': 'application/json'
    }
  });

  const response = await apiContext.get('/items');
  expect(response.status()).toBe(200);

  await apiContext.dispose();
});

// Method 3: Global context with base configuration
test.use({
  baseURL: 'http://localhost:8080',
  extraHTTPHeaders: {
    'Accept': 'application/json'
  }
});

test('Use configured base URL', async ({ request }) => {
  const response = await request.get('/items');
  expect(response.status()).toBe(200);
});
```

### Making Requests

```typescript
// GET request
const getResponse = await request.get('/items');

// POST request with JSON body
const postResponse = await request.post('/items', {
  data: {
    name: 'Product',
    price: 99.99
  }
});

// PUT request
const putResponse = await request.put('/items/123', {
  data: { name: 'Updated Product', price: 109.99 }
});

// PATCH request
const patchResponse = await request.patch('/items/123', {
  data: { price: 89.99 }
});

// DELETE request
const deleteResponse = await request.delete('/items/123');

// Request with headers
const response = await request.get('/items', {
  headers: {
    'Authorization': 'Bearer token123',
    'X-Custom-Header': 'value'
  }
});

// Request with query parameters
const response = await request.get('/items', {
  params: {
    page: 1,
    limit: 10,
    sort: 'price',
    filter: 'available'
  }
});
// Results in: /items?page=1&limit=10&sort=price&filter=available
```

### Handling Responses

```typescript
test('Handle different response types', async ({ request }) => {
  const response = await request.get('/items');

  // Status code
  console.log('Status:', response.status());
  console.log('OK:', response.ok()); // true if 200-299

  // Response body as JSON
  const jsonData = await response.json();
  console.log('JSON:', jsonData);

  // Response body as text
  const textData = await response.text();
  console.log('Text:', textData);

  // Response body as buffer
  const buffer = await response.body();
  console.log('Buffer:', buffer);

  // Response headers
  const headers = response.headers();
  console.log('Headers:', headers);
  console.log('Content-Type:', headers['content-type']);

  // Response URL
  console.log('URL:', response.url());
});
```

## JSON Data Format

JSON (JavaScript Object Notation) is the most common data format for REST APIs.

### JSON Syntax

```json
{
  "string": "value",
  "number": 42,
  "float": 3.14,
  "boolean": true,
  "null": null,
  "array": [1, 2, 3],
  "object": {
    "nested": "value"
  }
}
```

### Working with JSON in Tests

```typescript
test('Parse and validate JSON', async ({ request }) => {
  const response = await request.get('/items/123');

  const item = await response.json();

  // Access properties
  console.log(item.name);
  console.log(item.price);

  // Nested properties
  console.log(item.metadata.created_at);

  // Array properties
  console.log(item.tags[0]);

  // Type checking
  expect(typeof item.name).toBe('string');
  expect(typeof item.price).toBe('number');
  expect(Array.isArray(item.tags)).toBeTruthy();
});
```

## Benefits of API Testing with Playwright

### 1. **Unified Testing Framework**
- Same tool for UI and API tests
- Shared configuration and utilities
- Single test runner
- Consistent reporting

### 2. **Powerful Assertions**
```typescript
// Built-in expect assertions
expect(response.status()).toBe(200);
expect(response.ok()).toBeTruthy();
expect(await response.json()).toHaveProperty('id');
```

### 3. **Easy Setup and Teardown**
```typescript
test.beforeEach(async ({ request }) => {
  // Setup: Create test data via API
  await request.post('/items', {
    data: { name: 'Test Item', price: 10 }
  });
});

test.afterEach(async ({ request }) => {
  // Teardown: Clean up test data
  const items = await request.get('/items').then(r => r.json());
  for (const item of items) {
    await request.delete(`/items/${item.id}`);
  }
});
```

### 4. **Parallel Execution**
```typescript
// Run API tests in parallel for speed
test.describe.configure({ mode: 'parallel' });

test('Test 1', async ({ request }) => { /* ... */ });
test('Test 2', async ({ request }) => { /* ... */ });
test('Test 3', async ({ request }) => { /* ... */ });
```

### 5. **Request Interception**
```typescript
test('Intercept and modify requests', async ({ page, request }) => {
  await page.route('**/api/items', async (route) => {
    // Modify request
    const request = route.request();
    await route.continue({
      headers: {
        ...request.headers(),
        'X-Test-Header': 'value'
      }
    });
  });

  await page.goto('/');
});
```

### 6. **Full Tracing and Debugging**
```typescript
// Enable API call tracing in playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on',
    baseURL: 'http://localhost:8080'
  }
});

// View traces with:
// npx playwright show-trace trace.zip
```

### 7. **Authentication Handling**
```typescript
test.use({
  extraHTTPHeaders: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});

// Or per request
test('Authenticated request', async ({ request }) => {
  const response = await request.get('/protected', {
    headers: {
      'Authorization': 'Bearer token123'
    }
  });

  expect(response.status()).toBe(200);
});
```

## Best Practices

### 1. **Use Descriptive Test Names**
```typescript
// ✅ Good
test('GET /items returns 200 and array of items', async ({ request }) => {});

// ❌ Bad
test('test1', async ({ request }) => {});
```

### 2. **Test Both Success and Failure Cases**
```typescript
test('POST /items with valid data returns 201', async ({ request }) => {
  // Success case
});

test('POST /items with invalid data returns 400', async ({ request }) => {
  // Failure case
});
```

### 3. **Validate Status Code First**
```typescript
test('Validate response correctly', async ({ request }) => {
  const response = await request.get('/items');

  // Check status first
  expect(response.status()).toBe(200);

  // Then parse body
  const data = await response.json();
  expect(data).toHaveLength(10);
});
```

### 4. **Use Base URL Configuration**
```typescript
// In playwright.config.ts
export default defineConfig({
  use: {
    baseURL: 'http://localhost:8080'
  }
});

// In tests
test('Use relative URLs', async ({ request }) => {
  await request.get('/items'); // Uses baseURL
});
```

### 5. **Clean Up Test Data**
```typescript
test('Create and cleanup item', async ({ request }) => {
  const createResponse = await request.post('/items', {
    data: { name: 'Test', price: 10 }
  });

  const item = await createResponse.json();

  try {
    // Test logic here
  } finally {
    // Always cleanup
    await request.delete(`/items/${item.id}`);
  }
});
```

## Summary

In this section, you learned:
- ✅ What API testing is and why it's important
- ✅ Differences between API and UI testing
- ✅ REST API fundamentals (HTTP methods, status codes)
- ✅ Request/Response structure
- ✅ Playwright's APIRequestContext capabilities
- ✅ JSON data format
- ✅ Benefits of API testing with Playwright

## Next Steps

Now that you understand the basics, let's move on to:
1. [Setting up PlayPI](02_playpi_setup.md) - Your local API testing playground
2. [Making API Requests](03_api_requests.md) - Hands-on practice with all HTTP methods
3. [API Assertions](04_api_assertions.md) - Validating responses thoroughly
