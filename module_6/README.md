# Module 6: Test Organization and Execution

**Duration:** 3-4 hours (Full coverage) | 40 minutes (Intensive workshop)
**Level:** Intermediate
**Prerequisites:** Completed Modules 2-5

> **Note:** In the intensive one-day workshop (9 AM - 3 PM), this module is covered in 40 minutes focusing on parallel execution concepts and test projects.

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:
- ✅ Understand how Playwright runs tests in parallel
- ✅ Configure workers and parallelization strategies
- ✅ Create and manage test projects for different browsers
- ✅ Parameterize tests with data-driven approaches
- ✅ Organize and scale test suites effectively
- ✅ Use worker isolation for independent test execution

---

## 📚 Topics Covered

### 1. Parallel Test Execution (90 minutes)
**File:** [1_parallel_execution.md](1_parallel_execution.md)

Learn about:
- How parallel execution works in Playwright
- Worker processes and isolation
- Configuring parallel execution:
  - `workers` configuration
  - `fullyParallel` mode
  - Serial mode for dependent tests
- Worker indexing and test isolation
- Test sharding for CI/CD
- Best practices for parallel testing

**Hands-on Lab:**
- Explore: [playwright-parallel-tests/](playwright-parallel-tests/)
- Run tests with different worker counts
- Understand serial vs parallel modes
- Implement worker-scoped fixtures

---

### 2. Test Projects (90 minutes)
**File:** [2_test_projects.md](2_test_projects.md)

Learn about:
- What are test projects?
- Configuring multiple browser projects
- Device emulation projects (mobile, tablet)
- Project dependencies (setup/teardown)
- Running specific projects
- Environment-specific projects
- Filtering tests by project

**Hands-on Lab:**
- Explore: [playwright-test-projects/](playwright-test-projects/)
- Configure Chromium, Firefox, WebKit projects
- Add mobile device projects
- Set up project dependencies
- Run tests across all browsers

---

### 3. Test Parameterization (90 minutes)
**File:** [3_parameterization.md](3_parameterization.md)

Learn about:
- What is test parameterization?
- Test-level parameterization with `forEach`
- Project-level parameterization with custom options
- Using environment variables
- CSV-based test generation
- Data-driven testing patterns

**Hands-on Lab:**
- Explore: [playwright-parameterization/](playwright-parameterization/)
- Parameterize tests with multiple data sets
- Create data-driven login tests
- Use CSV files for test data
- Implement matrix testing

---

## 🧪 Lab Exercises

### Lab 1: Master Parallel Execution (60 minutes)

**Task 1: Experiment with Workers**
1. Open `playwright-parallel-tests/`
2. Run with 1 worker: `npx playwright test --workers=1`
3. Run with 4 workers: `npx playwright test --workers=4`
4. Compare execution times
5. Observe the test output

**Task 2: Implement Serial Mode**
Create a test file with dependent tests:
```typescript
test.describe.configure({ mode: 'serial' });

test('step 1: create user', async ({ page }) => {
  // Create user
});

test('step 2: login user', async ({ page }) => {
  // Login with created user
});

test('step 3: delete user', async ({ page }) => {
  // Cleanup
});
```

**Task 3: Worker Isolation**
Create a worker-scoped fixture for isolated data:
```typescript
export const test = base.extend<{}, { workerId: number }>({
  workerId: [async ({}, use) => {
    const id = test.info().workerIndex;
    await use(id);
  }, { scope: 'worker' }],
});

test('uses worker-specific data', async ({ workerId }) => {
  console.log(`Running in worker ${workerId}`);
});
```

---

### Lab 2: Configure Test Projects (60 minutes)

**Task 1: Multi-Browser Configuration**
Create a config with all major browsers:
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

**Task 2: Add Mobile Projects**
```typescript
{
  name: 'Mobile Chrome',
  use: { ...devices['Pixel 5'] },
},
{
  name: 'Mobile Safari',
  use: { ...devices['iPhone 12'] },
}
```

**Task 3: Setup Dependencies**
```typescript
{
  name: 'setup',
  testMatch: /.*\.setup\.ts/,
},
{
  name: 'chromium',
  use: { ...devices['Desktop Chrome'] },
  dependencies: ['setup'],
}
```

**Task 4: Run Specific Projects**
```bash
# Run only Chromium
npx playwright test --project=chromium

# Run Chrome and Firefox
npx playwright test --project=chromium --project=firefox

# Run all mobile projects
npx playwright test --project="Mobile*"
```

---

### Lab 3: Data-Driven Testing (60 minutes)

**Task 1: Basic Parameterization**
Create parameterized login tests:
```typescript
const users = [
  { username: 'admin', password: 'admin123', role: 'Admin' },
  { username: 'user', password: 'user123', role: 'User' },
  { username: 'guest', password: 'guest123', role: 'Guest' },
];

users.forEach(({ username, password, role }) => {
  test(`login as ${username}`, async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', username);
    await page.fill('#password', password);
    await page.click('#submit');

    await expect(page.locator('.role')).toHaveText(role);
  });
});
```

**Task 2: CSV-Based Tests**
1. Create `test-data/products.csv`:
```csv
productId,name,price,inStock
1,Laptop,999.99,true
2,Mouse,29.99,true
3,Keyboard,79.99,false
```

2. Generate tests from CSV:
```typescript
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';

const products = parse(fs.readFileSync('test-data/products.csv', 'utf-8'), {
  columns: true,
  skip_empty_lines: true,
});

products.forEach((product) => {
  test(`verify product ${product.name}`, async ({ page }) => {
    await page.goto(`/product/${product.productId}`);
    await expect(page.locator('.price')).toHaveText(`$${product.price}`);
  });
});
```

**Task 3: Project-Level Parameterization**
Create custom options:
```typescript
// fixtures/custom-test.ts
type TestOptions = {
  environment: 'staging' | 'production';
};

export const test = base.extend<TestOptions>({
  environment: ['staging', { option: true }],
});
```

```typescript
// playwright.config.ts
projects: [
  {
    name: 'staging',
    use: { environment: 'staging' },
  },
  {
    name: 'production',
    use: { environment: 'production' },
  },
]
```

---

### Lab 4: Build a Scalable Test Suite (90 minutes)

**Task:** Organize a complete test suite
1. Create projects for:
   - Smoke tests on all browsers
   - Full regression on Chromium only
   - Mobile tests on Chrome and Safari
2. Add parameterization for:
   - Multiple user roles
   - Different locales
3. Configure appropriate parallelization
4. Add worker-scoped fixtures for isolation
5. Run the full suite and analyze results

**Expected structure:**
```
tests/
├── smoke/
│   ├── login.smoke.spec.ts
│   └── home.smoke.spec.ts
├── regression/
│   ├── checkout.spec.ts
│   └── profile.spec.ts
├── mobile/
│   └── navigation.mobile.spec.ts
└── fixtures/
    ├── auth.ts
    └── database.ts
```

---

## ✅ Success Criteria

After completing this module, you should be able to:
- [x] Explain how parallel execution works
- [x] Configure workers and parallelization
- [x] Use serial mode for dependent tests
- [x] Create browser-specific projects
- [x] Add mobile device projects
- [x] Set up project dependencies
- [x] Run specific projects from CLI
- [x] Parameterize tests with data
- [x] Use CSV files for test data
- [x] Organize large test suites
- [x] Implement worker isolation

---

## 🎓 Quick Reference

### Parallel Execution
```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : undefined,
  fullyParallel: true,
});

// Serial mode for specific suite
test.describe.configure({ mode: 'serial' });
```

### Test Projects
```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  { name: 'mobile', use: { ...devices['iPhone 12'] } },
]
```

### Parameterization
```typescript
// Test-level
const testData = [{ value: 1 }, { value: 2 }];
testData.forEach(({ value }) => {
  test(`test with ${value}`, async ({ page }) => { });
});

// Project-level
type Options = { env: string };
export const test = base.extend<Options>({
  env: ['staging', { option: true }],
});
```

### CLI Commands
```bash
# Run with specific workers
npx playwright test --workers=4

# Run specific project
npx playwright test --project=chromium

# Run with sharding
npx playwright test --shard=1/3
```

---

## 💡 Tips for Success

1. **Start with default parallelization** - Optimize later if needed
2. **Use serial mode sparingly** - Only for truly dependent tests
3. **Test on primary browser first** - Then expand to others
4. **Mobile testing is important** - Don't skip it
5. **Parameterize wisely** - Balance coverage vs maintenance
6. **Isolate test data per worker** - Avoid race conditions
7. **Use projects for organization** - Not just browsers

---

## 📖 Additional Resources

- [Parallelization Guide](https://playwright.dev/docs/test-parallel)
- [Test Projects Documentation](https://playwright.dev/docs/test-projects)
- [Parameterize Tests](https://playwright.dev/docs/test-parameterize)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [Sharding Tests](https://playwright.dev/docs/test-sharding)

---

## ❓ Common Issues and Solutions

### Issue: Tests fail in parallel but pass with --workers=1
**Solution:** Tests have shared state. Use worker-scoped fixtures or unique test data per worker.

### Issue: Project dependencies not running
**Solution:** Verify dependency names match exactly and tests are tagged correctly.

### Issue: Parameterized tests all fail together
**Solution:** Check if test data is causing failures. Test with single data set first.

### Issue: Mobile tests don't behave correctly
**Solution:** Verify device emulation is configured properly with `isMobile: true` and `hasTouch: true`.

---

## 🎯 Next Module Preview

In **Module 7: API Testing**, you'll learn:
- API testing fundamentals
- HTTP requests (GET, POST, PUT, PATCH, DELETE)
- Response validation and assertions
- Network mocking and interception
- Combining UI and API testing

---

**Ready to start? Open [1_parallel_execution.md](1_parallel_execution.md) to begin!**

---

> **Note:** All contents of this workshop are proprietary and belong to **Taqelah**. Do not share or distribute without permission.
