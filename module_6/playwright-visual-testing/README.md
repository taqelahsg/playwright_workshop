# Playwright Visual Testing Project

A hands-on project demonstrating visual regression testing with Playwright.

## Project Structure

```
playwright-visual-testing/
├── tests/
│   ├── 01-basic-screenshots.spec.ts      # Full page and basic screenshots
│   ├── 02-element-screenshots.spec.ts    # Element-level visual tests
│   ├── 03-handling-dynamic-content.spec.ts # Techniques for dynamic content
│   └── 04-snapshot-testing.spec.ts       # Data snapshot testing
├── snapshots/                            # Baseline images (auto-generated)
├── playwright.config.ts                  # Visual testing configuration
├── package.json
└── README.md
```

## Getting Started

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run tests (first run creates baselines)
npm test

# Run with UI mode
npm run test:ui

# Run headed (see browser)
npm run test:headed
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run all visual tests |
| `npm run test:headed` | Run tests with browser visible |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:update` | Update all baseline snapshots |
| `npm run report` | View HTML report |

## Test Examples

### Basic Screenshot

```typescript
test('homepage visual', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

### Element Screenshot

```typescript
test('button component', async ({ page }) => {
  const button = page.getByRole('button');
  await expect(button).toHaveScreenshot('button.png');
});
```

### Masking Dynamic Content

```typescript
test('page with dynamic content', async ({ page }) => {
  await expect(page).toHaveScreenshot('page.png', {
    mask: [page.locator('.timestamp')],
  });
});
```

### Data Snapshot

```typescript
test('form structure', async ({ page }) => {
  const structure = await page.evaluate(() => /* ... */);
  expect(structure).toMatchSnapshot('form.json');
});
```

## Updating Baselines

When UI changes are intentional:

```bash
# Update all snapshots
npm run test:update

# Update specific test file
npx playwright test tests/01-basic-screenshots.spec.ts --update-snapshots
```

## Configuration

Key settings in `playwright.config.ts`:

```typescript
expect: {
  toHaveScreenshot: {
    maxDiffPixels: 100,      // Allowed pixel difference
    threshold: 0.2,          // Color comparison sensitivity
    animations: 'disabled',  // Disable animations
  },
}
```

## Viewing Test Results

After test failures:

```bash
# Open HTML report
npm run report
```

Failed tests generate:
- `*-actual.png` - Current screenshot
- `*-expected.png` - Baseline image
- `*-diff.png` - Visual difference

## Best Practices

1. **Run on consistent environment** - Same OS, browser version
2. **Disable animations** - Prevents flaky tests
3. **Mask dynamic content** - Timestamps, user data
4. **Use explicit viewports** - Set viewport size in tests
5. **Commit baselines** - Track in version control
6. **Review changes** - Verify intentional updates
