# Introduction to Test Reporting

## What is Test Reporting?

**Test reporting** is the process of documenting, presenting, and analyzing test execution results. Good test reports help teams:

- 📊 **Track test execution status** - Which tests passed, failed, or were skipped
- 🔍 **Debug failures quickly** - Screenshots, videos, traces, and error messages
- 📈 **Monitor test trends** - Track flakiness and performance over time
- 🤝 **Communicate results** - Share outcomes with stakeholders
- 🔄 **Integrate with CI/CD** - Automate build decisions based on test results

## Why Test Reporting Matters

### 1. **Immediate Feedback**
```bash
npx playwright test

Running 45 tests using 5 workers
  ✓ [chromium] › login.spec.ts:12:5 › should login successfully (2.3s)
  ✓ [chromium] › login.spec.ts:24:5 › should show error for invalid credentials (1.8s)
  ✗ [chromium] › checkout.spec.ts:15:5 › should complete checkout (5.2s)

1 failed
  [chromium] › checkout.spec.ts:15:5 › should complete checkout
44 passed (23.4s)
```

Real-time feedback helps developers identify issues immediately during test runs.

### 2. **Detailed Failure Analysis**

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Expected: visible
Received: hidden

Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('.checkout-button')
  - locator resolved to hidden <button class="checkout-button">...</button>
```

Rich error messages with stack traces and screenshots help debug failures faster.

### 3. **Historical Tracking**

Track test health over time:
- Which tests are flaky?
- Which tests are consistently slow?
- Are test failures increasing or decreasing?
- How does test coverage change?

### 4. **CI/CD Integration**

```yaml
# GitHub Actions example
- name: Run tests
  run: npx playwright test
- name: Upload report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

Automated test reports integrate with build pipelines to:
- Block merges on test failures
- Generate test result badges
- Notify teams of failures
- Track quality metrics

## Types of Test Reports

### 1. **Console Reports**

Real-time output shown in the terminal during test execution.

**Characteristics:**
- ✅ Immediate feedback
- ✅ No additional files created
- ✅ Good for local development
- ❌ Not persistent
- ❌ Hard to share with others

**Example:**
```
Running 10 tests using 2 workers
  ✓ test-1.spec.ts:5:1 › should work (1.2s)
  ✓ test-2.spec.ts:8:1 › should also work (0.9s)
```

### 2. **File-Based Reports**

Reports saved to disk that can be shared and archived.

**Characteristics:**
- ✅ Persistent and shareable
- ✅ Can be viewed later
- ✅ Support rich formatting
- ✅ Good for CI/CD
- ⚠️ Require storage management

**Types:**
- HTML (interactive web pages)
- JSON (machine-readable)
- XML/JUnit (standard format)

### 3. **Real-Time vs Final Reports**

**Real-time reports:**
- Show progress as tests run
- Update continuously
- Examples: list, line, dot reporters

**Final reports:**
- Generated after all tests complete
- Include summary and statistics
- Examples: HTML, JSON, JUnit

## Playwright's Built-in Reporters

Playwright includes **7 built-in reporters** out of the box:

### 1. **List Reporter** (Default for local)
```typescript
reporter: 'list'
```

Shows one line per test with detailed progress.

**Best for:** Local development
**Output:** Console

```
Running 45 tests using 5 workers

  ✓ [chromium] › auth/login.spec.ts:12:5 › user login (2.1s)
  ✓ [chromium] › auth/login.spec.ts:24:5 › user logout (1.3s)
  ✓ [firefox] › auth/login.spec.ts:12:5 › user login (2.5s)
```

### 2. **Line Reporter**
```typescript
reporter: 'line'
```

Uses a single line that updates continuously - very concise.

**Best for:** Large test suites
**Output:** Console

```
Running 45 tests using 5 workers
  [42/45] auth/login.spec.ts - user logout (1.3s)
```

### 3. **Dot Reporter** (Default for CI)
```typescript
reporter: 'dot'
```

Shows single character per test: `·` for pass, `F` for fail.

**Best for:** CI pipelines
**Output:** Console

```
··········F··············································
45 tests
  44 passed (23.4s)
  1 failed
```

### 4. **HTML Reporter**
```typescript
reporter: 'html'
```

Generates interactive web-based report with screenshots and videos.

**Best for:** Detailed failure analysis
**Output:** HTML files (self-contained folder)

Features:
- Interactive filtering
- Screenshot/video viewer
- Trace integration
- Error stack traces
- Duration analysis

### 5. **JSON Reporter**
```typescript
reporter: [['json', { outputFile: 'results.json' }]]
```

Outputs machine-readable JSON with all test results.

**Best for:** Automation and custom processing
**Output:** JSON file

```json
{
  "suites": [...],
  "tests": [
    {
      "title": "should login successfully",
      "status": "passed",
      "duration": 2300,
      "errors": []
    }
  ]
}
```

### 6. **JUnit Reporter**
```typescript
reporter: [['junit', { outputFile: 'results.xml' }]]
```

Generates JUnit-style XML report for CI integration.

**Best for:** CI/CD systems, test management tools
**Output:** XML file

```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="auth/login.spec.ts" tests="2" failures="0">
    <testcase name="should login successfully" time="2.3" />
  </testsuite>
</testsuites>
```

### 7. **GitHub Actions Reporter**
```typescript
reporter: 'github'
```

Provides automatic failure annotations in GitHub Actions.

**Best for:** GitHub Actions CI
**Output:** GitHub annotations

Shows failures directly in:
- Pull request checks
- Commit status
- Workflow summary

### 8. **Blob Reporter**
```typescript
reporter: 'blob'
```

Generates blob reports for merging sharded test results.

**Best for:** Distributed/sharded test execution
**Output:** Binary blob files

Workflow:
1. Run tests on multiple machines with blob reporter
2. Collect all blob reports
3. Merge into final HTML/JSON report

## When to Use Each Reporter

### Local Development

**Recommended:** `list` or `list + html`

```typescript
reporter: [
  ['list'],
  ['html', { open: 'on-failure' }]
]
```

Why:
- Immediate console feedback
- Detailed HTML report on failures
- Easy debugging with screenshots

### CI Pipelines

**Recommended:** `dot + html + junit`

```typescript
reporter: [
  ['dot'],                                  // Minimal console output
  ['html', { outputFolder: 'playwright-report' }],
  ['junit', { outputFile: 'results.xml' }]
]
```

Why:
- Minimal console clutter
- HTML report for debugging
- JUnit XML for build integration

### Large Test Suites

**Recommended:** `line` or `dot`

```typescript
reporter: 'line'  // or 'dot'
```

Why:
- Minimal output
- Quick overview of progress
- Less scrolling

### Automation and Analytics

**Recommended:** `json`

```typescript
reporter: [
  ['list'],
  ['json', { outputFile: 'results.json' }]
]
```

Why:
- Machine-readable format
- Easy to parse and analyze
- Custom dashboard integration

### Sharded Tests

**Recommended:** `blob`

```typescript
reporter: 'blob'
```

Why:
- Merges results from multiple shards
- Preserves all test data
- Generates combined final report

## Reporter Configuration Basics

### Single Reporter

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'html'
});
```

### Multiple Reporters

```typescript
export default defineConfig({
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results.json' }]
  ]
});
```

### Environment-Based Configuration

```typescript
export default defineConfig({
  reporter: process.env.CI
    ? [['dot'], ['html']]
    : [['list'], ['html', { open: 'on-failure' }]]
});
```

### Command Line Override

```bash
# Override config file
npx playwright test --reporter=html
npx playwright test --reporter=json

# Multiple reporters via CLI
npx playwright test --reporter=list --reporter=html
```

## Reporter Output Locations

### Console Reporters
- `list`, `line`, `dot`, `github`
- Output: Terminal/stdout
- Location: Not saved to disk

### File Reporters

**HTML Reporter:**
```
playwright-report/
  ├── index.html
  ├── data/
  ├── trace/
  └── assets/
```

**JSON Reporter:**
```
test-results.json
```

**JUnit Reporter:**
```
results.xml
```

**Blob Reporter:**
```
blob-report/
  ├── report-1.zip
  ├── report-2.zip
  └── report-3.zip
```

## Report Artifacts

Test reports can include various artifacts:

### 1. **Screenshots**
- Captured on failure (default)
- Captured on each step (optional)
- Embedded in HTML reports
- Referenced in JSON reports

### 2. **Videos**
- Full test execution recording
- Captured per test (optional)
- Embedded in HTML reports
- Saved as separate files

### 3. **Traces**
- Full execution timeline
- Network requests
- Console logs
- DOM snapshots
- Viewable in Trace Viewer

### 4. **Logs**
- Console output
- Network logs
- Custom test logs
- Browser logs

## Report Storage and Management

### Best Practices

1. **Local Development**
   - Keep HTML reports in `.gitignore`
   - View and delete after debugging
   - No need to archive

2. **CI/CD**
   - Upload as build artifacts
   - Set retention policies (7-30 days)
   - Link from PR comments
   - Archive critical failures

3. **Report Organization**
   ```
   test-results/
     ├── 2026-01-09-build-123/
     │   ├── playwright-report/
     │   ├── results.xml
     │   └── results.json
     └── 2026-01-08-build-122/
   ```

4. **Disk Space Management**
   - Compress old reports
   - Delete successful test reports
   - Keep only failure reports long-term
   - Use blob reports for sharded tests

## Reporter Lifecycle

Understanding when reporters generate output:

### 1. **onBegin**
- Called when test run starts
- Initialize report structure
- Print headers

### 2. **onTestBegin**
- Called when each test starts
- Update progress indicators
- Log test name (list reporter)

### 3. **onTestEnd**
- Called when each test completes
- Record result (pass/fail/skip)
- Capture screenshots/videos
- Update running summary

### 4. **onEnd**
- Called when all tests complete
- Generate final report files
- Print summary statistics
- Open HTML report (if configured)

## Common Reporter Options

### HTML Reporter Options

```typescript
['html', {
  outputFolder: 'playwright-report',  // Output directory
  open: 'never',                      // 'always' | 'never' | 'on-failure'
}]
```

### JSON Reporter Options

```typescript
['json', {
  outputFile: 'results.json'          // Output file path
}]
```

### JUnit Reporter Options

```typescript
['junit', {
  outputFile: 'results.xml',          // Output file path
  embedAnnotationsAsProperties: true  // Include test annotations
}]
```

### List Reporter Options

```typescript
['list', {
  printSteps: true                    // Show individual test steps
}]
```

## Summary

In this section, you learned:
- ✅ What test reporting is and why it matters
- ✅ Different types of reports (console vs file-based)
- ✅ Playwright's 8 built-in reporters
- ✅ When to use each reporter type
- ✅ Basic reporter configuration
- ✅ Report output locations and artifacts
- ✅ Best practices for report management

## Next Steps

Now you're ready to:
1. Explore each built-in reporter in detail → [Built-in Reporters](02_builtin_reporters.md)
2. Master the HTML reporter → [HTML Reporter Deep Dive](03_html_reporter.md)
3. Learn about JSON and JUnit reports → [JSON and JUnit Reports](04_json_junit_reports.md)
4. Configure multiple reporters → [Multiple Reporters](05_multiple_reporters.md)

**Remember:** Choose the right reporter for your needs - local development, CI/CD, or automation!
