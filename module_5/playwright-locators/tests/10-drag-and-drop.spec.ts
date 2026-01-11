import { test, expect } from '@playwright/test';

test.describe('Drag and Drop Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://taqelah.sg/automation-testing-practice.html');
  });

  test('should drag Item1 and reset items', async ({ page }) => {
    const item1 = page.getByText('Item 1', { exact: true });
    const dropZone = page.locator('#drop-zone');
    const resetButton = page.locator('#btn-reset-drag');

    await expect(item1).toBeVisible();
    await expect(dropZone).toBeVisible();

    await item1.dragTo(dropZone);

    await expect(dropZone.getByText('Item 1')).toBeVisible();

    await resetButton.click();

    const dragSource = page.locator('.drag-source');
    await expect(dragSource.getByText('Item 1')).toBeVisible();
  });

  test('should drag multiple items and reset all', async ({ page }) => {
    const item1 = page.getByText('Item 1', { exact: true });
    const item2 = page.getByText('Item 2', { exact: true });
    const dropZone = page.locator('#drop-zone');
    const resetButton = page.locator('#btn-reset-drag');

    await item1.dragTo(dropZone);
    await item2.dragTo(dropZone);

    await expect(dropZone.getByText('Item 1')).toBeVisible();
    await expect(dropZone.getByText('Item 2')).toBeVisible();

    await resetButton.click();

    const dragSource = page.locator('.drag-source');
    await expect(dragSource.getByText('Item 1')).toBeVisible();
    await expect(dragSource.getByText('Item 2')).toBeVisible();
  });

  test('should verify all items are draggable', async ({ page }) => {
    const dropZone = page.locator('#drop-zone');

    for (let i = 1; i <= 4; i++) {
      const item = page.getByText(`Item ${i}`, { exact: true });
      await item.dragTo(dropZone);
      await expect(dropZone.getByText(`Item ${i}`)).toBeVisible();
    }
  });
});
