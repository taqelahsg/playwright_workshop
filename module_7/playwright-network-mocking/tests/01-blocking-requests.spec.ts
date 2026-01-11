import { test, expect } from '@playwright/test';

/**
 * Example 1: Blocking Requests
 *
 * Demonstrates how to block specific types of requests to:
 * - Speed up tests
 * - Reduce bandwidth usage
 * - Prevent third-party scripts from running
 */

test.describe('Blocking Requests', () => {

  test('Block all images to speed up page load', async ({ page }) => {
    // Track blocked requests
    const blockedImages: string[] = [];

    await page.route('**/*', route => {
      if (route.request().resourceType() === 'image') {
        blockedImages.push(route.request().url());
        return route.abort();
      }
      return route.continue();
    });

    await page.goto('https://example.com');

    console.log(`Blocked ${blockedImages.length} images`);
    expect(blockedImages.length).toBeGreaterThanOrEqual(0);
  });

  test('Block CSS files', async ({ page }) => {
    const blockedCSS: string[] = [];

    await page.route(/\.css$/, route => {
      blockedCSS.push(route.request().url());
      return route.abort();
    });

    await page.goto('https://example.com');

    console.log(`Blocked ${blockedCSS.length} CSS files`);
  });

  test('Block JavaScript files', async ({ page }) => {
    const blockedJS: string[] = [];

    await page.route(/\.js$/, route => {
      blockedJS.push(route.request().url());
      return route.abort();
    });

    await page.goto('https://example.com');

    console.log(`Blocked ${blockedJS.length} JS files`);
  });

  test('Block multiple file types (images, fonts, media)', async ({ page }) => {
    const blockedResources: string[] = [];

    await page.route('**/*', route => {
      const resourceType = route.request().resourceType();

      if (['image', 'font', 'media'].includes(resourceType)) {
        blockedResources.push(`${resourceType}: ${route.request().url()}`);
        return route.abort();
      }

      return route.continue();
    });

    await page.goto('https://example.com');

    console.log('Blocked resources:', blockedResources);
  });

  test('Block third-party analytics and tracking', async ({ page }) => {
    const blockedTrackers: string[] = [];
    const trackingDomains = [
      'google-analytics.com',
      'googletagmanager.com',
      'doubleclick.net',
      'facebook.com',
      'facebook.net'
    ];

    await page.route('**/*', route => {
      const url = route.request().url();

      if (trackingDomains.some(domain => url.includes(domain))) {
        blockedTrackers.push(url);
        return route.abort();
      }

      return route.continue();
    });

    await page.goto('https://example.com');

    console.log(`Blocked ${blockedTrackers.length} tracking requests`);
  });

  test('Block by file extension pattern', async ({ page }) => {
    // Block images with specific extensions
    await page.route(/\.(png|jpg|jpeg|gif|svg|webp)$/i, route => {
      return route.abort();
    });

    await page.goto('https://example.com');

    // Page should load but without images
    await expect(page).toHaveTitle(/Example/);
  });

  test('Block specific API endpoint', async ({ page }) => {
    let apiBlocked = false;

    await page.route('**/api/analytics/**', route => {
      apiBlocked = true;
      return route.abort();
    });

    await page.goto('https://example.com');

    // Note: example.com might not have this endpoint
    console.log('Analytics API blocked:', apiBlocked);
  });
});
