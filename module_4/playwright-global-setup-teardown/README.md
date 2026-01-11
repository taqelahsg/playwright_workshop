# Playwright Global Setup and Teardown Demo

This project demonstrates how to use Playwright's global setup and teardown functionality.

## Overview

Global setup and teardown allow you to run code once before all tests and once after all tests. This is useful for:
- Setting up a test database
- Starting a test server
- Authenticating once and reusing credentials
- Cleaning up resources after all tests complete

## Project Configuration

This project is configured to run with:
- **Browser**: Chromium only
- **Headless**: false (browser visible)
- **Slow Motion**: 500ms (slows down operations for better visibility)

## Files

- `global-setup.ts` - Runs once before all tests
- `global-teardown.ts` - Runs once after all tests
- `playwright.config.ts` - Configuration file
- `tests/example.spec.ts` - Example test file

## Running Tests

```bash
# Install dependencies (if not already installed)
npm install

# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# View test report
npm run report
```

## How It Works

1. **Global Setup** (`global-setup.ts`):
   - Runs once before any tests
   - Can set up authentication, start servers, etc.
   - In this example, it launches a browser and navigates to Playwright's website

2. **Tests** (`tests/example.spec.ts`):
   - Run after global setup
   - Can use any setup data from global setup
   - Each test is independent

3. **Global Teardown** (`global-teardown.ts`):
   - Runs once after all tests complete
   - Cleans up resources
   - Deletes temporary files, closes servers, etc.

## Reference

For more information, see: https://playwright.dev/docs/test-global-setup-teardown
