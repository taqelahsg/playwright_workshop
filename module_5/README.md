# Module 5: Global Setup, CI/CD Integration & Test Reporting

**Level:** Advanced
**Prerequisites:** Completed Modules 2-4

> **Note:** This module covers advanced topics including global setup/teardown, CI/CD integration, and test reporting.

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:
- ✅ Implement global setup and teardown for test suites
- ✅ Use advanced CLI features for CI/CD
- ✅ Implement test sharding for distributed execution
- ✅ Create worker-scoped resources
- ✅ Optimize test execution for large suites
- ✅ Integrate Playwright with CI/CD pipelines

---

## 📚 Topics Covered

### 1. Global Setup and Teardown
**File:** [1_global_setup_teardown.md](1_global_setup_teardown.md)

Learn about:
- What is global setup/teardown?
- When to use global setup
- Implementing global authentication
- Sharing state between setup and tests
- Best practices

**Use cases:**
- One-time authentication for all tests
- Starting mock servers
- Environment configuration
- Resource cleanup

**Hands-on Lab:**
- Explore: [playwright-global-setup-teardown/](playwright-global-setup-teardown/)
- Implement global authentication
- Create database setup
- Share configuration across tests

---

### 2. Advanced CLI and Sharding (45 minutes)
**File:** [2_advanced_cli.md](2_advanced_cli.md)

Learn about:
- Test sharding for parallel CI
- Merging shard reports
- Advanced filtering techniques
- Test list generation
- Custom reporters
- Environment-specific execution
- CI/CD integration patterns

**Key topics:**
- Sharding tests across multiple machines
- Running failed tests only
- Generating test reports
- GitHub Actions integration
- GitLab CI integration

---

### 3. Advanced Parallel Execution
**File:** [3_advanced_parallel.md](3_advanced_parallel.md)

> **Cross-reference:** This section focuses on *setting up resources* for workers (worker-scoped fixtures, isolation strategies). For the fundamentals of *how workers operate* (configuring worker count, parallel vs serial modes, sharding), see [Module 6: Parallel Execution](../module_6/1_parallel_execution.md).

Learn about:
- Worker isolation strategies
- Worker-scoped fixtures in depth
- Test data isolation per worker
- Port and resource allocation
- Handling shared resources
- Troubleshooting parallel issues

---

## 🧪 Lab Exercises

### Global Authentication Setup

**Task:** Implement global authentication that runs once before all tests

1. **Create global-setup.ts:**
```typescript
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🔐 Performing global authentication...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate and login
  await page.goto('https://example.com/login');
  await page.fill('#username', process.env.TEST_USERNAME!);
  await page.fill('#password', process.env.TEST_PASSWORD!);
  await page.click('#submit');

  // Wait for authentication
  await page.waitForURL('**/dashboard');

  // Save authentication state
  await context.storageState({ path: 'playwright/.auth/user.json' });

  await browser.close();

  console.log('✅ Authentication completed');
}

export default globalSetup;
```

2. **Configure in playwright.config.ts:**
```typescript
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  use: {
    storageState: 'playwright/.auth/user.json',
  },
});
```

3. **Create tests that use authenticated state:**
```typescript
test('access protected page', async ({ page }) => {
  // Already authenticated!
  await page.goto('/dashboard');
  await expect(page.locator('.user-name')).toBeVisible();
});
```

---

### Test Sharding for CI/CD

1. **Test locally with sharding:**
```bash
# Terminal 1 - Shard 1
npx playwright test --shard=1/4

# Terminal 2 - Shard 2
npx playwright test --shard=2/4

# Terminal 3 - Shard 3
npx playwright test --shard=3/4

# Terminal 4 - Shard 4
npx playwright test --shard=4/4
```
---

## ✅ Success Criteria

After completing this module, you should be able to:
- [x] Implement global setup and teardown
- [x] Create authentication setup that runs once
- [x] Set up and tear down databases
- [x] Share state between setup and tests
- [x] Implement worker isolation strategies
- [x] Configure environment-specific testing
- [x] Optimize large test suites

---

## 🎓 Quick Reference

### Global Setup
```typescript
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
});

// global-setup.ts
async function globalSetup(config: FullConfig) {
  // One-time setup
}
export default globalSetup;
```

### Test Sharding
```bash
# Run shard 1 of 3
npx playwright test --shard=1/3

# Merge reports
npx playwright merge-reports --reporter=html ./all-blob-reports
```

### Worker Fixtures
```typescript
export const test = base.extend<{}, WorkerFixtures>({
  workerResource: [async ({}, use, workerInfo) => {
    const resource = await createResource(workerInfo.workerIndex);
    await use(resource);
    await cleanupResource(resource);
  }, { scope: 'worker' }],
});
```

### CI/CD Commands
```bash
# Run only failed tests
npx playwright test --last-failed

# Generate different report formats
npx playwright test --reporter=html,json,junit

# Run with specific config
npx playwright test --config=playwright.ci.config.ts
```

---

## 💡 Tips for Success

1. **Use global setup for expensive operations** - Authentication, database setup
2. **Keep global setup fast** - It runs before every test execution
3. **Clean up in teardown** - Always clean up resources
4. **Shard appropriately** - Balance shards based on test count
5. **Use worker fixtures for isolation** - Prevents test interference
6. **Monitor CI execution time** - Optimize based on metrics
7. **Don't over-engineer** - Start simple, add complexity as needed

---

## 📖 Additional Resources

- [Global Setup Documentation](https://playwright.dev/docs/test-global-setup-teardown)
- [Sharding Tests](https://playwright.dev/docs/test-sharding)
- [CI/CD Integration](https://playwright.dev/docs/ci)
- [GitHub Actions Example](https://playwright.dev/docs/ci-intro)
- [GitLab CI Example](https://playwright.dev/docs/ci#gitlab-ci)
- [Jenkins Integration](https://playwright.dev/docs/ci#jenkins)

---

## ❓ Common Issues and Solutions

### Issue: Global setup runs multiple times
**Solution:** Verify `globalSetup` is at config level, not project level.

### Issue: Storage state not found
**Solution:** Ensure global setup completes before tests run:
```typescript
// Check file exists
if (!fs.existsSync('playwright/.auth/user.json')) {
  throw new Error('Authentication state not found');
}
```

### Issue: Shard reports don't merge
**Solution:** Use blob reporter in shards:
```typescript
reporter: process.env.CI ? 'blob' : 'html',
```

### Issue: Worker fixtures run too many times
**Solution:** Verify scope is set to 'worker':
```typescript
myFixture: [async ({}, use) => { ... }, { scope: 'worker' }]
```

---

## 🎯 Next Module Preview

In **Module 6: Test Organization & Execution**, you'll learn:
- Running tests in parallel
- Creating test projects for different browsers
- Parameterizing tests with data
- Organizing large test suites
- Worker isolation and management

---

## 📚 Additional Learning Resources

- [Playwright Official Documentation](https://playwright.dev)
- [Playwright Community](https://playwright.dev/community/welcome)
- [Playwright Discord](https://aka.ms/playwright/discord)
- [Playwright GitHub](https://github.com/microsoft/playwright)
- [Playwright Blog](https://playwright.dev/blog)

---

**Ready to start? Open [1_global_setup_teardown.md](1_global_setup_teardown.md) to begin!**

---

# Test Reporting

## Built-in Reporters

Playwright provides 8 built-in reporters:

| Reporter | Output | Best For |
|----------|--------|----------|
| `list` | Console | Local development (default) |
| `line` | Console | Large test suites |
| `dot` | Console | CI pipelines |
| `html` | File | Debugging failures |
| `json` | File | Automation/analytics |
| `junit` | File | CI integration |
| `github` | Annotations | GitHub Actions |
| `blob` | Binary | Sharded tests |

## Configuration

### Single Reporter
```typescript
// playwright.config.ts
export default defineConfig({
  reporter: 'html'
});
```

### Multiple Reporters
```typescript
export default defineConfig({
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }],
    ['junit', { outputFile: 'results.xml' }]
  ]
});
```

### Environment-Based
```typescript
export default defineConfig({
  reporter: process.env.CI
    ? [['dot'], ['html'], ['junit', { outputFile: 'results.xml' }]]
    : [['list'], ['html', { open: 'on-failure' }]]
});
```

## CLI Commands

```bash
# Run with specific reporter
npx playwright test --reporter=html

# View HTML report
npx playwright show-report

# Multiple reporters
npx playwright test --reporter=list --reporter=html
```

## HTML Reporter Options

```typescript
['html', {
  outputFolder: 'playwright-report',
  open: 'on-failure'  // 'always' | 'never' | 'on-failure'
}]
```

## Blob Reports (Sharding)

For distributed test execution:

```bash
# Run sharded tests
npx playwright test --shard=1/3 --reporter=blob
npx playwright test --shard=2/3 --reporter=blob
npx playwright test --shard=3/3 --reporter=blob

# Merge reports
npx playwright merge-reports --reporter html ./blob-report
```

## CI Integration

### GitHub Actions
```yaml
- name: Run tests
  run: npx playwright test
- name: Upload report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

### Config for CI
```typescript
reporter: [
  ['dot'],
  ['html'],
  ['junit', { outputFile: 'results.xml' }]
]
```

## Custom Reporters

```typescript
// reporters/my-reporter.ts
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class MyReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`${test.title}: ${result.status}`);
  }
}

export default MyReporter;
```

Usage:
```typescript
reporter: ['./reporters/my-reporter.ts']
```

## Reporting Lab Exercise

1. Configure HTML + JSON reporters
2. Run tests and view HTML report
3. Try environment-based configuration

**Hands-on Lab:**
- Explore: [lab_exercise_taqelah_cart_dweb_mweb.md](lab_exercise_taqelah_cart_dweb_mweb.md)

---

> **Note:** All contents of this workshop are proprietary and belong to **Taqelah**. Do not share or distribute without permission.
