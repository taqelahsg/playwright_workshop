import { test, expect } from '@playwright/test';

/**
 * Color Scheme and Media Features Emulation
 * Demonstrates testing dark mode, light mode, and other media features
 */

test.describe('Color Scheme Emulation', () => {

  test('dark mode test', async ({ browser }) => {
    const context = await browser.newContext({
      colorScheme: 'dark',
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Verify dark mode is active
    const isDarkMode = await page.evaluate(() => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    expect(isDarkMode).toBeTruthy();
    console.log('Dark mode active:', isDarkMode);

    await context.close();
  });

  test('light mode test', async ({ browser }) => {
    const context = await browser.newContext({
      colorScheme: 'light',
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Verify light mode is active
    const isLightMode = await page.evaluate(() => {
      return window.matchMedia('(prefers-color-scheme: light)').matches;
    });

    expect(isLightMode).toBeTruthy();
    console.log('Light mode active:', isLightMode);

    await context.close();
  });

  test('toggle between color schemes', async ({ page }) => {
    // Start with light mode
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('https://playwright.dev');

    let isLight = await page.evaluate(() => {
      return window.matchMedia('(prefers-color-scheme: light)').matches;
    });
    expect(isLight).toBeTruthy();
    console.log('Initial: Light mode');

    // Switch to dark mode
    await page.emulateMedia({ colorScheme: 'dark' });

    let isDark = await page.evaluate(() => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    expect(isDark).toBeTruthy();
    console.log('Switched to: Dark mode');

    // Switch back to light mode
    await page.emulateMedia({ colorScheme: 'light' });

    isLight = await page.evaluate(() => {
      return window.matchMedia('(prefers-color-scheme: light)').matches;
    });
    expect(isLight).toBeTruthy();
    console.log('Switched back to: Light mode');
  });

  test('screenshot comparison - dark vs light', async ({ browser }) => {
    // Light mode screenshot
    const lightContext = await browser.newContext({ colorScheme: 'light' });
    const lightPage = await lightContext.newPage();
    await lightPage.goto('https://playwright.dev');
    await lightPage.screenshot({ path: 'light-mode.png' });
    console.log('Light mode screenshot saved');
    await lightContext.close();

    // Dark mode screenshot
    const darkContext = await browser.newContext({ colorScheme: 'dark' });
    const darkPage = await darkContext.newPage();
    await darkPage.goto('https://playwright.dev');
    await darkPage.screenshot({ path: 'dark-mode.png' });
    console.log('Dark mode screenshot saved');
    await darkContext.close();
  });

  test('print media emulation', async ({ page }) => {
    await page.emulateMedia({ media: 'print' });
    await page.goto('https://playwright.dev');

    // Verify print media is active
    const isPrint = await page.evaluate(() => {
      return window.matchMedia('print').matches;
    });

    expect(isPrint).toBeTruthy();
    console.log('Print media active:', isPrint);

    // Take screenshot of print view
    await page.screenshot({ path: 'print-view.png' });
    console.log('Print view screenshot saved');
  });

  test('reduced motion preference', async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Verify reduced motion is active
    const hasReducedMotion = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    expect(hasReducedMotion).toBeTruthy();
    console.log('Reduced motion active:', hasReducedMotion);

    await context.close();
  });

  test('no reduced motion preference', async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Verify no preference is set
    const noPreference = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    });

    expect(noPreference).toBeTruthy();
    console.log('Reduced motion preference:', 'no-preference');

    await context.close();
  });

  test('forced colors mode (high contrast)', async ({ browser }) => {
    const context = await browser.newContext({
      forcedColors: 'active',
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Verify forced colors is active
    const hasForcedColors = await page.evaluate(() => {
      return window.matchMedia('(forced-colors: active)').matches;
    });

    expect(hasForcedColors).toBeTruthy();
    console.log('Forced colors active:', hasForcedColors);

    await context.close();
  });

  test('combined media features', async ({ browser }) => {
    const context = await browser.newContext({
      colorScheme: 'dark',
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    const mediaFeatures = await page.evaluate(() => {
      return {
        darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      };
    });

    expect(mediaFeatures.darkMode).toBeTruthy();
    expect(mediaFeatures.reducedMotion).toBeTruthy();

    console.log('Media Features:', mediaFeatures);

    await context.close();
  });

  test('test all color scheme variations', async ({ browser }) => {
    const schemes: ('light' | 'dark' | 'no-preference')[] = ['light', 'dark', 'no-preference'];

    for (const scheme of schemes) {
      const context = await browser.newContext({ colorScheme: scheme });
      const page = await context.newPage();

      await page.goto('https://playwright.dev');

      const currentScheme = await page.evaluate(() => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          return 'light';
        } else {
          return 'no-preference';
        }
      });

      console.log(`Set: ${scheme}, Detected: ${currentScheme}`);

      await context.close();
    }
  });
});
