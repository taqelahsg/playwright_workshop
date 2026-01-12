# Lab: Test Organization and Execution with Taqelah Boutique

## Overview

In this lab, you will apply test organization and execution concepts using the Taqelah Boutique demo e-commerce site. You'll learn how to:
- Configure parallel execution with multiple workers
- Create test projects for different browsers and devices
- Implement data-driven parameterized tests
- Organize tests into a scalable suite structure

---

## Prerequisites

- Node.js installed
- Playwright installed (`npm init playwright@latest`)
- Completed Modules 2-5
- Familiarity with the Taqelah demo site from previous labs

---

## Part 1: Project Setup

### Step 1: Create Project Structure

Create the following project structure:

```
playwright-test-organization/
├── tests/
│   ├── smoke/
│   │   └── login.smoke.spec.ts
│   ├── regression/
│   │   ├── search.spec.ts
│   │   └── checkout.spec.ts
│   └── mobile/
│       └── navigation.mobile.spec.ts
├── fixtures/
│   └── test-options.ts
├── test-data/
│   ├── users.json
│   └── products.csv
├── global-setup.ts
├── playwright.config.ts
└── package.json
```

### Step 2: Initialize Package

```json
{
  "name": "playwright-test-organization",
  "version": "1.0.0",
  "scripts": {
    "test": "playwright test",
    "test:smoke": "playwright test --project=smoke-*",
    "test:regression": "playwright test --project=regression",
    "test:mobile": "playwright test --project='Mobile*'",
    "test:parallel": "playwright test --workers=4",
    "test:serial": "playwright test --workers=1",
    "report": "playwright show-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "csv-parse": "^5.5.0"
  }
}
```

---

## Part 2: Parallel Execution Configuration

### Step 1: Basic Parallel Configuration

Create `playwright.config.ts` with parallel execution settings:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Parallel execution settings
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,

  // Timeout settings
  timeout: 30000,
  expect: { timeout: 5000 },

  // Retry configuration
  retries: process.env.CI ? 2 : 0,

  // Reporter
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {
    baseURL: 'https://taqelah.sg',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // We'll add projects in the next section
  ],
});
```

### Step 2: Create Worker-Isolated Tests

Create `tests/regression/search.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Product Search - Parallel Safe', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Login
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    // Wait for login to complete
    await expect(page.getByTestId('search-input')).toBeVisible();
  });

  // These tests can run in parallel - no shared state
  test('search for dresses', async ({ page }) => {
    await page.getByTestId('search-input').fill('dress');

    const productGrid = page.getByTestId('search-grid');
    await expect(productGrid).toBeVisible();

    // Verify search results contain dresses
    await expect(page.getByText('Maxi Dress')).toBeVisible();
  });

  test('search for tops', async ({ page }) => {
    await page.getByTestId('search-input').fill('top');

    const productGrid = page.getByTestId('search-grid');
    await expect(productGrid).toBeVisible();
  });

  test('search for accessories', async ({ page }) => {
    await page.getByTestId('search-input').fill('accessories');

    const productGrid = page.getByTestId('search-grid');
    await expect(productGrid).toBeVisible();
  });

  test('filter by category - New In', async ({ page }) => {
    // Click on category filter
    await page.getByRole('link', { name: 'New In' }).click();

    // Verify products are filtered
    await expect(page.getByTestId('search-grid')).toBeVisible();
  });

  test('filter by category - Sale', async ({ page }) => {
    await page.getByRole('link', { name: 'Sale' }).click();

    await expect(page.getByTestId('search-grid')).toBeVisible();
  });
});
```

### Step 3: Create Serial Tests for Dependent Operations

Create `tests/regression/checkout.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

// Configure this describe block to run serially
test.describe.configure({ mode: 'serial' });

test.describe('Checkout Flow - Serial Execution', () => {

  test.beforeAll(async ({ browser }) => {
    // Setup that runs once before all tests in this file
    console.log('Starting checkout flow tests');
  });

  test('step 1: login and search for product', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Login
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('search-input')).toBeVisible();

    // Search for product
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
  });

  test('step 2: add product to cart', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Login
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    // Search and add to cart
    await page.getByTestId('search-input').fill('maxi dress');
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();
    await page.getByTestId('product-details-add-to-cart').click();

    // Verify cart icon shows item
    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
  });

  test('step 3: proceed to checkout', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Login and add product
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    await page.getByTestId('search-input').fill('maxi dress');
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();
    await page.getByTestId('product-details-add-to-cart').click();

    // Go to cart and checkout
    await page.getByTestId('cart-icon').click();
    await page.getByTestId('checkout-button').click();

    // Verify checkout form is visible
    await expect(page.getByTestId('checkout-name')).toBeVisible();
  });

  test('step 4: complete checkout form', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Login, add product, go to checkout
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    await page.getByTestId('search-input').fill('maxi dress');
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();
    await page.getByTestId('product-details-add-to-cart').click();

    await page.getByTestId('cart-icon').click();
    await page.getByTestId('checkout-button').click();

    // Fill checkout form
    await page.getByTestId('checkout-name').fill('Jane Doe');
    await page.getByTestId('checkout-email').fill('jane@example.com');
    await page.getByTestId('checkout-address').fill('123 Fashion Street');
    await page.getByTestId('checkout-city').fill('Singapore');
    await page.getByTestId('checkout-state').fill('SG');
    await page.getByTestId('checkout-postal').fill('123456');
    await page.getByTestId('checkout-country').fill('Singapore');

    // Apply promo code
    await page.getByTestId('promo-code-input').fill('SAVE10');
    await page.getByTestId('apply-promo-button').click();

    // Verify discount applied
    await expect(page.getByText('10%')).toBeVisible();
  });
});
```

---

## Part 3: Test Projects Configuration

### Step 1: Configure Multi-Browser and Device Projects

Update `playwright.config.ts` with projects:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 0,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {
    baseURL: 'https://taqelah.sg',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Smoke tests - run on all browsers
    {
      name: 'smoke-chromium',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'smoke-firefox',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'smoke-webkit',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },

    // Regression tests - Chromium only
    {
      name: 'regression',
      testDir: './tests/regression',
      use: { ...devices['Desktop Chrome'] },
    },

    // Mobile tests - Android and iOS
    {
      name: 'Mobile Chrome',
      testDir: './tests/mobile',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      testDir: './tests/mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
```

### Step 2: Create Smoke Tests

Create `tests/smoke/login.smoke.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Smoke Tests', () => {

  test('should display login form', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    await expect(page.getByTestId('username-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    // Verify successful login
    await expect(page.getByTestId('search-input')).toBeVisible();
  });

  test('should show validation error for invalid username', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Username must be exactly 6 letters
    await page.getByTestId('username-input').fill('test');
    await page.getByTestId('password-input').fill('test_GO');

    // Check for validation feedback
    await expect(page.getByTestId('username-input')).toHaveAttribute('class', /invalid|error/);
  });
});
```

### Step 3: Create Mobile-Specific Tests

Create `tests/mobile/navigation.mobile.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Login
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('search-input')).toBeVisible();
  });

  test('should open mobile filter menu', async ({ page }) => {
    // Mobile filter menu (slide-out overlay)
    const mobileFilterButton = page.getByTestId('mobile-filter-button');

    // Check if mobile filter button exists (only on mobile viewport)
    if (await mobileFilterButton.isVisible()) {
      await mobileFilterButton.click();

      // Verify filter menu is open
      await expect(page.getByTestId('mobile-filter-menu')).toBeVisible();
    }
  });

  test('should handle touch interactions for product selection', async ({ page }) => {
    // Search for product
    await page.getByTestId('search-input').tap();
    await page.getByTestId('search-input').fill('dress');

    // Wait for results
    await expect(page.getByTestId('search-grid')).toBeVisible();

    // Tap on first product
    await page.getByTestId('product-name-6').tap();

    // Verify product details modal
    await expect(page.getByTestId('product-details-add-to-cart')).toBeVisible();
  });

  test('should display mobile-optimized cart', async ({ page }) => {
    // Add item to cart
    await page.getByTestId('search-input').fill('maxi dress');
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();
    await page.getByTestId('product-details-add-to-cart').click();

    // Open cart
    await page.getByTestId('cart-icon').tap();

    // Verify cart is displayed
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

    // Take mobile screenshot
    await page.screenshot({ path: 'screenshots/mobile-cart.png' });
  });
});
```

---

## Part 4: Data-Driven Parameterized Tests

### Step 1: Create Test Data Files

Create `test-data/users.json`:

```json
[
  {
    "username": "ladies",
    "password": "ladies_GO",
    "expectedRole": "customer"
  }
]
```

Create `test-data/products.csv`:

```csv
productId,searchTerm,productName,category
6,maxi dress,Maxi Dress,Dresses
1,silk top,Silk Blouse,Tops
12,winter coat,Winter Coat,Outerwear
```

### Step 2: Create Parameterized Tests

Create `tests/regression/parameterized-search.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

// Load test data from CSV
const csvPath = path.join(__dirname, '../../test-data/products.csv');
const products = parse(fs.readFileSync(csvPath, 'utf-8'), {
  columns: true,
  skip_empty_lines: true,
});

test.describe('Parameterized Product Search', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Login
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('search-input')).toBeVisible();
  });

  // Generate tests from CSV data
  for (const product of products) {
    test(`search for ${product.productName} in ${product.category}`, async ({ page }) => {
      // Search for product
      await page.getByTestId('search-input').fill(product.searchTerm);

      // Wait for search results
      await expect(page.getByTestId('search-grid')).toBeVisible();

      // Verify product is in results
      const productElement = page.getByTestId(`product-name-${product.productId}`);
      await expect(productElement).toBeVisible();
    });
  }
});

// Parameterized promo code tests
const promoCodes = [
  { code: 'SAVE10', discount: '10%', description: '10% discount' },
  { code: 'WELCOME20', discount: '20%', description: '20% discount' },
  { code: 'FREESHIP', discount: 'Free Shipping', description: 'free shipping' },
];

test.describe('Parameterized Promo Codes', () => {

  promoCodes.forEach(({ code, discount, description }) => {
    test(`apply promo code for ${description}`, async ({ page }) => {
      await page.goto('/taqelah-demo-site.html');

      // Login
      await page.getByTestId('username-input').fill('ladies');
      await page.getByTestId('password-input').fill('ladies_GO');
      await page.getByTestId('login-button').click();

      // Add product to cart
      await page.getByTestId('search-input').fill('maxi dress');
      await page.getByTestId('search-grid').getByTestId('product-name-6').click();
      await page.getByTestId('product-details-add-to-cart').click();

      // Go to checkout
      await page.getByTestId('cart-icon').click();
      await page.getByTestId('checkout-button').click();

      // Apply promo code
      await page.getByTestId('promo-code-input').fill(code);
      await page.getByTestId('apply-promo-button').click();

      // Verify discount is applied
      await expect(page.getByText(discount)).toBeVisible();
    });
  });
});
```

### Step 3: Create Custom Test Options Fixture

Create `fixtures/test-options.ts`:

```typescript
import { test as base } from '@playwright/test';

type TestOptions = {
  environment: 'staging' | 'production';
  userType: 'customer' | 'guest';
};

export const test = base.extend<TestOptions>({
  environment: ['staging', { option: true }],
  userType: ['customer', { option: true }],
});

export { expect } from '@playwright/test';
```

### Step 4: Add Environment-Based Projects

Add to `playwright.config.ts`:

```typescript
// Add these to the projects array
{
  name: 'staging',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'https://taqelah.sg',
  },
},
{
  name: 'production',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'https://taqelah.sg',
  },
},
```

---

## Part 5: Running and Analyzing Tests

### Running Tests with Different Configurations

```bash
# Run all tests with default parallelization
npx playwright test

# Run with specific number of workers
npx playwright test --workers=1
npx playwright test --workers=4

# Compare execution times
time npx playwright test --workers=1
time npx playwright test --workers=4

# Run only smoke tests (all browsers)
npx playwright test --project=smoke-*

# Run regression tests (Chromium only)
npx playwright test --project=regression

# Run mobile tests
npx playwright test --project="Mobile Chrome" --project="Mobile Safari"

# Run with sharding (for CI)
npx playwright test --shard=1/3
npx playwright test --shard=2/3
npx playwright test --shard=3/3
```

### Viewing Reports

```bash
# Generate and view HTML report
npx playwright test --reporter=html
npx playwright show-report

# Run with multiple reporters
npx playwright test --reporter=list --reporter=html
```

---

## Part 6: Exercise Challenges

### Challenge 1: Worker Isolation

Create a worker-scoped fixture that generates unique test data per worker:

```typescript
// fixtures/worker-fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend<{}, { uniqueEmail: string }>({
  uniqueEmail: [async ({}, use, workerInfo) => {
    const email = `test-worker-${workerInfo.workerIndex}-${Date.now()}@example.com`;
    await use(email);
  }, { scope: 'worker' }],
});
```

Use this fixture in checkout tests to ensure each worker uses unique email addresses.

### Challenge 2: Project Dependencies

Add a setup project that runs before other tests:

```typescript
// In playwright.config.ts
{
  name: 'setup',
  testMatch: /.*\.setup\.ts/,
},
{
  name: 'regression',
  dependencies: ['setup'],
  use: { ...devices['Desktop Chrome'] },
},
```

Create `tests/global.setup.ts`:

```typescript
import { test as setup } from '@playwright/test';

setup('verify site is accessible', async ({ page }) => {
  await page.goto('/taqelah-demo-site.html');
  await page.waitForLoadState('networkidle');
});
```

### Challenge 3: Comprehensive Test Suite

Organize tests with the following requirements:
1. Smoke tests run on all 3 browsers (Chromium, Firefox, WebKit)
2. Regression tests run only on Chromium with full parallelization
3. Mobile tests run on both Pixel 5 and iPhone 13
4. Add parameterized tests for:
   - Multiple product categories
   - Different promo codes
5. Configure sharding for CI/CD

---

## Summary

In this lab, you learned:

- **Parallel Execution**: Configure workers and run tests simultaneously
- **Serial Mode**: Handle dependent tests that must run in order
- **Test Projects**: Organize tests by browser, device, and purpose
- **Parameterization**: Create data-driven tests from JSON and CSV
- **Worker Isolation**: Prevent race conditions with worker-scoped fixtures
- **Sharding**: Split tests across multiple CI runners

---

## Common Issues and Solutions

### Issue: Tests fail randomly in parallel mode
**Solution**: Tests have shared state. Use worker-scoped fixtures or unique test data per test.

### Issue: Mobile tests behave differently
**Solution**: Use viewport-aware conditionals or create separate mobile test files.

### Issue: Parameterized tests all fail together
**Solution**: Check shared setup code. Each parameterized test should be independent.

### Issue: Sharding doesn't distribute evenly
**Solution**: Ensure tests have similar execution times. Consider grouping by complexity.

---

## Additional Resources

- [Parallelization Guide](https://playwright.dev/docs/test-parallel)
- [Test Projects](https://playwright.dev/docs/test-projects)
- [Parameterize Tests](https://playwright.dev/docs/test-parameterize)
- [Test Sharding](https://playwright.dev/docs/test-sharding)

---

> **Note:** All contents of this workshop are proprietary and belong to **Taqelah**. Do not share or distribute without permission.
