# Module 2: Getting Started with Playwright

**Duration:** 50 minutes (Intensive workshop)
**Level:** Beginner
**Prerequisites:** Basic JavaScript/TypeScript knowledge
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
