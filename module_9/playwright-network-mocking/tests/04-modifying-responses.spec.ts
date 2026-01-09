import { test, expect } from '@playwright/test';

/**
 * Example 4: Modifying Responses
 *
 * Demonstrates how to fetch real responses and modify them:
 * - Fetch and modify response body
 * - Add fields to JSON responses
 * - Modify response headers
 * - Simulate slow responses
 */

test.describe('Modifying Responses', () => {

  test('Fetch real response and modify text', async ({ page }) => {
    await page.route('**/*', async route => {
      // Only modify the main HTML document
      if (route.request().resourceType() === 'document') {
        // Fetch the real response
        const response = await route.fetch();

        // Get response body as text
        let body = await response.text();

        // Modify the text
        body = body.replace(/Example Domain/g, 'Modified Example Domain');

        // Return modified response
        await route.fulfill({
          response,
          body
        });
      } else {
        // Let other resources through
        await route.continue();
      }
    });

    await page.goto('https://example.com');

    // Verify modification
    await expect(page.locator('h1')).toContainText('Modified');
  });

  test('Add custom fields to JSON response', async ({ page }) => {
    await page.route('**/api/items', async route => {
      const response = await route.fetch();
      const json = await response.json();

      // Add metadata to each item
      const modifiedJson = Array.isArray(json)
        ? json.map(item => ({
            ...item,
            isMocked: true,
            mockedAt: new Date().toISOString(),
            testEnvironment: 'playwright'
          }))
        : json;

      await route.fulfill({
        response,
        body: JSON.stringify(modifiedJson)
      });
    });

    await page.goto('https://example.com');
  });

  test('Add custom response headers', async ({ page }) => {
    await page.route('**/api/items', async route => {
      const response = await route.fetch();

      await route.fulfill({
        response,
        headers: {
          ...response.headers(),
          'X-Custom-Header': 'Modified-Response',
          'X-Modified-At': new Date().toISOString(),
          'X-Test-Mode': 'true'
        }
      });
    });

    await page.goto('https://example.com');
  });

  test('Simulate slow API response', async ({ page }) => {
    await page.route('**/api/items', async route => {
      // Wait 3 seconds before responding
      await new Promise(resolve => setTimeout(resolve, 3000));

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Delayed Item' }
        ])
      });
    });

    const startTime = Date.now();
    await page.goto('https://example.com');
    const endTime = Date.now();

    console.log(`Page loaded in ${endTime - startTime}ms (with 3s API delay)`);
  });

  test('Modify response status code', async ({ page }) => {
    await page.route('**/api/items', async route => {
      const response = await route.fetch();
      const body = await response.text();

      // Change 200 to 201
      await route.fulfill({
        status: 201,
        headers: response.headers(),
        body
      });
    });

    await page.goto('https://example.com');
  });

  test('Transform response data structure', async ({ page }) => {
    await page.route('**/api/items', async route => {
      const response = await route.fetch();
      const items = await response.json();

      // Transform from array to paginated response
      const transformedResponse = {
        data: items,
        pagination: {
          total: Array.isArray(items) ? items.length : 0,
          page: 1,
          pageSize: 10
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: 'v2'
        }
      };

      await route.fulfill({
        response,
        body: JSON.stringify(transformedResponse)
      });
    });

    await page.goto('https://example.com');
  });

  test('Filter response data', async ({ page }) => {
    await page.route('**/api/items', async route => {
      const response = await route.fetch();
      const items = await response.json();

      // Filter items - only show items with quantity > 10
      const filteredItems = Array.isArray(items)
        ? items.filter((item: any) => item.quantity > 10)
        : items;

      await route.fulfill({
        response,
        body: JSON.stringify(filteredItems)
      });
    });

    await page.goto('https://example.com');
  });

  test('Sort response data', async ({ page }) => {
    await page.route('**/api/items', async route => {
      const response = await route.fetch();
      const items = await response.json();

      // Sort items by price (descending)
      const sortedItems = Array.isArray(items)
        ? [...items].sort((a: any, b: any) => b.price - a.price)
        : items;

      await route.fulfill({
        response,
        body: JSON.stringify(sortedItems)
      });
    });

    await page.goto('https://example.com');
  });

  test('Add timestamps to response', async ({ page }) => {
    await page.route('**/api/items', async route => {
      const fetchStart = Date.now();
      const response = await route.fetch();
      const fetchEnd = Date.now();

      const body = await response.text();

      await route.fulfill({
        response,
        headers: {
          ...response.headers(),
          'X-Fetch-Duration': `${fetchEnd - fetchStart}ms`,
          'X-Response-Time': new Date().toISOString()
        },
        body
      });
    });

    await page.goto('https://example.com');
  });

  test('Combine real and mock data', async ({ page }) => {
    await page.route('**/api/items', async route => {
      const response = await route.fetch();
      const realItems = await response.json();

      // Add some mock items to real data
      const mockItems = [
        { id: 999, name: 'Mock Item 1', price: 99.99, quantity: 10 },
        { id: 1000, name: 'Mock Item 2', price: 149.99, quantity: 5 }
      ];

      const combinedData = Array.isArray(realItems)
        ? [...realItems, ...mockItems]
        : realItems;

      await route.fulfill({
        response,
        body: JSON.stringify(combinedData)
      });
    });

    await page.goto('https://example.com');
  });
});
