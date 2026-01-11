# Quick Reference Guide - Playwright Test Projects

## 🚀 Common Commands

```bash
# Install dependencies
npm install

# Run all tests on all projects
npm test

# Run specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run mobile tests
npm run test:mobile

# Run smoke tests only
npm run test:smoke

# Run authenticated user tests
npm run test:authenticated

# Run guest user tests
npm run test:guest

# Run API tests
npm run test:api

# Run UI tests
npm run test:ui

# Run with UI mode
npm run ui

# Show HTML report
npm run report

# Run specific project
npx playwright test --project=chromium

# Run multiple projects
npx playwright test --project=chromium --project=firefox

# Run specific test file
npx playwright test example.spec.ts

# Run specific test on specific project
npx playwright test example.spec.ts --project=chromium
```

## 📂 Project List

| Project Name | Description | Use Case |
|-------------|-------------|----------|
| `setup` | Authentication & setup | Runs first, creates auth state |
| `chromium` | Desktop Chrome | Cross-browser testing |
| `firefox` | Desktop Firefox | Cross-browser testing |
| `webkit` | Desktop Safari | Cross-browser testing |
| `Google Chrome` | Branded Chrome | Testing with real Chrome |
| `Microsoft Edge` | Branded Edge | Testing with real Edge |
| `mobile-chrome` | Pixel 5 | Mobile Android testing |
| `mobile-safari` | iPhone 12 | Mobile iOS testing |
| `tablet-ipad` | iPad Pro | Tablet testing |
| `smoke` | Smoke tests | Quick critical path tests |
| `authenticated` | Auth required | Tests for logged-in users |
| `guest` | No auth | Tests for anonymous users |
| `api` | API tests | Backend/API testing |
| `ui-chrome` | UI tests | Frontend UI testing |
| `desktop-1920` | 1920x1080 | Large viewport |
| `desktop-1366` | 1366x768 | Standard viewport |
| `cleanup` | Teardown | Runs last, cleanup |

## 📝 Test Files

| File | Projects | Description |
|------|----------|-------------|
| `example.spec.ts` | All browsers | Basic cross-browser tests |
| `example.smoke.spec.ts` | smoke | Quick smoke tests |
| `example.viewport.spec.ts` | desktop-1920, desktop-1366 | Viewport tests |
| `global.setup.ts` | setup | Authentication setup |
| `global.cleanup.ts` | cleanup | Cleanup/teardown |
| `authenticated/dashboard.spec.ts` | authenticated | Auth required tests |
| `guest/public.spec.ts` | guest | Public access tests |
| `api/api-example.spec.ts` | api | API tests |
| `ui/ui-example.spec.ts` | ui-chrome | UI tests |

## 🔗 Project Dependencies

```
Setup Flow:
setup → [all test projects] → cleanup

Example:
1. setup creates auth state
2. chromium, firefox, webkit, mobile-chrome, etc. run in parallel
3. cleanup removes auth state and temp files
```

## 💡 Quick Tips

### Running Specific Project Types

```bash
# All desktop browsers
npx playwright test --project=chromium --project=firefox --project=webkit

# All mobile devices
npx playwright test --project=mobile-chrome --project=mobile-safari

# Smoke tests across all browsers
npx playwright test example.smoke.spec.ts --project=smoke

# Authenticated tests only
npx playwright test --project=authenticated

# API tests only (fast, no browser)
npx playwright test --project=api
```

### Debugging

```bash
# Debug mode
npx playwright test --debug

# Debug specific project
npx playwright test --debug --project=chromium

# Headed mode (see browser)
npx playwright test --headed

# Specific browser headed
npx playwright test --headed --project=firefox

# UI mode (interactive)
npx playwright test --ui
```

### Reports

```bash
# Generate and show HTML report
npx playwright show-report

# Show report from specific directory
npx playwright show-report playwright-report

# List all tests
npx playwright test --list

# List tests for specific project
npx playwright test --list --project=chromium
```

## 🎯 Common Scenarios

### Scenario 1: Quick Feedback
Run smoke tests on Chrome only:
```bash
npm run test:smoke
```

### Scenario 2: Cross-Browser Testing
Run all tests on all desktop browsers:
```bash
npx playwright test --project=chromium --project=firefox --project=webkit
```

### Scenario 3: Mobile Testing
Test on both mobile platforms:
```bash
npm run test:mobile
```

### Scenario 4: API Testing
Fast API tests without browser:
```bash
npm run test:api
```

### Scenario 5: Full Test Suite
Run everything:
```bash
npm test
```

### Scenario 6: CI/CD Pipeline
```bash
# Set CI environment variable
CI=true npm test

# This runs the CI configuration from playwright.config.ts
```

## 🔧 Configuration Examples

### Add New Project
Edit `playwright.config.ts`:

```typescript
{
  name: 'my-custom-project',
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 720 },
  },
  testMatch: /.*\.custom\.spec\.ts/,
}
```

### Add New Test
Create file matching project's `testMatch`:

```typescript
// tests/example.custom.spec.ts
import { test, expect } from '@playwright/test';

test('my custom test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

## 📊 Understanding Output

```
Running 1 test using 1 worker
  ✓ setup: global.setup.ts

Running 30 tests using 5 workers
  ✓ chromium: example.spec.ts
  ✓ firefox: example.spec.ts

Running 1 test using 1 worker
  ✓ cleanup: global.cleanup.ts
```

- **Stage 1**: Setup project runs
- **Stage 2**: All test projects run in parallel
- **Stage 3**: Cleanup project runs

## 🚨 Troubleshooting

### Auth File Missing
```bash
# Run with setup dependency
npx playwright test --project=chromium
# (setup runs automatically due to dependency)
```

### Wrong Project Running
```bash
# Be explicit with --project flag
npx playwright test --project=smoke example.smoke.spec.ts
```

### Tests Not Found
```bash
# Check testMatch/testDir in config
# List tests to verify
npx playwright test --list --project=smoke
```

### Cleanup Not Running
```bash
# Run full suite (cleanup needs dependencies)
npm test
```

## 📖 Learn More

- Full README: [README.md](README.md)
- Configuration: [playwright.config.ts](playwright.config.ts)
- Test Projects Guide: [module_2/13_test_projects.md](../13_test_projects.md)
