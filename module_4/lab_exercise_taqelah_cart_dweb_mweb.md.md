# Lab: Shopping Cart E2E Test with Global Setup and Mobile/Desktop Testing

## Overview

In this lab, you will create an end-to-end test for a shopping cart flow on a demo e-commerce site. You'll learn how to:
- Use Playwright Codegen to generate test code
- Apply various locator strategies
- Implement global setup and teardown
- Configure HTML reports
- Run tests on both desktop and mobile devices

---

## Prerequisites

- Node.js installed
- Playwright installed (`npm init playwright@latest`)
- Basic understanding of Playwright test structure

---

## Part 1: Using Codegen to Generate Tests

### Step 1: Launch Codegen

Run Playwright Codegen to record your interactions:

```bash
npx playwright codegen https://taqelah.sg/taqelah-demo-site.html
```

### Step 2: Record the Shopping Flow

Perform these actions while Codegen is running:
1. Enter username: `ladies`
2. Enter password: `ladies_GO`
3. Click Login
4. Search for "maxi dress"
5. Click on a product
6. Add to cart
7. Open cart
8. Verify cart contents
9. Click checkout

### Step 3: Copy Generated Code

Codegen will generate code like this (which we'll refine in this lab).

---

## Part 2: Project Structure

Create the following project structure:

```
playwright-shopping-cart/
├── tests/
│   └── shopping-cart.spec.ts
├── global-setup.ts
├── global-teardown.ts
├── playwright.config.ts
├── auth.json (generated)
└── package.json
```

---

## Part 3: Implementing Global Setup and Teardown

### global-setup.ts

Create a global setup file that performs authentication once before all tests:

```typescript
import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';

async function globalSetup(config: FullConfig) {
  console.log('🔐 Performing global authentication...');

  // Create auth directory if it doesn't exist
  if (!fs.existsSync('playwright/.auth')) {
    fs.mkdirSync('playwright/.auth', { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the demo site
  await page.goto('https://taqelah.sg/taqelah-demo-site.html');

  // Perform login using test data IDs
  await page.getByTestId('username-input').fill('ladies');
  await page.getByTestId('password-input').fill('ladies_GO');
  await page.getByTestId('login-button').click();

  // Wait for successful login (search input appears)
  await page.getByTestId('search-input').waitFor({ state: 'visible' });

  // Save authentication state
  await context.storageState({ path: 'playwright/.auth/user.json' });

  await browser.close();

  console.log('✅ Authentication completed and saved');
}

export default globalSetup;
```

### global-teardown.ts

Create a global teardown file for cleanup:

```typescript
import { FullConfig } from '@playwright/test';
import * as fs from 'fs';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Running global teardown...');

  // Clean up authentication state (optional)
  const authFile = 'playwright/.auth/user.json';
  if (fs.existsSync(authFile)) {
    // Uncomment to delete auth file after tests
    // fs.unlinkSync(authFile);
    console.log('✅ Auth file preserved for debugging');
  }

  console.log('✅ Global teardown completed');
}

export default globalTeardown;
```

---

## Part 4: Playwright Configuration with HTML Reporter

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Global setup and teardown
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),

  // Reporter configuration - HTML report
  reporter: [
    ['list'],
    ['html', {
      open: 'on-failure',  // 'always' | 'never' | 'on-failure'
      outputFolder: 'playwright-report'
    }],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL: 'https://taqelah.sg',

    // Use saved authentication state
    storageState: 'playwright/.auth/user.json',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'on-first-retry',
  },

  // Configure projects for Desktop and Mobile
  projects: [
    // Desktop Chrome
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // Mobile Chrome (Android)
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },

    // Mobile Safari (iOS)
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
      },
    },
  ],
});
```

---

## Part 5: The Shopping Cart Test

### tests/shopping-cart.spec.ts

Create the test file with both desktop and mobile-aware tests:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Flow', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the demo site (already authenticated via global setup)
    await page.goto('/taqelah-demo-site.html');

    // Verify we're logged in by checking search is visible
    await expect(page.getByTestId('search-input')).toBeVisible();
  });

  test('should search for product and add to cart', async ({ page }) => {
    // Search for product using test ID locator
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill('maxi dress');

    // Click on product from search results
    // Using compound locator: within search-grid, find product-name-6
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();

    // Add to cart using test ID
    await page.getByTestId('product-details-add-to-cart').click();

    // Open cart
    await page.getByTestId('cart-icon').click();

    // Verify cart contents are displayed
    // Using toBeVisible() instead of click() for verification
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await expect(page.getByTestId('cart-item-name-6')).toBeVisible();
    await expect(page.getByTestId('cart-item-price-6')).toBeVisible();

    // Verify checkout button is displayed
    await expect(page.getByTestId('checkout-button')).toBeVisible();
  });

  test('should complete checkout flow', async ({ page }) => {
    // Search and add product
    await page.getByTestId('search-input').fill('maxi dress');
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();
    await page.getByTestId('product-details-add-to-cart').click();

    // Go to cart
    await page.getByTestId('cart-icon').click();

    // Verify cart heading is visible
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

    // Click checkout
    await page.getByTestId('checkout-button').click();

    // Add assertions for checkout page here
    // await expect(page.locator('.checkout-form')).toBeVisible();
  });
});

// Separate Desktop-specific tests
test.describe('Desktop Shopping Experience', () => {
  test.skip(({ browserName, viewport }) => {
    // Skip if viewport width is less than 768px (mobile)
    return viewport !== null && viewport.width < 768;
  }, 'This test is for desktop only');

  test('should display full product grid on desktop', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Desktop-specific verifications
    await page.getByTestId('search-input').fill('dress');

    // Verify multiple columns are visible (desktop layout)
    const productGrid = page.getByTestId('search-grid');
    await expect(productGrid).toBeVisible();

    // Take screenshot for desktop view
    await page.screenshot({
      path: 'screenshots/desktop-product-grid.png',
      fullPage: true
    });
  });
});

// Separate Mobile-specific tests
test.describe('Mobile Shopping Experience', () => {
  test.skip(({ viewport }) => {
    // Skip if viewport width is greater than 768px (desktop)
    return viewport === null || viewport.width >= 768;
  }, 'This test is for mobile only');

  test('should display mobile-optimized layout', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Mobile-specific verifications
    await page.getByTestId('search-input').fill('dress');

    // Verify mobile layout
    const productGrid = page.getByTestId('search-grid');
    await expect(productGrid).toBeVisible();

    // Take screenshot for mobile view
    await page.screenshot({
      path: 'screenshots/mobile-product-grid.png',
      fullPage: true
    });
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Tap on search input
    await page.getByTestId('search-input').tap();
    await page.getByTestId('search-input').fill('maxi dress');

    // Tap on product
    await page.getByTestId('search-grid').getByTestId('product-name-6').tap();

    // Verify product details are visible
    await expect(page.getByTestId('product-details-add-to-cart')).toBeVisible();
  });
});
```

---

## Part 6: Locator Strategies Used

This lab demonstrates several locator strategies:

### 1. Test ID Locators (Recommended)
```typescript
// Most reliable - uses data-testid attribute
await page.getByTestId('username-input').fill('ladies');
await page.getByTestId('login-button').click();
```

### 2. Role Locators
```typescript
// Uses ARIA roles - great for accessibility
await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
```

### 3. Compound/Chained Locators
```typescript
// Narrow down by finding element within another
await page.getByTestId('search-grid').getByTestId('product-name-6').click();
```

### 4. Text Locators
```typescript
// Find by visible text
await page.getByText('Add to Cart').click();
```

### 5. Placeholder Locators
```typescript
// Find input by placeholder text
await page.getByPlaceholder('Search products...').fill('dress');
```

### Locator Priority (Best to Least Preferred)

| Priority | Locator Type | Example |
|----------|-------------|---------|
| 1 | Test ID | `getByTestId('submit-btn')` |
| 2 | Role | `getByRole('button', { name: 'Submit' })` |
| 3 | Label | `getByLabel('Email')` |
| 4 | Placeholder | `getByPlaceholder('Enter email')` |
| 5 | Text | `getByText('Submit')` |
| 6 | CSS/XPath | `locator('.btn-submit')` |

---

## Part 7: Running the Tests

### Run All Tests (Desktop and Mobile)
```bash
npx playwright test
```

### Run Specific Project (Desktop Only)
```bash
npx playwright test --project="Desktop Chrome"
```

### Run Mobile Tests Only
```bash
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### Run with HTML Report
```bash
npx playwright test --reporter=html
```

### View the HTML Report
```bash
npx playwright show-report
```

### Run in UI Mode (for debugging)
```bash
npx playwright test --ui
```

### Run Headed (see browser)
```bash
npx playwright test --headed
```

---

## Part 8: HTML Report Features

The HTML report provides:

1. **Test Results Overview**: Pass/fail status for all tests
2. **Project Breakdown**: Results by Desktop Chrome, Mobile Chrome, Mobile Safari
3. **Timeline View**: When each test ran
4. **Error Details**: Stack traces and error messages
5. **Screenshots**: Captured on failure
6. **Traces**: Step-by-step replay of failed tests
7. **Video Recording**: When configured

### Customizing HTML Report

```typescript
// In playwright.config.ts
reporter: [
  ['html', {
    open: 'always',           // Open report after run
    outputFolder: 'my-report', // Custom folder
    attachmentsBaseURL: 'https://my-cdn.com/', // For CI artifacts
  }],
],
```

---

## Part 9: Complete Example Files

### package.json

```json
{
  "name": "playwright-shopping-cart",
  "version": "1.0.0",
  "scripts": {
    "test": "playwright test",
    "test:desktop": "playwright test --project='Desktop Chrome'",
    "test:mobile": "playwright test --project='Mobile Chrome' --project='Mobile Safari'",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "report": "playwright show-report",
    "codegen": "playwright codegen https://taqelah.sg/taqelah-demo-site.html"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

---

### Exercise 4: Implement Data-Driven Tests
Create tests that run with different:
- Search terms
- User credentials
- Products

---

## Common Issues and Solutions

### Issue: Authentication state not found
```
Error: Could not read auth file: playwright/.auth/user.json
```
**Solution**: Run global setup first or check the path in config.

### Issue: Element not visible on mobile
```
Error: Element is not visible
```
**Solution**: Mobile layouts may hide elements. Use conditional logic or separate mobile tests.

### Issue: Test passes on desktop but fails on mobile
**Solution**: Use viewport-aware tests or separate test suites for different devices.

---

## Summary

In this lab, you learned:

- ✅ **Codegen**: Generate tests by recording browser interactions
- ✅ **Locator Strategies**: Use test IDs, roles, and compound locators
- ✅ **Global Setup/Teardown**: Authenticate once for all tests
- ✅ **HTML Reports**: Configure and view test reports
- ✅ **Multi-Device Testing**: Run tests on desktop and mobile separately
- ✅ **Assertions**: Use `toBeVisible()` instead of `click()` for verification

---

## Additional Resources

- [Playwright Codegen](https://playwright.dev/docs/codegen)
- [Locators Documentation](https://playwright.dev/docs/locators)
- [Global Setup and Teardown](https://playwright.dev/docs/test-global-setup-teardown)
- [HTML Reporter](https://playwright.dev/docs/test-reporters#html-reporter)
- [Device Emulation](https://playwright.dev/docs/emulation)

---

> **Note:** All contents of this workshop are proprietary and belong to **Taqelah**. Do not share or distribute without permission.
