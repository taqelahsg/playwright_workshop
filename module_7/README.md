# Module 9: API Testing with Playwright

**Duration:** 3-4 hours (Full coverage) | 20 minutes (Intensive workshop)
**Level:** Intermediate
**Prerequisites:** Completed Modules 1-3

> **Note:** In the intensive one-day workshop (9 AM - 3 PM), this module is covered in 20 minutes with live demo of GET/POST requests and response validation basics.

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:
- ✅ Understand Playwright's API testing capabilities
- ✅ Set up and use PlayPI for local API testing
- ✅ Make HTTP requests (GET, POST, PUT, PATCH, DELETE)
- ✅ Validate API responses with assertions
- ✅ Work with request and response headers
- ✅ Handle authentication and authorization
- ✅ Test RESTful APIs effectively
- ✅ Combine UI and API testing in workflows
- ✅ Debug and trace API requests

---

## 📚 Topics Covered

### 1. Introduction to API Testing (30-45 minutes)
**File:** [01_api_testing_basics.md](01_api_testing_basics.md)

Learn about:
- What is API testing and why it matters
- API testing vs UI testing
- REST API fundamentals (HTTP methods, status codes)
- Playwright's APIRequestContext
- Benefits of API testing with Playwright

**Key concepts:**
- HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Status codes (200, 201, 400, 404, 500)
- Request/Response structure
- Headers and body
- JSON data format

### 2. Setting Up PlayPI (20-30 minutes)
**File:** [02_playpi_setup.md](02_playpi_setup.md)

Learn about:
- What is PlayPI
- Installing Docker (prerequisite)
- Pulling and running PlayPI container
- Understanding available services
- Accessing the PlayPI dashboard
- Port configuration

**Available PlayPI services:**
- RESTful Inventory API (Port 8080)
- RESTful Task Management API (Port 8085)
- GraphQL Inventory API (Port 8081)
- gRPC services (Ports 8082, 8084)
- WebSocket Chat API (Port 8086)

### 3. Network Mocking and Interception (45-60 minutes)
**File:** [03_network_mocking.md](03_network_mocking.md)

Learn about:
- What is network mocking and why use it
- Blocking unwanted requests (images, CSS, tracking)
- Mocking API responses with custom data
- Simulating errors and edge cases
- Modifying requests (headers, methods, body)
- Modifying responses (body, headers, delays)
- Monitoring network traffic
- WebSocket mocking
- Authentication handling

**Hands-on Project:**
- [playwright-network-mocking](playwright-network-mocking/) - 60+ examples across 7 test suites
- Practical examples for all mocking scenarios
- Quick reference guide included

### 4. Making API Requests (60-90 minutes)
**File:** [03_api_requests.md](03_api_requests.md)

Learn about:
- Creating APIRequestContext
- GET requests - fetching data
- POST requests - creating resources
- PUT/PATCH requests - updating resources
- DELETE requests - removing resources
- Request headers and query parameters
- Request body (JSON, form data)
- Response handling

**Hands-on Lab:**
- Practice all HTTP methods with PlayPI
- Work with Inventory API
- Work with Task Management API

### 5. API Response Validation (60-75 minutes)
**File:** [04_api_assertions.md](04_api_assertions.md)

Learn about:
- Status code assertions
- Response body validation
- JSON structure verification
- Header validation
- Array and object assertions
- Schema validation
- Error response handling

**Advanced validation:**
- Partial JSON matching
- Dynamic data validation
- Date/time validation
- Nested object assertions

### 6. Advanced API Testing (45-60 minutes)
**File:** [05_advanced_api_testing.md](05_advanced_api_testing.md)

Learn about:
- Authentication (Bearer tokens, API keys, Basic auth)
- Request/Response interception
- Fixtures for test data
- Chaining API requests
- Parameterized tests
- Data-driven testing
- Performance testing basics

### 7. Combining UI and API Testing (30-45 minutes)
**File:** [06_ui_api_integration.md](06_ui_api_integration.md)

Learn about:
- When to use UI vs API testing
- Setting up test state via API
- Validating UI changes with API
- Hybrid testing workflows
- Best practices for combined testing

---

## 🧪 Implemented Projects

### Project 1: API Testing with PlayPI
**Directory:** [playwright-inventory-api-tests](playwright-inventory-api-tests/)

Comprehensive API testing examples using the PlayPI local API testing service.

### Project 2: Network Mocking Examples
**Directory:** [playwright-network-mocking](playwright-network-mocking/)

Complete examples demonstrating Playwright's network mocking and interception capabilities.

**What's included:**
- ✅ **Blocking requests** - Speed up tests by blocking images, CSS, tracking
- ✅ **Mocking API responses** - Return custom data without backend dependencies
- ✅ **Modifying requests** - Add headers, change methods, modify bodies
- ✅ **Modifying responses** - Transform real API responses on the fly
- ✅ **Monitoring network** - Track requests, measure performance
- ✅ **Real-world scenarios** - Login flows, error handling, loading states
- ✅ **Advanced patterns** - Stateful mocks, conditional mocking, performance testing

**7 comprehensive test suites with 60+ examples:**
1. [Blocking Requests](playwright-network-mocking/tests/01-blocking-requests.spec.ts) - Block images, CSS, tracking
2. [Mocking API Responses](playwright-network-mocking/tests/02-mocking-api-responses.spec.ts) - Custom data, errors, pagination
3. [Modifying Requests](playwright-network-mocking/tests/03-modifying-requests.spec.ts) - Headers, auth, body modifications
4. [Modifying Responses](playwright-network-mocking/tests/04-modifying-responses.spec.ts) - Transform responses, add delays
5. [Monitoring Network](playwright-network-mocking/tests/05-monitoring-network.spec.ts) - Track calls, measure performance
6. [Real-World Scenarios](playwright-network-mocking/tests/06-real-world-scenarios.spec.ts) - Login, errors, pagination
7. [Advanced Patterns](playwright-network-mocking/tests/07-advanced-patterns.spec.ts) - Stateful mocks, chaos testing

**Quick start:**
```bash
cd playwright-network-mocking
npm install
npm test
```

See the [Network Mocking README](playwright-network-mocking/README.md) for full documentation.

---

## 🧪 API Testing Test Suites (PlayPI Project)

The following test suites are fully implemented in the `playwright-inventory-api-tests` project.

### Test Suite 1: GET /items - Fetch All Items
**File:** [get-items.spec.ts](playwright-inventory-api-tests/tests/get-items.spec.ts)

**Tests implemented:**
- ✅ Validates 200 status code response
- ✅ Verifies JSON content type in response headers
- ✅ Confirms response is an array with items
- ✅ Validates item structure (id, name, description, price, quantity)
- ✅ Verifies correct data types (number for id/price/quantity, string for name/description)
- ✅ Validates item data values (positive IDs, non-empty names, non-negative prices/quantities)
- ✅ Measures response time (should be under 1000ms)

**Key validations:**
```typescript
// Status and content type
expect(response.status()).toBe(200);
expect(response.headers()['content-type']).toContain('application/json');

// Array and structure validation
expect(Array.isArray(items)).toBeTruthy();
expect(firstItem).toHaveProperty('id');
expect(typeof firstItem.price).toBe('number');
```

---

### Test Suite 2: POST /items - Create New Items
**File:** [post-items.spec.ts](playwright-inventory-api-tests/tests/post-items.spec.ts)

**Tests implemented:**
- ✅ Creates new item with valid data and validates 201 status
- ✅ Verifies JSON content type in response
- ✅ Creates item with minimum required fields
- ✅ Handles decimal prices correctly (99.99)
- ✅ Handles zero quantity items
- ✅ Handles large quantities (10000)
- ✅ Handles special characters in item names and descriptions

**Key test scenarios:**
```typescript
// Standard creation
const newItem = {
  name: 'Test Laptop',
  description: 'High-end gaming laptop',
  price: 2499.99,
  quantity: 5
};

// Edge cases tested
- Zero quantity items (out of stock)
- Large quantities (bulk items)
- Special characters: @#$%&()
- Decimal price precision
```

---

### Test Suite 3: PUT /items/{id} - Full Update
**File:** [put-items.spec.ts](playwright-inventory-api-tests/tests/put-items.spec.ts)

**Tests implemented:**
- ✅ Fully updates all fields of an existing item
- ✅ Verifies JSON content type
- ✅ Updates all fields at once
- ✅ Handles zero price updates
- ✅ Handles zero quantity updates
- ✅ Preserves item ID after update
- ✅ Handles long descriptions (200+ characters)

**Key features:**
```typescript
// Uses beforeEach to create test item
test.beforeEach(async ({ request }) => {
  const response = await request.post('/items', { data: newItem });
  testItemId = (await response.json()).id;
});

// Full replacement of all fields
const updatedData = {
  name: 'Updated Item Name',
  description: 'Updated description',
  price: 150.0,
  quantity: 20
};
```

---

### Test Suite 4: PATCH /items/{id} - Partial Update
**File:** [patch-items.spec.ts](playwright-inventory-api-tests/tests/patch-items.spec.ts)

**Tests implemented:**
- ✅ Updates only the name field
- ✅ Updates only the price field
- ✅ Updates only the quantity field
- ✅ Updates only the description field
- ✅ Updates multiple fields but not all
- ✅ Returns JSON content type
- ✅ Returns 400 error for non-existent item with error message
- ✅ Handles setting quantity to zero
- ✅ Preserves item ID after partial update

**Key validation:**
```typescript
// Verifies only updated fields changed
expect(updatedItem.name).toBe(patchData.name);
expect(updatedItem.description).toBe(originalItemData.description); // Unchanged
expect(updatedItem.price).toBe(originalItemData.price); // Unchanged

// Error handling
expect(response.status()).toBe(400);
expect(error.error).toBe('item not found');
```

---

### Test Suite 5: DELETE /items/{id} - Delete Item
**File:** [delete-items.spec.ts](playwright-inventory-api-tests/tests/delete-items.spec.ts)

**Tests implemented:**
- ✅ Deletes an existing item with 200 status
- ✅ Returns success message: `{message: 'item deleted'}`
- ✅ Verifies item no longer exists after deletion (404 on GET)
- ✅ Returns 404 when deleting non-existent item
- ✅ Returns 404 when deleting already deleted item
- ✅ Verifies other items remain unaffected
- ✅ Handles deletion of items with zero quantity
- ✅ Handles deletion of items with zero price
- ✅ Measures deletion response time (should be under 500ms)

**Key test patterns:**
```typescript
// Deletion verification
const deleteResponse = await request.delete(`/items/${testItemId}`);
expect(deleteResponse.status()).toBe(200);

const responseData = await deleteResponse.json();
expect(responseData.message).toBe('item deleted');

// Verify deletion
const getResponse = await request.get(`/items/${testItemId}`);
expect(getResponse.status()).toBe(404);
```

---

### Test Suite 6: GET /items/{id} - Get Item by ID
**File:** [get-item-by-id.spec.ts](playwright-inventory-api-tests/tests/get-item-by-id.spec.ts)

**Tests implemented:**
- ⚠️ Documents that endpoint returns 404 for all items in this PlayPI instance
- ✅ Tests 404 response for non-existent item IDs

**Note:** This endpoint appears to have an issue in the PlayPI instance where it returns 404 for all item IDs, even valid ones. Tests document this behavior.

---

## 📊 Test Coverage Summary

**Total Test Suites:** 6
**Total Tests:** 42+

**Coverage by HTTP Method:**
- GET /items: 6 tests
- GET /items/{id}: 2 tests (endpoint issue noted)
- POST /items: 7 tests
- PUT /items/{id}: 7 tests
- PATCH /items/{id}: 9 tests
- DELETE /items/{id}: 9 tests

**Test Categories:**
- ✅ Happy path scenarios
- ✅ Status code validation
- ✅ Response header validation
- ✅ JSON structure validation
- ✅ Data type validation
- ✅ Edge cases (zero values, large numbers, special characters)
- ✅ Error handling (404, 400 errors)
- ✅ Performance testing (response time)
- ✅ State verification (deletion, updates)

---

## 🎯 Running the Tests

```bash
cd module_9/playwright-inventory-api-tests

# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/get-items.spec.ts

# Run tests in UI mode
npx playwright test --ui

# Run tests with HTML report
npx playwright test --reporter=html
```

---

## ✅ Success Criteria

After completing this module, you should be able to:

**API Testing Fundamentals:**
- [x] Understand REST API concepts and HTTP methods
- [x] Create and configure APIRequestContext
- [x] Make GET, POST, PUT, PATCH, DELETE requests
- [x] Handle request headers and query parameters
- [x] Work with JSON request/response bodies

**Response Validation:**
- [x] Assert status codes correctly
- [x] Validate JSON response structure
- [x] Test arrays and nested objects
- [x] Verify response headers
- [x] Handle error responses

**Advanced Techniques:**
- [x] Set up PlayPI for local API testing
- [x] Create reusable API fixtures
- [x] Chain multiple API requests
- [x] Combine UI and API testing
- [x] Debug API requests with traces

---

## 🎓 Quick Reference

### Making API Requests

```typescript
import { test, expect, request } from '@playwright/test';

// GET request
const response = await request.get('http://localhost:8080/items');

// POST request
const response = await request.post('http://localhost:8080/items', {
  data: { name: 'Item', price: 99.99, quantity: 10 }
});

// PUT request
const response = await request.put('http://localhost:8080/items/123', {
  data: { name: 'Updated Item', price: 109.99, quantity: 5 }
});

// PATCH request
const response = await request.patch('http://localhost:8080/items/123', {
  data: { quantity: 15 }
});

// DELETE request
const response = await request.delete('http://localhost:8080/items/123');

// With headers
const response = await request.get('http://localhost:8080/items', {
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  }
});

// With query parameters
const response = await request.get('http://localhost:8080/items', {
  params: {
    page: 1,
    limit: 10,
    sort: 'price'
  }
});
```

### Common Assertions

```typescript
// Status code
expect(response.status()).toBe(200);
expect(response.ok()).toBeTruthy();

// Response body (JSON)
const data = await response.json();
expect(data).toHaveProperty('id');
expect(data.name).toBe('Expected Name');

// Response body (text)
const text = await response.text();
expect(text).toContain('success');

// Headers
const headers = response.headers();
expect(headers['content-type']).toContain('application/json');

// Arrays
expect(Array.isArray(data)).toBeTruthy();
expect(data.length).toBeGreaterThan(0);
expect(data).toHaveLength(5);

// Nested objects
expect(data.user.email).toBe('test@example.com');
expect(data.metadata).toHaveProperty('created_at');
```

### PlayPI Services

```typescript
// Inventory API (RESTful)
const baseURL = 'http://localhost:8080';
GET    ${baseURL}/items
GET    ${baseURL}/items/:id
POST   ${baseURL}/items
PUT    ${baseURL}/items/:id
PATCH  ${baseURL}/items/:id
DELETE ${baseURL}/items/:id

// Task Management API (RESTful)
const baseURL = 'http://localhost:8085';
GET    ${baseURL}/tasks
GET    ${baseURL}/tasks/:id
POST   ${baseURL}/tasks
PUT    ${baseURL}/tasks/:id
PATCH  ${baseURL}/tasks/:id
DELETE ${baseURL}/tasks/:id
```

---

## 💡 Tips for Success

**API Testing Best Practices:**
1. **Use descriptive test names** - Clearly state what you're testing
2. **Test positive and negative cases** - Both success and error scenarios
3. **Validate status codes first** - Before checking response body
4. **Use fixtures for reusable code** - Create helper functions for common operations
5. **Clean up test data** - Delete created resources after tests
6. **Test edge cases** - Empty arrays, null values, boundary conditions
7. **Validate response types** - Check data types, not just values
8. **Use meaningful assertions** - Test what matters for your API contract
9. **Keep tests independent** - Each test should work in isolation
10. **Use API tests for setup** - Faster than UI for creating test data

**Playwright-Specific Tips:**
1. **Leverage request context** - Reuse context across multiple requests
2. **Use parallel execution** - API tests are fast and can run in parallel
3. **Enable tracing for debugging** - See full request/response details
4. **Combine with UI tests** - Setup via API, verify via UI (or vice versa)
5. **Use TypeScript** - Get type safety for request/response objects

---

## 📖 Additional Resources

**Playwright Documentation:**
- [API Testing Guide](https://playwright.dev/docs/api-testing)
- [APIRequestContext](https://playwright.dev/docs/api/class-apirequestcontext)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)

**PlayPI Resources:**
- [PlayPI Blog Post](https://taqelah.sg/blog/playpi-local-api-testing-playground.html)
- [PlayPI GitHub](https://github.com/taqelah/playpi)
- [PlayPI Docker Hub](https://hub.docker.com/r/taqelah/playpi)

**General API Testing:**
- [REST API Tutorial](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [JSON Schema Validation](https://json-schema.org/)

**Additional Tutorials:**
- [Playwright API Testing - BrowserStack](https://www.browserstack.com/guide/playwright-api-test)
- [Playwright API Testing - LambdaTest](https://www.lambdatest.com/learning-hub/playwright-api-testing)
- [Master API Testing with Playwright](https://dzone.com/articles/playwright-api-testing-guide)

---

## ❓ Common Issues and Solutions

### Issue: PlayPI container not starting
**Solution:** Ensure Docker is running and ports are not in use:
```bash
# Check if Docker is running
docker ps

# Stop any conflicting containers
docker stop $(docker ps -q)

# Run PlayPI with port mapping
docker run -p 8000:8000 -p 8080:8080 -p 8081:8081 \
  -p 8082:8082 -p 8084:8084 -p 8085:8085 -p 8086:8086 \
  taqelah/playpi:latest
```

### Issue: Connection refused errors
**Solution:** Verify PlayPI is running and accessible:
```typescript
// Check if service is up
test('Verify PlayPI is accessible', async ({ request }) => {
  const response = await request.get('http://localhost:8000');
  expect(response.status()).toBe(200);
});
```

### Issue: Response parsing errors
**Solution:** Check Content-Type and parse accordingly:
```typescript
const contentType = response.headers()['content-type'];

if (contentType.includes('application/json')) {
  const data = await response.json();
} else {
  const text = await response.text();
}
```

### Issue: Tests failing inconsistently
**Solution:** Ensure test data cleanup and independence:
```typescript
test.afterEach(async ({ request }) => {
  // Clean up created items
  const response = await request.get('http://localhost:8080/items');
  const items = await response.json();

  for (const item of items) {
    if (item.name.startsWith('Test')) {
      await request.delete(`http://localhost:8080/items/${item.id}`);
    }
  }
});
```

---

## 🎉 Module Complete!

You now have a solid understanding of API testing with Playwright! You've learned:

**Core Skills:**
- How to make all types of HTTP requests (GET, POST, PUT, PATCH, DELETE)
- Validating API responses with comprehensive assertions
- Setting up and using PlayPI for local API testing
- Working with headers, query parameters, and request bodies

**Advanced Techniques:**
- Creating reusable API fixtures
- Combining UI and API testing workflows
- Error handling and edge case testing
- Data-driven API testing

## 🚀 Next Steps

1. **Practice** - Work through all lab exercises with PlayPI
2. **Experiment** - Try the GraphQL and WebSocket APIs in PlayPI
3. **Integrate** - Add API tests to your existing test suites
4. **Optimize** - Use API tests for faster test data setup
5. **Explore** - Try testing real-world APIs with authentication
6. **Share** - Teach your team about API testing benefits

---

**Ready to start?**
1. First: [Setup PlayPI](02_playpi_setup.md)
2. Then: [Learn API basics](01_api_testing_basics.md)
3. Practice: [Making requests](03_api_requests.md)
4. Master: [Response validation](04_api_assertions.md)

**Happy API Testing! 🚀**

---

> **Note:** All contents of this workshop are proprietary and belong to **Taqelah**. Do not share or distribute without permission.
