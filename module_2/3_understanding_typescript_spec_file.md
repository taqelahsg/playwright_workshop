# Understanding TypeScript Spec File

This guide explains each line of the Playwright test file (`example.spec.ts`) to help you understand how to write tests in TypeScript.

## The Complete Test File

```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

---

## Line-by-Line Explanation

### Line 1: Import Statement
```typescript
import { test, expect } from '@playwright/test';
```

**What it does:** Imports the `test` and `expect` functions from the Playwright testing library.

- **`test`**: A function used to define a test case. Each test case contains a test name and test logic.
- **`expect`**: A function used to make assertions (verify that something is true). It checks if the actual result matches the expected result.

---

### Line 3: First Test Definition
```typescript
test('has title', async ({ page }) => {
```

**Breaking it down:**

1. **`test()`**: This function defines a new test case
2. **`'has title'`**: This is the test name/description. It appears in test reports.
3. **`async`**: This keyword marks the function as asynchronous, meaning it can perform operations that take time (like loading a webpage) without blocking other code.
4. **`({ page })`**: This uses destructuring to get the `page` object from Playwright's test fixtures. The `page` object represents a browser tab/window.
5. **`=>`**: This is an arrow function syntax in TypeScript/JavaScript

**What is `async`?**
- `async` marks a function that performs asynchronous operations
- It allows you to use the `await` keyword inside the function
- Asynchronous operations don't block the program while waiting for results (like waiting for a page to load)

**What is `page`?**
- `page` is a Playwright object that represents a browser page/tab
- It provides methods to interact with the webpage (click, type, navigate, etc.)
- Playwright automatically creates and manages this page for each test

---

### Line 4: Navigate to URL
```typescript
  await page.goto('https://playwright.dev/');
```

**Breaking it down:**

1. **`await`**: This keyword pauses the function execution until the operation completes
2. **`page.goto()`**: Navigates to the specified URL
3. **`'https://playwright.dev/'`**: The URL to visit

**What is `await`?**
- `await` pauses execution until a Promise (asynchronous operation) completes
- It can only be used inside `async` functions
- Without `await`, the code would continue executing before the page finishes loading
- It makes asynchronous code look and behave more like synchronous code

**Example without `await` (wrong):**
```typescript
page.goto('https://playwright.dev/'); // Doesn't wait for page to load
expect(page).toHaveTitle(/Playwright/); // Might run before page loads!
```

**Example with `await` (correct):**
```typescript
await page.goto('https://playwright.dev/'); // Waits for page to load
await expect(page).toHaveTitle(/Playwright/); // Runs after page loads
```

---

### Line 7: Assertion
```typescript
  await expect(page).toHaveTitle(/Playwright/);
```

**Breaking it down:**

1. **`await`**: Waits for the assertion to complete
2. **`expect(page)`**: Creates an assertion for the page object
3. **`.toHaveTitle()`**: A Playwright matcher that checks the page title
4. **`/Playwright/`**: A regular expression that checks if the title contains "Playwright"

**What is `expect`?**
- `expect` is an assertion function that verifies test conditions
- It compares actual values with expected values
- If the assertion fails, the test fails and reports an error
- Playwright provides special matchers like `toHaveTitle()`, `toBeVisible()`, etc.

**Common `expect` matchers:**
- `toHaveTitle()`: Checks page title
- `toBeVisible()`: Checks if element is visible
- `toContainText()`: Checks if element contains specific text
- `toHaveURL()`: Checks page URL

---

### Line 10: Second Test Definition
```typescript
test('get started link', async ({ page }) => {
```

This starts a second independent test case. Each `test()` runs in isolation with its own browser context.

---

### Line 11: Navigate Again
```typescript
  await page.goto('https://playwright.dev/');
```

Each test starts fresh, so we navigate to the page again (even though the previous test visited the same URL).

---

### Line 14: Click Action
```typescript
  await page.getByRole('link', { name: 'Get started' }).click();
```

**Breaking it down:**

1. **`page.getByRole('link', { name: 'Get started' })`**: Finds a link element with the text "Get started"
   - `getByRole()`: Locates elements by their ARIA role (accessible name)
   - `'link'`: Looking for a link element
   - `{ name: 'Get started' }`: The accessible name (visible text) of the link
2. **`.click()`**: Clicks the found element
3. **`await`**: Waits for the click action and any resulting navigation to complete

---

### Line 17: Visibility Assertion
```typescript
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
```

**Breaking it down:**

1. **`page.getByRole('heading', { name: 'Installation' })`**: Finds a heading with text "Installation"
2. **`expect(...).toBeVisible()`**: Verifies the heading is visible on the page
3. **`await`**: Waits for the assertion to complete

---

## Key Concepts Summary

### 1. What is `test`?
- A function that defines a test case
- Each test should verify one specific behavior
- Tests run independently in isolation
- Syntax: `test('description', async ({ page }) => { ... })`

### 2. What is `expect`?
- An assertion function that verifies conditions
- If the condition is false, the test fails
- Playwright provides special async matchers
- Always use `await` with Playwright's `expect`

### 3. What is `async`?
- Keyword that marks a function as asynchronous
- Allows the function to use `await` inside
- Returns a Promise automatically
- Enables non-blocking code execution

### 4. What is `await`?
- Pauses execution until an asynchronous operation completes
- Can only be used inside `async` functions
- Makes async code easier to read and write
- Ensures operations happen in the correct order

### 5. What is `page`?
- An object representing a browser tab/window
- Automatically provided by Playwright test fixtures
- Contains methods for interacting with the webpage:
  - Navigation: `goto()`, `goBack()`, `reload()`
  - Interaction: `click()`, `fill()`, `selectOption()`
  - Locators: `getByRole()`, `getByText()`, `getByLabel()`
  - Evaluation: `title()`, `url()`, `content()`

---

## Async/Await Example

### Without Async/Await (Callbacks - Old Way)
```typescript
page.goto('https://playwright.dev/', () => {
  page.title((title) => {
    if (title.includes('Playwright')) {
      console.log('Test passed');
    }
  });
});
```

### With Async/Await (Modern Way)
```typescript
await page.goto('https://playwright.dev/');
const title = await page.title();
if (title.includes('Playwright')) {
  console.log('Test passed');
}
```

The async/await syntax is much cleaner and easier to understand!

---

## Common Page Methods

```typescript
// Navigation
await page.goto('https://example.com');
await page.goBack();
await page.reload();

// Finding elements
await page.getByRole('button', { name: 'Submit' });
await page.getByText('Hello World');
await page.getByLabel('Email');
await page.locator('#my-id');

// Interactions
await page.click('button');
await page.fill('input[name="email"]', 'test@example.com');
await page.selectOption('select', 'option1');
await page.check('input[type="checkbox"]');

// Assertions
await expect(page).toHaveTitle('My Page');
await expect(page).toHaveURL('https://example.com');
await expect(page.locator('h1')).toBeVisible();
await expect(page.locator('.error')).toContainText('Invalid');
```

---

## For More Information

For comprehensive documentation on writing Playwright tests, visit:
**https://playwright.dev/docs/writing-tests**

This official guide covers:
- Writing your first test
- Test structure and organization
- Locators and selectors
- Actions and assertions
- Auto-waiting and test isolation
- Test hooks and fixtures
- And much more!

---

## Practice Exercise

Try modifying the test file to:
1. Add a third test that checks if a specific element exists
2. Test clicking a different link on the page
3. Verify text content using `toContainText()`
4. Experiment with different locators (`getByText`, `getByLabel`, etc.)

Happy Testing! 🎭
