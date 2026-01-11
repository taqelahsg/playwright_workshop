import { test, expect } from '@playwright/test';

/**
 * Example 7: Advanced Patterns
 *
 * Demonstrates advanced network mocking techniques:
 * - Conditional mocking
 * - State management in mocks
 * - Chaining requests
 * - Performance testing
 */

test.describe('Advanced Patterns', () => {

  test('Conditional mocking based on environment', async ({ page }) => {
    const useMocks = process.env.USE_MOCKS !== 'false'; // Default to true

    if (useMocks) {
      await page.route('**/api/items', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([
            { id: 1, name: 'Mocked Item', source: 'mock' }
          ])
        });
      });
    }

    await page.goto('https://example.com');
  });

  test('Stateful mock - simulate CRUD operations', async ({ page }) => {
    // In-memory store for mock data
    let items = [
      { id: 1, name: 'Initial Item 1', price: 100 },
      { id: 2, name: 'Initial Item 2', price: 200 }
    ];
    let nextId = 3;

    await page.route('**/api/items', route => {
      const method = route.request().method();

      if (method === 'GET') {
        // Return all items
        route.fulfill({
          status: 200,
          body: JSON.stringify(items)
        });
      } else if (method === 'POST') {
        // Create new item
        const newItem = { ...route.request().postDataJSON(), id: nextId++ };
        items.push(newItem);
        route.fulfill({
          status: 201,
          body: JSON.stringify(newItem)
        });
      } else {
        route.continue();
      }
    });

    await page.route('**/api/items/**', route => {
      const method = route.request().method();
      const url = route.request().url();
      const id = parseInt(url.split('/').pop() || '0');

      if (method === 'GET') {
        const item = items.find(i => i.id === id);
        if (item) {
          route.fulfill({ status: 200, body: JSON.stringify(item) });
        } else {
          route.fulfill({ status: 404, body: JSON.stringify({ error: 'Not found' }) });
        }
      } else if (method === 'PUT' || method === 'PATCH') {
        const index = items.findIndex(i => i.id === id);
        if (index !== -1) {
          items[index] = { ...items[index], ...route.request().postDataJSON() };
          route.fulfill({ status: 200, body: JSON.stringify(items[index]) });
        } else {
          route.fulfill({ status: 404, body: JSON.stringify({ error: 'Not found' }) });
        }
      } else if (method === 'DELETE') {
        const index = items.findIndex(i => i.id === id);
        if (index !== -1) {
          items.splice(index, 1);
          route.fulfill({ status: 200, body: JSON.stringify({ message: 'Deleted' }) });
        } else {
          route.fulfill({ status: 404, body: JSON.stringify({ error: 'Not found' }) });
        }
      }
    });

    await page.goto('https://example.com');

    // Now the app can interact with this stateful mock
  });

  test('Mock with request counter', async ({ page }) => {
    let requestCount = 0;

    await page.route('**/api/items', route => {
      requestCount++;

      route.fulfill({
        status: 200,
        body: JSON.stringify({
          items: [],
          meta: {
            requestNumber: requestCount,
            timestamp: new Date().toISOString()
          }
        })
      });
    });

    await page.goto('https://example.com');

    console.log(`Total API calls: ${requestCount}`);
  });

  test('Mock with delay based on data size', async ({ page }) => {
    await page.route('**/api/items', async route => {
      const mockItems = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`
      }));

      // Simulate network delay based on response size
      const responseSize = JSON.stringify(mockItems).length;
      const delay = Math.min(responseSize / 1000, 2000); // Max 2 seconds

      await page.waitForTimeout(delay);

      route.fulfill({
        status: 200,
        body: JSON.stringify(mockItems)
      });
    });

    await page.goto('https://example.com');
  });

  test('Mock with fallback to real API', async ({ page }) => {
    await page.route('**/api/items/**', async route => {
      const url = route.request().url();
      const itemId = url.split('/').pop();

      // Mock specific IDs, let others through
      if (itemId === '1' || itemId === '2') {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ id: itemId, name: `Mocked Item ${itemId}` })
        });
      } else {
        // Fall back to real API for other IDs
        await route.continue();
      }
    });

    await page.goto('https://example.com');
  });

  test('Test performance - measure response times', async ({ page }) => {
    const responseTimes: number[] = [];

    page.on('response', response => {
      if (response.url().includes('/api/')) {
        const timing = response.request().timing();
        if (timing) {
          responseTimes.push(timing.responseEnd);
        }
      }
    });

    await page.goto('https://example.com');

    if (responseTimes.length > 0) {
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      console.log(`Average API response time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(`Min: ${Math.min(...responseTimes).toFixed(2)}ms`);
      console.log(`Max: ${Math.max(...responseTimes).toFixed(2)}ms`);

      // Assert performance requirements
      expect(avgResponseTime).toBeLessThan(1000);
    }
  });

  test('Mock with rotating responses', async ({ page }) => {
    let callCount = 0;
    const responses = [
      [{ id: 1, name: 'Response 1' }],
      [{ id: 2, name: 'Response 2' }],
      [{ id: 3, name: 'Response 3' }]
    ];

    await page.route('**/api/items', route => {
      const responseData = responses[callCount % responses.length];
      callCount++;

      route.fulfill({
        status: 200,
        body: JSON.stringify(responseData)
      });
    });

    await page.goto('https://example.com');
  });

  test('Mock with probability-based failures', async ({ page }) => {
    const failureRate = 0.3; // 30% chance of failure

    await page.route('**/api/items', route => {
      if (Math.random() < failureRate) {
        // Simulate random failure
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Random server error' })
        });
      } else {
        route.fulfill({
          status: 200,
          body: JSON.stringify([{ id: 1, name: 'Item' }])
        });
      }
    });

    await page.goto('https://example.com');
  });

  test('Mock with request validation', async ({ page }) => {
    await page.route('**/api/items', route => {
      if (route.request().method() === 'POST') {
        const data = route.request().postDataJSON();

        // Validate required fields
        if (!data?.name || !data?.price) {
          route.fulfill({
            status: 400,
            body: JSON.stringify({
              error: 'Validation Error',
              message: 'Name and price are required',
              fields: {
                name: !data?.name ? 'Required field' : null,
                price: !data?.price ? 'Required field' : null
              }
            })
          });
          return;
        }

        // Validate data types
        if (typeof data.price !== 'number' || data.price <= 0) {
          route.fulfill({
            status: 400,
            body: JSON.stringify({
              error: 'Validation Error',
              message: 'Price must be a positive number'
            })
          });
          return;
        }

        // Success
        route.fulfill({
          status: 201,
          body: JSON.stringify({ ...data, id: Date.now() })
        });
      } else {
        route.continue();
      }
    });

    await page.goto('https://example.com');
  });

  test('Mock dependency chain - authenticate then fetch data', async ({ page }) => {
    let authToken: string | null = null;

    // Mock authentication
    await page.route('**/api/login', route => {
      authToken = 'mock-token-' + Date.now();
      route.fulfill({
        status: 200,
        body: JSON.stringify({ token: authToken })
      });
    });

    // Mock protected endpoint - requires auth
    await page.route('**/api/protected/**', route => {
      const headers = route.request().headers();

      if (headers['authorization'] === `Bearer ${authToken}`) {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ data: 'Protected data' })
        });
      } else {
        route.fulfill({
          status: 401,
          body: JSON.stringify({ error: 'Unauthorized' })
        });
      }
    });

    await page.goto('https://example.com');
  });

  test('Record and replay network interactions', async ({ page }) => {
    // Recording mode - save interactions
    const recordings: Array<{
      url: string;
      method: string;
      response: any;
    }> = [];

    await page.route('**/api/**', async route => {
      const response = await route.fetch();
      const body = await response.text();

      recordings.push({
        url: route.request().url(),
        method: route.request().method(),
        response: body
      });

      await route.fulfill({ response, body });
    });

    await page.goto('https://example.com');

    console.log(`Recorded ${recordings.length} interactions`);

    // In a real scenario, you would save these recordings to a file
    // and replay them in subsequent test runs
  });
});
