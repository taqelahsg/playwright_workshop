# Multiple Reporters and CI Configuration

Learn how to use multiple reporters simultaneously and configure them for different environments.

## Why Use Multiple Reporters?

Different reporters serve different purposes. Using them together gives you:

- 📺 **Console feedback** - Real-time progress during test execution
- 📊 **Visual analysis** - HTML reports for debugging failures
- 🤖 **CI integration** - JUnit XML for build systems
- 📈 **Custom analytics** - JSON data for dashboards

**Example: Local Development**
```
✓ List reporter → Console feedback
✓ HTML reporter → Visual debugging
```

**Example: CI Pipeline**
```
✓ Dot reporter → Minimal console output
✓ HTML reporter → Artifact for debugging
✓ JUnit reporter → Build system integration
```

## Configuring Multiple Reporters

### Basic Syntax

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'],
    ['html'],
    ['json', { outputFile: 'results.json' }]
  ]
});
```

Each reporter is an array: `[reporterName, options]`

### With Options

```typescript
reporter: [
  ['list'],
  ['html', {
    outputFolder: 'playwright-report',
    open: 'never'
  }],
  ['json', {
    outputFile: 'test-results.json'
  }],
  ['junit', {
    outputFile: 'results.xml'
  }]
]
```

## Common Reporter Combinations

### 1. Local Development

**Goal:** Immediate feedback + detailed debugging

```typescript
export default defineConfig({
  reporter: [
    ['list'],                                   // Console progress
    ['html', { open: 'on-failure' }]           // Auto-open on failures
  ]
});
```

**Provides:**
- Real-time console output
- Automatic HTML report when tests fail
- Quick debugging workflow

### 2. CI Pipeline

**Goal:** Minimal output + artifacts + integration

```typescript
export default defineConfig({
  reporter: [
    ['dot'],                                    // Concise console
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'results.xml' }]
  ]
});
```

**Provides:**
- Clean CI logs (dots)
- HTML report as artifact
- JUnit XML for build integration

### 3. Analytics and Monitoring

**Goal:** Data collection + processing

```typescript
export default defineConfig({
  reporter: [
    ['line'],                                   // Minimal console
    ['json', { outputFile: 'results.json' }],  // Raw data
    ['html']                                    // Visual reports
  ]
});
```

**Provides:**
- JSON for custom dashboards
- Historical tracking
- Trend analysis

### 4. GitHub Actions

**Goal:** Annotations + artifacts

```typescript
export default defineConfig({
  reporter: process.env.CI
    ? [
        ['github'],                             // Annotations
        ['html'],                               // Artifact
        ['junit', { outputFile: 'results.xml' }]
      ]
    : [
        ['list'],
        ['html', { open: 'on-failure' }]
      ]
});
```

**Provides:**
- Automatic failure annotations
- Downloadable HTML report
- JUnit for test result display

### 5. Complete Setup

**Goal:** Everything you might need

```typescript
export default defineConfig({
  reporter: [
    ['list', { printSteps: true }],            // Detailed console
    ['html', {
      outputFolder: 'playwright-report',
      open: 'on-failure'
    }],
    ['json', {
      outputFile: 'test-results/results.json'
    }],
    ['junit', {
      outputFile: 'test-results/junit.xml',
      embedAnnotationsAsProperties: true
    }]
  ]
});
```

## Environment-Based Configuration

### Using process.env.CI

```typescript
export default defineConfig({
  reporter: process.env.CI
    ? [['dot'], ['html'], ['junit', { outputFile: 'results.xml' }]]
    : [['list'], ['html', { open: 'on-failure' }]]
});
```

**Local:** List + HTML (auto-open on failure)
**CI:** Dot + HTML + JUnit

### Custom Environment Variables

```typescript
const reporters: any[] = [['list']];

// Always add HTML reporter
reporters.push(['html', {
  open: process.env.CI ? 'never' : 'on-failure'
}]);

// Add JUnit in CI
if (process.env.CI) {
  reporters.push(['junit', { outputFile: 'results.xml' }]);
}

// Add JSON for analytics
if (process.env.COLLECT_ANALYTICS) {
  reporters.push(['json', { outputFile: 'analytics.json' }]);
}

export default defineConfig({
  reporter: reporters
});
```

### Platform-Specific Configuration

```typescript
let reporters: any[] = [];

if (process.env.GITHUB_ACTIONS) {
  reporters = [
    ['github'],
    ['html'],
    ['junit', { outputFile: 'results.xml' }]
  ];
} else if (process.env.JENKINS_HOME) {
  reporters = [
    ['dot'],
    ['junit', { outputFile: 'results.xml' }]
  ];
} else if (process.env.GITLAB_CI) {
  reporters = [
    ['dot'],
    ['junit', { outputFile: 'results.xml' }]
  ];
} else {
  reporters = [
    ['list'],
    ['html', { open: 'on-failure' }]
  ];
}

export default defineConfig({
  reporter: reporters
});
```

## Command Line Overrides

### Override in CLI

```bash
# Use specific reporter (overrides config)
npx playwright test --reporter=html

# Multiple reporters
npx playwright test --reporter=list --reporter=html

# With options
npx playwright test --reporter=json:results.json
```

### Combine CLI and Config

Config file is ignored when using `--reporter` flag:

```bash
# This uses ONLY dot reporter
npx playwright test --reporter=dot

# Config reporters are ignored
```

To keep config reporters and add more:
```bash
# Not possible via CLI
# Must modify config file
```

## CI/CD Integration Examples

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
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: test-results/

      - name: Publish test results
        uses: EnricoMi/publish-unit-test-result-action@v2
        if: always()
        with:
          files: results.xml
```

**Config:**
```typescript
reporter: process.env.CI
  ? [
      ['github'],
      ['html'],
      ['junit', { outputFile: 'results.xml' }]
    ]
  : [['list'], ['html', { open: 'on-failure' }]]
```

### Jenkins

```groovy
pipeline {
  agent any

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps'
      }
    }

    stage('Test') {
      steps {
        sh 'npx playwright test'
      }
    }
  }

  post {
    always {
      // Publish JUnit results
      junit 'results.xml'

      // Archive HTML report
      publishHTML([
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        reportName: 'Playwright Test Report',
        keepAll: true
      ])

      // Archive artifacts
      archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
    }
  }
}
```

**Config:**
```typescript
reporter: [
  ['dot'],
  ['html', { outputFolder: 'playwright-report' }],
  ['junit', { outputFile: 'results.xml' }],
  ['json', { outputFile: 'test-results/results.json' }]
]
```

### GitLab CI

```yaml
test:
  image: mcr.microsoft.com/playwright:latest
  script:
    - npm ci
    - npx playwright test

  artifacts:
    when: always
    reports:
      junit: results.xml
    paths:
      - playwright-report/
      - test-results/
    expire_in: 1 week
```

**Config:**
```typescript
reporter: [
  ['dot'],
  ['junit', { outputFile: 'results.xml' }],
  ['html']
]
```

### Azure Pipelines

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'

  - script: npm ci
    displayName: 'Install dependencies'

  - script: npx playwright install --with-deps
    displayName: 'Install Playwright'

  - script: npx playwright test
    displayName: 'Run tests'

  - task: PublishTestResults@2
    condition: always()
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'results.xml'
      failTaskOnFailedTests: true

  - task: PublishPipelineArtifact@1
    condition: always()
    inputs:
      targetPath: playwright-report
      artifactName: playwright-report
```

**Config:**
```typescript
reporter: [
  ['dot'],
  ['html'],
  ['junit', { outputFile: 'results.xml' }]
]
```

## Report Organization

### Directory Structure

```
project/
├── playwright-report/          # HTML reports
│   ├── index.html
│   └── ...
├── test-results/               # Test artifacts
│   ├── results.json           # JSON report
│   ├── junit.xml              # JUnit report
│   └── screenshots/           # Test screenshots
└── .gitignore
```

### .gitignore Setup

```gitignore
# Test reports (don't commit to git)
playwright-report/
test-results/
test-results.json
results.xml

# Keep test result templates (optional)
!test-results/.gitkeep
```

### Organizing by Date

```typescript
// playwright.config.ts
const timestamp = new Date().toISOString().split('T')[0]; // 2026-01-09

export default defineConfig({
  reporter: [
    ['html', {
      outputFolder: `test-reports/${timestamp}/html`
    }],
    ['json', {
      outputFile: `test-reports/${timestamp}/results.json`
    }],
    ['junit', {
      outputFile: `test-reports/${timestamp}/junit.xml`
    }]
  ]
});
```

**Structure:**
```
test-reports/
├── 2026-01-09/
│   ├── html/
│   ├── results.json
│   └── junit.xml
├── 2026-01-08/
└── 2026-01-07/
```

## Report Storage Best Practices

### 1. **Separate Artifacts by Type**

```
test-output/
├── reports/
│   ├── html/
│   └── data/
│       ├── results.json
│       └── junit.xml
└── artifacts/
    ├── screenshots/
    ├── videos/
    └── traces/
```

### 2. **Set Retention Policies**

**GitHub Actions:**
```yaml
- uses: actions/upload-artifact@v4
  with:
    name: test-reports
    path: playwright-report/
    retention-days: 7  # Auto-delete after 7 days
```

**Jenkins:**
```groovy
post {
  always {
    publishHTML([
      reportDir: 'playwright-report',
      reportFiles: 'index.html',
      reportName: 'Test Report',
      keepAll: false,  // Don't keep all builds
      allowMissing: true
    ])
  }
}
```

### 3. **Compress Large Reports**

```yaml
# GitHub Actions
- name: Compress reports
  if: always()
  run: tar -czf reports.tar.gz playwright-report/

- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: compressed-reports
    path: reports.tar.gz
```

### 4. **Conditional Artifact Upload**

```yaml
# Only upload on failure
- uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: failure-reports
    path: playwright-report/
```

## Custom Reporter Paths

### Environment-Based Paths

```typescript
const outputDir = process.env.CI
  ? 'ci-reports'
  : 'local-reports';

export default defineConfig({
  reporter: [
    ['html', { outputFolder: `${outputDir}/html` }],
    ['json', { outputFile: `${outputDir}/results.json` }]
  ]
});
```

### Build-Specific Paths

```typescript
const buildNumber = process.env.BUILD_NUMBER || 'local';
const outputDir = `reports/build-${buildNumber}`;

export default defineConfig({
  reporter: [
    ['html', { outputFolder: `${outputDir}/html` }],
    ['junit', { outputFile: `${outputDir}/junit.xml` }]
  ]
});
```

## Troubleshooting

### Issue: Too many reporters slow down tests

**Solution:** Minimize reporters in CI
```typescript
reporter: process.env.CI
  ? [['dot'], ['junit', { outputFile: 'results.xml' }]]  // Minimal
  : [['list'], ['html']]
```

### Issue: Reports overwriting each other

**Solution:** Use unique output paths
```typescript
reporter: [
  ['json', { outputFile: `results-${Date.now()}.json` }],
  ['junit', { outputFile: `junit-${Date.now()}.xml` }]
]
```

### Issue: Large report files in CI

**Solution:** Only upload failures
```yaml
- uses: actions/upload-artifact@v4
  if: failure()
  with:
    path: playwright-report/
```

### Issue: Can't find reports

**Solution:** Use absolute paths
```typescript
import path from 'path';

reporter: [
  ['html', {
    outputFolder: path.join(__dirname, 'reports', 'html')
  }]
]
```

## Summary

**Multiple Reporters:**
- ✅ Use different reporters for different purposes
- ✅ Console + File reporters work well together
- ✅ Configure based on environment (local vs CI)
- ✅ Each reporter adds unique value

**Best Practices:**
- 🎯 Minimal console output in CI
- 🎯 Always generate HTML for debugging
- 🎯 Add JUnit for CI integration
- 🎯 Use JSON for analytics
- 🎯 Organize reports by date/build
- 🎯 Set retention policies

## Next Steps

Now you understand multiple reporters:
1. Learn about blob reports → [Blob Reports](06_blob_reports.md)
2. Create custom reporters → [Custom Reporters](07_custom_reporters.md)
3. Implement your CI/CD integration
