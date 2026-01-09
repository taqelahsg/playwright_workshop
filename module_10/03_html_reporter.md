# HTML Reporter Deep Dive

The **HTML Reporter** is Playwright's most feature-rich and interactive reporter. It generates a self-contained web page with detailed test results, screenshots, videos, and traces.

## Why Use the HTML Reporter?

- 🎯 **Interactive UI** - Filter, search, and sort test results
- 📸 **Visual Artifacts** - Embedded screenshots and videos
- 🔍 **Trace Integration** - Built-in trace viewer
- 📊 **Detailed Analytics** - Duration, retries, error analysis
- 🤝 **Easy Sharing** - Self-contained folder, no server needed
- 🎭 **Perfect for Debugging** - All information in one place

## Configuration

### Basic Setup

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'html'
});
```

### With Options

```typescript
export default defineConfig({
  reporter: [['html', {
    outputFolder: 'playwright-report',  // Default
    open: 'on-failure',                 // 'always' | 'never' | 'on-failure'
  }]]
});
```

### Opening Behavior

```typescript
// Always open after test run
reporter: [['html', { open: 'always' }]]

// Never open automatically
reporter: [['html', { open: 'never' }]]

// Open only when tests fail (default)
reporter: [['html', { open: 'on-failure' }]]
```

##

 Generating and Viewing Reports

### Generate Report

```bash
# Run tests (HTML report generated automatically)
npx playwright test
```

### View Report

```bash
# Open the HTML report
npx playwright show-report

# Or open directly in browser
open playwright-report/index.html
```

### Custom Output Folder

```bash
# Specify output folder via CLI
npx playwright test --reporter=html:my-report

# Or in config
reporter: [['html', { outputFolder: 'my-report' }]]
```

## Report Structure

```
playwright-report/
  ├── index.html       # Main report page
  ├── data/
  │   └── *.json       # Test result data
  ├── trace/
  │   └── *.zip        # Trace files
  └── assets/
      ├── screenshots/
      └── videos/
```

The entire folder is **self-contained** - you can share or archive the whole directory.

## Navigating the HTML Report

### Main Dashboard

The landing page shows:

**Test Statistics:**
- Total tests executed
- Passed/Failed/Flaky/Skipped counts
- Total duration
- Success rate percentage

**Filter Controls:**
- ✅ Show passed tests
- ❌ Show failed tests
- 🔄 Show flaky tests
- ⏭️ Show skipped tests

**Search Bar:**
- Search by test name
- Filter by file path
- Find specific tests quickly

**Sort Options:**
- By status (failed first)
- By duration (slowest first)
- By name (alphabetical)
- By file path

### Test List View

Each test shows:

**Test Information:**
- ✅/❌ Status indicator
- Test title
- File path and line number
- Browser/project name
- Duration

**Quick Actions:**
- Click to expand details
- View error message
- See attachments
- Open trace

### Expanded Test Details

When you click on a test, you see:

**Test Metadata:**
- Full test path
- Project/browser
- Worker index
- Retry information (if any)
- Duration breakdown

**Error Information** (for failures):
- Error message
- Stack trace with clickable file links
- Expected vs actual values
- Diff viewer (for assertions)

**Test Steps:**
- Each action taken
- Step duration
- Screenshots at each step
- Expand/collapse groups

**Attachments:**
- Screenshots (inline preview)
- Videos (inline player)
- Traces (click to open viewer)
- Logs and other files

## Working with Screenshots

### Viewing Screenshots

Screenshots are embedded directly in the report:

**On Failure (default):**
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: 'only-on-failure'  // Default
  }
});
```

**On Every Test:**
```typescript
use: {
  screenshot: 'on'  // Capture for all tests
}
```

**Manual Screenshots:**
```typescript
test('example', async ({ page }) => {
  await page.goto('https://example.com');
  await page.screenshot({ path: 'screenshot.png' });
  // Shows up in HTML report attachments
});
```

### Screenshot Features in Report

- 📸 **Inline Preview** - Thumbnails in test details
- 🔍 **Full Size View** - Click to enlarge
- 📥 **Download** - Save individual screenshots
- 🏷️ **Named Attachments** - Custom screenshot names

## Working with Videos

### Video Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    video: 'on-first-retry'  // Default
    // Options: 'on' | 'off' | 'retain-on-failure' | 'on-first-retry'
  }
});
```

### Video Options

**Always Record:**
```typescript
use: {
  video: 'on'
}
```

**Only on Failure:**
```typescript
use: {
  video: 'retain-on-failure'
}
```

**Only on Retry:**
```typescript
use: {
  video: 'on-first-retry'  // Default
}
```

**Never Record:**
```typescript
use: {
  video: 'off'
}
```

### Video Player in Report

- ▶️ **Inline Player** - Watch videos directly in report
- ⏩ **Playback Controls** - Play, pause, seek
- 📥 **Download** - Save video file
- 🎬 **Full Test Recording** - Complete test execution

## Trace Viewer Integration

The HTML report includes a built-in trace viewer!

### Enable Tracing

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry'
    // Options: 'on' | 'off' | 'retain-on-failure' | 'on-first-retry'
  }
});
```

### Opening Traces from Report

1. Click on a failed test
2. Find "Traces" in attachments
3. Click trace file to open viewer

### Trace Viewer Features

- 🎬 **Timeline** - Full test execution timeline
- 🌐 **Network** - All network requests
- 📸 **Snapshots** - DOM state at each action
- 📝 **Console** - Console logs
- 🔍 **Source Code** - Test code with highlights
- 🎯 **Actions** - Every Playwright action

## Test Steps and Actions

### Viewing Test Steps

The HTML report shows detailed test steps:

**Basic Steps:**
```typescript
test('example', async ({ page }) => {
  await page.goto('https://example.com');
  await page.click('button');
  await page.fill('input', 'text');
});
```

**Report shows:**
```
✓ page.goto('https://example.com')  - 234ms
✓ page.click('button')               - 45ms
✓ page.fill('input', 'text')         - 12ms
```

### Custom Steps

```typescript
test('example', async ({ page }) => {
  await test.step('Login', async () => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
  });

  await test.step('Navigate to dashboard', async () => {
    await page.waitForURL('/dashboard');
    await page.click('nav >> text=Profile');
  });
});
```

**Report shows nested steps:**
```
✓ Login  - 1.2s
  ✓ page.goto('/login')  - 234ms
  ✓ page.fill('[name="email"]', '...')  - 12ms
  ✓ page.fill('[name="password"]', '...')  - 11ms
  ✓ page.click('button[type="submit"]')  - 156ms
✓ Navigate to dashboard  - 345ms
  ✓ page.waitForURL('/dashboard')  - 234ms
  ✓ page.click('nav >> text=Profile')  - 111ms
```

## Filtering and Searching

### Filter by Status

Click filter buttons to toggle:
- ✅ Passed tests
- ❌ Failed tests
- 🔄 Flaky tests
- ⏭️ Skipped tests

Combine filters to see specific combinations.

### Search Tests

**Search by name:**
```
login
```

**Search by file:**
```
auth/login.spec.ts
```

**Search by project:**
```
[chromium]
```

### Sort Tests

**By Status:**
- Failed tests appear first
- Helps prioritize fixes

**By Duration:**
- Slowest tests first
- Identify performance issues

**By Name:**
- Alphabetical order
- Easy to find specific tests

## Test Annotations and Metadata

### Test Annotations

```typescript
test('critical feature', async ({ page }) => {
  test.info().annotations.push({
    type: 'issue',
    description: 'https://github.com/org/repo/issues/123'
  });

  // Test code...
});
```

**Appears in HTML report:**
```
Annotations:
  issue: https://github.com/org/repo/issues/123
```

### Test Tags

```typescript
test('user login @smoke @auth', async ({ page }) => {
  // Test code...
});
```

Tags appear in test title and are searchable.

## Analyzing Test Duration

### Duration Breakdown

The report shows:
- Total test duration
- Individual step duration
- Retry duration (if applicable)

### Finding Slow Tests

1. Sort by duration (slowest first)
2. Click on slow test
3. Review step-by-step timing
4. Identify bottlenecks

**Example:**
```
Total: 5.2s
  page.goto()        - 2.1s  ← Slow network?
  page.waitFor()     - 2.8s  ← Timeout issue?
  page.click()       - 0.3s
```

## Retries and Flaky Tests

### Retry Information

When tests are retried, the report shows:
- Number of retry attempts
- Outcome of each attempt
- Duration of each attempt

**Example:**
```
Attempt 1: Failed (2.3s)
Attempt 2: Passed (2.1s)

Status: Flaky
```

### Identifying Flaky Tests

Filter by "Flaky" to see tests that:
- Failed on first attempt
- Passed on retry

**Flaky test indicators:**
- 🔄 Flaky badge
- Multiple attempt details
- Different outcomes per attempt

## Error Analysis

### Error Display

For failed tests, the report shows:

**Error Message:**
```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
```

**Expected vs Actual:**
```
Expected: visible
Received: hidden
```

**Stack Trace:**
```
    at tests/checkout.spec.ts:42:7
    at tests/checkout.spec.ts:38:3
```

Clicking file paths opens them (if configured in your editor).

### Assertion Diffs

For failed assertions, see:
- Expected value
- Actual value
- Visual diff (for strings/objects)

**Example:**
```diff
Expected:
{
  "name": "John Doe",
  "email": "john@example.com",
- "role": "admin"
+ "role": "user"
}
```

## Sharing Reports

### Self-Contained Folder

The entire `playwright-report` folder is self-contained:

```bash
# Zip and share
zip -r report.zip playwright-report/

# Upload to cloud storage
aws s3 cp playwright-report/ s3://bucket/reports/ --recursive
```

### CI Integration

**GitHub Actions:**
```yaml
- name: Upload HTML report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

**Link in PR comments:**
```yaml
- name: Comment PR
  uses: actions/github-script@v6
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: 'Test report: https://github.com/.../actions/runs/.../artifacts/...'
      })
```

## Best Practices

### 1. **Use Appropriate Opening Behavior**

```typescript
// Local development - open on failure
reporter: [['html', { open: 'on-failure' }]]

// CI - never open (view artifacts instead)
reporter: [['html', { open: 'never' }]]
```

### 2. **Capture Enough Context**

```typescript
use: {
  screenshot: 'only-on-failure',  // Captures failure state
  video: 'on-first-retry',        // Records flaky tests
  trace: 'on-first-retry'         // Full debugging info
}
```

### 3. **Use Custom Test Steps**

```typescript
await test.step('Login', async () => {
  // Login steps...
});
```

Makes reports easier to navigate and debug.

### 4. **Archive Important Reports**

```bash
# Keep failure reports
if grep -q "failed" test-results.json; then
  cp -r playwright-report reports/$(date +%Y-%m-%d)/
fi
```

### 5. **Link Reports from CI**

Make reports easily accessible:
- Upload as artifacts
- Comment on PRs with links
- Store in accessible locations

## Common Issues

### Issue: Report not generated
**Solution:** Ensure reporter is configured:
```typescript
reporter: 'html'
```

### Issue: Attachments missing
**Solution:** Configure screenshot/video/trace:
```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'on-first-retry',
  trace: 'on-first-retry'
}
```

### Issue: Report is too large
**Solution:** Reduce artifacts:
```typescript
use: {
  screenshot: 'only-on-failure',  // Not 'on'
  video: 'retain-on-failure',     // Not 'on'
  trace: 'on-first-retry'         // Not 'on'
}
```

### Issue: Can't open report
**Solution:** Use the CLI:
```bash
npx playwright show-report
```

## Summary

The HTML Reporter provides:
- ✅ Interactive web-based interface
- ✅ Embedded screenshots and videos
- ✅ Built-in trace viewer
- ✅ Detailed error analysis
- ✅ Test step breakdown
- ✅ Filtering and search
- ✅ Self-contained and shareable

## Next Steps

Now you understand the HTML reporter:
1. Learn about JSON and JUnit formats → [JSON and JUnit Reports](04_json_junit_reports.md)
2. Configure multiple reporters → [Multiple Reporters](05_multiple_reporters.md)
3. Work with blob reports → [Blob Reports](06_blob_reports.md)
