import { test, expect } from '@playwright/test';

/**
 * Locale and Timezone Emulation Examples
 * Demonstrates testing for international users
 */

test.describe('Locale and Timezone Emulation', () => {

  test('test with French locale', async ({ browser }) => {
    const context = await browser.newContext({
      locale: 'fr-FR',
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Check browser language
    const language = await page.evaluate(() => navigator.language);
    expect(language).toBe('fr-FR');

    console.log('Browser language:', language);

    await context.close();
  });

  test('test with Japanese locale', async ({ browser }) => {
    const context = await browser.newContext({
      locale: 'ja-JP',
      timezoneId: 'Asia/Tokyo',
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Check browser language
    const language = await page.evaluate(() => navigator.language);
    expect(language).toBe('ja-JP');

    // Check timezone
    const timezone = await page.evaluate(() => {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    });
    expect(timezone).toBe('Asia/Tokyo');

    console.log('Language:', language);
    console.log('Timezone:', timezone);

    await context.close();
  });

  test('test date formatting across locales', async ({ browser }) => {
    const locales = [
      { locale: 'en-US', timezone: 'America/New_York' },
      { locale: 'en-GB', timezone: 'Europe/London' },
      { locale: 'de-DE', timezone: 'Europe/Berlin' },
      { locale: 'ja-JP', timezone: 'Asia/Tokyo' },
    ];

    for (const config of locales) {
      const context = await browser.newContext({
        locale: config.locale,
        timezoneId: config.timezone,
      });
      const page = await context.newPage();

      await page.goto('https://playwright.dev');

      // Get formatted date
      const formattedDate = await page.evaluate(() => {
        const date = new Date('2024-01-15T12:00:00Z');
        return date.toLocaleString();
      });

      console.log(`${config.locale}: ${formattedDate}`);

      await context.close();
    }
  });

  test('test number formatting across locales', async ({ browser }) => {
    const locales = ['en-US', 'de-DE', 'fr-FR', 'ja-JP'];

    for (const locale of locales) {
      const context = await browser.newContext({ locale });
      const page = await context.newPage();

      await page.goto('https://playwright.dev');

      // Format a number
      const formattedNumber = await page.evaluate(() => {
        const number = 1234567.89;
        return number.toLocaleString();
      });

      console.log(`${locale}: ${formattedNumber}`);

      await context.close();
    }
  });

  test('test currency formatting', async ({ browser }) => {
    const configs = [
      { locale: 'en-US', currency: 'USD' },
      { locale: 'en-GB', currency: 'GBP' },
      { locale: 'de-DE', currency: 'EUR' },
      { locale: 'ja-JP', currency: 'JPY' },
    ];

    for (const config of configs) {
      const context = await browser.newContext({ locale: config.locale });
      const page = await context.newPage();

      await page.goto('https://playwright.dev');

      // Format currency
      const formattedCurrency = await page.evaluate(({ currency }) => {
        const amount = 1234.56;
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: currency,
        }).format(amount);
      }, config);

      console.log(`${config.locale} (${config.currency}): ${formattedCurrency}`);

      await context.close();
    }
  });

  test('test timezone differences', async ({ browser }) => {
    const timezones = [
      'America/New_York',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Berlin',
      'Asia/Tokyo',
      'Australia/Sydney',
    ];

    for (const timezone of timezones) {
      const context = await browser.newContext({ timezoneId: timezone });
      const page = await context.newPage();

      await page.goto('https://playwright.dev');

      // Get current time in timezone
      const timeInfo = await page.evaluate(() => {
        const date = new Date();
        return {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          time: date.toLocaleTimeString(),
          offset: date.getTimezoneOffset(),
        };
      });

      console.log(`${timezone}:`, timeInfo.time);

      await context.close();
    }
  });

  test('combined locale and timezone', async ({ browser }) => {
    const context = await browser.newContext({
      locale: 'de-DE',
      timezoneId: 'Europe/Berlin',
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    const info = await page.evaluate(() => {
      const date = new Date();
      return {
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        formattedDate: date.toLocaleString(),
      };
    });

    expect(info.language).toBe('de-DE');
    expect(info.timezone).toBe('Europe/Berlin');

    console.log('Locale Info:', info);

    await context.close();
  });
});
