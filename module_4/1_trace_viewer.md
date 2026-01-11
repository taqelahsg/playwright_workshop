# Playwright Trace Viewer

This guide explains how to use the Playwright Trace Viewer to debug and analyze your test executions with powerful visual debugging capabilities.

## What is the Trace Viewer?

The Trace Viewer is a GUI tool that helps you explore recorded Playwright traces after test execution. It provides a comprehensive view of everything that happened during your test, making it invaluable for debugging failed tests, especially in CI/CD environments.

**Key capabilities:**
- **Timeline visualization** - See every action in chronological order
- **DOM snapshots** - View before/after states of each action
- **Network activity** - Inspect all network requests and responses
- **Console logs** - Review all browser console output
- **Screenshots** - Visual filmstrip of test execution
- **Source code mapping** - Jump directly to the code that executed each action
- **Local or web-based** - Use via CLI or upload to trace.playwright.dev

**Why use Trace Viewer?**
- **Debug CI failures** - Investigate flaky tests without reproducing locally
- **Visual debugging** - See exactly what the browser saw during execution
- **Performance analysis** - Identify slow actions and network bottlenecks
- **Complete context** - Access all test artifacts in one place
- **Privacy-first** - Browser-based viewer processes everything locally

---

## Recording Traces

### Method 1: Configuration File (Recommended for CI)

The best approach for CI environments is configuring traces in `playwright.config.ts`:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Record trace on first retry of failed tests
    trace: 'on-first-retry',

    // Also capture screenshots (included in trace)
    screenshot: 'only-on-failure',
  },

  // Enable retries to trigger trace recording
  retries: process.env.CI ? 2 : 0,
});
```

#### Trace Recording Options

| Option | Description | Best For |
|--------|-------------|----------|
| `'on-first-retry'` | Records trace only when a test fails and retries (recommended) | **CI environments** - balances debugging info with storage costs |
| `'on-all-retries'` | Records trace on every retry attempt | Debugging persistent flaky tests |
| `'retain-on-failure'` | Keeps traces only from failed tests | Comprehensive failure debugging |
| `'on'` | Always records traces for every test | Local debugging sessions |
| `'off'` | Disables trace recording | Production runs without debugging needs |

**Recommended CI Setup:**

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry',
  },
  retries: process.env.CI ? 2 : 0,
});
```

This configuration:
- Runs tests normally on first attempt
- If a test fails, retries it **with tracing enabled**
- Minimizes storage and performance impact
- Provides debugging data when you need it

### Method 2: CLI Flag

For local development and debugging specific tests:

```bash
# Enable tracing for all tests
npx playwright test --trace on

# Run specific test with tracing
npx playwright test login.spec.ts --trace on

# Trace with screenshots
npx playwright test --trace on --screenshot on
```

**CLI Trace Options:**

```bash
# Always record traces
npx playwright test --trace on

# Only on first retry (like config option)
npx playwright test --trace on-first-retry

# Only keep traces from failures
npx playwright test --trace retain-on-failure

# Disable tracing
npx playwright test --trace off
```

### Method 3: Programmatic (Per-Test Control)

Enable tracing for individual tests using the test API:

```typescript
import { test } from '@playwright/test';

test.use({ trace: 'on' });

test('critical user flow', async ({ page }) => {
  // This test will always be traced
  await page.goto('https://example.com');
  // ... test steps
});
```

Or start/stop tracing manually:

```typescript
test('custom trace control', async ({ page, context }) => {
  // Start tracing
  await context.tracing.start({ screenshots: true, snapshots: true });

  // Your test actions
  await page.goto('https://example.com');
  await page.click('#submit');

  // Stop and save trace
  await context.tracing.stop({ path: 'trace.zip' });
});
```

**Advanced Tracing Options:**

```typescript
await context.tracing.start({
  screenshots: true,     // Capture screenshots
  snapshots: true,       // Capture DOM snapshots
  sources: true,         // Include source code
  title: 'My Test',      // Trace title in viewer
  name: 'critical-flow', // Custom trace name
});
```

### Method 4: UI Mode (Best for Local Development)

UI Mode automatically traces each test, providing better developer experience:

```bash
# Start UI Mode (auto-enables tracing)
npx playwright test --ui
```

UI Mode benefits:
- **Automatic tracing** - Every test run is traced
- **Instant replay** - View traces immediately after execution
- **Interactive debugging** - Step through actions
- **Time travel** - Inspect any point in test execution
- **No manual trace management** - Built-in trace viewer

---

## Opening and Viewing Traces

### Method 1: Command Line (Local Viewer)

Open traces using the Playwright CLI:

```bash
# Open a specific trace file
npx playwright show-trace trace.zip

# Open trace from test results
npx playwright show-trace test-results/login-chromium/trace.zip

# Multiple traces in same window
npx playwright show-trace trace1.zip trace2.zip trace3.zip
```

**Finding Trace Files:**

By default, traces are saved in the `test-results` directory:

```bash
# List all trace files
ls -R test-results/ | grep trace.zip

# Common trace locations
test-results/
  ├── test-name-chromium/
  │   └── trace.zip
  ├── test-name-firefox/
  │   └── trace.zip
  └── test-name-webkit/
      └── trace.zip
```

### Method 2: Web-Based Viewer (trace.playwright.dev)

Visit [trace.playwright.dev](https://trace.playwright.dev) to use the browser-based viewer:

1. **Navigate** to https://trace.playwright.dev
2. **Drag and drop** your trace.zip file onto the page
3. **Explore** the trace in your browser

**Important Privacy Note:**
- The trace viewer is **entirely client-side**
- No data is transmitted to external servers
- All processing happens in your browser
- Safe to upload sensitive traces

**Remote Trace URLs:**

```bash
# Open trace from URL
npx playwright show-trace https://example.com/trace.zip

# Useful for sharing traces
# Upload trace to cloud storage, share URL
```

### Method 3: From Test Results HTML Report

Playwright's HTML report includes embedded trace viewer:

```bash
# Generate HTML report with traces
npx playwright test --reporter=html

# Open the report
npx playwright show-report
```

In the report:
1. Click on a failed test
2. Click the **"Trace"** tab
3. Trace viewer opens inline

### Method 4: From UI Mode

```bash
# Run tests in UI Mode
npx playwright test --ui

# After test completes:
# 1. Select the test from sidebar
# 2. Click "Trace" tab
# 3. Explore trace interactively
```

---

## Understanding the Trace Viewer Interface

The Trace Viewer is divided into several panels, each providing different insights:

### 1. Actions Panel (Left Sidebar)

Displays a chronological list of all actions performed during the test:

```
✓ page.goto('https://example.com')          120ms
✓ page.click('text=Login')                   45ms
✓ page.fill('#email', 'user@example.com')    20ms
✓ page.fill('#password', '******')           18ms
✓ page.click('button[type="submit"]')        80ms
✓ expect(page).toHaveURL(/dashboard/)        15ms
```

**Action Details:**
- **Green checkmark** - Action succeeded
- **Red X** - Action failed (caused test failure)
- **Duration** - Time taken to complete
- **Locator** - Element selector used
- **Input values** - Data entered (passwords hidden)

**Filtering Actions:**
- Click search icon to filter by text
- Click action to see detailed information
- Double-click action to filter timeline

### 2. Timeline (Top Center)

Visual filmstrip showing screenshots of each action:

**Features:**
- **Filmstrip view** - Thumbnail for each action
- **Hover to magnify** - Enlarge screenshots on hover
- **Scrub through time** - Drag slider to navigate
- **Double-click to filter** - Focus on specific timeframe
- **Error markers** - Red indicators show where failures occurred

**Timeline Navigation:**
```
[Screenshot 1] [Screenshot 2] [Screenshot 3] ... [Screenshot N]
     |              |              |                    |
   goto()         click()        fill()            expect()
```

### 3. Snapshots Panel (Center)

Shows the complete DOM state at three key moments for each action:

#### Before Snapshot
The page state immediately before the action:
```html
<!-- Before clicking submit button -->
<form>
  <input id="email" value="user@example.com">
  <input id="password" value="password123">
  <button type="submit">Sign In</button> <!-- About to be clicked -->
</form>
```

#### Action Snapshot
The exact moment during action execution (shows click location):
```html
<!-- During click action - shows click coordinates -->
<button type="submit" style="background: blue;">
  Sign In <!-- Click happened at x: 250, y: 100 -->
</button>
```

#### After Snapshot
The page state after the action completed:
```html
<!-- After click, page navigated -->
<div class="dashboard">
  <h1>Welcome User</h1>
</div>
```

**Snapshot Features:**
- **Fully interactive DOM** - Inspect elements, view styles
- **Click visualization** - See exact click coordinates
- **DevTools integration** - Right-click to inspect
- **Source viewing** - View rendered HTML and CSS

### 4. Source Code Panel (Bottom Right)

Shows the exact test code that executed:

```typescript
// Highlighted line shows current action
await page.goto('https://example.com');
await page.click('text=Login');
await page.fill('#email', 'user@example.com'); // ← Currently here
await page.fill('#password', 'password123');
await page.click('button[type="submit"]');
```

**Navigation:**
- **Auto-scroll** - Follows selected action
- **Jump to file** - Click to open in editor
- **Stack traces** - View full call stack
- **Line numbers** - Reference exact code location

### 5. Network Panel (Bottom Center)

Displays all network requests made during the test:

```
GET  https://example.com/                    200  1.2s  document
GET  https://example.com/styles.css          200  150ms text/css
GET  https://example.com/app.js              200  300ms application/javascript
POST https://api.example.com/auth/login      200  450ms application/json
GET  https://api.example.com/user/profile    200  220ms application/json
```

**Request Details:**
- **Method** - GET, POST, PUT, DELETE, etc.
- **URL** - Request endpoint
- **Status** - HTTP status code
- **Duration** - Response time
- **Type** - Content type
- **Size** - Response size

**Click any request to view:**
- Request headers
- Request body (POST/PUT)
- Response headers
- Response body
- Cookies
- Timing breakdown

**Filtering:**
- Click action to show only related requests
- Filter by type (XHR, CSS, JS, Images)
- Search by URL pattern
- Filter by status code

### 6. Console Panel (Bottom)

Shows all browser console output:

```
[log]   Application initialized
[warn]  Deprecated API usage detected
[error] Failed to load resource: net::ERR_FAILED
[info]  User logged in successfully
```

**Log Types:**
- **console.log** - Standard output
- **console.warn** - Warnings
- **console.error** - Errors
- **Network errors** - Failed requests
- **Script errors** - JavaScript exceptions

**Filtering Console:**
- Filter by log level (log, warn, error)
- Search by text
- Click action to see related logs
- View stack traces for errors

### 7. Metadata Tab

Provides test execution details:

```
Test: user can login
Browser: chromium (121.0.6167.57)
Platform: darwin
Viewport: 1280x720
Duration: 2,345ms
Date: 2024-03-15 14:30:45
```

**Includes:**
- Test name and file location
- Browser type and version
- Operating system
- Viewport dimensions
- Total duration
- Timestamp
- User agent string

### 8. Attachments Tab

Shows test artifacts for visual regression testing:

**Attachment Types:**
- **Screenshots** - Captured images
- **Videos** - Full test recordings (if enabled)
- **Custom attachments** - Files added via test code

**Visual Comparison:**
```typescript
// Add screenshot attachment
await test.attach('screenshot', {
  body: await page.screenshot(),
  contentType: 'image/png',
});
```

**Diff Viewer:**
- **Expected vs Actual** - Side-by-side comparison
- **Overlay mode** - Highlight differences
- **Slider** - Blend between images
- **Zoom** - Magnify specific areas

### 9. Errors Tab

Dedicated view for test failures:

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: page.getByRole('button', { name: 'Submit' })

Call log:
  - waiting for getByRole('button', { name: 'Submit' })
  - locator resolved to hidden <button>Submit</button>
```

**Error Information:**
- **Error message** - What went wrong
- **Locator** - Element that caused failure
- **Call log** - Detailed retry attempts
- **Stack trace** - Code path to error
- **DOM state** - Page state at failure
- **Timeline marker** - When error occurred (red indicator)

---

## Using the Trace Viewer Effectively

### 1. Debugging Failed Tests

When a test fails in CI:

**Step-by-step debugging:**

1. **Download the trace** from CI artifacts
   ```bash
   # Typically in test-results directory
   unzip test-results.zip
   npx playwright show-trace test-results/*/trace.zip
   ```

2. **Go to the Errors tab**
   - See the exact error message
   - Identify which action failed

3. **Review the timeline**
   - Find red error marker
   - See what happened before failure

4. **Check DOM snapshot**
   - Inspect "Before" snapshot to see page state
   - Verify element existence and visibility
   - Check for unexpected UI changes

5. **Review network requests**
   - Look for failed API calls
   - Check request/response data
   - Identify timing issues

6. **Check console logs**
   - Look for JavaScript errors
   - Review warnings before failure

**Example: Login Test Failed**

```
Error: Timed out waiting for locator.click()
```

**Investigation:**
1. Click failed action in Actions panel
2. Check "Before" snapshot - button is disabled!
3. Review console - "Validation error: Invalid email"
4. Check network - POST /login returned 400
5. **Root cause**: Email validation failed, button disabled

### 2. Analyzing Flaky Tests

Flaky tests intermittently fail. Trace Viewer helps identify causes:

**Common flaky test patterns:**

#### Race Conditions

```typescript
// Flaky: Click might happen before element is ready
await page.goto('https://example.com');
await page.click('button'); // ← Sometimes fails
```

**Trace analysis:**
1. Compare successful vs failed trace
2. Check timing differences
3. Review network timing in both cases
4. **Solution**: Add explicit wait
   ```typescript
   await page.waitForLoadState('networkidle');
   await page.click('button');
   ```

#### Network Timing Issues

**Trace reveals:**
- API response took 3s (normally 500ms)
- Test timeout: 5s
- Click waited for API response
- **Solution**: Increase timeout or optimize API

#### DOM State Issues

**Before snapshot shows:**
- Element exists but is hidden
- Element is covered by another element
- Element is outside viewport

**Solutions:**
- Wait for visibility: `await page.waitForSelector('#btn', { state: 'visible' })`
- Scroll into view: `await element.scrollIntoViewIfNeeded()`
- Wait for animation: `await page.waitForTimeout(300)`

### 3. Performance Analysis

Identify slow actions and bottlenecks:

**In Actions panel:**
```
✓ page.goto('/')                    2,500ms  ← Slow!
✓ page.waitForSelector('#content')  1,800ms  ← Waiting
✓ page.click('button')                 45ms  ← Fast
```

**Investigation:**
1. **Slow navigation** (2.5s goto)
   - Check Network panel
   - Find largest/slowest resources
   - Look for blocking requests

2. **Long waits** (1.8s waitForSelector)
   - Check what loaded during wait
   - Review timeline screenshots
   - Identify render-blocking resources

**Optimization opportunities:**
- Defer non-critical resources
- Optimize image sizes
- Reduce JavaScript bundle size
- Use network mocking for tests

### 4. Understanding Test Flow

Use Trace Viewer to understand complex test scenarios:

**Timeline scrubbing:**
1. Use slider to navigate through test
2. Watch UI changes in screenshots
3. See state transitions
4. Understand user journey

**Example: Multi-step checkout:**
```
1. Add to cart      → See cart icon update
2. Proceed checkout → Navigation to checkout page
3. Fill shipping    → Form population
4. Fill payment     → Payment fields filled
5. Submit order     → Loading spinner → Success page
```

**Benefits:**
- Visualize full user flow
- Verify UI feedback at each step
- Identify missing transitions
- Spot UX issues

### 5. Network Debugging

Deep dive into API interactions:

**Filter by action:**
1. Click "Fill email" action
2. Network panel shows only related requests
3. See validation API call
4. Check request payload and response

**API debugging example:**

```typescript
// Test: Create new user
await page.fill('#email', 'test@example.com');
await page.fill('#password', 'password123');
await page.click('button[type="submit"]');
```

**Network panel shows:**
```
POST /api/users/create
Request: { "email": "test@example.com", "password": "..." }
Response: { "error": "Email already exists" }
Status: 409 Conflict
```

**Without trace, error is unclear. With trace:**
- See exact request/response
- Identify backend validation issue
- Fix test to use unique email

### 6. Comparing Multiple Traces

Open multiple traces to compare:

```bash
# Compare successful vs failed run
npx playwright show-trace \
  test-results/success/trace.zip \
  test-results/failure/trace.zip
```

**Comparison workflow:**
1. Open both traces
2. Switch between tabs
3. Compare timelines
4. Identify differences in:
   - Action timing
   - Network responses
   - DOM states
   - Console errors

**Example:**
- **Success**: API returned in 200ms
- **Failure**: API returned in 5500ms (timeout!)

---

## Advanced Trace Techniques

### Custom Trace Segments

Record specific portions of your test:

```typescript
test('custom trace segments', async ({ page, context }) => {
  await page.goto('https://example.com');

  // Start tracing for critical section only
  await context.tracing.start({
    name: 'checkout-flow',
    screenshots: true,
    snapshots: true,
  });

  // Critical actions to trace
  await page.click('text=Add to Cart');
  await page.click('text=Checkout');
  await page.fill('#credit-card', '4111111111111111');
  await page.click('text=Submit Order');

  // Stop and save
  await context.tracing.stop({
    path: 'traces/checkout-flow.zip',
  });
});
```

**Benefits:**
- Focus on specific scenarios
- Reduce trace file size
- Organize traces by feature
- Share relevant segments

### Trace with Custom Attachments

Add context to traces:

```typescript
test('trace with custom data', async ({ page }, testInfo) => {
  await page.goto('https://example.com');

  // Attach API response for debugging
  const response = await page.request.get('/api/data');
  await testInfo.attach('api-response', {
    body: await response.text(),
    contentType: 'application/json',
  });

  // Attach screenshot at specific point
  await testInfo.attach('before-submit', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  await page.click('button[type="submit"]');
});
```

**Attachments appear in Attachments tab:**
- API responses
- Screenshots
- Log files
- JSON data
- Custom debugging info

### Conditional Tracing

Enable tracing only when needed:

```typescript
test('conditional trace', async ({ page, context }, testInfo) => {
  const isCI = !!process.env.CI;
  const isCriticalTest = testInfo.title.includes('critical');

  if (isCI || isCriticalTest) {
    await context.tracing.start({ screenshots: true });
  }

  // Test code
  await page.goto('https://example.com');
  // ...

  if (isCI || isCriticalTest) {
    await context.tracing.stop({
      path: `traces/${testInfo.title}.zip`,
    });
  }
});
```

### Trace Naming and Organization

Organize traces systematically:

```typescript
test.beforeEach(async ({ context }, testInfo) => {
  await context.tracing.start({
    title: testInfo.title,
    name: `${testInfo.project.name}-${testInfo.title}`,
    screenshots: true,
    snapshots: true,
  });
});

test.afterEach(async ({ context }, testInfo) => {
  await context.tracing.stop({
    path: `traces/${testInfo.project.name}/${testInfo.title}/trace.zip`,
  });
});
```

**Organized structure:**
```
traces/
  ├── chromium/
  │   ├── login-test/trace.zip
  │   └── checkout-test/trace.zip
  ├── firefox/
  │   ├── login-test/trace.zip
  │   └── checkout-test/trace.zip
  └── webkit/
      ├── login-test/trace.zip
      └── checkout-test/trace.zip
```

---

## Best Practices

### 1. Configure Tracing for Different Environments

**Development:**
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on', // Always trace locally
    screenshot: 'on',
    video: 'on',
  },
});
```

**CI (Recommended):**
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry', // Trace only on retry
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  retries: 2,
});
```

**Production Smoke Tests:**
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'retain-on-failure', // Keep failed traces
    screenshot: 'only-on-failure',
    video: 'off', // Save storage
  },
});
```

### 2. Minimize Trace File Size

Traces can be large. Optimize storage:

**Selective tracing:**
```typescript
// Only trace critical tests
test.describe('Critical Flows', () => {
  test.use({ trace: 'on' });

  test('checkout', async ({ page }) => {
    // Traced
  });
});

test.describe('Non-Critical', () => {
  test.use({ trace: 'off' });

  test('footer links', async ({ page }) => {
    // Not traced
  });
});
```

**Limit snapshot frequency:**
```typescript
await context.tracing.start({
  screenshots: true,
  snapshots: true,
  sources: false, // Skip source code to reduce size
});
```

**Clean up old traces:**
```bash
# Delete traces older than 7 days
find test-results -name "trace.zip" -mtime +7 -delete
```

### 3. Use Traces for Test Documentation

Traces serve as living documentation:

```typescript
test('user registration flow @smoke', async ({ page, context }) => {
  // Trace captures the entire flow as documentation
  await context.tracing.start({
    title: 'User Registration - Happy Path',
    screenshots: true,
  });

  await page.goto('/register');
  await page.fill('#email', 'newuser@example.com');
  await page.fill('#password', 'SecurePass123!');
  await page.click('button:text("Create Account")');
  await expect(page).toHaveURL('/welcome');

  await context.tracing.stop({ path: 'docs/traces/registration.zip' });
});
```

**Share with team:**
- Upload trace to shared storage
- Include in documentation
- Use for onboarding
- Demo expected behavior

### 4. Integrate with CI/CD

**GitHub Actions example:**

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run tests
        run: npx playwright test

      - name: Upload traces
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-traces
          path: test-results/**/trace.zip
          retention-days: 30
```

**Access traces:**
1. Go to failed workflow run
2. Download "playwright-traces" artifact
3. Extract and open with `npx playwright show-trace`

### 5. Combine with Other Debugging Tools

Trace Viewer works well with other tools:

**With Playwright Inspector:**
```bash
# Debug with inspector, save trace
PWDEBUG=1 npx playwright test --trace on
```

**With Videos:**
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'retain-on-failure',
    video: 'retain-on-failure', // Video + trace = complete picture
  },
});
```

**With Screenshots:**
```typescript
test('combined debugging', async ({ page }, testInfo) => {
  await page.goto('https://example.com');

  // Manual screenshot at key moment
  await page.screenshot({ path: 'before-action.png' });

  await page.click('button');

  // Screenshot captured in trace automatically
  await expect(page.locator('.success')).toBeVisible();
});
```

---

## Troubleshooting Trace Viewer

### Trace File Won't Open

**Problem**: `npx playwright show-trace trace.zip` fails

**Solutions:**

```bash
# Verify file exists and is valid
ls -lh trace.zip
unzip -t trace.zip  # Test zip integrity

# Ensure Playwright is installed
npx playwright install

# Try web viewer instead
# Upload to https://trace.playwright.dev
```

### Trace File Too Large

**Problem**: Trace files are 50MB+ and slow to load

**Solutions:**

```typescript
// Reduce trace file size
await context.tracing.start({
  screenshots: false,    // Disable screenshots
  snapshots: true,       // Keep DOM snapshots
  sources: false,        // Don't include source code
});

// Or trace only specific sections
await context.tracing.start(); // Start
// ... critical actions only
await context.tracing.stop(); // Stop
```

### Missing Network Requests

**Problem**: Network panel is empty or incomplete

**Cause**: Trace started after requests completed

**Solution:**

```typescript
// Start tracing BEFORE navigation
await context.tracing.start({ screenshots: true, snapshots: true });
await page.goto('https://example.com'); // Now captured

// Not this:
await page.goto('https://example.com');
await context.tracing.start(); // Too late!
```

### No DOM Snapshots

**Problem**: Snapshot panel shows "No snapshot available"

**Cause**: Snapshots disabled or trace corrupted

**Solution:**

```typescript
// Ensure snapshots are enabled
await context.tracing.start({
  screenshots: true,
  snapshots: true, // ← Must be true
});
```

### Trace Not Generated in CI

**Problem**: CI passes/fails but no trace file created

**Cause**: Wrong configuration or no retries

**Solution:**

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry', // Requires retry
  },
  retries: process.env.CI ? 2 : 0, // ← Must have retries!
});
```

**Or force trace on failure:**

```typescript
export default defineConfig({
  use: {
    trace: 'retain-on-failure', // Always on failure, no retry needed
  },
});
```

---

## Quick Reference

### Trace Recording Options

| Configuration | Description | Use Case |
|--------------|-------------|----------|
| `trace: 'on'` | Always record | Local development |
| `trace: 'off'` | Never record | Production |
| `trace: 'on-first-retry'` | Record on first retry | **CI (recommended)** |
| `trace: 'on-all-retries'` | Record all retries | Debugging flaky tests |
| `trace: 'retain-on-failure'` | Keep failed traces | Failure investigation |

### CLI Commands

| Command | Description |
|---------|-------------|
| `npx playwright show-trace trace.zip` | Open trace viewer |
| `npx playwright test --trace on` | Run with tracing |
| `npx playwright test --ui` | UI Mode with auto-tracing |
| `npx playwright show-report` | HTML report with traces |

### Trace Viewer Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `←` / `→` | Navigate actions |
| `Space` | Play/pause timeline |
| `F` | Toggle fullscreen |
| `/` | Focus search |
| `Esc` | Close panels |

---

## Key Takeaways

1. **Essential for CI debugging** - Investigate failures without reproducing locally
2. **Complete test visibility** - See actions, network, console, DOM, and code
3. **Multiple access methods** - CLI, web browser, HTML report, UI Mode
4. **Privacy-first** - All processing happens locally
5. **Configure for environment** - Different settings for dev, CI, production
6. **On-first-retry recommended** - Balances debugging needs with storage
7. **Timeline navigation** - Scrub through test execution visually
8. **DOM snapshots** - Inspect before/after states of every action
9. **Network debugging** - See all requests, responses, and timing
10. **Share with team** - Upload traces to cloud for collaboration

---

## Next Steps

Now that you understand the Trace Viewer, try:
1. Enable tracing in your playwright.config.ts for CI
2. Intentionally fail a test and explore the trace
3. Compare traces from successful vs failed test runs
4. Use trace.playwright.dev to share a trace with a teammate
5. Analyze a slow test to identify performance bottlenecks
6. Set up CI to automatically upload traces as artifacts

## For More Information

Visit the official Playwright documentation:
- **Trace Viewer**: https://playwright.dev/docs/trace-viewer
- **Trace Viewer (trace.playwright.dev)**: https://trace.playwright.dev
- **Test configuration**: https://playwright.dev/docs/test-configuration
- **CI/CD integration**: https://playwright.dev/docs/ci

---

## Practice Exercise

Debug these scenarios using Trace Viewer:

1. **Failed login test**
   - Run test with `--trace on`
   - Open trace and identify why button click failed
   - Check DOM snapshot to see element state

2. **Slow page load**
   - Record trace of navigation test
   - Analyze Network panel to find slow resources
   - Identify optimization opportunities

3. **Flaky search test**
   - Compare traces from 3 test runs
   - Find timing differences
   - Determine root cause of flakiness

4. **API error investigation**
   - Trace test that fails on API call
   - Inspect request/response in Network panel
   - Verify error handling

Happy Debugging!
