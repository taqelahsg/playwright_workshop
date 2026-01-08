# Global Setup and Teardown in Playwright

## Overview

Playwright's global setup and teardown feature allows you to run code once before all tests begin and once after all tests complete. This is essential for scenarios where you need to prepare your testing environment or clean up resources that are shared across all test files.

## Table of Contents

1. [What is Global Setup and Teardown?](#what-is-global-setup-and-teardown)
2. [When to Use Global Setup/Teardown](#when-to-use-global-setupteardown)
3. [Configuration](#configuration)
4. [Global Setup Implementation](#global-setup-implementation)
5. [Global Teardown Implementation](#global-teardown-implementation)
6. [Common Use Cases](#common-use-cases)
7. [Sharing Data Between Setup and Tests](#sharing-data-between-setup-and-tests)
8. [Best Practices](#best-practices)

---

## What is Global Setup and Teardown?

Global setup and teardown are special scripts that run outside the normal test lifecycle:

- **Global Setup**: Runs **once** before any test file is executed
- **Global Teardown**: Runs **once** after all test files have completed

Unlike regular test hooks (`beforeAll`, `beforeEach`, etc.), these run only once for the entire test suite, regardless of how many test files or workers you have.

### Execution Order

```
1. Global Setup
2. All Test Files (in parallel or serial)
   - beforeAll hooks
   - beforeEach hooks
   - Tests
   - afterEach hooks
   - afterAll hooks
3. Global Teardown
```

---

## When to Use Global Setup/Teardown

### Good Use Cases ✅

- **Starting/Stopping Services**: Launch a database, web server, or mock API before tests
- **One-Time Authentication**: Login once and save credentials for all tests
- **Database Setup**: Create/seed a test database that all tests will use
- **Environment Configuration**: Set environment variables or configuration files
- **Resource Preparation**: Download test data, prepare file structures
- **Cleanup Operations**: Delete temporary files, close database connections

### Avoid Using For ❌

- **Test-Specific Setup**: Use `beforeEach` or `beforeAll` instead
- **Parallel Test Data**: Each test should have isolated data
- **Frequent State Changes**: Use fixtures or hooks instead
- **Browser/Page Creation**: Use Playwright's built-in context and page fixtures

---

## Configuration

### Basic Configuration

Add global setup and teardown paths to your `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),

  // Other configuration options...
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
});
```

### File Paths

- Use `require.resolve()` to get the absolute path
- Paths are relative to the config file location
- Files can be `.ts` or `.js` (TypeScript is automatically compiled)

---

## Global Setup Implementation

### Basic Global Setup

Create a file named `global-setup.ts`:

```typescript
import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');

  // Your setup logic here

  console.log('✅ Global setup completed');
}

export default globalSetup;
```

### Access to Configuration

The `FullConfig` object provides access to all Playwright configuration:

```typescript
import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('Test directory:', config.testDir);
  console.log('Base URL:', config.use?.baseURL);
  console.log('Workers:', config.workers);

  // Access environment-specific settings
  if (process.env.CI) {
    console.log('Running in CI environment');
  }
}

export default globalSetup;
```

### Example: Starting a Web Server

```typescript
import { FullConfig } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';

let serverProcess: ChildProcess;

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting web server...');

  // Start the server
  serverProcess = spawn('npm', ['run', 'start'], {
    detached: true,
    stdio: 'ignore',
  });

  // Wait for server to be ready
  await waitForServer('http://localhost:3000');

  console.log('✅ Web server is ready');

  // Store process ID for teardown
  process.env.SERVER_PID = serverProcess.pid?.toString();
}

async function waitForServer(url: string) {
  const maxRetries = 30;
  const delay = 1000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch (error) {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  throw new Error(`Server did not start at ${url}`);
}

export default globalSetup;
```

### Example: Database Setup

```typescript
import { FullConfig } from '@playwright/test';
import { Client } from 'pg';

async function globalSetup(config: FullConfig) {
  console.log('🗄️  Setting up test database...');

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'test_db',
    user: 'test_user',
    password: 'test_password',
  });

  await client.connect();

  // Drop and recreate database
  await client.query('DROP DATABASE IF EXISTS test_db');
  await client.query('CREATE DATABASE test_db');

  // Run migrations
  await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL
    );
  `);

  // Seed initial data
  await client.query(`
    INSERT INTO users (username, email) VALUES
    ('testuser1', 'test1@example.com'),
    ('testuser2', 'test2@example.com');
  `);

  await client.end();

  console.log('✅ Database setup completed');
}

export default globalSetup;
```

### Example: Authentication Setup

```typescript
import { FullConfig, chromium } from '@playwright/test';
import * as fs from 'fs';

async function globalSetup(config: FullConfig) {
  console.log('🔐 Performing authentication...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to login page
  await page.goto('https://example.com/login');

  // Perform login
  await page.fill('input[name="username"]', 'test-user');
  await page.fill('input[name="password"]', 'test-password');
  await page.click('button[type="submit"]');

  // Wait for successful login
  await page.waitForURL('**/dashboard');

  // Save authentication state
  await context.storageState({ path: 'auth.json' });

  await browser.close();

  console.log('✅ Authentication completed and saved to auth.json');
}

export default globalSetup;
```

---

## Global Teardown Implementation

### Basic Global Teardown

Create a file named `global-teardown.ts`:

```typescript
import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Running global teardown...');

  // Your cleanup logic here

  console.log('✅ Global teardown completed');
}

export default globalTeardown;
```

### Example: Stopping a Web Server

```typescript
import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🛑 Stopping web server...');

  const serverPid = process.env.SERVER_PID;

  if (serverPid) {
    try {
      process.kill(parseInt(serverPid));
      console.log('✅ Web server stopped');
    } catch (error) {
      console.error('Failed to stop server:', error);
    }
  }
}

export default globalTeardown;
```

### Example: Database Cleanup

```typescript
import { FullConfig } from '@playwright/test';
import { Client } from 'pg';

async function globalTeardown(config: FullConfig) {
  console.log('🗄️  Cleaning up test database...');

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'test_user',
    password: 'test_password',
  });

  await client.connect();

  // Drop test database
  await client.query('DROP DATABASE IF EXISTS test_db');

  await client.end();

  console.log('✅ Database cleanup completed');
}

export default globalTeardown;
```

### Example: Cleanup Authentication Files

```typescript
import { FullConfig } from '@playwright/test';
import * as fs from 'fs';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up authentication files...');

  // Delete authentication state file
  const authFile = 'auth.json';
  if (fs.existsSync(authFile)) {
    fs.unlinkSync(authFile);
    console.log('✅ Deleted auth.json');
  }

  // Clean up other temporary files
  const tempFiles = ['screenshots', 'videos', 'traces'];
  for (const dir of tempFiles) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✅ Deleted ${dir} directory`);
    }
  }

  console.log('✅ Cleanup completed');
}

export default globalTeardown;
```

---

## Common Use Cases

### 1. One-Time Authentication

**Global Setup:**
```typescript
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://example.com/login');
  await page.fill('#username', process.env.TEST_USERNAME!);
  await page.fill('#password', process.env.TEST_PASSWORD!);
  await page.click('#submit');
  await page.waitForURL('**/dashboard');

  // Save signed-in state
  await context.storageState({ path: 'playwright/.auth/user.json' });
  await browser.close();
}

export default globalSetup;
```

**Playwright Config:**
```typescript
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  use: {
    // Use saved authentication state
    storageState: 'playwright/.auth/user.json',
  },
});
```

**Tests automatically use authentication:**
```typescript
import { test } from '@playwright/test';

test('user can access dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  // Already logged in!
  await expect(page).toHaveTitle(/Dashboard/);
});
```

### 2. Start/Stop Mock API Server

**Global Setup:**
```typescript
import { FullConfig } from '@playwright/test';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: 'Test User' }]));
  })
);

async function globalSetup(config: FullConfig) {
  console.log('Starting mock API server...');
  server.listen({ onUnhandledRequest: 'bypass' });
}

export default globalSetup;
```

**Global Teardown:**
```typescript
import { FullConfig } from '@playwright/test';
import { server } from './global-setup';

async function globalTeardown(config: FullConfig) {
  console.log('Stopping mock API server...');
  server.close();
}

export default globalTeardown;
```

### 3. Environment Configuration

**Global Setup:**
```typescript
import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('Setting up environment...');

  // Create .env.test file
  const envContent = `
    API_URL=http://localhost:3000
    TEST_MODE=true
    LOG_LEVEL=debug
  `;

  fs.writeFileSync('.env.test', envContent.trim());

  // Create necessary directories
  const dirs = ['temp', 'uploads', 'downloads'];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  console.log('Environment setup completed');
}

export default globalSetup;
```

### 4. Download Test Data

**Global Setup:**
```typescript
import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as https from 'https';

async function globalSetup(config: FullConfig) {
  console.log('Downloading test data...');

  const testDataUrl = 'https://example.com/test-data.json';
  const outputPath = 'test-data/data.json';

  // Create directory if it doesn't exist
  if (!fs.existsSync('test-data')) {
    fs.mkdirSync('test-data');
  }

  // Download file
  await downloadFile(testDataUrl, outputPath);

  console.log('Test data downloaded');
}

async function downloadFile(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => reject(err));
    });
  });
}

export default globalSetup;
```

---

## Sharing Data Between Setup and Tests

### Using Environment Variables

**Global Setup:**
```typescript
async function globalSetup(config: FullConfig) {
  const apiKey = 'test-api-key-12345';
  process.env.API_KEY = apiKey;

  const serverPort = 3000;
  process.env.SERVER_PORT = serverPort.toString();
}

export default globalSetup;
```

**Tests:**
```typescript
test('can access API with key', async ({ page }) => {
  const apiKey = process.env.API_KEY;
  await page.goto(`/api/data?key=${apiKey}`);
});
```

### Using Files

**Global Setup:**
```typescript
import * as fs from 'fs';

async function globalSetup(config: FullConfig) {
  const config = {
    baseUrl: 'http://localhost:3000',
    apiKey: 'test-key',
    testUsers: [
      { username: 'user1', password: 'pass1' },
      { username: 'user2', password: 'pass2' },
    ],
  };

  fs.writeFileSync('test-config.json', JSON.stringify(config, null, 2));
}

export default globalSetup;
```

**Tests:**
```typescript
import * as fs from 'fs';

test('login with test user', async ({ page }) => {
  const config = JSON.parse(fs.readFileSync('test-config.json', 'utf-8'));
  const user = config.testUsers[0];

  await page.goto(`${config.baseUrl}/login`);
  await page.fill('#username', user.username);
  await page.fill('#password', user.password);
  await page.click('#submit');
});
```

---

## Best Practices

### 1. Keep Setup Fast

Global setup runs before every test run, so keep it efficient:

```typescript
// ❌ Bad: Slow operations
async function globalSetup(config: FullConfig) {
  // Don't do this - takes too long
  await new Promise(resolve => setTimeout(resolve, 30000));
}

// ✅ Good: Fast and necessary operations only
async function globalSetup(config: FullConfig) {
  // Only do what's absolutely necessary
  await startServer();
  await waitForServerReady(); // With reasonable timeout
}
```

### 2. Handle Errors Gracefully

```typescript
async function globalSetup(config: FullConfig) {
  try {
    await startDatabase();
    console.log('✅ Database started');
  } catch (error) {
    console.error('❌ Failed to start database:', error);
    throw error; // Fail fast if critical setup fails
  }
}
```

### 3. Clean Up Even on Failure

```typescript
async function globalTeardown(config: FullConfig) {
  try {
    await stopServer();
  } catch (error) {
    console.error('Failed to stop server:', error);
    // Still try to clean up other resources
  }

  try {
    await cleanupFiles();
  } catch (error) {
    console.error('Failed to cleanup files:', error);
  }
}
```

### 4. Use Type Safety

```typescript
import { FullConfig } from '@playwright/test';

// ✅ Good: Typed configuration
interface TestConfig {
  serverUrl: string;
  apiKey: string;
}

async function globalSetup(config: FullConfig) {
  const testConfig: TestConfig = {
    serverUrl: config.use?.baseURL || 'http://localhost:3000',
    apiKey: process.env.API_KEY || 'default-key',
  };

  // Type-safe access
  console.log(`Starting server at ${testConfig.serverUrl}`);
}
```

### 5. Log Important Information

```typescript
async function globalSetup(config: FullConfig) {
  console.log('='.repeat(50));
  console.log('🚀 Global Setup Started');
  console.log('='.repeat(50));
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Workers: ${config.workers}`);
  console.log(`Test Dir: ${config.testDir}`);

  const startTime = Date.now();

  await performSetup();

  const duration = Date.now() - startTime;
  console.log(`✅ Setup completed in ${duration}ms`);
  console.log('='.repeat(50));
}
```

### 6. Don't Create Browser Contexts in Global Setup

```typescript
// ❌ Bad: Creating browser for tests
async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  // This context won't be available to tests
}

// ✅ Good: Only for one-time operations
async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  // Do one-time operation
  await doSomethingOnce(context);

  // Clean up immediately
  await browser.close();
}
```

### 7. Separate Setup and Teardown Logic

```typescript
// ✅ Good: Clear separation of concerns

// global-setup.ts
async function globalSetup(config: FullConfig) {
  await startServices();
  await seedDatabase();
}

// global-teardown.ts
async function globalTeardown(config: FullConfig) {
  await stopServices();
  await cleanDatabase();
}
```

### 8. Use Configuration-Specific Setup

```typescript
async function globalSetup(config: FullConfig) {
  if (process.env.CI) {
    console.log('Running in CI mode');
    await setupCIEnvironment();
  } else {
    console.log('Running locally');
    await setupLocalEnvironment();
  }
}
```

---

## Summary

Global setup and teardown in Playwright provides:

- ✅ **One-time execution** before all tests and after all tests
- ✅ **Shared environment setup** for authentication, servers, databases
- ✅ **Resource cleanup** to prevent test pollution
- ✅ **Configuration access** via `FullConfig` object
- ✅ **Data sharing** through environment variables or files

### Key Takeaways

1. Use global setup/teardown for **one-time operations** that benefit all tests
2. Keep setup **fast and focused** on essential tasks
3. Always **clean up resources** in teardown, even on failures
4. **Don't create browser contexts** that persist to tests - use fixtures instead
5. Use **type safety** and **error handling** for robust setup
6. **Log important information** for debugging
7. Store shared data in **environment variables** or **files**

For more information, visit the [official Playwright documentation on global setup and teardown](https://playwright.dev/docs/test-global-setup-teardown).
