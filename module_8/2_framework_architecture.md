# Framework Architecture Design

## Why Framework Architecture Matters

A well-designed test automation framework provides:

- **Maintainability** - Easy to update when application changes
- **Scalability** - Handles growing test suites efficiently
- **Reusability** - Share code across tests
- **Reliability** - Consistent test execution
- **Readability** - Easy for team members to understand

---

## Core Framework Patterns

### 1. Page Object Model (POM)

The most important pattern for UI test automation.

**Concept:**
- Each page/component has its own class
- Encapsulates page elements and actions
- Tests interact with page objects, not raw selectors

**Benefits:**
- Single place to update when UI changes
- Readable test code
- Reusable page methods

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  // Locators
  private usernameInput = () => this.page.getByTestId('username');
  private passwordInput = () => this.page.getByTestId('password');
  private submitButton = () => this.page.getByRole('button', { name: 'Login' });

  // Actions
  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(password);
    await this.submitButton().click();
  }
}
```

### 2. Fixture Pattern

Playwright's built-in pattern for setup/teardown and dependency injection.

**Concept:**
- Define reusable setup/teardown logic
- Inject dependencies into tests
- Scope to test or worker level

```typescript
// fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type AuthFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('testuser', 'password');
    await use(page);
  },
});
```

### 3. Configuration Pattern

Manage environment-specific settings centrally.

```typescript
// config/environments.ts
export const environments = {
  dev: {
    baseURL: 'https://dev.example.com',
    apiURL: 'https://api.dev.example.com',
  },
  staging: {
    baseURL: 'https://staging.example.com',
    apiURL: 'https://api.staging.example.com',
  },
  prod: {
    baseURL: 'https://example.com',
    apiURL: 'https://api.example.com',
  },
};

export const currentEnv = environments[process.env.TEST_ENV || 'staging'];
```

---

## Recommended Folder Structure

```
playwright-framework/
│
├── tests/                      # All test files
│   ├── e2e/                    # End-to-end UI tests
│   │   ├── auth/               # Authentication tests
│   │   │   ├── login.spec.ts
│   │   │   └── logout.spec.ts
│   │   ├── cart/               # Shopping cart tests
│   │   │   ├── add-item.spec.ts
│   │   │   └── remove-item.spec.ts
│   │   └── checkout/           # Checkout flow tests
│   │       └── purchase.spec.ts
│   │
│   ├── api/                    # API tests
│   │   ├── users.spec.ts
│   │   └── products.spec.ts
│   │
│   └── visual/                 # Visual regression tests
│       └── screenshots.spec.ts
│
├── pages/                      # Page Object classes
│   ├── BasePage.ts             # Base class with common methods
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
│
├── components/                 # Reusable UI components
│   ├── Header.ts
│   ├── Footer.ts
│   ├── SearchBar.ts
│   └── ProductCard.ts
│
├── fixtures/                   # Playwright fixtures
│   ├── base.fixture.ts         # Base test with all fixtures
│   ├── auth.fixture.ts         # Authentication fixtures
│   ├── pages.fixture.ts        # Page object fixtures
│   └── data.fixture.ts         # Test data fixtures
│
├── utils/                      # Utility functions
│   ├── helpers.ts              # General helpers
│   ├── api-client.ts           # API request wrapper
│   ├── data-generator.ts       # Test data generation
│   └── wait-helpers.ts         # Custom wait functions
│
├── config/                     # Configuration files
│   ├── environments.ts         # Environment configs
│   ├── test-config.ts          # Test settings
│   └── browser-config.ts       # Browser-specific configs
│
├── data/                       # Test data files
│   ├── users.json              # User credentials
│   ├── products.json           # Product data
│   └── test-cases.csv          # Parameterized test data
│
├── reports/                    # Test reports (gitignored)
│   ├── html/
│   ├── json/
│   └── screenshots/
│
├── .github/                    # CI/CD configuration
│   └── workflows/
│       └── playwright.yml
│
├── playwright.config.ts        # Playwright configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## Component Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                        playwright.config.ts                      │
│                   (Global configuration)                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Fixtures                                │
│         (Setup, teardown, dependency injection)                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│   │   Auth   │  │  Pages   │  │   Data   │  │   API    │       │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Test Files                               │
│              (Consume fixtures, use page objects)                │
│   ┌──────────────────────────────────────────────────────┐      │
│   │  test('should login', async ({ loginPage }) => {     │      │
│   │    await loginPage.goto();                           │      │
│   │    await loginPage.login('user', 'pass');            │      │
│   │  });                                                 │      │
│   └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Page Objects                              │
│            (Encapsulate UI elements and actions)                 │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│   │  BasePage  │◄─┤ LoginPage  │  │ CartPage   │               │
│   └────────────┘  └────────────┘  └────────────┘               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Utilities                                │
│              (Helpers, API client, data generators)              │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│   │ Helpers  │  │API Client│  │Data Gen  │  │  Waits   │       │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Design Principles

### 1. Single Responsibility
Each class/file should have one purpose:
- Page objects handle UI interactions
- Fixtures handle setup/teardown
- Utilities provide helper functions
- Config manages settings

### 2. DRY (Don't Repeat Yourself)
- Common logic in BasePage
- Shared fixtures for repeated setup
- Utility functions for repeated operations

### 3. Encapsulation
- Hide implementation details in page objects
- Tests should read like user stories
- Selectors should not leak into tests

### 4. Configurability
- Environment-specific settings
- Easy to switch between browsers
- Parameterized test data

---

## BasePage Design

The BasePage class provides common functionality:

```typescript
// pages/BasePage.ts
import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}

  // Abstract - subclasses must implement
  abstract readonly pageURL: string;

  // Navigation
  async goto() {
    await this.page.goto(this.pageURL);
  }

  async goBack() {
    await this.page.goBack();
  }

  // Waits
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(locator: Locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  // Common Actions
  async getTitle() {
    return await this.page.title();
  }

  async getCurrentURL() {
    return this.page.url();
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `reports/screenshots/${name}.png` });
  }

  // Assertions
  async verifyURL(expectedURL: string | RegExp) {
    await expect(this.page).toHaveURL(expectedURL);
  }

  async verifyTitle(expectedTitle: string | RegExp) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  // Error Handling
  async safeClick(locator: Locator) {
    try {
      await locator.click();
    } catch (error) {
      await this.takeScreenshot('click-error');
      throw error;
    }
  }
}
```

---

## Fixture Organization

### Base Fixture (Combines All)

```typescript
// fixtures/base.fixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CartPage } from '../pages/CartPage';
import { APIClient } from '../utils/api-client';

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  cartPage: CartPage;
};

type UtilityFixtures = {
  apiClient: APIClient;
};

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<PageFixtures & UtilityFixtures & AuthFixtures>({
  // Page Objects
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  // Utilities
  apiClient: async ({ request }, use) => {
    await use(new APIClient(request));
  },

  // Auth
  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    await loginPage.login('testuser', 'password');
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

---

## Configuration Strategy

### Multi-Environment Support

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import { currentEnv } from './config/environments';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html' }],
    ['json', { outputFile: 'reports/json/results.json' }],
  ],

  use: {
    baseURL: currentEnv.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Desktop browsers
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
    // Mobile devices
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
```

---

## Summary

A well-architected framework includes:

1. **Page Objects** - Encapsulate UI interactions
2. **Fixtures** - Handle setup/teardown
3. **Utilities** - Provide helper functions
4. **Configuration** - Manage environments and settings
5. **Clear folder structure** - Organize by feature/function
6. **Base classes** - Share common functionality

---

## Next Topic

Continue to [3_building_components.md](3_building_components.md) to learn how to build these components using Claude Code.
