import { test, expect } from '@playwright/test';

/**
 * Advanced Locator Techniques
 *
 * Tests advanced locator features including chaining, filtering, combining,
 * list operations, strictness handling, and best practices.
 */

test.describe('Advanced Locator Techniques', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://taqelah.sg/automation-testing-practice.html');
  });

  test.describe('Chaining Locators', () => {

    test('should chain locators to narrow down search', async ({ page }) => {
      const checkboxGroup = page.getByTestId('checkbox-group-languages');
      await checkboxGroup.getByText('JavaScript').click();
      await checkboxGroup.getByText('Python').click();

      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Python' })).toBeChecked();
    });

    test('should chain multiple locators for precision', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      const textbox = iframe.getByRole('textbox', { name: 'Test input in iframe' });

      await textbox.fill('Chained locator value');
      await expect(textbox).toHaveValue('Chained locator value');
    });

    test('should chain locators within specific sections', async ({ page }) => {
      const checkboxGroup = page.getByTestId('checkbox-group-languages');
      await checkboxGroup.getByRole('checkbox', { name: 'JavaScript' }).check();

      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
    });
  });

  test.describe('Filtering Locators', () => {

    test('should filter by text content', async ({ page }) => {
      const checkboxGroup = page.getByTestId('checkbox-group-languages');

      await checkboxGroup.filter({ hasText: 'Python' }).getByText('Python').click();

      await expect(page.getByRole('checkbox', { name: 'Python' })).toBeChecked();
    });

    test('should filter by NOT having text', async ({ page }) => {
      const buttons = page.getByRole('button');

      const filteredButtons = buttons.filter({ hasNotText: 'Click' });
      const count = await filteredButtons.count();

      console.log(`Found ${count} buttons without 'Click' in their text`);
      expect(count).toBeGreaterThan(0);
    });

    test('should filter by having child element', async ({ page }) => {
      const sectionsWithButtons = page.locator('div').filter({
        has: page.getByRole('button')
      });

      const count = await sectionsWithButtons.count();
      console.log(`Found ${count} sections containing buttons`);
    });

    test('should filter by NOT having child element', async ({ page }) => {
      const sectionsWithoutButtons = page.locator('div').filter({
        hasNot: page.getByRole('button')
      });

      const count = await sectionsWithoutButtons.count();
      console.log(`Found ${count} divs without buttons`);
    });
  });

  test.describe('Combining Locators', () => {

    test('should use AND operator to match multiple criteria', async ({ page }) => {
      const button = page.getByRole('button').and(page.locator('[title]'));

      const count = await button.count();
      console.log(`Found ${count} buttons with title attribute`);
    });

    test('should use OR operator for alternative locators', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: 'Submit' })
        .or(page.getByRole('button', { name: 'Send' }))
        .or(page.getByRole('button', { name: 'Click Me' }));

      await submitButton.first().click();

      await expect(page.getByText('Button clicked!')).toBeVisible();
    });

    test('should combine multiple locator strategies', async ({ page }) => {
      const inputGroup = page.getByTestId('checkbox-group-languages');
      const checkbox = inputGroup.getByRole('checkbox', { name: 'JavaScript' });

      await checkbox.check();
      await expect(checkbox).toBeChecked();
    });

    test('should combine test ID with role for specific targeting', async ({ page }) => {
      const inputGroup = page.getByTestId('checkbox-group-languages');
      const checkbox = inputGroup.getByRole('checkbox', { name: 'JavaScript' });

      await checkbox.check();
      await expect(checkbox).toBeChecked();
    });
  });

  test.describe('Working with Lists', () => {

    test('should count items in a list', async ({ page }) => {
      const radioButtons = page.getByRole('radio');
      const count = await radioButtons.count();

      console.log(`Found ${count} radio buttons`);
      expect(count).toBeGreaterThan(0);
    });

    test('should select first item from a list', async ({ page }) => {
      const firstRadio = page.getByRole('radio').first();
      await firstRadio.check();
      await expect(firstRadio).toBeChecked();
    });

    test('should select last item from a list', async ({ page }) => {
      const lastRadio = page.getByRole('radio').last();
      await lastRadio.check();
      await expect(lastRadio).toBeChecked();
    });

    test('should select nth item from a list', async ({ page }) => {
      const thirdRadio = page.getByRole('radio').nth(2);
      await thirdRadio.check();
      await expect(thirdRadio).toBeChecked();
    });

    test('should iterate through list items', async ({ page }) => {
      const checkboxes = page.getByRole('checkbox');
      const count = await checkboxes.count();

      for (let i = 0; i < Math.min(count, 3); i++) {
        await checkboxes.nth(i).check();
      }

      for (let i = 0; i < Math.min(count, 3); i++) {
        await expect(checkboxes.nth(i)).toBeChecked();
      }
    });

    test('should verify all text in a list', async ({ page }) => {
      const countryOptions = page.getByTestId('select-country').locator('option');
      const count = await countryOptions.count();

      console.log(`Country dropdown has ${count} options`);
      expect(count).toBeGreaterThan(0);

      const optionTexts = await countryOptions.allTextContents();
      console.log('Country options:', optionTexts);
    });

    test('should use count for assertions', async ({ page }) => {
      const buttons = page.getByRole('button');
      const buttonCount = await buttons.count();

      expect(buttonCount).toBeGreaterThan(5);
    });
  });

  test.describe('Locator Strictness', () => {

    test('should handle strict mode with unique locators', async ({ page }) => {
      await page.getByTestId('btn-click').click();
      await expect(page.getByText('Button clicked!')).toBeVisible();
    });

    test('should use .first() when multiple elements match', async ({ page }) => {
      await page.getByRole('button').first().click();
    });

    test('should use .nth() for specific element in list', async ({ page }) => {
      const checkboxes = page.getByRole('checkbox');
      await checkboxes.nth(1).check();
      await expect(checkboxes.nth(1)).toBeChecked();
    });

    test('should make locators more specific to avoid strictness issues', async ({ page }) => {
      const specificButton = page.getByTestId('checkbox-group-languages').getByText('JavaScript');
      await specificButton.click();
    });

    test('should use exact match for specificity', async ({ page }) => {
      const checkboxGroup = page.getByTestId('checkbox-group-languages');
      await checkboxGroup.getByText('Java', { exact: true }).click();
      await expect(page.getByTestId('checkbox-java')).toBeChecked();
    });
  });

  test.describe('Complex Scenarios', () => {

    test('should handle nested iframes with chaining', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();

      await iframe.getByRole('textbox', { name: 'Test input in iframe' })
        .fill('Complex chaining example');

      await expect(iframe.getByRole('textbox', { name: 'Test input in iframe' }))
        .toHaveValue('Complex chaining example');
    });

    test('should combine filtering and chaining', async ({ page }) => {
      const languageSection = page.getByTestId('checkbox-group-languages')
        .filter({ hasText: 'JavaScript' });

      await languageSection.getByText('JavaScript').click();
      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
    });

    test('should use multiple selection strategies together', async ({ page }) => {
      await page.getByLabel('Username').fill('user');
      await page.getByTestId('input-email').fill('test@test.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('pass');

      await expect(page.getByLabel('Username')).toHaveValue('user');
      await expect(page.getByTestId('input-email')).toHaveValue('test@test.com');
    });

    test('should handle dynamic content with retry-ability', async ({ page }) => {
      await page.getByTestId('btn-click').click();

      await expect(page.getByText('Button clicked!')).toBeVisible();
    });

    test('should verify element states using locators', async ({ page }) => {
      const clickButton = page.getByTestId('btn-click');

      await expect(clickButton).toBeVisible();
      await expect(clickButton).toBeEnabled();
      await expect(clickButton).toHaveAttribute('data-testid', 'btn-click');

      await clickButton.click();
      await expect(page.getByText('Button clicked!')).toBeVisible();
    });
  });

  test.describe('Text Locator Techniques', () => {

    test('should use exact text match', async ({ page }) => {
      const checkboxGroup = page.getByTestId('checkbox-group-languages');
      await checkboxGroup.getByText('Java', { exact: true }).click();
      await expect(page.getByTestId('checkbox-java')).toBeChecked();
    });

    test('should use regex for case-insensitive search', async ({ page }) => {
      const checkboxGroup = page.getByTestId('checkbox-group-languages');
      await expect(checkboxGroup.getByText(/javascript/i)).toBeVisible();
    });

    test('should use regex for partial match', async ({ page }) => {
      await expect(page.getByText(/agree to terms/i)).toBeVisible();
    });

    test('should count elements by text', async ({ page }) => {
      const pythonElements = page.getByText('Python');
      const count = await pythonElements.count();

      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('should find text within specific sections', async ({ page }) => {
      const checkboxGroup = page.getByTestId('checkbox-group-languages');
      await checkboxGroup.getByText('JavaScript').click();
      await checkboxGroup.getByText('Python').click();

      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Python' })).toBeChecked();
    });
  });

  test.describe('Headings and Links', () => {

    test('should work with headings using role locator', async ({ page }) => {
      const mainHeading = page.getByRole('heading').first();
      await expect(mainHeading).toBeVisible();
    });

    test('should handle links using role locator', async ({ page }) => {
      const links = page.getByRole('link');
      const linkCount = await links.count();

      if (linkCount > 0) {
        await expect(links.first()).toBeVisible();
      }
    });
  });

  test.describe('Best Practices Demonstration', () => {

    test('should prioritize user-facing locators', async ({ page }) => {
      // Good: Using test ID with clear purpose
      await page.getByTestId('btn-click').click();

      // Good: Using label (how users identify form fields)
      await page.getByLabel('Username').fill('testuser');

      // Acceptable: Using test ID when above don't work
      await page.getByTestId('input-email').fill('test@example.com');

      await expect(page.getByText('Button clicked!')).toBeVisible();
    });

    test('should avoid positional selectors when possible', async ({ page }) => {
      // Good: Using specific identifiers
      await page.getByTestId('btn-click').click();

      // Acceptable: .nth() when combined with filtering
      const checkboxGroup = page.getByTestId('checkbox-group-languages');
      await checkboxGroup.getByRole('checkbox').nth(0).check();

      await expect(page.getByText('Button clicked!')).toBeVisible();
    });

    test('should make locators readable and maintainable', async ({ page }) => {
      // Good: Clear, semantic locators
      const usernameInput = page.getByLabel('Username');
      const submitButton = page.getByTestId('btn-click');

      await usernameInput.fill('testuser');
      await submitButton.click();

      await expect(page.getByText('Button clicked!')).toBeVisible();
    });

    test('should combine locators effectively', async ({ page }) => {
      const checkboxSection = page.getByTestId('checkbox-group-languages');
      const jsCheckbox = checkboxSection.getByRole('checkbox', { name: 'JavaScript' });

      await jsCheckbox.check();
      await expect(jsCheckbox).toBeChecked();
    });

    test('should use descriptive variable names', async ({ page }) => {
      const usernameField = page.getByLabel('Username');
      const emailField = page.getByLabel('Email');
      const maleRadio = page.getByTestId('radio-male');

      await usernameField.fill('john');
      await emailField.fill('john@example.com');
      await maleRadio.check();

      await expect(usernameField).toHaveValue('john');
      await expect(emailField).toHaveValue('john@example.com');
      await expect(maleRadio).toBeChecked();
    });
  });

  test.describe('Drag and Drop', () => {

    test('should interact with drag and drop elements', async ({ page }) => {
      const draggable = page.getByTestId('draggable-item-1');
      const dropZone = page.getByTestId('drop-zone');

      await expect(draggable).toBeVisible();
      await expect(dropZone).toBeVisible();

      await draggable.dragTo(dropZone);
    });

    test('should perform drag and drop with click alternative', async ({ page }) => {
      const draggable = page.getByTestId('draggable-item-1');
      const dropZone = page.getByTestId('drop-zone');

      await draggable.click();
      await dropZone.click();
    });
  });

  test.describe('Complex Form Completion', () => {

    test('should complete complex form with all locator types', async ({ page }) => {
      // Text inputs with labels
      await page.getByLabel('Username').fill('testuser');
      await page.getByLabel('Email').fill('test@example.com');

      // Text input with test ID
      await page.getByTestId('input-password').fill('Pass123');

      // Radio buttons with test ID
      await page.getByTestId('radio-male').check();
      await page.getByTestId('radio-intermediate').check();

      // Checkboxes with chaining
      const checkboxGroup = page.getByTestId('checkbox-group-languages');
      await checkboxGroup.getByText('JavaScript').click();
      await checkboxGroup.getByText('Python').click();

      // Dropdowns with role
      await page.getByRole('combobox', { name: 'Country' }).selectOption('canada');

      // Verify
      await expect(page.getByLabel('Username')).toHaveValue('testuser');
      await expect(page.getByTestId('radio-male')).toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'JavaScript' })).toBeChecked();
    });
  });
});
