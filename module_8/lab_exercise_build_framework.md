# Lab Exercise: Build a Playwright Framework with Claude Code

**Duration:** 30-45 minutes
**Objective:** Build a complete Playwright test automation framework using Claude Code

---

## Prerequisites

Before starting:
1. Claude Code installed (`npm install -g @anthropic-ai/claude-code`)
2. Node.js 18+ installed
3. Empty folder for the project
4. Terminal/command line access

---

## Lab Overview

You will build a framework to test the **Taqelah Boutique Demo Site**:
- URL: https://taqelah.sg/taqelah-demo-site.html
- Login credentials: `ladies` / `ladies_GO`

### Framework Features to Build:
1. Page Object Model structure
2. Custom fixtures for authentication
3. Environment configuration
4. Sample tests for login and product browsing

---

## Part 1: Project Setup (5 minutes)

### Task 1.1: Create Project Folder

```bash
mkdir taqelah-playwright-framework
cd taqelah-playwright-framework
```

### Task 1.2: Start Claude Code

```bash
claude
```

### Task 1.3: Initialize Project

**Copy and paste this prompt to Claude Code:**

```
Initialize a new Playwright project with TypeScript:
1. Run npm init -y
2. Install @playwright/test as dev dependency
3. Install Playwright browsers
4. Create this folder structure:
   - tests/e2e/
   - tests/api/
   - pages/
   - fixtures/
   - utils/
   - config/
   - data/
5. Create a basic playwright.config.ts with:
   - testDir: './tests'
   - baseURL: 'https://taqelah.sg'
   - Chrome, Firefox, Safari projects
   - HTML reporter
6. Create .gitignore for node_modules, test-results, playwright-report
```

**Verify:** Check that all folders exist and you can run `npx playwright test`

---

## Part 2: Base Page Object (5 minutes)

### Task 2.1: Create BasePage

**Prompt to Claude Code:**

```
Create pages/BasePage.ts with a BasePage class:

Requirements:
- TypeScript class with Page from Playwright
- Constructor takes Page object
- Abstract property: pageURL (string)

Methods:
- goto(): navigates to pageURL
- waitForPageLoad(): waits for networkidle
- getTitle(): returns page title
- getCurrentURL(): returns current URL
- takeScreenshot(name: string): saves screenshot
- isElementVisible(locator: Locator): returns boolean

Include proper TypeScript types and make it abstract so other pages extend it.
```

**Verify:** File exists at `pages/BasePage.ts`

---

## Part 3: Login Page Object (5 minutes)

### Task 3.1: Create LoginPage

**Prompt to Claude Code:**

```
Create pages/LoginPage.ts that extends BasePage for the Taqelah demo site.

Target page: https://taqelah.sg/taqelah-demo-site.html

The login form has:
- Username input field
- Password input field
- Login/Submit button
- After login, shows a welcome message

Create LoginPage class with:
- pageURL = '/taqelah-demo-site.html'
- Locators as private methods:
  - usernameInput()
  - passwordInput()
  - loginButton()
  - welcomeMessage()
  - errorMessage()

Methods:
- login(username: string, password: string): fills form and submits
- isLoggedIn(): checks if welcome message visible
- getWelcomeText(): returns welcome message text
- getErrorText(): returns error message text

Use getByRole, getByLabel, or getByTestId for locators.
```

**Verify:** File exists and TypeScript compiles without errors

---

## Part 4: Dashboard Page Object (3 minutes)

### Task 4.1: Create DashboardPage

**Prompt to Claude Code:**

```
Create pages/DashboardPage.ts that extends BasePage.

This is the page shown after successful login on Taqelah demo site.

Include:
- pageURL = '/taqelah-demo-site.html' (same page, different state)
- Locators for:
  - Welcome/user greeting area
  - Logout button/link
  - Any navigation elements

Methods:
- isLoaded(): verifies dashboard content is visible
- logout(): clicks logout
- getUsername(): extracts logged-in username from welcome text
```

---

## Part 5: Fixtures (5 minutes)

### Task 5.1: Create Page Object Fixtures

**Prompt to Claude Code:**

```
Create fixtures/pages.fixture.ts that provides page objects as Playwright fixtures.

Import:
- test as base from @playwright/test
- LoginPage from ../pages/LoginPage
- DashboardPage from ../pages/DashboardPage

Define type PageFixtures with:
- loginPage: LoginPage
- dashboardPage: DashboardPage

Extend base test to create fixtures that:
- Instantiate each page object with the page instance
- Provide to tests via use()

Export the extended test and expect.
```

### Task 5.2: Create Authentication Fixture

**Prompt to Claude Code:**

```
Create fixtures/auth.fixture.ts with an authenticatedPage fixture.

Import the pages fixture and extend it.

Create authenticatedPage fixture that:
1. Gets loginPage from fixtures
2. Navigates to login page
3. Logs in with default credentials: username="ladies", password="ladies_GO"
4. Waits for login to complete (welcome message visible)
5. Provides the authenticated page to the test

Export extended test and expect.
```

---

## Part 6: Configuration (3 minutes)

### Task 6.1: Environment Configuration

**Prompt to Claude Code:**

```
Create config/environments.ts with environment settings:

Define type Environment:
- name: string
- baseURL: string
- credentials: { username: string, password: string }

Create environments object:
- staging: baseURL 'https://taqelah.sg', credentials ladies/ladies_GO
- dev: baseURL 'https://dev.taqelah.sg', credentials test/test_GO

Export:
- environments object
- getEnvironment(name: string) function
- currentEnv (reads TEST_ENV env var, defaults to 'staging')
```

### Task 6.2: Update Playwright Config

**Prompt to Claude Code:**

```
Update playwright.config.ts to:
1. Import currentEnv from config/environments
2. Use currentEnv.baseURL as the baseURL
3. Add these settings:
   - retries: 2 in CI, 0 locally
   - workers: 2 in CI, undefined locally
   - trace: 'on-first-retry'
   - screenshot: 'only-on-failure'
   - video: 'retain-on-failure'
4. Add reporters: list, html
```

---

## Part 7: Write Tests (10 minutes)

### Task 7.1: Create Login Tests

**Prompt to Claude Code:**

```
Create tests/e2e/login.spec.ts with login test cases.

Import test and expect from '../../fixtures/auth.fixture'

Test describe block: "Taqelah Login Tests"

Tests:

1. "should display login form" @smoke
   - Use loginPage fixture
   - Navigate to login page
   - Verify username input visible
   - Verify password input visible
   - Verify login button visible

2. "should login with valid credentials" @smoke
   - Use loginPage fixture
   - Login with ladies/ladies_GO
   - Verify welcome message is displayed
   - Verify isLoggedIn() returns true

3. "should show error for invalid credentials"
   - Use loginPage fixture
   - Login with ladies/wrong_password
   - Verify error message appears OR still on login form

4. "should logout successfully" @smoke
   - Use authenticatedPage fixture (already logged in)
   - Use dashboardPage fixture
   - Call logout()
   - Verify returned to login page
```

### Task 7.2: Run Tests

```bash
# Exit Claude Code first if needed
/exit

# Run the tests
npx playwright test tests/e2e/login.spec.ts --headed

# Or run smoke tests only
npx playwright test --grep @smoke --headed
```

---

## Part 8: Add Utility Functions (3 minutes)

### Task 8.1: Create Helpers

**Prompt to Claude Code:**

```
Create utils/helpers.ts with utility functions:

Functions:
- generateRandomString(length: number): string - alphanumeric random string
- formatTestName(name: string): string - replace spaces with dashes, lowercase
- waitFor(ms: number): Promise<void> - promise-based sleep
- getTimestamp(): string - returns ISO timestamp

Export all functions.
```

---

## Part 9: Final Verification (5 minutes)

### Task 9.1: Verify Project Structure

Your project should now look like:

```
taqelah-playwright-framework/
├── tests/
│   └── e2e/
│       └── login.spec.ts
├── pages/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   └── DashboardPage.ts
├── fixtures/
│   ├── pages.fixture.ts
│   └── auth.fixture.ts
├── utils/
│   └── helpers.ts
├── config/
│   └── environments.ts
├── data/
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── .gitignore
```

### Task 9.2: Run All Tests

```bash
# Run all tests
npx playwright test

# Run with HTML report
npx playwright test --reporter=html

# View report
npx playwright show-report
```

### Task 9.3: Fix Any Issues

If tests fail, use Claude Code to debug:

```
This test is failing with the error:
[paste error here]

The test code is:
[paste relevant code]

Please fix the issue.
```

---

## Bonus Challenges

If you have extra time, try these:

### Challenge 1: Add Product Tests
```
Create a ProductPage class and tests for browsing products on the Taqelah site.
```

### Challenge 2: Add API Tests
```
Create tests/api/health.spec.ts that tests the Taqelah API endpoint health.
Use Playwright's request context.
```

### Challenge 3: Add Visual Tests
```
Add a visual regression test that:
1. Takes a screenshot of the login page
2. Compares it to a baseline
```

### Challenge 4: CI/CD Pipeline
```
Create .github/workflows/playwright.yml for GitHub Actions that:
1. Runs on push and PR
2. Installs dependencies
3. Runs Playwright tests
4. Uploads HTML report as artifact
```

---

## Summary

In this lab, you learned to:
- Use Claude Code to scaffold a Playwright project
- Generate page objects with AI assistance
- Create fixtures for reusable setup
- Configure environments and settings
- Write and run tests
- Debug issues with AI help

---

## Troubleshooting

### Common Issues:

**Tests can't find page objects:**
- Check import paths are correct
- Verify TypeScript compiles: `npx tsc --noEmit`

**Login test fails:**
- Verify selectors match the actual page
- Run with `--headed` to watch the browser
- Use `--debug` for step-by-step execution

**Fixture not available:**
- Ensure you import `test` from the correct fixture file
- Check fixture is exported properly

**TypeScript errors:**
- Run `npx tsc --noEmit` to see all errors
- Ask Claude Code to fix: `Fix the TypeScript errors in this file`

---

## Next Steps

After completing this lab:
1. Explore the generated framework structure
2. Add more page objects for other pages
3. Create additional test scenarios
4. Integrate with your CI/CD pipeline

Continue to **Module 9** to learn about CI/CD integration with GitHub Actions, then complete the **Module 10 Capstone Project**.
