import { test, expect } from '@playwright/test';

/**
 * Example 3: Modifying Requests
 *
 * Demonstrates how to modify requests before they're sent:
 * - Add/modify headers
 * - Change request method
 * - Modify request body
 * - Add authentication tokens
 */

test.describe('Modifying Requests', () => {

  test('Add authentication header to all API requests', async ({ page }) => {
    const modifiedRequests: string[] = [];

    await page.route('**/api/**', async route => {
      modifiedRequests.push(route.request().url());

      await route.continue({
        headers: {
          ...route.request().headers(),
          'Authorization': 'Bearer mock-test-token-12345',
          'X-Test-Mode': 'true'
        }
      });
    });

    await page.goto('https://example.com');

    console.log(`Modified ${modifiedRequests.length} API requests with auth header`);
  });

  test('Remove sensitive headers from requests', async ({ page }) => {
    await page.route('**/api/**', async route => {
      const headers = { ...route.request().headers() };

      // Remove sensitive headers
      delete headers['X-Secret-Key'];
      delete headers['X-Internal-Token'];
      delete headers['X-Debug-Info'];

      await route.continue({ headers });
    });

    await page.goto('https://example.com');
  });

  test('Add custom headers to specific requests', async ({ page }) => {
    await page.route('**/api/items', async route => {
      await route.continue({
        headers: {
          ...route.request().headers(),
          'X-Request-ID': `req-${Date.now()}`,
          'X-Client-Version': '1.0.0',
          'X-Platform': 'playwright-test'
        }
      });
    });

    await page.goto('https://example.com');
  });

  test('Modify request method from GET to POST', async ({ page }) => {
    let methodChanged = false;

    await page.route('**/api/search', route => {
      if (route.request().method() === 'GET') {
        methodChanged = true;
        route.continue({ method: 'POST' });
      } else {
        route.continue();
      }
    });

    await page.goto('https://example.com');

    console.log('Method changed:', methodChanged);
  });

  test('Modify POST request body', async ({ page }) => {
    await page.route('**/api/items', async route => {
      if (route.request().method() === 'POST') {
        const originalData = route.request().postDataJSON() || {};

        // Add metadata to request
        const modifiedData = {
          ...originalData,
          createdBy: 'test-automation',
          timestamp: new Date().toISOString(),
          testMode: true
        };

        await route.continue({
          postData: JSON.stringify(modifiedData)
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('https://example.com');
  });

  test('Add query parameters to API requests', async ({ page }) => {
    await page.route('**/api/items', route => {
      const url = new URL(route.request().url());

      // Add test parameters
      url.searchParams.set('test', 'true');
      url.searchParams.set('version', '1.0');

      route.continue({ url: url.toString() });
    });

    await page.goto('https://example.com');
  });

  test('Modify Content-Type header', async ({ page }) => {
    await page.route('**/api/**', async route => {
      await route.continue({
        headers: {
          ...route.request().headers(),
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    });

    await page.goto('https://example.com');
  });

  test('Add user agent header', async ({ page }) => {
    await page.route('**/api/**', async route => {
      await route.continue({
        headers: {
          ...route.request().headers(),
          'User-Agent': 'Playwright-Test-Bot/1.0'
        }
      });
    });

    await page.goto('https://example.com');
  });

  test('Modify request based on condition', async ({ page }) => {
    const isTestMode = process.env.TEST_MODE === 'true';

    await page.route('**/api/**', async route => {
      if (isTestMode) {
        await route.continue({
          headers: {
            ...route.request().headers(),
            'X-Test-Environment': 'automated-testing'
          }
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('https://example.com');
  });

  test('Add correlation ID to all requests', async ({ page }) => {
    const correlationId = `test-${Date.now()}-${Math.random()}`;

    await page.route('**/*', async route => {
      await route.continue({
        headers: {
          ...route.request().headers(),
          'X-Correlation-ID': correlationId
        }
      });
    });

    await page.goto('https://example.com');

    console.log('Correlation ID:', correlationId);
  });
});
