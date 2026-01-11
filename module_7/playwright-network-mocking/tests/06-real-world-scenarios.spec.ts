import { test, expect } from '@playwright/test';

/**
 * Example 6: Real-World Scenarios
 *
 * Demonstrates practical use cases for network mocking:
 * - Testing error handling
 * - Testing loading states
 * - Testing empty states
 * - Testing authentication flows
 */

test.describe('Real-World Scenarios', () => {

  test('Test loading state with delayed response', async ({ page }) => {
    await page.route('**/api/items', async route => {
      // Simulate slow network
      await page.waitForTimeout(2000);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Item 1' }
        ])
      });
    });

    await page.goto('https://example.com');

    // In a real app, you would check for loading spinner
    // await expect(page.getByTestId('loading-spinner')).toBeVisible();
    // await expect(page.getByTestId('loading-spinner')).not.toBeVisible();
  });

  test('Test empty state when no data is returned', async ({ page }) => {
    await page.route('**/api/items', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.goto('https://example.com');

    // In a real app, verify empty state message
    // await expect(page.getByText('No items found')).toBeVisible();
  });

  test('Test error handling for 404', async ({ page }) => {
    await page.route('**/api/items/**', route => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Not Found',
          message: 'The requested item does not exist'
        })
      });
    });

    await page.goto('https://example.com');

    // In a real app, verify error message
    // await expect(page.getByText('Item not found')).toBeVisible();
  });

  test('Test error handling for 500 server error', async ({ page }) => {
    await page.route('**/api/items', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: 'Something went wrong on our end'
        })
      });
    });

    await page.goto('https://example.com');

    // In a real app, verify error message
    // await expect(page.getByText('Something went wrong')).toBeVisible();
  });

  test('Test network failure', async ({ page }) => {
    await page.route('**/api/items', route => {
      route.abort('failed');
    });

    await page.goto('https://example.com');

    // In a real app, verify network error message
    // await expect(page.getByText('Network error')).toBeVisible();
  });

  test('Mock successful login flow', async ({ page }) => {
    await page.route('**/api/login', route => {
      const postData = route.request().postDataJSON();

      if (postData?.email === 'test@example.com' && postData?.password === 'password123') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            token: 'mock-jwt-token',
            user: {
              id: 1,
              email: 'test@example.com',
              name: 'Test User'
            }
          })
        });
      } else {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Unauthorized',
            message: 'Invalid email or password'
          })
        });
      }
    });

    await page.goto('https://example.com');
  });

  test('Mock registration with validation errors', async ({ page }) => {
    await page.route('**/api/register', route => {
      const postData = route.request().postDataJSON();

      // Validate email format
      if (!postData?.email?.includes('@')) {
        route.fulfill({
          status: 400,
          body: JSON.stringify({
            error: 'Validation Error',
            message: 'Invalid email format',
            field: 'email'
          })
        });
        return;
      }

      // Validate password length
      if (postData?.password?.length < 8) {
        route.fulfill({
          status: 400,
          body: JSON.stringify({
            error: 'Validation Error',
            message: 'Password must be at least 8 characters',
            field: 'password'
          })
        });
        return;
      }

      // Success
      route.fulfill({
        status: 201,
        body: JSON.stringify({
          success: true,
          user: {
            id: 1,
            email: postData.email
          }
        })
      });
    });

    await page.goto('https://example.com');
  });

  test('Test pagination with mock data', async ({ page }) => {
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
          price: (Math.random() * 1000).toFixed(2)
        })
      );

      route.fulfill({
        status: 200,
        body: JSON.stringify({
          items,
          pagination: {
            page,
            limit,
            total: totalItems,
            totalPages: Math.ceil(totalItems / limit)
          }
        })
      });
    });

    await page.goto('https://example.com');

    // In a real app, test pagination controls
    // await page.getByText('Next').click();
    // await expect(page.getByText('Item 11')).toBeVisible();
  });

  test('Test search functionality with mock results', async ({ page }) => {
    await page.route('**/api/search*', route => {
      const url = new URL(route.request().url());
      const query = url.searchParams.get('q') || '';

      // Mock search results based on query
      const allItems = [
        { id: 1, name: 'Laptop', category: 'Electronics' },
        { id: 2, name: 'Mouse', category: 'Electronics' },
        { id: 3, name: 'Desk', category: 'Furniture' },
        { id: 4, name: 'Chair', category: 'Furniture' },
      ];

      const results = allItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

      route.fulfill({
        status: 200,
        body: JSON.stringify({
          query,
          results,
          total: results.length
        })
      });
    });

    await page.goto('https://example.com');
  });

  test('Test rate limiting error', async ({ page }) => {
    let requestCount = 0;

    await page.route('**/api/**', route => {
      requestCount++;

      if (requestCount > 5) {
        route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: 60
          }),
          headers: {
            'Retry-After': '60'
          }
        });
      } else {
        route.continue();
      }
    });

    await page.goto('https://example.com');

    // In a real app, verify rate limit message
    // await expect(page.getByText('Rate limit exceeded')).toBeVisible();
  });

  test('Mock file upload', async ({ page }) => {
    await page.route('**/api/upload', route => {
      const contentType = route.request().headers()['content-type'];

      if (contentType?.includes('multipart/form-data')) {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            file: {
              id: 'mock-file-id',
              name: 'uploaded-file.jpg',
              size: 12345,
              url: 'https://example.com/files/mock-file-id'
            }
          })
        });
      } else {
        route.fulfill({
          status: 400,
          body: JSON.stringify({
            error: 'Bad Request',
            message: 'File upload required'
          })
        });
      }
    });

    await page.goto('https://example.com');
  });
});
