# Module 6: Test Organization and Execution

**Level:** Intermediate
**Prerequisites:** Completed Modules 2-5

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:
- ✅ Understand how Playwright runs tests in parallel
- ✅ Configure workers and parallelization strategies
- ✅ Create and manage test projects for different browsers
- ✅ Parameterize tests with data-driven approaches
- ✅ Organize and scale test suites effectively
- ✅ Use worker isolation for independent test execution
- ✅ Implement visual regression testing
- ✅ Use screenshot comparisons and data snapshots

---

## 📚 Topics Covered

### 1. Parallel Test Execution
**File:** [1_parallel_execution.md](1_parallel_execution.md)

> **Cross-reference:** This section covers *how workers operate* (configuring worker count, parallel modes, sharding). For advanced patterns on *setting up resources* for workers (worker-scoped fixtures, isolation strategies for shared resources), see [Module 5: Advanced Parallel Execution](../module_5/3_advanced_parallel.md).

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

---

### 2. Test Projects
**File:** [2_test_projects.md](2_test_projects.md)

Learn about:
- What are test projects?
- Configuring multiple browser projects
- Device emulation projects (mobile, tablet)
- Project dependencies (setup/teardown)
- Running specific projects
- Environment-specific projects
- Filtering tests by project

---

### 3. Test Parameterization
**File:** [3_parameterization.md](3_parameterization.md)

Learn about:
- What is test parameterization?
- Test-level parameterization with `forEach`
- Project-level parameterization with custom options
- Using environment variables
- CSV-based test generation
- Data-driven testing patterns

---

### 4. Visual Testing Basics
**File:** [4_visual_testing_basics.md](4_visual_testing_basics.md)

Learn about:
- What is visual regression testing?
- When to use visual testing
- How Playwright's screenshot comparison works
- Baseline management workflow

---

### 5. Screenshot Comparison
**File:** [5_screenshot_comparison.md](5_screenshot_comparison.md)

Learn about:
- Using `toHaveScreenshot()` for visual comparisons
- Full page and element-level screenshots
- Configuration options (threshold, maxDiffPixels)
- Handling animations and dynamic content

---

### 6. Snapshot Testing
**File:** [6_snapshot_testing.md](6_snapshot_testing.md)

Learn about:
- Using `toMatchSnapshot()` for data snapshots
- API response snapshots
- Page structure snapshots
- Computed styles snapshots

---

### 7. Visual Testing Best Practices
**File:** [7_visual_testing_best_practices.md](7_visual_testing_best_practices.md)

Learn about:
- CI/CD integration for visual tests
- Organizing visual tests
- Handling common issues
- Baseline management strategies

---

## 🧪 Lab Exercise

**File:** [lab_exercise_taqelah_test_organization.md](lab_exercise_taqelah_test_organization.md)

Practice test organization and execution concepts using the Taqelah Boutique demo e-commerce site. The lab covers:
- Configuring parallel execution with multiple workers
- Creating test projects for different browsers and devices
- Implementing data-driven parameterized tests
- Organizing tests into a scalable suite structure

---

## 🧪 Hands-on Projects

| Project | Description |
|---------|-------------|
| `playwright-parallel-tests/` | Parallel execution examples |
| `playwright-test-projects/` | Multi-browser and device projects |
| `playwright-parameterization/` | Data-driven testing examples |
| `playwright-visual-testing/` | Visual regression testing examples |

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
- [x] Create visual regression tests
- [x] Use screenshot and snapshot comparisons
- [x] Handle dynamic content in visual tests

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

### Visual Testing
```typescript
// Screenshot comparison
await expect(page).toHaveScreenshot('homepage.png');

// Element screenshot
await expect(page.locator('form')).toHaveScreenshot('form.png');

// With options
await expect(page).toHaveScreenshot('page.png', {
  maxDiffPixels: 100,
  animations: 'disabled',
});

// Data snapshot
expect(data).toMatchSnapshot('api-response.json');
```

### CLI Commands
```bash
# Run with specific workers
npx playwright test --workers=4

# Run specific project
npx playwright test --project=chromium

# Run with sharding
npx playwright test --shard=1/3

# Update visual snapshots
npx playwright test --update-snapshots
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
8. **Run visual tests on single browser** - Avoid cross-browser noise
9. **Mask dynamic content** - Timestamps, user data, etc.
10. **Generate baselines in CI** - Not locally

---

## 📖 Additional Resources

- [Parallelization Guide](https://playwright.dev/docs/test-parallel)
- [Test Projects Documentation](https://playwright.dev/docs/test-projects)
- [Parameterize Tests](https://playwright.dev/docs/test-parameterize)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [Sharding Tests](https://playwright.dev/docs/test-sharding)
- [Visual Comparisons](https://playwright.dev/docs/test-snapshots)

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

### Issue: Visual tests fail with small differences
**Solution:** Increase `threshold` or `maxDiffPixels` in screenshot options.

### Issue: Screenshots differ across OS
**Solution:** Run visual tests in CI on consistent environment (Linux).

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
