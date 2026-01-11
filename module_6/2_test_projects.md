# Test Projects in Playwright

## Overview

Playwright Test Projects enable you to run the same test suite across multiple browsers, devices, and configurations from a single codebase. Projects provide a powerful way to organize tests, configure different environments, and manage test execution across various platforms.

## Table of Contents

1. [What Are Projects?](#what-are-projects)
2. [Configuring Projects](#configuring-projects)
3. [Running Projects](#running-projects)
4. [Browser Projects](#browser-projects)
5. [Device Emulation Projects](#device-emulation-projects)
6. [Project Dependencies](#project-dependencies)
7. [Environment-Specific Projects](#environment-specific-projects)
8. [Test Filtering in Projects](#test-filtering-in-projects)
9. [Project-Specific Configuration](#project-specific-configuration)
10. [Best Practices](#best-practices)

---

## What Are Projects?

Projects are logical groupings of tests that share the same configuration. Each project can have its own:

- Browser type (Chromium, Firefox, WebKit)
- Device emulation settings
- Base URL and environment
- Timeout settings
- Number of retries
- Screenshot and video settings
- Test file patterns

### Key Benefits

- **Cross-browser testing**: Run tests on multiple browsers simultaneously
- **Device coverage**: Test on desktop, tablet, and mobile devices
- **Environment separation**: Different configurations for staging, production, etc.
- **Test organization**: Group tests by priority, feature, or test type
- **Dependency management**: Set up teardown sequences and test dependencies

---

## Configuring Projects

### Basic Project Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
      },
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
      },
    },
  ],
});
```

### Multiple Project Types

```typescript
export default defineConfig({
  projects: [
    // Desktop browsers
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile devices
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // Tablets
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],
});
```

---

## Running Projects

### Run All Projects

By default, all projects run when you execute tests:

```bash
npx playwright test
```

This executes your test suite across all configured projects.

### Run Specific Project

Target individual projects using the `--project` flag:

```bash
# Run only on Chrome
npx playwright test --project=chromium

# Run on multiple specific projects
npx playwright test --project=chromium --project=firefox

# Run on mobile projects
npx playwright test --project="Mobile Chrome" --project="Mobile Safari"
```

### Exclude Projects

Run all projects except specific ones:

```bash
# Use grep inverse match with project names in test reports
npx playwright test --grep-invert "@mobile"
```

---

## Browser Projects

### Chromium-Based Browsers

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
  ],
});
```

### All Major Browsers

```typescript
export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

---

## Device Emulation Projects

### Mobile Devices

Playwright includes predefined device descriptors for popular mobile devices:

```typescript
export default defineConfig({
  projects: [
    {
      name: 'iPhone 12',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'iPhone 12 Pro Max',
      use: { ...devices['iPhone 12 Pro Max'] },
    },
    {
      name: 'Pixel 5',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Samsung Galaxy S9+',
      use: { ...devices['Galaxy S9+'] },
    },
  ],
});
```

### Tablet Devices

```typescript
export default defineConfig({
  projects: [
    {
      name: 'iPad Pro',
      use: { ...devices['iPad Pro'] },
    },
    {
      name: 'iPad Mini',
      use: { ...devices['iPad Mini'] },
    },
    {
      name: 'Galaxy Tab S4',
      use: { ...devices['Galaxy Tab S4'] },
    },
  ],
});
```

### Custom Device Configuration

Create custom device configurations:

```typescript
export default defineConfig({
  projects: [
    {
      name: 'Custom Mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)...',
      },
    },
  ],
});
```

---

## Project Dependencies

Projects can depend on other projects, creating setup/teardown chains and execution order.

### Basic Setup Dependency

```typescript
export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
  ],
});
```

### Authentication Setup Example

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    // Setup project - runs first
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },

    // All test projects depend on setup
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

```typescript
// tests/global.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  // Perform authentication
  await page.goto('https://example.com/login');
  await page.fill('input[name="username"]', 'user');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Wait for authentication to complete
  await page.waitForURL('https://example.com/dashboard');

  // Save authentication state
  await page.context().storageState({
    path: 'playwright/.auth/user.json',
  });
});
```

### Multi-Stage Dependencies

```typescript
export default defineConfig({
  projects: [
    // Stage 1: Database setup
    {
      name: 'setup:db',
      testMatch: /.*\.db-setup\.ts/,
    },

    // Stage 2: Authentication (depends on DB)
    {
      name: 'setup:auth',
      testMatch: /.*\.auth-setup\.ts/,
      dependencies: ['setup:db'],
    },

    // Stage 3: Tests (depend on auth)
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup:auth'],
    },

    // Stage 4: Cleanup (runs after all tests)
    {
      name: 'cleanup',
      testMatch: /.*\.cleanup\.ts/,
      dependencies: ['chromium'],
    },
  ],
});
```

### Failure Handling

If a dependency project fails, all dependent projects are skipped:

```typescript
export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: /setup\.ts/,
      retries: 2, // Retry setup if it fails
    },
    {
      name: 'tests',
      dependencies: ['setup'], // Skipped if setup fails
    },
  ],
});
```

---

## Environment-Specific Projects

### Staging vs Production

```typescript
export default defineConfig({
  projects: [
    {
      name: 'staging',
      use: {
        baseURL: 'https://staging.example.com',
      },
      retries: 2,
    },
    {
      name: 'production',
      use: {
        baseURL: 'https://example.com',
      },
      retries: 0, // No retries in production
    },
  ],
});
```

### CI vs Local Development

```typescript
export default defineConfig({
  projects: process.env.CI
    ? [
        // CI: Test on all browsers
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
      ]
    : [
        // Local: Only test on Chromium for speed
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      ],
});
```

### Feature Flags

```typescript
export default defineConfig({
  projects: [
    {
      name: 'new-ui',
      use: {
        baseURL: 'https://example.com',
        extraHTTPHeaders: {
          'X-Feature-Flag': 'new-ui-enabled',
        },
      },
    },
    {
      name: 'old-ui',
      use: {
        baseURL: 'https://example.com',
        extraHTTPHeaders: {
          'X-Feature-Flag': 'new-ui-disabled',
        },
      },
    },
  ],
});
```

---

## Test Filtering in Projects

### Filter by File Pattern

```typescript
export default defineConfig({
  projects: [
    {
      name: 'smoke',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'regression',
      testMatch: /.*\.spec\.ts/,
      testIgnore: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Filter by Directory

```typescript
export default defineConfig({
  projects: [
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        baseURL: 'https://api.example.com',
      },
    },
    {
      name: 'ui-tests',
      testDir: './tests/ui',
      use: {
        baseURL: 'https://example.com',
      },
    },
  ],
});
```

### Filter by Tags

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'critical',
      grep: /@critical/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'full-suite',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('login @critical', async ({ page }) => {
  // This test runs in both 'critical' and 'full-suite' projects
});

test('profile page', async ({ page }) => {
  // This test runs only in 'full-suite' project
});
```

---

## Project-Specific Configuration

### Different Timeouts

```typescript
export default defineConfig({
  projects: [
    {
      name: 'fast',
      timeout: 30000, // 30 seconds
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'slow',
      timeout: 120000, // 2 minutes
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Different Retry Strategies

```typescript
export default defineConfig({
  projects: [
    {
      name: 'stable-features',
      retries: 0,
      testMatch: /stable\/.*\.spec\.ts/,
    },
    {
      name: 'experimental-features',
      retries: 2,
      testMatch: /experimental\/.*\.spec\.ts/,
    },
  ],
});
```

### Different Screenshot Settings

```typescript
export default defineConfig({
  projects: [
    {
      name: 'chromium-screenshots',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'visual-regression',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'on',
        video: 'off',
      },
    },
  ],
});
```

### Different Viewport Sizes

```typescript
export default defineConfig({
  projects: [
    {
      name: 'desktop-1920',
      use: {
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'desktop-1366',
      use: {
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'desktop-1024',
      use: {
        viewport: { width: 1024, height: 768 },
      },
    },
  ],
});
```

---

## Best Practices

### 1. Organize by Purpose

```typescript
export default defineConfig({
  projects: [
    // Quick feedback
    {
      name: 'smoke',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // Full desktop testing
    {
      name: 'desktop-chromium',
      testIgnore: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'desktop-firefox',
      testIgnore: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },

    // Mobile testing
    {
      name: 'mobile-chrome',
      testIgnore: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Pixel 5'] },
    },
  ],
});
```

### 2. Use Setup Projects for Global State

```typescript
export default defineConfig({
  projects: [
    // Setup project for authentication
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },

    // All test projects depend on setup
    ...['Desktop Chrome', 'Desktop Firefox', 'Desktop Safari'].map(
      (deviceName) => ({
        name: deviceName.toLowerCase().replace(' ', '-'),
        use: {
          ...devices[deviceName],
          storageState: 'playwright/.auth/user.json',
        },
        dependencies: ['setup'],
      })
    ),
  ],
});
```

### 3. Optimize for CI/CD

```typescript
export default defineConfig({
  projects: process.env.CI
    ? [
        // CI: Full browser matrix
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
        { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
        { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
      ]
    : [
        // Local: Fast feedback with Chromium only
        {
          name: 'chromium',
          use: {
            ...devices['Desktop Chrome'],
            video: 'off',
            screenshot: 'only-on-failure',
          },
        },
      ],
});
```

### 4. Name Projects Clearly

```typescript
// ✅ Good: Clear, descriptive names
export default defineConfig({
  projects: [
    { name: 'Desktop Chrome - Smoke Tests', /* ... */ },
    { name: 'Mobile Safari - Full Suite', /* ... */ },
    { name: 'Staging - API Tests', /* ... */ },
  ],
});

// ❌ Bad: Ambiguous names
export default defineConfig({
  projects: [
    { name: 'p1', /* ... */ },
    { name: 'tests', /* ... */ },
    { name: 'project', /* ... */ },
  ],
});
```

### 5. Avoid Over-Configuration

```typescript
// ❌ Bad: Too many similar projects
export default defineConfig({
  projects: [
    { name: 'chrome-1920x1080', use: { viewport: { width: 1920, height: 1080 } } },
    { name: 'chrome-1919x1080', use: { viewport: { width: 1919, height: 1080 } } },
    { name: 'chrome-1918x1080', use: { viewport: { width: 1918, height: 1080 } } },
    // ... 50 more similar configs
  ],
});

// ✅ Good: Essential configurations only
export default defineConfig({
  projects: [
    { name: 'Desktop HD', use: { viewport: { width: 1920, height: 1080 } } },
    { name: 'Desktop Standard', use: { viewport: { width: 1366, height: 768 } } },
    { name: 'Mobile', use: { ...devices['iPhone 12'] } },
  ],
});
```

### 6. Use Descriptive Test File Names

```
tests/
  smoke/
    auth.smoke.spec.ts
    checkout.smoke.spec.ts
  regression/
    user-profile.spec.ts
    payment.spec.ts
  mobile/
    navigation.mobile.spec.ts
    gestures.mobile.spec.ts
```

### 7. Leverage Device Presets

```typescript
import { devices } from '@playwright/test';

// ✅ Good: Use built-in device descriptors
export default defineConfig({
  projects: [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'iPhone 12', use: { ...devices['iPhone 12'] } },
  ],
});

// ❌ Bad: Manually configure common devices
export default defineConfig({
  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        // ... many more properties
      },
    },
  ],
});
```

---

## Common Patterns

### Pattern 1: Progressive Testing

Run smoke tests on all browsers, full suite on primary browser only:

```typescript
export default defineConfig({
  projects: [
    // Smoke tests on all browsers
    {
      name: 'smoke-chrome',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'smoke-firefox',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'smoke-safari',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },

    // Full suite only on Chrome
    {
      name: 'full-chrome',
      testIgnore: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Pattern 2: Authenticated vs Guest

```typescript
export default defineConfig({
  projects: [
    // Setup authentication
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },

    // Authenticated user tests
    {
      name: 'authenticated',
      testDir: './tests/authenticated',
      use: {
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Guest/unauthenticated tests
    {
      name: 'guest',
      testDir: './tests/guest',
      use: {
        storageState: { cookies: [], origins: [] },
      },
    },
  ],
});
```

### Pattern 3: API + UI Testing

```typescript
export default defineConfig({
  projects: [
    // API tests (no browser needed)
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://api.example.com',
      },
    },

    // UI tests
    {
      name: 'ui-chrome',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://example.com',
      },
    },
  ],
});
```

---

## Advanced Examples

### Complete E-Commerce Configuration

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // Setup
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Desktop browsers - Smoke tests
    {
      name: 'smoke-desktop-chrome',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'smoke-desktop-firefox',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'smoke-desktop-safari',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    // Desktop Chrome - Full suite
    {
      name: 'full-desktop-chrome',
      testIgnore: /.*\.smoke\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Mobile devices
    {
      name: 'mobile-ios',
      testMatch: /.*\.(smoke|mobile)\.spec\.ts/,
      use: {
        ...devices['iPhone 12'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-android',
      testMatch: /.*\.(smoke|mobile)\.spec\.ts/,
      use: {
        ...devices['Pixel 5'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Cleanup
    {
      name: 'cleanup',
      testMatch: /.*\.cleanup\.ts/,
      dependencies: [
        'smoke-desktop-chrome',
        'smoke-desktop-firefox',
        'smoke-desktop-safari',
        'full-desktop-chrome',
        'mobile-ios',
        'mobile-android',
      ],
    },
  ],
});
```

---

## Summary

- **Projects** organize tests into logical groups with shared configuration
- **Browser testing** across Chromium, Firefox, and WebKit from a single codebase
- **Device emulation** for mobile and tablet testing using predefined or custom configurations
- **Dependencies** enable setup/teardown sequences and execution ordering
- **Environment separation** allows different configs for staging, production, CI, etc.
- **Test filtering** targets specific test subsets per project
- **Best practice**: Keep projects focused, use setup dependencies, and optimize for your workflow

---

## Additional Resources

- [Official Playwright Projects Documentation](https://playwright.dev/docs/test-projects)
- [Device Descriptors](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [Authentication Setup](https://playwright.dev/docs/auth)
- [CI/CD Integration](https://playwright.dev/docs/ci)
