# Module 7: Advanced Topics (Optional)

**Duration:** 2-3 hours
**Level:** Advanced
**Prerequisites:** Completed Modules 2-6

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

### 1. Global Setup and Teardown (90 minutes)
**File:** [1_global_setup_teardown.md](1_global_setup_teardown.md)

Learn about:
- What is global setup/teardown?
- When to use global setup
- Implementing global authentication
- Starting/stopping services
- Database setup and cleanup
- Sharing state between setup and tests
- Best practices

**Use cases:**
- One-time authentication for all tests
- Starting mock servers
- Database seeding
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

### 3. Advanced Parallel Execution (30 minutes)
**File:** [3_advanced_parallel.md](3_advanced_parallel.md)

Learn about:
- Worker isolation strategies
- Worker-scoped fixtures in depth
- Test data isolation per worker
- Port and resource allocation
- Handling shared resources
- Troubleshooting parallel issues

---

## 🧪 Lab Exercises

### Lab 1: Global Authentication Setup (45 minutes)

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

### Lab 2: Database Setup and Teardown (45 minutes)

**Task:** Set up and tear down test database

1. **Create global-setup.ts:**
```typescript
import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🗄️ Setting up test database...');

  // Example: MongoDB setup
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('test_db');

  // Create collections
  await db.createCollection('users');
  await db.createCollection('products');

  // Seed initial data
  await db.collection('users').insertMany([
    { username: 'testuser1', email: 'test1@example.com' },
    { username: 'testuser2', email: 'test2@example.com' },
  ]);

  await client.close();

  console.log('✅ Database setup completed');
}

export default globalSetup;
```

2. **Create global-teardown.ts:**
```typescript
import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up test database...');

  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('test_db');

  // Drop test database
  await db.dropDatabase();

  await client.close();

  console.log('✅ Cleanup completed');
}

export default globalTeardown;
```

---

### Lab 3: Test Sharding for CI/CD (45 minutes)

**Task:** Configure test sharding for parallel CI execution

1. **Create GitHub Actions workflow:**
```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}

      - name: Upload blob report to GitHub Actions Artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: blob-report-${{ matrix.shardIndex }}
          path: blob-report
          retention-days: 1

  merge-reports:
    if: always()
    needs: [test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

      - name: Download blob reports from GitHub Actions Artifacts
        uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-report-*
          merge-multiple: true

      - name: Merge into HTML Report
        run: npx playwright merge-reports --reporter html ./all-blob-reports

      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        with:
          name: html-report--attempt-${{ github.run_attempt }}
          path: playwright-report
          retention-days: 14
```

2. **Test locally with sharding:**
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

### Lab 4: Worker Isolation (30 minutes)

**Task:** Create isolated resources per worker

```typescript
// fixtures/worker-database.ts
import { test as base } from '@playwright/test';

type WorkerFixtures = {
  workerDatabase: string;
};

export const test = base.extend<{}, WorkerFixtures>({
  workerDatabase: [async ({}, use, workerInfo) => {
    const dbName = `test_db_${workerInfo.workerIndex}`;

    // Setup: Create database for this worker
    console.log(`Creating database: ${dbName}`);
    await createDatabase(dbName);

    await use(dbName);

    // Teardown: Cleanup database for this worker
    console.log(`Cleaning up database: ${dbName}`);
    await dropDatabase(dbName);
  }, { scope: 'worker' }],
});

// Use in tests
test('test with isolated database', async ({ workerDatabase }) => {
  console.log(`Using database: ${workerDatabase}`);
  // Each worker has its own database
});
```

---

### Lab 5: Advanced CI/CD Integration (60 minutes)

**Task:** Build a complete CI/CD pipeline

1. **Create multiple environment configs:**
```typescript
// playwright.staging.config.ts
export default defineConfig({
  use: {
    baseURL: 'https://staging.example.com',
  },
});

// playwright.production.config.ts
export default defineConfig({
  use: {
    baseURL: 'https://example.com',
  },
  retries: 0, // No retries in production
});
```

2. **Create npm scripts:**
```json
{
  "scripts": {
    "test": "playwright test",
    "test:staging": "playwright test --config=playwright.staging.config.ts",
    "test:production": "playwright test --config=playwright.production.config.ts",
    "test:smoke": "playwright test --grep @smoke",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug"
  }
}
```

3. **Create CI configuration for multiple environments:**
```yaml
# .gitlab-ci.yml
stages:
  - test

test:staging:
  stage: test
  script:
    - npm ci
    - npx playwright install --with-deps
    - npm run test:staging
  only:
    - develop

test:production:
  stage: test
  script:
    - npm ci
    - npx playwright install --with-deps
    - npm run test:smoke -- --config=playwright.production.config.ts
  only:
    - main
```

---

## ✅ Success Criteria

After completing this module, you should be able to:
- [x] Implement global setup and teardown
- [x] Create authentication setup that runs once
- [x] Set up and tear down databases
- [x] Share state between setup and tests
- [x] Shard tests across multiple machines
- [x] Merge shard reports
- [x] Create CI/CD pipelines with Playwright
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

## 🎉 Congratulations!

You've completed all modules of the Playwright Workshop! You now have comprehensive knowledge of:
- Writing and organizing tests
- Debugging and fixing test failures
- Running tests in parallel across browsers and devices
- Setting up CI/CD pipelines
- Managing enterprise-level test suites

## 🚀 Next Steps

1. **Practice** - Apply what you learned to your projects
2. **Explore** - Check out Playwright's advanced features
3. **Contribute** - Share your knowledge with the community
4. **Stay Updated** - Follow Playwright releases for new features

---

## 📚 Additional Learning Resources

- [Playwright Official Documentation](https://playwright.dev)
- [Playwright Community](https://playwright.dev/community/welcome)
- [Playwright Discord](https://aka.ms/playwright/discord)
- [Playwright GitHub](https://github.com/microsoft/playwright)
- [Playwright Blog](https://playwright.dev/blog)

---

**Ready to start? Open [1_global_setup_teardown.md](1_global_setup_teardown.md) to begin!**
