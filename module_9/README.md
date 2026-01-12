# Module 9: Capstone Project

**Duration:** 60 minutes
**Level:** All levels (applies everything learned)
**Prerequisites:** Completed Modules 2-8

> **Workshop Finale:** Put everything you've learned into practice by building a complete end-to-end test suite for a real application.

---

## Project Overview

In this capstone project, you will build a comprehensive Playwright test automation suite for the **Taqelah Boutique Demo Site**. This project integrates all concepts from Modules 2-8.

**Target Application:** https://taqelah.sg/taqelah-demo-site.html

---

## Learning Objectives

By completing this capstone, you will demonstrate ability to:
- Set up a complete Playwright project from scratch
- Implement Page Object Model architecture
- Create custom fixtures for authentication
- Write comprehensive E2E tests
- Organize tests with proper tags and structure
- Configure multi-browser execution
- Generate and analyze test reports

---

## Project Requirements

### Deliverables

Your completed project should include:

| Component | Description | Module Reference |
|-----------|-------------|------------------|
| Project Setup | Configured `playwright.config.ts` | Module 3 |
| Page Objects | At least 3 page classes | Module 4 |
| Custom Fixtures | Authentication fixture | Module 4 |
| E2E Tests | Minimum 5 test cases | Module 2-3 |
| Test Organization | @smoke and @regression tags | Module 3 |
| Multi-browser | Chrome, Firefox, Mobile | Module 6 |
| Reporting | HTML report configured | Module 5 |

---

## Project Structure

Create the following structure:

```
taqelah-capstone/
├── tests/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── logout.spec.ts
│   ├── products/
│   │   └── browse-products.spec.ts
│   └── cart/
│       └── shopping-cart.spec.ts
├── pages/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   └── ProductPage.ts
├── fixtures/
│   └── auth.fixture.ts
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Part 1: Project Setup (10 minutes)

### Task 1.1: Initialize Project

```bash
mkdir taqelah-capstone
cd taqelah-capstone
npm init -y
npm install -D @playwright/test typescript
npx playwright install
```

### Task 1.2: Create Playwright Configuration

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
  ],

  use: {
    baseURL: 'https://taqelah.sg',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

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
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
```

### Task 1.3: Create Folder Structure

```bash
mkdir -p tests/auth tests/products tests/cart
mkdir -p pages fixtures
```

---

## Part 2: Page Objects (15 minutes)

### Task 2.1: Create BasePage

Create `pages/BasePage.ts`:

```typescript
import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}

  abstract get pageURL(): string;

  async goto() {
    await this.page.goto(this.pageURL);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`
    });
  }
}
```

### Task 2.2: Create LoginPage

Create `pages/LoginPage.ts`:

```typescript
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  get pageURL(): string {
    return '/taqelah-demo-site.html';
  }

  // Locators
  private usernameInput(): Locator {
    return this.page.getByLabel('Username') ||
           this.page.locator('input[type="text"]').first();
  }

  private passwordInput(): Locator {
    return this.page.getByLabel('Password') ||
           this.page.locator('input[type="password"]');
  }

  private loginButton(): Locator {
    return this.page.getByRole('button', { name: /login|submit/i });
  }

  private welcomeMessage(): Locator {
    return this.page.getByText(/welcome|dashboard/i);
  }

  // Actions
  async login(username: string, password: string) {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await this.welcomeMessage().waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getWelcomeText(): Promise<string> {
    return await this.welcomeMessage().textContent() || '';
  }
}
```

### Task 2.3: Create DashboardPage

Create `pages/DashboardPage.ts`:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  get pageURL(): string {
    return '/taqelah-demo-site.html';
  }

  // Locators
  private welcomeText(): Locator {
    return this.page.getByText(/welcome/i);
  }

  private logoutButton(): Locator {
    return this.page.getByRole('button', { name: /logout/i });
  }

  private productSection(): Locator {
    return this.page.locator('.products, [data-testid="products"]');
  }

  // Actions
  async isLoaded(): Promise<boolean> {
    try {
      await this.welcomeText().waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async logout() {
    await this.logoutButton().click();
  }

  async getUsername(): Promise<string> {
    const text = await this.welcomeText().textContent() || '';
    // Extract username from welcome message
    return text.replace(/welcome,?\s*/i, '').trim();
  }
}
```

### Task 2.4: Create ProductPage (Your Turn!)

Create `pages/ProductPage.ts` with:
- Locators for product list, product cards, add to cart buttons
- Methods: `getProductCount()`, `addToCart(index)`, `getProductName(index)`

---

## Part 3: Fixtures (10 minutes)

### Task 3.1: Create Authentication Fixture

Create `fixtures/auth.fixture.ts`:

```typescript
import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

// Test credentials
const TEST_USER = {
  username: 'ladies',
  password: 'ladies_GO',
};

type AuthFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  authenticatedPage: async ({ page }, use) => {
    // Setup: Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER.username, TEST_USER.password);

    // Wait for login to complete
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.isLoaded();

    // Provide authenticated page to test
    await use(page);

    // Teardown: Logout (optional)
    // await dashboardPage.logout();
  },
});

export { expect } from '@playwright/test';
```

---

## Part 4: Write Tests (20 minutes)

### Task 4.1: Login Tests

Create `tests/auth/login.spec.ts`:

```typescript
import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Login Functionality', () => {

  test('should display login form @smoke', async ({ loginPage }) => {
    await loginPage.goto();

    // Verify login page loaded
    await expect(loginPage['page']).toHaveURL(/taqelah-demo-site/);
  });

  test('should login with valid credentials @smoke', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('ladies', 'ladies_GO');

    // Verify successful login
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);
  });

  test('should show error for invalid credentials @regression', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('ladies', 'wrong_password');

    // Verify login failed
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBe(false);
  });

});
```

### Task 4.2: Dashboard Tests

Create `tests/auth/logout.spec.ts`:

```typescript
import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Logout Functionality', () => {

  test('should access dashboard when authenticated @smoke', async ({
    authenticatedPage,
    dashboardPage
  }) => {
    // Already logged in via fixture
    const isLoaded = await dashboardPage.isLoaded();
    expect(isLoaded).toBe(true);
  });

  test('should display username on dashboard @regression', async ({
    authenticatedPage,
    dashboardPage
  }) => {
    const username = await dashboardPage.getUsername();
    expect(username.toLowerCase()).toContain('ladies');
  });

});
```

### Task 4.3: Product Tests (Your Turn!)

Create `tests/products/browse-products.spec.ts` with:
- Test: "should display products on dashboard" @smoke
- Test: "should show product details" @regression
- Test: "should add product to cart" @regression

### Task 4.4: Cart Tests (Your Turn!)

Create `tests/cart/shopping-cart.spec.ts` with:
- Test: "should show empty cart initially" @smoke
- Test: "should add items to cart" @regression
- Test: "should update cart total" @regression

---

## Part 5: Run and Verify (5 minutes)

### Task 5.1: Run All Tests

```bash
# Run all tests
npx playwright test

# Run smoke tests only
npx playwright test --grep @smoke

# Run in headed mode
npx playwright test --headed

# Run specific browser
npx playwright test --project=chromium
```

### Task 5.2: View Report

```bash
npx playwright show-report
```

### Task 5.3: Debug Failures (if any)

```bash
# Debug mode
npx playwright test --debug

# UI mode
npx playwright test --ui
```

---

## Evaluation Criteria

Your capstone will be evaluated on:

| Criteria | Points | Description |
|----------|--------|-------------|
| **Project Structure** | 20 | Correct folder organization |
| **Page Objects** | 25 | Proper POM implementation |
| **Fixtures** | 15 | Working auth fixture |
| **Test Cases** | 25 | Minimum 5 passing tests |
| **Tags & Organization** | 10 | Proper @smoke/@regression tags |
| **Configuration** | 5 | Multi-browser setup |

**Total: 100 points**

---

## Bonus Challenges

Complete these for extra credit:

### Challenge 1: API Integration (10 points)
Add an API test that verifies backend data matches UI.

### Challenge 2: Visual Testing (10 points)
Add a visual regression test for the login page.

### Challenge 3: Data-Driven Tests (10 points)
Parameterize login tests with multiple user credentials from a JSON file.

### Challenge 4: CI/CD Pipeline (10 points)
Create a GitHub Actions workflow to run tests on push.

---

## Submission Checklist

Before submitting, verify:

- [ ] All tests pass: `npx playwright test`
- [ ] Smoke tests pass: `npx playwright test --grep @smoke`
- [ ] HTML report generates: `npx playwright show-report`
- [ ] Tests run on multiple browsers
- [ ] No hardcoded waits (`waitForTimeout`)
- [ ] Page objects follow conventions
- [ ] README documents how to run tests

---

## Solution Reference

If you get stuck, reference patterns from:
- Module 4: [playwright-fixtures/](../module_4/playwright-fixtures/)
- Module 6: [playwright-test-projects/](../module_6/playwright-test-projects/)
- Module 8: [lab_exercise_build_framework.md](../module_8/lab_exercise_build_framework.md)

---

## Congratulations! 🎉

You've completed the Playwright Workshop!

### What You've Learned:
- ✅ Playwright fundamentals and test writing
- ✅ Configuration and CLI mastery
- ✅ Debugging with Trace Viewer
- ✅ Page Object Model and fixtures
- ✅ Locator strategies and global setup
- ✅ Parallel execution and parameterization
- ✅ API testing and network mocking
- ✅ AI-assisted framework development
- ✅ Building complete test suites

### Next Steps:
1. Apply these skills to your own projects
2. Explore advanced Playwright features (components, visual testing)
3. Join the Playwright community
4. Share your knowledge with your team

---

**Happy Testing! 🎭**

---

> **Note:** All contents of this workshop are proprietary and belong to **Taqelah**. Do not share or distribute without permission.
