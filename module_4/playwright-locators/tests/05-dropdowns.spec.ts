import { test, expect } from '@playwright/test';

/**
 * Component Tests: Dropdowns & Select Elements
 *
 * Tests all dropdown/select interactions including single-select dropdowns,
 * multi-select lists using role, label, and test ID locators.
 */

test.describe('Dropdowns & Select Component Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://taqelah.sg/automation-testing-practice.html');
  });

  test.describe('Country Dropdown - Role Locator', () => {

    test('should select country using role locator (combobox)', async ({ page }) => {
      await page.getByRole('combobox', { name: 'Country' }).selectOption('canada');

      await expect(page.getByRole('combobox', { name: 'Country' })).toHaveValue('canada');
    });

    test('should select different countries', async ({ page }) => {
      await page.getByRole('combobox', { name: 'Country' }).selectOption('usa');
      await expect(page.getByRole('combobox', { name: 'Country' })).toHaveValue('usa');

      await page.getByRole('combobox', { name: 'Country' }).selectOption('uk');
      await expect(page.getByRole('combobox', { name: 'Country' })).toHaveValue('uk');
    });
  });

  test.describe('Country Dropdown - Label Locator', () => {

    test('should select country using label locator', async ({ page }) => {
      await page.getByLabel('Country').selectOption('canada');
      await expect(page.getByLabel('Country')).toHaveValue('canada');
    });
  });

  test.describe('Country Dropdown - Test ID Locator', () => {

    test('should select country using test ID', async ({ page }) => {
      await page.getByTestId('select-country').selectOption('canada');
      await expect(page.getByTestId('select-country')).toHaveValue('canada');
    });
  });

  test.describe('Category Dropdown - Role Locator', () => {

    test('should select category using role locator', async ({ page }) => {
      await page.getByTestId('select-category').selectOption('clothing');
      await expect(page.getByTestId('select-category')).toHaveValue('clothing');
    });

    test('should select electronics category', async ({ page }) => {
      await page.getByTestId('select-category').selectOption('electronics');
      await expect(page.getByTestId('select-category')).toHaveValue('electronics');
    });
  });

  test.describe('Category Dropdown - Label Locator', () => {

    test('should select category using label locator', async ({ page }) => {
      await page.getByTestId('select-category').selectOption('clothing');
      await expect(page.getByTestId('select-category')).toHaveValue('clothing');
    });
  });

  test.describe('Category Dropdown - Test ID Locator', () => {

    test('should select category using test ID', async ({ page }) => {
      await page.getByTestId('select-category').selectOption('clothing');
      await expect(page.getByTestId('select-category')).toHaveValue('clothing');
    });
  });

  test.describe('Subcategory Dropdown', () => {

    test('should select subcategory using label locator', async ({ page }) => {
      // Select category first to enable subcategory dropdown
      await page.getByTestId('select-category').selectOption('clothing');
      await page.getByTestId('select-subcategory').selectOption('pants');
      await expect(page.getByTestId('select-subcategory')).toHaveValue('pants');
    });

    test('should select subcategory using test ID', async ({ page }) => {
      // Select category first to enable subcategory dropdown
      await page.getByTestId('select-category').selectOption('clothing');
      await page.getByTestId('select-subcategory').selectOption('pants');
      await expect(page.getByTestId('select-subcategory')).toHaveValue('pants');
    });
  });

  test.describe('Skills Multi-Select - Label Locator', () => {

    test('should select single skill from multi-select', async ({ page }) => {
      await page.getByLabel('Skills').selectOption('html');

      const selectedOptions = await page.getByLabel('Skills').evaluate((select: HTMLSelectElement) => {
        return Array.from(select.selectedOptions).map(option => option.value);
      });

      expect(selectedOptions).toContain('html');
    });

    test('should select multiple skills from multi-select', async ({ page }) => {
      await page.getByLabel('Skills').selectOption(['html', 'css', 'javascript']);

      const selectedOptions = await page.getByLabel('Skills').evaluate((select: HTMLSelectElement) => {
        return Array.from(select.selectedOptions).map(option => option.value);
      });

      expect(selectedOptions).toContain('html');
      expect(selectedOptions).toContain('css');
      expect(selectedOptions).toContain('javascript');
    });
  });

  test.describe('Skills Multi-Select - Test ID Locator', () => {

    test('should select single option from multi-select using test ID', async ({ page }) => {
      await page.getByTestId('select-skills').selectOption('html');

      const selectedValues = await page.getByTestId('select-skills').evaluate((select: HTMLSelectElement) => {
        return Array.from(select.selectedOptions).map(opt => opt.value);
      });

      expect(selectedValues).toContain('html');
    });

    test('should select multiple options from multi-select using test ID', async ({ page }) => {
      await page.getByTestId('select-skills').selectOption(['html', 'css', 'javascript']);

      const selectedValues = await page.getByTestId('select-skills').evaluate((select: HTMLSelectElement) => {
        return Array.from(select.selectedOptions).map(opt => opt.value);
      });

      expect(selectedValues).toContain('html');
      expect(selectedValues).toContain('css');
      expect(selectedValues).toContain('javascript');
    });

    test('should replace selection when selecting new options', async ({ page }) => {
      // First selection
      await page.getByTestId('select-skills').selectOption('html');

      // New selection (replaces previous)
      await page.getByTestId('select-skills').selectOption(['css', 'javascript', 'react']);

      const selectedValues = await page.getByTestId('select-skills').evaluate((select: HTMLSelectElement) => {
        return Array.from(select.selectedOptions).map(opt => opt.value);
      });

      expect(selectedValues).toContain('css');
      expect(selectedValues).toContain('javascript');
      expect(selectedValues).toContain('react');
    });
  });

  test.describe('Dropdown Options Verification', () => {

    test('should verify country dropdown has options', async ({ page }) => {
      const countryOptions = page.getByTestId('select-country').locator('option');
      const count = await countryOptions.count();

      console.log(`Country dropdown has ${count} options`);
      expect(count).toBeGreaterThan(0);
    });

    test('should verify all text in country dropdown options', async ({ page }) => {
      const countryOptions = page.getByTestId('select-country').locator('option');
      const count = await countryOptions.count();

      console.log(`Country dropdown has ${count} options`);
      expect(count).toBeGreaterThan(0);

      const optionTexts = await countryOptions.allTextContents();
      console.log('Country options:', optionTexts);
    });
  });

  test.describe('Multiple Dropdowns in Form', () => {

    test('should select from multiple dropdowns using labels', async ({ page }) => {
      await page.getByLabel('Country').selectOption('canada');
      await page.getByTestId('select-category').selectOption('clothing');
      await page.getByTestId('select-subcategory').selectOption('pants');

      await expect(page.getByLabel('Country')).toHaveValue('canada');
      await expect(page.getByTestId('select-category')).toHaveValue('clothing');
      await expect(page.getByTestId('select-subcategory')).toHaveValue('pants');
    });

    test('should select from multiple dropdowns using test IDs', async ({ page }) => {
      await page.getByTestId('select-country').selectOption('canada');
      await page.getByTestId('select-category').selectOption('clothing');
      await page.getByTestId('select-subcategory').selectOption('pants');

      await expect(page.getByTestId('select-country')).toHaveValue('canada');
      await expect(page.getByTestId('select-category')).toHaveValue('clothing');
      await expect(page.getByTestId('select-subcategory')).toHaveValue('pants');
    });

    test('should select from dropdowns using role locators', async ({ page }) => {
      await page.getByRole('combobox', { name: 'Country' }).selectOption('canada');
      await page.getByTestId('select-category').selectOption('electronics');

      await expect(page.getByRole('combobox', { name: 'Country' })).toHaveValue('canada');
      await expect(page.getByTestId('select-category')).toHaveValue('electronics');
    });
  });

  test.describe('Complete Form with Dropdowns', () => {

    test('should fill complete form including dropdowns using labels', async ({ page }) => {
      await page.getByLabel('Username').fill('testuser');
      await page.getByLabel('Email').fill('test@example.com');
      await page.locator('input[type="radio"][value="male"][name="gender"]').check();
      await page.locator('input[type="radio"][value="intermediate"]').check();

      await page.getByLabel('Country').selectOption('canada');
      await page.getByTestId('select-category').selectOption('electronics');

      await expect(page.getByLabel('Username')).toHaveValue('testuser');
      await expect(page.getByLabel('Country')).toHaveValue('canada');
    });

    test('should fill complete form including all dropdowns using test IDs', async ({ page }) => {
      await page.getByTestId('input-username').fill('testuser');
      await page.getByTestId('radio-male').check();
      await page.getByTestId('radio-intermediate').check();

      await page.getByTestId('select-country').selectOption('canada');
      await page.getByTestId('select-category').selectOption('electronics');
      await page.getByTestId('select-skills').selectOption(['html', 'javascript', 'react']);

      await expect(page.getByTestId('input-username')).toHaveValue('testuser');
      await expect(page.getByTestId('select-country')).toHaveValue('canada');
    });

    test('should use multiple locator strategies for dropdowns in form', async ({ page }) => {
      await page.getByLabel('Username').fill('user');
      await page.getByTestId('input-email').fill('test@test.com');

      await page.getByRole('combobox', { name: 'Country' }).selectOption('canada');
      await page.getByTestId('select-category').selectOption('clothing');

      await expect(page.getByRole('combobox', { name: 'Country' })).toHaveValue('canada');
      await expect(page.getByTestId('select-category')).toHaveValue('clothing');
    });
  });

  test.describe('Best Practices', () => {

    test('should prioritize user-facing dropdown locators', async ({ page }) => {
      // Good: Using role (how users see it)
      await page.getByRole('combobox', { name: 'Country' }).selectOption('canada');

      // Good: Using test ID for specificity
      await page.getByTestId('select-category').selectOption('electronics');

      await expect(page.getByRole('combobox', { name: 'Country' })).toHaveValue('canada');
      await expect(page.getByTestId('select-category')).toHaveValue('electronics');
    });

    test('should make dropdown locators readable and maintainable', async ({ page }) => {
      const countryDropdown = page.getByRole('combobox', { name: 'Country' });
      const categoryDropdown = page.getByTestId('select-category');

      await countryDropdown.selectOption('canada');
      await categoryDropdown.selectOption('clothing');

      await expect(countryDropdown).toHaveValue('canada');
      await expect(categoryDropdown).toHaveValue('clothing');
    });
  });
});
