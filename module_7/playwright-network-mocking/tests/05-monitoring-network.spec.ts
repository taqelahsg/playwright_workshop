import { test, expect } from '@playwright/test';

/**
 * Example 5: Monitoring Network Traffic
 *
 * Demonstrates how to monitor and track network activity:
 * - Listen to request/response events
 * - Wait for specific requests
 * - Track API calls
 * - Assert requests were made
 */

test.describe('Monitoring Network Traffic', () => {

  test('Log all network requests and responses', async ({ page }) => {
    const requests: string[] = [];
    const responses: { url: string; status: number }[] = [];

    // Listen to request events
    page.on('request', request => {
      requests.push(`${request.method()} ${request.url()}`);
      console.log('>>', request.method(), request.url());
    });

    // Listen to response events
    page.on('response', response => {
      responses.push({ url: response.url(), status: response.status() });
      console.log('<<', response.status(), response.url());
    });

    await page.goto('https://example.com');

    console.log(`\nTotal requests: ${requests.length}`);
    console.log(`Total responses: ${responses.length}`);

    expect(requests.length).toBeGreaterThan(0);
    expect(responses.length).toBeGreaterThan(0);
  });

  test('Track only API calls', async ({ page }) => {
    const apiCalls: Array<{
      method: string;
      url: string;
      headers: any;
      postData: string | null;
    }> = [];

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

    await page.goto('https://example.com');

    console.log('API calls made:', apiCalls.length);
    apiCalls.forEach((call, index) => {
      console.log(`${index + 1}. ${call.method} ${call.url}`);
    });
  });

  test('Wait for specific API response', async ({ page }) => {
    // Start waiting for response before triggering it
    const responsePromise = page.waitForResponse(
      response => response.url().includes('example.com') && response.status() === 200
    );

    await page.goto('https://example.com');

    // Wait for the response
    const response = await responsePromise;

    expect(response.status()).toBe(200);
    console.log('Received response from:', response.url());
  });

  test('Wait for multiple API responses', async ({ page }) => {
    const responses = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('example.com')),
      page.goto('https://example.com')
    ]);

    const response = responses[0];
    expect(response.status()).toBeLessThan(400);
  });

  test('Track request timing', async ({ page }) => {
    const timings: Array<{
      url: string;
      duration: number;
    }> = [];

    page.on('requestfinished', async request => {
      const response = await request.response();
      if (response) {
        const timing = response.request().timing();
        timings.push({
          url: request.url(),
          duration: timing?.responseEnd || 0
        });
      }
    });

    await page.goto('https://example.com');

    console.log('\nRequest timings:');
    timings.forEach(timing => {
      console.log(`${timing.url}: ${timing.duration.toFixed(2)}ms`);
    });
  });

  test('Verify specific API was called', async ({ page }) => {
    let apiCalled = false;
    let apiUrl = '';

    page.on('request', request => {
      if (request.url().includes('/api/items')) {
        apiCalled = true;
        apiUrl = request.url();
      }
    });

    await page.goto('https://example.com');
    await page.waitForTimeout(1000);

    console.log('API called:', apiCalled);
    if (apiCalled) {
      console.log('API URL:', apiUrl);
    }
  });

  test('Count requests by resource type', async ({ page }) => {
    const resourceCounts: Record<string, number> = {};

    page.on('request', request => {
      const type = request.resourceType();
      resourceCounts[type] = (resourceCounts[type] || 0) + 1;
    });

    await page.goto('https://example.com');

    console.log('\nRequests by resource type:');
    Object.entries(resourceCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  });

  test('Track failed requests', async ({ page }) => {
    const failedRequests: Array<{
      url: string;
      error: string;
    }> = [];

    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        error: request.failure()?.errorText || 'Unknown error'
      });
    });

    await page.goto('https://example.com');

    if (failedRequests.length > 0) {
      console.log('\nFailed requests:');
      failedRequests.forEach(req => {
        console.log(`  ${req.url}: ${req.error}`);
      });
    } else {
      console.log('No failed requests');
    }
  });

  test('Monitor requests with specific headers', async ({ page }) => {
    const authenticatedRequests: string[] = [];

    page.on('request', request => {
      const headers = request.headers();
      if (headers['authorization']) {
        authenticatedRequests.push(request.url());
      }
    });

    await page.goto('https://example.com');

    console.log(`Authenticated requests: ${authenticatedRequests.length}`);
  });

  test('Verify request body content', async ({ page }) => {
    const postRequests: Array<{
      url: string;
      body: any;
    }> = [];

    page.on('request', request => {
      if (request.method() === 'POST') {
        const postData = request.postData();
        postRequests.push({
          url: request.url(),
          body: postData
        });
      }
    });

    await page.goto('https://example.com');

    console.log(`POST requests: ${postRequests.length}`);
  });

  test('Track response sizes', async ({ page }) => {
    const responseSizes: Array<{
      url: string;
      size: number;
    }> = [];

    page.on('response', async response => {
      try {
        const body = await response.body();
        responseSizes.push({
          url: response.url(),
          size: body.length
        });
      } catch (e) {
        // Some responses can't be read
      }
    });

    await page.goto('https://example.com');

    const totalSize = responseSizes.reduce((sum, item) => sum + item.size, 0);
    console.log(`\nTotal response size: ${(totalSize / 1024).toFixed(2)} KB`);
  });
});
