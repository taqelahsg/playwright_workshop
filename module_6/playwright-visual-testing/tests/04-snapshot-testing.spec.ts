import { test, expect } from '@playwright/test';

/**
 * Data Snapshot Testing with toMatchSnapshot()
 *
 * Beyond visual screenshots, Playwright can snapshot:
 * - API responses
 * - Page structure
 * - Computed styles
 * - Text content
 * - Any serializable data
 */
test.describe('Data Snapshot Testing', () => {
  test('page links snapshot', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Get all link text contents
    const links = await page.locator('a').allTextContents();

    // Filter out empty links
    const nonEmptyLinks = links.filter(link => link.trim());

    expect(nonEmptyLinks).toMatchSnapshot('page-links.json');
  });

  test('form structure snapshot', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Get form structure
    const formStructure = await page.evaluate(() => {
      const form = document.querySelector('form');
      if (!form) return null;

      const inputs = Array.from(form.querySelectorAll('input, button, select, textarea'));
      return inputs.map(el => ({
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute('type'),
        name: el.getAttribute('name'),
        testId: el.getAttribute('data-testid'),
      }));
    });

    expect(formStructure).toMatchSnapshot('form-structure.json');
  });

  test('button styles snapshot', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    const button = page.getByTestId('login-button');

    // Get computed styles
    const styles = await button.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        fontSize: computed.fontSize,
        padding: computed.padding,
        borderRadius: computed.borderRadius,
        fontFamily: computed.fontFamily,
      };
    });

    expect(styles).toMatchSnapshot('button-styles.json');
  });

  test('page metadata snapshot', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Get page metadata
    const metadata = await page.evaluate(() => {
      return {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
        viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content'),
        charset: document.characterSet,
      };
    });

    expect(metadata).toMatchSnapshot('page-metadata.json');
  });

  test('element attributes snapshot', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Get all input attributes
    const inputAttributes = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      return Array.from(inputs).map(input => ({
        type: input.type,
        name: input.name,
        placeholder: input.placeholder,
        required: input.required,
        'data-testid': input.getAttribute('data-testid'),
      }));
    });

    expect(inputAttributes).toMatchSnapshot('input-attributes.json');
  });

  test('text content snapshot', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Get all visible text
    const headings = await page.locator('h1, h2, h3').allTextContents();

    expect(headings).toMatchSnapshot('page-headings.txt');
  });

  test('API response snapshot', async ({ request }) => {
    // Example with a public API
    const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
    const data = await response.json();

    // Remove dynamic fields before snapshot
    const sanitized = {
      name: data.name,
      username: data.username,
      email: data.email,
      // Exclude id, address, phone which might be considered dynamic
    };

    expect(sanitized).toMatchSnapshot('user-data.json');
  });

  test('accessibility tree snapshot', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Get accessibility snapshot
    const accessibilityTree = await page.accessibility.snapshot();

    // Simplify for comparison
    const simplified = {
      role: accessibilityTree?.role,
      name: accessibilityTree?.name,
      childCount: accessibilityTree?.children?.length,
    };

    expect(simplified).toMatchSnapshot('a11y-tree-summary.json');
  });

  test('CSS custom properties snapshot', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Get CSS custom properties (CSS variables)
    const cssVariables = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      const variables: Record<string, string> = {};

      // Get all custom properties
      for (let i = 0; i < styles.length; i++) {
        const prop = styles[i];
        if (prop.startsWith('--')) {
          variables[prop] = styles.getPropertyValue(prop).trim();
        }
      }

      return variables;
    });

    expect(cssVariables).toMatchSnapshot('css-variables.json');
  });

  test('form validation messages snapshot', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Trigger validation by submitting empty form
    await page.getByTestId('login-button').click();

    // Get validation messages
    const validationMessages = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      return Array.from(inputs).map(input => ({
        name: input.name || input.getAttribute('data-testid'),
        validationMessage: input.validationMessage,
        validity: {
          valid: input.validity.valid,
          valueMissing: input.validity.valueMissing,
        },
      }));
    });

    expect(validationMessages).toMatchSnapshot('validation-messages.json');
  });
});
