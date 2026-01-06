# Quick Start Guide - Playwright Fixtures

This guide will help you get started with Playwright fixtures in 5 minutes.

## Installation

```bash
cd playwright-fixtures
npm install
npx playwright install chromium
```

## Run Your First Test

```bash
npm test
```

## Understanding the Examples

### 1. Start with Built-in Fixtures

**File**: [tests/1-builtin-fixtures.spec.ts](tests/1-builtin-fixtures.spec.ts)

Run it:
```bash
npm run test:builtin
```

**What you'll learn**:
- `page` - Your main testing tool
- `context` - For multi-page scenarios
- `browser` - For custom configurations
- `request` - For API testing

### 2. Create Your First Custom Fixture

**File**: [tests/2-custom-fixtures.spec.ts](tests/2-custom-fixtures.spec.ts)

Run it:
```bash
npm run test:custom
```

**What you'll learn**:
- How to create reusable page objects
- Automatic cleanup after tests
- Test isolation

### 3. Advanced Patterns

**File**: [tests/3-advanced-fixtures.spec.ts](tests/3-advanced-fixtures.spec.ts)

Run it:
```bash
npm run test:advanced
```

**What you'll learn**:
- Worker-scoped fixtures (shared resources)
- Test data fixtures
- Multiple fixture combinations

### 4. Automatic Fixtures

**File**: [tests/4-automatic-fixtures.spec.ts](tests/4-automatic-fixtures.spec.ts)

Run it:
```bash
npm run test:auto
```

**What you'll learn**:
- Fixtures that run automatically
- Test logging and monitoring

### 5. Override Built-in Fixtures

**File**: [tests/5-fixture-override.spec.ts](tests/5-fixture-override.spec.ts)

Run it:
```bash
npm run test:override
```

**What you'll learn**:
- Customizing built-in fixtures
- Adding default behaviors to pages

## Create Your First Fixture

### Step 1: Create a Page Object

```typescript
// pages/MyPage.ts
import { Page, Locator } from '@playwright/test';

export class MyPage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1');
  }

  async goto() {
    await this.page.goto('https://example.com');
  }
}
```

### Step 2: Create a Fixture

```typescript
// fixtures/myFixtures.ts
import { test as base } from '@playwright/test';
import { MyPage } from '../pages/MyPage';

type MyFixtures = {
  myPage: MyPage;
};

export const test = base.extend<MyFixtures>({
  myPage: async ({ page }, use) => {
    const myPage = new MyPage(page);
    await myPage.goto();
    await use(myPage);
  },
});

export { expect } from '@playwright/test';
```

### Step 3: Use the Fixture

```typescript
// tests/myTest.spec.ts
import { test, expect } from '../fixtures/myFixtures';

test('my first fixture test', async ({ myPage }) => {
  await expect(myPage.heading).toBeVisible();
});
```

## Common Commands

```bash
# Run all tests
npm test

# Run in headed mode (see browser)
npm run test:headed

# Run with UI mode (interactive)
npm run test:ui

# View HTML report
npm run test:report

# Run specific test file
npm run test:builtin
npm run test:custom
npm run test:advanced
```

## Fixture Patterns Cheat Sheet

### Basic Fixture
```typescript
myFixture: async ({ page }, use) => {
  const resource = await setup();
  await use(resource);
  await cleanup();
}
```

### Worker-Scoped Fixture
```typescript
myFixture: [async ({}, use) => {
  const resource = await setup();
  await use(resource);
  await cleanup();
}, { scope: 'worker' }]
```

### Automatic Fixture
```typescript
myFixture: [async ({}, use) => {
  await beforeEach();
  await use();
  await afterEach();
}, { auto: true }]
```

### Override Built-in Fixture
```typescript
page: async ({ page }, use) => {
  await page.addInitScript(() => {});
  await use(page);
}
```

## Next Steps

1. ✅ Run all example tests to see fixtures in action
2. ✅ Read through the test files to understand patterns
3. ✅ Create your own page object and fixture
4. ✅ Try combining multiple fixtures in a test
5. ✅ Experiment with worker-scoped fixtures

## Troubleshooting

**Tests fail to find elements**:
- Check if the page loaded correctly
- Verify selectors in the page object
- Use `--headed` mode to see what's happening

**Fixtures not working**:
- Ensure you're importing `test` from your fixture file
- Check fixture dependencies are correct
- Verify fixture types are properly defined

**Want to see debug output**:
```bash
DEBUG=pw:api npm test
```

## Resources

- [Full README](README.md) - Detailed project documentation
- [Module 2 Guide](../module_2/5_playwright_fixtures.md) - Complete fixtures tutorial
- [Playwright Docs](https://playwright.dev/docs/test-fixtures) - Official documentation

## Tips

💡 **Start simple**: Begin with test-scoped fixtures before worker-scoped
💡 **One fixture, one responsibility**: Keep fixtures focused
💡 **Use TypeScript**: Type safety prevents errors
💡 **Cleanup matters**: Always clean up resources in fixtures
💡 **Combine fixtures**: Mix and match fixtures as needed

Happy testing! 🎭
