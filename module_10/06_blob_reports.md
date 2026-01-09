# Blob Reports and Sharding

Learn how to use blob reports to merge test results from sharded or distributed test execution.

## What are Blob Reports?

**Blob reports** are Playwright's solution for combining test results from multiple test runs into a single unified report.

### The Problem

When running tests in parallel across multiple machines (sharding), each machine generates its own report:

```
Machine 1: Shard 1/3 → HTML Report 1
Machine 2: Shard 2/3 → HTML Report 2
Machine 3: Shard 3/3 → HTML Report 3
```

**Issue:** You end up with 3 separate reports instead of 1 combined report.

### The Solution

Blob reports act as an intermediate format:

```
Machine 1: Shard 1/3 → Blob Report 1 ┐
Machine 2: Shard 2/3 → Blob Report 2 ├─→ Merge → Final HTML Report
Machine 3: Shard 3/3 → Blob Report 3 ┘
```

Blob reports contain all test data in a compact format that can be merged later.

## When to Use Blob Reports

✅ **Use blob reports when:**
- Running tests with `--shard` option
- Distributing tests across multiple CI workers
- Running tests on multiple machines
- Using CI matrix builds
- Need to combine results from parallel runs

❌ **Don't need blob reports when:**
- Running tests on a single machine
- Using Playwright's built-in parallelization (workers)
- Not sharding tests

## How Blob Reports Work

### Step 1: Generate Blob Reports

Each test shard generates a blob report:

```bash
# Shard 1
npx playwright test --shard=1/3 --reporter=blob

# Shard 2
npx playwright test --shard=2/3 --reporter=blob

# Shard 3
npx playwright test --shard=3/3 --reporter=blob
```

**Output:**
```
blob-report/
├── report-1-of-3.zip
├── report-2-of-3.zip
└── report-3-of-3.zip
```

### Step 2: Collect Blob Reports

Gather all blob reports into a single directory (done automatically in same directory, or via CI artifacts).

### Step 3: Merge Reports

Merge blob reports into final format:

```bash
npx playwright merge-reports --reporter html ./blob-report
```

**Output:**
```
playwright-report/
├── index.html
├── data/
└── trace/
```

## Basic Configuration

### playwright.config.ts

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: process.env.CI ? 'blob' : 'html',
});
```

**Explanation:**
- In CI: Generate blob reports for merging
- Locally: Use HTML directly (no sharding)

### Running Sharded Tests Locally

```bash
# Terminal 1
npx playwright test --shard=1/2 --reporter=blob

# Terminal 2
npx playwright test --shard=2/2 --reporter=blob

# Merge reports
npx playwright merge-reports --reporter html ./blob-report
```

## GitHub Actions Example

### Complete Workflow

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test --shard=${{ matrix.shard }}/4

      - name: Upload blob report to GitHub Actions Artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: blob-report-${{ matrix.shard }}
          path: blob-report
          retention-days: 1

  merge-reports:
    # Merge reports after all tests complete
    if: always()
    needs: [test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Download blob reports from GitHub Actions Artifacts
        uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-report-*
          merge-multiple: true

      - name: Merge into HTML Report
        run: npx playwright merge-reports --reporter html ./all-blob-reports

      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        with:
          name: html-report--attempt-${{ github.run_attempt }}
          path: playwright-report
          retention-days: 14
```

### Key Points

**Test Job:**
- `matrix: { shard: [1, 2, 3, 4] }` - Run 4 parallel shards
- Each shard uploads its blob report as artifact
- `blob-report-1`, `blob-report-2`, etc.

**Merge Job:**
- `needs: [test]` - Waits for all test jobs
- `if: always()` - Runs even if tests fail
- Downloads all blob artifacts
- Merges into single HTML report
- Uploads final HTML report

## GitLab CI Example

```yaml
stages:
  - test
  - merge

variables:
  PLAYWRIGHT_BROWSERS_PATH: 0

# Test stage - runs in parallel
test:
  stage: test
  image: mcr.microsoft.com/playwright:latest
  parallel: 3
  script:
    - npm ci
    - npx playwright test --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
  artifacts:
    when: always
    paths:
      - blob-report/
    expire_in: 1 hour

# Merge stage - combines results
merge:
  stage: merge
  image: mcr.microsoft.com/playwright:latest
  when: always
  script:
    - npm ci
    - npx playwright merge-reports --reporter html ./blob-report
  artifacts:
    when: always
    paths:
      - playwright-report/
    expire_in: 1 week
```

**Explanation:**
- `parallel: 3` - GitLab runs 3 parallel jobs
- `$CI_NODE_INDEX/$CI_NODE_TOTAL` - GitLab provides shard numbers
- Each test job saves blob report
- Merge job combines all blob reports

## Jenkins Example

```groovy
pipeline {
  agent any

  stages {
    stage('Test') {
      parallel {
        stage('Shard 1') {
          steps {
            sh 'npx playwright test --shard=1/3 --reporter=blob'
          }
        }
        stage('Shard 2') {
          steps {
            sh 'npx playwright test --shard=2/3 --reporter=blob'
          }
        }
        stage('Shard 3') {
          steps {
            sh 'npx playwright test --shard=3/3 --reporter=blob'
          }
        }
      }
    }

    stage('Merge Reports') {
      steps {
        sh 'npx playwright merge-reports --reporter html ./blob-report'
      }
    }
  }

  post {
    always {
      publishHTML([
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        reportName: 'Playwright Report',
        keepAll: true
      ])
    }
  }
}
```

## Merging to Multiple Formats

### HTML + JSON + JUnit

```bash
npx playwright merge-reports \
  --reporter html \
  --reporter json \
  --reporter junit \
  ./blob-report
```

**Generates:**
```
playwright-report/    # HTML
test-results.json     # JSON
results.xml          # JUnit
```

### With Options

```bash
npx playwright merge-reports \
  --reporter html \
  --reporter json:results.json \
  --reporter junit:junit-results.xml \
  ./blob-report
```

### In GitHub Actions

```yaml
- name: Merge into multiple formats
  run: |
    npx playwright merge-reports \
      --reporter html \
      --reporter json:results.json \
      --reporter junit:junit-results.xml \
      ./all-blob-reports

- name: Upload HTML report
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report

- name: Upload JSON report
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: results.json

- name: Publish test results
  uses: EnricoMi/publish-unit-test-result-action@v2
  with:
    files: junit-results.xml
```

## Advanced Sharding Strategies

### By Test Files

```bash
# Automatically split by test files
npx playwright test --shard=1/3
npx playwright test --shard=2/3
npx playwright test --shard=3/3
```

Playwright automatically distributes test files across shards.

### By Project

```bash
# Shard within specific project
npx playwright test --project=chromium --shard=1/2
npx playwright test --project=chromium --shard=2/2
```

### Dynamic Sharding

```yaml
# GitHub Actions - dynamic based on test count
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4, 5, 6, 7, 8]  # 8 shards
    steps:
      - run: npx playwright test --shard=${{ matrix.shard }}/8
```

### Conditional Sharding

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: process.env.SHARD ? 'blob' : 'html',
});
```

```bash
# With sharding
SHARD=true npx playwright test --shard=1/3

# Without sharding
npx playwright test
```

## Blob Report Storage

### Default Location

```
blob-report/
├── report-1-of-3.zip
├── report-2-of-3.zip
└── report-3-of-3.zip
```

### Custom Location

```bash
# Set custom output directory
PLAYWRIGHT_BLOB_OUTPUT_DIR=./my-blobs npx playwright test --reporter=blob
```

### Cleanup

```bash
# Remove blob reports after merging
npx playwright merge-reports --reporter html ./blob-report
rm -rf blob-report/
```

## Blob Report Structure

Each blob report contains:
- Test results
- Test metadata
- Attachments (screenshots, videos, traces)
- Configuration info
- Timing data

**Format:** Compressed ZIP file
**Contents:** JSON + binary attachments

## Troubleshooting

### Issue: Merge fails with "No reports found"

**Cause:** Blob reports not in expected location

**Solution:**
```bash
# Verify blob reports exist
ls -la blob-report/

# Check correct path
npx playwright merge-reports --reporter html ./blob-report
```

### Issue: Missing test results in merged report

**Cause:** Not all blob reports collected

**Solution:** Ensure all shard jobs complete
```yaml
# GitHub Actions
merge-reports:
  needs: [test]  # Wait for all test jobs
  if: always()   # Run even if tests fail
```

### Issue: Duplicate test results

**Cause:** Same blob report uploaded multiple times

**Solution:** Use unique artifact names
```yaml
- uses: actions/upload-artifact@v4
  with:
    name: blob-report-${{ matrix.shard }}  # Unique per shard
    path: blob-report
```

### Issue: Blob reports too large

**Cause:** Too many attachments (screenshots, videos, traces)

**Solution:** Reduce artifact capture
```typescript
use: {
  screenshot: 'only-on-failure',  // Not 'on'
  video: 'retain-on-failure',     // Not 'on'
  trace: 'on-first-retry'         // Not 'on'
}
```

### Issue: Artifacts not downloading in CI

**Cause:** Incorrect download configuration

**Solution:**
```yaml
- uses: actions/download-artifact@v4
  with:
    path: all-blob-reports
    pattern: blob-report-*      # Match all blob reports
    merge-multiple: true        # Merge into single directory
```

## Performance Considerations

### Optimal Shard Count

**Guidelines:**
- **Small suites (< 50 tests):** 2-3 shards
- **Medium suites (50-200 tests):** 4-6 shards
- **Large suites (200+ tests):** 8-10 shards

**Formula:** Number of shards ≈ Total duration / 10 minutes

### Example

```
Total suite duration: 45 minutes
Optimal shards: 45 / 10 = ~5 shards
Result: ~9 minutes per shard
```

### Balancing Shards

Playwright automatically balances shards by test files. Ensure tests are evenly distributed:

```bash
# Good - balanced test files
tests/
├── auth/        # 5 tests, 2 min
├── checkout/    # 5 tests, 2 min
└── profile/     # 5 tests, 2 min

# Less ideal - unbalanced
tests/
├── auth/        # 2 tests, 1 min
├── checkout/    # 13 tests, 8 min  ← Will slow down one shard
└── profile/     # 2 tests, 1 min
```

## Best Practices

### 1. **Use Blob Reports Only When Sharding**

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: process.env.CI && process.env.SHARD
    ? 'blob'
    : 'html'
});
```

### 2. **Set Short Retention for Blob Reports**

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: blob-report-${{ matrix.shard }}
    path: blob-report
    retention-days: 1  # Short retention - only needed for merge
```

### 3. **Always Merge, Even on Failure**

```yaml
merge-reports:
  if: always()  # Run even if tests fail
  needs: [test]
```

### 4. **Clean Up Blob Reports**

```yaml
- name: Merge reports
  run: npx playwright merge-reports --reporter html ./all-blob-reports

- name: Clean up blob reports
  run: rm -rf all-blob-reports/
```

### 5. **Use Descriptive Artifact Names**

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: html-report--attempt-${{ github.run_attempt }}
    path: playwright-report
```

Includes run attempt number for retry identification.

## Complete Example: Sharded CI Pipeline

```yaml
name: Playwright Tests with Sharding
on: [push, pull_request]

jobs:
  test:
    name: Test (Shard ${{ matrix.shard }})
    timeout-minutes: 10
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Cache node modules
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run tests
        run: npx playwright test --shard=${{ matrix.shard }}/4

      - name: Upload blob report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: blob-report-${{ matrix.shard }}
          path: blob-report
          retention-days: 1

  merge-reports:
    name: Merge Reports
    if: always()
    needs: [test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Download all blob reports
        uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-report-*
          merge-multiple: true

      - name: Merge to HTML
        run: npx playwright merge-reports --reporter html ./all-blob-reports

      - name: Merge to JSON
        run: npx playwright merge-reports --reporter json:results.json ./all-blob-reports

      - name: Merge to JUnit
        run: npx playwright merge-reports --reporter junit:junit-results.xml ./all-blob-reports

      - name: Upload HTML report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
          retention-days: 14

      - name: Upload JSON report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: results.json
          retention-days: 14

      - name: Publish test results
        if: always()
        uses: EnricoMi/publish-unit-test-result-action@v2
        with:
          files: junit-results.xml

      - name: Comment PR with report link
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('results.json', 'utf8'));
            const summary = `## Test Results\n✅ Passed: ${results.stats.expected}\n❌ Failed: ${results.stats.unexpected}\n🔄 Flaky: ${results.stats.flaky}`;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: summary
            });
```

## Summary

**Blob Reports:**
- ✅ Essential for sharded test execution
- ✅ Combine results from multiple machines
- ✅ Preserve all test data and attachments
- ✅ Merge into any report format
- ✅ Compact storage format

**Best Practices:**
- 🎯 Use only when sharding tests
- 🎯 Short retention for blob artifacts
- 🎯 Always merge reports, even on failure
- 🎯 Clean up after merging
- 🎯 Optimal shard count for performance

## Next Steps

Now you understand blob reports and sharding:
1. Learn to create custom reporters → [Custom Reporters](07_custom_reporters.md)
2. Implement sharding in your CI pipeline
3. Optimize shard count for your test suite
