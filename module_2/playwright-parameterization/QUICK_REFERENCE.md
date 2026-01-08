# Quick Reference Guide

## Common Commands

### Run Tests

```bash
# All tests
npm test

# Specific project
npm run test:basic
npm run test:project
npm run test:role
npm run test:csv
npm run test:env
npm run test:matrix

# With UI
npm run test:ui

# Headed mode (visible browser)
npm run test:headed

# Debug mode
npm run test:debug

# Show report
npm run test:report
```

### Run Specific Test Files

```bash
# Basic parameterization
npx playwright test 01-basic-param

# Project parameterization
npx playwright test 02-project-param

# Role parameterization
npx playwright test 03-role-param

# CSV parameterization
npx playwright test 04-csv-param

# Environment variables
npx playwright test 05-env-param

# Matrix testing
npx playwright test 06-matrix-param
```

### Run Specific Projects

```bash
# User projects
npx playwright test --project=user-alice
npx playwright test --project=user-bob
npx playwright test --project=user-charlie-prod

# Role projects
npx playwright test --project=role-admin
npx playwright test --project=role-user
npx playwright test --project=role-guest

# Matrix projects
npx playwright test --project=matrix-chrome-mobile
npx playwright test --project=matrix-chrome-desktop
```

## Test Parameterization Patterns

### 1. Basic forEach Loop

```typescript
const data = [{ input: 'a', expected: 'b' }];

data.forEach(({ input, expected }) => {
  test(`test ${input}`, async ({ page }) => {
    // test logic
  });
});
```

### 2. Project-Level Parameters

```typescript
// In custom-test.ts
export const test = base.extend<{ person: string }>({
  person: ['DefaultUser', { option: true }],
});

// In test file
test('example', async ({ page, person }) => {
  console.log(`Testing as ${person}`);
});
```

### 3. CSV-Based Tests

```typescript
import { loadCsvData } from '../utils/csv-helper';

const users = loadCsvData('test-data/users.csv');

users.forEach((user) => {
  test(`test ${user.username}`, async ({ page }) => {
    // test logic
  });
});
```

### 4. Environment Variables

```typescript
import { env } from '../utils/env-config';

test('example', async ({ page }) => {
  await page.goto(env.baseUrl);
  // Use env.testUser.email, env.api.key, etc.
});
```

### 5. Matrix Testing

```typescript
const viewports = [
  { name: 'mobile', width: 375 },
  { name: 'desktop', width: 1920 },
];

viewports.forEach((viewport) => {
  test(`test ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
  });
});
```

## Project Configuration

### Add New Project

In `playwright.config.ts`:

```typescript
{
  name: 'my-project',
  testMatch: /.*my-test.*\.spec\.ts/,
  use: {
    ...devices['Desktop Chrome'],
    person: 'MyUser',
    environment: 'staging',
  },
}
```

### Add Custom Option

In `fixtures/custom-test.ts`:

```typescript
type MyOptions = {
  myOption: string;
};

export const test = base.extend<MyOptions>({
  myOption: ['default', { option: true }],
});
```

## Test Data

### CSV File Format

```csv
username,password,role
admin,admin123,Administrator
user,user123,User
```

### TypeScript Data

```typescript
export const testData = [
  { id: 1, name: 'Test 1' },
  { id: 2, name: 'Test 2' },
];
```

## Environment Variables

### .env File

```env
BASE_URL=https://example.com
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password
API_KEY=your_key
```

### Access in Tests

```typescript
import { env } from '../utils/env-config';

env.baseUrl
env.testUser.email
env.api.key
```

## Debugging

### Playwright Inspector

```bash
npx playwright test --debug
```

### Console Logging

```typescript
test('example', async ({ page }) => {
  console.log('Debug info:', someVariable);
});
```

### Enable Debug Mode

In `.env`:
```env
ENABLE_DEBUG_MODE=true
```

## Test Organization

### Use describe Blocks

```typescript
test.describe('Feature Name', () => {
  test('scenario 1', async ({ page }) => {});
  test('scenario 2', async ({ page }) => {});
});
```

### Use Tags

```typescript
test('@smoke login test', async ({ page }) => {});

// Run with: npx playwright test --grep "@smoke"
```

### Skip/Only

```typescript
test.skip('skip this test', async ({ page }) => {});
test.only('run only this test', async ({ page }) => {});
```

## Useful Playwright Options

```bash
# Run with trace
npx playwright test --trace on

# Run specific grep pattern
npx playwright test --grep "login"

# Run multiple workers
npx playwright test --workers=4

# Run with timeout
npx playwright test --timeout=60000

# Run with retries
npx playwright test --retries=2
```

## File Locations

| Type | Location |
|------|----------|
| Test Files | `tests/*.spec.ts` |
| Fixtures | `fixtures/custom-test.ts` |
| CSV Data | `test-data/*.csv` |
| TS Data | `test-data/*.ts` |
| Utilities | `utils/*.ts` |
| Config | `playwright.config.ts` |
| Env Vars | `.env` |

## Quick Tips

1. Always read CSV from project root
2. Use descriptive test names
3. Keep test data separate from logic
4. Use TypeScript types for safety
5. Log important info for debugging
6. Use projects for different configs
7. Tag tests for easy filtering
8. Keep tests independent
9. Use page object models for complex apps
10. Review HTML report after runs
