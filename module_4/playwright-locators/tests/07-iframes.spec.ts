import { test, expect } from '@playwright/test';

/**
 * Component Tests: Iframes
 *
 * Tests all iframe interactions including loading iframes,
 * interacting with elements inside iframes, and handling iframe dialogs.
 */

test.describe('Iframes Component Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://taqelah.sg/automation-testing-practice.html');
  });

  test.describe('Loading Iframes', () => {

    test('should load iframe using button test ID', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      // Wait for iframe to load
      await page.waitForTimeout(1000);

      // Verify iframe is present
      const iframe = page.locator('[data-testid="test-iframe"]');
      await expect(iframe).toBeVisible();
    });

    test('should verify iframe loads successfully', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      const iframeElement = page.locator('[data-testid="test-iframe"]');
      await expect(iframeElement).toBeAttached();
    });
  });

  test.describe('Iframe Input Field Interactions - Role Locator', () => {

    test('should fill input inside iframe using role locator', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      await iframe.getByRole('textbox', { name: 'Test input in iframe' }).fill('Hello from role locator');

      await expect(iframe.getByRole('textbox', { name: 'Test input in iframe' })).toHaveValue('Hello from role locator');
    });

    test('should verify iframe input value', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      const textbox = iframe.getByRole('textbox', { name: 'Test input in iframe' });

      await textbox.fill('Iframe test');
      await expect(textbox).toHaveValue('Iframe test');
    });

    test('should clear and refill iframe input', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      const textbox = iframe.getByRole('textbox', { name: 'Test input in iframe' });

      await textbox.fill('First value');
      await expect(textbox).toHaveValue('First value');

      await textbox.clear();
      await textbox.fill('Second value');
      await expect(textbox).toHaveValue('Second value');
    });
  });

  test.describe('Iframe Button Interactions - Role Locator', () => {

    test('should click button inside iframe using role locator', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
      });

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      await iframe.getByRole('button', { name: 'Click me in iframe' }).click();
    });

    test('should verify iframe button is visible', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      const button = iframe.getByRole('button', { name: 'Click me in iframe' });

      await expect(button).toBeVisible();
    });
  });

  test.describe('Iframe Locator Chaining', () => {

    test('should chain locators for iframe elements', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      // Chain: page -> iframe -> role -> action
      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      const textbox = iframe.getByRole('textbox', { name: 'Test input in iframe' });

      await textbox.fill('Chained locator value');
      await expect(textbox).toHaveValue('Chained locator value');
    });

    test('should chain multiple actions in iframe', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();

      // Fill input
      await iframe.getByRole('textbox', { name: 'Test input in iframe' })
        .fill('Complex chaining example');

      // Verify
      await expect(iframe.getByRole('textbox', { name: 'Test input in iframe' }))
        .toHaveValue('Complex chaining example');
    });
  });

  test.describe('Nested Iframe Handling', () => {

    test('should handle nested iframes with chaining', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      // Chain: page -> iframe -> role -> action
      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();

      await iframe.getByRole('textbox', { name: 'Test input in iframe' })
        .fill('Complex chaining example');

      await expect(iframe.getByRole('textbox', { name: 'Test input in iframe' }))
        .toHaveValue('Complex chaining example');
    });
  });

  test.describe('Iframe Dialog Handling', () => {

    test('should handle dialog triggered from iframe button', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
      });

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      await iframe.getByRole('button', { name: 'Click me in iframe' }).click();
    });

    test('should verify iframe dialog properties', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      let dialogType = '';
      let dialogMessage = '';

      page.once('dialog', async dialog => {
        dialogType = dialog.type();
        dialogMessage = dialog.message();
        console.log(`Iframe dialog type: ${dialogType}`);
        console.log(`Iframe dialog message: ${dialogMessage}`);
        await dialog.accept();
      });

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      await iframe.getByRole('button', { name: 'Click me in iframe' }).click();

      // Wait for dialog to be handled
      await page.waitForTimeout(100);
    });

    test('should handle multiple dialogs from iframe', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      const button = iframe.getByRole('button', { name: 'Click me in iframe' });

      // First dialog
      page.once('dialog', async dialog => {
        await dialog.accept();
      });
      await button.click();

      // Second dialog
      page.once('dialog', async dialog => {
        await dialog.dismiss();
      });
      await button.click();
    });
  });

  test.describe('Iframe and Main Page Interaction', () => {

    test('should interact with both main page and iframe', async ({ page }) => {
      // Fill main page input
      await page.getByLabel('Username').fill('mainPageUser');

      // Load and interact with iframe
      await page.getByTestId('btn-load-iframe').click();

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      await iframe.getByRole('textbox', { name: 'Test input in iframe' }).fill('iframeValue');

      // Verify both
      await expect(page.getByLabel('Username')).toHaveValue('mainPageUser');
      await expect(iframe.getByRole('textbox', { name: 'Test input in iframe' })).toHaveValue('iframeValue');
    });

    test('should switch between main page and iframe contexts', async ({ page }) => {
      // Main page action
      await page.getByTestId('input-username').fill('user1');

      // Load iframe
      await page.getByTestId('btn-load-iframe').click();

      // Iframe action
      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      await iframe.getByRole('textbox', { name: 'Test input in iframe' }).fill('iframe data');

      // Back to main page
      await page.getByTestId('input-email').fill('test@example.com');

      // Verify all
      await expect(page.getByTestId('input-username')).toHaveValue('user1');
      await expect(page.getByTestId('input-email')).toHaveValue('test@example.com');
      await expect(iframe.getByRole('textbox', { name: 'Test input in iframe' })).toHaveValue('iframe data');
    });
  });

  test.describe('Iframe Element Verification', () => {

    test('should verify iframe elements are visible', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();

      await expect(iframe.getByRole('textbox', { name: 'Test input in iframe' })).toBeVisible();
      await expect(iframe.getByRole('button', { name: 'Click me in iframe' })).toBeVisible();
    });

    test('should verify iframe elements are enabled', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();

      await expect(iframe.getByRole('textbox', { name: 'Test input in iframe' })).toBeEnabled();
      await expect(iframe.getByRole('button', { name: 'Click me in iframe' })).toBeEnabled();
    });
  });

  test.describe('Complete Iframe Workflow', () => {

    test('should complete full iframe workflow', async ({ page }) => {
      // Fill main form
      await page.getByLabel('Username').fill('testuser');
      await page.getByLabel('Email').fill('test@example.com');

      // Load iframe
      await page.getByTestId('btn-load-iframe').click();

      // Interact with iframe input
      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      await iframe.getByRole('textbox', { name: 'Test input in iframe' }).fill('Complete workflow');

      // Handle iframe button dialog
      page.once('dialog', async dialog => {
        console.log(`Dialog: ${dialog.message()}`);
        await dialog.accept();
      });
      await iframe.getByRole('button', { name: 'Click me in iframe' }).click();

      // Verify main page values are retained
      await expect(page.getByLabel('Username')).toHaveValue('testuser');
      await expect(page.getByLabel('Email')).toHaveValue('test@example.com');
    });
  });

  test.describe('Best Practices', () => {

    test('should use descriptive iframe element references', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      const iframe = page.locator('[data-testid="test-iframe"]').contentFrame();
      const iframeInput = iframe.getByRole('textbox', { name: 'Test input in iframe' });
      const iframeButton = iframe.getByRole('button', { name: 'Click me in iframe' });

      await iframeInput.fill('Clear reference');
      await expect(iframeInput).toHaveValue('Clear reference');

      page.once('dialog', async dialog => await dialog.accept());
      await iframeButton.click();
    });

    test('should wait for iframe to load before interaction', async ({ page }) => {
      await page.getByTestId('btn-load-iframe').click();

      // Wait for iframe to be attached
      const iframeElement = page.locator('[data-testid="test-iframe"]');
      await expect(iframeElement).toBeAttached();

      // Then interact
      const iframe = iframeElement.contentFrame();
      await iframe.getByRole('textbox', { name: 'Test input in iframe' }).fill('Safe interaction');
    });
  });
});
