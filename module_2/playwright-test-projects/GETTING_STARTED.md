# Getting Started with Playwright Test Projects

## 🎯 What You'll Learn

This project demonstrates **Playwright Test Projects** - a powerful feature that allows you to run the same test suite across multiple browsers, devices, and configurations from a single codebase.

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
npm install
```

This installs Playwright and all necessary dependencies.

### Step 2: Run Your First Test

```bash
# Run smoke tests on Chromium (fastest way to verify setup)
npm run test:smoke
```

### Step 3: View Results

```bash
# Open the HTML report
npm run report
```

## ✅ What Just Happened?

When you ran `npm run test:smoke`, Playwright:

1. **Setup Project** ran first and created authentication state
2. **Smoke Tests** executed critical path tests
3. **Generated a report** showing results

## 🎓 Try These Next

### Run Tests on Different Browsers

```bash
# Test on Chrome only
npm run test:chromium

# Test on Firefox only
npm run test:firefox

# Test on Safari (WebKit) only
npm run test:webkit
```

### Run Tests on Mobile Devices

```bash
# Test on mobile devices (iPhone 12 & Pixel 5)
npm run test:mobile
```

### Run Different Test Types

```bash
# API tests (fast, no browser)
npm run test:api

# UI tests (browser-based)
npm run test:ui

# Authenticated user tests
npm run test:authenticated

# Guest user tests
npm run test:guest
```

### Run Everything

```bash
# Run complete test suite on all projects
npm test
```

This will run tests on:
- ✓ 3 desktop browsers (Chromium, Firefox, WebKit)
- ✓ 2 branded browsers (Google Chrome, Microsoft Edge)
- ✓ 2 mobile devices (iPhone 12, Pixel 5)
- ✓ 1 tablet (iPad Pro)
- ✓ Various specialized projects (smoke, auth, API, etc.)

## 📊 Understanding the Output

When you run tests, you'll see output like this:

```
Running 5 tests using 1 worker
  ✓ setup: global.setup.ts (authentication)

Running 156 tests using 5 workers
  ✓ chromium: example.spec.ts
  ✓ firefox: example.spec.ts
  ✓ webkit: example.spec.ts
  ...

Running 1 test using 1 worker
  ✓ cleanup: global.cleanup.ts
```

**What this means:**
- **Stage 1**: Setup creates authentication state
- **Stage 2**: All tests run in parallel across projects
- **Stage 3**: Cleanup removes temporary files

## 📂 Project Structure Explained

```
tests/
├── example.spec.ts              → Runs on ALL browsers
├── example.smoke.spec.ts        → Runs on SMOKE project only
├── authenticated/dashboard.spec.ts → Runs on AUTHENTICATED project
├── guest/public.spec.ts         → Runs on GUEST project
├── api/api-example.spec.ts      → Runs on API project (no browser)
└── ui/ui-example.spec.ts        → Runs on UI-CHROME project
```

**Key Point**: Different test files run on different projects based on the configuration in [playwright.config.ts](playwright.config.ts).

## 🔍 Exploring the Examples

### 1. Cross-Browser Testing

Open [tests/example.spec.ts](tests/example.spec.ts) to see a test that runs on all browsers.

**Try this:**
```bash
# See it run on all browsers
npx playwright test example.spec.ts
```

### 2. Smoke Tests

Open [tests/example.smoke.spec.ts](tests/example.smoke.spec.ts) to see fast critical path tests.

**Try this:**
```bash
# Quick smoke test on specific browser
npm run test:smoke
```

### 3. Mobile Testing

Mobile tests run on the same test files but with mobile device emulation.

**Try this:**
```bash
# See how your site works on mobile
npm run test:mobile
```

### 4. API Testing

Open [tests/api/api-example.spec.ts](tests/api/api-example.spec.ts) to see API tests without a browser.

**Try this:**
```bash
# Fast API testing
npm run test:api
```

### 5. Authenticated vs Guest

Compare:
- [tests/authenticated/dashboard.spec.ts](tests/authenticated/dashboard.spec.ts) - with login
- [tests/guest/public.spec.ts](tests/guest/public.spec.ts) - without login

**Try this:**
```bash
# Test as logged-in user
npm run test:authenticated

# Test as guest
npm run test:guest
```

## 🎨 UI Mode (Interactive Testing)

For a visual, interactive testing experience:

```bash
npm run ui
```

This opens Playwright's UI mode where you can:
- ✓ Select which projects to run
- ✓ See tests execute in real-time
- ✓ Debug failures easily
- ✓ View screenshots and traces

## 🐛 Debug Mode

To debug a failing test:

```bash
# Debug mode with inspector
npx playwright test --debug

# Debug specific project
npx playwright test --debug --project=chromium

# Debug specific test file
npx playwright test example.spec.ts --debug
```

## 📖 Learn More

### Documentation Files

1. **[README.md](README.md)** - Complete project documentation
2. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Command cheat sheet
3. **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Visual structure diagrams
4. **[playwright.config.ts](playwright.config.ts)** - Configuration file with comments

### External Resources

- [Playwright Test Projects Docs](https://playwright.dev/docs/test-projects)
- [Module Tutorial](../13_test_projects.md)

## 💡 Common Tasks

### List All Projects

```bash
npx playwright test --list
```

### Run Specific Project

```bash
npx playwright test --project=chromium
```

### Run Multiple Projects

```bash
npx playwright test --project=chromium --project=firefox
```

### Run Specific Test on Specific Project

```bash
npx playwright test example.spec.ts --project=webkit
```

### Run in Headed Mode (See Browser)

```bash
npx playwright test --headed --project=chromium
```

## 🎯 What Makes This Project Special?

### 1. Multiple Browsers from One Test
Write a test once, run it on Chrome, Firefox, Safari automatically.

### 2. Mobile & Desktop Coverage
Same tests work on desktop and mobile devices.

### 3. Project Dependencies
Setup runs first, tests run in parallel, cleanup runs last.

### 4. Smart Test Organization
- Smoke tests for quick feedback
- Full suite for comprehensive testing
- Separate API and UI tests
- Authenticated vs guest user scenarios

### 5. Real-World Examples
All examples use real websites and APIs you can test immediately.

## ✨ Next Steps

1. **Explore the config**: Open [playwright.config.ts](playwright.config.ts)
2. **Run different projects**: Try the commands above
3. **Modify a test**: Edit [tests/example.spec.ts](tests/example.spec.ts) and re-run
4. **Add your own project**: Add a new project to the config
5. **Write your own test**: Create a new .spec.ts file

## 🆘 Troubleshooting

### Tests Not Running?

```bash
# Make sure browsers are installed
npx playwright install

# Verify setup
npx playwright test --list
```

### Authentication File Missing?

The setup project creates it automatically. Make sure to run tests with projects that depend on setup:

```bash
npx playwright test --project=chromium
```

### Want to Run Just One Project?

Use the `--project` flag:

```bash
npx playwright test --project=smoke
```

## 🎉 You're Ready!

You now have a complete Playwright Test Projects setup. Start exploring the examples and try running tests on different browsers and devices.

**Happy Testing!**

---

**Questions?** Check the [README.md](README.md) or [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for more details.
