# Lesson 3: Test Sharding

## What is Sharding?

Sharding splits your test suite across multiple parallel machines. Instead of running 100 tests on one machine, run 25 tests on 4 machines simultaneously.

```
Without Sharding:              With Sharding (4x):
┌─────────────────────┐        ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│   100 tests         │        │  25  │ │  25  │ │  25  │ │  25  │
│   60 minutes        │   ->   │ tests│ │ tests│ │ tests│ │ tests│
└─────────────────────┘        │ 15m  │ │ 15m  │ │ 15m  │ │ 15m  │
                               └──────┘ └──────┘ └──────┘ └──────┘
                               Total: ~15 minutes
```

## Playwright Shard Command

```bash
# Run shard 1 of 4
npx playwright test --shard=1/4

# Run shard 2 of 4
npx playwright test --shard=2/4

# And so on...
```

Playwright automatically distributes tests evenly across shards.

## GitHub Actions Sharding

### Basic Sharded Workflow

```yaml
name: Sharded Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'

      - run: npm ci
      - run: npx playwright install --with-deps

      - name: Run tests (shard ${{ matrix.shardIndex }}/${{ matrix.shardTotal }})
        run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}

      - name: Upload blob report
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: blob-report-${{ matrix.shardIndex }}
          path: blob-report
          retention-days: 1
```

## Merging Shard Reports

After shards complete, merge their reports into a single HTML report.

### Full Workflow with Report Merging

```yaml
name: Playwright Sharded Tests

on: [push, pull_request]

jobs:
  playwright-tests:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'

      - run: npm ci
      - run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}

      - name: Upload blob report
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: blob-report-${{ matrix.shardIndex }}
          path: blob-report
          retention-days: 1

  merge-reports:
    if: ${{ !cancelled() }}
    needs: [playwright-tests]
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'

      - run: npm ci

      - name: Download blob reports
        uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-report-*
          merge-multiple: true

      - name: Merge into HTML Report
        run: npx playwright merge-reports --reporter html ./all-blob-reports

      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        with:
          name: html-report--attempt-${{ github.run_attempt }}
          path: playwright-report
          retention-days: 14
```

## Playwright Configuration for Sharding

```typescript
// playwright.config.ts
export default defineConfig({
  // Use blob reporter for sharded runs
  reporter: process.env.CI
    ? [['blob', { outputDir: 'blob-report' }]]
    : [['html']],

  // Shard configuration (handled by CLI)
  // No config changes needed - use --shard flag
});
```

## Calculating Optimal Shard Count

### Factors to Consider

| Factor | Impact |
|--------|--------|
| Test count | More tests = more shards |
| Test duration | Longer tests = more shards |
| CI minutes budget | More shards = more minutes |
| Setup time | Overhead per shard (~1-2 min) |

### General Guidelines

| Test Suite Size | Recommended Shards |
|----------------|-------------------|
| < 50 tests | 1-2 |
| 50-200 tests | 2-4 |
| 200-500 tests | 4-8 |
| 500+ tests | 8-16 |

### Formula

```
Optimal Shards = Total Test Time / Target Job Time

Example:
- 100 tests, 1 minute each = 100 minutes
- Target: 15 minutes per job
- Shards: 100 / 15 = ~7 shards
```

## Combining Shards with Browser Matrix

```yaml
strategy:
  fail-fast: false
  matrix:
    browser: [chromium, firefox, webkit]
    shardIndex: [1, 2]
    shardTotal: [2]

steps:
  - name: Run tests
    run: |
      npx playwright test \
        --project=${{ matrix.browser }} \
        --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}

  - uses: actions/upload-artifact@v4
    with:
      name: blob-report-${{ matrix.browser }}-${{ matrix.shardIndex }}
      path: blob-report
```

This creates 6 parallel jobs: 3 browsers x 2 shards.

## Dynamic Sharding

### Based on Test Count

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      shards: ${{ steps.set-shards.outputs.shards }}
    steps:
      - uses: actions/checkout@v4
      - id: set-shards
        run: |
          # Count test files
          TEST_COUNT=$(find tests -name "*.spec.ts" | wc -l)
          # Calculate shards (1 shard per 10 tests)
          SHARDS=$(( (TEST_COUNT + 9) / 10 ))
          # Cap at 8 shards
          SHARDS=$(( SHARDS > 8 ? 8 : SHARDS ))
          echo "shards=$(seq -s ',' 1 $SHARDS)" >> $GITHUB_OUTPUT

  test:
    needs: setup
    strategy:
      matrix:
        shard: ${{ fromJson(format('[{0}]', needs.setup.outputs.shards)) }}
```

## Handling Flaky Tests with Shards

```yaml
- name: Run tests with retries
  run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
  env:
    # Playwright config handles retries
    CI: true
```

In config:

```typescript
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
  },
});
```

## Cost Considerations

### GitHub Actions Pricing

| Runner | Minutes | Multiplier |
|--------|---------|------------|
| Linux | 1 min | 1x |
| Windows | 1 min | 2x |
| macOS | 1 min | 10x |

### Example Calculation

```
Without sharding:
- 1 Linux job x 60 minutes = 60 minutes

With 4 shards:
- 4 Linux jobs x 15 minutes = 60 minutes
- Plus merge job: ~2 minutes = 62 total

Wall clock time: 60 min -> 15 min
CI minutes used: Same (but faster feedback!)
```

## Best Practices

### 1. Use Blob Reporter

```typescript
reporter: process.env.CI ? 'blob' : 'html',
```

### 2. Set Retention Days

```yaml
- uses: actions/upload-artifact@v4
  with:
    retention-days: 1  # Short for blob reports
```

### 3. Always Merge Reports

The merge job should run even if some shards fail:

```yaml
merge-reports:
  if: ${{ !cancelled() }}
  needs: [playwright-tests]
```

### 4. Name Artifacts Uniquely

```yaml
name: blob-report-${{ matrix.browser }}-${{ matrix.shardIndex }}
```

### 5. Download with Pattern

```yaml
- uses: actions/download-artifact@v4
  with:
    pattern: blob-report-*
    merge-multiple: true
```

## Next Steps

In the next lesson, we'll cover artifact management for reports, traces, and screenshots.
