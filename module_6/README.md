# Module 6: Cross-Browser and Device Testing

**Duration:** 2-3 hours (Full coverage) | 30 minutes (Intensive workshop)
**Level:** Intermediate
**Prerequisites:** Completed Modules 2-5

> **Note:** In the intensive one-day workshop (9 AM - 3 PM), this module is covered in 30 minutes with a quick demo of device emulation and mobile testing.

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:
- ✅ Test applications across different devices (mobile, tablet, desktop)
- ✅ Configure viewport sizes and device emulation
- ✅ Test with different locales and timezones
- ✅ Emulate geolocation for location-based features
- ✅ Test dark mode and color schemes
- ✅ Simulate network conditions
- ✅ Test with different permissions

---

## 📚 Topics Covered

### 1. Browser and Device Emulation (90 minutes)
**File:** [1_emulation.md](1_emulation.md)

Learn about:
- Device emulation with preset devices
- Custom viewport configuration
- Mobile vs desktop testing
- User agent and mobile detection
- Device scale factor (Retina displays)
- Touch support emulation

**Key concepts:**
- Using `devices` registry for popular devices
- iPhone, iPad, Pixel, Galaxy emulation
- Custom device configurations
- Testing responsive design

---

### 2. Advanced Configuration (60 minutes)
**File:** [2_advanced_configuration.md](2_advanced_configuration.md)

Learn about:
- Locale and timezone configuration
- Geolocation testing
- Permissions (camera, microphone, notifications)
- Color scheme emulation (dark/light mode)
- Media features (print, reduced motion)
- Network conditions (offline mode)
- JavaScript disabled testing

**Hands-on Lab:**
- Explore: [playwright-emulation/](playwright-emulation/)
- Test with different devices
- Configure locale and timezone
- Test geolocation features
- Emulate dark mode
- Test offline functionality

---

## 🧪 Lab Exercises

### Lab 1: Device Emulation (45 minutes)

**Task 1: Test on Mobile Devices**
Configure mobile device testing:
```typescript
import { test, devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

test('mobile navigation', async ({ page }) => {
  await page.goto('https://example.com');
  // Test mobile-specific features
  await page.locator('.mobile-menu').click();
});
```

**Task 2: Test Multiple Devices**
```typescript
const deviceList = [
  'iPhone 12',
  'iPhone 12 Pro Max',
  'Pixel 5',
  'iPad Pro',
  'Desktop Chrome',
];

deviceList.forEach((deviceName) => {
  test.describe(deviceName, () => {
    test.use({ ...devices[deviceName] });

    test('homepage loads', async ({ page }) => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example/);
    });
  });
});
```

**Task 3: Custom Viewport**
```typescript
test('custom viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://example.com');

  // Test desktop layout
  await expect(page.locator('.desktop-nav')).toBeVisible();

  await page.setViewportSize({ width: 375, height: 667 });

  // Test mobile layout
  await expect(page.locator('.mobile-nav')).toBeVisible();
});
```

---

### Lab 2: Locale and Timezone (30 minutes)

**Task 1: Test Different Locales**
```typescript
test.use({
  locale: 'fr-FR',
  timezoneId: 'Europe/Paris',
});

test('french locale', async ({ page }) => {
  await page.goto('https://example.com');

  const locale = await page.evaluate(() => navigator.language);
  expect(locale).toBe('fr-FR');

  // Verify French date format
  const date = await page.evaluate(() => {
    return new Date('2024-01-15').toLocaleDateString();
  });
  expect(date).toContain('15/01/2024'); // French format
});
```

**Task 2: Multiple Locales**
```typescript
const locales = [
  { locale: 'en-US', timezone: 'America/New_York' },
  { locale: 'ja-JP', timezone: 'Asia/Tokyo' },
  { locale: 'de-DE', timezone: 'Europe/Berlin' },
];

locales.forEach(({ locale, timezone }) => {
  test.describe(`${locale} locale`, () => {
    test.use({ locale, timezoneId: timezone });

    test('displays correct format', async ({ page }) => {
      await page.goto('https://example.com');
      // Verify locale-specific formatting
    });
  });
});
```

---

### Lab 3: Geolocation Testing (30 minutes)

**Task 1: Set Geolocation**
```typescript
test.use({
  geolocation: { longitude: -122.4194, latitude: 37.7749 }, // San Francisco
  permissions: ['geolocation'],
});

test('location-based feature', async ({ page }) => {
  await page.goto('https://example.com/map');

  // Verify location is San Francisco
  await expect(page.locator('.location')).toContainText('San Francisco');
});
```

**Task 2: Change Geolocation During Test**
```typescript
test('dynamic geolocation', async ({ page, context }) => {
  // Start in New York
  await context.setGeolocation({
    longitude: -74.0060,
    latitude: 40.7128
  });

  await page.goto('https://example.com/weather');
  await expect(page.locator('.city')).toHaveText('New York');

  // Move to Tokyo
  await context.setGeolocation({
    longitude: 139.6917,
    latitude: 35.6895
  });

  await page.reload();
  await expect(page.locator('.city')).toHaveText('Tokyo');
});
```

---

### Lab 4: Color Scheme and Accessibility (30 minutes)

**Task 1: Test Dark Mode**
```typescript
test.use({
  colorScheme: 'dark',
});

test('dark mode theme', async ({ page }) => {
  await page.goto('https://example.com');

  const isDarkMode = await page.evaluate(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  expect(isDarkMode).toBe(true);

  // Verify dark mode styles
  const bgColor = await page.locator('body').evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });
  // Dark backgrounds should be dark colors
});
```

**Task 2: Toggle Color Schemes**
```typescript
test('toggle between themes', async ({ page }) => {
  // Start with light mode
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('https://example.com');
  // Verify light mode

  // Switch to dark mode
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.reload();
  // Verify dark mode
});
```

**Task 3: Reduced Motion**
```typescript
test.use({
  reducedMotion: 'reduce',
});

test('reduced motion preference', async ({ page }) => {
  await page.goto('https://example.com');

  const prefersReducedMotion = await page.evaluate(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  expect(prefersReducedMotion).toBe(true);

  // Verify animations are disabled/reduced
});
```

---

### Lab 5: Network and Permissions (30 minutes)

**Task 1: Test Offline Mode**
```typescript
test('offline functionality', async ({ page, context }) => {
  await page.goto('https://example.com');

  // Go offline
  await context.setOffline(true);

  await page.click('a[href="/about"]');

  // Verify offline page or cached content loads
  await expect(page.locator('.offline-message')).toBeVisible();

  // Go back online
  await context.setOffline(false);
});
```

**Task 2: Grant Permissions**
```typescript
test.use({
  permissions: ['notifications', 'geolocation'],
});

test('notification permission', async ({ page, context }) => {
  await page.goto('https://example.com');

  // Notifications are already granted
  await page.click('#enable-notifications');

  // No permission prompt should appear
  await expect(page.locator('.notifications-enabled')).toBeVisible();
});
```

**Task 3: Test Without JavaScript**
```typescript
test.use({
  javaScriptEnabled: false,
});

test('works without javascript', async ({ page }) => {
  await page.goto('https://example.com');

  // Verify core functionality works without JS
  await expect(page.locator('h1')).toBeVisible();
});
```

---

### Lab 6: Complete Emulation Project (60 minutes)

**Task:** Build a comprehensive cross-browser/device test suite

1. **Configure Projects:**
```typescript
export default defineConfig({
  projects: [
    // Desktop browsers
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Desktop Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'Desktop Safari', use: { ...devices['Desktop Safari'] } },

    // Mobile devices
    { name: 'iPhone 12', use: { ...devices['iPhone 12'] } },
    { name: 'Pixel 5', use: { ...devices['Pixel 5'] } },

    // Tablets
    { name: 'iPad Pro', use: { ...devices['iPad Pro'] } },

    // Dark mode testing
    {
      name: 'Dark Mode',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
      },
    },

    // Different locales
    {
      name: 'Japanese',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'ja-JP',
        timezoneId: 'Asia/Tokyo',
      },
    },
  ],
});
```

2. **Create Tests:**
   - Responsive design test
   - Locale-specific test
   - Geolocation test
   - Dark mode test
   - Offline functionality test

3. **Run and Verify:**
```bash
# Run on all projects
npx playwright test

# Run on specific device
npx playwright test --project="iPhone 12"

# Run only dark mode tests
npx playwright test --project="Dark Mode"
```

---

## ✅ Success Criteria

After completing this module, you should be able to:
- [x] Configure device emulation for mobile/tablet testing
- [x] Test with custom viewport sizes
- [x] Configure locale and timezone settings
- [x] Test geolocation-based features
- [x] Emulate dark mode and color schemes
- [x] Test with different permissions
- [x] Simulate offline mode
- [x] Test without JavaScript
- [x] Create comprehensive cross-browser test suites

---

## 🎓 Quick Reference

### Device Emulation
```typescript
import { devices } from '@playwright/test';

// Use preset device
test.use({ ...devices['iPhone 12'] });

// Custom viewport
test.use({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2,
});
```

### Locale and Timezone
```typescript
test.use({
  locale: 'ja-JP',
  timezoneId: 'Asia/Tokyo',
});
```

### Geolocation
```typescript
test.use({
  geolocation: { longitude: 139.69, latitude: 35.68 },
  permissions: ['geolocation'],
});
```

### Color Scheme
```typescript
test.use({
  colorScheme: 'dark', // or 'light'
});
```

### Network and Permissions
```typescript
// Offline mode
await context.setOffline(true);

// Grant permissions
test.use({
  permissions: ['notifications', 'geolocation', 'camera'],
});
```

---

## 💡 Tips for Success

1. **Test mobile first** - Many users access apps on mobile
2. **Use preset devices** - Easier than custom configurations
3. **Test critical locales** - Focus on your primary markets
4. **Don't forget dark mode** - Increasingly important for users
5. **Test offline functionality** - PWAs especially need this
6. **Verify responsive breakpoints** - Test at common viewport sizes
7. **Use projects for organization** - Separate mobile, tablet, desktop

---

## 📖 Additional Resources

- [Emulation Documentation](https://playwright.dev/docs/emulation)
- [Device Descriptors](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [Network Emulation](https://playwright.dev/docs/network)

---

## ❓ Common Issues and Solutions

### Issue: Mobile tests don't behave correctly
**Solution:** Ensure `isMobile: true` and `hasTouch: true` are set:
```typescript
test.use({
  ...devices['iPhone 12'],
  isMobile: true,
  hasTouch: true,
});
```

### Issue: Locale doesn't change
**Solution:** Some sites detect locale from IP or URL. Verify your test URL supports locale switching.

### Issue: Geolocation not working
**Solution:** Make sure permissions are granted:
```typescript
test.use({
  geolocation: { longitude: -122.42, latitude: 37.77 },
  permissions: ['geolocation'],
});
```

### Issue: Dark mode not activating
**Solution:** Verify the site respects `prefers-color-scheme` media query.

---

## 🎯 Next Module Preview

In **Module 7: Advanced Topics** (Optional), you'll learn:
- Global setup and teardown
- Advanced CLI usage and sharding
- Worker isolation strategies
- CI/CD integration
- Performance testing
- Visual regression testing

---

**Ready to start? Open [1_emulation.md](1_emulation.md) to begin!**
