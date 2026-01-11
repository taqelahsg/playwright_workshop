import { test, expect } from '@playwright/test';

/**
 * Component Tests: Windows & Tabs
 *
 * Tests all window and tab interactions including opening new windows,
 * opening new tabs, and interacting with elements in new contexts.
 */

test.describe('Windows & Tabs Component Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://taqelah.sg/automation-testing-practice.html');
  });

  test.describe('New Window Handling - Role Locator', () => {

    test('should open new window using role locator', async ({ page }) => {
      const popupPromise = page.waitForEvent('popup');
      await page.getByRole('button', { name: 'Open New Window' }).click();
      const popup = await popupPromise;

      await expect(popup).toBeDefined();

      await popup.getByRole('button', { name: 'Close This Window' }).click();
    });

    test('should verify new window opened', async ({ page }) => {
      const popupPromise = page.waitForEvent('popup');
      await page.getByRole('button', { name: 'Open New Window' }).click();
      const popup = await popupPromise;

      expect(popup).toBeTruthy();
      expect(popup.url()).toBeTruthy();

      await popup.close();
    });

    test('should interact with button in new window', async ({ page }) => {
      const popupPromise = page.waitForEvent('popup');
      await page.getByRole('button', { name: 'Open New Window' }).click();
      const popup = await popupPromise;

      // Verify button exists in popup
      const closeButton = popup.getByRole('button', { name: 'Close This Window' });
      await expect(closeButton).toBeVisible();

      // Click the button
      await closeButton.click();
    });
  });

  test.describe('New Window Handling - Test ID Locator', () => {

    test('should open new window using test ID', async ({ page }) => {
      const popupPromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-window').click();
      const popup = await popupPromise;

      await expect(popup).toBeDefined();

      await popup.getByRole('button', { name: 'Close This Window' }).click();
    });

    test('should verify popup properties', async ({ page }) => {
      const popupPromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-window').click();
      const popup = await popupPromise;

      // Popup might be about:blank initially, just verify it exists
      expect(popup).toBeDefined();
      console.log(`Popup URL: ${popup.url()}`);

      await popup.close();
    });
  });

  test.describe('New Tab Handling - Test ID Locator', () => {

    test('should open new tab using test ID', async ({ page }) => {
      const newPagePromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-tab').click();
      const newPage = await newPagePromise;

      await expect(newPage).toBeDefined();
    });

    test('should verify new tab opened', async ({ page }) => {
      const newPagePromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-tab').click();
      const newPage = await newPagePromise;

      expect(newPage).toBeTruthy();
      console.log(`New tab URL: ${newPage.url()}`);

      await newPage.close();
    });

    test('should interact with new tab content', async ({ page }) => {
      const newPagePromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-tab').click();
      const newPage = await newPagePromise;

      // Wait for the new page to load
      await newPage.waitForLoadState('load');

      // Verify page is accessible
      expect(newPage.url()).toBeTruthy();

      await newPage.close();
    });
  });

  test.describe('Multiple Windows/Tabs', () => {

    test('should handle multiple popup windows', async ({ page }) => {
      // Open first window
      const popup1Promise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-window').click();
      const popup1 = await popup1Promise;

      // Close first window to allow opening second
      await popup1.close();

      // Open second window
      const popup2Promise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-window').click();
      const popup2 = await popup2Promise;

      // Verify both were opened
      expect(popup1).toBeDefined();
      expect(popup2).toBeDefined();

      // Close second
      await popup2.close();
    });

    test('should switch between main page and popup', async ({ page }) => {
      // Interact with main page
      await page.getByLabel('Username').fill('mainPageUser');

      // Open popup
      const popupPromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-window').click();
      const popup = await popupPromise;

      // Interact with popup
      await popup.getByRole('button', { name: 'Close This Window' }).click();

      // Verify main page field still has value
      await expect(page.getByLabel('Username')).toHaveValue('mainPageUser');
    });

    test('should handle both window and tab', async ({ page }) => {
      // Open window
      const windowPromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-window').click();
      const windowPage = await windowPromise;

      // Open tab
      const tabPromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-tab').click();
      const tabPage = await tabPromise;

      // Verify both
      expect(windowPage).toBeDefined();
      expect(tabPage).toBeDefined();

      // Close both
      await windowPage.close();
      await tabPage.close();
    });
  });

  test.describe('Window/Tab Context Switching', () => {

    test('should maintain context when switching between windows', async ({ page }) => {
      // Fill form in main page
      await page.getByTestId('input-username').fill('user1');
      await page.getByTestId('input-email').fill('user1@test.com');

      // Open new window
      const popupPromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-window').click();
      const popup = await popupPromise;

      // Interact with popup
      const closeButton = popup.getByRole('button', { name: 'Close This Window' });
      await expect(closeButton).toBeVisible();

      // Close popup
      await popup.close();

      // Verify main page values are retained
      await expect(page.getByTestId('input-username')).toHaveValue('user1');
      await expect(page.getByTestId('input-email')).toHaveValue('user1@test.com');
    });

    test('should work with main page after closing popup', async ({ page }) => {
      // Open and close popup
      const popupPromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-window').click();
      const popup = await popupPromise;
      await popup.close();

      // Continue working with main page
      await page.getByLabel('Username').fill('afterPopup');
      await expect(page.getByLabel('Username')).toHaveValue('afterPopup');
    });
  });

  test.describe('Popup Event Handling', () => {

    test('should capture popup event properties', async ({ page }) => {
      const popupPromise = page.waitForEvent('popup');

      await page.getByTestId('btn-new-window').click();

      const popup = await popupPromise;

      console.log('Popup opened:');
      console.log(`- URL: ${popup.url()}`);
      console.log(`- Context: ${popup.context() !== null}`);

      await popup.close();
    });

    test('should handle popup with timeout', async ({ page }) => {
      const popupPromise = page.waitForEvent('popup', { timeout: 5000 });

      await page.getByTestId('btn-new-window').click();

      const popup = await popupPromise;
      expect(popup).toBeDefined();

      await popup.close();
    });
  });

  test.describe('Complete Workflow with Windows', () => {

    test('should complete form submission workflow with popup', async ({ page }) => {
      // Fill main form
      await page.getByLabel('Username').fill('testuser');
      await page.getByLabel('Email').fill('test@example.com');
      await page.locator('input[type="radio"][value="male"][name="gender"]').check();
      await page.locator('input[type="radio"][value="intermediate"]').check();

      // Open popup window
      const popupPromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-window').click();
      const popup = await popupPromise;

      // Interact with popup
      await popup.getByRole('button', { name: 'Close This Window' }).click();

      // Verify main form values retained
      await expect(page.getByLabel('Username')).toHaveValue('testuser');
      await expect(page.getByLabel('Email')).toHaveValue('test@example.com');
      await expect(page.locator('input[type="radio"][value="male"][name="gender"]')).toBeChecked();
    });

    test('should handle multiple sequential popups', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        const popupPromise = page.waitForEvent('popup');
        await page.getByTestId('btn-new-window').click();
        const popup = await popupPromise;

        console.log(`Popup ${i + 1} opened`);
        await popup.close();
      }

      // Verify main page still works
      await page.getByLabel('Username').fill('afterPopups');
      await expect(page.getByLabel('Username')).toHaveValue('afterPopups');
    });
  });

  test.describe('Error Handling', () => {

    test('should handle popup close gracefully', async ({ page }) => {
      const popupPromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-window').click();
      const popup = await popupPromise;

      // Close popup
      await popup.close();

      // Verify popup is closed
      expect(popup.isClosed()).toBe(true);
    });

    test('should continue after popup interaction', async ({ page }) => {
      const popupPromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-window').click();
      const popup = await popupPromise;

      await popup.getByRole('button', { name: 'Close This Window' }).click();

      // Main page should still be functional
      await page.getByTestId('btn-click').click();
      await expect(page.getByText('Button clicked!')).toBeVisible();
    });
  });

  test.describe('Best Practices', () => {

    test('should use descriptive popup variable names', async ({ page }) => {
      const newWindowPromise = page.waitForEvent('popup');
      await page.getByRole('button', { name: 'Open New Window' }).click();
      const newWindow = await newWindowPromise;

      const closeButton = newWindow.getByRole('button', { name: 'Close This Window' });
      await closeButton.click();
    });

    test('should wait for popup before interaction', async ({ page }) => {
      // GOOD: Wait for popup first
      const popupPromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-window').click();
      const popup = await popupPromise;

      // Then interact
      await popup.getByRole('button', { name: 'Close This Window' }).click();
    });

    test('should clean up popups after use', async ({ page }) => {
      const popupPromise = page.waitForEvent('popup');
      await page.getByTestId('btn-new-window').click();
      const popup = await popupPromise;

      // Do work with popup
      await expect(popup.getByRole('button', { name: 'Close This Window' })).toBeVisible();

      // Clean up
      await popup.close();
      expect(popup.isClosed()).toBe(true);
    });
  });
});
