# Custom Reporters

Learn how to create custom reporters to integrate Playwright test results with your specific tools and workflows.

## Why Create Custom Reporters?

Built-in reporters are great, but sometimes you need:

- 🔔 **Notifications** - Send test results to Slack, Teams, or email
- 📊 **Custom Dashboards** - Push data to your analytics platform
- 💾 **Database Logging** - Store results in your database
- 🔗 **Tool Integration** - Integrate with custom tools or services
- 📝 **Custom Formats** - Generate reports in specific formats
- 📈 **Real-time Monitoring** - Stream results to monitoring systems

## Reporter Interface

A Playwright reporter is a class that implements the `Reporter` interface:

```typescript
import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult
} from '@playwright/test/reporter';

class MyReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    // Called once before running tests
  }

  onTestBegin(test: TestCase, result: TestResult) {
    // Called when a test starts
  }

  onStdOut(chunk: string | Buffer, test?: TestCase, result?: TestResult) {
    // Called on stdout output
  }

  onStdErr(chunk: string | Buffer, test?: TestCase, result?: TestResult) {
    // Called on stderr output
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // Called when a test completes
  }

  onEnd(result: FullResult) {
    // Called after all tests complete
  }
}

export default MyReporter;
```

## Reporter Lifecycle

### 1. onBegin

Called once when test run starts.

```typescript
onBegin(config: FullConfig, suite: Suite) {
  console.log(`Starting test run with ${suite.allTests().length} tests`);
}
```

**Available data:**
- `config` - Playwright configuration
- `suite` - Root test suite containing all tests

### 2. onTestBegin

Called when each test starts.

```typescript
onTestBegin(test: TestCase, result: TestResult) {
  console.log(`Starting test: ${test.title}`);
}
```

**Available data:**
- `test` - Test case information
- `result` - Test result (will be populated in onTestEnd)

### 3. onTestEnd

Called when each test completes.

```typescript
onTestEnd(test: TestCase, result: TestResult) {
  const status = result.status;
  const duration = result.duration;
  console.log(`${test.title}: ${status} (${duration}ms)`);
}
```

**Available data:**
- `test` - Test case information
- `result` - Complete test result with status, duration, errors

### 4. onEnd

Called once when all tests complete.

```typescript
onEnd(result: FullResult) {
  console.log(`Test run ${result.status}`);
}
```

**Available data:**
- `result` - Overall result status

## Basic Custom Reporter

### Simple Console Reporter

```typescript
// reporters/simple-reporter.ts
import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult
} from '@playwright/test/reporter';

class SimpleReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private skipped = 0;

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting ${suite.allTests().length} tests`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const status = result.status;

    if (status === 'passed') {
      this.passed++;
      console.log(`✓ ${test.title}`);
    } else if (status === 'failed') {
      this.failed++;
      console.log(`✗ ${test.title}`);
      console.log(`  Error: ${result.error?.message}`);
    } else if (status === 'skipped') {
      this.skipped++;
      console.log(`○ ${test.title} (skipped)`);
    }
  }

  onEnd(result: FullResult) {
    console.log('');
    console.log('Test Results:');
    console.log(`  Passed:  ${this.passed}`);
    console.log(`  Failed:  ${this.failed}`);
    console.log(`  Skipped: ${this.skipped}`);
    console.log(`  Status:  ${result.status}`);
  }
}

export default SimpleReporter;
```

### Using the Reporter

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: './reporters/simple-reporter.ts'
});
```

Or with options:

```typescript
reporter: [
  ['./reporters/simple-reporter.ts', { option: 'value' }]
]
```

## File-Based Reporter

### CSV Reporter

```typescript
// reporters/csv-reporter.ts
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface CsvReporterOptions {
  outputFile?: string;
}

class CsvReporter implements Reporter {
  private outputFile: string;
  private results: string[] = [];

  constructor(options: CsvReporterOptions = {}) {
    this.outputFile = options.outputFile || 'test-results.csv';
  }

  onBegin() {
    // CSV header
    this.results.push('Test,Status,Duration (ms),Error');
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const testName = test.title;
    const status = result.status;
    const duration = result.duration;
    const error = result.error?.message?.replace(/,/g, ';') || '';

    this.results.push(`"${testName}","${status}",${duration},"${error}"`);
  }

  onEnd() {
    const outputDir = path.dirname(this.outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(this.outputFile, this.results.join('\n'));
    console.log(`CSV report written to ${this.outputFile}`);
  }
}

export default CsvReporter;
```

**Usage:**
```typescript
reporter: [
  ['./reporters/csv-reporter.ts', { outputFile: 'reports/results.csv' }]
]
```

## Notification Reporters

### Slack Reporter

```typescript
// reporters/slack-reporter.ts
import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import axios from 'axios';

interface SlackReporterOptions {
  webhookUrl?: string;
}

class SlackReporter implements Reporter {
  private webhookUrl: string;
  private passed = 0;
  private failed = 0;
  private failedTests: string[] = [];

  constructor(options: SlackReporterOptions = {}) {
    this.webhookUrl = options.webhookUrl || process.env.SLACK_WEBHOOK_URL || '';
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'passed') {
      this.passed++;
    } else if (result.status === 'failed') {
      this.failed++;
      this.failedTests.push(test.title);
    }
  }

  async onEnd(result: FullResult) {
    if (!this.webhookUrl) {
      console.log('Slack webhook URL not configured, skipping notification');
      return;
    }

    const total = this.passed + this.failed;
    const emoji = this.failed === 0 ? '✅' : '❌';

    let message = {
      text: `${emoji} Test Results`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${emoji} Playwright Test Results`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Total Tests:*\n${total}`
            },
            {
              type: 'mrkdwn',
              text: `*Passed:*\n✅ ${this.passed}`
            },
            {
              type: 'mrkdwn',
              text: `*Failed:*\n❌ ${this.failed}`
            },
            {
              type: 'mrkdwn',
              text: `*Status:*\n${result.status}`
            }
          ]
        }
      ]
    };

    // Add failed tests if any
    if (this.failedTests.length > 0) {
      message.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Failed Tests:*\n${this.failedTests.map(t => `• ${t}`).join('\n')}`
        }
      });
    }

    try {
      await axios.post(this.webhookUrl, message);
      console.log('Slack notification sent');
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
    }
  }
}

export default SlackReporter;
```

**Usage:**
```typescript
reporter: [
  ['list'],
  ['./reporters/slack-reporter.ts', {
    webhookUrl: process.env.SLACK_WEBHOOK_URL
  }]
]
```

### Email Reporter

```typescript
// reporters/email-reporter.ts
import type { Reporter, FullResult } from '@playwright/test/reporter';
import nodemailer from 'nodemailer';

interface EmailReporterOptions {
  to: string;
  from: string;
  smtpHost?: string;
  smtpPort?: number;
}

class EmailReporter implements Reporter {
  private options: EmailReporterOptions;
  private passed = 0;
  private failed = 0;

  constructor(options: EmailReporterOptions) {
    this.options = options;
  }

  onTestEnd(test: any, result: any) {
    if (result.status === 'passed') this.passed++;
    if (result.status === 'failed') this.failed++;
  }

  async onEnd(result: FullResult) {
    const transporter = nodemailer.createTransport({
      host: this.options.smtpHost || 'smtp.gmail.com',
      port: this.options.smtpPort || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const subject = this.failed === 0
      ? '✅ All Tests Passed'
      : `❌ ${this.failed} Tests Failed`;

    const html = `
      <h1>Test Results</h1>
      <p><strong>Status:</strong> ${result.status}</p>
      <p><strong>Passed:</strong> ${this.passed}</p>
      <p><strong>Failed:</strong> ${this.failed}</p>
    `;

    try {
      await transporter.sendMail({
        from: this.options.from,
        to: this.options.to,
        subject: subject,
        html: html
      });
      console.log('Email notification sent');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
}

export default EmailReporter;
```

## Database Reporter

### MongoDB Reporter

```typescript
// reporters/mongodb-reporter.ts
import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import { MongoClient } from 'mongodb';

interface MongoReporterOptions {
  connectionString?: string;
  database?: string;
  collection?: string;
}

class MongoReporter implements Reporter {
  private connectionString: string;
  private database: string;
  private collection: string;
  private client: MongoClient | null = null;
  private testRunId: string;
  private tests: any[] = [];

  constructor(options: MongoReporterOptions = {}) {
    this.connectionString = options.connectionString || process.env.MONGO_URL || '';
    this.database = options.database || 'test-results';
    this.collection = options.collection || 'playwright-tests';
    this.testRunId = new Date().toISOString();
  }

  async onBegin() {
    if (!this.connectionString) {
      console.log('MongoDB connection string not configured');
      return;
    }

    try {
      this.client = new MongoClient(this.connectionString);
      await this.client.connect();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.tests.push({
      testRunId: this.testRunId,
      title: test.title,
      file: test.location.file,
      line: test.location.line,
      status: result.status,
      duration: result.duration,
      error: result.error?.message,
      timestamp: new Date()
    });
  }

  async onEnd(result: FullResult) {
    if (!this.client) return;

    try {
      const db = this.client.db(this.database);
      const coll = db.collection(this.collection);

      await coll.insertMany(this.tests);
      console.log(`Inserted ${this.tests.length} test results into MongoDB`);
    } catch (error) {
      console.error('Failed to insert test results:', error);
    } finally {
      await this.client.close();
    }
  }
}

export default MongoReporter;
```

## Real-Time Streaming Reporter

### WebSocket Reporter

```typescript
// reporters/websocket-reporter.ts
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import WebSocket from 'ws';

interface WebSocketReporterOptions {
  url?: string;
}

class WebSocketReporter implements Reporter {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(options: WebSocketReporterOptions = {}) {
    this.url = options.url || 'ws://localhost:8080';
  }

  onBegin() {
    try {
      this.ws = new WebSocket(this.url);
      this.ws.on('open', () => {
        console.log('WebSocket connection established');
        this.send({ type: 'test-run-start' });
      });
      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }

  onTestBegin(test: TestCase) {
    this.send({
      type: 'test-start',
      test: test.title
    });
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.send({
      type: 'test-end',
      test: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message
    });
  }

  onEnd() {
    this.send({ type: 'test-run-end' });

    if (this.ws) {
      this.ws.close();
    }
  }

  private send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

export default WebSocketReporter;
```

## Advanced Features

### Accessing Test Attachments

```typescript
onTestEnd(test: TestCase, result: TestResult) {
  // Access screenshots
  const screenshots = result.attachments.filter(
    a => a.contentType === 'image/png'
  );

  screenshots.forEach(screenshot => {
    console.log(`Screenshot: ${screenshot.name}`);
    console.log(`Path: ${screenshot.path}`);
    console.log(`Size: ${screenshot.body?.length} bytes`);
  });

  // Access videos
  const videos = result.attachments.filter(
    a => a.contentType.startsWith('video/')
  );

  // Access traces
  const traces = result.attachments.filter(
    a => a.name === 'trace'
  );
}
```

### Accessing Test Steps

```typescript
onTestEnd(test: TestCase, result: TestResult) {
  result.steps.forEach(step => {
    console.log(`Step: ${step.title}`);
    console.log(`Duration: ${step.duration}ms`);
    console.log(`Error: ${step.error?.message}`);
  });
}
```

### Test Annotations

```typescript
onTestEnd(test: TestCase, result: TestResult) {
  test.annotations.forEach(annotation => {
    console.log(`${annotation.type}: ${annotation.description}`);
  });
}
```

## Combining Multiple Custom Reporters

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    ['list'],
    ['html'],
    ['./reporters/slack-reporter.ts', {
      webhookUrl: process.env.SLACK_WEBHOOK_URL
    }],
    ['./reporters/mongodb-reporter.ts', {
      connectionString: process.env.MONGO_URL
    }],
    ['./reporters/csv-reporter.ts', {
      outputFile: 'reports/results.csv'
    }]
  ]
});
```

## Testing Custom Reporters

```typescript
// test-reporter.ts
import { test } from '@playwright/test';
import MyReporter from './reporters/my-reporter';

// Create reporter instance
const reporter = new MyReporter();

// Simulate lifecycle
reporter.onBegin({ /* config */ }, { /* suite */ });
reporter.onTestBegin({ /* test */ }, { /* result */ });
reporter.onTestEnd({ /* test */ }, { /* result */ });
reporter.onEnd({ status: 'passed' });
```

## Best Practices

### 1. **Handle Errors Gracefully**

```typescript
async onEnd() {
  try {
    await this.sendNotification();
  } catch (error) {
    console.error('Reporter error:', error);
    // Don't fail the test run
  }
}
```

### 2. **Make Configuration Optional**

```typescript
constructor(options: MyReporterOptions = {}) {
  this.option = options.option || defaultValue;
}
```

### 3. **Provide Useful Console Output**

```typescript
onEnd() {
  console.log('MyReporter: Report generated successfully');
  console.log(`Output: ${this.outputFile}`);
}
```

### 4. **Support Environment Variables**

```typescript
constructor(options: Options = {}) {
  this.webhookUrl = options.webhookUrl || process.env.WEBHOOK_URL || '';
}
```

### 5. **Clean Up Resources**

```typescript
async onEnd() {
  // Close connections
  if (this.client) {
    await this.client.close();
  }

  // Clean up files
  if (this.tempFile) {
    fs.unlinkSync(this.tempFile);
  }
}
```

## Third-Party Reporters

### Allure Reporter

```bash
npm install --save-dev allure-playwright
```

```typescript
reporter: [
  ['allure-playwright', {
    outputFolder: 'allure-results'
  }]
]
```

### Tesults Reporter

```bash
npm install --save-dev playwright-tesults-reporter
```

```typescript
reporter: [
  ['playwright-tesults-reporter', {
    'tesults-target': process.env.TESULTS_TOKEN
  }]
]
```

### ReportPortal

```bash
npm install --save-dev @reportportal/agent-js-playwright
```

```typescript
reporter: [
  ['@reportportal/agent-js-playwright', {
    apiKey: process.env.RP_API_KEY,
    endpoint: 'https://your-instance.reportportal.io',
    project: 'your-project'
  }]
]
```

## Summary

**Custom Reporters:**
- ✅ Implement Reporter interface
- ✅ Use lifecycle hooks (onBegin, onTestEnd, onEnd)
- ✅ Access test results and attachments
- ✅ Send notifications, log to databases, generate custom formats
- ✅ Combine with built-in reporters

**Best Practices:**
- 🎯 Handle errors gracefully
- 🎯 Make configuration flexible
- 🎯 Provide useful feedback
- 🎯 Clean up resources
- 🎯 Test your reporters

## Next Steps

Now you understand custom reporters:
1. Create a reporter for your specific needs
2. Integrate with your team's tools (Slack, Jira, etc.)
3. Build custom dashboards with test data
4. Share your reporter with the community!
