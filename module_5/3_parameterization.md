# Test Parameterization in Playwright

## Overview

Test parameterization is a powerful technique that allows you to run the same test logic with multiple sets of data. Instead of writing repetitive test code for similar scenarios, parameterization enables you to write a single test template and execute it with different inputs, making your test suite more maintainable and comprehensive.

## Table of Contents

1. [What is Test Parameterization?](#what-is-test-parameterization)
2. [Why Use Parameterization?](#why-use-parameterization)
3. [Test-Level Parameterization](#test-level-parameterization)
4. [Project-Level Parameterization](#project-level-parameterization)
5. [Using Environment Variables](#using-environment-variables)
6. [CSV-Based Test Generation](#csv-based-test-generation)
7. [Advanced Patterns](#advanced-patterns)
8. [Best Practices](#best-practices)

---

## What is Test Parameterization?

Test parameterization is the practice of defining test logic once and executing it with multiple data sets. Each data set represents a different test case, allowing you to achieve better test coverage with less code duplication.

### Example Scenario

Instead of writing:
```typescript
test('login with user1', async ({ page }) => {
  await page.fill('#username', 'user1');
  await page.fill('#password', 'pass1');
  // ... rest of test
});

test('login with user2', async ({ page }) => {
  await page.fill('#username', 'user2');
  await page.fill('#password', 'pass2');
  // ... rest of test
});
```

You can parameterize:
```typescript
[
  { username: 'user1', password: 'pass1' },
  { username: 'user2', password: 'pass2' },
].forEach(({ username, password }) => {
  test(`login with ${username}`, async ({ page }) => {
    await page.fill('#username', username);
    await page.fill('#password', password);
    // ... rest of test
  });
});
```

---

## Why Use Parameterization?

### Benefits

- **Reduced Code Duplication**: Write test logic once, run it multiple times
- **Better Maintainability**: Changes to test logic only need to be made in one place
- **Improved Coverage**: Easy to add more test cases by simply adding data
- **Clearer Intent**: Separates test data from test logic
- **Data-Driven Testing**: Test with various inputs, edge cases, and scenarios

### Use Cases

- Testing multiple user roles or permissions
- Validating different input combinations
- Cross-browser or cross-device testing
- Testing with various data formats
- Boundary value testing
- Testing localization with different languages

---

## Test-Level Parameterization

Test-level parameterization uses loops to create multiple test instances from a single test definition.

### Basic forEach Pattern

```typescript
import { test, expect } from '@playwright/test';

const testData = [
  { name: 'Alice', greeting: 'Hello, Alice!' },
  { name: 'Bob', greeting: 'Hello, Bob!' },
  { name: 'Charlie', greeting: 'Hello, Charlie!' },
];

testData.forEach(({ name, greeting }) => {
  test(`greet user ${name}`, async ({ page }) => {
    await page.goto(`https://example.com/greet?name=${name}`);
    await expect(page.getByRole('heading')).toHaveText(greeting);
  });
});
```

### Multiple Parameters

```typescript
const loginData = [
  {
    username: 'admin',
    password: 'admin123',
    expectedRole: 'Administrator',
    shouldSucceed: true,
  },
  {
    username: 'user',
    password: 'user123',
    expectedRole: 'User',
    shouldSucceed: true,
  },
  {
    username: 'invalid',
    password: 'wrong',
    expectedRole: '',
    shouldSucceed: false,
  },
];

loginData.forEach(({ username, password, expectedRole, shouldSucceed }) => {
  test(`login as ${username}`, async ({ page }) => {
    await page.goto('https://example.com/login');
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    if (shouldSucceed) {
      await expect(page.locator('.user-role')).toHaveText(expectedRole);
    } else {
      await expect(page.locator('.error')).toBeVisible();
    }
  });
});
```

### With Test Descriptions

```typescript
const searchTests = [
  {
    description: 'should find exact match',
    query: 'Playwright',
    expectedResults: 10,
  },
  {
    description: 'should handle special characters',
    query: 'test@#$',
    expectedResults: 0,
  },
  {
    description: 'should handle empty query',
    query: '',
    expectedResults: 0,
  },
];

searchTests.forEach(({ description, query, expectedResults }) => {
  test(description, async ({ page }) => {
    await page.goto('https://example.com/search');
    await page.fill('input[name="q"]', query);
    await page.click('button[type="submit"]');

    const results = await page.locator('.search-result').count();
    expect(results).toBe(expectedResults);
  });
});
```

### Hook Placement Best Practices

#### Hooks Outside forEach

Place hooks outside the loop to execute them once per test file:

```typescript
import { test, expect } from '@playwright/test';

// Runs once before all parameterized tests
test.beforeAll(async () => {
  console.log('Setting up test environment');
  // Initialize database, start server, etc.
});

// Runs once after all parameterized tests
test.afterAll(async () => {
  console.log('Cleaning up test environment');
  // Clean up database, stop server, etc.
});

const testData = [
  { name: 'Test 1' },
  { name: 'Test 2' },
  { name: 'Test 3' },
];

testData.forEach(({ name }) => {
  test(name, async ({ page }) => {
    // Test logic
  });
});
```

#### Hooks Inside describe()

Nest hooks within `test.describe()` blocks to run them for each iteration:

```typescript
const browsers = ['chromium', 'firefox', 'webkit'];

browsers.forEach((browserName) => {
  test.describe(`Tests on ${browserName}`, () => {
    // Runs before each test in THIS describe block
    test.beforeEach(async () => {
      console.log(`Setting up for ${browserName}`);
    });

    // Runs after each test in THIS describe block
    test.afterEach(async () => {
      console.log(`Cleaning up after ${browserName}`);
    });

    test('test 1', async ({ page }) => {
      // Test logic
    });

    test('test 2', async ({ page }) => {
      // Test logic
    });
  });
});
```

### Parameterized Tests with Tags

```typescript
const testCases = [
  { id: 1, tag: '@smoke', description: 'critical path test' },
  { id: 2, tag: '@regression', description: 'edge case test' },
  { id: 3, tag: '@smoke', description: 'basic functionality' },
];

testCases.forEach(({ id, tag, description }) => {
  test(`${tag} - Test ${id}: ${description}`, async ({ page }) => {
    // Test logic
  });
});
```

---

## Project-Level Parameterization

Project-level parameterization allows you to run the same test suite with different configurations by creating custom options and overriding them across multiple projects.

### Creating Custom Test Options

First, define custom options by extending the base test:

```typescript
// fixtures/custom-test.ts
import { test as base } from '@playwright/test';

type TestOptions = {
  person: string;
  environment: string;
};

export const test = base.extend<TestOptions>({
  person: ['John', { option: true }],
  environment: ['staging', { option: true }],
});
```

### Configuring Projects with Custom Options

Define projects in `playwright.config.ts` with different option values:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'alice-staging',
      use: {
        person: 'Alice',
        environment: 'staging',
      },
    },
    {
      name: 'bob-staging',
      use: {
        person: 'Bob',
        environment: 'staging',
      },
    },
    {
      name: 'alice-production',
      use: {
        person: 'Alice',
        environment: 'production',
      },
    },
  ],
});
```

### Using Parameterized Options in Tests

Access the parameterized options as fixtures:

```typescript
// tests/user-flow.spec.ts
import { test } from '../fixtures/custom-test';
import { expect } from '@playwright/test';

test('user workflow', async ({ page, person, environment }) => {
  await page.goto(`https://${environment}.example.com`);
  await page.fill('#username', person);
  await page.click('#submit');

  await expect(page.locator('.welcome')).toHaveText(`Welcome, ${person}!`);
});
```

### Advanced Custom Options

```typescript
// fixtures/advanced-test.ts
import { test as base } from '@playwright/test';

type AdvancedOptions = {
  userRole: 'admin' | 'user' | 'guest';
  locale: string;
  apiVersion: string;
};

export const test = base.extend<AdvancedOptions>({
  userRole: ['user', { option: true }],
  locale: ['en-US', { option: true }],
  apiVersion: ['v1', { option: true }],
});
```

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'admin-en-v2',
      use: {
        userRole: 'admin',
        locale: 'en-US',
        apiVersion: 'v2',
      },
    },
    {
      name: 'user-es-v2',
      use: {
        userRole: 'user',
        locale: 'es-ES',
        apiVersion: 'v2',
      },
    },
    {
      name: 'guest-fr-v1',
      use: {
        userRole: 'guest',
        locale: 'fr-FR',
        apiVersion: 'v1',
      },
    },
  ],
});
```

### Project-Level Parameterization with Fixtures

Combine custom options with fixtures for powerful setup:

```typescript
// fixtures/auth-test.ts
import { test as base } from '@playwright/test';

type AuthOptions = {
  userType: 'premium' | 'basic' | 'trial';
};

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthOptions & AuthFixtures>({
  userType: ['basic', { option: true }],

  authenticatedPage: async ({ page, userType }, use) => {
    // Automatically log in based on userType
    await page.goto('https://example.com/login');

    const credentials = {
      premium: { user: 'premium@test.com', pass: 'premium123' },
      basic: { user: 'basic@test.com', pass: 'basic123' },
      trial: { user: 'trial@test.com', pass: 'trial123' },
    };

    const { user, pass } = credentials[userType];
    await page.fill('#email', user);
    await page.fill('#password', pass);
    await page.click('#login');

    await use(page);
  },
});
```

```typescript
// tests/features.spec.ts
import { test } from '../fixtures/auth-test';
import { expect } from '@playwright/test';

test('access features based on user type', async ({ authenticatedPage, userType }) => {
  await authenticatedPage.goto('/features');

  if (userType === 'premium') {
    await expect(authenticatedPage.locator('.premium-feature')).toBeVisible();
  } else {
    await expect(authenticatedPage.locator('.premium-feature')).toBeHidden();
  }
});
```

---

## Using Environment Variables

Environment variables provide a way to pass configuration and sensitive data to your tests externally.

### Basic Usage

```bash
# Run tests with environment variables
USER_NAME=testuser PASSWORD=secret123 npx playwright test

# Or using export
export USER_NAME=testuser
export PASSWORD=secret123
npx playwright test
```

### Accessing Environment Variables in Tests

```typescript
import { test, expect } from '@playwright/test';

test('login with environment variables', async ({ page }) => {
  const username = process.env.USER_NAME;
  const password = process.env.PASSWORD;

  await page.goto('https://example.com/login');
  await page.fill('#username', username!);
  await page.fill('#password', password!);
  await page.click('#submit');

  await expect(page.locator('.dashboard')).toBeVisible();
});
```

### Using .env Files with dotenv

Install dotenv package:
```bash
npm install dotenv --save-dev
```

Create a `.env` file:
```env
# .env
BASE_URL=https://staging.example.com
API_KEY=abc123xyz789
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=secretpassword
DATABASE_URL=postgresql://localhost:5432/testdb
```

Load environment variables in `playwright.config.ts`:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'Authorization': `Bearer ${process.env.API_KEY}`,
    },
  },
});
```

### Environment-Specific .env Files

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file
const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `.env.${environment}`) });

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,
  },
});
```

Create environment-specific files:
```
.env.development
.env.staging
.env.production
```

Run with specific environment:
```bash
NODE_ENV=staging npx playwright test
```

### Type-Safe Environment Variables

```typescript
// config/env.ts
export const env = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiKey: process.env.API_KEY || '',
  testUser: {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'password123',
  },
} as const;

// Validate required environment variables
if (!process.env.API_KEY) {
  throw new Error('API_KEY environment variable is required');
}
```

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';
import { env } from '../config/env';

test('use typed environment variables', async ({ page }) => {
  await page.goto(env.baseUrl);
  await page.fill('#email', env.testUser.email);
  await page.fill('#password', env.testUser.password);
});
```

---

## CSV-Based Test Generation

For large data sets, you can use CSV files to generate parameterized tests dynamically.

### Install CSV Parser

```bash
npm install csv-parse --save-dev
```

### Create CSV Test Data

```csv
# test-data/users.csv
username,password,role,shouldSucceed
admin,admin123,Administrator,true
user1,pass123,User,true
user2,pass456,User,true
guest,guest123,Guest,true
invalid,wrong,N/A,false
```

### Parse CSV and Generate Tests

```typescript
// tests/csv-login.spec.ts
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

// Read and parse CSV file
const csvContent = fs.readFileSync('test-data/users.csv', 'utf-8');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
});

// Generate tests from CSV data
records.forEach((record: any) => {
  test(`login as ${record.username}`, async ({ page }) => {
    await page.goto('https://example.com/login');
    await page.fill('#username', record.username);
    await page.fill('#password', record.password);
    await page.click('button[type="submit"]');

    const shouldSucceed = record.shouldSucceed === 'true';

    if (shouldSucceed) {
      await expect(page.locator('.user-role')).toHaveText(record.role);
    } else {
      await expect(page.locator('.error-message')).toBeVisible();
    }
  });
});
```

### CSV with Complex Data

```csv
# test-data/products.csv
productId,name,price,category,inStock
1,Laptop,999.99,Electronics,true
2,Mouse,29.99,Accessories,true
3,Keyboard,79.99,Accessories,false
4,Monitor,299.99,Electronics,true
```

```typescript
// tests/csv-products.spec.ts
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

interface Product {
  productId: string;
  name: string;
  price: string;
  category: string;
  inStock: string;
}

const products: Product[] = parse(
  fs.readFileSync('test-data/products.csv', 'utf-8'),
  { columns: true, skip_empty_lines: true }
);

products.forEach((product) => {
  test(`verify product ${product.name}`, async ({ page }) => {
    await page.goto(`https://example.com/product/${product.productId}`);

    await expect(page.locator('h1')).toHaveText(product.name);
    await expect(page.locator('.price')).toHaveText(`$${product.price}`);
    await expect(page.locator('.category')).toHaveText(product.category);

    const inStock = product.inStock === 'true';
    if (inStock) {
      await expect(page.locator('.add-to-cart')).toBeEnabled();
    } else {
      await expect(page.locator('.out-of-stock')).toBeVisible();
    }
  });
});
```

### CSV Helper Function

```typescript
// utils/csv-helper.ts
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

export function loadCsvData<T>(filePath: string): T[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    cast: true, // Automatically cast types
  });
}
```

```typescript
// tests/using-helper.spec.ts
import { test, expect } from '@playwright/test';
import { loadCsvData } from '../utils/csv-helper';

interface TestUser {
  username: string;
  password: string;
  role: string;
}

const users = loadCsvData<TestUser>('test-data/users.csv');

users.forEach((user) => {
  test(`login as ${user.username}`, async ({ page }) => {
    // Test logic
  });
});
```

---

## Advanced Patterns

### Combining Test and Project Parameterization

```typescript
// fixtures/multi-param.ts
import { test as base } from '@playwright/test';

type Options = {
  environment: 'staging' | 'production';
};

export const test = base.extend<Options>({
  environment: ['staging', { option: true }],
});
```

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'staging', use: { environment: 'staging' } },
    { name: 'production', use: { environment: 'production' } },
  ],
});
```

```typescript
// tests/combined.spec.ts
import { test } from '../fixtures/multi-param';

const testData = [
  { feature: 'search', query: 'test' },
  { feature: 'filter', query: 'category' },
];

testData.forEach(({ feature, query }) => {
  test(`${feature} on ${query}`, async ({ page, environment }) => {
    await page.goto(`https://${environment}.example.com`);
    // Test logic using both parameters
  });
});
```

### Matrix Testing

```typescript
const browsers = ['chromium', 'firefox', 'webkit'];
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

browsers.forEach((browserName) => {
  viewports.forEach((viewport) => {
    test(`${browserName} - ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      await page.goto('https://example.com');
      // Test responsive behavior
    });
  });
});
```

### Conditional Parameterization

```typescript
const testCases = [
  { name: 'basic test', skip: false },
  { name: 'advanced test', skip: !process.env.RUN_ADVANCED },
  { name: 'slow test', skip: process.env.CI === 'true' },
];

testCases.forEach(({ name, skip }) => {
  test.skip(skip, name, async ({ page }) => {
    // Test logic
  });
});
```

### Parameterized Test Suites

```typescript
const testSuites = [
  {
    suite: 'Authentication',
    tests: [
      { name: 'login', url: '/login' },
      { name: 'logout', url: '/logout' },
      { name: 'register', url: '/register' },
    ],
  },
  {
    suite: 'Dashboard',
    tests: [
      { name: 'view profile', url: '/profile' },
      { name: 'edit settings', url: '/settings' },
    ],
  },
];

testSuites.forEach(({ suite, tests }) => {
  test.describe(suite, () => {
    tests.forEach(({ name, url }) => {
      test(name, async ({ page }) => {
        await page.goto(`https://example.com${url}`);
        // Test logic
      });
    });
  });
});
```

---

## Best Practices

### 1. Keep Test Data Separate

```typescript
// ✅ Good: Separate data from logic
// data/test-users.ts
export const testUsers = [
  { username: 'user1', password: 'pass1' },
  { username: 'user2', password: 'pass2' },
];

// tests/login.spec.ts
import { testUsers } from '../data/test-users';

testUsers.forEach((user) => {
  test(`login as ${user.username}`, async ({ page }) => {
    // Test logic
  });
});
```

### 2. Use Descriptive Test Names

```typescript
// ❌ Bad: Unclear test names
test('test 1', async ({ page }) => { });
test('test 2', async ({ page }) => { });

// ✅ Good: Clear, descriptive names
test('login with valid admin credentials', async ({ page }) => { });
test('login fails with invalid password', async ({ page }) => { });
```

### 3. Document Expected Behavior

```typescript
const testCases = [
  {
    description: 'should accept valid email format',
    email: 'user@example.com',
    expectedValid: true,
  },
  {
    description: 'should reject email without @',
    email: 'userexample.com',
    expectedValid: false,
  },
];

testCases.forEach(({ description, email, expectedValid }) => {
  test(description, async ({ page }) => {
    // Test logic
  });
});
```

### 4. Avoid Over-Parameterization

```typescript
// ❌ Bad: Too many parameters make tests hard to understand
test('complex test', async ({ page, param1, param2, param3, param4, param5 }) => {
  // Complex logic
});

// ✅ Good: Group related parameters
interface TestConfig {
  user: { name: string; email: string };
  settings: { theme: string; language: string };
}
```

### 5. Use TypeScript for Type Safety

```typescript
// ✅ Good: Type-safe test data
interface LoginTestCase {
  username: string;
  password: string;
  expectedRole: string;
  shouldSucceed: boolean;
}

const testCases: LoginTestCase[] = [
  {
    username: 'admin',
    password: 'admin123',
    expectedRole: 'Administrator',
    shouldSucceed: true,
  },
];

testCases.forEach((testCase) => {
  test(`login as ${testCase.username}`, async ({ page }) => {
    // TypeScript ensures all properties are available
  });
});
```

### 6. Handle Edge Cases

```typescript
const edgeCases = [
  { description: 'empty string', input: '' },
  { description: 'very long string', input: 'a'.repeat(1000) },
  { description: 'special characters', input: '!@#$%^&*()' },
  { description: 'unicode characters', input: '你好世界' },
  { description: 'null value', input: null },
];

edgeCases.forEach(({ description, input }) => {
  test(`handle ${description}`, async ({ page }) => {
    // Test edge case handling
  });
});
```

### 7. Balance Coverage and Maintenance

```typescript
// ❌ Bad: Testing every possible combination
const browsers = ['chromium', 'firefox', 'webkit'];
const devices = ['iPhone', 'iPad', 'Pixel', 'Galaxy'];
const locales = ['en', 'es', 'fr', 'de', 'ja'];
// Results in 3 × 4 × 5 = 60 test combinations!

// ✅ Good: Test representative combinations
const criticalCombinations = [
  { browser: 'chromium', device: 'iPhone', locale: 'en' },
  { browser: 'firefox', device: 'iPad', locale: 'es' },
  { browser: 'webkit', device: 'Pixel', locale: 'ja' },
];
```

### 8. Use Tags for Filtering

```typescript
const testCases = [
  { tag: '@smoke', name: 'critical login flow' },
  { tag: '@regression', name: 'password reset' },
  { tag: '@smoke', name: 'homepage load' },
];

testCases.forEach(({ tag, name }) => {
  test(`${tag} ${name}`, async ({ page }) => {
    // Test logic
  });
});

// Run only smoke tests:
// npx playwright test --grep "@smoke"
```

---

## Summary

Test parameterization in Playwright provides powerful ways to write maintainable, comprehensive test suites:

### Key Takeaways

1. **Test-Level Parameterization**: Use `forEach` loops to create multiple test instances from a single test definition
2. **Project-Level Parameterization**: Create custom options and override them across multiple projects
3. **Environment Variables**: Pass configuration and sensitive data externally using `.env` files
4. **CSV-Based Testing**: Generate tests from large data sets stored in CSV files
5. **Advanced Patterns**: Combine approaches for maximum flexibility

### When to Use Each Approach

- **forEach loops**: Simple data-driven tests within a single file
- **Custom options**: Configuration that affects multiple test files
- **Environment variables**: Sensitive data or environment-specific settings
- **CSV files**: Large data sets or data maintained by non-developers

### Best Practices Summary

- Keep test data separate from test logic
- Use descriptive test names and documentation
- Leverage TypeScript for type safety
- Handle edge cases explicitly
- Balance test coverage with maintainability
- Use tags for test filtering

---

## Additional Resources

- [Official Playwright Parameterize Documentation](https://playwright.dev/docs/test-parameterize)
- [Playwright Test Configuration](https://playwright.dev/docs/test-configuration)
- [Playwright Test Fixtures](https://playwright.dev/docs/test-fixtures)
- [Environment Variables in Node.js](https://nodejs.org/api/process.html#process_process_env)
- [dotenv Package](https://www.npmjs.com/package/dotenv)
- [csv-parse Package](https://www.npmjs.com/package/csv-parse)
