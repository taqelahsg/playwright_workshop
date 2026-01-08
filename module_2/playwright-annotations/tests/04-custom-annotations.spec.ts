import { test, expect } from '@playwright/test';

/**
 * Custom Annotations Examples
 *
 * This file demonstrates how to use custom annotations for:
 * - Issue tracking
 * - Documentation
 * - Performance expectations
 * - Team ownership
 * - Review status
 */

// Single custom annotation - Issue tracking
test('user profile update', {
  annotation: {
    type: 'issue',
    description: 'https://github.com/myproject/issues/123',
  },
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Multiple custom annotations
test('checkout flow', {
  annotation: [
    { type: 'issue', description: 'https://github.com/myproject/issues/456' },
    { type: 'performance', description: 'Should complete under 5 seconds' },
    { type: 'owner', description: 'team-payments' },
  ],
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

// Documentation annotation
test('complex business logic', {
  annotation: {
    type: 'documentation',
    description: 'Tests the discount calculation algorithm - see WIKI-789',
  },
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Performance expectations
test('page load performance', {
  annotation: {
    type: 'performance',
    description: 'Page should load in under 2 seconds',
  },
}, async ({ page }) => {
  const startTime = Date.now();
  await page.goto('https://example.com');
  const loadTime = Date.now() - startTime;

  console.log(`Page loaded in ${loadTime}ms`);
  await expect(page).toHaveTitle(/Example/);
});

// Team ownership
test('authentication flow', {
  annotation: {
    type: 'owner',
    description: 'team-auth',
  },
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Review status
test('new feature - needs review', {
  annotation: {
    type: 'review-status',
    description: 'Pending code review',
  },
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Flaky test tracking
test('potentially flaky test', {
  annotation: [
    { type: 'flaky', description: 'Under investigation - seen intermittent failures' },
    { type: 'issue', description: 'https://github.com/myproject/issues/789' },
  ],
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Test coverage annotation
test('shopping cart calculation', {
  annotation: [
    { type: 'coverage', description: 'Covers CART-001, CART-002, CART-003' },
    { type: 'requirements', description: 'REQ-CART-100' },
  ],
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

// External dependency
test('third-party API integration', {
  annotation: [
    { type: 'external-dependency', description: 'Stripe API v3' },
    { type: 'documentation', description: 'https://stripe.com/docs/api' },
  ],
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Browser compatibility note
test('CSS Grid layout', {
  annotation: {
    type: 'browser-compat',
    description: 'Requires modern browsers - IE11 not supported',
  },
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Test priority and category
test('critical path test', {
  annotation: [
    { type: 'priority', description: 'P0 - Critical' },
    { type: 'category', description: 'smoke-test' },
    { type: 'sla', description: 'Must pass before deployment' },
  ],
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

// Known limitation
test('file upload feature', {
  annotation: {
    type: 'limitation',
    description: 'Maximum file size is 10MB',
  },
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Test data dependency
test('user with specific permissions', {
  annotation: {
    type: 'test-data',
    description: 'Requires admin user in test database',
  },
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Security test annotation
test('SQL injection protection', {
  annotation: [
    { type: 'security', description: 'OWASP A1 - Injection' },
    { type: 'compliance', description: 'SOC2 requirement' },
  ],
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Accessibility annotation
test('WCAG compliance', {
  annotation: [
    { type: 'accessibility', description: 'WCAG 2.1 Level AA' },
    { type: 'standards', description: 'Section 508' },
  ],
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Test environment requirement
test('requires production-like data', {
  annotation: {
    type: 'environment',
    description: 'Needs staging environment with full dataset',
  },
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

// Automation status
test('newly automated test', {
  annotation: [
    { type: 'automation-status', description: 'Automated in Sprint 23' },
    { type: 'previous-status', description: 'Was manual test MANUAL-456' },
  ],
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Multiple issue tracking
test('fixes multiple bugs', {
  annotation: [
    { type: 'fixes', description: 'BUG-123' },
    { type: 'fixes', description: 'BUG-124' },
    { type: 'fixes', description: 'BUG-125' },
  ],
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});

// Test with comprehensive metadata
test('comprehensive annotation example', {
  annotation: [
    { type: 'issue', description: 'https://github.com/myproject/issues/999' },
    { type: 'owner', description: 'team-core' },
    { type: 'priority', description: 'P1 - High' },
    { type: 'category', description: 'regression' },
    { type: 'performance', description: 'Expected runtime: <3s' },
    { type: 'documentation', description: 'https://docs.internal/test-999' },
  ],
}, async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
  await expect(page.locator('h1')).toBeVisible();
});

// Test group with custom annotations
test.describe('Payment Processing Suite', () => {
  test('credit card payment', {
    annotation: [
      { type: 'issue', description: 'PAY-100' },
      { type: 'owner', description: 'team-payments' },
    ],
  }, async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('refund processing', {
    annotation: [
      { type: 'issue', description: 'PAY-101' },
      { type: 'owner', description: 'team-payments' },
      { type: 'performance', description: 'Should complete within 5s' },
    ],
  }, async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page.locator('h1')).toBeVisible();
  });
});
