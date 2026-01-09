# Playwright Test Projects Examples

This project demonstrates comprehensive examples of Playwright Test Projects, showcasing how to organize and run tests across multiple browsers, devices, and configurations.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Configured Projects](#configured-projects)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Files](#test-files)
- [Project Dependencies](#project-dependencies)
- [Key Concepts](#key-concepts)
- [Best Practices](#best-practices)

## 🎯 Overview

Test Projects in Playwright allow you to:
- Run tests across multiple browsers (Chromium, Firefox, WebKit)
- Emulate mobile and tablet devices
- Separate authenticated vs guest user tests
- Distinguish between API and UI tests
- Set up project dependencies for authentication
- Configure different settings per project

## 📁 Project Structure

```
playwright-test-projects/
├── tests/
│   ├── example.spec.ts              # Runs on all browser projects
│   ├── example.smoke.spec.ts        # Smoke tests only
│   ├── example.viewport.spec.ts     # Viewport-specific tests
│   ├── global.setup.ts              # Setup project (authentication)
│   ├── global.cleanup.ts            # Cleanup project
│   ├── authenticated/
│   │   └── dashboard.spec.ts        # Authenticated user tests
│   ├── guest/
│   │   └── public.spec.ts           # Guest user tests
│   ├── api/
│   │   └── api-example.spec.ts      # API tests (no browser)
│   └── ui/
│       └── ui-example.spec.ts       # UI-specific tests
├── playwright.config.ts             # Multi-project configuration
├── package.json
└── README.md
```

## 🚀 Configured Projects

### Desktop Browsers
- **chromium** - Desktop Chrome browser
- **firefox** - Desktop Firefox browser
- **webkit** - Desktop Safari browser
- **Google Chrome** - Branded Google Chrome
- **Microsoft Edge** - Branded Microsoft Edge

### Mobile Devices
- **mobile-chrome** - Pixel 5 emulation
- **mobile-safari** - iPhone 12 emulation

### Tablet Devices
- **tablet-ipad** - iPad Pro emulation

### Special Purpose Projects
- **smoke** - Quick smoke tests for critical paths
- **authenticated** - Tests requiring user authentication
- **guest** - Tests for unauthenticated users
- **api** - API testing without browser
- **ui-chrome** - UI-focused tests on Chrome
- **desktop-1920** - Tests at 1920x1080 viewport
- **desktop-1366** - Tests at 1366x768 viewport

### Setup/Cleanup Projects
- **setup** - Runs before all tests (authentication, data setup)
- **cleanup** - Runs after all tests (cleanup, teardown)

## 📦 Installation

1. **Clone or navigate to this directory**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## ▶️ Running Tests

### Run All Projects

Run tests on all configured projects:
```bash
npm test
# or
npx playwright test
```

### Run Specific Browser

```bash
# Chromium only
npm run test:chromium

# Firefox only
npm run test:firefox

# WebKit only
npm run test:webkit
```

### Run Mobile Tests

```bash
# Both mobile devices
npm run test:mobile

# Specific mobile device
npx playwright test --project=mobile-chrome
npx playwright test --project=mobile-safari
```

### Run Smoke Tests

```bash
npm run test:smoke
```

### Run Authenticated vs Guest Tests

```bash
# Authenticated user tests
npm run test:authenticated

# Guest user tests
npm run test:guest
```

### Run API vs UI Tests

```bash
# API tests only
npm run test:api

# UI tests only
npm run test:ui
```

### Run Specific Test File

```bash
# Run on all projects
npx playwright test example.spec.ts

# Run on specific project
npx playwright test example.spec.ts --project=chromium
```

### Run Multiple Specific Projects

```bash
npx playwright test --project=chromium --project=firefox
```

### Run with UI Mode

```bash
npm run ui
# or
npx playwright test --ui
```

### View Test Report

```bash
npm run report
# or
npx playwright show-report
```

## 📝 Test Files

### example.spec.ts
Basic tests that run on **all browser projects**:
- Desktop browsers (Chromium, Firefox, WebKit)
- Mobile devices
- Tablet devices

**Features:**
- Cross-browser compatibility testing
- Basic navigation and assertions
- Project info logging

### example.smoke.spec.ts
Critical path smoke tests that run on **smoke project only**:
- Homepage loading
- Main navigation visibility
- Search functionality
- Quick health checks

**Features:**
- Fast execution (shorter timeout: 15s)
- No retries
- Critical functionality verification

### example.viewport.spec.ts
Viewport-specific tests for **desktop-1920** and **desktop-1366** projects:
- Viewport size verification
- Responsive navigation testing
- Layout testing at different screen sizes

**Features:**
- Screenshots at different viewports
- Responsive design validation

### authenticated/dashboard.spec.ts
Tests requiring **authenticated user** session:
- Dashboard access
- User profile
- Settings page

**Features:**
- Uses saved authentication state
- Access to protected routes
- User-specific functionality

### guest/public.spec.ts
Tests for **unauthenticated (guest)** users:
- Public page access
- Public navigation
- Documentation viewing

**Features:**
- Empty storage state (no authentication)
- Public content verification
- Redirect testing for protected routes

### api/api-example.spec.ts
API tests that run **without a browser**:
- GET, POST, PUT, DELETE requests
- Response validation
- Error handling
- Header verification

**Features:**
- Uses `request` fixture (no browser needed)
- Tests against JSONPlaceholder API
- Fast execution

### ui/ui-example.spec.ts
UI-focused tests on **Chrome only**:
- Navigation flows
- Interactive elements
- Visual element verification
- Form interactions

**Features:**
- Screenshots for visual verification
- Accessibility considerations
- Responsive design testing

## 🔗 Project Dependencies

### Setup Project
**Runs first** - Creates authentication state for other projects:
```
setup → chromium, firefox, webkit, mobile-chrome, etc.
```

All authenticated projects wait for setup to complete.

### Cleanup Project
**Runs last** - Cleans up after all tests complete:
```
chromium, firefox, webkit, mobile-chrome, etc. → cleanup
```

The cleanup project has dependencies on all test projects.

### Dependency Flow
```
1. setup (authentication)
2. All test projects run in parallel
3. cleanup (teardown)
```

## 💡 Key Concepts

### 1. Project Configuration
Each project can have its own:
- Browser type
- Device settings
- Viewport size
- Timeouts
- Retry strategy
- Base URL
- Storage state

### 2. Test Filtering
Projects can filter tests by:
- **testMatch**: Include specific test files (e.g., `*.smoke.spec.ts`)
- **testIgnore**: Exclude test files
- **testDir**: Run tests from specific directory
- **grep**: Filter by test title/tags

### 3. Storage State
- **Authenticated projects**: Load `playwright/.auth/user.json`
- **Guest projects**: Use empty storage state `{ cookies: [], origins: [] }`
- Enables testing with different user contexts

### 4. API vs UI Testing
- **API projects**: Use `request` fixture, no browser overhead
- **UI projects**: Use `page` fixture, full browser automation

### 5. Device Emulation
Uses Playwright's built-in device descriptors:
```typescript
...devices['iPhone 12']
...devices['Pixel 5']
...devices['iPad Pro']
```

## ✅ Best Practices

### 1. Use Setup Projects for Authentication
- Create authentication state once
- Share across all projects
- Faster test execution

### 2. Organize Tests by Purpose
- Separate authenticated vs guest tests
- Keep API and UI tests distinct
- Use dedicated directories

### 3. Leverage Smoke Tests
- Run critical tests on all browsers
- Run full suite on primary browser only
- Faster feedback loop

### 4. Name Projects Clearly
```typescript
// ✅ Good
{ name: 'Desktop Chrome - Smoke Tests' }

// ❌ Bad
{ name: 'p1' }
```

### 5. Optimize for CI/CD
```typescript
projects: process.env.CI
  ? [/* full matrix */]
  : [/* fast feedback */]
```

### 6. Use Project Dependencies
- Setup → Tests → Cleanup
- Ensures proper execution order
- Automatic failure handling

### 7. Avoid Over-Configuration
- Use only essential projects
- Leverage device presets
- Don't test every permutation

## 🎓 Learning Objectives

After exploring this project, you should understand:

1. ✅ How to configure multiple test projects
2. ✅ Cross-browser testing setup
3. ✅ Mobile and tablet device emulation
4. ✅ Project dependencies for setup/teardown
5. ✅ Authenticated vs guest user testing
6. ✅ API vs UI test separation
7. ✅ Test filtering by project
8. ✅ Storage state management
9. ✅ Viewport-specific testing
10. ✅ Project-specific configuration

## 📚 Additional Resources

- [Playwright Test Projects Documentation](https://playwright.dev/docs/test-projects)
- [Device Descriptors](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [Authentication Setup](https://playwright.dev/docs/auth)

## 🐛 Common Issues

### Authentication File Not Found
**Problem:** Tests fail because `playwright/.auth/user.json` doesn't exist

**Solution:** The setup project creates this file. Make sure to run with projects that depend on setup:
```bash
npx playwright test --project=chromium
```

### Tests Run on Wrong Project
**Problem:** Tests run on all projects when you want specific ones

**Solution:** Use `--project` flag or configure `testMatch`/`testDir`:
```bash
npx playwright test --project=smoke
```

### Cleanup Doesn't Run
**Problem:** Cleanup project doesn't execute after tests

**Solution:** Cleanup only runs when its dependency projects complete. Run the full suite:
```bash
npx playwright test
```

## 📊 Example Output

When you run `npm test`, you'll see:

```
Running 1 test using 1 worker
  ✓ setup: global.setup.ts (authentication, directories)

Running 30 tests using 5 workers
  ✓ chromium: example.spec.ts
  ✓ firefox: example.spec.ts
  ✓ webkit: example.spec.ts
  ✓ mobile-chrome: example.spec.ts
  ✓ mobile-safari: example.spec.ts
  ...

Running 1 test using 1 worker
  ✓ cleanup: global.cleanup.ts (remove auth, cleanup)

✅ All tests passed!
```

## 🎯 Next Steps

1. **Explore the configuration**: Open [playwright.config.ts](playwright.config.ts)
2. **Run the tests**: Try different project combinations
3. **Modify tests**: Add your own test scenarios
4. **Customize projects**: Add new projects for your needs
5. **Review results**: Check HTML report with `npm run report`

---

**Happy Testing! 🎭**
