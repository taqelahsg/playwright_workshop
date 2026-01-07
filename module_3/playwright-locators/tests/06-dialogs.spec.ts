import { test, expect } from '@playwright/test';

/**
 * Component Tests: Dialogs (Alert, Confirm, Prompt)
 *
 * Tests all dialog interactions including alert, confirm, and prompt dialogs.
 * Uses various locator strategies to trigger dialogs.
 */

test.describe('Dialogs Component Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://taqelah.sg/automation-testing-practice.html');
  });

  test.describe('Alert Dialog', () => {

    test('should handle alert dialog using test ID', async ({ page }) => {
      // Listen for dialog event and handle it
      page.once('dialog', dialog => {
        console.log(`Alert message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
      });

      // Trigger the alert
      await page.getByTestId('btn-alert').click();
    });

    test('should accept alert dialog', async ({ page }) => {
      page.once('dialog', async dialog => {
        console.log(`Alert message: ${dialog.message()}`);
        await dialog.accept();
      });

      await page.getByTestId('btn-alert').click();
    });

    test('should verify alert dialog message', async ({ page }) => {
      let dialogType = '';
      let dialogMessage = '';

      page.once('dialog', async dialog => {
        dialogType = dialog.type();
        dialogMessage = dialog.message();
        console.log(`Dialog type: ${dialogType}`);
        console.log(`Dialog message: ${dialogMessage}`);
        await dialog.accept();
      });

      await page.getByTestId('btn-alert').click();

      // Wait a bit for dialog to be handled
      await page.waitForTimeout(100);

      expect(dialogType).toBe('alert');
    });
  });

  test.describe('Confirm Dialog', () => {

    test('should handle confirm dialog with accept using test ID', async ({ page }) => {
      page.once('dialog', dialog => {
        console.log(`Confirm message: ${dialog.message()}`);
        dialog.accept().catch(() => {});
      });

      await page.getByTestId('btn-confirm').click();
    });

    test('should handle confirm dialog with dismiss', async ({ page }) => {
      page.once('dialog', async dialog => {
        console.log(`Confirm message: ${dialog.message()}`);
        await dialog.dismiss();
      });

      await page.getByTestId('btn-confirm').click();
    });

    test('should verify confirm dialog type and message', async ({ page }) => {
      let dialogType = '';
      let dialogMessage = '';

      page.once('dialog', async dialog => {
        dialogType = dialog.type();
        dialogMessage = dialog.message();
        console.log(`Dialog type: ${dialogType}`);
        console.log(`Dialog message: ${dialogMessage}`);
        await dialog.accept();
      });

      await page.getByTestId('btn-confirm').click();

      // Wait a bit for dialog to be handled
      await page.waitForTimeout(100);

      expect(dialogType).toBe('confirm');
    });

    test('should test both accept and dismiss for confirm dialog', async ({ page }) => {
      // First: Accept
      let dialogMessage = '';
      page.once('dialog', async dialog => {
        dialogMessage = dialog.message();
        await dialog.accept();
      });

      await page.getByTestId('btn-confirm').click();
      console.log(`Accepted: ${dialogMessage}`);

      // Second: Dismiss
      page.once('dialog', async dialog => {
        dialogMessage = dialog.message();
        await dialog.dismiss();
      });

      await page.getByTestId('btn-confirm').click();
      console.log(`Dismissed: ${dialogMessage}`);
    });
  });

  test.describe('Prompt Dialog', () => {

    test('should handle prompt dialog with user input using test ID', async ({ page }) => {
      page.once('dialog', dialog => {
        console.log(`Prompt message: ${dialog.message()}`);
        dialog.accept('User input').catch(() => {});
      });

      await page.getByTestId('btn-prompt').click();
    });

    test('should accept prompt with specific text', async ({ page }) => {
      const userInput = 'Test User Input';

      page.once('dialog', async dialog => {
        console.log(`Prompt message: ${dialog.message()}`);
        console.log(`Default value: ${dialog.defaultValue()}`);
        await dialog.accept(userInput);
      });

      await page.getByTestId('btn-prompt').click();
    });

    test('should dismiss prompt without input', async ({ page }) => {
      page.once('dialog', async dialog => {
        console.log(`Prompt message: ${dialog.message()}`);
        await dialog.dismiss();
      });

      await page.getByTestId('btn-prompt').click();
    });

    test('should verify prompt dialog details', async ({ page }) => {
      let dialogType = '';
      let dialogMessage = '';
      let dialogDefault = '';

      page.once('dialog', async dialog => {
        dialogType = dialog.type();
        dialogMessage = dialog.message();
        dialogDefault = dialog.defaultValue();
        console.log(`Dialog type: ${dialogType}`);
        console.log(`Dialog message: ${dialogMessage}`);
        console.log(`Default value: ${dialogDefault}`);
        await dialog.accept('Custom response');
      });

      await page.getByTestId('btn-prompt').click();

      // Wait a bit for dialog to be handled
      await page.waitForTimeout(100);

      expect(dialogType).toBe('prompt');
    });

    test('should test various prompt inputs', async ({ page }) => {
      const testInputs = ['', 'Short', 'A longer test input with spaces'];

      for (const input of testInputs) {
        page.once('dialog', async dialog => {
          console.log(`Accepting prompt with: "${input}"`);
          await dialog.accept(input);
        });

        await page.getByTestId('btn-prompt').click();
      }
    });
  });

  test.describe('Dialog Event Handling Patterns', () => {

    test('should use page.on for multiple dialogs', async ({ page }) => {
      let dialogCount = 0;

      page.on('dialog', async dialog => {
        dialogCount++;
        console.log(`Dialog ${dialogCount}: ${dialog.type()} - ${dialog.message()}`);
        await dialog.accept();
      });

      await page.getByTestId('btn-alert').click();
      await page.getByTestId('btn-confirm').click();
      await page.getByTestId('btn-prompt').click();

      expect(dialogCount).toBe(3);
    });

    test('should handle dialog before clicking button', async ({ page }) => {
      // Set up handler before action
      page.once('dialog', async dialog => {
        await dialog.accept();
      });

      // Trigger dialog
      await page.getByTestId('btn-alert').click();

      // Wait for dialog to be handled
      await page.waitForTimeout(100);
    });
  });

  test.describe('Iframe Dialogs', () => {

    test('should handle dialog triggered from iframe button', async ({ page }) => {
      // Load iframe
      await page.getByTestId('btn-load-iframe').click();

      // Set up dialog handler
      page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
      });

      // Click button inside iframe
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
  });

  test.describe('Dialog Error Handling', () => {

    test('should not throw if dialog is already handled', async ({ page }) => {
      page.once('dialog', dialog => {
        dialog.accept().catch(() => {
          console.log('Dialog already handled');
        });
      });

      await page.getByTestId('btn-alert').click();
    });

    test('should handle rapid dialog triggers', async ({ page }) => {
      let alertCount = 0;

      page.on('dialog', async dialog => {
        alertCount++;
        await dialog.accept();
      });

      // Trigger multiple dialogs rapidly
      await page.getByTestId('btn-alert').click();
      await page.getByTestId('btn-alert').click();

      expect(alertCount).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Dialog Integration with Form', () => {

    test('should fill form and trigger dialogs', async ({ page }) => {
      // Fill form fields
      await page.getByLabel('Username').fill('testuser');
      await page.getByLabel('Email').fill('test@example.com');

      // Handle alert
      page.once('dialog', async dialog => {
        await dialog.accept();
      });
      await page.getByTestId('btn-alert').click();

      // Handle confirm
      page.once('dialog', async dialog => {
        await dialog.accept();
      });
      await page.getByTestId('btn-confirm').click();

      // Verify form fields still have values
      await expect(page.getByLabel('Username')).toHaveValue('testuser');
    });
  });

  test.describe('Best Practices', () => {

    test('should set up dialog handler before action', async ({ page }) => {
      // GOOD: Handler set up before triggering
      page.once('dialog', async dialog => {
        await dialog.accept();
      });

      await page.getByTestId('btn-alert').click();
    });

    test('should use descriptive dialog handling', async ({ page }) => {
      // Clear handler with logging
      const handleAlert = async (dialog: any) => {
        console.log(`Handling ${dialog.type()} dialog`);
        console.log(`Message: ${dialog.message()}`);
        await dialog.accept();
      };

      page.once('dialog', handleAlert);
      await page.getByTestId('btn-alert').click();
    });

    test('should handle dialogs with proper error handling', async ({ page }) => {
      page.once('dialog', dialog => {
        dialog.accept().catch(error => {
          console.error(`Error handling dialog: ${error.message}`);
        });
      });

      await page.getByTestId('btn-alert').click();
    });
  });
});
