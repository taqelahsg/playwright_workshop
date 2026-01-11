import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

/**
 * Slack Reporter Example
 *
 * This reporter demonstrates how to send test results to Slack
 * You would need to set SLACK_WEBHOOK_URL environment variable
 *
 * Usage:
 * export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
 * npx playwright test --config=examples/slack-reporter.config.ts
 */
class SlackReporter implements Reporter {
  private startTime: number = 0;
  private totalTests: number = 0;
  private passedTests: number = 0;
  private failedTests: number = 0;
  private skippedTests: number = 0;
  private failedTestDetails: Array<{ name: string; error: string }> = [];

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
    this.totalTests = suite.allTests().length;
    console.log(`Starting test suite with ${this.totalTests} tests...`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    switch (result.status) {
      case 'passed':
        this.passedTests++;
        break;
      case 'failed':
      case 'timedOut':
        this.failedTests++;
        this.failedTestDetails.push({
          name: test.title,
          error: result.error?.message || 'Unknown error',
        });
        break;
      case 'skipped':
        this.skippedTests++;
        break;
    }
  }

  async onEnd(result: FullResult) {
    const duration = Date.now() - this.startTime;
    const durationSeconds = (duration / 1000).toFixed(2);

    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      console.log('\n⚠️  SLACK_WEBHOOK_URL not set. Skipping Slack notification.');
      console.log('   Set SLACK_WEBHOOK_URL environment variable to enable Slack notifications.');
      this.printConsoleSummary(durationSeconds);
      return;
    }

    const slackMessage = this.buildSlackMessage(result.status, durationSeconds);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slackMessage),
      });

      if (response.ok) {
        console.log('✅ Test results sent to Slack successfully!');
      } else {
        console.error('❌ Failed to send results to Slack:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Error sending results to Slack:', error);
    }

    this.printConsoleSummary(durationSeconds);
  }

  private buildSlackMessage(status: string, duration: string) {
    const emoji = status === 'passed' ? '✅' : '❌';
    const color = status === 'passed' ? '#36a64f' : '#ff0000';
    const statusText = status === 'passed' ? 'PASSED' : 'FAILED';

    const fields = [
      {
        title: 'Total Tests',
        value: this.totalTests.toString(),
        short: true,
      },
      {
        title: 'Passed',
        value: `✅ ${this.passedTests}`,
        short: true,
      },
      {
        title: 'Failed',
        value: `❌ ${this.failedTests}`,
        short: true,
      },
      {
        title: 'Skipped',
        value: `⏭️ ${this.skippedTests}`,
        short: true,
      },
      {
        title: 'Duration',
        value: `${duration}s`,
        short: true,
      },
      {
        title: 'Finished',
        value: new Date().toLocaleString(),
        short: true,
      },
    ];

    // Add failed test details if any
    if (this.failedTestDetails.length > 0) {
      const failedList = this.failedTestDetails
        .map((test) => `• *${test.name}*\n  ${test.error}`)
        .join('\n\n');

      fields.push({
        title: '❌ Failed Tests',
        value: failedList,
        short: false,
      });
    }

    return {
      username: 'Playwright Test Bot',
      icon_emoji: ':test_tube:',
      attachments: [
        {
          color: color,
          title: `${emoji} Test Suite ${statusText}`,
          fields: fields,
          footer: 'Playwright Test Report',
          footer_icon: 'https://playwright.dev/img/playwright-logo.svg',
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    };
  }

  private printConsoleSummary(duration: string) {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║            SLACK REPORTER - Test Summary                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log(`   Total:   ${this.totalTests}`);
    console.log(`   ✅ Passed:  ${this.passedTests}`);
    console.log(`   ❌ Failed:  ${this.failedTests}`);
    console.log(`   ⏭️  Skipped: ${this.skippedTests}`);
    console.log(`   ⏱️  Duration: ${duration}s`);
    console.log('');
  }
}

export default SlackReporter;
