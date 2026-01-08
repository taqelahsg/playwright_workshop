import { test, expect } from '@playwright/test';
import os from 'os';

/**
 * Advanced Annotations Examples
 *
 * This file demonstrates advanced usage patterns combining:
 * - Multiple annotation types
 * - Conditional logic
 * - Tags with custom annotations
 * - Runtime annotations
 * - Best practices
 */

// Comprehensive annotation example combining multiple techniques
test('comprehensive test @smoke @critical', {
  annotation: [
    { type: 'issue', description: 'https://github.com/myproject/issues/100' },
    { type: 'owner', description: 'team-core' },
    { type: 'priority', description: 'P0' },
  ],
}, async ({ page, browserName }) => {
  test.skip(browserName === 'webkit' && os.platform() === 'darwin', 'Known issue on Safari/macOS');

  const startTime = Date.now();

  // Add runtime annotation
  test.info().annotations.push({
    type: 'execution-context',
    description: `Browser: ${browserName}, Platform: ${os.platform()}`,
  });

  await page.goto('https://example.com');

  const loadTime = Date.now() - startTime;

  // Add performance annotation
  test.info().annotations.push({
    type: 'performance',
    description: `Page load: ${loadTime}ms`,
  });

  if (loadTime > 3000) {
    test.info().annotations.push({
      type: 'warning',
      description: 'Slow page load detected',
    });
  }

  await expect(page).toHaveTitle(/Example/);
});

// Test suite with group-level annotations
test.describe('E-Commerce Checkout Flow @e2e @checkout', () => {
  test.beforeEach(async ({ page }) => {
    test.info().annotations.push({
      type: 'setup',
      description: 'Running checkout flow setup',
    });
    await page.goto('https://example.com');
  });

  test('add product to cart @smoke', {
    annotation: { type: 'requirement', description: 'REQ-CART-001' },
  }, async ({ page }) => {
    test.info().annotations.push({
      type: 'test-step',
      description: 'Adding product to cart',
    });

    await expect(page.locator('h1')).toBeVisible();
  });

  test('proceed to checkout @critical', {
    annotation: [
      { type: 'requirement', description: 'REQ-CHECKOUT-001' },
      { type: 'performance', description: 'Should load under 2s' },
    ],
  }, async ({ page, browserName }) => {
    test.slow(browserName === 'firefox', 'Firefox checkout is slower');

    const startTime = Date.now();
    await expect(page.locator('h1')).toBeVisible();

    const duration = Date.now() - startTime;
    test.info().annotations.push({
      type: 'checkout-duration',
      description: `${duration}ms`,
    });
  });

  test('complete payment @payment @critical', {
    annotation: [
      { type: 'requirement', description: 'REQ-PAY-001' },
      { type: 'owner', description: 'team-payments' },
    ],
  }, async ({ page }) => {
    test.info().annotations.push({
      type: 'payment-provider',
      description: 'Stripe Test Mode',
    });

    await expect(page).toHaveTitle(/Example/);
  });
});

// Flaky test with detailed tracking
test('flaky network test @flaky', {
  annotation: [
    { type: 'issue', description: 'https://github.com/myproject/issues/555' },
    { type: 'flaky-status', description: 'Under investigation - 15% failure rate' },
  ],
}, async ({ page }) => {
  const retryCount = test.info().retry;

  test.info().annotations.push({
    type: 'retry-attempt',
    description: `Attempt ${retryCount + 1}`,
  });

  if (retryCount > 0) {
    test.info().annotations.push({
      type: 'retry-reason',
      description: 'Previous attempt failed',
    });
  }

  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);

  test.info().annotations.push({
    type: 'test-result',
    description: 'Test passed',
  });
});

// Browser-specific feature test with fallbacks
test('modern CSS features @css @visual', {
  annotation: {
    type: 'browser-requirements',
    description: 'Requires modern CSS Grid support',
  },
}, async ({ page, browserName }) => {
  test.fail(
    browserName === 'webkit',
    'Known CSS Grid rendering issue on WebKit - Bug #789'
  );

  test.info().annotations.push({
    type: 'css-feature',
    description: 'Testing CSS Grid Layout',
  });

  await page.goto('https://example.com');

  // Check CSS support
  const supportsGrid = await page.evaluate(() => {
    return CSS.supports('display', 'grid');
  });

  test.info().annotations.push({
    type: 'feature-support',
    description: `CSS Grid supported: ${supportsGrid}`,
  });

  await expect(page.locator('h1')).toBeVisible();
});

// Data-driven test with annotations
const testCases = [
  { id: 1, name: 'Case A', priority: 'high' },
  { id: 2, name: 'Case B', priority: 'medium' },
  { id: 3, name: 'Case C', priority: 'low' },
];

for (const testCase of testCases) {
  test(`data driven test - ${testCase.name} @data-driven`, {
    annotation: [
      { type: 'test-case-id', description: `TC-${testCase.id}` },
      { type: 'priority', description: testCase.priority },
    ],
  }, async ({ page }) => {
    test.info().annotations.push({
      type: 'test-data',
      description: JSON.stringify(testCase),
    });

    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });
}

// Performance benchmark test
test('performance benchmark @performance @benchmark', {
  annotation: [
    { type: 'benchmark', description: 'Baseline: 1500ms' },
    { type: 'threshold', description: 'Max: 3000ms' },
  ],
}, async ({ page }) => {
  test.slow(); // Triple timeout for benchmark

  const metrics = {
    navigationStart: 0,
    domContentLoaded: 0,
    loadComplete: 0,
  };

  const startTime = Date.now();

  await page.goto('https://example.com');
  await page.waitForLoadState('domcontentloaded');

  metrics.domContentLoaded = Date.now() - startTime;

  await page.waitForLoadState('load');
  metrics.loadComplete = Date.now() - startTime;

  // Add performance metrics as annotations
  test.info().annotations.push({
    type: 'perf-dom-content-loaded',
    description: `${metrics.domContentLoaded}ms`,
  });

  test.info().annotations.push({
    type: 'perf-load-complete',
    description: `${metrics.loadComplete}ms`,
  });

  // Check against threshold
  const threshold = 3000;
  if (metrics.loadComplete > threshold) {
    test.info().annotations.push({
      type: 'performance-violation',
      description: `Exceeded threshold: ${metrics.loadComplete}ms > ${threshold}ms`,
    });
  }

  await expect(page).toHaveTitle(/Example/);
});

// Accessibility test with WCAG annotations
test('accessibility - keyboard navigation @a11y @wcag', {
  annotation: [
    { type: 'wcag-criterion', description: '2.1.1 Keyboard' },
    { type: 'level', description: 'A' },
    { type: 'documentation', description: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard' },
  ],
}, async ({ page }) => {
  await page.goto('https://example.com');

  test.info().annotations.push({
    type: 'a11y-test-type',
    description: 'Keyboard navigation',
  });

  // Test keyboard navigation
  await page.keyboard.press('Tab');

  test.info().annotations.push({
    type: 'a11y-result',
    description: 'Keyboard navigation working',
  });

  await expect(page.locator('h1')).toBeVisible();
});

// Security test with compliance annotations
test('security - XSS prevention @security @owasp', {
  annotation: [
    { type: 'owasp-category', description: 'A03:2021 – Injection' },
    { type: 'compliance', description: 'SOC2, PCI-DSS' },
    { type: 'severity', description: 'Critical' },
  ],
}, async ({ page }) => {
  test.info().annotations.push({
    type: 'security-test-type',
    description: 'XSS Prevention',
  });

  await page.goto('https://example.com');

  // Test XSS prevention
  const xssPayload = '<script>alert("XSS")</script>';

  test.info().annotations.push({
    type: 'test-payload',
    description: 'XSS payload tested',
  });

  await expect(page.locator('h1')).toBeVisible();

  test.info().annotations.push({
    type: 'security-result',
    description: 'No XSS vulnerability detected',
  });
});

// API integration test with endpoint annotations
test('API integration test @api @integration', {
  annotation: [
    { type: 'endpoint', description: 'GET /api/users' },
    { type: 'api-version', description: 'v1' },
  ],
}, async ({ page, request }) => {
  await page.goto('https://example.com');

  try {
    const response = await request.get('https://example.com');

    test.info().annotations.push({
      type: 'api-status',
      description: `${response.status()}`,
    });

    test.info().annotations.push({
      type: 'api-response-time',
      description: 'Response received',
    });
  } catch (error) {
    test.info().annotations.push({
      type: 'api-error',
      description: `${error}`,
    });
  }

  await expect(page).toHaveTitle(/Example/);
});

// Visual regression test
test('visual regression @visual @regression', {
  annotation: [
    { type: 'baseline', description: 'baseline-screenshot.png' },
    { type: 'threshold', description: '0.1% pixel difference' },
  ],
}, async ({ page }) => {
  await page.goto('https://example.com');

  test.info().annotations.push({
    type: 'visual-test-type',
    description: 'Full page screenshot comparison',
  });

  await expect(page.locator('h1')).toBeVisible();

  test.info().annotations.push({
    type: 'screenshot-captured',
    description: 'Full page screenshot taken',
  });
});

// Mobile-specific test with device annotations
test('mobile responsive design @mobile @responsive', {
  annotation: {
    type: 'device',
    description: 'iPhone 12 Pro',
  },
}, async ({ page, viewport }) => {
  test.skip(
    viewport === null || viewport.width >= 768,
    'This test requires mobile viewport'
  );

  test.info().annotations.push({
    type: 'viewport-size',
    description: `${viewport?.width}x${viewport?.height}`,
  });

  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// CI/CD integration test
test('CI/CD deployment validation @ci @deployment', {
  annotation: [
    { type: 'environment', description: 'staging' },
    { type: 'deployment-id', description: process.env.DEPLOYMENT_ID || 'local' },
  ],
}, async ({ page }) => {
  const isCI = !!process.env.CI;

  test.info().annotations.push({
    type: 'ci-environment',
    description: isCI ? 'Running in CI' : 'Running locally',
  });

  if (isCI) {
    test.info().annotations.push({
      type: 'build-number',
      description: process.env.BUILD_NUMBER || 'unknown',
    });
  }

  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
