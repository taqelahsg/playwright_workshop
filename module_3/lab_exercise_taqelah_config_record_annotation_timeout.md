# 🧪 Lab Exercises

## Lab 1: Configure Your Project
**Task:** Create a custom configuration:
1. Set base URL to https://taqelah.sg/taqelah-demo-site.html
2. Configure screenshots on failure
3. Set test timeout to 60 seconds
4. Enable video recording on failure
5. Set 2 retries for failed tests

**Expected file:** `playwright.config.ts`

---

## Lab 2: Record Login Test with Codegen
**Task:** Use Codegen to record a login test with base URL:
1. First, set the base URL in your `playwright.config.ts`:
   ```typescript
   use: {
     baseURL: 'https://taqelah.sg/taqelah-demo-site.html',
   }
   ```
2. Run: `npx playwright codegen https://taqelah.sg/taqelah-demo-site.html`
3. Record a test that:
   - Clicks on the login link/button
   - Fills in username (similar to Module 2)
   - Fills in password
   - Clicks the Login button
   - Verifies successful login
4. Save to `tests/login-recorded.spec.ts`
5. Clean up and improve the generated code
6. Update the `page.goto()` to use the base URL (change from full URL to `'/'`)

**Expected outcome:** A working login test that uses the configured base URL

---

## Lab 3: Master the CLI
**Practice these commands:**
```bash
# Run all tests
npx playwright test

# Run in headed mode
npx playwright test --headed

# Run with UI
npx playwright test --ui

# Debug a specific test
npx playwright test login.spec.ts --debug

# Run tests matching "login"
npx playwright test --grep "login"

# Run only Chromium tests
npx playwright test --project=chromium
```

---

## Lab 4: Organize Tests with Annotations
**Task:** Create organized test suite:
1. Create `tests/login-validation.spec.ts`
2. Write 2 tests:
   - 2 tests tagged with @regression (successful login with valid credentials and failed login with invalid password )
   - 1 test tagged with @smoke (successful login with valid credentials)
3. Run only smoke tests: `npx playwright test --grep @smoke`

**Example structure:**
```typescript
test('successful login with valid credentials @regression @smoke', async ({ page }) => { /* ... */ });
test('failed login with invalid password @regression', async ({ page }) => { /* ... */ });
```
