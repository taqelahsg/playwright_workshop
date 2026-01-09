# Playwright Test Reporting - Hands-on Examples

This project contains comprehensive examples demonstrating all Playwright reporting options.

## Quick Start

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install

# Run tests with default reporter
npm test
```

For detailed instructions, see [GETTING_STARTED.md](GETTING_STARTED.md)

## What's Included

### Test Files
- **example-basic.spec.ts** - Passing tests for TodoMVC
- **example-with-failures.spec.ts** - Tests with failures (for demo)
- **example-api.spec.ts** - API testing examples

### Built-in Reporters
- List Reporter - Detailed console output
- Dot Reporter - Minimal CI-friendly output
- Line Reporter - One line per file
- HTML Reporter - Interactive web report
- JSON Reporter - Machine-readable output
- JUnit Reporter - CI integration

### Custom Reporters
- **custom-reporter.ts** - Full-featured custom reporter
- **slack-reporter.ts** - Slack notifications

### Configuration Examples
- **multiple-reporters.config.ts** - Run multiple reporters
- **ci-reporters.config.ts** - CI/CD optimized
- **custom-reporter.config.ts** - Custom reporter setup
- **slack-reporter.config.ts** - Slack integration
- **html-only.config.ts** - HTML with full artifacts
- **blob-sharding.config.ts** - Sharded execution

## npm Scripts

```bash
# Basic reporters
npm run test:list          # List reporter
npm run test:dot           # Dot reporter
npm run test:line          # Line reporter
npm run test:html          # HTML reporter
npm run test:json          # JSON reporter
npm run test:junit         # JUnit reporter

# Advanced
npm run test:multiple      # Multiple reporters
npm run test:ci            # CI configuration
npm run test:custom        # Custom reporter
npm run test:sharded       # Blob reports with sharding

# View reports
npm run show:report        # View HTML report
```

## Documentation

- [GETTING_STARTED.md](GETTING_STARTED.md) - Complete setup guide
- [../README.md](../README.md) - Module 10 overview
- [../01_reporting_basics.md](../01_reporting_basics.md) - Reporting fundamentals
- [../REPORTER_COMPARISON.md](../REPORTER_COMPARISON.md) - Detailed comparison

## Project Structure

```
playwright-report-tests/
├── tests/              # Test files
├── reporters/          # Custom reporters
├── examples/           # Configuration examples
├── playwright.config.ts
└── package.json
```

## Key Features

✅ All built-in reporters demonstrated
✅ Custom reporter examples
✅ CI/CD configurations
✅ Slack integration example
✅ Blob reports for sharding
✅ Comprehensive documentation

## Learn More

- [Playwright Reporters Docs](https://playwright.dev/docs/test-reporters)
- [Reporter API](https://playwright.dev/docs/api/class-reporter)

Happy Testing! 🎭
