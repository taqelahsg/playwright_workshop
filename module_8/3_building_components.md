# Building Framework Components with Claude Code

This guide provides step-by-step Claude Code prompts to build a complete Playwright framework.

---

## Phase 1: Project Setup

### Step 1.1: Initialize Project

**Prompt to Claude Code:**
```
Create a new Playwright TypeScript project with:
- Initialize npm project
- Install Playwright with all browsers
- Add TypeScript configuration
- Create basic folder structure: tests/, pages/, fixtures/, utils/, config/, data/
- Add .gitignore for node_modules, test-results, reports
```

**Expected Output:**
Claude will execute:
```bash
npm init -y
npm install -D @playwright/test typescript
npx playwright install
```

And create necessary folders and files.

---

### Step 1.2: TypeScript Configuration

**Prompt:**
```
Create a tsconfig.json optimized for Playwright with:
- Strict mode enabled
- ES2020 target
- Module resolution for Node
- Path aliases for @pages, @fixtures, @utils, @config
- Include tests folder
```

**Expected tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["pages/*"],
      "@fixtures/*": ["fixtures/*"],
      "@utils/*": ["utils/*"],
      "@config/*": ["config/*"],
      "@data/*": ["data/*"]
    }
  },
  "include": ["tests/**/*", "pages/**/*", "fixtures/**/*", "utils/**/*", "config/**/*"],
  "exclude": ["node_modules"]
}
```

---

## Phase 2: Core Components

### Step 2.1: BasePage Class

**Prompt:**
```
Create a BasePage class in pages/BasePage.ts with:

TypeScript class that:
- Takes Page object in constructor
- Has abstract pageURL property
- Includes methods:
  - goto() - navigate to pageURL
  - waitForPageLoad() - wait for network idle
  - getTitle() - return page title
  - getCurrentURL() - return current URL
  - takeScreenshot(name) - save screenshot to reports/screenshots/
  - verifyURL(expected) - assert URL matches
  - verifyTitle(expected) - assert title matches
  - safeClick(locator) - click with error handling and screenshot on failure

Use Playwright's Page, Locator, and expect types.
Include proper TypeScript types and JSDoc comments.
```

---

### Step 2.2: LoginPage Class

**Prompt:**
```
Create a LoginPage class in pages/LoginPage.ts that extends BasePage with:

Target site: https://taqelah.sg/taqelah-demo-site.html

Locators (as private methods returning Locator):
- usernameInput - input field for username
- passwordInput - input field for password
- loginButton - submit button
- errorMessage - error message element
- welcomeMessage - welcome text after login

Methods:
- goto() - navigate to login page
- login(username, password) - fill credentials and submit
- getErrorMessage() - return error text
- isLoggedIn() - check if welcome message visible
- clearForm() - clear both input fields

Include proper TypeScript types and extend BasePage.
```

---

### Step 2.3: DashboardPage Class

**Prompt:**
```
Create a DashboardPage class in pages/DashboardPage.ts that extends BasePage with:

Locators:
- welcomeText - welcome message with username
- logoutButton - logout button
- navigationMenu - main navigation
- userProfile - user profile section

Methods:
- isLoaded() - verify dashboard loaded (check welcome text visible)
- logout() - click logout button
- getWelcomeText() - return welcome message text
- navigateTo(menuItem) - click navigation menu item
- getUserName() - extract username from welcome text

Extend BasePage and include proper types.
```

---

### Step 2.4: ProductPage and CartPage

**Prompt:**
```
Create two page object classes:

1. pages/ProductPage.ts (extends BasePage):
   Locators:
   - productList - container with all products
   - productCards - individual product cards
   - productName(index) - product name by index
   - productPrice(index) - product price by index
   - addToCartButton(index) - add to cart button by index

   Methods:
   - getProductCount() - return number of products
   - getProductName(index) - get name of product at index
   - getProductPrice(index) - get price of product at index
   - addToCart(index) - click add to cart for product at index
   - addToCartByName(name) - find product by name and add to cart

2. pages/CartPage.ts (extends BasePage):
   Locators:
   - cartItems - list of items in cart
   - cartItemName(index) - item name at index
   - cartItemQuantity(index) - item quantity at index
   - cartTotal - cart total amount
   - checkoutButton - proceed to checkout
   - removeButton(index) - remove item button

   Methods:
   - getItemCount() - return number of items in cart
   - getTotal() - return cart total as number
   - removeItem(index) - remove item at index
   - checkout() - click checkout button
   - isEmpty() - check if cart is empty
```

---

## Phase 3: Fixtures

### Step 3.1: Page Object Fixtures

**Prompt:**
```
Create fixtures/pages.fixture.ts that provides page objects as fixtures:

Import all page classes (LoginPage, DashboardPage, ProductPage, CartPage)

Define PageFixtures type with:
- loginPage: LoginPage
- dashboardPage: DashboardPage
- productPage: ProductPage
- cartPage: CartPage

Extend base test to provide each page object fixture.
Each fixture should create the page object with the page instance.

Export the extended test and expect.
```

---

### Step 3.2: Authentication Fixture

**Prompt:**
```
Create fixtures/auth.fixture.ts with authentication fixtures:

Define AuthFixtures type with:
- authenticatedPage: Page (logged in as default user)
- adminPage: Page (logged in as admin user)

Create fixture authenticatedPage that:
1. Creates LoginPage instance
2. Navigates to login
3. Logs in with credentials from environment or defaults (ladies/ladies_GO)
4. Waits for dashboard to load
5. Provides the authenticated page to test
6. (Optional) Logs out after test

Create fixture adminPage that:
1. Same flow but with admin credentials (admin/admin_GO)

Include test data types for user credentials.
Export extended test.
```

---

### Step 3.3: Combined Base Fixture

**Prompt:**
```
Create fixtures/base.fixture.ts that combines all fixtures:

Import and merge:
- Page fixtures (loginPage, dashboardPage, productPage, cartPage)
- Auth fixtures (authenticatedPage, adminPage)
- Add apiClient fixture using Playwright's request context

Create APIClient class in same file or import from utils that:
- Takes APIRequestContext in constructor
- Has methods: get(), post(), put(), delete()
- Handles JSON responses
- Includes error handling

Export the combined test and expect.
This will be the main import for all tests.
```

---

## Phase 4: Utilities

### Step 4.1: Helper Functions

**Prompt:**
```
Create utils/helpers.ts with common utility functions:

Functions:
- formatDate(date: Date, format: string) - format date to string
- generateRandomString(length: number) - random alphanumeric string
- generateRandomEmail() - random email address
- sleep(ms: number) - promise-based delay
- retry<T>(fn, maxAttempts, delayMs) - retry function with backoff
- parsePrice(priceString: string) - extract number from price string like "$99.99"
- sanitizeTestName(name: string) - create safe filename from test name

Include proper TypeScript types and JSDoc comments.
```

---

### Step 4.2: Test Data Generator

**Prompt:**
```
Create utils/data-generator.ts for generating test data:

Types:
- User: { username, password, email, firstName, lastName }
- Product: { name, description, price, quantity }
- Address: { street, city, state, zip, country }

Functions:
- generateUser(overrides?) - create random user, merge with overrides
- generateProduct(overrides?) - create random product
- generateAddress(overrides?) - create random address
- generateOrder(userId, products[]) - create order object

Use faker-like random data (can implement simple version or note to install faker).
Export types and functions.
```

---

### Step 4.3: API Client

**Prompt:**
```
Create utils/api-client.ts with a reusable API client class:

Class APIClient:
- Constructor takes APIRequestContext and optional baseURL
- Properties: request, baseURL

Methods:
- get<T>(endpoint, options?) - GET request, return typed response
- post<T>(endpoint, data, options?) - POST request
- put<T>(endpoint, data, options?) - PUT request
- patch<T>(endpoint, data, options?) - PATCH request
- delete<T>(endpoint, options?) - DELETE request

Each method should:
- Construct full URL from baseURL + endpoint
- Handle JSON serialization
- Include error handling
- Return typed response or throw on error

Include helper method:
- handleResponse<T>(response) - parse response, throw if not ok
```

---

## Phase 5: Configuration

### Step 5.1: Environment Configuration

**Prompt:**
```
Create config/environments.ts with environment-specific settings:

Define Environment type:
- name: string
- baseURL: string
- apiURL: string
- timeout: number
- credentials: { username, password }

Define environments object with:
- dev: development environment settings
- staging: staging environment settings
- prod: production environment settings

Export:
- environments object
- getCurrentEnv() function that reads from TEST_ENV env var
- currentEnv constant with active environment
```

---

### Step 5.2: Playwright Configuration

**Prompt:**
```
Create playwright.config.ts with comprehensive configuration:

Use environment config for baseURL.

Settings:
- testDir: './tests'
- fullyParallel: true
- forbidOnly in CI
- retries: 2 in CI, 0 locally
- workers: 2 in CI, undefined locally
- timeout: 30000

Reporters:
- list (console)
- html (reports/html)
- json (reports/json/results.json)
- junit for CI (reports/junit/results.xml)

Use options:
- baseURL from environment
- trace: 'on-first-retry'
- screenshot: 'only-on-failure'
- video: 'retain-on-failure'

Projects:
- chromium (Desktop Chrome)
- firefox (Desktop Firefox)
- webkit (Desktop Safari)
- mobile-chrome (Pixel 5)
- mobile-safari (iPhone 13)

Global setup/teardown placeholders (commented out).
```

---

## Phase 6: Sample Tests

### Step 6.1: Login Tests

**Prompt:**
```
Create tests/e2e/auth/login.spec.ts with login test cases:

Import test and expect from fixtures/base.fixture.

Test suite "Login Functionality":

1. Test "should login with valid credentials" @smoke:
   - Use loginPage fixture
   - Navigate to login
   - Login with valid credentials
   - Verify redirect to dashboard
   - Verify welcome message visible

2. Test "should show error for invalid password":
   - Login with valid username, wrong password
   - Verify error message displayed
   - Verify still on login page

3. Test "should show error for empty fields":
   - Click login without entering credentials
   - Verify validation error

4. Test "should logout successfully":
   - Use authenticatedPage fixture
   - Click logout
   - Verify redirect to login page

Use proper assertions and descriptive test names.
```

---

### Step 6.2: Cart Tests

**Prompt:**
```
Create tests/e2e/cart/add-to-cart.spec.ts with cart test cases:

Import test from fixtures/base.fixture.

Test suite "Shopping Cart":

1. Test "should add product to cart" @smoke:
   - Use authenticatedPage and productPage fixtures
   - Navigate to products
   - Add first product to cart
   - Verify cart count increased

2. Test "should display correct product in cart":
   - Add product by name
   - Navigate to cart
   - Verify product name matches
   - Verify price matches

3. Test "should remove product from cart":
   - Add product to cart
   - Navigate to cart
   - Remove the product
   - Verify cart is empty

4. Test "should calculate correct total":
   - Add multiple products
   - Navigate to cart
   - Verify total equals sum of prices

Use page objects for all interactions.
```

---

## Phase 7: Final Assembly

### Step 7.1: Package.json Scripts

**Prompt:**
```
Update package.json with useful npm scripts:

Scripts:
- "test": "playwright test"
- "test:headed": "playwright test --headed"
- "test:debug": "playwright test --debug"
- "test:ui": "playwright test --ui"
- "test:chrome": "playwright test --project=chromium"
- "test:firefox": "playwright test --project=firefox"
- "test:mobile": "playwright test --project=mobile-chrome --project=mobile-safari"
- "test:smoke": "playwright test --grep @smoke"
- "test:regression": "playwright test --grep @regression"
- "report": "playwright show-report reports/html"
- "trace": "playwright show-trace"
- "codegen": "playwright codegen"
- "lint": "eslint . --ext .ts"
- "clean": "rm -rf test-results reports playwright-report"
```

---

### Step 7.2: README Documentation

**Prompt:**
```
Create a comprehensive README.md for the framework:

Sections:
1. Project Overview - what this framework is
2. Prerequisites - Node.js, npm versions
3. Installation - clone, npm install, playwright install
4. Project Structure - explain folder layout
5. Running Tests - all npm script commands
6. Writing Tests - how to create new tests
7. Page Objects - how to create/use page objects
8. Fixtures - available fixtures and how to use
9. Configuration - how to switch environments
10. CI/CD - how to integrate with pipelines
11. Reporting - where to find reports
12. Troubleshooting - common issues and solutions

Include code examples for each section.
```

---

## Summary Checklist

After completing all prompts, your framework should have:

- [ ] Project initialized with Playwright and TypeScript
- [ ] Folder structure: tests/, pages/, fixtures/, utils/, config/, data/
- [ ] BasePage with common functionality
- [ ] Page objects for Login, Dashboard, Product, Cart
- [ ] Fixtures for pages, authentication, API client
- [ ] Utility helpers and data generators
- [ ] Environment configuration
- [ ] Comprehensive playwright.config.ts
- [ ] Sample test files for login and cart
- [ ] npm scripts for all common operations
- [ ] README documentation

---

## Next Topic

Continue to [lab_exercise_build_framework.md](lab_exercise_build_framework.md) for the hands-on lab exercise.
