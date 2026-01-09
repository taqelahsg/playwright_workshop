# JSON and JUnit Reports

This guide covers JSON and JUnit reporters - essential for automation, CI/CD integration, and custom processing.

## JSON Reporter

The **JSON Reporter** outputs machine-readable test results in JSON format, perfect for automated processing and custom analytics.

### Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['json', {
    outputFile: 'test-results.json'
  }]]
});
```

### Basic Usage

```bash
# Run tests and generate JSON
npx playwright test

# JSON file created at: test-results.json
```

### Output Structure

```json
{
  "config": {
    "rootDir": "/Users/user/project",
    "configFile": "/Users/user/project/playwright.config.ts",
    "listOnly": false,
    "version": "1.40.0"
  },
  "project": {
    "name": "chromium",
    "outputDir": "/Users/user/project/test-results",
    "repeatEach": 1,
    "retries": 2,
    "testDir": "/Users/user/project/tests",
    "testIgnore": [],
    "testMatch": "**/*.@(spec|test).?(c|m)[jt]s?(x)",
    "timeout": 30000
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
          "tags": ["@smoke"],
          "tests": [
            {
              "timeout": 30000,
              "annotations": [],
              "expectedStatus": "passed",
              "projectId": "chromium",
              "projectName": "chromium",
              "results": [
                {
                  "workerIndex": 0,
                  "status": "passed",
                  "duration": 2134,
                  "errors": [],
                  "stdout": [],
                  "stderr": [],
                  "retry": 0,
                  "startTime": "2026-01-09T10:30:00.000Z",
                  "attachments": [
                    {
                      "name": "screenshot",
                      "contentType": "image/png",
                      "path": "/path/to/screenshot.png"
                    }
                  ]
                }
              ],
              "status": "expected"
            }
          ]
        }
      ]
    }
  ],
  "errors": [],
  "stats": {
    "startTime": "2026-01-09T10:30:00.000Z",
    "duration": 23456,
    "expected": 44,
    "unexpected": 1,
    "flaky": 0,
    "skipped": 0
  }
}
```

### Key Data Fields

**Config Section:**
- `rootDir` - Project root directory
- `configFile` - Path to playwright.config.ts
- `version` - Playwright version

**Project Section:**
- `name` - Project name (chromium, firefox, webkit)
- `timeout` - Default test timeout
- `retries` - Number of retry attempts
- `testDir` - Test directory location

**Suites:**
- `title` - Test file name
- `file` - File path
- `specs` - Array of test specs

**Specs:**
- `title` - Test name
- `ok` - Overall pass/fail status
- `tags` - Test tags (@smoke, @regression, etc.)
- `tests` - Test execution details

**Results:**
- `status` - Test outcome (passed, failed, skipped, timedOut)
- `duration` - Execution time in milliseconds
- `errors` - Array of error objects
- `attachments` - Screenshots, videos, traces
- `retry` - Retry attempt number (0 = first run)

**Stats:**
- `expected` - Number of passed tests
- `unexpected` - Number of failed tests
- `flaky` - Tests that passed on retry
- `skipped` - Skipped tests
- `duration` - Total execution time

## Parsing JSON Reports

### Node.js Example

```typescript
// parse-results.ts
import * as fs from 'fs';

interface TestResults {
  suites: any[];
  stats: {
    expected: number;
    unexpected: number;
    flaky: number;
    skipped: number;
    duration: number;
  };
}

const results: TestResults = JSON.parse(
  fs.readFileSync('test-results.json', 'utf-8')
);

// Print summary
console.log('Test Results Summary');
console.log('===================');
console.log(`Passed:  ${results.stats.expected}`);
console.log(`Failed:  ${results.stats.unexpected}`);
console.log(`Flaky:   ${results.stats.flaky}`);
console.log(`Skipped: ${results.stats.skipped}`);
console.log(`Duration: ${(results.stats.duration / 1000).toFixed(2)}s`);
```

### Finding Failed Tests

```typescript
// find-failures.ts
const results = JSON.parse(fs.readFileSync('test-results.json', 'utf-8'));

const failures: any[] = [];

results.suites.forEach((suite: any) => {
  suite.specs.forEach((spec: any) => {
    spec.tests.forEach((test: any) => {
      if (test.status === 'unexpected') {
        failures.push({
          file: suite.file,
          title: spec.title,
          error: test.results[0].errors[0]?.message || 'Unknown error'
        });
      }
    });
  });
});

console.log(`Found ${failures.length} failures:`);
failures.forEach(f => {
  console.log(`\n${f.file}`);
  console.log(`  ${f.title}`);
  console.log(`  Error: ${f.error}`);
});
```

### Finding Slow Tests

```typescript
// find-slow-tests.ts
const SLOW_THRESHOLD = 5000; // 5 seconds

const slowTests = [];

results.suites.forEach((suite: any) => {
  suite.specs.forEach((spec: any) => {
    spec.tests.forEach((test: any) => {
      const duration = test.results[0].duration;
      if (duration > SLOW_THRESHOLD) {
        slowTests.push({
          file: suite.file,
          title: spec.title,
          duration: duration
        });
      }
    });
  });
});

// Sort by duration (slowest first)
slowTests.sort((a, b) => b.duration - a.duration);

console.log('Slow Tests (> 5s):');
slowTests.forEach(t => {
  console.log(`${(t.duration / 1000).toFixed(2)}s - ${t.file} › ${t.title}`);
});
```

### Identifying Flaky Tests

```typescript
// find-flaky-tests.ts
const flakyTests = [];

results.suites.forEach((suite: any) => {
  suite.specs.forEach((spec: any) => {
    spec.tests.forEach((test: any) => {
      if (test.status === 'flaky') {
        const attempts = test.results.length;
        flakyTests.push({
          file: suite.file,
          title: spec.title,
          attempts: attempts
        });
      }
    });
  });
});

console.log(`Found ${flakyTests.length} flaky tests:`);
flakyTests.forEach(t => {
  console.log(`${t.file} › ${t.title} (${t.attempts} attempts)`);
});
```

## Custom Report Generation

### Generate HTML Summary

```typescript
// generate-summary.ts
import * as fs from 'fs';

const results = JSON.parse(fs.readFileSync('test-results.json', 'utf-8'));

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Results</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .passed { color: green; }
    .failed { color: red; }
    .stats { display: flex; gap: 20px; }
    .stat { padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Test Results</h1>
  <div class="stats">
    <div class="stat passed">Passed: ${results.stats.expected}</div>
    <div class="stat failed">Failed: ${results.stats.unexpected}</div>
    <div class="stat">Flaky: ${results.stats.flaky}</div>
    <div class="stat">Skipped: ${results.stats.skipped}</div>
  </div>
  <p>Duration: ${(results.stats.duration / 1000).toFixed(2)}s</p>
</body>
</html>
`;

fs.writeFileSync('summary.html', html);
console.log('Summary generated: summary.html');
```

### Send Slack Notification

```typescript
// notify-slack.ts
import * as fs from 'fs';
import axios from 'axios';

const results = JSON.parse(fs.readFileSync('test-results.json', 'utf-8'));

const message = {
  text: 'Test Results',
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Test Results*\n✅ Passed: ${results.stats.expected}\n❌ Failed: ${results.stats.unexpected}\n🔄 Flaky: ${results.stats.flaky}`
      }
    }
  ]
};

axios.post(process.env.SLACK_WEBHOOK_URL!, message)
  .then(() => console.log('Notification sent'))
  .catch(err => console.error('Failed to send notification:', err));
```

## JUnit Reporter

The **JUnit Reporter** generates XML reports compatible with CI/CD systems and test management tools.

### Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: [['junit', {
    outputFile: 'results.xml',
    embedAnnotationsAsProperties: true
  }]]
});
```

### Output Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuites id="1" name="Playwright Tests" tests="45" failures="1" skipped="0" errors="0" time="23.4">

  <testsuite name="auth/login.spec.ts" hostname="" tests="2" failures="0" skipped="0" time="3.4" errors="0" timestamp="2026-01-09T10:30:00">

    <testcase name="[chromium] › should login successfully" classname="auth.login.spec" time="2.1">
      <properties>
        <property name="tag" value="@smoke"/>
      </properties>
    </testcase>

    <testcase name="[chromium] › should logout successfully" classname="auth.login.spec" time="1.3">
    </testcase>

  </testsuite>

  <testsuite name="checkout/payment.spec.ts" hostname="" tests="1" failures="1" skipped="0" time="3.2" errors="0" timestamp="2026-01-09T10:30:05">

    <testcase name="[chromium] › should process payment" classname="checkout.payment.spec" time="3.2">
      <failure message="Timed out 5000ms waiting for expect(locator).toBeVisible()" type="Error">
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Expected: visible
Received: hidden

Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('.payment-button')
  - locator resolved to hidden &lt;button class="payment-button"&gt;...&lt;/button&gt;

    at tests/checkout/payment.spec.ts:42:7
      </failure>
    </testcase>

  </testsuite>

</testsuites>
```

### JUnit XML Elements

**`<testsuites>`:**
- Container for all test suites
- Attributes: tests, failures, skipped, time

**`<testsuite>`:**
- Represents a test file
- Attributes: name, tests, failures, time

**`<testcase>`:**
- Represents a single test
- Attributes: name, classname, time

**`<failure>`:**
- Test failure information
- Attributes: message, type
- Content: Full error message and stack trace

**`<properties>`:**
- Test metadata/annotations
- Created from test annotations

### Embedding Annotations

```typescript
// playwright.config.ts
reporter: [['junit', {
  embedAnnotationsAsProperties: true
}]]
```

```typescript
// test file
test('critical feature', async ({ page }) => {
  test.info().annotations.push({
    type: 'issue',
    description: 'JIRA-123'
  });
  test.info().annotations.push({
    type: 'priority',
    description: 'high'
  });

  // Test code...
});
```

**Generates:**
```xml
<testcase name="critical feature" classname="..." time="2.1">
  <properties>
    <property name="issue" value="JIRA-123"/>
    <property name="priority" value="high"/>
  </properties>
</testcase>
```

## CI/CD Integration

### Jenkins

```groovy
pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        sh 'npx playwright test'
      }
    }
  }
  post {
    always {
      junit 'results.xml'
    }
  }
}
```

**Features:**
- Test result trending
- Failure reports
- Historical analysis
- Build status indicators

### GitHub Actions

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test

      - name: Publish Test Results
        uses: EnricoMi/publish-unit-test-result-action@v2
        if: always()
        with:
          files: results.xml
```

**Features:**
- Test result annotations
- PR check status
- Trend graphs
- Failure grouping

### GitLab CI

```yaml
test:
  script:
    - npx playwright test
  artifacts:
    when: always
    reports:
      junit: results.xml
```

**Features:**
- Test report tab
- Failure tracking
- Historical trends
- Merge request integration

### Azure Pipelines

```yaml
- task: PublishTestResults@2
  condition: always()
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: 'results.xml'
    failTaskOnFailedTests: true
```

## Combining JSON and JUnit

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'results.xml' }]
  ]
});
```

**Benefits:**
- JUnit for CI integration
- JSON for custom processing
- List for console output

## Best Practices

### 1. **Use Descriptive Output Names**

```typescript
reporter: [
  ['json', { outputFile: 'test-results.json' }],
  ['junit', { outputFile: 'junit-results.xml' }]
]
```

### 2. **Add Annotations for Context**

```typescript
test('feature', async ({ page }) => {
  test.info().annotations.push({
    type: 'issue',
    description: 'JIRA-123'
  });
  test.info().annotations.push({
    type: 'environment',
    description: 'staging'
  });
});
```

### 3. **Process Reports in CI**

```yaml
- name: Analyze results
  run: node scripts/analyze-results.js
  if: always()
```

### 4. **Archive Reports**

```yaml
- name: Upload reports
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: test-reports
    path: |
      test-results.json
      results.xml
```

### 5. **Validate Report Structure**

```typescript
// validate-report.ts
const results = JSON.parse(fs.readFileSync('test-results.json', 'utf-8'));

if (!results.stats) {
  throw new Error('Invalid report structure');
}

console.log('Report validation passed');
```

## Common Use Cases

### 1. **Fail CI on Test Failures**

```typescript
// check-results.ts
const results = JSON.parse(fs.readFileSync('test-results.json', 'utf-8'));

if (results.stats.unexpected > 0) {
  console.error(`${results.stats.unexpected} tests failed`);
  process.exit(1);
}
```

### 2. **Generate Custom Dashboard**

```typescript
// Store results in database
const results = JSON.parse(fs.readFileSync('test-results.json', 'utf-8'));

await db.testRuns.create({
  date: new Date(),
  passed: results.stats.expected,
  failed: results.stats.unexpected,
  duration: results.stats.duration
});
```

### 3. **Compare with Previous Run**

```typescript
const current = JSON.parse(fs.readFileSync('test-results.json', 'utf-8'));
const previous = JSON.parse(fs.readFileSync('previous-results.json', 'utf-8'));

const newFailures = current.stats.unexpected - previous.stats.unexpected;
console.log(`New failures: ${newFailures}`);
```

## Summary

**JSON Reporter:**
- ✅ Machine-readable format
- ✅ Complete test data
- ✅ Perfect for automation
- ✅ Easy to parse and process
- ✅ Custom analytics and dashboards

**JUnit Reporter:**
- ✅ Standard XML format
- ✅ CI/CD integration
- ✅ Test management system compatibility
- ✅ Historical trend tracking
- ✅ Wide tool support

## Next Steps

Now you understand JSON and JUnit reporters:
1. Learn to use multiple reporters → [Multiple Reporters](05_multiple_reporters.md)
2. Work with blob reports → [Blob Reports](06_blob_reports.md)
3. Create custom reporters → [Custom Reporters](07_custom_reporters.md)
