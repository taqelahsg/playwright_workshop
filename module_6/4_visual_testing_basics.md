# Lesson 1: Visual Testing Basics

## What is Visual Regression Testing?

Visual regression testing automatically compares screenshots of your application against baseline images to detect unintended visual changes. It complements functional testing by catching issues that traditional assertions miss.

## When to Use Visual Testing

### Good Use Cases

| Scenario | Why Visual Testing Helps |
|----------|-------------------------|
| Design system components | Catch style regressions across the library |
| Marketing/landing pages | Ensure branding consistency |
| Complex layouts | Detect layout shifts and alignment issues |
| Cross-browser testing | Verify consistent rendering |
| Responsive design | Validate multiple viewport sizes |

### When NOT to Use

- Highly dynamic content (dashboards with live data)
- Content-heavy pages that change frequently
- A/B test variants
- User-generated content areas

## How It Works

```
First Run:
┌─────────────┐    ┌─────────────┐
│ Run Test    │ -> │ No Baseline │ -> Create baseline image
└─────────────┘    └─────────────┘

Subsequent Runs:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Run Test    │ -> │ Compare to  │ -> │ Pass/Fail   │
│             │    │ Baseline    │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Playwright's Visual Testing Capabilities

### Built-in Features

1. **Screenshot Assertions** - `toHaveScreenshot()`
2. **Data Snapshots** - `toMatchSnapshot()`
3. **Configurable Thresholds** - Pixel-level control
4. **Animation Handling** - Disable animations for stability
5. **Element Masking** - Hide dynamic content

### Snapshot Storage

```
tests/
├── example.spec.ts
└── example.spec.ts-snapshots/
    ├── homepage-chromium-darwin.png
    ├── homepage-chromium-linux.png
    └── homepage-firefox-darwin.png
```

Snapshots are stored per:
- Test file
- Browser (chromium, firefox, webkit)
- Operating system (darwin, linux, win32)

## Basic Example

```typescript
import { test, expect } from '@playwright/test';

test('homepage visual test', async ({ page }) => {
  await page.goto('https://example.com');

  // First run: creates baseline
  // Subsequent runs: compares to baseline
  await expect(page).toHaveScreenshot('homepage.png');
});
```

## Understanding Diff Results

When a test fails, Playwright generates:

```
test-results/
└── example-homepage-visual-test-chromium/
    ├── homepage-actual.png      # What was captured
    ├── homepage-expected.png    # The baseline
    └── homepage-diff.png        # Visual difference
```

The diff image highlights changed pixels in red, making it easy to identify what changed.

## Baseline Management Workflow

### Creating Baselines

```bash
# First test run creates baselines
npx playwright test

# Or explicitly update
npx playwright test --update-snapshots
```

### Updating Baselines

When UI changes are intentional:

```bash
# Update all snapshots
npx playwright test --update-snapshots

# Update specific test file
npx playwright test tests/homepage.spec.ts --update-snapshots
```

### Version Control

Always commit baseline images to version control:

```gitignore
# .gitignore
test-results/
playwright-report/

# DO NOT ignore snapshots - they should be committed
# tests/**/*-snapshots/
```

## Key Takeaways

1. Visual testing catches UI regressions that functional tests miss
2. Use it for stable, design-critical pages
3. First run creates baselines, subsequent runs compare
4. Commit baselines to version control
5. Update baselines intentionally when UI changes are approved

## Next Steps

In the next lesson, we'll dive deep into `toHaveScreenshot()` and its configuration options.
