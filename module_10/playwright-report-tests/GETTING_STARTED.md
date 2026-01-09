# Getting Started with Playwright Reporting Examples

This guide will help you set up and run the Playwright test reporting examples.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. **Navigate to the playwright-report-tests directory:**

```bash
cd module_10/playwright-report-tests
```

2. **Install dependencies:**

```bash
npm install
```

3. **Install Playwright browsers:**

```bash
npx playwright install
```

## Project Structure

```
playwright-report-tests/
├── tests/                          # Test files
│   ├── example-basic.spec.ts       # Basic passing tests
│   ├── example-with-failures.spec.ts # Tests with failures (for demo)
│   └── example-api.spec.ts         # API testing examples
├── reporters/                      # Custom reporters
│   ├── custom-reporter.ts          # Example custom reporter
│   └── slack-reporter.ts           # Slack notification reporter
├── examples/                       # Configuration examples
│   ├── multiple-reporters.config.ts # Multiple reporters
│   ├── ci-reporters.config.ts      # CI/CD optimized
│   ├── custom-reporter.config.ts   # Custom reporter
│   ├── slack-reporter.config.ts    # Slack integration
│   ├── html-only.config.ts         # HTML reporter only
│   └── blob-sharding.config.ts     # Blob reporter for sharding
├── playwright.config.ts            # Default configuration
├── package.json                    # Dependencies and scripts
└── GETTING_STARTED.md              # This file
```

## Quick Start

### Run Tests with Default Configuration

```bash
npm test
```

This uses the default configuration which automatically selects reporters based on environment:
- **Local:** list + HTML (opens on failure)
- **CI:** dot + HTML + JSON + JUnit

## Reporter Examples

### 1. List Reporter (Default for Local)

Shows detailed test execution in the console.

```bash
npm run test:list
```

**Output:**
```
Running 12 tests using 4 workers
  ✓ should navigate to homepage successfully (1.2s)
  ✓ should display todo input field (0.8s)
  ✓ should add a new todo item (1.5s)
```

### 2. Dot Reporter (Minimal)

Shows one character per test - great for CI.

```bash
npm run test:dot
```

**Output:**
```
Running 12 tests using 4 workers
··········✓·
```

### 3. Line Reporter (Concise)

Shows one line per test file.

```bash
npm run test:line
```

**Output:**
```
example-basic.spec.ts [3/3] (5.2s)
example-with-failures.spec.ts [4/5] (3.8s)
```

### 4. HTML Reporter (Interactive)

Generates an interactive HTML report with screenshots, videos, and traces.

```bash
npm run test:html
npx playwright show-report
```

**Features:**
- Interactive UI
- Screenshots and videos
- Trace viewer integration
- Filter by status
- Search functionality
- Error stack traces

### 5. JSON Reporter (Programmatic)

Outputs test results in JSON format for custom processing.

```bash
npm run test:json
```

View the output:
```bash
cat test-results/results.json | jq .
```

### 6. JUnit Reporter (CI Integration)

Generates XML report compatible with CI/CD systems.

```bash
npm run test:junit
```

View the output:
```bash
cat test-results/results.xml
```

## Advanced Examples

### Multiple Reporters

Run tests with multiple reporters simultaneously:

```bash
npm run test:multiple
```

This generates:
- Console output (list)
- HTML report
- JSON report
- JUnit XML report

View reports:
```bash
npx playwright show-report playwright-report-multiple
cat test-results/results-multiple.json
cat test-results/results-multiple.xml
```

### CI-Optimized Configuration

Run tests with CI-optimized settings:

```bash
npm run test:ci
```

**Includes:**
- Minimal console output (dot)
- HTML report for artifacts
- JUnit XML for dashboards
- JSON for processing
- GitHub Actions annotations (if on GitHub)

### Custom Reporter

Run tests with the custom reporter:

```bash
npm run test:custom
```

**Features:**
- Custom formatted output
- Visual progress bar
- Detailed statistics
- Emoji indicators
- Execution summary

### Slack Reporter

Send test results to Slack:

1. **Set up Slack webhook:**
   - Go to https://api.slack.com/messaging/webhooks
   - Create a webhook for your channel
   - Copy the webhook URL

2. **Set environment variable:**
```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

3. **Run tests:**
```bash
npm run test:custom -- --config=examples/slack-reporter.config.ts
```

### Blob Reports with Sharding

For parallel execution across multiple machines:

1. **Run sharded tests:**

```bash
# Terminal 1 - Shard 1
npx playwright test --shard=1/3 --reporter=blob

# Terminal 2 - Shard 2
npx playwright test --shard=2/3 --reporter=blob

# Terminal 3 - Shard 3
npx playwright test --shard=3/3 --reporter=blob
```

Or use the npm script:
```bash
npm run test:sharded
```

2. **Merge reports:**

```bash
npx playwright merge-reports --reporter html ./blob-report
```

3. **View merged report:**

```bash
npx playwright show-report
```

## Command Line Overrides

You can override the reporter configuration from the command line:

```bash
# Use specific reporter
npx playwright test --reporter=dot
npx playwright test --reporter=html
npx playwright test --reporter=json

# Multiple reporters
npx playwright test --reporter=list --reporter=html

# Specify output file
npx playwright test --reporter=json:custom-results.json
npx playwright test --reporter=junit:custom-junit.xml
```

## Viewing Reports

### HTML Reports

```bash
# View default report
npx playwright show-report

# View specific report folder
npx playwright show-report playwright-report-multiple

# View custom report folder
npx playwright show-report playwright-report-custom
```

### JSON Reports

```bash
# Pretty print JSON
cat test-results/results.json | jq .

# Extract specific data
cat test-results/results.json | jq '.suites[].specs[].title'

# Count passed tests
cat test-results/results.json | jq '[.suites[].specs[].tests[] | select(.status == "passed")] | length'
```

### JUnit XML Reports

```bash
# View XML
cat test-results/results.xml

# Pretty print with xmllint
xmllint --format test-results/results.xml
```

## Common Use Cases

### Local Development

Best for immediate feedback while coding:

```bash
npx playwright test --reporter=list
# or
npx playwright test --reporter=list --reporter=html:open=on-failure
```

### CI/CD Pipelines

Minimal console output + artifact reports:

```bash
CI=true npm run test:ci
```

Upload as artifacts:
- `playwright-report-ci/` - HTML report
- `test-results/junit-results.xml` - JUnit for dashboards
- `test-results/test-results.json` - JSON for processing

### Debugging Failures

Generate detailed HTML report with all artifacts:

```bash
npx playwright test --config=examples/html-only.config.ts
npx playwright show-report playwright-report-html
```

### Parallel Execution (Sharding)

For running tests across multiple machines:

```bash
# Machine 1
npx playwright test --shard=1/4 --reporter=blob

# Machine 2
npx playwright test --shard=2/4 --reporter=blob

# Machine 3
npx playwright test --shard=3/4 --reporter=blob

# Machine 4
npx playwright test --shard=4/4 --reporter=blob

# Merge on main machine
npx playwright merge-reports --reporter html ./blob-report
```

## Environment Variables

Configure reporter behavior with environment variables:

```bash
# Run in CI mode
CI=true npx playwright test

# Set Slack webhook
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."

# Custom report folder
PLAYWRIGHT_HTML_REPORT=my-custom-report npx playwright test
```

## Troubleshooting

### HTML Report Not Opening

Check the `open` configuration:
```typescript
reporter: [['html', { open: 'always' }]]
```

### Reports Not Generated in CI

Ensure correct paths in CI configuration and artifact upload.

### Large Report Files

Reduce artifact capture:
```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
}
```

### Blob Merge Fails

Ensure all shards completed successfully and blob-report directory exists.

## Next Steps

1. **Explore the documentation:**
   - [../README.md](../README.md) - Module overview
   - [../01_reporting_basics.md](../01_reporting_basics.md) - Reporter fundamentals

2. **Try different reporters:**
   - Run tests with each reporter type
   - Compare the outputs
   - Find what works best for your workflow

3. **Customize:**
   - Modify the custom reporter
   - Create your own reporter
   - Integrate with your tools

4. **Integrate with CI:**
   - Set up GitHub Actions workflow
   - Configure artifact uploads
   - Add status badges

## Resources

- [Playwright Test Reporters Documentation](https://playwright.dev/docs/test-reporters)
- [Reporter API Reference](https://playwright.dev/docs/api/class-reporter)
- [CI Integration Guide](https://playwright.dev/docs/ci-intro)

## Support

For questions or issues:
- Check the [../README.md](../README.md) for detailed information
- Review the example configurations in `examples/`
- Consult the Playwright documentation

Happy Testing! 🎭
