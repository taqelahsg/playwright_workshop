import { Page, Locator } from '@playwright/test';

/**
 * Scrolls down until an element is visible, with a maximum number of attempts
 * @param page - The Playwright page object
 * @param locator - The element locator to find
 * @param maxAttempts - Maximum number of scroll attempts (default: 10)
 * @param scrollAmount - Amount to scroll in pixels (default: 500)
 * @returns true if element is found and visible, false otherwise
 */
export async function scrollUntilVisible(
  page: Page,
  locator: Locator,
  maxAttempts: number = 10,
  scrollAmount: number = 500
): Promise<boolean> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Check if element is visible with a short timeout
      await locator.waitFor({ state: 'visible', timeout: 1000 });
      // Ensure element is scrolled into viewport
      await locator.scrollIntoViewIfNeeded();
      return true;
    } catch (error) {
      // Element not visible yet, scroll down
      await page.evaluate((pixels) => {
        window.scrollBy(0, pixels);
      }, scrollAmount);

      // Wait a bit for content to load after scrolling
      await page.waitForTimeout(500);
    }
  }

  return false;
}
