# Module 3: Core Testing Skills

**Level:** Beginner
**Prerequisites:** Completed Module 2

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:
- ✅ Configure Playwright projects with `playwright.config.ts`
- ✅ Record tests automatically using Codegen
- ✅ Use CLI commands to run, filter, and debug tests
- ✅ Use test annotations to organize and control test execution
- ✅ Configure retries and timeouts for flaky tests

---

## 📚 Topics Covered

### 1. Basic Playwright Configuration
**File:** [1_basic_configuration.md](1_basic_configuration.md)

Learn about:
- Understanding `playwright.config.ts`
- Essential configuration options:
  - `testDir`, `timeout`, `retries`
  - `fullyParallel`, `workers`
  - `use` section (baseURL, screenshot, video)
- Configuring browser projects
- Running configuration-specific tests

**Hands-on:**
- Modify configuration settings
- Add custom base URL
- Configure screenshot on failure

---

### 2. Recording Tests with Codegen
**File:** [2_recording_tests.md](2_recording_tests.md)

Learn how to:
- Use `npx playwright codegen` to record tests
- Navigate the Codegen interface
- Generate tests automatically
- Edit and improve recorded tests
- Best practices for recorded code

**Hands-on:**
- Record a test for a login flow
- Record a test for a shopping cart
- Refactor recorded tests

---

### 3. Command Line Interface Basics
**File:** [3_cli_basics.md](3_cli_basics.md)

Learn essential CLI commands:
- Running tests (`npx playwright test`)
- Headed mode (`--headed`)
- Debug mode (`--debug`)
- UI mode (`--ui`)
- Filtering tests with `--grep`
- Running specific projects
- Viewing reports

**Hands-on:**
- Run tests in different modes
- Filter tests by name
- Use UI mode to explore tests

---

### 4. Test Annotations
**File:** [4_test_annotations.md](4_test_annotations.md)

Learn about:
- `test.skip()` - Skip specific tests
- `test.only()` - Run only specific tests
- `test.fail()` - Mark known failures
- `test.fixme()` - Mark tests to be fixed
- Test tags (@smoke, @regression)
- Conditional annotations
- Best practices for test organization

**Hands-on Lab:**
- Explore: [playwright-annotations/](playwright-annotations/)
- Tag tests appropriately
- Use skip and only annotations

---

### 5. Retries and Timeouts
**File:** [5_retries_and_timeouts.md](5_retries_and_timeouts.md)

Learn about:
- Test retries for flaky tests
- Global vs test-specific timeouts
- Action timeouts
- Navigation timeouts
- Assertion timeouts
- Best practices for handling timeouts

**Hands-on Lab:**
- Explore: [playwright-retries-timeouts/](playwright-retries-timeouts/)
- Configure retries
- Handle slow tests with timeouts

---

## 🧪 Lab Exercises

**See:** [lab_exercise_taqelah_config_record_annotation_timout.md](lab_exercise_taqelah_config_record_annotation_timout.md)

---

## ✅ Success Criteria

After completing this module, you should be able to:
- [x] Create and modify `playwright.config.ts`
- [x] Set baseURL, timeout, retries, and other options
- [x] Record tests using Codegen
- [x] Use CLI to run tests in different modes
- [x] Filter tests using --grep
- [x] Tag tests with @smoke, @regression
- [x] Skip or focus specific tests
- [x] Configure retries for flaky tests
- [x] Set appropriate timeouts

---

## 🎓 Quick Reference

### Configuration Essentials
```typescript
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  workers: 4,
  use: {
    baseURL: 'https://example.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
```

### Essential CLI Commands
```bash
# Record tests
npx playwright codegen [url]

# Run tests
npx playwright test

# Run with options
npx playwright test --headed --project=chromium

# Debug
npx playwright test --debug

# UI Mode
npx playwright test --ui

# Filter tests
npx playwright test --grep "@smoke"
npx playwright test --grep-invert "@slow"
```

### Test Annotations
```typescript
// Skip test
test.skip('not ready yet', async ({ page }) => { });

// Run only this test
test.only('debug this', async ({ page }) => { });

// Expected to fail
test.fail('known bug', async ({ page }) => { });

// Tag tests
test('login @smoke', async ({ page }) => { });
test('payment @regression', async ({ page }) => { });

// Conditional skip
test.skip(browserName === 'webkit', 'test', async ({ page }) => { });
```

---

## 💡 Tips for Success

1. **Start with Codegen** - Record first, then refactor
2. **Use meaningful tags** - @smoke for critical tests, @regression for comprehensive
3. **Don't over-retry** - Fix flaky tests rather than just retrying
4. **Use UI mode** - Great for debugging and exploring tests
5. **Filter effectively** - Use --grep to run specific test groups

---

## 📖 Additional Resources

- [Configuration Documentation](https://playwright.dev/docs/test-configuration)
- [Codegen Documentation](https://playwright.dev/docs/codegen)
- [CLI Documentation](https://playwright.dev/docs/test-cli)
- [Test Annotations](https://playwright.dev/docs/test-annotations)
- [Timeouts Guide](https://playwright.dev/docs/test-timeouts)

---

## ❓ Common Issues and Solutions

### Issue: Codegen window doesn't open
**Solution:** Make sure no other browser instances are running. Try: `npx playwright install`

### Issue: Tests fail with "Timeout exceeded"
**Solution:** Increase timeout in config or for specific tests:
```typescript
test.setTimeout(60000); // 60 seconds
```

### Issue: --grep doesn't work
**Solution:** Make sure tags are in test names:
```typescript
test('my test @smoke', async ({ page }) => { }); // ✅
test('my test', { tag: '@smoke' }, async ({ page }) => { }); // ✅
```

### Issue: Retries run even for passing tests
**Solution:** Retries only run for failed tests. Check your assertions.

---

## 🎯 Next Module Preview

In **Module 4: Debugging & Test Management**, you'll learn:
- Using Trace Viewer for deep debugging
- Playwright Fixtures for code organization
- Page Object Model pattern
- Creating custom fixtures
- Test hooks (beforeEach, afterEach)

---

**Ready to start? Open [1_basic_configuration.md](1_basic_configuration.md) to begin!**

---

> **Note:** All contents of this workshop are proprietary and belong to **Taqelah**. Do not share or distribute without permission.
