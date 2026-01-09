# Playwright Hello World Project

Welcome to your first Playwright project! This is a beginner-friendly sample project designed to help you learn the basics of Playwright test automation.

## What is this project?

This project contains simple, well-commented test examples that demonstrate:
- Basic test structure
- Navigation and page interactions
- Element locators
- Assertions and expectations
- Running tests across multiple browsers

## Prerequisites

Before you begin, make sure you have:
- **Node.js** (version 18 or higher) installed
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)
- Basic knowledge of JavaScript/TypeScript

## Quick Start

### 1. Install Dependencies

First, navigate to this project directory and install the required packages:

```bash
cd module_2/playwright-hello-world-project
npm install
```

This will install:
- Playwright Test framework
- TypeScript definitions
- Browser binaries (Chromium, Firefox, WebKit)

**Note:** The first installation may take a few minutes as Playwright downloads browser binaries.

### 2. Run Your First Test

Run all tests in headless mode (no browser window):

```bash
npm test
```

Or use the Playwright command directly:

```bash
npx playwright test
```

### 3. View the Test Report

After tests complete, view the HTML report:

```bash
npm run report
```

Or:

```bash
npx playwright show-report
```

## Available Scripts

This project includes several npm scripts to make testing easier:

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests in headless mode |
| `npm run test:headed` | Run tests with visible browser windows |
| `npm run test:ui` | Open Playwright's interactive UI mode |
| `npm run test:debug` | Run tests in debug mode with Playwright Inspector |
| `npm run test:chrome` | Run tests only in Chromium |
| `npm run test:firefox` | Run tests only in Firefox |
| `npm run test:webkit` | Run tests only in WebKit (Safari) |
| `npm run report` | Open the HTML test report |
| `npm run codegen` | Launch Playwright Codegen for recording tests |

## Understanding the Test File

The main test file is located at [tests/example.spec.ts](tests/example.spec.ts).

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('test description', async ({ page }) => {
  // Navigate to a page
  await page.goto('https://example.com');

  // Interact with elements
  await page.getByRole('button', { name: 'Click me' }).click();

  // Make assertions
  await expect(page.getByText('Success!')).toBeVisible();
});
```

### Key Concepts

1. **`test()`** - Defines a test case
2. **`async/await`** - Handles asynchronous operations
3. **`page`** - Represents a browser page/tab
4. **`expect()`** - Makes assertions to verify test conditions

## Project Structure

```
playwright-hello-world-project/
├── .github/
│   └── workflows/
│       └── playwright.yml      # CI/CD configuration
├── tests/
│   └── example.spec.ts         # Sample test file
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies and scripts
├── playwright.config.ts        # Playwright configuration
└── README.md                   # This file
```

## Test Examples Included

### Test 1: Page Title Verification
Checks if the page title contains expected text.

### Test 2: Navigation Test
Clicks a link and verifies navigation to the correct page.

### Test 3: Search Functionality
Demonstrates using form inputs and search features.

### Test 4: Navigation Menu
Verifies that key navigation elements are present.

### Test 5: Footer Links
Shows how to scroll and verify footer elements.

## Common Commands

### Run Tests

```bash
# Run all tests
npx playwright test

# Run a specific test file
npx playwright test tests/example.spec.ts

# Run tests in headed mode (see the browser)
npx playwright test --headed

# Run tests in UI mode (interactive)
npx playwright test --ui

# Run tests in debug mode
npx playwright test --debug
```

### Run Tests on Specific Browsers

```bash
# Run on Chromium only
npx playwright test --project=chromium

# Run on Firefox only
npx playwright test --project=firefox

# Run on WebKit only
npx playwright test --project=webkit
```

### Generate Tests with Codegen

Playwright can record your browser interactions and generate test code:

```bash
npx playwright codegen
```

This opens a browser window and the Playwright Inspector. Any actions you perform in the browser will be recorded as test code.

## Configuration

The [playwright.config.ts](playwright.config.ts) file contains the test configuration:

- **testDir**: Directory containing test files (`./tests`)
- **fullyParallel**: Run tests in parallel for faster execution
- **retries**: Number of times to retry failed tests (2 on CI, 0 locally)
- **reporter**: Type of test report (HTML by default)
- **projects**: Browser configurations (Chromium, Firefox, WebKit)

## Tips for Beginners

1. **Start with headed mode** - Use `--headed` to see what the browser is doing
2. **Use UI mode for debugging** - Run `npm run test:ui` for interactive testing
3. **Read the comments** - The test file includes detailed comments explaining each step
4. **Experiment** - Try modifying the tests to learn how they work
5. **Check the reports** - HTML reports show screenshots and videos of failures

## Troubleshooting

### Tests are failing

1. Check your internet connection (tests navigate to real websites)
2. Run in headed mode to see what's happening: `npm run test:headed`
3. Check if the website structure has changed
4. Look at the error message in the terminal

### Browsers won't install

1. Make sure you have internet connection
2. Try manually installing browsers: `npx playwright install`
3. Check if you have enough disk space

### Command not found errors

1. Make sure you're in the correct directory
2. Ensure Node.js and npm are installed: `node --version` and `npm --version`
3. Try reinstalling dependencies: `rm -rf node_modules && npm install`

## Next Steps

Once you're comfortable with this project:

1. **Modify existing tests** - Change URLs, locators, or assertions
2. **Write new tests** - Create your own test file in the `tests/` folder
3. **Explore the documentation** - Visit [playwright.dev](https://playwright.dev)
4. **Try advanced features** - Learn about fixtures, page object model, and API testing

## Learning Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Writing Tests Guide](https://playwright.dev/docs/writing-tests)
- [Locators Documentation](https://playwright.dev/docs/locators)
- [Assertions Reference](https://playwright.dev/docs/test-assertions)
- [Best Practices](https://playwright.dev/docs/best-practices)

## Practice Exercises

### Exercise 1: Modify a Test
Change the first test to navigate to `https://example.com` and verify the title.

### Exercise 2: Add a New Test
Create a new test that:
1. Navigates to `https://the-internet.herokuapp.com`
2. Clicks on "Form Authentication"
3. Verifies the page contains "Login Page"

### Exercise 3: Test a Form
Write a test that fills out the login form at `https://the-internet.herokuapp.com/login`:
- Username: `tomsmith`
- Password: `SuperSecretPassword!`
- Click Submit
- Verify success message

## Support

If you encounter issues:
1. Check the [Playwright Documentation](https://playwright.dev)
2. Review error messages carefully
3. Try running tests in debug mode: `npm run test:debug`
4. Check the HTML report for screenshots and traces

## License

This project is provided as-is for educational purposes.

Happy Testing!
