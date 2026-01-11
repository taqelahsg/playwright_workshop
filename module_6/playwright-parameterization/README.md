# Playwright Parameterization Project

A comprehensive example project demonstrating various test parameterization techniques in Playwright.

## 📋 Overview

This project showcases different approaches to parameterizing tests in Playwright:

- **Test-Level Parameterization**: Using `forEach` loops for data-driven tests
- **Project-Level Parameterization**: Custom options configured per project
- **CSV-Based Parameterization**: Dynamic test generation from CSV files
- **Environment Variables**: Configuration through `.env` files
- **Matrix Testing**: Cross-browser and viewport combinations

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific project
npm run test:basic
npm run test:project
npm run test:csv
npm run test:env
npm run test:matrix

# Run with UI mode
npm run test:ui

# Generate HTML report
npm run test:report
```

## 📁 Project Structure

```
playwright-parameterization/
├── tests/
│   ├── 01-basic-param.spec.ts      # Basic forEach parameterization
│   ├── 02-project-param.spec.ts    # Project-level parameterization
│   ├── 03-role-param.spec.ts       # Role-based parameterization
│   ├── 04-csv-param.spec.ts        # CSV-based tests
│   ├── 05-env-param.spec.ts        # Environment variable tests
│   └── 06-matrix-param.spec.ts     # Matrix/cross-browser tests
├── fixtures/
│   └── custom-test.ts              # Custom test options
├── test-data/
│   ├── users.csv                   # User test data
│   ├── todos.csv                   # Todo test data
│   └── test-users.ts               # TypeScript test data
├── utils/
│   ├── csv-helper.ts               # CSV parsing utilities
│   └── env-config.ts               # Environment configuration
├── .env                            # Environment variables
├── .env.example                    # Environment variables template
├── playwright.config.ts            # Playwright configuration
└── package.json                    # Project dependencies
```

## 📚 Test Examples

### 1. Basic Parameterization (`01-basic-param.spec.ts`)

Simple forEach loops for data-driven testing:

```typescript
const testData = [
  { name: 'Alice', greeting: 'Hello, Alice!' },
  { name: 'Bob', greeting: 'Hello, Bob!' },
];

testData.forEach(({ name, greeting }) => {
  test(`greet ${name}`, async ({ page }) => {
    // Test logic
  });
});
```

### 2. Project-Level Parameterization (`02-project-param.spec.ts`)

Custom options configured in `playwright.config.ts`:

```typescript
test('user workflow', async ({ page, person, environment }) => {
  console.log(`Testing as ${person} on ${environment}`);
  // Test logic using custom parameters
});
```

### 3. CSV-Based Parameterization (`04-csv-param.spec.ts`)

Tests generated from CSV data:

```typescript
const users = loadCsvData('test-data/users.csv');

users.forEach((user) => {
  test(`login as ${user.username}`, async ({ page }) => {
    // Test logic using CSV data
  });
});
```

### 4. Environment Variables (`05-env-param.spec.ts`)

Configuration from `.env` file:

```typescript
test('use environment config', async ({ page }) => {
  await page.goto(env.baseUrl);
  // Use env.testUser.email, env.api.key, etc.
});
```

### 5. Matrix Testing (`06-matrix-param.spec.ts`)

Cross-browser and viewport combinations:

```typescript
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'desktop', width: 1920, height: 1080 },
];

viewports.forEach((viewport) => {
  test(`responsive on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    // Test responsive behavior
  });
});
```

## 🔧 Configuration

### Playwright Projects

The `playwright.config.ts` defines multiple projects:

- `basic-parameterization` - Basic forEach examples
- `user-alice`, `user-bob`, `user-charlie-prod` - Project-level params
- `role-admin`, `role-user`, `role-guest` - Role-based params
- `csv-tests` - CSV-generated tests
- `env-tests` - Environment variable tests
- `matrix-*` - Cross-browser/viewport tests

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
BASE_URL=https://demo.playwright.dev/todomvc
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password123
API_KEY=your_api_key
```

## 📊 Test Data

### CSV Files

- `users.csv` - User login test data
- `todos.csv` - Todo task test data

### TypeScript Files

- `test-users.ts` - Type-safe test data definitions

## 🎯 Best Practices

1. **Separate Data from Logic**: Keep test data in separate files
2. **Use Descriptive Names**: Clear test names for better reports
3. **Type Safety**: Leverage TypeScript for type-safe test data
4. **Avoid Over-Parameterization**: Keep tests focused and maintainable
5. **Use Tags**: Organize tests with tags like `@smoke`, `@regression`

## 📈 Running Specific Tests

```bash
# Run only basic parameterization tests
npx playwright test 01-basic-param

# Run only CSV tests
npx playwright test 04-csv-param

# Run tests for specific project
npx playwright test --project=user-alice

# Run with grep pattern
npx playwright test --grep "@smoke"

# Run in headed mode (visible browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug
```

## 🐛 Debugging

```bash
# Run with Playwright Inspector
npx playwright test --debug

# Generate trace
npx playwright test --trace on

# Show test report
npx playwright show-report
```

## 📖 Learn More

- [Playwright Documentation](https://playwright.dev)
- [Test Parameterization Guide](https://playwright.dev/docs/test-parameterize)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)

## 🤝 Contributing

This is a workshop example project. Feel free to:

- Add more parameterization examples
- Improve existing tests
- Add additional test data
- Enhance documentation

## 📝 License

This project is for educational purposes.
