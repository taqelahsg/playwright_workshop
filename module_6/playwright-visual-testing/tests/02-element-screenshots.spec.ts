import { test, expect } from '@playwright/test';

/**
 * Element-Level Visual Tests
 *
 * Test specific UI components rather than full pages.
 * This is useful for:
 * - Component libraries
 * - Interactive elements with different states
 * - Isolated component testing
 */
test.describe('Element-Level Visual Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');
    await page.waitForLoadState('networkidle');
  });

  test('login form screenshot', async ({ page }) => {
    // Target specific element
    const loginForm = page.locator('form').first();

    await expect(loginForm).toHaveScreenshot('login-form.png');
  });

  test('login button screenshot', async ({ page }) => {
    const loginButton = page.getByTestId('login-button');

    await expect(loginButton).toHaveScreenshot('login-button.png');
  });

  test('username input screenshot', async ({ page }) => {
    const usernameInput = page.getByTestId('username-input');

    await expect(usernameInput).toHaveScreenshot('username-input.png');
  });

  test('input field with focus state', async ({ page }) => {
    const usernameInput = page.getByTestId('username-input');

    // Capture default state
    await expect(usernameInput).toHaveScreenshot('input-default.png');

    // Capture focus state
    await usernameInput.focus();
    await expect(usernameInput).toHaveScreenshot('input-focused.png');

    // Capture filled state
    await usernameInput.fill('test_user');
    await expect(usernameInput).toHaveScreenshot('input-filled.png');
  });

  test('button hover state', async ({ page }) => {
    const loginButton = page.getByTestId('login-button');

    // Default state
    await expect(loginButton).toHaveScreenshot('button-default.png');

    // Hover state
    await loginButton.hover();
    await expect(loginButton).toHaveScreenshot('button-hover.png');
  });

  test('multiple elements in sequence', async ({ page }) => {
    // Test multiple form fields
    const formElements = [
      { locator: page.getByTestId('username-input'), name: 'username' },
      { locator: page.getByTestId('password-input'), name: 'password' },
      { locator: page.getByTestId('login-button'), name: 'submit' },
    ];

    for (const element of formElements) {
      await expect(element.locator).toHaveScreenshot(`form-${element.name}.png`);
    }
  });
});
