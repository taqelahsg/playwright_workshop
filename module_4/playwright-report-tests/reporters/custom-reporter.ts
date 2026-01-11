import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

/**
 * Custom Reporter Example
 *
 * This reporter demonstrates how to create a custom reporter that:
 * - Logs test execution in a custom format
 * - Tracks test statistics
 * - Generates a custom summary
 * - Can be extended to send results to external services
 */
class CustomReporter implements Reporter {
  private startTime: number = 0;
  private totalTests: number = 0;
  private passedTests: number = 0;
  private failedTests: number = 0;
  private skippedTests: number = 0;
  private flakyTests: number = 0;

  /**
   * Called once before running tests
   */
  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
    this.totalTests = suite.allTests().length;

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║         CUSTOM REPORTER - Test Execution Started          ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log(`📋 Total Tests: ${this.totalTests}`);
    console.log(`🌐 Base URL: ${config.projects[0]?.use?.baseURL || 'Not set'}`);
    console.log(`⚙️  Workers: ${config.workers}`);
    console.log(`🔄 Retries: ${config.projects[0]?.retries || 0}`);
    console.log('');
  }

  /**
   * Called after a test has been started
   */
  onTestBegin(test: TestCase, result: TestResult) {
    console.log(`\n▶️  Running: ${test.title}`);
    console.log(`   Location: ${test.location.file}:${test.location.line}`);
    console.log(`   Project: ${test.parent.project()?.name || 'default'}`);
  }

  /**
   * Called after a test has been finished
   */
  onTestEnd(test: TestCase, result: TestResult) {
    const duration = result.duration;
    const status = result.status;

    switch (status) {
      case 'passed':
        this.passedTests++;
        console.log(`   ✅ PASSED (${duration}ms)`);
        break;
      case 'failed':
        this.failedTests++;
        console.log(`   ❌ FAILED (${duration}ms)`);
        if (result.error) {
          console.log(`   Error: ${result.error.message}`);
        }
        break;
      case 'timedOut':
        this.failedTests++;
        console.log(`   ⏱️  TIMEOUT (${duration}ms)`);
        break;
      case 'skipped':
        this.skippedTests++;
        console.log(`   ⏭️  SKIPPED`);
        break;
    }

    // Check for flaky tests (passed after retry)
    if (result.status === 'passed' && result.retry > 0) {
      this.flakyTests++;
      console.log(`   ⚠️  FLAKY (passed on retry ${result.retry})`);
    }

    // Log attachments if any
    if (result.attachments.length > 0) {
      console.log(`   📎 Attachments: ${result.attachments.length}`);
      result.attachments.forEach((attachment) => {
        console.log(`      - ${attachment.name} (${attachment.contentType})`);
      });
    }
  }

  /**
   * Called after all tests have been run
   */
  onEnd(result: FullResult) {
    const duration = Date.now() - this.startTime;
    const durationSeconds = (duration / 1000).toFixed(2);

    console.log('\n\n╔════════════════════════════════════════════════════════════╗');
    console.log('║              CUSTOM REPORTER - Test Summary               ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Summary statistics
    console.log('📊 Test Results:');
    console.log(`   Total:   ${this.totalTests}`);
    console.log(`   ✅ Passed:  ${this.passedTests} (${this.getPercentage(this.passedTests)}%)`);
    console.log(`   ❌ Failed:  ${this.failedTests} (${this.getPercentage(this.failedTests)}%)`);
    console.log(`   ⏭️  Skipped: ${this.skippedTests} (${this.getPercentage(this.skippedTests)}%)`);

    if (this.flakyTests > 0) {
      console.log(`   ⚠️  Flaky:   ${this.flakyTests} (${this.getPercentage(this.flakyTests)}%)`);
    }

    console.log('');
    console.log(`⏱️  Execution Time: ${durationSeconds}s`);
    console.log(`📅 Finished at: ${new Date().toLocaleString()}`);

    // Overall status
    console.log('');
    if (result.status === 'passed') {
      console.log('🎉 Overall Status: ALL TESTS PASSED');
    } else if (result.status === 'failed') {
      console.log('💔 Overall Status: SOME TESTS FAILED');
    } else {
      console.log(`⚠️  Overall Status: ${result.status.toUpperCase()}`);
    }

    // Pass/Fail indicator
    const passRate = this.getPercentage(this.passedTests);
    console.log('');
    this.printProgressBar(passRate);

    console.log('\n');
  }

  /**
   * Helper: Calculate percentage
   */
  private getPercentage(count: number): number {
    return this.totalTests > 0 ? Math.round((count / this.totalTests) * 100) : 0;
  }

  /**
   * Helper: Print a visual progress bar
   */
  private printProgressBar(percentage: number) {
    const barLength = 50;
    const filledLength = Math.round((barLength * percentage) / 100);
    const emptyLength = barLength - filledLength;

    const filled = '█'.repeat(filledLength);
    const empty = '░'.repeat(emptyLength);

    let color = '🟢'; // Green
    if (percentage < 100 && percentage >= 80) {
      color = '🟡'; // Yellow
    } else if (percentage < 80) {
      color = '🔴'; // Red
    }

    console.log(`${color} Pass Rate: [${filled}${empty}] ${percentage}%`);
  }

  /**
   * Called on catastrophic failures
   */
  onError(error: Error) {
    console.error('\n❗ CRITICAL ERROR:', error.message);
  }

  /**
   * Called when a step starts (optional)
   */
  onStepBegin(test: TestCase, result: TestResult, step: any) {
    // Uncomment to log detailed steps
    // console.log(`      → Step: ${step.title}`);
  }

  /**
   * Called when a step ends (optional)
   */
  onStepEnd(test: TestCase, result: TestResult, step: any) {
    // Uncomment to log detailed step results
    // console.log(`      ← Step complete: ${step.title} (${step.duration}ms)`);
  }
}

export default CustomReporter;
