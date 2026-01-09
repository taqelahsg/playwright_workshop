# Module 4: Debugging and Test Management

**Duration:** 2-3 hours (Full coverage) | 30 minutes (Intensive workshop)
**Level:** Beginner to Intermediate
**Prerequisites:** Completed Modules 2-3

> **Note:** In the intensive one-day workshop (9 AM - 2 PM), this module is covered in 30 minutes focusing on Trace Viewer and fixtures basics.

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:
- ✅ Use Trace Viewer to debug test failures
- ✅ Understand Playwright fixtures
- ✅ Create custom fixtures for reusable test setup
- ✅ Implement Page Object Model pattern
- ✅ Organize test code effectively

---

## 📚 Topics Covered

### 1. Trace Viewer (60 minutes)
**File:** [1_trace_viewer.md](1_trace_viewer.md)

Learn about:
- What is Trace Viewer and why use it
- Enabling traces in tests
- Recording traces (on, off, on-first-retry, retain-on-failure)
- Viewing traces with `npx playwright show-trace`
- Understanding the Trace Viewer interface:
  - Timeline and screenshots
  - Actions and events
  - Network activity
  - Console logs
  - DOM snapshots
- Debugging test failures efficiently

**Hands-on:**
- Enable traces in configuration
- Run a failing test
- Open and analyze the trace
- Find the root cause of failure

---

### 2. Playwright Fixtures (90 minutes)
**File:** [2_fixtures.md](2_fixtures.md)

Learn about:
- What are fixtures?
- Built-in fixtures (`page`, `context`, `browser`)
- Test fixtures vs worker fixtures
- Creating custom fixtures
- Fixture scope (test vs worker)
- Page Object Model with fixtures
- Sharing setup between tests

**Hands-on Lab:**
- Explore: [playwright-fixtures/](playwright-fixtures/)
- Create custom page fixtures
- Implement Page Object Model
- Build reusable authentication fixtures

---

## 🧪 Lab Exercises

### Lab 1: Debug with Trace Viewer (45 minutes)

**Task 1: Enable and View Traces**
1. Configure traces in your config:
```typescript
use: {
  trace: 'on-first-retry',
}
```
2. Create a failing test intentionally
3. Run the test: `npx playwright test`
4. Open trace: `npx playwright show-trace trace.zip`
5. Analyze the failure in Trace Viewer

**Task 2: Explore Trace Features**
- Navigate through the timeline
- View screenshots before/after each action
- Inspect network requests
- Check console logs
- Examine DOM snapshots

**Expected outcome:** Understand how to use traces for debugging

---

### Lab 2: Create Custom Fixtures (60 minutes)

**Task:** Create a login fixture
1. Create `fixtures/auth.ts`:
```typescript
import { test as base } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login logic here
    await page.goto('/login');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password');
    await page.click('#submit');
    await page.waitForURL('/dashboard');

    await use(page);

    // Cleanup (logout) here if needed
  },
});
```

2. Use in tests:
```typescript
import { test } from './fixtures/auth';

test('dashboard shows user info', async ({ authenticatedPage }) => {
  await expect(authenticatedPage.getByText('Welcome')).toBeVisible();
});
```

---

### Lab 3: Implement Page Object Model (60 minutes)

**Task:** Create Page Objects for a login flow

1. Create `pages/LoginPage.ts`:
```typescript
import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await this.page.click('button[type="submit"]');
  }

  async getErrorMessage() {
    return this.page.locator('.error-message');
  }
}
```

2. Create `pages/DashboardPage.ts`:
```typescript
export class DashboardPage {
  constructor(private page: Page) {}

  async isLoaded() {
    await this.page.waitForURL('/dashboard');
  }

  async getUserName() {
    return this.page.locator('.user-name').textContent();
  }
}
```

3. Use in tests:
```typescript
test('login flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.login('testuser', 'password');
  await dashboardPage.isLoaded();

  await expect(await dashboardPage.getUserName()).toBe('testuser');
});
```

---

### Lab 4: Explore Fixture Examples (45 minutes)

**Task:** Work with the fixtures project
1. Navigate to `playwright-fixtures/`
2. Study the examples:
   - `examples/01-built-in-fixtures.spec.ts`
   - `examples/02-custom-test-fixture.spec.ts`
   - `examples/03-page-object-fixture.spec.ts`
   - `examples/04-worker-fixture.spec.ts`
3. Run the tests: `npx playwright test`
4. Modify fixtures to understand behavior
5. Create your own custom fixture

---

## ✅ Success Criteria

After completing this module, you should be able to:
- [x] Enable and configure trace recording
- [x] Open and navigate Trace Viewer
- [x] Use traces to debug test failures
- [x] Understand Playwright's fixture system
- [x] Create custom test fixtures
- [x] Implement Page Object Model
- [x] Use fixtures for authentication
- [x] Share setup logic between tests

---

## 🎓 Quick Reference

### Enabling Traces
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry', // 'on' | 'off' | 'retain-on-failure'
  },
});
```

### Viewing Traces
```bash
# View specific trace file
npx playwright show-trace trace.zip

# Traces are in: test-results/[test-name]/trace.zip
```

### Custom Fixture Template
```typescript
import { test as base } from '@playwright/test';

type MyFixtures = {
  myFixture: string;
};

export const test = base.extend<MyFixtures>({
  myFixture: async ({ page }, use) => {
    // Setup
    const value = 'setup value';

    await use(value);

    // Teardown
  },
});
```

### Page Object Pattern
```typescript
// pages/BasePage.ts
export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }
}

// pages/LoginPage.ts
export class LoginPage extends BasePage {
  async login(user: string, pass: string) {
    await this.page.fill('#username', user);
    await this.page.fill('#password', pass);
    await this.page.click('#submit');
  }
}
```

---

## 💡 Tips for Success

1. **Use traces liberally in CI** - Set to `retain-on-failure` for production
2. **Trace Viewer is your best friend** - Learn to use it effectively
3. **Start simple with fixtures** - Don't over-engineer early
4. **Page Objects for common flows** - Login, checkout, navigation
5. **Worker fixtures for expensive setup** - Database connections, authentication
6. **Keep Page Objects focused** - One page or component per class

---

## 📖 Additional Resources

- [Trace Viewer Documentation](https://playwright.dev/docs/trace-viewer)
- [Test Fixtures Guide](https://playwright.dev/docs/test-fixtures)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [Advanced Fixtures](https://playwright.dev/docs/test-advanced)

---

## ❓ Common Issues and Solutions

### Issue: Trace files not generated
**Solution:** Check trace is enabled in config. Failed tests generate traces with `on-first-retry`

### Issue: Trace Viewer won't open
**Solution:** Make sure trace file path is correct:
```bash
npx playwright show-trace test-results/example-test/trace.zip
```

### Issue: Fixtures not running
**Solution:** Make sure you're importing the custom `test` function:
```typescript
import { test } from './fixtures/my-fixtures'; // ✅
import { test } from '@playwright/test'; // ❌ (uses base test)
```

### Issue: Fixture runs multiple times
**Solution:** Check fixture scope. Use `{ scope: 'worker' }` for one-time setup:
```typescript
dbFixture: [async ({}, use) => { ... }, { scope: 'worker' }]
```

---

## 🎯 Next Module Preview

In **Module 5: Test Organization and Execution**, you'll learn:
- Running tests in parallel
- Creating test projects for different browsers
- Parameterizing tests with data
- Organizing large test suites
- Worker isolation and management

---

**Ready to start? Open [1_trace_viewer.md](1_trace_viewer.md) to begin!**
