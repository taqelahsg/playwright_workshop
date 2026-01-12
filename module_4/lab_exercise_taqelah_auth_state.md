# Exercise: Authentication State with Fixtures

**Level:** Intermediate
**Prerequisites:** Completed fixtures guide (2_fixtures.md)
**Target Site:** https://taqelah.sg/taqelah-demo-site.html

---

## Objective

In this exercise, you will:
1. Create a login test that authenticates to the demo site
2. Save the authentication state (cookies, localStorage, sessionStorage)
3. Create a fixture that reuses the saved authentication state
4. Write subsequent tests that run as an already logged-in user

---

## Why This Matters

In real-world testing, logging in before every test is:
- **Slow**: Authentication can take several seconds
- **Fragile**: More network requests = more potential failures
- **Wasteful**: Testing the same login flow repeatedly

By saving authentication state, you can:
- Run tests faster
- Focus tests on specific functionality
- Reduce flakiness
- Simulate real user sessions

---

## Part 1: Explore the Demo Site

Before writing tests, explore the site manually:

1. Open https://taqelah.sg/taqelah-demo-site.html in your browser
2. Find the login form
3. Note the form fields (username/email, password)
4. Identify what changes after successful login
5. Check the browser DevTools > Application tab to see what gets stored

---

## Part 2: Create the Project Structure

Create the following folder structure:

```
module_4/
└── auth-exercise/
    ├── playwright.config.ts
    ├── package.json
    ├── fixtures/
    │   └── auth.ts
    ├── tests/
    │   └── authenticated.spec.ts
    └── .auth/
        └── (storage state will be saved here)
```

### Step 1: Initialize the project

```bash
cd module_4
mkdir -p auth-exercise/.auth
cd auth-exercise
npm init -y
npm install -D @playwright/test
npx playwright install
```

### Step 2: Create playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'https://taqelah.sg',
    trace: 'on-first-retry',
  },

  projects: [
    // Setup project - runs first to authenticate
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Main tests - depend on setup and use stored auth state
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use the saved authentication state
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

---

## Part 3: Create the Authentication Setup

### Step 1: Create the auth setup file

Create `tests/auth.setup.ts`:

```typescript
import { test as setup, expect } from '@playwright/test';

const authFile = '.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Step 1: Navigate to the demo site
  await page.goto('/taqelah-demo-site.html');

  // Step 2: Fill in login credentials
  // TODO: Update these selectors based on the actual form
  await page.fill('#username', 'your-username');
  await page.fill('#password', 'your-password');

  // Step 3: Click the login button
  await page.click('button[type="submit"]');

  // Step 4: Wait for successful login
  // TODO: Update this to match the actual post-login state
  await page.waitForSelector('.dashboard'); // or whatever indicates success

  // Step 5: Save the storage state
  await page.context().storageState({ path: authFile });
});
```

---

## Part 4: Create the Auth Fixture

Create `fixtures/auth.ts`:

```typescript
import { test as base, Page } from '@playwright/test';

// Define the fixture types
type AuthFixtures = {
  authenticatedPage: Page;
};

// Extend the base test with our fixture
export const test = base.extend<AuthFixtures>({
  // This fixture provides a page that is already logged in
  authenticatedPage: async ({ page }, use) => {
    // The page already has auth state from storageState in config
    // Navigate to a protected page to verify authentication
    await page.goto('/taqelah-demo-site.html');

    // Optionally verify we're logged in
    // await expect(page.locator('.user-profile')).toBeVisible();

    // Provide the authenticated page to the test
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

---

## Part 5: Write Authenticated Tests

Create `tests/authenticated.spec.ts`:

```typescript
import { test, expect } from '../fixtures/auth';

test.describe('Authenticated User Tests', () => {

  test('should show user is logged in', async ({ authenticatedPage }) => {
    // The page is already authenticated via the fixture
    // TODO: Add assertions based on the actual logged-in state

    // Example assertions:
    // await expect(authenticatedPage.locator('.welcome-message')).toBeVisible();
    // await expect(authenticatedPage.locator('.logout-button')).toBeVisible();
    // await expect(authenticatedPage.locator('.user-name')).toHaveText('Test User');
  });

  test('should access protected content', async ({ authenticatedPage }) => {
    // Navigate to a protected area
    // TODO: Update based on actual site structure

    // await authenticatedPage.click('.protected-link');
    // await expect(authenticatedPage.locator('.protected-content')).toBeVisible();
  });

  test('should maintain session across navigation', async ({ authenticatedPage }) => {
    // Navigate around and verify session persists
    // await authenticatedPage.goto('/taqelah-demo-site.html#profile');
    // await expect(authenticatedPage.locator('.user-info')).toBeVisible();

    // await authenticatedPage.goto('/taqelah-demo-site.html#settings');
    // await expect(authenticatedPage.locator('.user-settings')).toBeVisible();
  });

});
```

---

## Part 6: Run the Tests

```bash
# Run all tests (setup will run first)
npx playwright test

# Run only the setup to generate auth state
npx playwright test --project=setup

# Run only the authenticated tests
npx playwright test --project=chromium

# Run in headed mode to see the browser
npx playwright test --headed

# Run with debug mode
npx playwright test --debug
```

---

## Part 7: Alternative Approach - Worker Fixture

For more control, you can use a worker-scoped fixture instead of project dependencies:

```typescript
// fixtures/auth-worker.ts
import { test as base, Browser, BrowserContext } from '@playwright/test';
import path from 'path';

const AUTH_FILE = path.join(__dirname, '../.auth/user.json');

type WorkerFixtures = {
  workerStorageState: string;
};

type TestFixtures = {
  loggedInPage: Page;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Worker-scoped fixture: runs once per worker
  workerStorageState: [async ({ browser }, use) => {
    // Check if auth file exists
    const fs = await import('fs');
    if (fs.existsSync(AUTH_FILE)) {
      await use(AUTH_FILE);
      return;
    }

    // Perform login once per worker
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://taqelah.sg/taqelah-demo-site.html');

    // TODO: Perform login
    await page.fill('#username', 'your-username');
    await page.fill('#password', 'your-password');
    await page.click('button[type="submit"]');

    // Wait for login to complete
    await page.waitForSelector('.dashboard');

    // Save storage state
    await context.storageState({ path: AUTH_FILE });
    await context.close();

    await use(AUTH_FILE);
  }, { scope: 'worker' }],

  // Test-scoped fixture: creates new page with auth state for each test
  loggedInPage: async ({ browser, workerStorageState }, use) => {
    const context = await browser.newContext({
      storageState: workerStorageState,
    });
    const page = await context.newPage();

    await use(page);

    await context.close();
  },
});

export { expect } from '@playwright/test';
```

---

## Challenges

### Challenge 1: Add Logout Test

Create a test that:
1. Starts logged in
2. Performs logout
3. Verifies the user is logged out
4. Does NOT affect other tests (hint: use a separate context)

### Challenge 2: Multiple User Roles

Extend the fixture to support multiple user types:
- Admin user
- Regular user
- Guest user

```typescript
type MultiUserFixtures = {
  adminPage: Page;
  regularUserPage: Page;
};
```

### Challenge 3: Session Expiry Handling

Create a fixture that:
1. Checks if the session is still valid
2. Re-authenticates if the session has expired
3. Continues with the test

---

## Common Issues and Solutions

### Issue: Auth state file not found

**Solution:** Make sure the `.auth` directory exists and the setup project runs first.

```bash
mkdir -p .auth
npx playwright test --project=setup
```

### Issue: Tests fail with "not logged in"

**Solution:** Check that:
1. The login selectors are correct
2. The wait condition matches the actual post-login state
3. The storage state file is being saved correctly

### Issue: Storage state is empty

**Solution:** Make sure you're waiting for login to complete before saving:

```typescript
// Wait for actual login completion, not just navigation
await page.waitForSelector('.logged-in-indicator');
await page.context().storageState({ path: authFile });
```

### Issue: Cross-origin cookies not saved

**Solution:** Some sites use third-party auth. You may need to:
1. Wait for redirects to complete
2. Ensure all relevant origins are visited before saving state

---

## Key Takeaways

1. **Storage State** saves cookies, localStorage, and sessionStorage
2. **Setup Projects** run before dependent projects
3. **Worker Fixtures** are efficient for expensive one-time setup
4. **Each test should be independent** - don't rely on test order
5. **Authentication isolation** - logout tests should use separate contexts

---

## Resources

- [Playwright Authentication Guide](https://playwright.dev/docs/auth)
- [Storage State API](https://playwright.dev/docs/api/class-browsercontext#browser-context-storage-state)
- [Project Dependencies](https://playwright.dev/docs/test-projects#dependencies)

---

## Next Steps

After completing this exercise:
1. Apply this pattern to your own application
2. Explore multi-user testing scenarios
3. Learn about global setup/teardown in Module 5

---

> **Note:** All contents of this workshop are proprietary and belong to **Taqelah**. Do not share or distribute without permission.
