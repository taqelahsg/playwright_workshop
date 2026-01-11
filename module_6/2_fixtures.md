# Playwright Fixtures

This guide explains Playwright Test fixtures, which provide a powerful way to set up test environments, share code across tests, and improve test organization.

## What Are Fixtures?

Fixtures establish the environment for each test, giving the test everything it needs and nothing else. Think of fixtures as reusable building blocks that handle setup and teardown for your tests.

**Key benefits:**
- **Encapsulation**: Setup and teardown code are bundled together
- **Reusability**: Share fixtures across multiple test files
- **On-demand**: Only initialize fixtures that tests actually use
- **Composability**: Fixtures can depend on other fixtures
- **Flexibility**: Each test can use different fixture combinations
- **Better organization**: Group tests by what they do, not how they're set up

---

## Built-in Fixtures

Playwright provides several built-in fixtures out of the box:

### 1. `page` Fixture

The most commonly used fixture. Provides an isolated browser page for each test.

```typescript
import { test, expect } from '@playwright/test';

test('basic page test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});
```

**Characteristics:**
- **Scope**: Test-scoped (new page for each test)
- **Isolation**: Each test gets a fresh page
- **Auto-cleanup**: Automatically closed after test

### 2. `context` Fixture

Provides an isolated browser context (similar to an incognito window).

```typescript
test('context test', async ({ context }) => {
  // Create multiple pages in the same context
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  await page1.goto('https://example.com');
  await page2.goto('https://playwright.dev');

  // Pages share cookies and storage
});
```

**Characteristics:**
- **Scope**: Test-scoped
- **Use cases**: Multiple pages, shared state, cookie testing
- **Isolation**: Independent context per test

### 3. `browser` Fixture

Provides access to the browser instance, shared across tests for efficiency.

```typescript
test('browser test', async ({ browser }) => {
  // Create a custom context with specific options
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Custom User Agent',
  });

  const page = await context.newPage();
  await page.goto('https://example.com');

  await context.close();
});
```

**Characteristics:**
- **Scope**: Worker-scoped (shared across tests in same worker)
- **Performance**: Reduces browser launch overhead
- **Use cases**: Custom context configurations

### 4. `browserName` Fixture

Returns the name of the browser being tested ('chromium', 'firefox', or 'webkit').

```typescript
test('browser-specific test', async ({ page, browserName }) => {
  await page.goto('https://example.com');

  if (browserName === 'webkit') {
    // Safari-specific behavior
    await page.locator('.safari-button').click();
  } else {
    // Chrome/Firefox behavior
    await page.locator('.default-button').click();
  }
});
```

**Characteristics:**
- **Scope**: Worker-scoped
- **Use cases**: Browser-specific logic, conditional tests

### 5. `request` Fixture

Provides an API request context for making HTTP requests.

```typescript
test('API test with request fixture', async ({ request }) => {
  const response = await request.get('https://api.github.com/users/microsoft');

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const data = await response.json();
  expect(data.login).toBe('microsoft');
});
```

**Characteristics:**
- **Scope**: Test-scoped
- **Use cases**: API testing, setup via APIs, data validation

---

## Creating Custom Fixtures

Custom fixtures let you create reusable test components tailored to your application.

### Basic Custom Fixture

```typescript
import { test as base } from '@playwright/test';

// Define fixture types
type MyFixtures = {
  todoPage: TodoPage;
};

// Extend base test with custom fixture
const test = base.extend<MyFixtures>({
  todoPage: async ({ page }, use) => {
    // Setup: Create and initialize the page object
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    // Provide the fixture to the test
    await use(todoPage);

    // Teardown: Clean up after test
    await todoPage.removeAll();
  },
});

export { test, expect } from '@playwright/test';

// Use the custom fixture in tests
test('add todo item', async ({ todoPage }) => {
  await todoPage.addTodo('Buy milk');
  await expect(todoPage.todoItems).toHaveCount(1);
});
```

**The `use` callback pattern:**
1. Code before `use()` runs during setup
2. `use(value)` provides the fixture to the test
3. Code after `use()` runs during teardown

### Page Object Fixture Example

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

type Pages = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
```

```typescript
// login.spec.ts
import { test, expect } from './fixtures';

test('user can login', async ({ loginPage, dashboardPage }) => {
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  await expect(dashboardPage.welcomeMessage).toBeVisible();
});
```

---

## Fixture Scopes

Fixtures can have different scopes that control their lifecycle.

### Test-Scoped Fixtures (Default)

Created fresh for each test. Default scope when not specified.

```typescript
const test = base.extend<MyFixtures>({
  myFixture: async ({ page }, use) => {
    // This runs before EACH test
    const data = await setupData();
    await use(data);
    // This runs after EACH test
    await cleanupData();
  },
});
```

**Characteristics:**
- New instance per test
- Complete isolation
- Automatic cleanup

### Worker-Scoped Fixtures

Created once per worker process and reused across multiple tests.

```typescript
type WorkerFixtures = {
  account: { username: string; password: string };
};

const test = base.extend<{}, WorkerFixtures>({
  account: [async ({ browser }, use) => {
    // This runs ONCE per worker
    const account = await createTestAccount();
    await use(account);
    // This runs ONCE after all tests in worker
    await deleteTestAccount(account);
  }, { scope: 'worker' }],
});
```

**Characteristics:**
- Shared across tests in same worker
- Better performance for expensive setup
- Less isolation (be careful with state)

**When to use worker-scoped:**
- Database connections
- Authenticated accounts
- Expensive resource initialization
- Test data that doesn't change

---

## Fixture Dependencies

Fixtures can depend on other fixtures, creating a dependency graph.

```typescript
type CustomFixtures = {
  authenticatedPage: Page;
  userToken: string;
};

const test = base.extend<CustomFixtures>({
  // userToken depends on page and request
  userToken: async ({ page, request }, use) => {
    // Login and get token
    await page.goto('/login');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    await use(token as string);
  },

  // authenticatedPage depends on page and userToken
  authenticatedPage: async ({ page, userToken }, use) => {
    // Set authentication token
    await page.goto('/');
    await page.evaluate((token) => {
      localStorage.setItem('authToken', token);
    }, userToken);

    await page.goto('/dashboard');
    await use(page);
  },
});

test('access protected resource', async ({ authenticatedPage }) => {
  // Test runs with already authenticated page
  await expect(authenticatedPage.locator('.user-profile')).toBeVisible();
});
```

**Execution order:**
1. `page` fixture initializes
2. `request` fixture initializes
3. `userToken` fixture runs (depends on `page` and `request`)
4. `authenticatedPage` fixture runs (depends on `page` and `userToken`)
5. Test executes
6. Fixtures tear down in reverse order

---

## Automatic Fixtures

Automatic fixtures run for every test without being explicitly requested.

```typescript
type AutoFixtures = {
  testAnalytics: void;
};

const test = base.extend<AutoFixtures>({
  testAnalytics: [async ({ }, use, testInfo) => {
    // Runs before every test automatically
    console.log(`Starting test: ${testInfo.title}`);
    const startTime = Date.now();

    await use();

    // Runs after every test automatically
    const duration = Date.now() - startTime;
    console.log(`Test ${testInfo.title} took ${duration}ms`);
  }, { auto: true }],
});

test('my test', async ({ page }) => {
  // testAnalytics runs automatically even though not requested
  await page.goto('https://example.com');
});
```

**Use cases:**
- Logging and monitoring
- Performance tracking
- Test cleanup
- Screenshot capture
- Custom reporters

---

## Fixture Options

Fixture options let you parameterize fixtures with configuration values.

```typescript
// fixtures.ts
export const test = base.extend<{}, { baseURL: string }>({
  baseURL: ['https://example.com', { option: true }],

  page: async ({ baseURL, page }, use) => {
    await page.goto(baseURL);
    await use(page);
  },
});
```

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'staging',
      use: { baseURL: 'https://staging.example.com' },
    },
    {
      name: 'production',
      use: { baseURL: 'https://example.com' },
    },
  ],
});
```

---

## Overriding Built-in Fixtures

You can override built-in fixtures to customize behavior.

```typescript
const test = base.extend({
  // Override page fixture to add custom initialization
  page: async ({ page }, use) => {
    // Add custom page setup
    await page.addInitScript(() => {
      window.localStorage.setItem('debug', 'true');
    });

    // Set viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    await use(page);
  },
});

test('test with customized page', async ({ page }) => {
  // Page already has debug mode and custom viewport
  await page.goto('https://example.com');
});
```

---

## Advanced Fixture Patterns

### Database Fixture

```typescript
type DBFixture = {
  db: Database;
};

const test = base.extend<{}, DBFixture>({
  db: [async ({ }, use) => {
    // Setup database connection (worker-scoped)
    const db = await connectToDatabase();
    await db.migrate();

    await use(db);

    // Cleanup
    await db.close();
  }, { scope: 'worker' }],
});
```

### Authentication Fixture

```typescript
type AuthFixture = {
  authenticatedContext: BrowserContext;
};

const test = base.extend<{}, AuthFixture>({
  authenticatedContext: [async ({ browser }, use) => {
    // Perform login once per worker
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('/login');
    await page.fill('#username', process.env.TEST_USER!);
    await page.fill('#password', process.env.TEST_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Save auth state
    await context.storageState({ path: 'auth.json' });
    await context.close();

    // Create new context with saved state
    const authContext = await browser.newContext({
      storageState: 'auth.json',
    });

    await use(authContext);

    await authContext.close();
  }, { scope: 'worker' }],
});
```

### Test Data Fixture

```typescript
type TestDataFixture = {
  testUser: { email: string; password: string };
};

const test = base.extend<TestDataFixture>({
  testUser: async ({ request }, use) => {
    // Create test user via API
    const response = await request.post('/api/users', {
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
      },
    });

    const user = await response.json();
    await use(user);

    // Cleanup: Delete test user
    await request.delete(`/api/users/${user.id}`);
  },
});
```

---

## Fixture Best Practices

### 1. Keep Fixtures Focused

Each fixture should have a single responsibility.

```typescript
// Good: Separate fixtures
const test = base.extend<{
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

// Avoid: Combined fixture
const test = base.extend<{ allPages: { login: LoginPage; dashboard: DashboardPage } }>({
  allPages: async ({ page }, use) => {
    await use({
      login: new LoginPage(page),
      dashboard: new DashboardPage(page),
    });
  },
});
```

### 2. Use TypeScript for Type Safety

```typescript
// Define types clearly
type UserFixture = {
  adminUser: { email: string; role: 'admin' };
  regularUser: { email: string; role: 'user' };
};

const test = base.extend<UserFixture>({
  adminUser: async ({ }, use) => {
    await use({ email: 'admin@test.com', role: 'admin' });
  },
  regularUser: async ({ }, use) => {
    await use({ email: 'user@test.com', role: 'user' });
  },
});
```

### 3. Choose the Right Scope

```typescript
// Test-scoped: Data that should be fresh
testUser: async ({ request }, use) => {
  const user = await createUser();
  await use(user);
  await deleteUser(user);
},

// Worker-scoped: Expensive shared resources
database: [async ({ }, use) => {
  const db = await connectToDatabase();
  await use(db);
  await db.close();
}, { scope: 'worker' }],
```

### 4. Handle Cleanup Properly

```typescript
myFixture: async ({ }, use) => {
  const resource = await setupResource();

  try {
    await use(resource);
  } finally {
    // Always cleanup, even if test fails
    await cleanupResource(resource);
  }
},
```

### 5. Use TestInfo for Context

```typescript
screenshot: async ({ page }, use, testInfo) => {
  await use(page);

  // Take screenshot after test
  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshot = await page.screenshot();
    await testInfo.attach('screenshot', {
      body: screenshot,
      contentType: 'image/png',
    });
  }
},
```

---

## Common Fixture Patterns

### Pattern 1: Page Object Fixtures

Create fixtures for each page object in your application.

```typescript
export const test = base.extend<{
  homePage: HomePage;
  loginPage: LoginPage;
  productsPage: ProductsPage;
}>({
  homePage: async ({ page }, use) => await use(new HomePage(page)),
  loginPage: async ({ page }, use) => await use(new LoginPage(page)),
  productsPage: async ({ page }, use) => await use(new ProductsPage(page)),
});
```

### Pattern 2: API Fixtures

Set up API clients and helpers.

```typescript
export const test = base.extend<{
  api: APIClient;
}>({
  api: async ({ request }, use) => {
    const api = new APIClient(request);
    await use(api);
  },
});
```

### Pattern 3: Test Data Fixtures

Generate and cleanup test data.

```typescript
export const test = base.extend<{
  products: Product[];
}>({
  products: async ({ request }, use) => {
    const products = await createTestProducts(request);
    await use(products);
    await deleteTestProducts(request, products);
  },
});
```

---

## Practical Example: E-commerce Test Suite

Here's a complete example showing fixtures in action:

```typescript
// fixtures/index.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';

type Pages = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
};

type UserFixtures = {
  authenticatedUser: { email: string; password: string };
};

export const test = base.extend<Pages & UserFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  authenticatedUser: async ({ loginPage }, use) => {
    const user = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    await loginPage.goto();
    await loginPage.login(user.email, user.password);

    await use(user);
  },
});

export { expect } from '@playwright/test';
```

```typescript
// tests/shopping.spec.ts
import { test, expect } from '../fixtures';

test('add product to cart', async ({ authenticatedUser, productsPage, cartPage }) => {
  // User is already logged in via authenticatedUser fixture
  await productsPage.goto();
  await productsPage.addToCart('Laptop');

  await cartPage.goto();
  await expect(cartPage.items).toHaveCount(1);
  await expect(cartPage.getItemByName('Laptop')).toBeVisible();
});
```

---

## Key Takeaways

1. **Fixtures provide reusable test setup** with automatic cleanup
2. **Built-in fixtures** (`page`, `context`, `browser`, `request`) cover common needs
3. **Custom fixtures** encapsulate application-specific setup
4. **Test-scoped fixtures** provide isolation (default)
5. **Worker-scoped fixtures** improve performance for shared resources
6. **Fixture dependencies** create composable test environments
7. **Automatic fixtures** run without explicit test requests
8. **Override fixtures** to customize built-in behavior
9. **Type safety** through TypeScript enhances maintainability
10. **Proper cleanup** ensures test independence

---

## Next Steps

Now that you understand fixtures, you can:
1. Create page object fixtures for your application
2. Set up authentication fixtures to avoid repetitive login
3. Build API fixtures for data setup and cleanup
4. Use worker-scoped fixtures for shared expensive resources
5. Combine fixtures to create comprehensive test environments

## For More Information

Visit the official Playwright documentation:
- **Test fixtures**: https://playwright.dev/docs/test-fixtures
- **Advanced fixtures**: https://playwright.dev/docs/test-advanced
- **API reference**: https://playwright.dev/docs/api/class-test

---

## Practice Exercise

Try creating these fixtures for your application:
1. A page object fixture for your main application page
2. An authentication fixture that logs in once per worker
3. A test data fixture that creates and cleans up data
4. An automatic fixture that logs test execution time

Happy Testing with Fixtures!
