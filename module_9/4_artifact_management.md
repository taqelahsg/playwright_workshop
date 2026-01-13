# Lesson 4: Artifact Management

## What are Artifacts?

Artifacts are files produced during CI runs that you want to preserve:

- **HTML Reports** - Test results visualization
- **Screenshots** - Captured on failure
- **Traces** - Detailed debugging information
- **Videos** - Test recordings
- **Coverage reports** - Code coverage data

## Playwright Artifacts

### Configuring Artifact Collection

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Screenshots
    screenshot: 'only-on-failure',

    // Videos
    video: 'retain-on-failure',

    // Traces
    trace: 'on-first-retry',
  },

  // Reporter output
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'junit-results.xml' }],
  ],
});
```

### Artifact Locations

| Artifact | Default Location |
|----------|------------------|
| HTML Report | `playwright-report/` |
| Screenshots | `test-results/` |
| Videos | `test-results/` |
| Traces | `test-results/` |
| JSON Report | `test-results.json` |

## Uploading Artifacts in GitHub Actions

### Basic Upload

```yaml
- name: Upload test report
  uses: actions/upload-artifact@v4
  if: ${{ !cancelled() }}
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

### Multiple Artifacts

```yaml
- name: Upload HTML report
  uses: actions/upload-artifact@v4
  if: ${{ !cancelled() }}
  with:
    name: playwright-report
    path: playwright-report/

- name: Upload test results
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: test-results
    path: test-results/
    retention-days: 7

- name: Upload traces
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: traces
    path: test-results/**/*.zip
    retention-days: 7
```

### Upload with Path Patterns

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: all-artifacts
    path: |
      playwright-report/
      test-results/
      !test-results/**/*.webm  # Exclude videos
```

## Conditional Uploads

### Only on Failure

```yaml
- name: Upload failure artifacts
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: failure-artifacts
    path: test-results/
```

### Always Upload (Even on Cancel)

```yaml
- name: Upload report
  uses: actions/upload-artifact@v4
  if: ${{ !cancelled() }}
  with:
    name: report
    path: playwright-report/
```

### Based on Test Results

```yaml
- name: Run tests
  id: tests
  run: npx playwright test
  continue-on-error: true

- name: Upload report
  uses: actions/upload-artifact@v4
  with:
    name: report-${{ steps.tests.outcome }}
    path: playwright-report/
```

## Artifact Retention

### Setting Retention Days

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: report
    path: playwright-report/
    retention-days: 14  # Keep for 2 weeks
```

### Retention Guidelines

| Artifact Type | Recommended Retention |
|---------------|----------------------|
| HTML Reports | 14-30 days |
| Screenshots | 7 days |
| Videos | 3-7 days |
| Traces | 7 days |
| Blob Reports | 1 day (for merging only) |

## Downloading Artifacts

### In Workflow (Job to Job)

```yaml
jobs:
  test:
    steps:
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        with:
          name: report
          path: playwright-report/

  deploy-report:
    needs: test
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: report
          path: downloaded-report/

      - run: ls downloaded-report/
```

### Download All Artifacts

```yaml
- uses: actions/download-artifact@v4
  with:
    path: all-artifacts/
```

### Download by Pattern

```yaml
- uses: actions/download-artifact@v4
  with:
    pattern: blob-report-*
    path: all-blob-reports/
    merge-multiple: true
```

## Report Types and Usage

### HTML Report

Best for human review:

```typescript
reporter: [['html', { open: 'never' }]],
```

Upload and view in GitHub:

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

### JSON Report

Best for programmatic access:

```typescript
reporter: [['json', { outputFile: 'results.json' }]],
```

Use in subsequent steps:

```yaml
- name: Check results
  run: |
    FAILED=$(jq '.stats.unexpected' results.json)
    echo "Failed tests: $FAILED"
```

### JUnit Report

Best for CI integration:

```typescript
reporter: [['junit', { outputFile: 'results.xml' }]],
```

GitHub Actions understands JUnit:

```yaml
- name: Publish Test Results
  uses: EnricoMi/publish-unit-test-result-action@v2
  if: always()
  with:
    files: results.xml
```

## Trace Viewer

### Collecting Traces

```typescript
use: {
  trace: 'on-first-retry',  // Only on retry
  // trace: 'on',           // Always
  // trace: 'retain-on-failure', // Keep if failed
}
```

### Uploading Traces

```yaml
- name: Upload traces
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: traces
    path: test-results/**/*.zip
```

### Viewing Traces

1. Download artifact from GitHub
2. Extract zip file
3. Open at https://trace.playwright.dev
4. Or use: `npx playwright show-trace trace.zip`

## Screenshots

### Configuration

```typescript
use: {
  screenshot: 'only-on-failure',
  // screenshot: 'on',      // Always
  // screenshot: 'off',     // Never
}
```

### In Tests

```typescript
test('capture screenshot', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'homepage.png' });
});
```

## Videos

### Configuration

```typescript
use: {
  video: 'retain-on-failure',
  // video: 'on',           // Always record
  // video: 'off',          // Never record
}
```

### Upload Videos

```yaml
- name: Upload videos
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: videos
    path: test-results/**/*.webm
    retention-days: 3  # Videos are large
```

## Complete Artifact Workflow

```yaml
name: Playwright Tests with Artifacts

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'

      - run: npm ci
      - run: npx playwright install --with-deps

      - name: Run tests
        run: npx playwright test
        continue-on-error: true

      # Always upload HTML report
      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14

      # Upload failure artifacts only on failure
      - name: Upload failure artifacts
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-failures
          path: |
            test-results/**/*.png
            test-results/**/*.zip
          retention-days: 7

      # Upload JUnit for GitHub integration
      - name: Upload JUnit results
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: junit-results
          path: results.xml

      # Publish test results
      - name: Publish Test Results
        uses: EnricoMi/publish-unit-test-result-action@v2
        if: always()
        with:
          files: results.xml
```

## Best Practices

1. **Use conditional uploads** - Don't upload everything always
2. **Set appropriate retention** - Balance cost vs. debugging needs
3. **Exclude large files** - Videos and traces add up
4. **Use meaningful names** - Include context in artifact names
5. **Compress when possible** - Traces are already zipped
6. **Clean up old artifacts** - GitHub has storage limits

## Summary

| Artifact | When to Upload | Retention |
|----------|----------------|-----------|
| HTML Report | Always | 14-30 days |
| Screenshots | On failure | 7 days |
| Videos | On failure | 3-7 days |
| Traces | On failure | 7 days |
| JUnit XML | Always | 14 days |
| Blob Report | Always (for merge) | 1 day |
