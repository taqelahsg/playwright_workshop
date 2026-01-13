# Lesson 4: Visual Testing Best Practices

## CI/CD Integration

### Running Visual Tests in CI

Visual tests require a consistent environment. Different operating systems render fonts and anti-aliasing differently, causing false positives.

```yaml
# GitHub Actions - use Linux for consistency
jobs:
  visual-tests:
    runs-on: ubuntu-latest  # Always use same OS
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test tests/visual/
```

### Generating Baselines in CI

Generate baseline images in CI, not locally:

```yaml
# .github/workflows/update-baselines.yml
name: Update Visual Baselines

on:
  workflow_dispatch:  # Manual trigger

jobs:
  update-baselines:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps chromium

      - name: Update snapshots
        run: npx playwright test tests/visual/ --update-snapshots

      - name: Commit updated baselines
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add "**/*.png"
          git diff --staged --quiet || git commit -m "chore: update visual baselines"
          git push
```

### Handling Visual Test Failures

```yaml
- name: Run visual tests
  run: npx playwright test tests/visual/
  continue-on-error: true

- name: Upload diff artifacts
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: visual-diff
    path: test-results/
    retention-days: 7
```

## Organizing Visual Tests

### Separate Visual Tests from Functional Tests

```
tests/
├── functional/
│   ├── login.spec.ts
│   └── checkout.spec.ts
└── visual/
    ├── homepage.visual.spec.ts
    ├── components.visual.spec.ts
    └── responsive.visual.spec.ts
```

### Use Tags for Filtering

```typescript
test('homepage visual @visual', async ({ page }) => {
  // ...
});

test('login form visual @visual @critical', async ({ page }) => {
  // ...
});
```

```bash
# Run only visual tests
npx playwright test --grep @visual

# Run visual tests in CI
npx playwright test --grep @visual --project=chromium
```

## Handling Common Issues

### 1. Flaky Screenshots

**Problem:** Screenshots differ slightly between runs.

**Solutions:**

```typescript
// Disable animations
await expect(page).toHaveScreenshot('page.png', {
  animations: 'disabled',
});

// Wait for fonts to load
await page.waitForFunction(() => document.fonts.ready);

// Wait for images
await page.waitForFunction(() => {
  const images = document.querySelectorAll('img');
  return Array.from(images).every(img => img.complete);
});
```

### 2. Dynamic Content

**Problem:** Timestamps, ads, or user data change.

**Solutions:**

```typescript
// Mask dynamic elements
await expect(page).toHaveScreenshot('page.png', {
  mask: [
    page.locator('.timestamp'),
    page.locator('.ad-slot'),
  ],
});

// Or hide them
await page.evaluate(() => {
  document.querySelectorAll('.dynamic').forEach(el => {
    (el as HTMLElement).style.visibility = 'hidden';
  });
});
```

### 3. Anti-aliasing Differences

**Problem:** Text renders differently on different systems.

**Solutions:**

```typescript
// Increase tolerance
await expect(page).toHaveScreenshot('page.png', {
  threshold: 0.3,  // More lenient
  maxDiffPixels: 500,
});
```

### 4. Responsive Layout Shifts

**Problem:** Layout differs at different viewports.

**Solutions:**

```typescript
test.beforeEach(async ({ page }) => {
  // Always set explicit viewport
  await page.setViewportSize({ width: 1280, height: 720 });
});
```

## Performance Optimization

### Run Visual Tests on Single Browser

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'visual-chromium',
      testMatch: '**/*.visual.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    // Functional tests run on all browsers
    {
      name: 'chromium',
      testIgnore: '**/*.visual.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: '**/*.visual.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
```

### Parallel Execution Considerations

Visual tests can run in parallel, but use consistent workers:

```typescript
export default defineConfig({
  workers: process.env.CI ? 1 : undefined,  // Single worker in CI for consistency
});
```

## Baseline Management Strategy

### When to Update Baselines

1. **Intentional UI changes** - New design, component updates
2. **Font changes** - New fonts may render differently
3. **Layout changes** - Spacing, sizing adjustments
4. **Bug fixes** - Visual bug corrections

### Baseline Review Process

```markdown
## PR Checklist for Visual Changes

- [ ] Visual changes are intentional
- [ ] Diff images reviewed and approved
- [ ] Baselines updated with `--update-snapshots`
- [ ] No unintended regressions in other areas
```

### Git LFS for Large Baselines

```bash
# Track PNG files with Git LFS
git lfs install
git lfs track "*.png"
git add .gitattributes
```

## Threshold Guidelines

| Content Type | Recommended Threshold | maxDiffPixels |
|-------------|----------------------|---------------|
| Text-heavy pages | 0.1 - 0.2 | 50-100 |
| Image-heavy pages | 0.2 - 0.3 | 100-500 |
| Charts/graphs | 0.3 - 0.4 | 200-1000 |
| Icons/buttons | 0.05 - 0.1 | 10-50 |

## Visual Testing Checklist

### Before Implementing

- [ ] Identify pages/components for visual testing
- [ ] Determine acceptable threshold values
- [ ] Plan baseline generation strategy
- [ ] Set up CI pipeline for visual tests

### During Implementation

- [ ] Use explicit viewport sizes
- [ ] Disable animations
- [ ] Mask dynamic content
- [ ] Use descriptive snapshot names

### Maintenance

- [ ] Review visual diffs in PRs
- [ ] Update baselines intentionally
- [ ] Monitor flaky tests
- [ ] Document acceptable differences

## Example: Complete Visual Test Suite

```typescript
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('login page @visual @critical', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('login-page.png', {
      animations: 'disabled',
      mask: [page.locator('.cookie-banner')],
    });
  });

  test('login form states @visual', async ({ page }) => {
    await page.goto('/login');

    // Empty state
    await expect(page.locator('form')).toHaveScreenshot('form-empty.png');

    // Filled state
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await expect(page.locator('form')).toHaveScreenshot('form-filled.png');

    // Error state
    await page.click('button[type="submit"]');
    await page.waitForSelector('.error');
    await expect(page.locator('form')).toHaveScreenshot('form-error.png');
  });
});
```

## Summary

1. **Consistency is key** - Same OS, browser, viewport
2. **Handle dynamic content** - Mask or hide
3. **Use appropriate thresholds** - Balance precision and stability
4. **Separate visual tests** - Different from functional tests
5. **Generate baselines in CI** - Not locally
6. **Review changes carefully** - Intentional updates only
