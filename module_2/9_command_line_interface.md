# Playwright Command Line Interface (CLI)

## Overview

Playwright's Command Line Interface provides powerful tools for running tests, debugging, generating code, and managing your testing workflow. The CLI is your primary interface for executing tests locally, in CI/CD pipelines, and for development tasks like code generation and trace analysis.

## Table of Contents

1. [Running Tests](#running-tests)
2. [Test Filtering](#test-filtering)
3. [CLI Options](#cli-options)
4. [Debugging Tests](#debugging-tests)
5. [Code Generation](#code-generation)
6. [Viewing Reports](#viewing-reports)
7. [Trace Viewer](#trace-viewer)
8. [Browser Management](#browser-management)
9. [Advanced Usage](#advanced-usage)
10. [Best Practices](#best-practices)

---

## Running Tests

### Basic Test Execution

**Run all tests:**
```bash
npx playwright test
```

**Run a specific test file:**
```bash
npx playwright test tests/login.spec.ts
```

**Run multiple test files:**
```bash
npx playwright test tests/login.spec.ts tests/checkout.spec.ts
```

**Run tests in a directory:**
```bash
npx playwright test tests/auth/
```

### Running in Different Modes

**Headed mode (show browser):**
```bash
npx playwright test --headed
```

**UI mode (interactive):**
```bash
npx playwright test --ui
```

**Debug mode:**
```bash
npx playwright test --debug
```

**Watch mode (re-run on file changes):**
```bash
npx playwright test --watch
```

---

## Test Filtering

### Filter by Test Name

**Using grep pattern:**
```bash
npx playwright test --grep "login"
```

**Using shorthand:**
```bash
npx playwright test -g "login"
```

**Multiple patterns (OR):**
```bash
npx playwright test --grep "login|signup"
```

**Exclude tests (inverse grep):**
```bash
npx playwright test --grep-invert "slow"
```

**Combine grep and grep-invert:**
```bash
npx playwright test --grep "checkout" --grep-invert "slow"
```

### Filter by Tags

**Run tests with specific tag:**
```bash
npx playwright test --grep @smoke
```

**Multiple tags (OR):**
```bash
npx playwright test --grep "@smoke|@regression"
```

**Multiple tags (AND):**
```bash
npx playwright test --grep "(?=.*@smoke)(?=.*@critical)"
```

**Exclude specific tags:**
```bash
npx playwright test --grep-invert @slow
```

### Filter by Project

**Run specific browser project:**
```bash
npx playwright test --project=chromium
```

**Multiple projects:**
```bash
npx playwright test --project=chromium --project=firefox
```

---

## CLI Options

### Parallelization

**Control number of workers:**
```bash
npx playwright test --workers=4
```

**Run tests sequentially:**
```bash
npx playwright test --workers=1
```

**Use percentage of CPU cores:**
```bash
npx playwright test --workers=50%
```

### Retries

**Set retry count:**
```bash
npx playwright test --retries=2
```

**Disable retries:**
```bash
npx playwright test --retries=0
```

### Timeouts

**Set global timeout:**
```bash
npx playwright test --timeout=60000
```

**Set maximum time for entire test run:**
```bash
npx playwright test --global-timeout=3600000
```

### Reporters

**Use specific reporter:**
```bash
npx playwright test --reporter=html
```

**Multiple reporters:**
```bash
npx playwright test --reporter=html --reporter=json
```

**Available reporters:**
- `list` (default for terminal)
- `line` (single line per test)
- `dot` (minimal output)
- `html` (interactive HTML report)
- `json` (JSON output)
- `junit` (JUnit XML format)
- `github` (GitHub Actions annotations)

**Example with multiple reporters:**
```bash
npx playwright test --reporter=list,html,json
```

### Output Options

**Set output directory:**
```bash
npx playwright test --output=./test-results
```

**Quiet mode (less output):**
```bash
npx playwright test --quiet
```

**Repeat each test:**
```bash
npx playwright test --repeat-each=3
```

### Update Snapshots

**Update all snapshots:**
```bash
npx playwright test --update-snapshots
```

**Shorthand:**
```bash
npx playwright test -u
```

---

## Debugging Tests

### Debug Mode

**Debug all tests:**
```bash
npx playwright test --debug
```

**Debug specific test:**
```bash
npx playwright test tests/login.spec.ts --debug
```

**Debug with grep:**
```bash
npx playwright test --debug -g "user login"
```

### Stepping Through Tests

When in debug mode:
- **Step over:** Execute next line
- **Step into:** Enter function call
- **Step out:** Exit current function
- **Continue:** Resume execution
- **Pause:** Pause on next statement

### Inspector Features

The Playwright Inspector provides:
- **Locator picker:** Click to generate locators
- **Step through:** Execute test step by step
- **Source code:** View test code with highlighting
- **Call stack:** See execution path
- **Console:** View logs and errors

---

## Code Generation

### Codegen Command

**Start recording from URL:**
```bash
npx playwright codegen https://example.com
```

**Generate code without starting URL:**
```bash
npx playwright codegen
```

### Codegen Options

**Save to file:**
```bash
npx playwright codegen -o tests/new-test.spec.ts https://example.com
```

**Target specific browser:**
```bash
npx playwright codegen --browser=firefox https://example.com
```

**Set viewport size:**
```bash
npx playwright codegen --viewport-size=1280,720 https://example.com
```

**Use specific device:**
```bash
npx playwright codegen --device="iPhone 13" https://example.com
```

**Specify language:**
```bash
npx playwright codegen --target=python https://example.com
```

**Available targets:**
- `javascript` (default)
- `python`
- `python-async`
- `java`
- `csharp`

### Recording Features

During code generation:
- **Record:** Click and interact with the page
- **Pause:** Stop recording to manually inspect
- **Resume:** Continue recording
- **Copy:** Copy generated code to clipboard
- **Clear:** Clear recorded actions

---

## Viewing Reports

### Show Report

**View HTML report:**
```bash
npx playwright show-report
```

**Specify report location:**
```bash
npx playwright show-report playwright-report/
```

**Custom port:**
```bash
npx playwright show-report --port=9323
```

### Report Features

The HTML report includes:
- **Test results:** Pass/fail status for all tests
- **Error details:** Stack traces and error messages
- **Screenshots:** Visual snapshots on failure
- **Videos:** Recorded test execution
- **Traces:** Detailed execution timeline
- **Filtering:** Filter by status, project, file
- **Search:** Find specific tests quickly

---

## Trace Viewer

### Show Trace

**View trace file:**
```bash
npx playwright show-trace trace.zip
```

**Multiple traces:**
```bash
npx playwright show-trace trace1.zip trace2.zip
```

### Trace Viewer Features

Explore test execution with:
- **Timeline:** Visual representation of actions
- **Screenshots:** Before/after each action
- **DOM snapshots:** Inspect page state at any point
- **Network:** View all network requests
- **Console:** See console logs
- **Source:** View test code
- **Call stack:** Execution path
- **Actions log:** Detailed action list

### Enabling Traces

**Enable in playwright.config.ts:**
```typescript
export default defineConfig({
  use: {
    trace: 'on-first-retry', // 'on' | 'off' | 'retain-on-failure'
  },
});
```

**Via CLI:**
```bash
npx playwright test --trace on
```

---

## Browser Management

### Install Browsers

**Install all browsers:**
```bash
npx playwright install
```

**Install specific browser:**
```bash
npx playwright install chromium
```

**Install multiple browsers:**
```bash
npx playwright install chromium firefox
```

**Install with dependencies:**
```bash
npx playwright install --with-deps
```

**Install system dependencies only:**
```bash
npx playwright install-deps
```

### Browser Information

**List installed browsers:**
```bash
npx playwright --version
```

### Clear Cache

**Clear browser cache:**
```bash
npx playwright clear-cache
```

---

## Advanced Usage

### Configuration File

**Use specific config file:**
```bash
npx playwright test --config=playwright.custom.config.ts
```

**Pass config options:**
```bash
npx playwright test --config=./e2e/config.ts
```

### Environment Variables

**Set environment variable:**
```bash
CI=true npx playwright test
```

**Multiple variables:**
```bash
ENV=staging API_URL=https://staging.api.com npx playwright test
```

### List Tests

**List all tests without running:**
```bash
npx playwright test --list
```

**List with specific filter:**
```bash
npx playwright test --list --grep @smoke
```

### Sharding (Parallel CI)

**Run tests in shards:**
```bash
# Shard 1 of 3
npx playwright test --shard=1/3

# Shard 2 of 3
npx playwright test --shard=2/3

# Shard 3 of 3
npx playwright test --shard=3/3
```

**Use in CI/CD:**
```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3]
    steps:
      - run: npx playwright test --shard=${{ matrix.shard }}/3
```

### Merge Reports

**Merge sharded reports:**
```bash
npx playwright merge-reports --reporter=html ./all-blob-reports
```

**Generate different report format:**
```bash
npx playwright merge-reports --reporter=html,json ./all-blob-reports
```

### Last Failed

**Run only previously failed tests:**
```bash
npx playwright test --last-failed
```

### Pass Through Arguments

**Pass arguments to test:**
```bash
npx playwright test -- --my-custom-arg=value
```

Access in test:
```typescript
test('example', async ({ page }) => {
  const customArg = process.env.npm_config_my_custom_arg;
});
```

---

## Best Practices

### 1. Use Specific Commands for Development

**During development:**
```bash
# Focus on specific tests
npx playwright test --headed -g "login" --project=chromium

# Debug failing test
npx playwright test --debug tests/failing-test.spec.ts

# Use UI mode for exploration
npx playwright test --ui
```

### 2. Optimize CI/CD Execution

**In CI pipelines:**
```bash
# Run with multiple workers
npx playwright test --workers=4

# Use sharding for large test suites
npx playwright test --shard=1/4

# Generate appropriate reports
npx playwright test --reporter=html,github
```

### 3. Use Tags for Flexible Filtering

**Organize with tags:**
```bash
# Smoke tests
npx playwright test --grep @smoke

# Critical tests in specific browser
npx playwright test --grep @critical --project=chromium
```

### 4. Leverage Trace for Debugging

**Capture traces on failure:**
```bash
npx playwright test --trace on-first-retry
```

**Review traces:**
```bash
npx playwright show-trace trace.zip
```

### 5. Generate Code as Starting Point

**Use codegen for quick start:**
```bash
npx playwright codegen https://yourapp.com
```

Then refine and improve generated code.

### 6. Monitor Test Performance

**Run with timing info:**
```bash
npx playwright test --reporter=list
```

Review slow tests and optimize.

### 7. Keep Browsers Updated

**Regular updates:**
```bash
npx playwright install
```

Ensures compatibility with latest features.

### 8. Use Config Files for Consistency

**Avoid overriding config via CLI:**
```bash
# Instead of
npx playwright test --timeout=60000 --retries=2

# Define in playwright.config.ts and use
npx playwright test
```

### 9. Combine Filters Effectively

**Efficient filtering:**
```bash
# Run smoke tests, exclude slow ones, specific browser
npx playwright test --grep @smoke --grep-invert @slow --project=chromium
```

### 10. Document Common Commands

Create a project README or scripts:
```json
{
  "scripts": {
    "test": "playwright test",
    "test:smoke": "playwright test --grep @smoke",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "report": "playwright show-report"
  }
}
```

---

## Summary

The Playwright CLI provides comprehensive tools for:
- **Running tests** with various filters and options
- **Debugging** with inspector and debug mode
- **Generating code** with interactive recording
- **Viewing reports** with rich HTML interface
- **Analyzing traces** with detailed timeline viewer
- **Managing browsers** with install and update commands
- **Optimizing CI/CD** with sharding and parallel execution

Master these CLI commands to streamline your testing workflow and maximize productivity.

For more information, visit the [official Playwright CLI documentation](https://playwright.dev/docs/test-cli).
