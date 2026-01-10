# Module 2: Getting Started with Playwright

**Duration:** 50 minutes (Intensive workshop)
**Level:** Beginner
**Prerequisites:** Basic JavaScript/TypeScript knowledge

> **Note:** In the intensive one-day workshop (9 AM - 6 PM), this module is covered in 50 minutes with focused demos and essential hands-on practice.

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:
- ✅ Understand what Playwright is and its key benefits
- ✅ Install and set up a Playwright project
- ✅ Write your first Playwright test
- ✅ Understand test structure (`test`, `expect`, `async/await`)
- ✅ Use common locators to find elements
- ✅ Run tests from the command line

---

## 📚 Topics Covered

### 1. Introduction to Playwright (30 minutes)
**File:** [1_introduction_to_playwright.md](1_introduction_to_playwright.md)

Learn about:
- What is Playwright and why use it
- Key features: auto-wait, cross-browser, debugging
- Playwright vs Selenium comparison
- Use cases for Playwright

---

### 2. Installation and Setup (45 minutes)
**File:** [2_install_playwright.md](2_install_playwright.md)

Learn how to:
- Install Node.js
- Set up VS Code
- Initialize a Playwright project
- Understand the project structure
- Run example tests

**Hands-on:**
- Install Playwright on your machine
- Run your first test
- View the HTML test report

---

### 3. Understanding Your First Test
**File:** [3_understanding_typescript_spec_file.md](3_understanding_typescript_spec_file.md)

Learn about:
- Test file structure and imports
- The `test()` function
- The `page` object and its methods
- Understanding `async` and `await`
- Making assertions with `expect()`
- Common locators (getByRole, getByText, getByLabel)
- Basic interaction patterns

**Hands-on Lab:**
- Explore: [playwright-hello-world-project/](playwright-hello-world-project/)
- Modify existing tests
- Write new tests from scratch

---

## 🧪 Lab Exercises

### Lab 1: Installation and First Run (15 minutes)
1. Install Playwright using the instructions
2. Navigate to `playwright-hello-world-project/`
3. Run: `npm install`
4. Run: `npx playwright test`
5. View report: `npx playwright show-report`

**Expected outcome:** Tests run successfully and you can view the HTML report

---

### Lab 2: Explore Existing Tests (20 minutes)
1. Open `playwright-hello-world-project/tests/example.spec.ts`
2. Read and understand the code
3. Run a single test: `npx playwright test example.spec.ts`
4. Run in headed mode: `npx playwright test --headed`
5. Watch the browser execute the test

**Expected outcome:** Understand how tests are structured

---

### Lab 3: Modify a Test (20 minutes)
**Task:** Modify the existing test to:
- Navigate to https://playwright.dev
- Click on "Docs" link
- Verify the page contains "Getting Started"

**Hints:**
```typescript
await page.goto('https://playwright.dev');
await page.getByRole('link', { name: 'Docs' }).click();
await expect(page.getByText('Getting Started')).toBeVisible();
```

---

### Lab 4: Write a Login Test (30 minutes)
**Task:** Create a new test file `tests/login.spec.ts` that:
- Navigates to: https://the-internet.herokuapp.com/login
- Fills username: `tomsmith`
- Fills password: `SuperSecretPassword!`
- Clicks the Login button
- Verifies the success message appears

**Starter code:**
```typescript
import { test, expect } from '@playwright/test';

test('user can login successfully', async ({ page }) => {
  // Step 1: Navigate

  // Step 2: Fill credentials

  // Step 3: Click login

  // Step 4: Verify success
});
```

---

## ✅ Success Criteria

After completing this module, you should be able to:
- [x] Explain what Playwright is and why it's useful
- [x] Install Playwright and initialize a project
- [x] Run tests using `npx playwright test`
- [x] Understand the basic test file structure
- [x] Write tests with navigation, form filling, and button clicks
- [x] Use locators like `getByRole`, `getByText`, `getByLabel`
- [x] Make assertions with `expect()`

---

## 🎓 Quick Reference

### Essential Commands
```bash
# Run all tests
npx playwright test

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific file
npx playwright test tests/example.spec.ts

# Show HTML report
npx playwright show-report
```

### Common Test Patterns
```typescript
// Navigate
await page.goto('https://example.com');

// Find and click
await page.getByRole('button', { name: 'Submit' }).click();

// Fill form
await page.fill('#username', 'testuser');

// Verify element visible
await expect(page.getByText('Welcome')).toBeVisible();

// Verify URL
await expect(page).toHaveURL('/dashboard');
```

---

## 💡 Tips for Success

1. **Type, don't copy-paste** - You'll learn better by typing code
2. **Read error messages carefully** - They often tell you exactly what's wrong
3. **Use headed mode** - Watch what the browser does with `--headed`
4. **Experiment** - Try changing values and see what happens
5. **Use the docs** - https://playwright.dev is your best friend

---

## 📖 Additional Resources

- [Playwright Official Documentation](https://playwright.dev)
- [Writing Tests Guide](https://playwright.dev/docs/writing-tests)
- [Locators Documentation](https://playwright.dev/docs/locators)
- [Assertions Reference](https://playwright.dev/docs/test-assertions)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

---

## ❓ Common Issues and Solutions

### Issue: "npx: command not found"
**Solution:** Install Node.js from https://nodejs.org

### Issue: "Cannot find module '@playwright/test'"
**Solution:** Run `npm install` in the project directory

### Issue: Tests are slow
**Solution:** This is normal for first run. Playwright downloads browsers on first use

### Issue: Browser doesn't close
**Solution:** Tests run in headless mode by default. Use `--headed` to see the browser

---

## 🎯 Next Module Preview

In **Module 3: Core Testing Skills**, you'll learn:
- How to configure Playwright for your project
- Recording tests automatically with Codegen
- Advanced CLI commands and options
- Test annotations (@smoke, @regression, skip, only)
- Retries and timeouts

---

**Ready to start? Open [1_introduction_to_playwright.md](1_introduction_to_playwright.md) to begin!**
