# Lesson 2: GitHub Actions for Playwright

## Overview

GitHub Actions is a CI/CD platform built into GitHub. It's free for public repositories and has generous free minutes for private repos.

## Workflow File Location

```
your-repo/
├── .github/
│   └── workflows/
│       ├── playwright.yml      # Main test workflow
│       └── visual-tests.yml    # Specialized workflow
├── tests/
└── package.json
```

## Basic Workflow Structure

```yaml
name: Playwright Tests          # Workflow name (shows in GitHub UI)

on:                              # Triggers
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:                            # One or more jobs
  test:
    runs-on: ubuntu-latest       # Runner environment
    steps:                       # Sequential steps
      - name: Step name
        run: command
```

## Complete Basic Workflow

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:  # Allow manual trigger

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test
        env:
          CI: true

      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Multi-Browser Testing

### Using Matrix Strategy

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false  # Don't cancel other jobs if one fails
      matrix:
        browser: [chromium, firefox, webkit]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'

      - run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps ${{ matrix.browser }}

      - name: Run tests (${{ matrix.browser }})
        run: npx playwright test --project=${{ matrix.browser }}

      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: report-${{ matrix.browser }}
          path: playwright-report/
```

### Cross-OS Testing

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    browser: [chromium]

runs-on: ${{ matrix.os }}
```

## Handling Test Failures

### Always Upload Artifacts

```yaml
- uses: actions/upload-artifact@v4
  if: ${{ !cancelled() }}  # Upload even if tests fail
  with:
    name: test-results
    path: |
      playwright-report/
      test-results/
```

### Configure Retries

```yaml
- name: Run tests
  run: npx playwright test
  env:
    CI: true
    # Playwright config handles retries
```

In `playwright.config.ts`:

```typescript
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
  },
});
```

## Environment Variables

### Using Secrets

```yaml
- name: Run tests
  run: npx playwright test
  env:
    CI: true
    BASE_URL: ${{ secrets.STAGING_URL }}
    API_KEY: ${{ secrets.API_KEY }}
```

### Setting Variables

```yaml
env:
  NODE_ENV: test

jobs:
  test:
    env:
      BROWSER: chromium

    steps:
      - run: echo "Using ${{ env.BROWSER }}"
```

## Caching

### npm Cache (Built-in)

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 'lts/*'
    cache: 'npm'
```

### Playwright Browser Cache

```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
```

## Job Dependencies

### Sequential Jobs

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  test:
    needs: lint  # Runs after lint completes
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  deploy:
    needs: [lint, test]  # Runs after both complete
    runs-on: ubuntu-latest
    steps:
      - run: npm run deploy
```

### Conditional Jobs

```yaml
jobs:
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main' && success()
    runs-on: ubuntu-latest
```

## Workflow Triggers

### On Push

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'tests/**'
    paths-ignore:
      - '**.md'
```

### On Pull Request

```yaml
on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]
```

### Scheduled

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

### Manual Trigger

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to test'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
```

## Concurrency Control

### Cancel Previous Runs

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## Notifications

### Slack Notification

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Tests failed on ${{ github.ref }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### PR Comment

```yaml
- name: Comment on PR
  if: failure() && github.event_name == 'pull_request'
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: 'Tests failed. Check the workflow run for details.'
      })
```

## Job Summary

```yaml
- name: Add summary
  run: |
    echo "## Test Results" >> $GITHUB_STEP_SUMMARY
    echo "- Tests: Passed" >> $GITHUB_STEP_SUMMARY
    echo "- Browser: ${{ matrix.browser }}" >> $GITHUB_STEP_SUMMARY
```

## Best Practices

1. **Use `npm ci`** instead of `npm install` for reproducible builds
2. **Cache dependencies** to speed up workflows
3. **Set timeouts** to prevent hanging jobs
4. **Use `fail-fast: false`** for matrix to see all failures
5. **Upload artifacts** with `if: ${{ !cancelled() }}`
6. **Use secrets** for sensitive data
7. **Add concurrency control** to avoid wasted runs

## Next Steps

In the next lesson, we'll explore test sharding for faster execution.
