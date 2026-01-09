import { test, expect } from '@playwright/test';

/**
 * Example 2: Mocking API Responses
 *
 * Demonstrates how to mock API responses with custom data:
 * - Mock successful responses
 * - Mock error responses
 * - Mock with test data
 * - Mock dynamic responses
 */

test.describe('Mocking API Responses', () => {

  test('Mock empty API response', async ({ page }) => {
    // Mock API to return empty array
    await page.route('**/api/items', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    // Note: This would work with an actual app that calls this API
    // For demonstration, we're just setting up the route
    await page.goto('https://example.com');
  });

  test('Mock API response with test data', async ({ page }) => {
    const mockItems = [
      { id: 1, name: 'Laptop', price: 999.99, quantity: 5 },
      { id: 2, name: 'Mouse', price: 29.99, quantity: 20 },
      { id: 3, name: 'Keyboard', price: 79.99, quantity: 15 }
    ];

    await page.route('**/api/items', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockItems),
        headers: {
          'X-Mock-Response': 'true',
          'X-Total-Count': '3'
        }
      });
    });

    await page.goto('https://example.com');
  });

  test('Mock 404 Not Found error', async ({ page }) => {
    await page.route('**/api/items/999', route => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Not Found',
          message: 'Item with ID 999 does not exist',
          statusCode: 404
        })
      });
    });

    await page.goto('https://example.com');
  });

  test('Mock 500 Internal Server Error', async ({ page }) => {
    await page.route('**/api/items', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: 'Database connection failed',
          statusCode: 500
        })
      });
    });

    await page.goto('https://example.com');
  });

  test('Mock 401 Unauthorized error', async ({ page }) => {
    await page.route('**/api/protected/**', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Unauthorized',
          message: 'Authentication token is missing or invalid',
          statusCode: 401
        })
      });
    });

    await page.goto('https://example.com');
  });

  test('Mock different responses based on request method', async ({ page }) => {
    await page.route('**/api/items', route => {
      const method = route.request().method();

      if (method === 'GET') {
        route.fulfill({
          status: 200,
          body: JSON.stringify([{ id: 1, name: 'Item 1' }])
        });
      } else if (method === 'POST') {
        route.fulfill({
          status: 201,
          body: JSON.stringify({ id: 2, name: 'New Item', created: true })
        });
      } else {
        route.fulfill({
          status: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        });
      }
    });

    await page.goto('https://example.com');
  });

  test('Mock dynamic response based on URL parameters', async ({ page }) => {
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
          body: JSON.stringify({ error: 'Item not found' })
        });
      }
    });

    await page.goto('https://example.com');
  });

  test('Mock login response', async ({ page }) => {
    await page.route('**/api/login', route => {
      const postData = route.request().postDataJSON();

      // Check credentials (in real app, this would be validated)
      if (postData?.email && postData?.password) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            token: 'mock-jwt-token-12345',
            user: {
              id: 1,
              email: postData.email,
              name: 'Test User',
              role: 'admin'
            }
          })
        });
      } else {
        route.fulfill({
          status: 400,
          body: JSON.stringify({
            error: 'Bad Request',
            message: 'Email and password are required'
          })
        });
      }
    });

    await page.goto('https://example.com');
  });

  test('Mock paginated API response', async ({ page }) => {
    await page.route('**/api/items*', route => {
      const url = new URL(route.request().url());
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');

      const totalItems = 25;
      const startIndex = (page - 1) * limit;
      const endIndex = Math.min(startIndex + limit, totalItems);

      const items = Array.from(
        { length: endIndex - startIndex },
        (_, i) => ({
          id: startIndex + i + 1,
          name: `Item ${startIndex + i + 1}`,
          price: Math.random() * 1000
        })
      );

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            itemsPerPage: limit
          }
        })
      });
    });

    await page.goto('https://example.com');
  });
});
