# Lab Exercise: Taqelah Boutique Login Test

**Duration:** 15 minutes
**Level:** Beginner
**Prerequisites:** Basic understanding of Playwright test structure

---

## 🎯 Objective

Create an automated test that logs into the Taqelah Boutique demo site and verifies the home page loads successfully.

---

## 📋 What You'll Learn

- How to navigate to a web page
- How to fill out form fields
- How to click buttons
- How to verify page elements after login
- How to use different types of locators

---

## 🌐 Application Under Test

**URL:** https://taqelah.sg/taqelah-demo-site.html

### Login Requirements

The Taqelah Boutique site has specific validation rules:

**Username:**
- Must be exactly **6 letters only**
- No numbers or special characters allowed
- Example: `ladies`, `autumn`, `spring`

**Password:**
- Must follow the format: `{username}_GO`
- Example: If username is `ladies`, password must be `ladies_GO`

### Test Credentials

You can use any of these credential pairs:

| Username | Password |
|----------|----------|
| `ladies` | `ladies_GO` |
| `autumn` | `autumn_GO` |
| `spring` | `spring_GO` |
| `winter` | `winter_GO` |

---

## 📝 Step-by-Step Instructions

### Step 1: Create a Fresh Project

1. Create a new Playwright project for this exercise:

```bash
# Create a new directory for the project
mkdir taqelah-lab-project
cd taqelah-lab-project

# Initialize a new Playwright project
npm init playwright@latest
```

When prompted:
- Accept the defaults for TypeScript, tests folder, and GitHub Actions
- Choose 'Yes' to install Playwright browsers

2. Once setup is complete, create a new file in the `tests/` folder named `taqelah-login.spec.ts`

### Step 2: Set Up the Test Structure

Add the basic test structure with imports:

```typescript
import { test, expect } from '@playwright/test';

test('user can login to Taqelah Boutique', async ({ page }) => {
  // Your test code will go here
});
```

**Explanation:**
- `import { test, expect }` - Imports the test function and assertion library
- `test('description', async ({ page }) => {})` - Defines an async test with access to a browser page
- `page` - Represents the browser tab where you'll interact with the website

### Step 3: Navigate to the Login Page

Add the navigation step inside your test:

```typescript
test('user can login to Taqelah Boutique', async ({ page }) => {
  // Step 1: Navigate to the Taqelah demo site
  await page.goto('https://taqelah.sg/taqelah-demo-site.html');
});
```

**What this does:**
- `await page.goto()` - Opens the specified URL in the browser
- `await` - Waits for the page to fully load before continuing

### Step 4: Fill in the Username

Locate and fill the username field:

```typescript
test('user can login to Taqelah Boutique', async ({ page }) => {
  // Step 1: Navigate to the Taqelah demo site
  await page.goto('https://taqelah.sg/taqelah-demo-site.html');

  // Step 2: Click and fill in the username (6 letters only)
  await page.getByTestId('username-input').click();
  await page.getByTestId('username-input').fill('ladies');
});
```

**How it works:**
- `getByTestId()` - Finds elements by their `data-testid` attribute
- `.click()` - Clicks on the input field to focus it
- `.fill()` - Types the specified text into the field

### Step 5: Fill in the Password

Add the password field:

```typescript
test('user can login to Taqelah Boutique', async ({ page }) => {
  // Step 1: Navigate to the Taqelah demo site
  await page.goto('https://taqelah.sg/taqelah-demo-site.html');

  // Step 2: Click and fill in the username (6 letters only)
  await page.getByTestId('username-input').click();
  await page.getByTestId('username-input').fill('ladies');

  // Step 3: Click and fill in the password (format: username_GO)
  await page.getByTestId('password-input').click();
  await page.getByTestId('password-input').fill('ladies_GO');
});
```

### Step 6: Click the Login Button

Locate and click the login button:

```typescript
test('user can login to Taqelah Boutique', async ({ page }) => {
  // Step 1: Navigate to the Taqelah demo site
  await page.goto('https://taqelah.sg/taqelah-demo-site.html');

  // Step 2: Click and fill in the username (6 letters only)
  await page.getByTestId('username-input').click();
  await page.getByTestId('username-input').fill('ladies');

  // Step 3: Click and fill in the password (format: username_GO)
  await page.getByTestId('password-input').click();
  await page.getByTestId('password-input').fill('ladies_GO');

  // Step 4: Click the login button
  await page.getByTestId('login-button').click();
});
```

**Understanding the login button:**
- `getByTestId('login-button')` - Finds the login button by its test ID
- `.click()` - Clicks the button to submit the login form

### Step 7: Verify Successful Login

Add assertions to verify the home page loaded:

```typescript
test('user can login to Taqelah Boutique', async ({ page }) => {
  // Step 1: Navigate to the Taqelah demo site
  await page.goto('https://taqelah.sg/taqelah-demo-site.html');

  // Step 2: Click and fill in the username (6 letters only)
  await page.getByTestId('username-input').click();
  await page.getByTestId('username-input').fill('ladies');

  // Step 3: Click and fill in the password (format: username_GO)
  await page.getByTestId('password-input').click();
  await page.getByTestId('password-input').fill('ladies_GO');

  // Step 4: Click the login button
  await page.getByTestId('login-button').click();

  // Step 5: Verify logout button is displayed (confirms successful login)
  await expect(page.getByTestId('logout-button')).toBeVisible();
});
```

**Assertion explanations:**
- `expect().toBeVisible()` - Verifies the element appears on the page
- `getByTestId('logout-button')` - Finds the logout button by its test ID
- The presence of the logout button confirms the user successfully logged in

---

## 🚀 Running Your Test

### Run in Headless Mode
```bash
npx playwright test taqelah-login.spec.ts
```

### Run with Visible Browser (Recommended for First Run)
```bash
npx playwright test taqelah-login.spec.ts --headed
```

### Run in Debug Mode
```bash
npx playwright test taqelah-login.spec.ts --debug
```

### Run in UI Mode (Interactive)
```bash
npx playwright test taqelah-login.spec.ts --ui
```

---

## ✅ Expected Results

When your test runs successfully, you should see:

1. Browser opens (if using `--headed`)
2. Navigates to the Taqelah demo site
3. Fills in username: `ladies`
4. Fills in password: `ladies_GO`
5. Clicks the Login button
6. Shop page appears with products
7. Test passes ✓

**Console output:**
```
Running 1 test using 1 worker

  ✓  taqelah-login.spec.ts:3:1 › user can login to Taqelah Boutique (5s)

  1 passed (6s)
```

---

## 🎓 Complete Test Code

Here's the full test for reference:

```typescript
import { test, expect } from '@playwright/test';

test('user can login to Taqelah Boutique', async ({ page }) => {
  // Step 1: Navigate to the Taqelah demo site
  await page.goto('https://taqelah.sg/taqelah-demo-site.html');

  // Step 2: Click and fill in the username (6 letters only)
  await page.getByTestId('username-input').click();
  await page.getByTestId('username-input').fill('ladies');

  // Step 3: Click and fill in the password (format: username_GO)
  await page.getByTestId('password-input').click();
  await page.getByTestId('password-input').fill('ladies_GO');

  // Step 4: Click the login button
  await page.getByTestId('login-button').click();

  // Step 5: Verify logout button is displayed
  await expect(page.getByTestId('logout-button')).toBeVisible();
});
```

---

## 🐛 Troubleshooting

### Issue: Test times out on login
**Solution:** The site may be slow. Increase timeout in your test:
```typescript
test('user can login to Taqelah Boutique', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... rest of test
});
```

### Issue: "Element not found" error
**Solution:**
1. Run with `--headed` to see what's happening
2. Use Playwright Inspector: `npx playwright test --debug`
3. Check if the element selector is correct
4. The page might need more time to load - add a wait:
```typescript
await page.waitForLoadState('networkidle');
```

### Issue: Login button doesn't work
**Solution:**
- Make sure username is exactly 6 letters
- Make sure password follows the `username_GO` format
- Try using a different locator:
```typescript
await page.locator('button:has-text("Login")').click();
```

### Issue: Test passes but you don't see the browser
**Solution:** Add the `--headed` flag:
```bash
npx playwright test taqelah-login.spec.ts --headed
```

---

## 📊 Understanding Test Results

### View HTML Report
```bash
npx playwright show-report
```

The report includes:
- Test execution time
- Screenshots on failure
- Step-by-step trace
- Console logs

### Check for Screenshots
If your test fails, Playwright automatically captures a screenshot:
```
test-results/
  taqelah-login-spec-user-can-login-to-Taqelah-Boutique/
    test-failed-1.png
```

---

## 💡 Best Practices Applied

1. **Clear test names** - "user can login to Taqelah Boutique" describes what the test does
2. **Comments** - Each step is documented for clarity
3. **Using test IDs** - `getByTestId` provides reliable, stable locators for test automation
4. **Explicit interactions** - Click before fill to ensure proper focus and interaction
5. **Waiting for async operations** - Using `await` properly ensures actions complete

---

## 🔗 Quick Reference

### Common Locators
```typescript
// By test ID (recommended for stable automation)
page.getByTestId('username-input')
page.getByTestId('login-button')

// By role
page.getByRole('button', { name: 'Login' })

// By text content
page.getByText('Welcome')

// By label
page.getByLabel('Username')

// By CSS selector
page.locator('#username')
page.locator('.btn-primary')
```

### Common Actions
```typescript
// Navigate
await page.goto('https://example.com')

// Click
await element.click()

// Type text
await element.fill('text')

// Press keyboard key
await element.press('Enter')

// Select dropdown
await page.selectOption('select', 'value')
```

### Common Assertions
```typescript
// Element visibility
await expect(element).toBeVisible()
await expect(element).toBeHidden()

// Text content
await expect(element).toHaveText('Expected text')
await expect(element).toContainText('Partial text')

// Values
await expect(input).toHaveValue('value')

// Page URL
await expect(page).toHaveURL('https://example.com')

// Count
await expect(page.locator('.item')).toHaveCount(5)
```

---

## 📚 Additional Resources

- [Playwright Locators Guide](https://playwright.dev/docs/locators)
- [Playwright Assertions](https://playwright.dev/docs/test-assertions)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Writing Tests](https://playwright.dev/docs/writing-tests)

---

## ✨ Congratulations!

You've successfully created your first real-world login test with Playwright! This test demonstrates core skills you'll use in every automation project:

- Page navigation
- Form interaction
- Button clicks
- Element verification
- Test structure and organization

**Next Steps:**
- Try the challenge exercises
- Experiment with different locators
- Add more assertions
- Test negative scenarios (invalid login)

Happy Testing!
