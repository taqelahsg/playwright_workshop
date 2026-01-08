# Getting Started with Playwright Parameterization

This guide will help you get up and running with the Playwright Parameterization project.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Basic understanding of JavaScript/TypeScript
- Familiarity with Playwright basics

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `@playwright/test` - Playwright Test runner
- `csv-parse` - CSV file parsing
- `dotenv` - Environment variable management

### 2. Install Playwright Browsers

```bash
npx playwright install
```

For Chromium only (faster):
```bash
npx playwright install chromium
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
BASE_URL=https://demo.playwright.dev/todomvc
TEST_USER_EMAIL=your-test-email@example.com
TEST_USER_PASSWORD=your-password
```

## Running Your First Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Files

```bash
# Basic parameterization examples
npx playwright test 01-basic-param

# Project-level parameterization
npx playwright test 02-project-param

# CSV-based tests
npx playwright test 04-csv-param
```

### Run Tests with UI Mode

```bash
npm run test:ui
```

This opens the Playwright UI where you can:
- See all your tests
- Run tests individually
- Watch tests execute in the browser
- Debug failing tests

### Run Tests in Headed Mode

```bash
npx playwright test --headed
```

The browser window will be visible as tests run.

## Understanding the Project Structure

### Test Files

All test files are in the `tests/` directory:

1. **`01-basic-param.spec.ts`**
   - Simple forEach loops
   - Multiple test data scenarios
   - Edge case testing

2. **`02-project-param.spec.ts`**
   - Uses custom fixtures
   - Different configurations per project
   - Person and environment parameters

3. **`03-role-param.spec.ts`**
   - Role-based testing (admin, user, guest)
   - Locale-based testing
   - Permission testing

4. **`04-csv-param.spec.ts`**
   - Dynamic test generation from CSV
   - Filtered and transformed data
   - Category-based grouping

5. **`05-env-param.spec.ts`**
   - Environment variable usage
   - Feature flags
   - Configuration-based behavior

6. **`06-matrix-param.spec.ts`**
   - Cross-browser testing
   - Viewport combinations
   - Device emulation

### Test Data

Located in `test-data/`:

- **`users.csv`**: User credentials and roles
- **`todos.csv`**: Todo task information
- **`test-users.ts`**: TypeScript test data with type safety

### Utilities

Located in `utils/`:

- **`csv-helper.ts`**: Functions to load and parse CSV files
- **`env-config.ts`**: Type-safe environment configuration

### Fixtures

Located in `fixtures/`:

- **`custom-test.ts`**: Custom test options for project-level parameterization

## Running Specific Projects

The `playwright.config.ts` defines multiple projects. Run specific projects:

```bash
# Run tests as user Alice
npx playwright test --project=user-alice

# Run tests as admin role
npx playwright test --project=role-admin

# Run CSV-based tests
npx playwright test --project=csv-tests

# Run matrix tests for desktop Chrome
npx playwright test --project=matrix-chrome-desktop
```

## Understanding Test Output

When you run tests, you'll see:

```
Running 15 tests using 3 workers

  ✓  01-basic-param.spec.ts:15:5 › Basic Parameterization › should greet user Alice
  ✓  01-basic-param.spec.ts:15:5 › Basic Parameterization › should greet user Bob
  ...
```

Each line shows:
- Status (✓ pass, ✗ fail)
- File name and line number
- Test description

## Viewing Test Reports

### HTML Report

```bash
npm run test:report
```

Opens an interactive HTML report showing:
- Test results summary
- Individual test details
- Screenshots on failure
- Execution timeline

### JSON Report

Test results are also saved to `test-results/results.json` for programmatic access.

## Common Tasks

### Add New Test Data

**CSV Data:**
1. Edit `test-data/users.csv` or `test-data/todos.csv`
2. Add new rows with data
3. Tests will automatically include the new data

**TypeScript Data:**
1. Edit `test-data/test-users.ts`
2. Add new objects to the arrays
3. Get full TypeScript type checking

### Create a New Parameterized Test

```typescript
import { test, expect } from '@playwright/test';

const myData = [
  { input: 'test1', expected: 'result1' },
  { input: 'test2', expected: 'result2' },
];

myData.forEach(({ input, expected }) => {
  test(`should handle ${input}`, async ({ page }) => {
    // Your test logic here
  });
});
```

### Add a New Project Configuration

In `playwright.config.ts`, add a new project:

```typescript
{
  name: 'my-custom-project',
  testMatch: /.*my-test.*\.spec\.ts/,
  use: {
    ...devices['Desktop Chrome'],
    person: 'MyUser',
    environment: 'production',
  },
}
```

## Debugging Tests

### Using Playwright Inspector

```bash
npx playwright test --debug
```

This opens the Playwright Inspector where you can:
- Step through test execution
- Inspect the page
- View console logs
- See network requests

### Debug Specific Test

```bash
npx playwright test 01-basic-param --debug
```

### Enable Debug Logging

Set in `.env`:
```env
ENABLE_DEBUG_MODE=true
```

Many tests will output additional debug information.

## Troubleshooting

### Tests Fail with "Browser not found"

Run:
```bash
npx playwright install
```

### CSV Files Not Found

Ensure you're running tests from the project root directory.

### Environment Variables Not Loading

1. Verify `.env` file exists
2. Check file has correct format (no spaces around =)
3. Restart your terminal/IDE

### Slow Test Execution

The config uses `slowMo: 500` to make actions visible. To speed up:

In `playwright.config.ts`, change:
```typescript
launchOptions: {
  slowMo: 0,  // No delay
},
```

Or set headless mode:
```typescript
headless: true,
```

## Next Steps

1. ✅ Run all tests to verify setup
2. ✅ Explore each test file to understand different parameterization techniques
3. ✅ Modify test data in CSV or TypeScript files
4. ✅ Create your own parameterized tests
5. ✅ Experiment with different project configurations
6. ✅ Try running tests with different environment variables

## Additional Resources

- [Main README](./README.md) - Project overview
- [Playwright Docs](https://playwright.dev) - Official documentation
- [Test Parameterization Guide](https://playwright.dev/docs/test-parameterize) - Detailed guide

## Getting Help

If you encounter issues:

1. Check the [Playwright documentation](https://playwright.dev)
2. Review test output for error messages
3. Use `--debug` flag to step through tests
4. Check environment variables in `.env`
5. Verify Node.js and npm versions

Happy Testing! 🚀
