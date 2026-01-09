# Playwright Configuration

This guide explains how to configure Playwright tests using the `playwright.config.ts` file. Understanding configuration is crucial for customizing test behavior, managing multiple browsers, and optimizing test execution.

## Configuration File Structure

Playwright uses a configuration file (`playwright.config.ts`) created using the `defineConfig` function:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Configuration options go here
});
```

**Important:** Test runner options are **top-level** in the config object. Do NOT put them into the `use` section.

---

## Essential Configuration Options

### 1. Test Discovery

These options control which test files Playwright will find and execute:

#### `testDir`
Specifies the directory containing test files (relative to the configuration file).

```typescript
export default defineConfig({
  testDir: './tests',  // Look for tests in the 'tests' folder
});
```

#### `testMatch`
Uses glob patterns to identify test files. Default: `.*(test|spec).(js|ts|mjs)`

```typescript
export default defineConfig({
  testMatch: '**/*.test.ts',  // Only match files ending in .test.ts
});
```

#### `testIgnore`
Excludes files from test discovery using patterns.

```typescript
export default defineConfig({
  testIgnore: '**/helpers/**',  // Ignore files in helpers folder
});
```

---

### 2. Execution Control

These options control how tests run:

#### `fullyParallel`
Enables all tests across all files to run concurrently.

```typescript
export default defineConfig({
  fullyParallel: true,  // Run all tests in parallel
});
```

**Benefits:**
- Faster test execution
- Better resource utilization

**Considerations:**
- Tests must be independent
- Shared resources need proper handling

#### `workers`
Limits the number of concurrent worker processes. Accepts numbers or percentages.

```typescript
export default defineConfig({
  workers: 4,              // Use 4 parallel workers
  // OR
  workers: '50%',          // Use 50% of CPU cores
  // OR
  workers: process.env.CI ? 1 : undefined,  // 1 worker on CI, default locally
});
```

#### `timeout`
Sets the per-test duration limit in milliseconds. Default: 30 seconds.

```typescript
export default defineConfig({
  timeout: 60000,  // 60 seconds per test
});
```

**Timeout includes:**
- Test function execution
- Fixture setup and teardown
- Before/After hooks

#### `retries`
Configures retry attempts for failed tests.

```typescript
export default defineConfig({
  retries: process.env.CI ? 2 : 0,  // Retry twice on CI, no retries locally
});
```

**Use cases:**
- Handle flaky tests on CI
- Network-dependent tests
- Third-party service integration

---

### 3. Safety Features

#### `forbidOnly`
Exits with an error if `test.only` markers remain in code. Essential for CI pipelines.

```typescript
export default defineConfig({
  forbidOnly: !!process.env.CI,  // Fail CI build if test.only is found
});
```

---

### 4. The `use` Section

The `use` section contains **shared settings** for all projects. These are NOT test runner options.

```typescript
export default defineConfig({
  use: {
    // Base URL for relative navigation
    baseURL: 'http://localhost:3000',

    // Collect trace when retrying failed tests
    trace: 'on-first-retry',

    // Run tests in headless mode
    headless: true,

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video recording
    video: 'retain-on-failure',

    // Viewport size
    viewport: { width: 1280, height: 720 },

    // Browser launch options
    launchOptions: {
      slowMo: 100,  // Slow down by 100ms (useful for debugging)
    },
  },
});
```

---

### 5. Projects Configuration

The `projects` array enables running tests across multiple browser configurations and environments.

```typescript
export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

**Device Profiles Available:**
- Desktop: Chrome, Firefox, Safari, Edge
- Mobile: iPhone, iPad, Pixel, Galaxy

**Each project can have its own:**
- Browser type
- Viewport size
- Device emulation
- User agent
- Timeout settings

---

### 6. Output and Reporting

#### `outputDir`
Designates folder location for test artifacts (screenshots, videos, traces).

```typescript
export default defineConfig({
  outputDir: './test-results',  // Store artifacts here
});
```

#### `reporter`
Selects output format for test results.

```typescript
export default defineConfig({
  reporter: 'html',  // HTML reporter
  // OR multiple reporters
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'junit.xml' }],
  ],
});
```

**Available reporters:**
- `html`: Interactive HTML report
- `list`: Line-by-line results (default)
- `dot`: Compact dot notation
- `json`: JSON output for CI integration
- `junit`: JUnit XML format

---

### 7. Web Server Configuration

Automatically launches a development server before tests begin.

```typescript
export default defineConfig({
  webServer: {
    command: 'npm run start',      // Command to start server
    port: 3000,                     // Port to wait for
    timeout: 120000,                // Max time to wait (2 minutes)
    reuseExistingServer: !process.env.CI,  // Don't start if already running (local dev)
  },
});
```

**Common use cases:**
- Start dev server for testing
- Launch API server
- Start database or mock services

---

### 8. Assertion Configuration

The `expect` object configures Web-first assertions separately from test timeouts.

```typescript
export default defineConfig({
  expect: {
    timeout: 5000,  // Default: 5 seconds for assertions

    // Screenshot comparison tolerances
    toHaveScreenshot: {
      maxDiffPixels: 100,           // Acceptable pixel variance
      maxDiffPixelRatio: 0.1,       // Acceptable ratio (0-1)
    },

    toMatchSnapshot: {
      maxDiffPixelRatio: 0.1,
    },
  },
});
```

---

### 9. Lifecycle Management

#### `globalSetup`
Runs once before all tests start.

```typescript
export default defineConfig({
  globalSetup: require.resolve('./global-setup.ts'),
});
```

**Example `global-setup.ts`:**
```typescript
async function globalSetup() {
  console.log('Starting global setup...');
  // Setup database, authentication, etc.
}

export default globalSetup;
```

#### `globalTeardown`
Runs once after all tests complete.

```typescript
export default defineConfig({
  globalTeardown: require.resolve('./global-teardown.ts'),
});
```

**Example `global-teardown.ts`:**
```typescript
async function globalTeardown() {
  console.log('Starting global teardown...');
  // Cleanup database, close connections, etc.
}

export default globalTeardown;
```

---

## 10. Browser and Device Emulation

Playwright enables comprehensive device and browser emulation to test how applications behave under different conditions.

### Viewport Configuration

Control the size of the browser window:

```typescript
export default defineConfig({
  use: {
    viewport: { width: 1280, height: 720 },  // Desktop viewport
    // OR
    viewport: { width: 375, height: 667 },   // Mobile viewport (iPhone SE)
    // OR
    viewport: null,  // Use default browser viewport
  },
});
```

### Device Emulation

Emulate specific devices with pre-configured settings:

```typescript
import { devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // Desktop devices
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile devices
    {
      name: 'iPhone 13',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'iPhone 13 Pro',
      use: { ...devices['iPhone 13 Pro'] },
    },
    {
      name: 'Pixel 5',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Samsung Galaxy S9+',
      use: { ...devices['Galaxy S9+'] },
    },

    // Tablet devices
    {
      name: 'iPad Pro',
      use: { ...devices['iPad Pro'] },
    },
  ],
});
```

**Device profiles include:**
- Viewport size
- User agent
- Device scale factor (pixel ratio)
- Touch support
- Mobile/desktop indicators

### Locale and Timezone

Emulate different geographic locations and languages:

```typescript
export default defineConfig({
  use: {
    // Locale for date/time formatting and localization
    locale: 'en-GB',  // British English
    // OR
    locale: 'de-DE',  // German
    // OR
    locale: 'fr-FR',  // French

    // Timezone for accurate time-based testing
    timezoneId: 'Europe/Paris',
    // OR
    timezoneId: 'America/New_York',
    // OR
    timezoneId: 'Asia/Tokyo',
  },
});
```

### Geolocation

Set a specific geographic location:

```typescript
export default defineConfig({
  use: {
    geolocation: { longitude: 12.492507, latitude: 41.889938 },  // Rome, Italy
    permissions: ['geolocation'],  // Grant geolocation permission
  },
});
```

**Common use cases:**
- Testing location-based features
- Map applications
- Regional content delivery
- Store locators

### Permissions

Grant browser permissions to avoid permission prompts:

```typescript
export default defineConfig({
  use: {
    permissions: ['geolocation', 'notifications', 'camera', 'microphone'],
  },
});
```

**Available permissions:**
- `geolocation`
- `notifications`
- `camera`
- `microphone`
- `clipboard-read`
- `clipboard-write`

### Color Scheme

Emulate light or dark mode preferences:

```typescript
export default defineConfig({
  use: {
    colorScheme: 'dark',  // Test dark mode
    // OR
    colorScheme: 'light',  // Test light mode
  },
});
```

**Use cases:**
- Verify UI appearance in both themes
- Test theme switching functionality
- Ensure readability in different modes

### User Agent

Override the browser's user agent string:

```typescript
export default defineConfig({
  use: {
    userAgent: 'Mozilla/5.0 (Custom User Agent) AppleWebKit/537.36',
  },
});
```

### Reduced Motion

Emulate the `prefers-reduced-motion` media feature:

```typescript
export default defineConfig({
  use: {
    reducedMotion: 'reduce',  // Emulate reduced motion preference
    // OR
    reducedMotion: 'no-preference',  // Default behavior
  },
});
```

---

## 11. Recording and Debugging Options

Playwright provides powerful recording capabilities to help debug test failures and understand test execution.

### Screenshots

Capture screenshots at different stages:

```typescript
export default defineConfig({
  use: {
    screenshot: 'off',  // Never take screenshots (default)
    // OR
    screenshot: 'on',  // Always take screenshots after each test
    // OR
    screenshot: 'only-on-failure',  // Take screenshots only when tests fail
  },
});
```

**Screenshot locations:**
- Saved to the `outputDir` (default: `test-results`)
- Named with test name and timestamp
- Available in HTML report

**Manual screenshots in tests:**
```typescript
await page.screenshot({ path: 'screenshot.png' });
```

### Video Recording

Record videos of test execution:

```typescript
export default defineConfig({
  use: {
    video: 'off',  // No video recording (default)
    // OR
    video: 'on',  // Always record video
    // OR
    video: 'retain-on-failure',  // Keep videos only for failed tests
    // OR
    video: 'on-first-retry',  // Record when retrying failed tests
  },
});
```

**Video configuration options:**

```typescript
export default defineConfig({
  use: {
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 },  // Video dimensions
    },
  },
});
```

**Important notes:**
- Videos are saved to `outputDir/video` folder
- Automatically deleted for passing tests (when using `retain-on-failure`)
- WebM format by default
- Viewable in the HTML report

### Trace Recording

Playwright traces capture a complete timeline of test execution:

```typescript
export default defineConfig({
  use: {
    trace: 'off',  // No trace recording (default)
    // OR
    trace: 'on',  // Always record traces
    // OR
    trace: 'retain-on-failure',  // Keep traces only for failed tests
    // OR
    trace: 'on-first-retry',  // Record traces when retrying (recommended)
  },
});
```

**Advanced trace configuration:**

```typescript
export default defineConfig({
  use: {
    trace: {
      mode: 'on-first-retry',
      screenshots: true,     // Include screenshots in trace
      snapshots: true,       // Include DOM snapshots
      sources: true,         // Include source code
    },
  },
});
```

**What traces capture:**
- Network requests and responses
- Page interactions and events
- Screenshots at each action
- DOM snapshots before and after actions
- Console messages
- Source code context

**Viewing traces:**
```bash
npx playwright show-trace test-results/trace.zip
```

The Trace Viewer provides:
- Timeline of all actions
- Screenshots at each step
- Network activity
- Console logs
- Source code
- Action details with timing

### Combining Recording Options

Recommended configuration for debugging and CI:

```typescript
export default defineConfig({
  use: {
    // Local development
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
});
```

**For CI environments:**
```typescript
export default defineConfig({
  use: {
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
  },
});
```

### Artifacts Storage

All recordings are stored in the output directory:

```typescript
export default defineConfig({
  outputDir: './test-results',  // All artifacts go here
});
```

**Directory structure:**
```
test-results/
├── screenshots/
│   └── test-name-failed.png
├── videos/
│   └── test-name.webm
└── traces/
    └── test-name.zip
```

### Debugging Configuration Example

Complete debugging setup with all recording options:

```typescript
export default defineConfig({
  use: {
    // Browser behavior
    headless: false,              // Show browser window
    slowMo: 500,                  // Slow down by 500ms

    // Recording options
    screenshot: 'on',             // Always capture screenshots
    video: 'on',                  // Always record video
    trace: 'on',                  // Always record traces

    // Additional debug info
    launchOptions: {
      devtools: true,             // Open DevTools automatically
    },
  },

  workers: 1,                     // Run tests sequentially
  timeout: 0,                     // Disable timeout for debugging
});
```

---

## Complete Configuration Example

Here's a comprehensive example combining multiple configuration options:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test discovery
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  testIgnore: '**/helpers/**',

  // Execution control
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,

  // Safety
  forbidOnly: !!process.env.CI,

  // Output
  outputDir: './test-results',
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }],
  ],

  // Shared settings
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
  },

  // Assertion configuration
  expect: {
    timeout: 5000,
  },

  // Multiple browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Start dev server
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Configuration Tips

### 1. Environment-Specific Settings

Use environment variables for different configurations:

```typescript
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: process.env.HEADLESS !== 'false',
  },

  workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : undefined,
});
```

### 2. Project-Specific Overrides

Override global settings per project:

```typescript
projects: [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      viewport: { width: 1920, height: 1080 },  // Custom viewport
    },
    timeout: 60000,  // Longer timeout for this project
  },
]
```

### 3. Debugging Configuration

Settings for easier debugging:

```typescript
export default defineConfig({
  use: {
    headless: false,           // See the browser
    slowMo: 500,               // Slow down operations by 500ms
    video: 'on',               // Always record video
    screenshot: 'on',          // Always take screenshots
  },
  workers: 1,                  // Run tests one at a time
  timeout: 0,                  // Disable timeout
});
```

### 4. CI/CD Optimization

Settings optimized for CI environments:

```typescript
export default defineConfig({
  workers: 1,                          // Single worker for stability
  retries: 2,                          // Retry failed tests
  forbidOnly: true,                    // Prevent test.only
  use: {
    trace: 'retain-on-failure',        // Keep traces for failures
    screenshot: 'only-on-failure',     // Screenshots on failure
    video: 'retain-on-failure',        // Videos on failure
  },
  reporter: [['html'], ['junit']],     // Multiple report formats
});
```

---

## Common Configuration Patterns

### Pattern 1: Multiple Environments

```typescript
const environments = {
  dev: 'http://localhost:3000',
  staging: 'https://staging.example.com',
  production: 'https://example.com',
};

export default defineConfig({
  use: {
    baseURL: environments[process.env.ENV || 'dev'],
  },
});
```

### Pattern 2: Tagged Tests

Run different test suites:

```typescript
projects: [
  {
    name: 'smoke',
    testMatch: '**/*.smoke.spec.ts',
    retries: 0,
  },
  {
    name: 'regression',
    testMatch: '**/*.spec.ts',
    testIgnore: '**/*.smoke.spec.ts',
    retries: 2,
  },
]
```

### Pattern 3: Authentication Setup

```typescript
projects: [
  {
    name: 'setup',
    testMatch: '**/*.setup.ts',
  },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
    dependencies: ['setup'],  // Run setup first
  },
]
```

---

## Key Takeaways

1. **Top-level options** control test discovery and execution
2. **`use` section** contains shared settings for browser behavior
3. **`projects`** enable multi-browser testing
4. **Environment variables** allow flexible configuration
5. **Assertions and timeouts** are configured separately
6. **Global setup/teardown** run once for all tests
7. **Reporters** provide different output formats
8. **Web server** integration automates server startup
9. **Emulation options** simulate different devices, locales, and user preferences
10. **Recording features** (screenshots, videos, traces) aid in debugging and failure analysis

---

## For More Information

For comprehensive documentation on Playwright configuration, visit:
- **Test configuration**: https://playwright.dev/docs/test-configuration
- **Test use options** (emulation & recording): https://playwright.dev/docs/test-use-options
- **Test options API**: https://playwright.dev/docs/api/class-testoptions
- **Test reporters**: https://playwright.dev/docs/test-reporters
- **Advanced configuration**: https://playwright.dev/docs/test-advanced
- **Emulation**: https://playwright.dev/docs/emulation
- **Trace viewer**: https://playwright.dev/docs/trace-viewer

---

## Practice Exercise

Try modifying your `playwright.config.ts` to:
1. Set a custom timeout for your tests
2. Configure multiple browsers (Chrome, Firefox, Safari)
3. Enable video recording and trace on test failure
4. Set up a base URL and use relative paths in tests
5. Add mobile device emulation (iPhone and Android)
6. Configure dark mode testing with `colorScheme`
7. Set up locale and timezone emulation for international testing

Happy Configuring!
