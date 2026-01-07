import { test, expect } from '@playwright/test';

/**
 * Component Tests: Radio Buttons
 *
 * Tests all radio button interactions including gender selection,
 * expertise level selection using role, label, text, and test ID locators.
 */

test.describe('Radio Buttons Component Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://taqelah.sg/automation-testing-practice.html');
  });

  test.describe('Gender Radio Buttons - Role Locator', () => {

    test('should select Male using role locator', async ({ page }) => {
      // Use role locator with specific value filter
      await page.locator('input[type="radio"][value="male"]').check();
      await expect(page.locator('input[type="radio"][value="male"]')).toBeChecked();
    });

    test('should select Female using role locator', async ({ page }) => {
      await page.getByRole('radio', { name: 'Female' }).check();
      await expect(page.getByRole('radio', { name: 'Female' })).toBeChecked();
    });

    test('should select Other using role locator', async ({ page }) => {
      await page.getByRole('radio', { name: 'Other' }).check();
      await expect(page.getByRole('radio', { name: 'Other' })).toBeChecked();
    });

    test('should verify only one gender radio button is checked at a time', async ({ page }) => {
      await page.locator('input[type="radio"][value="male"]').check();
      await expect(page.locator('input[type="radio"][value="male"]')).toBeChecked();

      await page.locator('input[type="radio"][value="female"]').check();
      await expect(page.locator('input[type="radio"][value="female"]')).toBeChecked();
      await expect(page.locator('input[type="radio"][value="male"]')).not.toBeChecked();

      await page.locator('input[type="radio"][value="other"]').check();
      await expect(page.locator('input[type="radio"][value="other"]')).toBeChecked();
      await expect(page.locator('input[type="radio"][value="female"]')).not.toBeChecked();
    });
  });

  test.describe('Gender Radio Buttons - Label Locator', () => {

    test('should select Male using label locator', async ({ page }) => {
      // Use locator to find the input by value, as labels don't have proper 'for' attribute
      await page.locator('input[type="radio"][value="male"][name="gender"]').check();
      await expect(page.locator('input[type="radio"][value="male"][name="gender"]')).toBeChecked();
    });

    test('should select Female using label locator', async ({ page }) => {
      await page.locator('input[type="radio"][value="female"][name="gender"]').check();
      await expect(page.locator('input[type="radio"][value="female"][name="gender"]')).toBeChecked();
    });

    test('should select Other using label locator', async ({ page }) => {
      await page.locator('input[type="radio"][value="other"][name="gender"]').check();
      await expect(page.locator('input[type="radio"][value="other"][name="gender"]')).toBeChecked();
    });

    test('should verify radio button exclusivity using labels', async ({ page }) => {
      await page.locator('input[type="radio"][value="male"][name="gender"]').check();
      await expect(page.locator('input[type="radio"][value="male"][name="gender"]')).toBeChecked();

      await page.locator('input[type="radio"][value="female"][name="gender"]').check();
      await expect(page.locator('input[type="radio"][value="female"][name="gender"]')).toBeChecked();
      await expect(page.locator('input[type="radio"][value="male"][name="gender"]')).not.toBeChecked();
    });
  });

  test.describe('Gender Radio Buttons - Test ID Locator', () => {

    test('should select gender using test IDs', async ({ page }) => {
      await page.getByTestId('radio-male').check();
      await expect(page.getByTestId('radio-male')).toBeChecked();

      await page.getByTestId('radio-female').check();
      await expect(page.getByTestId('radio-female')).toBeChecked();

      await page.getByTestId('radio-other').check();
      await expect(page.getByTestId('radio-other')).toBeChecked();
    });
  });

  test.describe('Expertise Level Radio Buttons - Role Locator', () => {

    test('should select Beginner using role locator', async ({ page }) => {
      await page.getByRole('radio', { name: 'Beginner' }).check();
      await expect(page.getByRole('radio', { name: 'Beginner' })).toBeChecked();
    });

    test('should select Intermediate using role locator', async ({ page }) => {
      await page.getByRole('radio', { name: 'Intermediate' }).check();
      await expect(page.getByRole('radio', { name: 'Intermediate' })).toBeChecked();
    });

    test('should select Expert using role locator', async ({ page }) => {
      await page.getByRole('radio', { name: 'Expert' }).check();
      await expect(page.getByRole('radio', { name: 'Expert' })).toBeChecked();
    });
  });

  test.describe('Expertise Level Radio Buttons - Label Locator', () => {

    test('should select expertise levels using label locator', async ({ page }) => {
      await page.getByLabel('Beginner').check();
      await expect(page.getByLabel('Beginner')).toBeChecked();

      await page.getByLabel('Intermediate').check();
      await expect(page.getByLabel('Intermediate')).toBeChecked();

      await page.getByLabel('Expert').check();
      await expect(page.getByLabel('Expert')).toBeChecked();
    });
  });

  test.describe('Expertise Level Radio Buttons - Text Locator', () => {

    test('should select radio button labels by text', async ({ page }) => {
      await page.getByText('Beginner').click();
      await page.getByText('Intermediate').click();

      // Using exact match for text that might be partial match elsewhere
      await page.getByText('Java', { exact: true }).click();
    });
  });

  test.describe('Expertise Level Radio Buttons - Test ID Locator', () => {

    test('should select expertise using test IDs', async ({ page }) => {
      await page.getByTestId('radio-beginner').check();
      await expect(page.getByTestId('radio-beginner')).toBeChecked();

      await page.getByTestId('radio-intermediate').check();
      await expect(page.getByTestId('radio-intermediate')).toBeChecked();

      await page.getByTestId('radio-expert').check();
      await expect(page.getByTestId('radio-expert')).toBeChecked();
    });
  });

  test.describe('Radio Button Count and Selection', () => {

    test('should count all radio buttons on page', async ({ page }) => {
      const radioButtons = page.getByRole('radio');
      const count = await radioButtons.count();

      console.log(`Found ${count} radio buttons`);
      expect(count).toBeGreaterThan(0);
    });

    test('should select first radio button from list', async ({ page }) => {
      const firstRadio = page.getByRole('radio').first();
      await firstRadio.check();
      await expect(firstRadio).toBeChecked();
    });

    test('should select last radio button from list', async ({ page }) => {
      const lastRadio = page.getByRole('radio').last();
      await lastRadio.check();
      await expect(lastRadio).toBeChecked();
    });

    test('should select nth radio button from list', async ({ page }) => {
      // Select third radio button (zero-indexed)
      const thirdRadio = page.getByRole('radio').nth(2);
      await thirdRadio.check();
      await expect(thirdRadio).toBeChecked();
    });
  });

  test.describe('Complete Form with Radio Buttons', () => {

    test('should select gender and expertise in complete form', async ({ page }) => {
      // Fill text inputs
      await page.getByLabel('Username').fill('testuser');
      await page.getByLabel('Email').fill('test@example.com');

      // Select radio buttons
      await page.locator('input[type="radio"][value="male"][name="gender"]').check();
      await page.locator('input[type="radio"][value="intermediate"]').check();

      // Verify selections
      await expect(page.locator('input[type="radio"][value="male"]')).toBeChecked();
      await expect(page.locator('input[type="radio"][value="intermediate"]')).toBeChecked();
    });

    test('should use test IDs in complete form', async ({ page }) => {
      await page.getByTestId('input-username').fill('testuser');
      await page.getByTestId('radio-male').check();
      await page.getByTestId('radio-intermediate').check();

      await expect(page.getByTestId('radio-male')).toBeChecked();
      await expect(page.getByTestId('radio-intermediate')).toBeChecked();
    });
  });

  test.describe('Best Practices', () => {

    test('should make radio button locators specific to avoid strictness issues', async ({ page }) => {
      // Good: Specific locator using value attribute to avoid strictness issues
      await page.locator('input[type="radio"][value="male"]').check();
      await expect(page.locator('input[type="radio"][value="male"]')).toBeChecked();
    });

    test('should make locators readable and maintainable', async ({ page }) => {
      const maleRadio = page.locator('input[type="radio"][value="male"]');
      const intermediateRadio = page.locator('input[type="radio"][value="intermediate"]');

      await maleRadio.check();
      await intermediateRadio.check();

      await expect(maleRadio).toBeChecked();
      await expect(intermediateRadio).toBeChecked();
    });
  });
});
