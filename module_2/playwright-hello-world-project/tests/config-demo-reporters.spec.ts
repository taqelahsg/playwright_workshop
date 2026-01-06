/**
 * CONFIGURATION DEMO: Reporters
 *
 * This test file demonstrates different reporter configurations.
 * Reporters control how test results are displayed and saved.
 *
 * Configuration in playwright.config.ts:
 * reporter: 'html'  // Single reporter
 * reporter: [['html'], ['json', { outputFile: 'results.json' }]]  // Multiple reporters
 *
 * Reference: https://playwright.dev/docs/test-reporters
 */

import { test, expect } from '@playwright/test';

test.describe('Reporter Configuration Examples', () => {

  test('passing test - shown in all reporters', async ({ page }) => {
    // This test passes and will be reported as successful
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('test with annotations - visible in HTML reporter', async ({ page }) => {
    // Annotations appear in the HTML reporter
    test.info().annotations.push(
      { type: 'issue', description: 'https://github.com/issues/123' },
      { type: 'requirement', description: 'REQ-001' },
    );

    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('slow test - marked in reporter', async ({ page }) => {
    // Mark a test as slow (triples the timeout)
    test.slow();

    await page.goto('https://playwright.dev/');
    await page.waitForTimeout(2000); // Simulate slow operation
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('test with attachments - shown in HTML reporter', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Attach a screenshot to the test report
    const screenshot = await page.screenshot();
    await test.info().attach('screenshot', {
      body: screenshot,
      contentType: 'image/png',
    });

    // Attach text information
    await test.info().attach('page-title', {
      body: await page.title(),
      contentType: 'text/plain',
    });

    await expect(page).toHaveTitle(/Playwright/);
  });

  test('test with step organization', async ({ page }) => {
    // Steps help organize test actions in the reporter
    await test.step('Navigate to homepage', async () => {
      await page.goto('https://playwright.dev/');
    });

    await test.step('Verify page title', async () => {
      await expect(page).toHaveTitle(/Playwright/);
    });

    await test.step('Click Get Started link', async () => {
      await page.getByRole('link', { name: 'Get started' }).click();
    });

    await test.step('Verify navigation to docs', async () => {
      await expect(page).toHaveURL(/.*docs\/intro/);
    });
  });
});

test.describe('Test Metadata for Reporters', () => {

  test('test with custom tags', async ({ page }, testInfo) => {
    // Tags can be used to filter tests and appear in reports
    testInfo.annotations.push(
      { type: 'tag', description: '@smoke' },
      { type: 'tag', description: '@critical' },
    );

    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('test with fixture information', async ({ page, browserName }, testInfo) => {
    // Test info contains useful metadata for reporters
    console.log(`Test: ${testInfo.title}`);
    console.log(`File: ${testInfo.file}`);
    console.log(`Project: ${testInfo.project.name}`);
    console.log(`Browser: ${browserName}`);
    console.log(`Worker: ${testInfo.workerIndex}`);

    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });
});

/**
 * CONFIGURATION TIP: Available Reporters
 *
 * 1. HTML Reporter (Interactive, for local development)
 *    reporter: 'html'
 *
 * 2. List Reporter (Line-by-line, default)
 *    reporter: 'list'
 *
 * 3. Dot Reporter (Compact, one dot per test)
 *    reporter: 'dot'
 *
 * 4. Line Reporter (One line per test)
 *    reporter: 'line'
 *
 * 5. JSON Reporter (Machine-readable)
 *    reporter: [['json', { outputFile: 'results.json' }]]
 *
 * 6. JUnit Reporter (For CI integration)
 *    reporter: [['junit', { outputFile: 'junit.xml' }]]
 *
 * 7. GitHub Actions Reporter (For GitHub CI)
 *    reporter: 'github'
 *
 * 8. Blob Reporter (For merging results)
 *    reporter: 'blob'
 *
 * EXAMPLE CONFIGURATIONS:
 *
 * Single reporter:
 * export default defineConfig({
 *   reporter: 'html',
 * });
 *
 * Multiple reporters:
 * export default defineConfig({
 *   reporter: [
 *     ['html', { open: 'never' }],           // HTML report, don't auto-open
 *     ['json', { outputFile: 'results.json' }],  // JSON output
 *     ['junit', { outputFile: 'junit.xml' }],    // JUnit XML for CI
 *     ['list'],                               // Console output
 *   ],
 * });
 *
 * Environment-specific reporters:
 * export default defineConfig({
 *   reporter: process.env.CI
 *     ? [['html'], ['junit', { outputFile: 'junit.xml' }], ['github']]
 *     : [['html', { open: 'on-failure' }], ['list']],
 * });
 *
 * HTML REPORTER OPTIONS:
 *
 * reporter: [
 *   ['html', {
 *     open: 'never',           // 'always', 'never', 'on-failure'
 *     outputFolder: 'playwright-report',  // Custom output folder
 *     host: 'localhost',       // Server host
 *     port: 9223,              // Server port
 *   }]
 * ]
 *
 * VIEWING REPORTS:
 *
 * HTML report:
 * npx playwright show-report
 *
 * JSON report:
 * cat results.json | jq
 *
 * JUnit report:
 * Used by CI tools (Jenkins, CircleCI, etc.)
 *
 * CUSTOM REPORTER:
 *
 * You can create custom reporters by implementing the Reporter interface:
 *
 * // custom-reporter.ts
 * import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
 *
 * class CustomReporter implements Reporter {
 *   onBegin(config, suite) {
 *     console.log('Starting tests...');
 *   }
 *
 *   onTestEnd(test: TestCase, result: TestResult) {
 *     console.log(`Test ${test.title}: ${result.status}`);
 *   }
 *
 *   onEnd(result) {
 *     console.log('Tests finished!');
 *   }
 * }
 *
 * export default CustomReporter;
 *
 * // playwright.config.ts
 * export default defineConfig({
 *   reporter: './custom-reporter.ts',
 * });
 *
 * REPORTER FEATURES:
 *
 * 1. Test Results:
 *    - Pass/Fail status
 *    - Duration
 *    - Retries
 *
 * 2. Artifacts:
 *    - Screenshots
 *    - Videos
 *    - Traces
 *    - Custom attachments
 *
 * 3. Metadata:
 *    - Test annotations
 *    - Browser/Project info
 *    - Worker information
 *
 * 4. Steps:
 *    - Organized test actions
 *    - Nested steps
 *    - Step duration
 *
 * VIEWING HTML REPORT AFTER TESTS:
 *
 * Automatic (if configured):
 * reporter: [['html', { open: 'on-failure' }]]
 *
 * Manual:
 * npx playwright show-report
 *
 * CI/CD (generate but don't open):
 * reporter: [['html', { open: 'never' }]]
 *
 * BEST PRACTICES:
 *
 * 1. Use HTML reporter for local development
 * 2. Use JUnit reporter for CI/CD integration
 * 3. Use JSON reporter for custom result processing
 * 4. Use GitHub reporter when running on GitHub Actions
 * 5. Combine multiple reporters for different needs
 * 6. Add annotations and steps for better reporting
 * 7. Attach relevant artifacts (screenshots, logs)
 */
