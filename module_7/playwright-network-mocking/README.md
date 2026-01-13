# Playwright Network Mocking Examples

This project contains comprehensive examples demonstrating Playwright's network mocking and interception capabilities.

## 📚 What's Included

This project demonstrates all aspects of network mocking with Playwright through 7 test suites:

### [01-blocking-requests.spec.ts](tests/01-blocking-requests.spec.ts)
**Blocking Network Requests**
- Block images to speed up tests
- Block CSS and JavaScript files
- Block multiple resource types (fonts, media)
- Block third-party analytics and tracking
- Block by file extension patterns
- Block specific API endpoints

**Why block requests?**
- Faster test execution
- Reduced bandwidth usage
- Prevent third-party scripts from interfering with tests

### [02-mocking-api-responses.spec.ts](tests/02-mocking-api-responses.spec.ts)
**Mocking API Responses**
- Mock empty API responses
- Mock with custom test data
- Mock HTTP error responses (404, 500, 401)
- Mock different responses based on request method
- Mock dynamic responses based on URL parameters
- Mock authentication responses
- Mock paginated API responses

**Use cases:**
- Test UI without backend dependencies
- Test with predictable data
- Test error handling
- Test edge cases

### [03-modifying-requests.spec.ts](tests/03-modifying-requests.spec.ts)
**Modifying Outgoing Requests**
- Add authentication headers to API requests
- Remove sensitive headers
- Add custom headers (request IDs, client version)
- Modify request methods
- Modify POST request body
- Add query parameters
- Add correlation IDs for tracking

**Use cases:**
- Add test-mode headers
- Inject authentication tokens
- Add tracking metadata
- Modify requests for testing purposes

### [04-modifying-responses.spec.ts](tests/04-modifying-responses.spec.ts)
**Modifying API Responses**
- Fetch real responses and modify content
- Add custom fields to JSON responses
- Add custom response headers
- Simulate slow API responses
- Transform response data structure
- Filter and sort response data
- Combine real and mock data

**Use cases:**
- Test with modified production data
- Add test metadata to responses
- Simulate slow networks
- Test performance under load

### [05-monitoring-network.spec.ts](tests/05-monitoring-network.spec.ts)
**Monitoring Network Traffic**
- Log all requests and responses
- Track API calls with metadata
- Wait for specific API responses
- Track request timing and performance
- Count requests by resource type
- Track failed requests
- Monitor authenticated requests
- Track response sizes

**Use cases:**
- Debug network issues
- Performance testing
- Verify API calls are made
- Track network usage

### [06-real-world-scenarios.spec.ts](tests/06-real-world-scenarios.spec.ts)
**Practical Real-World Use Cases**
- Test loading states with delayed responses
- Test empty states
- Test error handling (404, 500, network failures)
- Mock login and authentication flows
- Mock registration with validation errors
- Test pagination functionality
- Test search functionality
- Handle rate limiting errors
- Mock file uploads

**Use cases:**
- Test complete user workflows
- Validate error handling
- Test authentication flows
- Test data-driven features

### [07-advanced-patterns.spec.ts](tests/07-advanced-patterns.spec.ts)
**Advanced Mocking Techniques**
- Conditional mocking based on environment
- Stateful mocks (simulate CRUD operations)
- Request counters and tracking
- Dynamic delays based on data size
- Fallback to real API for specific requests
- Performance measurement
- Rotating responses
- Probability-based failures
- Request validation
- Authentication chains
- Record and replay interactions

**Use cases:**
- Complex testing scenarios
- Performance testing
- Chaos engineering
- Integration testing

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to the project directory
cd module_7/playwright-network-mocking

# Install dependencies
npm install

# Install Playwright browsers (if not already installed)
npx playwright install
```

## 🧪 Running the Tests

```bash
# Run all tests
npm test

# Run all tests in headed mode (see browser)
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Run specific test file
npx playwright test tests/01-blocking-requests.spec.ts

# Run tests with specific grep pattern
npx playwright test -g "Block images"

# Run in debug mode
npm run test:debug
```

## 📊 View Test Reports

```bash
# Generate and open HTML report
npm run report
```

## 🎯 Test Structure

Each test file focuses on a specific aspect of network mocking:

```
tests/
├── 01-blocking-requests.spec.ts      # Block unwanted requests
├── 02-mocking-api-responses.spec.ts  # Mock API responses
├── 03-modifying-requests.spec.ts     # Modify outgoing requests
├── 04-modifying-responses.spec.ts    # Modify incoming responses
├── 05-monitoring-network.spec.ts     # Monitor network traffic
├── 06-real-world-scenarios.spec.ts   # Practical examples
└── 07-advanced-patterns.spec.ts      # Advanced techniques
```

## 💡 Key Concepts Demonstrated

### 1. Route Handlers

```typescript
// Block a request
await page.route('**/*.png', route => route.abort());

// Mock a response
await page.route('**/api/items', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify([{ id: 1, name: 'Item' }])
  });
});

// Modify a request
await page.route('**/api/**', async route => {
  await route.continue({
    headers: {
      ...route.request().headers(),
      'Authorization': 'Bearer token'
    }
  });
});

// Fetch and modify response
await page.route('**/api/items', async route => {
  const response = await route.fetch();
  const json = await response.json();

  json.forEach(item => item.modified = true);

  await route.fulfill({
    response,
    body: JSON.stringify(json)
  });
});
```

### 2. URL Pattern Matching

```typescript
// Glob patterns
'**/api/items'           // Exact path
'**/api/**'              // Any API path
'**/*.{png,jpg,jpeg}'    // Multiple extensions

// Regular expressions
/\/api\/items\/\d+/      // Items with numeric IDs
/\.(css|js)$/            // CSS and JS files

// Predicate functions
url => url.pathname.includes('api')
url => url.hostname === 'api.example.com'
```

### 3. Network Events

```typescript
// Listen to requests
page.on('request', request => {
  console.log('>>', request.method(), request.url());
});

// Listen to responses
page.on('response', response => {
  console.log('<<', response.status(), response.url());
});

// Listen to failed requests
page.on('requestfailed', request => {
  console.log('Failed:', request.url());
});
```

### 4. Waiting for Responses

```typescript
// Wait for specific response
const responsePromise = page.waitForResponse('**/api/items');
await page.click('button');
const response = await responsePromise;

// Wait with predicate
const response = await page.waitForResponse(
  resp => resp.url().includes('/api/') && resp.status() === 200
);
```

## 🎓 Learning Path

We recommend studying the examples in this order:

1. **Start with blocking** (01) - Understand the basics of intercepting requests
2. **Learn mocking** (02) - See how to return custom responses
3. **Modify requests** (03) - Learn to change outgoing requests
4. **Modify responses** (04) - Learn to change incoming responses
5. **Monitor traffic** (05) - Understand how to observe network activity
6. **Real scenarios** (06) - Apply concepts to practical use cases
7. **Advanced patterns** (07) - Master complex mocking techniques

## 📖 Best Practices

### 1. **Mock at the Right Level**
```typescript
// ✅ Good - Specific route
await page.route('**/api/items', handler);

// ❌ Bad - Too broad
await page.route('**/*', handler);
```

### 2. **Keep Mock Data Realistic**
```typescript
// ✅ Good - Realistic data
const mockItem = {
  id: 123,
  name: 'Laptop',
  price: 999.99,
  quantity: 5,
  created_at: '2026-01-09T10:00:00Z'
};

// ❌ Bad - Minimal data
const mockItem = { id: 1, name: 'Item' };
```

### 3. **Test Both Mocked and Real APIs**
- Use mocks for fast UI tests
- Use real APIs for integration tests

### 4. **Clean Up Routes**
Routes are automatically cleaned up after each test, so you don't need to manually remove them.

### 5. **Use Helper Functions**
```typescript
// helpers/mockApi.ts
export async function mockEmptyItems(page) {
  await page.route('**/api/items', route => {
    route.fulfill({ status: 200, body: '[]' });
  });
}
```

## 🔍 Common Use Cases

### Speed Up Tests
```typescript
// Block images, CSS, and fonts
await page.route('**/*', route => {
  const type = route.request().resourceType();
  if (['image', 'stylesheet', 'font'].includes(type)) {
    return route.abort();
  }
  return route.continue();
});
```

### Test Error Handling
```typescript
await page.route('**/api/items', route => {
  route.fulfill({
    status: 500,
    body: JSON.stringify({ error: 'Server error' })
  });
});
```

### Test Loading States
```typescript
await page.route('**/api/items', async route => {
  await page.waitForTimeout(2000); // 2 second delay
  await route.fulfill({ status: 200, body: '[]' });
});
```

### Add Authentication
```typescript
await page.route('**/api/**', async route => {
  await route.continue({
    headers: {
      ...route.request().headers(),
      'Authorization': 'Bearer test-token'
    }
  });
});
```

## 🐛 Troubleshooting

### Routes Not Working?
- Check that the URL pattern matches correctly
- Verify the route is set before navigating to the page
- Check for Service Workers that might intercept requests

### Service Workers Interfering?
```typescript
// Disable Service Workers
// In playwright.config.ts
export default defineConfig({
  use: {
    serviceWorkers: 'block',
  }
});
```

### Can't See Network Events?
- Ensure listeners are attached before navigation
- Check if Service Workers are intercepting requests

## 📚 Additional Resources

**Official Documentation:**
- [Playwright Network Mocking](https://playwright.dev/docs/network)
- [APIRequestContext](https://playwright.dev/docs/api/class-apirequestcontext)
- [Route Class](https://playwright.dev/docs/api/class-route)

**Related Module Files:**
- [Network Mocking Guide](../03_network_mocking.md) - Comprehensive guide
- [API Testing Basics](../01_api_testing_basics.md) - API testing fundamentals
- [PlayPI Setup](../02_playpi_setup.md) - Local API testing setup

## 🎯 What You'll Learn

After working through these examples, you'll be able to:

✅ Block unwanted network requests to speed up tests
✅ Mock API responses with custom data
✅ Simulate error conditions and edge cases
✅ Modify requests and responses on the fly
✅ Monitor and track network activity
✅ Test authentication and authorization flows
✅ Handle complex scenarios like pagination and search
✅ Implement advanced patterns like stateful mocks
✅ Debug network issues effectively
✅ Write faster, more reliable tests

## 🤝 Contributing

These examples are part of the Playwright Workshop Module 7. Feel free to:
- Add new examples
- Improve existing examples
- Fix issues
- Add documentation

## 📝 License

ISC

---

**Happy Testing! 🚀**

For questions or issues, refer to the main [Module 7 README](../README.md).
