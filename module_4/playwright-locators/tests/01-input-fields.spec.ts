import { test, expect } from '@playwright/test';

/**
 * Component Tests: Input Fields
 *
 * Tests all interactions with text inputs, number inputs, date inputs,
 * password fields, and textareas using various locator strategies.
 */

test.describe('Input Fields Component Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://taqelah.sg/automation-testing-practice.html');
  });

  test.describe('Text Inputs', () => {

    test('should fill username field using label locator', async ({ page }) => {
      await page.getByLabel('Username').fill('john_doe');
      await expect(page.getByLabel('Username')).toHaveValue('john_doe');
    });

    test('should fill username using test ID', async ({ page }) => {
      await page.getByTestId('input-username').fill('testuser');
      await expect(page.getByTestId('input-username')).toHaveValue('testuser');
    });

    test('should clear and refill username field', async ({ page }) => {
      await page.getByLabel('Username').fill('first_user');
      await expect(page.getByLabel('Username')).toHaveValue('first_user');

      await page.getByLabel('Username').clear();
      await page.getByLabel('Username').fill('second_user');
      await expect(page.getByLabel('Username')).toHaveValue('second_user');
    });

    test('should fill username with regex label match', async ({ page }) => {
      await page.getByLabel(/username/i).fill('regex_user');
      await expect(page.getByLabel(/username/i)).toHaveValue('regex_user');
    });
  });

  test.describe('Email Inputs', () => {

    test('should fill email field using label locator', async ({ page }) => {
      await page.getByLabel('Email').fill('john@example.com');
      await expect(page.getByLabel('Email')).toHaveValue('john@example.com');
    });

    test('should fill email using test ID', async ({ page }) => {
      await page.getByTestId('input-email').fill('test@example.com');
      await expect(page.getByTestId('input-email')).toHaveValue('test@example.com');
    });

    test('should fill email with regex label match', async ({ page }) => {
      await page.getByLabel(/email/i).fill('regex@test.com');
      await expect(page.getByLabel(/email/i)).toHaveValue('regex@test.com');
    });
  });

  test.describe('Password Inputs', () => {

    test('should fill password field using label locator', async ({ page }) => {
      await page.getByLabel('Password').fill('SecurePass123');
      await expect(page.getByLabel('Password')).toHaveValue('SecurePass123');
    });

    test('should fill password using test ID', async ({ page }) => {
      await page.getByTestId('input-password').fill('Pass123');
      await expect(page.getByTestId('input-password')).toHaveValue('Pass123');
    });

    test('should fill password using role locator', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Password' }).fill('RolePass123');
      await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('RolePass123');
    });
  });

  test.describe('Number Inputs', () => {

    test('should fill age field using label locator', async ({ page }) => {
      await page.getByLabel('Age').fill('25');
      await expect(page.getByLabel('Age')).toHaveValue('25');
    });

    test('should fill age using test ID', async ({ page }) => {
      await page.getByTestId('input-age').fill('30');
      await expect(page.getByTestId('input-age')).toHaveValue('30');
    });
  });

  test.describe('Date Inputs', () => {

    test('should fill date of birth using label locator', async ({ page }) => {
      await page.getByLabel('Date of Birth').fill('1998-05-15');
      await expect(page.getByLabel('Date of Birth')).toHaveValue('1998-05-15');
    });

    test('should fill date using test ID', async ({ page }) => {
      await page.getByTestId('input-dob').fill('1993-05-15');
      await expect(page.getByTestId('input-dob')).toHaveValue('1993-05-15');
    });
  });

  test.describe('Textarea', () => {

    test('should fill comments textarea using label locator', async ({ page }) => {
      await page.getByLabel('Comments').fill('This is a test comment.');
      await expect(page.getByLabel('Comments')).toHaveValue('This is a test comment.');
    });

    test('should fill comments using test ID', async ({ page }) => {
      await page.getByTestId('input-comments').fill('Test comment via test ID');
      await expect(page.getByTestId('input-comments')).toHaveValue('Test comment via test ID');
    });
  });

  test.describe('Iframe Inputs', () => {

    test('should fill input inside iframe using role locator', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      await iframe.getByRole('textbox', { name: 'Test input in iframe' }).fill('Hello from role locator');

      await expect(iframe.getByRole('textbox', { name: 'Test input in iframe' })).toHaveValue('Hello from role locator');
    });

    test('should chain locators for iframe input', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      const textbox = iframe.getByRole('textbox', { name: 'Test input in iframe' });

      await textbox.fill('Chained locator value');
      await expect(textbox).toHaveValue('Chained locator value');
    });
  });

  test.describe('Placeholder Locators', () => {

    test('should detect inputs with placeholder attributes', async ({ page }) => {
      const inputsWithPlaceholder = page.locator('input[placeholder]');
      const count = await inputsWithPlaceholder.count();

      if (count > 0) {
        const placeholder = await inputsWithPlaceholder.first().getAttribute('placeholder');
        console.log(`Found input with placeholder: ${placeholder}`);
        await page.getByPlaceholder(placeholder!).fill('Test value');
      }
    });

    test('should use placeholder with regex pattern', async ({ page }) => {
      const emailPlaceholder = page.getByPlaceholder(/email/i);
      const emailCount = await emailPlaceholder.count();

      if (emailCount > 0) {
        await emailPlaceholder.fill('placeholder@test.com');
        console.log('Found and filled input with email placeholder');
      }
    });
  });

  test.describe('Complete Form Filling', () => {

    test('should fill complete form using label locators', async ({ page }) => {
      await page.getByLabel('Username').fill('testuser');
      await page.getByLabel('Email').fill('test@example.com');
      await page.getByLabel('Password').fill('Password123');
      await page.getByLabel('Age').fill('30');
      await page.getByLabel('Date of Birth').fill('1993-01-01');
      await page.getByLabel('Comments').fill('Complete form filled using label locators');

      await expect(page.getByLabel('Username')).toHaveValue('testuser');
      await expect(page.getByLabel('Email')).toHaveValue('test@example.com');
    });

    test('should fill complete form using test IDs', async ({ page }) => {
      await page.getByTestId('input-username').fill('testuser');
      await page.getByTestId('input-email').fill('test@example.com');
      await page.getByTestId('input-password').fill('Pass123');
      await page.getByTestId('input-age').fill('25');
      await page.getByTestId('input-dob').fill('1998-01-01');
      await page.getByTestId('input-comments').fill('Complete form submission');

      await expect(page.getByTestId('input-username')).toHaveValue('testuser');
      await expect(page.getByTestId('input-email')).toHaveValue('test@example.com');
    });

    test('should use multiple locator strategies together', async ({ page }) => {
      await page.getByLabel('Username').fill('user');
      await page.getByTestId('input-email').fill('test@test.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('pass');

      await expect(page.getByLabel('Username')).toHaveValue('user');
      await expect(page.getByTestId('input-email')).toHaveValue('test@test.com');
    });
  });
});
