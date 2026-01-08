# Browser and Device Emulation in Playwright

## Overview

Playwright provides comprehensive emulation capabilities that allow you to test your web applications across different devices, browsers, and environments without needing physical devices. This includes simulating mobile devices, tablets, desktop browsers, different locales, timezones, permissions, and various user preferences.

## Table of Contents

1. [Device Emulation](#device-emulation)
2. [Viewport Configuration](#viewport-configuration)
3. [User Agent and Mobile Detection](#user-agent-and-mobile-detection)
4. [Geolocation](#geolocation)
5. [Locale and Timezone](#locale-and-timezone)
6. [Permissions](#permissions)
7. [Color Scheme Emulation](#color-scheme-emulation)
8. [Media Features](#media-features)
9. [Network Conditions](#network-conditions)
10. [Best Practices](#best-practices)

---

## Device Emulation

Playwright includes a registry of device descriptors for popular devices. You can emulate any device from this registry to automatically configure viewport size, user agent, device scale factor, and touch support.

### Using Preset Devices

```typescript
import { test, devices } from '@playwright/test';

// iPhone 13
test.use({
  ...devices['iPhone 13'],
});

test('mobile test', async ({ page }) => {
  await page.goto('https://example.com');
  // Test will run with iPhone 13 settings
});
```

### Popular Device Presets

```typescript
import { test, devices } from '@playwright/test';

// Mobile devices
test.use({ ...devices['iPhone 13 Pro'] });
test.use({ ...devices['iPhone 13'] });
test.use({ ...devices['iPhone 12'] });
test.use({ ...devices['Pixel 5'] });
test.use({ ...devices['Galaxy S9+'] });

// Tablets
test.use({ ...devices['iPad Pro'] });
test.use({ ...devices['iPad Mini'] });

// Desktop
test.use({ ...devices['Desktop Chrome'] });
test.use({ ...devices['Desktop Firefox'] });
test.use({ ...devices['Desktop Safari'] });
```

### Multiple Device Testing

```typescript
import { test, devices } from '@playwright/test';

const deviceList = [
  'iPhone 13',
  'iPad Pro',
  'Desktop Chrome'
];

for (const deviceName of deviceList) {
  test.describe(deviceName, () => {
    test.use({ ...devices[deviceName] });

    test('homepage loads correctly', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });
  });
}
```

---

## Viewport Configuration

Control the browser window size and display characteristics.

### Setting Viewport Size

```typescript
import { test } from '@playwright/test';

test.use({
  viewport: { width: 1280, height: 720 },
});

test('desktop viewport test', async ({ page }) => {
  await page.goto('https://example.com');
  // Test runs in 1280x720 viewport
});
```

### Dynamic Viewport Changes

```typescript
test('responsive design test', async ({ page }) => {
  // Start with desktop
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://example.com');

  // Switch to tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  // Verify tablet layout

  // Switch to mobile
  await page.setViewportSize({ width: 375, height: 667 });
  // Verify mobile layout
});
```

### Device Scale Factor (High DPI)

```typescript
test.use({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 2, // Retina display
});

test('retina display test', async ({ page }) => {
  await page.goto('https://example.com');
  // Test with 2x pixel density
});
```

### No Viewport (Full Window)

```typescript
test.use({
  viewport: null, // Use full browser window
});

test('full window test', async ({ page }) => {
  await page.goto('https://example.com');
  // Browser runs without fixed viewport
});
```

---

## User Agent and Mobile Detection

### Custom User Agent

```typescript
test.use({
  userAgent: 'My Custom User Agent 1.0',
});

test('custom user agent', async ({ page }) => {
  await page.goto('https://example.com');

  const userAgent = await page.evaluate(() => navigator.userAgent);
  console.log(userAgent); // My Custom User Agent 1.0
});
```

### Mobile Mode

```typescript
test.use({
  isMobile: true, // Enables mobile viewport meta tag
  hasTouch: true, // Enables touch events
});

test('mobile mode test', async ({ page }) => {
  await page.goto('https://example.com');
  // Site will detect mobile viewport meta tag
});
```

---

## Geolocation

Emulate geographic location for testing location-based features.

### Setting Geolocation

```typescript
test.use({
  geolocation: { longitude: -122.4194, latitude: 37.7749 }, // San Francisco
  permissions: ['geolocation'],
});

test('location-based test', async ({ page }) => {
  await page.goto('https://maps.google.com');
  // Location will be set to San Francisco
});
```

### Changing Geolocation During Test

```typescript
test('dynamic geolocation', async ({ page, context }) => {
  // Start in San Francisco
  await context.setGeolocation({
    longitude: -122.4194,
    latitude: 37.7749
  });

  await page.goto('https://example.com');
  // Test SF location features

  // Move to New York
  await context.setGeolocation({
    longitude: -74.0060,
    latitude: 40.7128
  });

  await page.reload();
  // Test NY location features
});
```

---

## Locale and Timezone

### Setting Locale

```typescript
test.use({
  locale: 'fr-FR', // French locale
});

test('french locale test', async ({ page }) => {
  await page.goto('https://example.com');

  // Dates, numbers, and text will use French formatting
  const locale = await page.evaluate(() => navigator.language);
  console.log(locale); // fr-FR
});
```

### Setting Timezone

```typescript
test.use({
  timezoneId: 'America/New_York',
});

test('timezone test', async ({ page }) => {
  await page.goto('https://example.com');

  const timezone = await page.evaluate(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  });
  console.log(timezone); // America/New_York
});
```

### Combined Locale and Timezone

```typescript
test.use({
  locale: 'de-DE',
  timezoneId: 'Europe/Berlin',
});

test('german locale and timezone', async ({ page }) => {
  await page.goto('https://example.com');

  // Test German date/time formatting
  const date = await page.evaluate(() => {
    return new Date().toLocaleString();
  });
  console.log(date); // German date format
});
```

---

## Permissions

Grant or deny browser permissions for testing features that require user consent.

### Granting Permissions

```typescript
test.use({
  permissions: ['geolocation', 'notifications'],
});

test('permissions test', async ({ page }) => {
  await page.goto('https://example.com');
  // Geolocation and notifications are pre-granted
});
```

### Setting Permissions Per Context

```typescript
test('notification permission test', async ({ page, context }) => {
  // Grant notification permission
  await context.grantPermissions(['notifications']);

  await page.goto('https://example.com');
  // Click "Enable Notifications" button without prompt

  // Later, revoke permission
  await context.clearPermissions();

  await page.reload();
  // Notifications now require user prompt
});
```

### Domain-Specific Permissions

```typescript
test('domain-specific geolocation', async ({ page, context }) => {
  await context.grantPermissions(['geolocation'], {
    origin: 'https://maps.google.com',
  });

  await page.goto('https://maps.google.com');
  // Geolocation works here

  await page.goto('https://other-site.com');
  // Geolocation not granted here
});
```

### Available Permissions

- `geolocation`
- `notifications`
- `camera`
- `microphone`
- `clipboard-read`
- `clipboard-write`
- `payment-handler`
- `accessibility-events`
- `background-sync`
- `midi`
- `midi-sysex`

---

## Color Scheme Emulation

Test dark mode and light mode versions of your application.

### Dark Mode

```typescript
test.use({
  colorScheme: 'dark',
});

test('dark mode test', async ({ page }) => {
  await page.goto('https://example.com');
  // Site renders in dark mode

  const isDarkMode = await page.evaluate(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  console.log(isDarkMode); // true
});
```

### Light Mode

```typescript
test.use({
  colorScheme: 'light',
});

test('light mode test', async ({ page }) => {
  await page.goto('https://example.com');
  // Site renders in light mode
});
```

### Switching Color Schemes

```typescript
test('toggle color scheme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('https://example.com');
  // Test light mode

  await page.emulateMedia({ colorScheme: 'dark' });
  await page.reload();
  // Test dark mode
});
```

---

## Media Features

### Print Media Emulation

```typescript
test('print stylesheet test', async ({ page }) => {
  await page.emulateMedia({ media: 'print' });
  await page.goto('https://example.com');

  // Page will use print stylesheets
  await page.screenshot({ path: 'print-view.png' });
});
```

### Reduced Motion

```typescript
test.use({
  reducedMotion: 'reduce',
});

test('reduced motion test', async ({ page }) => {
  await page.goto('https://example.com');

  // Animations should be reduced or disabled
  const prefersReducedMotion = await page.evaluate(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  console.log(prefersReducedMotion); // true
});
```

### Forced Colors

```typescript
test.use({
  forcedColors: 'active',
});

test('high contrast mode test', async ({ page }) => {
  await page.goto('https://example.com');
  // Test high contrast mode accessibility
});
```

---

## Network Conditions

### Offline Mode

```typescript
test('offline mode test', async ({ page, context }) => {
  // Set offline mode
  await context.setOffline(true);

  await page.goto('https://example.com');
  // Test offline functionality

  // Restore online mode
  await context.setOffline(false);

  await page.reload();
  // Test online functionality
});
```

### JavaScript Disabled

```typescript
test.use({
  javaScriptEnabled: false,
});

test('no javascript test', async ({ page }) => {
  await page.goto('https://example.com');
  // Test site functionality without JavaScript
});
```

---

## Best Practices

### 1. Test Responsive Design Breakpoints

```typescript
const breakpoints = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

for (const breakpoint of breakpoints) {
  test.describe(breakpoint.name, () => {
    test.use({
      viewport: { width: breakpoint.width, height: breakpoint.height },
    });

    test('navigation works', async ({ page }) => {
      await page.goto('https://example.com');
      // Test navigation at this breakpoint
    });
  });
}
```

### 2. Combine Multiple Emulation Settings

```typescript
test.use({
  ...devices['iPhone 13'],
  locale: 'ja-JP',
  timezoneId: 'Asia/Tokyo',
  geolocation: { longitude: 139.6917, latitude: 35.6895 },
  permissions: ['geolocation'],
  colorScheme: 'dark',
});

test('comprehensive mobile test', async ({ page }) => {
  await page.goto('https://example.com');
  // Test with combined settings
});
```

### 3. Use Configuration File for Common Setups

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        locale: 'en-US',
        timezoneId: 'America/Los_Angeles',
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
        locale: 'en-US',
        timezoneId: 'America/Los_Angeles',
      },
    },
    {
      name: 'Desktop Dark Mode',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
      },
    },
  ],
});
```

### 4. Test International Users

```typescript
const regions = [
  { locale: 'en-US', timezone: 'America/New_York' },
  { locale: 'en-GB', timezone: 'Europe/London' },
  { locale: 'ja-JP', timezone: 'Asia/Tokyo' },
  { locale: 'de-DE', timezone: 'Europe/Berlin' },
];

for (const region of regions) {
  test.describe(`${region.locale} region`, () => {
    test.use({
      locale: region.locale,
      timezoneId: region.timezone,
    });

    test('displays correct format', async ({ page }) => {
      await page.goto('https://example.com');
      // Test localized content
    });
  });
}
```

### 5. Test Accessibility Features

```typescript
test.describe('accessibility emulation', () => {
  test('reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('https://example.com');
    // Verify animations are reduced
  });

  test('forced colors', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto('https://example.com');
    // Verify high contrast mode works
  });

  test('no javascript', async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto('https://example.com');
    // Verify core functionality works without JS
    await context.close();
  });
});
```

### 6. Test Progressive Web Apps

```typescript
test('PWA offline functionality', async ({ page, context }) => {
  await page.goto('https://pwa-example.com');

  // Wait for service worker to be registered
  await page.waitForTimeout(2000);

  // Go offline
  await context.setOffline(true);

  // Navigate within the app
  await page.click('a[href="/about"]');

  // Verify offline page loads
  await expect(page.locator('h1')).toBeVisible();

  // Go back online
  await context.setOffline(false);
});
```

### 7. Verify Geolocation Features

```typescript
test('location-based features', async ({ page, context }) => {
  // Grant geolocation permission
  await context.grantPermissions(['geolocation']);

  // Set location to San Francisco
  await context.setGeolocation({
    longitude: -122.4194,
    latitude: 37.7749
  });

  await page.goto('https://example.com');

  // Click button that uses geolocation
  await page.click('button#find-nearby');

  // Verify results are for San Francisco
  await expect(page.locator('.location')).toContainText('San Francisco');

  // Change location to New York
  await context.setGeolocation({
    longitude: -74.0060,
    latitude: 40.7128
  });

  await page.click('button#find-nearby');

  // Verify results updated to New York
  await expect(page.locator('.location')).toContainText('New York');
});
```

---

## Summary

Playwright's emulation capabilities enable comprehensive testing across:
- **Multiple devices** using preset device descriptors
- **Various viewports** for responsive design testing
- **Different locales and timezones** for international users
- **Geolocation** for location-based features
- **User preferences** like color scheme and reduced motion
- **Network conditions** including offline mode
- **Permissions** for features requiring user consent

These tools eliminate the need for physical devices and allow you to test diverse user scenarios efficiently.

For more information, visit the [official Playwright documentation on emulation](https://playwright.dev/docs/emulation).
