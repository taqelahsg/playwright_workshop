# Module 10: Test Reporting with Playwright

**Duration:** 2-3 hours (Full coverage) | 5 minutes (Intensive workshop - combined with Module 9)
**Level:** Intermediate
**Prerequisites:** Completed Modules 1-3

> **Note:** In the intensive one-day workshop (9 AM - 2 PM), this module is covered in 5 minutes combined with Module 9, focusing on HTML report demo and CI integration.

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:
- ✅ Understand Playwright's built-in test reporters
- ✅ Configure reporters in playwright.config.ts
- ✅ Use the HTML reporter for interactive test reports
- ✅ Generate JUnit XML reports for CI integration
- ✅ Create JSON reports for custom processing
- ✅ Use multiple reporters simultaneously
- ✅ Configure reporters for different environments (local vs CI)
- ✅ Work with blob reports for sharded test execution
- ✅ Implement custom reporters for specific needs
- ✅ Integrate test reports with CI/CD pipelines

---

## 📚 Topics Covered

### 1. Introduction to Test Reporting (20-30 minutes)
**File:** [01_reporting_basics.md](01_reporting_basics.md)

Learn about:
- Why test reporting matters
- Types of test reports
- Playwright's built-in reporters
- When to use each reporter
- Reporter configuration basics

**Key concepts:**
- Real-time reporting vs final reports
- Console reporters (list, line, dot)
- File-based reporters (HTML, JSON, JUnit)
- CI-specific reporters (GitHub Actions)
- Report artifacts and storage

### 2. Built-in Reporters (45-60 minutes)
**File:** [02_builtin_reporters.md](02_builtin_reporters.md)

Learn about:
- **List Reporter** - Default for local development
- **Line Reporter** - Concise single-line output
- **Dot Reporter** - Minimal character-per-test output
- **HTML Reporter** - Interactive web-based reports
- **JSON Reporter** - Machine-readable test results
- **JUnit Reporter** - XML format for CI integration
- **GitHub Actions Reporter** - Automatic annotations

**Hands-on examples:**
- Configuring each reporter
- Customizing reporter options
- Viewing and interpreting report output

### 3. HTML Reporter Deep Dive (30-45 minutes)
**File:** [03_html_reporter.md](03_html_reporter.md)

Learn about:
- Generating HTML reports
- Navigating the HTML report UI
- Viewing test results and errors
- Analyzing screenshots and videos
- Trace viewer integration
- Filtering and searching tests
- Configuration options

**Key features:**
- Automatic opening on test failures
- Self-contained report folders
- Attachment viewing (screenshots, videos, traces)
- Test duration and timing analysis
- Error stack traces and diffs

### 4. JSON and JUnit Reports (30-40 minutes)
**File:** [04_json_junit_reports.md](04_json_junit_reports.md)

Learn about:
- JSON report structure and format
- Parsing JSON reports programmatically
- JUnit XML format and structure
- Integrating with CI/CD systems
- Test management system integration
- Custom report processing

**Use cases:**
- Automated report analysis
- Custom dashboards
- Integration with test management tools
- Build pipeline integration
- Historical test data tracking

### 5. Multiple Reporters and CI Configuration (30-45 minutes)
**File:** [05_multiple_reporters.md](05_multiple_reporters.md)

Learn about:
- Running multiple reporters simultaneously
- Environment-based reporter configuration
- CI-specific settings
- Artifact upload strategies
- Report storage and retention

**Best practices:**
- Local development: list + HTML
- CI pipelines: dot + JUnit + HTML
- Conditional reporter activation
- Report archiving strategies

### 6. Blob Reports and Sharding (30-40 minutes)
**File:** [06_blob_reports.md](06_blob_reports.md)

Learn about:
- What are blob reports
- Why blob reports are needed for sharding
- Generating blob reports
- Merging reports from sharded tests
- Combining reports across machines
- Working with distributed test execution

**Workflow:**
1. Run sharded tests with blob reporter
2. Collect blob reports from all shards
3. Merge into final HTML/JSON report
4. Analyze combined results

### 7. Custom Reporters (45-60 minutes)
**File:** [07_custom_reporters.md](07_custom_reporters.md)

Learn about:
- Reporter interface and lifecycle
- Creating custom reporters
- Implementing reporter methods
- Integrating with external services
- Third-party reporter examples

**Use cases:**
- Slack/Teams notifications
- Database logging
- Custom dashboard integration
- Email reports
- Custom formatting

---

## 📊 Reporter Comparison Matrix

| Reporter | Output Type | Use Case | CI Integration | Interactive |
|----------|-------------|----------|----------------|-------------|
| **List** | Console | Local development | ❌ | ❌ |
| **Line** | Console | Large test suites | ❌ | ❌ |
| **Dot** | Console | CI pipelines | ✅ | ❌ |
| **HTML** | File (web) | Detailed analysis | ✅ | ✅ |
| **JSON** | File (JSON) | Automation/parsing | ✅ | ❌ |
| **JUnit** | File (XML) | CI/TMS integration | ✅ | ❌ |
| **GitHub** | Annotations | GitHub Actions | ✅ | ❌ |
| **Blob** | Binary | Sharded tests | ✅ | ❌ |

---

## 🎯 Quick Start

### Basic Reporter Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Single reporter (default: 'list')
  reporter: 'html',

  // Multiple reporters
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results.json' }]
  ],

  // Environment-based reporters
  reporter: process.env.CI ? 'dot' : 'list',
});
```

### Viewing HTML Reports

```bash
# Run tests
npx playwright test

# View HTML report
npx playwright show-report

# Generate HTML report with specific output directory
npx playwright test --reporter=html:playwright-report
```

### Command Line Reporter Override

```bash
# Use specific reporter
npx playwright test --reporter=dot
npx playwright test --reporter=json
npx playwright test --reporter=html

# Multiple reporters
npx playwright test --reporter=list --reporter=html
```

---

## 🧪 Hands-on Exercises

### Exercise 1: Configure HTML Reporter
1. Set up HTML reporter in playwright.config.ts
2. Run tests and generate HTML report
3. Explore test results, screenshots, and traces
4. Filter tests by status and duration

### Exercise 2: Generate JUnit Report
1. Configure JUnit reporter for CI integration
2. Run tests and examine XML output
3. Validate XML structure
4. Upload to CI/CD system

### Exercise 3: Multiple Reporters
1. Configure list, HTML, and JSON reporters together
2. Run tests once, get three different outputs
3. Compare information available in each format

### Exercise 4: Custom Reporter
1. Create a simple custom reporter
2. Implement onTestEnd to log test names
3. Add custom formatting
4. Integrate with external service (optional)

### Exercise 5: Blob Reports with Sharding
1. Configure blob reporter
2. Run tests with sharding (--shard=1/3)
3. Merge blob reports
4. Generate final HTML report

---

## 📖 Best Practices

### 1. **Local Development**
```typescript
// Use list reporter for immediate feedback
reporter: 'list',
// Or HTML for detailed analysis
reporter: [['list'], ['html', { open: 'on-failure' }]]
```

### 2. **CI Pipelines**
```typescript
// Minimal console output + file reports
reporter: [
  ['dot'],                                    // Concise console
  ['html', { outputFolder: 'playwright-report' }],
  ['junit', { outputFile: 'results.xml' }]
]
```

### 3. **Environment-Based Configuration**
```typescript
reporter: process.env.CI
  ? [['dot'], ['html'], ['junit', { outputFile: 'results.xml' }]]
  : [['list'], ['html', { open: 'on-failure' }]],
```

### 4. **Report Storage**
- Store HTML reports as CI artifacts
- Archive JUnit XML for historical analysis
- Keep JSON reports for custom processing
- Set retention policies for disk space

### 5. **Sharded Test Reporting**
```bash
# Step 1: Run sharded tests with blob reporter
npx playwright test --shard=1/3 --reporter=blob
npx playwright test --shard=2/3 --reporter=blob
npx playwright test --shard=3/3 --reporter=blob

# Step 2: Merge reports
npx playwright merge-reports --reporter html ./blob-report
```

---

## ✅ Success Criteria

After completing this module, you should be able to:

**Reporter Basics:**
- [x] Understand different reporter types and use cases
- [x] Configure reporters in playwright.config.ts
- [x] Use command line to override reporters
- [x] Generate and view HTML reports
- [x] Create JUnit XML for CI integration

**Advanced Reporting:**
- [x] Configure multiple reporters simultaneously
- [x] Set up environment-based reporter configuration
- [x] Work with blob reports for sharded tests
- [x] Merge reports from distributed test execution
- [x] Create custom reporters for specific needs

**CI/CD Integration:**
- [x] Upload test reports as CI artifacts
- [x] Integrate JUnit reports with build systems
- [x] Use GitHub Actions reporter for annotations
- [x] Configure reports for different environments
- [x] Implement report retention strategies

---

## 🎓 Quick Reference

### Reporter Configuration Examples

```typescript
// Single reporter
reporter: 'html'

// Multiple reporters
reporter: [
  ['list'],
  ['html', { outputFolder: 'my-report' }],
  ['json', { outputFile: 'results.json' }],
  ['junit', { outputFile: 'results.xml' }]
]

// HTML reporter options
['html', {
  outputFolder: 'playwright-report',  // Output directory
  open: 'never',                      // 'always' | 'never' | 'on-failure'
}]

// JSON reporter options
['json', {
  outputFile: 'test-results.json'     // Output file path
}]

// JUnit reporter options
['junit', {
  outputFile: 'results.xml',          // Output file path
  embedAnnotationsAsProperties: true  // Include annotations
}]
```

### Command Line Usage

```bash
# View HTML report (after tests run)
npx playwright show-report

# Run with specific reporter
npx playwright test --reporter=html
npx playwright test --reporter=json
npx playwright test --reporter=junit

# Multiple reporters via CLI
npx playwright test --reporter=dot --reporter=html

# Specify output file
npx playwright test --reporter=json:results.json
npx playwright test --reporter=junit:test-results.xml

# Merge blob reports
npx playwright merge-reports --reporter html ./blob-report
```

---

## 💡 Tips for Success

**Reporter Selection:**
1. **Use list locally** - Immediate feedback during development
2. **Use dot in CI** - Minimal output for large test suites
3. **Always generate HTML** - Best for debugging failures
4. **Add JUnit for CI** - Integrate with build systems
5. **Use JSON for automation** - Process results programmatically

**Report Management:**
1. **Store as artifacts** - Upload reports in CI pipelines
2. **Set retention policies** - Avoid filling disk space
3. **Link from PR comments** - Easy access to test results
4. **Archive historically** - Track trends over time
5. **Automate notifications** - Alert on failures

**Debugging with Reports:**
1. **Check screenshots** - Visual verification of failures
2. **Review videos** - Understand test flow
3. **Analyze traces** - Deep dive into specific issues
4. **Compare diffs** - See what changed
5. **Filter strategically** - Focus on relevant failures

---

## 📊 Sample CI/CD Integration

### GitHub Actions Example

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
      - name: Run tests
        run: npx playwright test
      - name: Upload HTML report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-results/
```

### Jenkins Example

```groovy
pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps'
        sh 'npx playwright test'
      }
    }
  }
  post {
    always {
      publishHTML([
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        reportName: 'Playwright Test Report'
      ])
      junit 'results.xml'
    }
  }
}
```

---

## ❓ Common Issues and Solutions

### Issue: HTML report not opening automatically
**Solution:** Configure the `open` option:
```typescript
reporter: [['html', { open: 'on-failure' }]]
```

### Issue: Reports not found in CI
**Solution:** Ensure correct artifact paths:
```yaml
- uses: actions/upload-artifact@v4
  with:
    path: playwright-report/
    # Make sure path matches outputFolder config
```

### Issue: Large report files
**Solution:**
1. Reduce screenshot/video capture
2. Only capture on failure
3. Use blob reports for sharding

### Issue: Blob report merge fails
**Solution:** Ensure all shards complete:
```bash
# Wait for all shards before merging
npx playwright merge-reports --reporter html ./blob-report
```

---

## 📖 Additional Resources

**Playwright Documentation:**
- [Test Reporters](https://playwright.dev/docs/test-reporters)
- [Reporter API](https://playwright.dev/docs/api/class-reporter)
- [HTML Reporter](https://playwright.dev/docs/test-reporters#html-reporter)
- [Blob Reporter](https://playwright.dev/docs/test-reporters#blob-reporter)

**Third-Party Reporters:**
- [Allure Reporter](https://www.npmjs.com/package/allure-playwright)
- [Tesults Reporter](https://www.tesults.com/docs/playwright)
- [ReportPortal](https://github.com/reportportal/agent-js-playwright)

**CI/CD Integration Guides:**
- [GitHub Actions Integration](https://playwright.dev/docs/ci-intro#github-actions)
- [Jenkins Integration](https://playwright.dev/docs/ci#jenkins)
- [Azure Pipelines](https://playwright.dev/docs/ci#azure-pipelines)

---

## 🎉 Module Complete!

You now understand test reporting in Playwright! You've learned:

**Core Skills:**
- How to configure and use all built-in reporters
- Generating HTML, JSON, and JUnit reports
- Viewing and analyzing test results
- Setting up multiple reporters

**Advanced Techniques:**
- Environment-based reporter configuration
- Blob reports for sharded test execution
- Custom reporter implementation
- CI/CD pipeline integration

## 🚀 Next Steps

1. **Practice** - Configure different reporters for your test suite
2. **Experiment** - Try blob reports with test sharding
3. **Integrate** - Set up report uploads in your CI/CD pipeline
4. **Customize** - Create a custom reporter for your specific needs
5. **Optimize** - Fine-tune reporter settings for performance
6. **Share** - Make reports accessible to your team

---

**Ready to start?**
1. Begin with: [Reporting Basics](01_reporting_basics.md)
2. Explore: [Built-in Reporters](02_builtin_reporters.md)
3. Master: [HTML Reporter](03_html_reporter.md)
4. Integrate: [CI/CD Configuration](05_multiple_reporters.md)

**Happy Testing! 🎭**
