# Module 9: API Testing with Playwright

**Duration:** 3-4 hours
**Level:** Intermediate
**Prerequisites:** Completed Modules 1-3

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

### 3. Making API Requests (60-90 minutes)
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

### 4. API Response Validation (60-75 minutes)
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

### 5. Advanced API Testing (45-60 minutes)
**File:** [05_advanced_api_testing.md](05_advanced_api_testing.md)

Learn about:
- Authentication (Bearer tokens, API keys, Basic auth)
- Request/Response interception
- Fixtures for test data
- Chaining API requests
- Parameterized tests
- Data-driven testing
- Performance testing basics

### 6. Combining UI and API Testing (30-45 minutes)
**File:** [06_ui_api_integration.md](06_ui_api_integration.md)

Learn about:
- When to use UI vs API testing
- Setting up test state via API
- Validating UI changes with API
- Hybrid testing workflows
- Best practices for combined testing

---

## 🧪 Lab Exercises

### Lab 1: Your First API Test (20 minutes)

**Task:** Write a basic GET request test

```typescript
import { test, expect, request } from '@playwright/test';

test('GET - Fetch all inventory items', async ({ request }) => {
  const response = await request.get('http://localhost:8080/items');

  // Validate status code
  expect(response.status()).toBe(200);

  // Validate response body
  const items = await response.json();
  expect(Array.isArray(items)).toBeTruthy();

  console.log(`Found ${items.length} items`);
});
```

---

### Lab 2: Creating Resources with POST (25 minutes)

**Task:** Create new items using POST requests

```typescript
test('POST - Create a new inventory item', async ({ request }) => {
  const newItem = {
    name: 'Laptop',
    description: 'Dell XPS 15',
    price: 1299.99,
    quantity: 5
  };

  const response = await request.post('http://localhost:8080/items', {
    data: newItem
  });

  expect(response.status()).toBe(201);

  const createdItem = await response.json();
  expect(createdItem).toHaveProperty('id');
  expect(createdItem.name).toBe(newItem.name);
  expect(createdItem.price).toBe(newItem.price);
});
```

---

### Lab 3: Updating Resources (25 minutes)

**Task:** Update existing items with PUT and PATCH

```typescript
test('PUT - Update an inventory item', async ({ request }) => {
  // First, create an item
  const createResponse = await request.post('http://localhost:8080/items', {
    data: {
      name: 'Monitor',
      description: '24 inch',
      price: 299.99,
      quantity: 10
    }
  });

  const createdItem = await createResponse.json();
  const itemId = createdItem.id;

  // Update the item
  const updatedData = {
    name: 'Monitor',
    description: '27 inch 4K',
    price: 499.99,
    quantity: 8
  };

  const updateResponse = await request.put(
    `http://localhost:8080/items/${itemId}`,
    { data: updatedData }
  );

  expect(updateResponse.status()).toBe(200);

  const updatedItem = await updateResponse.json();
  expect(updatedItem.description).toBe('27 inch 4K');
  expect(updatedItem.price).toBe(499.99);
});

test('PATCH - Partially update an item', async ({ request }) => {
  // Create an item first
  const createResponse = await request.post('http://localhost:8080/items', {
    data: {
      name: 'Keyboard',
      description: 'Mechanical',
      price: 89.99,
      quantity: 15
    }
  });

  const createdItem = await createResponse.json();

  // Patch only the quantity
  const patchResponse = await request.patch(
    `http://localhost:8080/items/${createdItem.id}`,
    {
      data: { quantity: 20 }
    }
  );

  expect(patchResponse.status()).toBe(200);

  const patchedItem = await patchResponse.json();
  expect(patchedItem.quantity).toBe(20);
  expect(patchedItem.name).toBe('Keyboard'); // Unchanged
});
```

---

### Lab 4: Deleting Resources (20 minutes)

**Task:** Delete items using DELETE requests

```typescript
test('DELETE - Remove an inventory item', async ({ request }) => {
  // Create an item to delete
  const createResponse = await request.post('http://localhost:8080/items', {
    data: {
      name: 'Mouse',
      description: 'Wireless',
      price: 29.99,
      quantity: 50
    }
  });

  const createdItem = await createResponse.json();
  const itemId = createdItem.id;

  // Delete the item
  const deleteResponse = await request.delete(
    `http://localhost:8080/items/${itemId}`
  );

  expect(deleteResponse.status()).toBe(204);

  // Verify item is deleted
  const getResponse = await request.get(
    `http://localhost:8080/items/${itemId}`
  );

  expect(getResponse.status()).toBe(404);
});
```

---

### Lab 5: Working with Headers (25 minutes)

**Task:** Send and validate request/response headers

```typescript
test('Request headers and custom headers', async ({ request }) => {
  const response = await request.get('http://localhost:8080/items', {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Playwright-Test',
      'X-Custom-Header': 'test-value'
    }
  });

  expect(response.status()).toBe(200);

  // Validate response headers
  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');

  console.log('Response headers:', headers);
});

test('Content-Type for POST requests', async ({ request }) => {
  const response = await request.post('http://localhost:8080/items', {
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      name: 'Headphones',
      description: 'Noise cancelling',
      price: 199.99,
      quantity: 12
    }
  });

  expect(response.status()).toBe(201);
});
```

---

### Lab 6: Complex Response Validation (30 minutes)

**Task:** Validate complex JSON structures and arrays

```typescript
test('Validate array response structure', async ({ request }) => {
  const response = await request.get('http://localhost:8080/items');

  expect(response.status()).toBe(200);

  const items = await response.json();

  // Array validations
  expect(Array.isArray(items)).toBeTruthy();
  expect(items.length).toBeGreaterThan(0);

  // Validate first item structure
  const firstItem = items[0];
  expect(firstItem).toHaveProperty('id');
  expect(firstItem).toHaveProperty('name');
  expect(firstItem).toHaveProperty('price');
  expect(firstItem).toHaveProperty('quantity');

  // Type validations
  expect(typeof firstItem.id).toBe('string');
  expect(typeof firstItem.name).toBe('string');
  expect(typeof firstItem.price).toBe('number');
  expect(typeof firstItem.quantity).toBe('number');
});

test('Filter and validate specific items', async ({ request }) => {
  const response = await request.get('http://localhost:8080/items');
  const items = await response.json();

  // Find items with price > 100
  const expensiveItems = items.filter(item => item.price > 100);
  expect(expensiveItems.length).toBeGreaterThan(0);

  // Validate all expensive items
  expensiveItems.forEach(item => {
    expect(item.price).toBeGreaterThan(100);
  });
});
```

---

### Lab 7: Task Management API (35 minutes)

**Task:** Work with the Task Management API (Port 8085)

```typescript
test('Task API - Create and manage tasks', async ({ request }) => {
  const baseURL = 'http://localhost:8085';

  // Create a new task
  const newTask = {
    title: 'Write API tests',
    description: 'Complete module 9 exercises',
    status: 'pending',
    priority: 'high'
  };

  const createResponse = await request.post(`${baseURL}/tasks`, {
    data: newTask
  });

  expect(createResponse.status()).toBe(201);

  const createdTask = await createResponse.json();
  expect(createdTask).toHaveProperty('id');
  expect(createdTask.title).toBe(newTask.title);

  const taskId = createdTask.id;

  // Get the task
  const getResponse = await request.get(`${baseURL}/tasks/${taskId}`);
  expect(getResponse.status()).toBe(200);

  // Update task status
  const updateResponse = await request.patch(`${baseURL}/tasks/${taskId}`, {
    data: { status: 'in-progress' }
  });

  expect(updateResponse.status()).toBe(200);
  const updatedTask = await updateResponse.json();
  expect(updatedTask.status).toBe('in-progress');

  // Complete the task
  const completeResponse = await request.patch(`${baseURL}/tasks/${taskId}`, {
    data: { status: 'completed' }
  });

  expect(completeResponse.status()).toBe(200);
});

test('Task API - List all tasks', async ({ request }) => {
  const response = await request.get('http://localhost:8085/tasks');

  expect(response.status()).toBe(200);

  const tasks = await response.json();
  expect(Array.isArray(tasks)).toBeTruthy();

  // Validate task structure
  if (tasks.length > 0) {
    const task = tasks[0];
    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('title');
    expect(task).toHaveProperty('status');
  }
});
```

---

### Lab 8: Error Handling (25 minutes)

**Task:** Test error scenarios and validation

```typescript
test('Handle 404 - Item not found', async ({ request }) => {
  const response = await request.get('http://localhost:8080/items/nonexistent-id');

  expect(response.status()).toBe(404);
});

test('Handle 400 - Bad request', async ({ request }) => {
  const invalidItem = {
    // Missing required fields
    name: 'Invalid Item'
    // price and quantity missing
  };

  const response = await request.post('http://localhost:8080/items', {
    data: invalidItem
  });

  // Expecting validation error
  expect([400, 422]).toContain(response.status());
});

test('Validate error response structure', async ({ request }) => {
  const response = await request.get('http://localhost:8080/items/invalid-id');

  expect(response.status()).toBe(404);

  const errorBody = await response.json();
  expect(errorBody).toHaveProperty('error');
  // Or check for error message
  console.log('Error response:', errorBody);
});
```

---

### Lab 9: API Context and Fixtures (30 minutes)

**Task:** Use API request context and fixtures for reusable setup

```typescript
import { test as base, expect } from '@playwright/test';

// Extend base test with custom fixtures
const test = base.extend({
  inventoryAPI: async ({ request }, use) => {
    const baseURL = 'http://localhost:8080';

    // Helper functions
    const api = {
      getAllItems: () => request.get(`${baseURL}/items`),

      getItem: (id: string) => request.get(`${baseURL}/items/${id}`),

      createItem: (data: any) => request.post(`${baseURL}/items`, { data }),

      updateItem: (id: string, data: any) =>
        request.put(`${baseURL}/items/${id}`, { data }),

      deleteItem: (id: string) => request.delete(`${baseURL}/items/${id}`)
    };

    await use(api);
  }
});

test('Use inventory API fixture', async ({ inventoryAPI }) => {
  // Create item
  const createResponse = await inventoryAPI.createItem({
    name: 'Test Product',
    description: 'Fixture test',
    price: 99.99,
    quantity: 5
  });

  expect(createResponse.status()).toBe(201);
  const item = await createResponse.json();

  // Get item
  const getResponse = await inventoryAPI.getItem(item.id);
  expect(getResponse.status()).toBe(200);

  // Delete item
  const deleteResponse = await inventoryAPI.deleteItem(item.id);
  expect(deleteResponse.status()).toBe(204);
});
```

---

### Lab 10: UI + API Integration (40 minutes)

**Task:** Combine UI and API testing

```typescript
test('Setup test data via API, verify in UI', async ({ page, request }) => {
  // Setup: Create items via API
  const items = [
    { name: 'Product 1', description: 'Description 1', price: 10.99, quantity: 100 },
    { name: 'Product 2', description: 'Description 2', price: 20.99, quantity: 50 },
    { name: 'Product 3', description: 'Description 3', price: 30.99, quantity: 25 }
  ];

  for (const item of items) {
    await request.post('http://localhost:8080/items', { data: item });
  }

  // Verify: Check UI displays the items
  await page.goto('http://localhost:8000'); // PlayPI dashboard

  // Navigate to inventory view (adjust based on actual UI)
  // await page.getByRole('link', { name: 'Inventory' }).click();

  // Verify items appear in UI
  // await expect(page.getByText('Product 1')).toBeVisible();
  // await expect(page.getByText('Product 2')).toBeVisible();
});

test('UI action, verify via API', async ({ page, request }) => {
  // Perform UI action (e.g., create item through form)
  await page.goto('http://localhost:8000/inventory/new');

  await page.getByLabel('Name').fill('UI Created Item');
  await page.getByLabel('Price').fill('59.99');
  await page.getByLabel('Quantity').fill('10');
  await page.getByRole('button', { name: 'Submit' }).click();

  // Verify via API
  const response = await request.get('http://localhost:8080/items');
  const items = await response.json();

  const createdItem = items.find(item => item.name === 'UI Created Item');
  expect(createdItem).toBeDefined();
  expect(createdItem.price).toBe(59.99);
});
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
