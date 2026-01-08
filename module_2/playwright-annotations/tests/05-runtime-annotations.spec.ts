import { test, expect } from '@playwright/test';

/**
 * Runtime Annotations Examples
 *
 * This file demonstrates how to add annotations dynamically during test execution
 * using test.info().annotations.push()
 */

// Add annotation during test execution
test('basic runtime annotation', async ({ page }) => {
  // Add annotation at runtime
  test.info().annotations.push({
    type: 'runtime-info',
    description: 'This annotation was added during test execution',
  });

  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

// Add browser version as annotation
test('capture browser version', async ({ page, browserName }) => {
  await page.goto('https://example.com');

  const userAgent = await page.evaluate(() => navigator.userAgent);

  test.info().annotations.push({
    type: 'browser-version',
    description: userAgent,
  });

  test.info().annotations.push({
    type: 'browser-name',
    description: browserName,
  });

  await expect(page).toHaveTitle(/Example/);
});

// Performance tracking with runtime annotations
test('performance monitoring', async ({ page }) => {
  const startTime = Date.now();

  await page.goto('https://example.com');

  const loadTime = Date.now() - startTime;

  // Add performance annotation
  test.info().annotations.push({
    type: 'performance',
    description: `Page load time: ${loadTime}ms`,
  });

  // Add warning if slow
  if (loadTime > 3000) {
    test.info().annotations.push({
      type: 'performance-warning',
      description: `Slow page load detected: ${loadTime}ms`,
    });
  }

  await expect(page.locator('h1')).toBeVisible();
});

// Conditional runtime annotations based on test results
test('conditional annotation based on element state', async ({ page }) => {
  await page.goto('https://example.com');

  const h1Element = page.locator('h1');
  const isVisible = await h1Element.isVisible();

  if (isVisible) {
    test.info().annotations.push({
      type: 'element-state',
      description: 'H1 element is visible',
    });
  } else {
    test.info().annotations.push({
      type: 'element-state',
      description: 'H1 element is NOT visible',
    });
  }

  await expect(h1Element).toBeVisible();
});

// Track test data used
test('track test data', async ({ page }) => {
  const testEmail = `test-${Date.now()}@example.com`;

  test.info().annotations.push({
    type: 'test-data',
    description: `Email used: ${testEmail}`,
  });

  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

// Multiple runtime annotations
test('multiple runtime annotations', async ({ page, browserName }) => {
  const testId = `test-${Date.now()}`;
  const startTime = Date.now();

  // Add test ID
  test.info().annotations.push({
    type: 'test-id',
    description: testId,
  });

  // Add environment info
  test.info().annotations.push({
    type: 'environment',
    description: process.env.NODE_ENV || 'development',
  });

  await page.goto('https://example.com');

  const loadTime = Date.now() - startTime;

  // Add timing info
  test.info().annotations.push({
    type: 'timing',
    description: `Load time: ${loadTime}ms on ${browserName}`,
  });

  // Add viewport info
  const viewport = page.viewportSize();
  test.info().annotations.push({
    type: 'viewport',
    description: `${viewport?.width}x${viewport?.height}`,
  });

  await expect(page).toHaveTitle(/Example/);
});

// Add annotation based on API response
test('API response tracking', async ({ page, request }) => {
  await page.goto('https://example.com');

  // Simulate API call
  try {
    const response = await request.get('https://example.com');

    test.info().annotations.push({
      type: 'api-status',
      description: `Status: ${response.status()}`,
    });

    test.info().annotations.push({
      type: 'api-headers',
      description: `Content-Type: ${response.headers()['content-type']}`,
    });
  } catch (error) {
    test.info().annotations.push({
      type: 'api-error',
      description: `Error: ${error}`,
    });
  }

  await expect(page.locator('h1')).toBeVisible();
});

// Track error scenarios
test('error tracking with annotations', async ({ page }) => {
  try {
    await page.goto('https://example.com');

    // Try to find an element that might not exist
    const locator = page.locator('button[data-test="submit"]');
    const count = await locator.count();

    test.info().annotations.push({
      type: 'element-count',
      description: `Found ${count} submit buttons`,
    });

    if (count === 0) {
      test.info().annotations.push({
        type: 'warning',
        description: 'Submit button not found',
      });
    }
  } catch (error) {
    test.info().annotations.push({
      type: 'error',
      description: `Test error: ${error}`,
    });
  }

  await expect(page).toHaveTitle(/Example/);
});

// Network tracking
test('network activity tracking', async ({ page }) => {
  let requestCount = 0;
  let responseCount = 0;

  // Track requests
  page.on('request', () => requestCount++);
  page.on('response', () => responseCount++);

  await page.goto('https://example.com');
  await page.waitForLoadState('networkidle');

  test.info().annotations.push({
    type: 'network-requests',
    description: `Total requests: ${requestCount}`,
  });

  test.info().annotations.push({
    type: 'network-responses',
    description: `Total responses: ${responseCount}`,
  });

  await expect(page).toHaveTitle(/Example/);
});

// Screenshot on specific conditions
test('conditional screenshot annotation', async ({ page }) => {
  await page.goto('https://example.com');

  const h1Text = await page.locator('h1').textContent();

  test.info().annotations.push({
    type: 'page-content',
    description: `H1 text: ${h1Text}`,
  });

  if (h1Text?.includes('Example')) {
    test.info().annotations.push({
      type: 'validation',
      description: 'Expected content found',
    });
  }

  await expect(page.locator('h1')).toBeVisible();
});

// Dynamic test metadata
test('dynamic test metadata', async ({ page }) => {
  const timestamp = new Date().toISOString();

  test.info().annotations.push({
    type: 'execution-time',
    description: timestamp,
  });

  test.info().annotations.push({
    type: 'test-run-id',
    description: process.env.GITHUB_RUN_ID || 'local-run',
  });

  test.info().annotations.push({
    type: 'git-branch',
    description: process.env.GITHUB_REF || 'unknown',
  });

  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

// Console log tracking
test('console log tracking', async ({ page }) => {
  const consoleLogs: string[] = [];

  page.on('console', (msg) => {
    consoleLogs.push(`${msg.type()}: ${msg.text()}`);
  });

  await page.goto('https://example.com');

  // Execute some console logs
  await page.evaluate(() => {
    console.log('Test log message');
    console.warn('Test warning message');
  });

  await page.waitForTimeout(100);

  if (consoleLogs.length > 0) {
    test.info().annotations.push({
      type: 'console-logs',
      description: `Captured ${consoleLogs.length} console messages`,
    });
  }

  await expect(page.locator('h1')).toBeVisible();
});

// Retry tracking
test('retry tracking', async ({ page }) => {
  const retryCount = test.info().retry;

  test.info().annotations.push({
    type: 'retry-count',
    description: `Retry attempt: ${retryCount}`,
  });

  if (retryCount > 0) {
    test.info().annotations.push({
      type: 'retry-warning',
      description: 'Test was retried due to failure',
    });
  }

  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

// Combining static and runtime annotations
test('combined annotations', {
  annotation: {
    type: 'static-annotation',
    description: 'This was added at test definition',
  },
}, async ({ page, browserName }) => {
  // Add runtime annotation
  test.info().annotations.push({
    type: 'runtime-annotation',
    description: `Running on ${browserName}`,
  });

  const startTime = Date.now();
  await page.goto('https://example.com');
  const loadTime = Date.now() - startTime;

  test.info().annotations.push({
    type: 'performance',
    description: `Load time: ${loadTime}ms`,
  });

  await expect(page).toHaveTitle(/Example/);
});
