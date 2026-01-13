# Lesson 1: CI/CD Fundamentals for Testing

## What is CI/CD?

**Continuous Integration (CI)** is the practice of automatically running tests and checks whenever code changes are pushed.

**Continuous Deployment/Delivery (CD)** extends this to automatically deploy code that passes all checks.

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Push   │ -> │  Build  │ -> │  Test   │ -> │ Deploy  │
│  Code   │    │         │    │         │    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
                    CI                            CD
```

## Why CI/CD for Test Automation?

### Benefits

| Benefit | Description |
|---------|-------------|
| **Consistency** | Same tests run every time |
| **Early Detection** | Catch bugs before merge |
| **Confidence** | Green build = deployable code |
| **Documentation** | Test history as project record |
| **Speed** | Parallel execution on powerful machines |

### Common Pain Points Solved

- "It works on my machine" - Tests run in consistent environment
- Forgetting to run tests - Automated on every push
- Long test times - Parallel execution across machines
- Lost test reports - Artifacts stored automatically

## CI/CD Platforms

### Popular Options

| Platform | Best For | Features |
|----------|----------|----------|
| **GitHub Actions** | GitHub repos | Free minutes, great integration |
| **Jenkins** | Self-hosted | Highly customizable |
| **CircleCI** | Any repo | Fast, good caching |
| **Azure DevOps** | Microsoft stack | Enterprise features |

### This Module Covers

- GitHub Actions

## Key Concepts

### 1. Workflows/Pipelines

A workflow defines what happens when code changes:

```yaml
# .github/workflows/tests.yml
name: Tests
on: [push, pull_request]  # Triggers

jobs:
  test:                    # Job name
    runs-on: ubuntu-latest # Environment
    steps:                 # What to do
      - run: npm test
```

### 2. Jobs

Jobs are units of work that run on separate machines:

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]

  test:
    runs-on: ubuntu-latest
    needs: lint  # Run after lint
    steps: [...]
```

### 3. Steps

Steps are individual commands within a job:

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4

  - name: Install dependencies
    run: npm ci

  - name: Run tests
    run: npm test
```

### 4. Triggers

When workflows run:

```yaml
on:
  push:
    branches: [main]     # Push to main
  pull_request:
    branches: [main]     # PRs to main
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:     # Manual trigger
```

### 5. Matrix Strategy

Run same job with different configurations:

```yaml
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
    os: [ubuntu-latest, windows-latest]

steps:
  - run: npx playwright test --project=${{ matrix.browser }}
```

### 6. Artifacts

Files saved from workflow runs:

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: test-report
    path: playwright-report/
    retention-days: 30
```

## Playwright in CI

### Key Requirements

1. **Install browsers** - `npx playwright install --with-deps`
2. **Run headless** - Default in CI (no display)
3. **Handle failures** - Retries, traces, screenshots
4. **Upload artifacts** - Reports for debugging

### Basic CI Configuration

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run tests
        run: npx playwright test

      - name: Upload report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Playwright Config for CI

```typescript
// playwright.config.ts
export default defineConfig({
  // Fail fast in CI
  forbidOnly: !!process.env.CI,

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Parallel workers
  workers: process.env.CI ? 1 : undefined,

  // Traces for debugging
  use: {
    trace: 'on-first-retry',
  },
});
```

## Best Practices

### 1. Fast Feedback

```yaml
# Run smoke tests first, fail fast
jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - run: npx playwright test --grep @smoke

  full:
    needs: smoke  # Only run if smoke passes
    steps:
      - run: npx playwright test
```

### 2. Caching Dependencies

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 'lts/*'
    cache: 'npm'  # Cache node_modules
```

### 3. Appropriate Timeouts

```yaml
jobs:
  test:
    timeout-minutes: 60  # Don't hang forever
```

### 4. Clear Job Names

```yaml
jobs:
  test-chromium:
    name: "Tests (Chromium)"

  test-firefox:
    name: "Tests (Firefox)"
```

### 5. Conditional Execution

```yaml
- name: Upload report
  if: always()  # Even if tests fail

- name: Deploy
  if: github.ref == 'refs/heads/main'  # Only on main
```

## Next Steps

In the next lesson, we'll dive deep into GitHub Actions configuration for Playwright.
