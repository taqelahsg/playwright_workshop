import { test, expect } from '@playwright/test';

/**
 * Component Tests: Checkboxes
 *
 * Tests all checkbox interactions including programming language selection,
 * terms and conditions, check all/uncheck all functionality using various locator strategies.
 */

test.describe('Checkboxes Component Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://taqelah.sg/automation-testing-practice.html');
  });

  test.describe('Programming Language Checkboxes - Role Locator', () => {

    test('should check JavaScript using role locator', async ({ page }) => {
      await page.getByRole('checkbox', { name: 'JavaScript' }).check();
      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
    });

    test('should check Python using role locator', async ({ page }) => {
      await page.getByRole('checkbox', { name: 'Python' }).check();
      await expect(page.getByRole('checkbox', { name: 'Python' })).toBeChecked();
    });

    test('should check Java using role locator', async ({ page }) => {
      await page.getByTestId('checkbox-java').check();
      await expect(page.getByTestId('checkbox-java')).toBeChecked();
    });

    test('should check C# using role locator', async ({ page }) => {
      await page.getByRole('checkbox', { name: 'C#' }).check();
      await expect(page.getByRole('checkbox', { name: 'C#' })).toBeChecked();
    });

    test('should check multiple checkboxes using role locator', async ({ page }) => {
      await page.getByRole('checkbox', { name: 'JavaScript' }).check();
      await page.getByRole('checkbox', { name: 'Python' }).check();
      await page.getByTestId('checkbox-java').check();

      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Python' })).toBeChecked();
      await expect(page.getByTestId('checkbox-java')).toBeChecked();
    });
  });

  test.describe('Programming Language Checkboxes - Label Locator', () => {

    test('should check checkboxes by label', async ({ page }) => {
      await page.getByLabel('JavaScript').check();
      await page.getByLabel('Python').check();
      await page.getByTestId('checkbox-java').check();
      await page.getByLabel('C#').check();

      await expect(page.getByLabel('JavaScript')).toBeChecked();
      await expect(page.getByLabel('Python')).toBeChecked();
      await expect(page.getByTestId('checkbox-java')).toBeChecked();
      await expect(page.getByLabel('C#')).toBeChecked();
    });
  });

  test.describe('Programming Language Checkboxes - Text Locator', () => {

    test('should interact with checkbox labels using text', async ({ page }) => {
      const checkboxGroup = page.getByTestId('checkbox-group-languages');
      await checkboxGroup.getByText('JavaScript').click();
      await checkboxGroup.getByText('Python').click();
      await checkboxGroup.getByText('C#').click();

      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
    });

    test('should use exact text match to avoid ambiguity', async ({ page }) => {
      // When "Java" might match "JavaScript", use exact option or scoped selector
      const checkboxGroup = page.getByTestId('checkbox-group-languages');
      await checkboxGroup.getByText('Java', { exact: true }).click();

      // This ensures only "Java" is matched, not "JavaScript"
      await expect(page.getByTestId('checkbox-java')).toBeChecked();
    });

    test('should handle text with special characters', async ({ page }) => {
      await page.getByText('C#').click();
      await expect(page.getByRole('checkbox', { name: 'C#' })).toBeChecked();
    });
  });

  test.describe('Checkbox Group with Test ID', () => {

    test('should interact with checkbox group using test ID', async ({ page }) => {
      const checkboxGroup = page.getByTestId('checkbox-group-languages');

      await checkboxGroup.getByText('JavaScript').click();
      await checkboxGroup.getByText('Python').click();
      await checkboxGroup.getByText('Java', { exact: true }).click();
      await checkboxGroup.getByText('C#').click();

      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Python' })).toBeChecked();
    });

    test('should find checkbox within specific section', async ({ page }) => {
      const checkboxGroup = page.getByTestId('checkbox-group-languages');
      await checkboxGroup.getByText('JavaScript').click();
      await checkboxGroup.getByText('Python').click();

      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Python' })).toBeChecked();
    });

    test('should chain locators to narrow down checkbox search', async ({ page }) => {
      const checkboxGroup = page.getByTestId('checkbox-group-languages');
      await checkboxGroup.getByText('JavaScript').click();
      await checkboxGroup.getByText('Python').click();

      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Python' })).toBeChecked();
    });

    test('should filter checkboxes by text content', async ({ page }) => {
      const checkboxGroup = page.getByTestId('checkbox-group-languages');

      await checkboxGroup.filter({ hasText: 'Python' }).getByText('Python').click();

      await expect(page.getByRole('checkbox', { name: 'Python' })).toBeChecked();
    });
  });

  test.describe('Check All / Uncheck All Functionality', () => {

    test('should uncheck all checkboxes', async ({ page }) => {
      await page.getByTestId('btn-uncheck-all').click();

      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).not.toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Python' })).not.toBeChecked();
    });

    test('should check all checkboxes', async ({ page }) => {
      await page.getByTestId('btn-check-all').click();

      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Python' })).toBeChecked();
    });

    test('should manage checkboxes with check all and uncheck all buttons', async ({ page }) => {
      // Uncheck all first
      await page.getByTestId('btn-uncheck-all').click();
      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).not.toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Python' })).not.toBeChecked();

      // Then check all
      await page.getByTestId('btn-check-all').click();
      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Python' })).toBeChecked();
    });
  });

  test.describe('Terms and Conditions Checkbox', () => {

    test('should check agreement checkbox using text', async ({ page }) => {
      await page.getByText('I agree to terms and').click();

      await expect(page.getByRole('checkbox', { name: /terms/i })).toBeChecked();
    });

    test('should handle checkbox with multi-word label', async ({ page }) => {
      await page.getByLabel(/I agree to terms/i).check();
      await expect(page.getByLabel(/I agree to terms/i)).toBeChecked();

      await page.getByLabel(/I agree to terms/i).uncheck();
      await expect(page.getByLabel(/I agree to terms/i)).not.toBeChecked();
    });

    test('should check and uncheck using label locators', async ({ page }) => {
      const termsCheckbox = page.getByLabel(/I agree to terms/i);

      await termsCheckbox.check();
      await expect(termsCheckbox).toBeChecked();

      await termsCheckbox.uncheck();
      await expect(termsCheckbox).not.toBeChecked();

      await termsCheckbox.check();
      await expect(termsCheckbox).toBeChecked();
    });
  });

  test.describe('Checkbox List Operations', () => {

    test('should count all checkboxes on page', async ({ page }) => {
      const checkboxes = page.getByRole('checkbox');
      const count = await checkboxes.count();

      console.log(`Found ${count} checkboxes`);
      expect(count).toBeGreaterThan(0);
    });

    test('should iterate through checkbox list items', async ({ page }) => {
      const checkboxes = page.getByRole('checkbox');
      const count = await checkboxes.count();

      // Check first three checkboxes
      for (let i = 0; i < Math.min(count, 3); i++) {
        await checkboxes.nth(i).check();
      }

      // Verify first three are checked
      for (let i = 0; i < Math.min(count, 3); i++) {
        await expect(checkboxes.nth(i)).toBeChecked();
      }
    });

    test('should select nth checkbox from list', async ({ page }) => {
      const checkboxes = page.getByRole('checkbox');
      await checkboxes.nth(1).check();
      await expect(checkboxes.nth(1)).toBeChecked();
    });
  });

  test.describe('Complete Form with Checkboxes', () => {

    test('should fill complete form with checkboxes using labels', async ({ page }) => {
      await page.getByLabel('Username').fill('testuser');
      await page.getByLabel('Email').fill('test@example.com');

      await page.locator('input[type="radio"][value="male"][name="gender"]').check();
      await page.locator('input[type="radio"][value="intermediate"]').check();

      await page.getByLabel('JavaScript').check();
      await page.getByLabel('Python').check();

      await expect(page.getByLabel('JavaScript')).toBeChecked();
      await expect(page.getByLabel('Python')).toBeChecked();
    });

    test('should complete form using test IDs with check all', async ({ page }) => {
      await page.getByTestId('input-username').fill('testuser');
      await page.getByTestId('radio-male').check();
      await page.getByTestId('radio-intermediate').check();

      await page.getByTestId('btn-check-all').click();

      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
      await expect(page.getByTestId('radio-male')).toBeChecked();
    });
  });

  test.describe('Checkbox Filtering', () => {

    test('should combine multiple checkbox locator strategies', async ({ page }) => {
      const inputGroup = page.getByTestId('checkbox-group-languages');
      const checkbox = inputGroup.getByRole('checkbox', { name: 'JavaScript' });

      await checkbox.check();
      await expect(checkbox).toBeChecked();
    });

    test('should combine filtering and chaining for checkboxes', async ({ page }) => {
      const languageSection = page.getByTestId('checkbox-group-languages')
        .filter({ hasText: 'JavaScript' });

      await languageSection.getByText('JavaScript').click();
      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
    });
  });

  test.describe('Best Practices', () => {

    test('should make checkbox locators specific and readable', async ({ page }) => {
      const jsCheckbox = page.getByRole('checkbox', { name: 'JavaScript' });
      const pythonCheckbox = page.getByRole('checkbox', { name: 'Python' });

      await jsCheckbox.check();
      await pythonCheckbox.check();

      await expect(jsCheckbox).toBeChecked();
      await expect(pythonCheckbox).toBeChecked();
    });

    test('should prioritize user-facing checkbox locators', async ({ page }) => {
      // Good: Using role (how users see it)
      await page.getByRole('checkbox', { name: 'JavaScript' }).check();

      // Good: Using label (how users identify form fields)
      await page.getByLabel('Python').check();

      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
      await expect(page.getByLabel('Python')).toBeChecked();
    });
  });
});
