# Lesson 2: Screenshot Comparison with toHaveScreenshot()

## Overview

`toHaveScreenshot()` is Playwright's primary method for visual regression testing. It captures a screenshot and compares it against a stored baseline image.

## Full Page Screenshots

### Basic Usage

```typescript
test('full page screenshot', async ({ page }) => {
  await page.goto('https://taqelah.sg/taqelah-demo-site.html');

  // Captures viewport
  await expect(page).toHaveScreenshot('login-page.png');
});
```

### Full Page (Including Scroll)

```typescript
test('full page with scroll', async ({ page }) => {
  await page.goto('https://example.com/long-page');

  await expect(page).toHaveScreenshot('full-page.png', {
    fullPage: true,  // Captures entire scrollable area
  });
});
```

## Element Screenshots

### Targeting Specific Elements

```typescript
test('element screenshot', async ({ page }) => {
  await page.goto('https://taqelah.sg/taqelah-demo-site.html');

  // Screenshot specific element
  const loginForm = page.locator('form').first();
  await expect(loginForm).toHaveScreenshot('login-form.png');

  // Header component
  const header = page.locator('header');
  await expect(header).toHaveScreenshot('header.png');
});
```

### Multiple Elements

```typescript
test('component gallery', async ({ page }) => {
  await page.goto('/components');

  const buttons = page.getByRole('button');
  const count = await buttons.count();

  for (let i = 0; i < count; i++) {
    await expect(buttons.nth(i)).toHaveScreenshot(`button-${i}.png`);
  }
});
```

## Configuration Options

### Threshold Settings

```typescript
await expect(page).toHaveScreenshot('page.png', {
  // Maximum number of pixels that can differ
  maxDiffPixels: 100,

  // OR percentage of pixels that can differ (0-1)
  maxDiffPixelRatio: 0.05,  // 5%

  // Color comparison sensitivity (0-1)
  // Lower = more strict, higher = more lenient
  threshold: 0.2,
});
```

### Animation Handling

```typescript
await expect(page).toHaveScreenshot('page.png', {
  // Disable CSS animations and transitions
  animations: 'disabled',

  // Wait for fonts to load
  timeout: 10000,

  // Additional wait after page load
  scale: 'css',  // or 'device'
});
```

### Viewport and Clipping

```typescript
test('specific viewport', async ({ page }) => {
  // Set consistent viewport
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto('/');

  await expect(page).toHaveScreenshot('desktop-view.png');
});

test('clipped region', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveScreenshot('clipped.png', {
    clip: {
      x: 0,
      y: 0,
      width: 500,
      height: 300,
    },
  });
});
```

## Handling Dynamic Content

### Masking Elements

```typescript
test('mask dynamic content', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [
      page.locator('.timestamp'),
      page.locator('.user-avatar'),
      page.locator('[data-testid="live-counter"]'),
    ],
  });
});
```

### Hiding Elements with CSS

```typescript
test('hide elements before screenshot', async ({ page }) => {
  await page.goto('/');

  // Inject CSS to hide elements
  await page.addStyleTag({
    content: `
      .ad-banner,
      .cookie-notice,
      .chat-widget {
        visibility: hidden !important;
      }
    `
  });

  await expect(page).toHaveScreenshot('page-clean.png');
});
```

### Waiting for Stability

```typescript
test('wait for content to stabilize', async ({ page }) => {
  await page.goto('/');

  // Wait for specific element
  await page.waitForSelector('.content-loaded');

  // Wait for network idle
  await page.waitForLoadState('networkidle');

  // Wait for animations
  await page.waitForTimeout(500);  // Last resort

  await expect(page).toHaveScreenshot('stable-page.png');
});
```

## Button and Interactive States

### Testing Different States

```typescript
test('button states', async ({ page }) => {
  await page.goto('/');

  const button = page.getByRole('button', { name: 'Submit' });

  // Default state
  await expect(button).toHaveScreenshot('button-default.png');

  // Hover state
  await button.hover();
  await expect(button).toHaveScreenshot('button-hover.png');

  // Focus state
  await button.focus();
  await expect(button).toHaveScreenshot('button-focus.png');

  // Disabled state
  await page.evaluate(() => {
    document.querySelector('button')?.setAttribute('disabled', 'true');
  });
  await expect(button).toHaveScreenshot('button-disabled.png');
});
```

## Responsive Testing

### Multiple Viewports

```typescript
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`homepage on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });

    await page.goto('/');

    await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`);
  });
}
```

## Configuration in playwright.config.ts

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    toHaveScreenshot: {
      // Default options for all screenshot assertions
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled',
    },
  },

  // Custom snapshot directory
  snapshotDir: './snapshots',

  // Snapshot path pattern
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',

  projects: [
    {
      name: 'chromium',
      use: {
        // Consistent viewport for visual tests
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
```

## Best Practices

1. **Use consistent viewports** - Set explicit viewport sizes
2. **Disable animations** - Prevents flaky tests
3. **Mask dynamic content** - Timestamps, avatars, ads
4. **Run on consistent environment** - Same OS in CI
5. **Use meaningful names** - `login-form.png` not `test1.png`
6. **Test in single browser for visuals** - Cross-browser causes diff noise

## Next Steps

In the next lesson, we'll explore `toMatchSnapshot()` for data and non-image snapshots.
