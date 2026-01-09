# Built-in Reporters

Playwright provides 8 powerful built-in reporters out of the box. This guide covers each reporter in detail with examples and use cases.

## 1. List Reporter

The **list reporter** is the default reporter for local development. It displays one line for each test being run.

### Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: 'list'
});
```

### Output Example

```
Running 45 tests using 5 workers

  ✓ [chromium] › auth/login.spec.ts:12:5 › should login successfully (2.1s)
  ✓ [chromium] › auth/login.spec.ts:24:5 › should logout successfully (1.3s)
  ✓ [chromium] › checkout/cart.spec.ts:15:7 › should add item to cart (1.8s)
  ✗ [chromium] › checkout/payment.spec.ts:20:9 › should process payment (3.2s)

  1) [chromium] › checkout/payment.spec.ts:20:9 › should process payment

     Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

     Expected: visible
     Received: hidden

     Call log:
       - expect.toBeVisible with timeout 5000ms
       - waiting for locator('.payment-button')

  44 passed (23.4s)
  1 failed
```

### Features

- ✅ Shows test file path and line number
- ✅ Displays browser/project name
- ✅ Shows test duration
- ✅ Prints detailed error messages
- ✅ Real-time progress updates
- ✅ Clear pass/fail indicators (✓/✗)

### Options

```typescript
reporter: [['list', {
  printSteps: true  // Show individual test steps
}]]
```

**With `printSteps: true`:**
```
  ✓ [chromium] › auth/login.spec.ts:12:5 › should login successfully (2.1s)
      ↳ page.goto('https://example.com')
      ↳ page.fill('input[name="email"]', 'user@example.com')
      ↳ page.fill('input[name="password"]', '********')
      ↳ page.click('button[type="submit"]')
      ↳ expect.toHaveURL('https://example.com/dashboard')
```

### When to Use

**✅ Best for:**
- Local development
- Immediate detailed feedback
- Debugging specific tests
- Small to medium test suites

**❌ Not ideal for:**
- CI pipelines (too verbose)
- Very large test suites (too much output)
- Automated processing

---

## 2. Line Reporter

The **line reporter** is more concise than list reporter, using a single line that updates continuously.

### Configuration

```typescript
export default defineConfig({
  reporter: 'line'
});
```

### Output Example

```
Running 45 tests using 5 workers
  [42/45] checkout/payment.spec.ts - should process payment (3.2s)
```

The single line updates as tests progress. When complete:

```
Running 45 tests using 5 workers

  1) [chromium] › checkout/payment.spec.ts:20:9 › should process payment

     Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

  44 passed (23.4s)
  1 failed
```

### Features

- ✅ Minimal output - single updating line
- ✅ Shows current test progress
- ✅ Displays failures at the end
- ✅ Less scrolling for large suites
- ✅ Clean terminal output

### When to Use

**✅ Best for:**
- Large test suites
- When you want minimal output
- Watching test progress without clutter
- Terminal with limited scroll buffer

**❌ Not ideal for:**
- Debugging (less detail during run)
- When you need to see each test result immediately

---

## 3. Dot Reporter

The **dot reporter** is the most concise reporter, showing one character per test. It's the default reporter on CI.

### Configuration

```typescript
export default defineConfig({
  reporter: 'dot'
});
```

### Output Example

```
Running 45 tests using 5 workers

··········F···································

  1) [chromium] › checkout/payment.spec.ts:20:9 › should process payment

     Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

  44 passed (23.4s)
  1 failed
```

### Character Meaning

- `·` - Test passed
- `F` - Test failed
- `°` - Test skipped
- `×` - Test interrupted

### Features

- ✅ Extremely concise output
- ✅ Good for large test suites
- ✅ Minimal scrolling
- ✅ Quick progress visualization
- ✅ Perfect for CI logs

### When to Use

**✅ Best for:**
- CI/CD pipelines
- Very large test suites (100+ tests)
- When you need minimal console output
- Automated environments

**❌ Not ideal for:**
- Local debugging
- When you need immediate test-by-test feedback

---

## 4. HTML Reporter

The **HTML reporter** generates an interactive web-based report. This is the most feature-rich reporter.

### Configuration

```typescript
export default defineConfig({
  reporter: [['html', {
    outputFolder: 'playwright-report',
    open: 'never'  // 'always' | 'never' | 'on-failure'
  }]]
});
```

### Viewing the Report

```bash
# After tests run
npx playwright show-report

# Or open directly
open playwright-report/index.html
```

### Features

**Test Results:**
- ✅ Interactive filtering (passed/failed/skipped)
- ✅ Search by test name
- ✅ Sort by duration, status, name
- ✅ Group by file/project

**Test Details:**
- ✅ Error messages with stack traces
- ✅ Screenshots embedded inline
- ✅ Video playback
- ✅ Trace viewer integration
- ✅ Test steps timeline
- ✅ Console logs

**Analysis:**
- ✅ Duration breakdown
- ✅ Retry information
- ✅ Browser/project distribution
- ✅ Overall statistics

### Report Structure

```
playwright-report/
  ├── index.html       # Main report file
  ├── data/            # Test data
  ├── trace/           # Trace files
  └── assets/          # Screenshots, videos
```

### Opening Behavior

```typescript
// Always open after tests
reporter: [['html', { open: 'always' }]]

// Never open automatically
reporter: [['html', { open: 'never' }]]

// Open only when tests fail (default)
reporter: [['html', { open: 'on-failure' }]]
```

### Custom Output Folder

```typescript
reporter: [['html', {
  outputFolder: 'my-custom-report'
}]]
```

### When to Use

**✅ Best for:**
- Detailed failure analysis
- Visual verification of screenshots/videos
- Sharing results with team members
- CI artifact storage
- Debugging complex failures

**❌ Not ideal for:**
- Real-time feedback during test run
- Automated result processing (use JSON instead)

---

## 5. JSON Reporter

The **JSON reporter** outputs machine-readable JSON with all test results.

### Configuration

```typescript
export default defineConfig({
  reporter: [['json', {
    outputFile: 'test-results.json'
  }]]
});
```

### Output Example

```json
{
  "config": {
    "rootDir": "/Users/user/project",
    "configFile": "/Users/user/project/playwright.config.ts"
  },
  "suites": [
    {
      "title": "auth/login.spec.ts",
      "file": "auth/login.spec.ts",
      "line": 1,
      "column": 1,
      "specs": [
        {
          "title": "should login successfully",
          "ok": true,
          "tests": [
            {
              "timeout": 30000,
              "annotations": [],
              "expectedStatus": "passed",
              "projectName": "chromium",
              "results": [
                {
                  "workerIndex": 0,
                  "status": "passed",
                  "duration": 2134,
                  "errors": [],
                  "stdout": [],
                  "stderr": [],
                  "attachments": []
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "stats": {
    "expected": 44,
    "unexpected": 1,
    "flaky": 0,
    "skipped": 0
  }
}
```

### Data Structure

**Suite level:**
- File path and location
- Suite title
- Test specs

**Test level:**
- Test title and location
- Expected status
- Annotations
- Results from each retry

**Result level:**
- Status (passed/failed/skipped)
- Duration
- Errors
- Attachments (screenshots, traces)
- stdout/stderr

### Parsing JSON Reports

```typescript
// parse-results.ts
import * as fs from 'fs';

const results = JSON.parse(fs.readFileSync('test-results.json', 'utf-8'));

// Count failures
const failures = results.suites.reduce((count, suite) => {
  return count + suite.specs.filter(spec => !spec.ok).length;
}, 0);

console.log(`Total failures: ${failures}`);

// Find slow tests
results.suites.forEach(suite => {
  suite.specs.forEach(spec => {
    spec.tests.forEach(test => {
      const duration = test.results[0].duration;
      if (duration > 5000) {
        console.log(`Slow test: ${spec.title} (${duration}ms)`);
      }
    });
  });
});
```

### When to Use

**✅ Best for:**
- Automated result processing
- Custom dashboards
- Test analytics
- Integration with other tools
- Historical data tracking
- Custom notifications

**❌ Not ideal for:**
- Human-readable reports (use HTML)
- Real-time feedback during test run

---

## 6. JUnit Reporter

The **JUnit reporter** generates JUnit-style XML reports for CI integration.

### Configuration

```typescript
export default defineConfig({
  reporter: [['junit', {
    outputFile: 'results.xml',
    embedAnnotationsAsProperties: true
  }]]
});
```

### Output Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuites id="1" name="Playwright Tests" tests="45" failures="1" time="23.4">
  <testsuite name="auth/login.spec.ts" tests="2" failures="0" time="3.4">
    <testcase name="[chromium] › should login successfully"
              classname="auth/login.spec.ts"
              time="2.1">
    </testcase>
    <testcase name="[chromium] › should logout successfully"
              classname="auth/login.spec.ts"
              time="1.3">
    </testcase>
  </testsuite>
  <testsuite name="checkout/payment.spec.ts" tests="1" failures="1" time="3.2">
    <testcase name="[chromium] › should process payment"
              classname="checkout/payment.spec.ts"
              time="3.2">
      <failure message="Timed out 5000ms waiting for expect(locator).toBeVisible()"
               type="Error">
        Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

        Expected: visible
        Received: hidden
      </failure>
    </testcase>
  </testsuite>
</testsuites>
```

### CI Integration Examples

**Jenkins:**
```groovy
post {
  always {
    junit 'results.xml'
  }
}
```

**GitHub Actions:**
```yaml
- name: Publish Test Results
  uses: EnricoMi/publish-unit-test-result-action@v2
  if: always()
  with:
    files: results.xml
```

**Azure Pipelines:**
```yaml
- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: 'results.xml'
```

### Embed Annotations

```typescript
reporter: [['junit', {
  embedAnnotationsAsProperties: true
}]]
```

Test annotations become XML properties:
```xml
<testcase name="test name">
  <properties>
    <property name="issue" value="JIRA-123"/>
    <property name="priority" value="high"/>
  </properties>
</testcase>
```

### When to Use

**✅ Best for:**
- CI/CD pipeline integration
- Test management systems (Jira, TestRail)
- Build tools (Jenkins, CircleCI, GitLab)
- Standard reporting format
- Team familiar with JUnit format

**❌ Not ideal for:**
- Local development
- Rich interactive reports (use HTML)
- Custom data processing (use JSON)

---

## 7. GitHub Actions Reporter

The **GitHub Actions reporter** provides automatic failure annotations when running in GitHub Actions.

### Configuration

```typescript
export default defineConfig({
  reporter: process.env.CI ? 'github' : 'list'
});
```

Or in combination with other reporters:

```typescript
reporter: process.env.CI
  ? [['github'], ['html']]
  : 'list'
```

### Features

**Automatic Annotations:**
- Shows test failures directly in GitHub UI
- Appears in Pull Request checks
- Visible in commit status
- Links to workflow run

**Annotation Details:**
- Test file and line number
- Error message
- Stack trace
- Clickable file references

### GitHub Actions Integration

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
```

With `reporter: 'github'`, failures automatically appear as annotations.

### Visual Example

In GitHub UI you'll see:
```
checkout/payment.spec.ts Line 20
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
```

Clicking the annotation navigates to the exact line in your code.

### When to Use

**✅ Best for:**
- GitHub Actions CI
- Pull request checks
- Team collaboration on GitHub
- Quick failure identification

**❌ Not ideal for:**
- Non-GitHub CI platforms
- Detailed debugging (combine with HTML reporter)
- Local development

---

## 8. Blob Reporter

The **blob reporter** generates blob reports that can be merged later. Essential for sharded test execution.

### Configuration

```typescript
export default defineConfig({
  reporter: 'blob'
});
```

### Workflow

**Step 1: Run sharded tests with blob reporter**
```bash
npx playwright test --shard=1/3 --reporter=blob
npx playwright test --shard=2/3 --reporter=blob
npx playwright test --shard=3/3 --reporter=blob
```

**Step 2: Merge blob reports**
```bash
npx playwright merge-reports --reporter html ./blob-report
```

### Output Structure

```
blob-report/
  ├── report-1-of-3.zip
  ├── report-2-of-3.zip
  └── report-3-of-3.zip
```

### Merging to Different Formats

```bash
# Merge to HTML
npx playwright merge-reports --reporter html ./blob-report

# Merge to JSON
npx playwright merge-reports --reporter json ./blob-report

# Multiple reporters
npx playwright merge-reports --reporter html --reporter junit ./blob-report
```

### GitHub Actions Example

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3]
    steps:
      - run: npx playwright test --shard=${{ matrix.shard }}/3 --reporter=blob
      - uses: actions/upload-artifact@v4
        with:
          name: blob-report-${{ matrix.shard }}
          path: blob-report

  merge-reports:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          pattern: blob-report-*
          merge-multiple: true
          path: all-blob-reports
      - run: npx playwright merge-reports --reporter html ./all-blob-reports
```

### When to Use

**✅ Best for:**
- Sharded test execution
- Parallel test runs across machines
- CI matrix builds
- Distributed testing

**❌ Not ideal for:**
- Single machine execution
- Local development
- Simple test runs

---

## Combining Multiple Reporters

You can use multiple reporters simultaneously:

```typescript
export default defineConfig({
  reporter: [
    ['list'],                                    // Console output
    ['html', { open: 'never' }],                // HTML report
    ['json', { outputFile: 'results.json' }],   // JSON data
    ['junit', { outputFile: 'results.xml' }]    // JUnit XML
  ]
});
```

### Common Combinations

**Local Development:**
```typescript
reporter: [
  ['list'],
  ['html', { open: 'on-failure' }]
]
```

**CI Pipeline:**
```typescript
reporter: [
  ['dot'],
  ['html'],
  ['junit', { outputFile: 'results.xml' }]
]
```

**Analytics:**
```typescript
reporter: [
  ['line'],
  ['json', { outputFile: 'results.json' }]
]
```

---

## Summary

| Reporter | Output | Best For | Use in CI |
|----------|--------|----------|-----------|
| **list** | Console | Local dev, detailed feedback | ❌ |
| **line** | Console | Large suites, minimal output | ⚠️ |
| **dot** | Console | CI pipelines, huge suites | ✅ |
| **html** | File (web) | Debugging, visual reports | ✅ |
| **json** | File (JSON) | Automation, analytics | ✅ |
| **junit** | File (XML) | CI integration, TMS | ✅ |
| **github** | Annotations | GitHub Actions | ✅ |
| **blob** | Binary | Sharded tests | ✅ |

## Next Steps

Now that you understand all built-in reporters:
1. Deep dive into the HTML reporter → [HTML Reporter](03_html_reporter.md)
2. Learn about JSON and JUnit → [JSON and JUnit Reports](04_json_junit_reports.md)
3. Configure multiple reporters → [Multiple Reporters](05_multiple_reporters.md)
4. Work with blob reports → [Blob Reports](06_blob_reports.md)
