import { test, expect } from '@playwright/test';
import { scrollUntilVisible } from './helpers/scroll-utils';

/**
 * Component Tests: Buttons
 *
 * Tests all button interactions including click, double-click,
 * enable/disable, and button state verification using various locator strategies.
 */

test.describe('Buttons Component Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://taqelah.sg/automation-testing-practice.html');
  });

  test.describe('Button Click Actions', () => {

    test('should click button using role locator', async ({ page }) => {
      const clickMeButton = page.getByRole('button', { name: 'Click Me', exact: true });
      await scrollUntilVisible(page, clickMeButton);

      await clickMeButton.click();
      await expect(page.getByText('Button clicked!')).toBeVisible();
    });

    test('should click button using test ID', async ({ page }) => {
      await page.getByTestId('btn-click').click();
      await expect(page.getByText('Button clicked!')).toBeVisible();
    });

    test('should verify button text after click using text locator', async ({ page }) => {
      await page.getByTestId('btn-click').click();
      await page.getByText('Button clicked!').click();

      await expect(page.getByText('Button clicked!')).toBeVisible();
    });

    test('should verify button clicked confirmation with regex', async ({ page }) => {
      await expect(page.getByText(/button clicked/i)).toBeHidden();

      await page.getByTestId('btn-click').click();

      await expect(page.getByText(/button clicked/i)).toBeVisible();
    });
  });

  test.describe('Double Click Actions', () => {

    test('should double-click button using role locator', async ({ page }) => {
      await page.getByRole('button', { name: 'Double Click Me', exact: true }).dblclick();
      await expect(page.getByText('Button double-clicked!')).toBeVisible();
    });

    test('should double-click button using test ID', async ({ page }) => {
      await page.getByTestId('btn-double-click').dblclick();
      await expect(page.getByText('Button double-clicked!')).toBeVisible();
    });

    test('should use text locator for double-click confirmation', async ({ page }) => {
      await page.getByTestId('btn-double-click').dblclick();

      await expect(page.getByText('Button double-clicked!')).toBeVisible();
      await page.getByText('Button double-clicked!').click();
    });
  });

  test.describe('Enable/Disable Buttons', () => {

    test('should enable disabled button using role locator', async ({ page }) => {
      await page.getByRole('button', { name: 'Enable Disabled Button' }).click();
    });

    test('should enable disabled button using test ID', async ({ page }) => {
      await page.getByTestId('btn-enable').click();
    });
  });

  test.describe('Button State Verification', () => {

    test('should verify button is visible and enabled', async ({ page }) => {
      const clickButton = page.getByTestId('btn-click');

      await expect(clickButton).toBeVisible();
      await expect(clickButton).toBeEnabled();
      await expect(clickButton).toHaveAttribute('data-testid', 'btn-click');
    });

    test('should verify confirmation messages are hidden initially', async ({ page }) => {
      await expect(page.getByText('Button clicked!')).toBeHidden();
      await expect(page.getByText('Button double-clicked!')).toBeHidden();

      await page.getByTestId('btn-click').click();
      await expect(page.getByText('Button clicked!')).toBeVisible();
    });
  });

  test.describe('Multiple Button Interactions', () => {

    test('should combine multiple button clicks', async ({ page }) => {
      await page.getByTestId('btn-click').click();
      await expect(page.getByText('Button clicked!')).toBeVisible();

      await page.getByTestId('btn-double-click').dblclick();
      await expect(page.getByText('Button double-clicked!')).toBeVisible();
    });

    test('should verify multiple buttons with same role', async ({ page }) => {
      const buttonCount = await page.getByRole('button').count();
      expect(buttonCount).toBeGreaterThan(0);

      const firstButton = page.getByRole('button').first();
      await expect(firstButton).toBeVisible();
    });

    test('should count all buttons on page', async ({ page }) => {
      const buttons = page.getByRole('button');
      const buttonCount = await buttons.count();

      expect(buttonCount).toBeGreaterThan(5);
    });
  });

  test.describe('Iframe Buttons', () => {

    test('should click button inside iframe using role locator', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
      });

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      await iframe.getByRole('button', { name: 'Click me in iframe' }).click();
    });
  });

  test.describe('Button Selection Strategies', () => {

    test('should use .first() when multiple elements match', async ({ page }) => {
      await page.getByRole('button').first().click();
    });

    test('should use OR operator for alternative button names', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: 'Submit' })
        .or(page.getByRole('button', { name: 'Send' }))
        .or(page.getByRole('button', { name: 'Click Me' }));

      await submitButton.first().click();
      await expect(page.getByText('Button clicked!')).toBeVisible();
    });

    test('should filter buttons by NOT having text', async ({ page }) => {
      const buttons = page.getByRole('button');
      const filteredButtons = buttons.filter({ hasNotText: 'Click' });
      const count = await filteredButtons.count();

      console.log(`Found ${count} buttons without 'Click' in their text`);
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Best Practices', () => {

    test('should prioritize role locators for buttons', async ({ page }) => {
      // Good: Using role (how users see it)
      await page.getByRole('button', { name: 'Click Me', exact: true }).click();
      await expect(page.getByText('Button clicked!')).toBeVisible();
    });

    test('should make button locators readable and maintainable', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: 'Click Me', exact: true });

      await submitButton.click();
      await expect(page.getByText('Button clicked!')).toBeVisible();
    });
  });
});
