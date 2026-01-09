import { test, expect } from '@playwright/test';

/**
 * Example 8: Real-World Scenario - E-commerce Testing
 *
 * This example demonstrates parallel execution with realistic test scenarios
 * that you might encounter in a production application.
 */

test.describe('E-commerce homepage tests', () => {
  test('verify homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
    await expect(page.locator('nav')).toBeVisible();
    console.log('Homepage verified');
  });

  test('verify search functionality exists', async ({ page }) => {
    await page.goto('/');
    // Check for search elements
    const searchButton = page.locator('button[aria-label*="Search"], button:has-text("Search")').first();
    await expect(searchButton).toBeVisible();
    console.log('Search functionality verified');
  });

  test('verify navigation menu', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    console.log('Navigation menu verified');
  });

  test('verify footer content', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    console.log('Footer verified');
  });
});

test.describe('Documentation navigation tests', () => {
  test('navigate to getting started', async ({ page }) => {
    await page.goto('/docs/intro');
    await expect(page.locator('h1')).toContainText('Installation');
    console.log('Getting started page loaded');
  });

  test('navigate to API documentation', async ({ page }) => {
    await page.goto('/docs/api/class-playwright');
    await expect(page.locator('h1')).toBeVisible();
    console.log('API documentation loaded');
  });

  test('navigate to guides', async ({ page }) => {
    await page.goto('/docs/intro');
    await expect(page).toHaveURL(/.*docs.*/);
    console.log('Guides page loaded');
  });
});

test.describe('Community section tests', () => {
  test('verify community welcome page', async ({ page }) => {
    await page.goto('/community/welcome');
    await expect(page.locator('h1')).toBeVisible();
    console.log('Community welcome page verified');
  });

  test('check for community links', async ({ page }) => {
    await page.goto('/community/welcome');
    // Verify page content loads - use .first() to avoid strict mode violation
    await expect(page.locator('main, article, [role="main"]').first()).toBeVisible();
    console.log('Community links verified');
  });
});

test.describe.serial('User journey - serial execution', () => {
  /**
   * This describe block uses serial mode because the tests represent
   * a sequential user journey where each step depends on the previous one.
   */

  let sharedPageUrl: string;

  test('step 1: user lands on homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
    sharedPageUrl = page.url();
    console.log('Step 1: User landed on homepage:', sharedPageUrl);
  });

  test('step 2: user navigates to docs', async ({ page }) => {
    console.log('Step 2: Starting from:', sharedPageUrl);
    await page.goto('/');
    await page.click('text=Docs');
    await expect(page).toHaveURL(/.*docs.*/);
    console.log('Step 2: User navigated to docs');
  });

  test('step 3: user explores API reference', async ({ page }) => {
    console.log('Step 3: Continuing user journey');
    await page.goto('/docs/api/class-playwright');
    await expect(page.locator('h1')).toBeVisible();
    console.log('Step 3: User viewing API reference');
  });
});

test.describe('Performance tests - controlled parallelism', () => {
  // Limit parallelism for performance tests to avoid resource contention
  test.describe.configure({ mode: 'serial' });

  test('measure homepage load time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    console.log(`Homepage load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
  });

  test('measure docs page load time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/docs/intro');
    const loadTime = Date.now() - startTime;
    console.log(`Docs page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000);
  });

  test('measure API page load time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/docs/api/class-playwright');
    const loadTime = Date.now() - startTime;
    console.log(`API page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000);
  });
});

test.describe('Responsive design tests', () => {
  /**
   * These tests run in parallel to verify responsive behavior
   * across different viewport sizes simultaneously.
   */

  test('verify desktop layout', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
    console.log('Desktop layout verified');
  });

  test('verify tablet layout', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
    console.log('Tablet layout verified');
  });

  test('verify mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
    console.log('Mobile layout verified');
  });
});

test.describe('Accessibility tests', () => {
  test('verify page has proper heading structure', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    console.log('Heading structure verified');
  });

  test('verify navigation is accessible', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible();
    console.log('Navigation accessibility verified');
  });

  test('verify main content is accessible', async ({ page }) => {
    await page.goto('/');
    const main = page.locator('main, [role="main"]').first();
    await expect(main).toBeVisible();
    console.log('Main content accessibility verified');
  });
});
