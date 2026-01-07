# Recording Playwright Tests

This guide explains how to automatically generate Playwright test scripts by recording your browser interactions using both the VSCode extension and the command-line codegen tool.

## What is Test Recording?

Test recording (code generation) allows you to create Playwright tests by simply interacting with your web application. Playwright watches your actions and automatically generates the corresponding test code, including:

- **Page navigation** - Visiting URLs
- **Clicks and taps** - Button clicks, link clicks, element interactions
- **Text input** - Form filling, text entry
- **Assertions** - Automatically suggests assertions based on your interactions
- **Locators** - Intelligent selector generation using best practices

**Key benefits:**
- **Faster test creation** - No need to write code from scratch
- **Learn Playwright syntax** - See how actions translate to code
- **Smart selectors** - Automatically generates resilient locators
- **Multi-language support** - Generate code in JavaScript, TypeScript, Python, Java, or C#
- **Cross-browser** - Record in any supported browser (Chromium, Firefox, WebKit)

---

## Method 1: Using the VSCode Extension

The Playwright Test for VSCode extension provides a graphical interface for recording tests directly in your editor.

### Prerequisites

Ensure you have the Playwright VSCode extension installed:

1. Open VS Code
2. Click the **Extensions** icon (or press `Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **"Playwright Test for VSCode"**
4. Click **Install**

### Recording a New Test

#### Step 1: Open the Testing Panel

1. Click the **Testing** icon in the VS Code sidebar (flask icon)
2. Or press `Ctrl+Shift+E` / `Cmd+Shift+E` and select the Testing view

#### Step 2: Record New Test

1. In the Testing panel, click the **Record new** button
   - Look for the record icon (circle with dot) in the Testing panel toolbar
   - Or use the command palette: `Ctrl+Shift+P` / `Cmd+Shift+P` and type "Playwright: Record new test"

2. VSCode will prompt you to:
   - **Select the test file** where the test should be saved
   - Or create a new test file

3. Choose your options:
   - **Browser**: Select which browser to use (Chromium, Firefox, or WebKit)
   - **Test file location**: tests folder by default

#### Step 3: Interact with Your Application

Once the browser opens:

1. A browser window launches with the Playwright Inspector attached
2. The address bar shows you're in recording mode
3. Navigate to your application's URL
4. Perform the actions you want to test:
   - Click buttons
   - Fill in forms
   - Navigate between pages
   - Select dropdowns
   - Check/uncheck boxes

#### Step 4: Add Assertions

While recording, you can add assertions:

1. Click the **"Assert"** button in the Playwright Inspector toolbar
2. Move your mouse over elements you want to verify
3. Click on an element
4. Choose the assertion type:
   - **Assert visibility** - Verify element is visible
   - **Assert text** - Check element contains specific text
   - **Assert value** - Verify input field value
   - **Assert attribute** - Check element attributes

#### Step 5: Save and Stop Recording

1. **Review the generated code** in VS Code
   - Code appears in real-time as you interact
   - Test code is automatically saved to your test file

2. **Stop recording**:
   - Close the browser window
   - Or click the **Stop** button in the Playwright Inspector
   - Or use the command palette: "Playwright: Stop recording"

3. **Edit the test** if needed:
   - Clean up selectors
   - Add additional assertions
   - Organize test structure

### VSCode Extension Features

#### Test Explorer
- **View all tests** in a tree structure
- **Run individual tests** with a single click
- **Debug tests** with breakpoints
- **View test results** inline

#### Pick Locator
The extension provides a "Pick locator" feature to help you find selectors:

1. Click the **Pick locator** button in the Testing panel
2. Hover over elements in your browser
3. Click an element to copy its selector
4. Paste the selector into your test code

#### Watch Mode
- **Auto-run tests** when files change
- Enable from the Testing panel toolbar
- Useful for test-driven development

#### Show Browser
- **Run tests with visible browser** for debugging
- Toggle from the Testing panel
- See tests execute in real-time

---

## Method 2: Using the Codegen Command

The `npx playwright codegen` command provides a powerful command-line interface for generating tests.

### Basic Usage

#### Command Syntax

```bash
npx playwright codegen [URL] [options]
```

#### Generate Test for a Website

```bash
npx playwright codegen https://playwright.dev
```

This command:
1. Opens a browser window
2. Navigates to the specified URL
3. Opens the Playwright Inspector
4. Records your actions as you interact with the page

### Codegen Options

#### Specify Target Language

Generate code in different programming languages:

```bash
# TypeScript (default)
npx playwright codegen --target typescript https://example.com

# JavaScript
npx playwright codegen --target javascript https://example.com

# Python
npx playwright codegen --target python https://example.com

# Python (async)
npx playwright codegen --target python-async https://example.com

# Java
npx playwright codegen --target java https://example.com

# C# (.NET)
npx playwright codegen --target csharp https://example.com
```

#### Choose Browser

```bash
# Chromium (default)
npx playwright codegen --browser chromium https://example.com

# Firefox
npx playwright codegen --browser firefox https://example.com

# WebKit (Safari)
npx playwright codegen --browser webkit https://example.com
```

#### Set Viewport Size

```bash
# Desktop viewport
npx playwright codegen --viewport-size=1920,1080 https://example.com

# Tablet viewport
npx playwright codegen --viewport-size=768,1024 https://example.com

# Mobile viewport
npx playwright codegen --viewport-size=375,667 https://example.com
```

#### Device Emulation

Emulate specific mobile devices:

```bash
# iPhone 13
npx playwright codegen --device="iPhone 13" https://example.com

# Pixel 5
npx playwright codegen --device="Pixel 5" https://example.com

# iPad Pro
npx playwright codegen --device="iPad Pro" https://example.com

# See full list of devices
npx playwright codegen --device="?" https://example.com
```

#### Save Output to File

Redirect generated code to a test file:

```bash
# Save to a file
npx playwright codegen https://example.com -o tests/recorded-test.spec.ts

# Append to existing file
npx playwright codegen https://example.com -o tests/existing-test.spec.ts --append
```

#### Color Scheme

Emulate color scheme preferences:

```bash
# Dark mode
npx playwright codegen --color-scheme=dark https://example.com

# Light mode
npx playwright codegen --color-scheme=light https://example.com
```

#### Geolocation and Timezone

```bash
# Set geolocation
npx playwright codegen --geolocation="37.7749,-122.4194" --timezone="America/Los_Angeles" https://example.com
```

#### Load Existing Authentication State

Reuse saved authentication:

```bash
# First, save authentication state
npx playwright codegen --save-storage=auth.json https://example.com

# Then, load it for subsequent recordings
npx playwright codegen --load-storage=auth.json https://example.com
```

### Complete Codegen Example

```bash
# Generate a TypeScript test for mobile device in dark mode
npx playwright codegen \
  --target typescript \
  --browser webkit \
  --device="iPhone 13" \
  --color-scheme=dark \
  -o tests/mobile-test.spec.ts \
  https://example.com
```

---

## The Playwright Inspector

The Playwright Inspector is the graphical tool that appears during recording. It provides several useful features:

### Inspector Components

#### 1. Toolbar

- **Record** - Start/stop recording
- **Pick locator** - Select elements to get their selectors
- **Assert** - Add assertions by clicking elements
- **Copy** - Copy generated code to clipboard
- **Resume** - Resume test execution (during debugging)
- **Step over** - Execute next action (during debugging)

#### 2. Code Panel

- **Real-time code generation** - Watch code appear as you interact
- **Syntax highlighting** - Readable code formatting
- **Copy code** - Copy generated code to clipboard
- **Multiple tabs** - Switch between different code views

#### 3. Locator Playground

- **Test selectors** - Verify locators match elements
- **Highlight elements** - See which elements match
- **Refine selectors** - Edit and test custom selectors

### Using the Inspector Effectively

#### Generate Smart Selectors

Playwright automatically generates selectors following these priorities:

1. **User-facing attributes**:
   - `getByRole('button', { name: 'Submit' })`
   - `getByLabel('Email')`
   - `getByPlaceholder('Enter email')`
   - `getByText('Sign in')`

2. **Test IDs**:
   - `getByTestId('submit-button')`

3. **CSS selectors** (fallback):
   - `page.locator('#submit')`
   - `page.locator('.btn-primary')`

#### Add Assertions During Recording

1. Click the **Assert** button
2. Hover over elements
3. Click to add assertions:
   ```typescript
   await expect(page.getByRole('heading')).toBeVisible();
   await expect(page.getByText('Welcome')).toContainText('Welcome');
   ```

#### Edit Code in Real-Time

As code is generated:
- **Copy useful parts** - Select and copy specific sections
- **Ignore unnecessary actions** - Not all actions need to be in the final test
- **Refine selectors** - Replace generated selectors with better ones
- **Add test structure** - Organize into proper test cases

---

## Best Practices for Recording Tests

### 1. Start with a Clear Plan

Before recording:
- **Define test objective** - Know what you want to test
- **Identify key actions** - List the steps to perform
- **Plan assertions** - Decide what to verify

### 2. Record Smaller Test Scenarios

Instead of one long recording:
- **Break into smaller tests** - Each test should focus on one feature
- **Easier to maintain** - Smaller tests are easier to debug
- **Better organization** - Logical test grouping

Example:
```typescript
// Good: Separate focused tests
test('user can login', async ({ page }) => {
  // Login flow only
});

test('user can add item to cart', async ({ page }) => {
  // Cart functionality only
});

// Avoid: One large test doing everything
test('complete user journey', async ({ page }) => {
  // Login + cart + checkout + profile (too much)
});
```

### 3. Clean Up Generated Code

After recording, refactor the code:

```typescript
// Before: Generated code
await page.goto('https://example.com/');
await page.locator('#email').click();
await page.locator('#email').fill('user@example.com');
await page.locator('#password').click();
await page.locator('#password').fill('password123');
await page.getByRole('button', { name: 'Submit' }).click();

// After: Cleaned up
await page.goto('https://example.com/');
await page.locator('#email').fill('user@example.com');
await page.locator('#password').fill('password123');
await page.getByRole('button', { name: 'Submit' }).click();
```

### 4. Use Page Objects

Convert recorded code into page objects:

```typescript
// loginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://example.com/login');
  }

  async login(email: string, password: string) {
    await this.page.locator('#email').fill(email);
    await this.page.locator('#password').fill(password);
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
}

// test.spec.ts
test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
});
```

### 5. Add Meaningful Assertions

Recording generates some assertions, but add more:

```typescript
// Add assertions to verify behavior
await page.goto('https://example.com/login');
await page.locator('#email').fill('user@example.com');
await page.locator('#password').fill('password123');
await page.getByRole('button', { name: 'Submit' }).click();

// Add assertions
await expect(page).toHaveURL(/dashboard/);
await expect(page.getByText('Welcome back')).toBeVisible();
await expect(page.locator('.user-name')).toHaveText('User Name');
```

### 6. Handle Authentication

For tests requiring login:

#### Option 1: Record Authentication Once

```bash
# Record and save authentication state
npx playwright codegen --save-storage=auth.json https://example.com
```

#### Option 2: Use in Tests

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    storageState: 'auth.json',
  },
});
```

#### Option 3: Create Auth Setup

```typescript
// auth.setup.ts
test('authenticate', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.locator('#email').fill(process.env.USER_EMAIL!);
  await page.locator('#password').fill(process.env.USER_PASSWORD!);
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.context().storageState({ path: 'auth.json' });
});
```

### 7. Parameterize Test Data

Replace hardcoded values:

```typescript
// Before: Hardcoded
await page.locator('#email').fill('user@example.com');
await page.locator('#password').fill('password123');

// After: Parameterized
const testUser = {
  email: process.env.TEST_USER_EMAIL!,
  password: process.env.TEST_USER_PASSWORD!,
};

await page.locator('#email').fill(testUser.email);
await page.locator('#password').fill(testUser.password);
```

### 8. Review and Improve Selectors

Generated selectors may not always be optimal:

```typescript
// Generated (brittle)
await page.locator('div.container > div:nth-child(2) > button').click();

// Improved (resilient)
await page.getByRole('button', { name: 'Submit' }).click();
// Or
await page.getByTestId('submit-button').click();
```

---

## Practical Recording Workflow

### Example: Recording an E-commerce Test

#### Step 1: Start Recording

```bash
npx playwright codegen https://demo.playwright.dev/todomvc/
```

#### Step 2: Perform Actions

1. Click "What needs to be done?" input
2. Type "Buy groceries"
3. Press Enter
4. Type "Walk the dog"
5. Press Enter
6. Click checkbox next to "Buy groceries"
7. Click "Active" filter

#### Step 3: Add Assertions

Click "Assert" button and verify:
- "Walk the dog" is visible
- "Buy groceries" is not visible (it's completed)
- Active counter shows "1 item left"

#### Step 4: Review Generated Code

```typescript
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');
  await page.getByPlaceholder('What needs to be done?').fill('Buy groceries');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await page.getByPlaceholder('What needs to be done?').fill('Walk the dog');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await page.getByLabel('Toggle Todo').first().check();
  await page.getByRole('link', { name: 'Active' }).click();
  await expect(page.getByText('Walk the dog')).toBeVisible();
  await expect(page.getByText('Buy groceries')).not.toBeVisible();
  await expect(page.getByText('1 item left')).toBeVisible();
});
```

#### Step 5: Refactor and Save

```typescript
import { test, expect } from '@playwright/test';

test.describe('TodoMVC', () => {
  test('should filter active todos', async ({ page }) => {
    // Arrange: Navigate to app
    await page.goto('https://demo.playwright.dev/todomvc/');

    // Act: Add todos
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.fill('Buy groceries');
    await todoInput.press('Enter');
    await todoInput.fill('Walk the dog');
    await todoInput.press('Enter');

    // Act: Complete first todo
    await page.getByLabel('Toggle Todo').first().check();

    // Act: Filter to active todos
    await page.getByRole('link', { name: 'Active' }).click();

    // Assert: Verify active todos are shown
    await expect(page.getByText('Walk the dog')).toBeVisible();
    await expect(page.getByText('Buy groceries')).not.toBeVisible();
    await expect(page.getByText('1 item left')).toBeVisible();
  });
});
```

---

## Troubleshooting Recording

### Browser Doesn't Open

**Problem**: Running `codegen` but browser doesn't launch.

**Solutions**:
```bash
# Reinstall browsers
npx playwright install

# Install specific browser
npx playwright install chromium

# Check browser installation
npx playwright install --dry-run
```

### Code Not Generating

**Problem**: Actions performed but no code appears.

**Solutions**:
- Check that Playwright Inspector is open
- Verify recording is active (red record button)
- Try closing and reopening the browser
- Restart the codegen command

### Poor Selector Quality

**Problem**: Generated selectors are fragile (too many nth-child).

**Solutions**:
- Add `data-testid` attributes to your app:
  ```html
  <button data-testid="submit-button">Submit</button>
  ```
- Use semantic HTML with proper roles and labels
- Manually improve selectors after recording

### Authentication Issues

**Problem**: Need to login for every recording session.

**Solutions**:
```bash
# Save authentication state
npx playwright codegen --save-storage=auth.json https://example.com

# Reuse authentication
npx playwright codegen --load-storage=auth.json https://example.com
```

---

## Advanced Recording Techniques

### Recording with Network Interception

Combine recording with network mocking:

```typescript
// First, record the basic flow
// Then, enhance with network control

test('test with network mock', async ({ page }) => {
  // Mock API response
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ users: [] }),
    });
  });

  // Recorded actions
  await page.goto('https://example.com');
  // ... rest of recorded code
});
```

### Recording Multiple Scenarios

Create variations from one recording:

```typescript
// Base recording
test('successful login', async ({ page }) => {
  // Recorded login flow
});

// Variation 1: Invalid credentials
test('login with invalid credentials', async ({ page }) => {
  // Modify recorded code
  await page.locator('#email').fill('wrong@example.com');
  await page.locator('#password').fill('wrongpassword');
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});

// Variation 2: Empty fields
test('login with empty fields', async ({ page }) => {
  // Modify recorded code
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Email is required')).toBeVisible();
});
```

### Combining Manual and Recorded Code

```typescript
test('hybrid test', async ({ page }) => {
  // Manual setup
  await page.route('**/api/products', route => {
    route.fulfill({ body: JSON.stringify(mockProducts) });
  });

  // Recorded interactions
  await page.goto('https://example.com/products');
  await page.getByRole('button', { name: 'Add to cart' }).first().click();

  // Manual assertions
  const cart = await page.evaluate(() => {
    return localStorage.getItem('cart');
  });
  expect(JSON.parse(cart)).toHaveLength(1);
});
```

---

## Quick Reference

### VSCode Commands

| Command | Description |
|---------|-------------|
| **Record new test** | Start recording a new test |
| **Pick locator** | Select element to get selector |
| **Run test** | Execute selected test |
| **Debug test** | Run test with debugger |
| **Show browser** | Toggle browser visibility |

### Codegen Command Options

| Option | Description | Example |
|--------|-------------|---------|
| `--target` | Output language | `--target typescript` |
| `--browser` | Browser to use | `--browser firefox` |
| `--device` | Device emulation | `--device="iPhone 13"` |
| `--viewport-size` | Viewport dimensions | `--viewport-size=1920,1080` |
| `--color-scheme` | Dark/light mode | `--color-scheme=dark` |
| `-o` | Output file | `-o tests/test.spec.ts` |
| `--save-storage` | Save auth state | `--save-storage=auth.json` |
| `--load-storage` | Load auth state | `--load-storage=auth.json` |

---

## Key Takeaways

1. **Two recording methods** - VSCode extension and CLI codegen command
2. **Smart selector generation** - Automatically creates resilient locators
3. **Multi-language support** - Generate tests in various programming languages
4. **Device emulation** - Record tests for different viewports and devices
5. **Real-time code generation** - Watch code appear as you interact
6. **Assertion helpers** - Easily add verifications during recording
7. **Authentication state** - Save and reuse login sessions
8. **Refactor recorded code** - Clean up and organize generated tests
9. **Page objects** - Convert recordings into maintainable page objects
10. **Best for learning** - Great way to learn Playwright syntax and patterns

---

## Next Steps

Now that you can record tests, try:
1. Recording a test for your application using VSCode extension
2. Using codegen to generate tests in different browsers
3. Experimenting with device emulation for mobile testing
4. Saving authentication state to speed up subsequent recordings
5. Refactoring recorded tests into page object models
6. Combining recorded code with custom logic and assertions

## For More Information

Visit the official Playwright documentation:
- **Codegen documentation**: https://playwright.dev/docs/codegen
- **VSCode extension**: https://playwright.dev/docs/getting-started-vscode
- **Locators**: https://playwright.dev/docs/locators
- **Inspector**: https://playwright.dev/docs/debug#playwright-inspector

---

## Practice Exercise

Record the following test scenarios:
1. **Basic navigation** - Visit a website and click through multiple pages
2. **Form submission** - Fill out and submit a contact form
3. **Search functionality** - Enter search terms and verify results
4. **Mobile view** - Record the same test with mobile device emulation

After recording, refactor the code to:
- Remove unnecessary actions
- Improve selectors
- Add meaningful test descriptions
- Organize into test suites

Happy Recording! 🎬
