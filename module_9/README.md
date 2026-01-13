# Module 9: CI/CD with Playwright

**Duration:** 45 minutes
**Level:** Advanced
**Prerequisites:** Completed Modules 2-8

## Learning Objectives

By the end of this module, you will be able to:

- Understand CI/CD concepts for test automation
- Set up GitHub Actions workflows for Playwright tests
- Configure multi-browser testing with matrix strategy
- Implement test sharding for faster execution
- Manage test artifacts (reports, traces, screenshots)

## Topics Covered

| Lesson | Topic | Description |
|--------|-------|-------------|
| 1 | [CI/CD Fundamentals](1_cicd_fundamentals.md) | Core concepts for automated testing |
| 2 | [GitHub Actions](2_github_actions.md) | Setting up Playwright in GitHub Actions |
| 3 | [Test Sharding](3_test_sharding.md) | Parallel execution for faster tests |
| 4 | [Artifact Management](4_artifact_management.md) | Reports, traces, and screenshots |

## Workflow Files

Ready-to-use workflow files in `workflows/github/`:

```
workflows/
└── github/
    ├── basic-playwright.yml        # Simple single-browser workflow
    ├── multi-browser-matrix.yml    # Cross-browser testing
    ├── sharded-tests.yml          # Parallel sharding
    ├── visual-regression-ci.yml   # Visual testing workflow
    └── full-pipeline.yml          # Complete CI/CD pipeline
```

## Quick Start

### GitHub Actions

1. Copy workflow file to `.github/workflows/`:

```bash
mkdir -p .github/workflows
cp workflows/github/basic-playwright.yml .github/workflows/
```

2. Push to trigger:

```bash
git add .github/workflows/
git commit -m "Add Playwright CI workflow"
git push
```

## Key Concepts

### Why CI/CD for Testing?

- **Consistency** - Tests run on every commit
- **Early detection** - Catch bugs before merge
- **Confidence** - Green build = deployable code
- **Documentation** - Test results as project history

### GitHub Actions Basics

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
```

### Test Sharding

Split tests across multiple machines:

```yaml
strategy:
  matrix:
    shardIndex: [1, 2, 3, 4]
    shardTotal: [4]

- run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
```

### Artifact Upload

```yaml
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Lab Exercise

1. Create a basic GitHub Actions workflow for your tests
2. Add multi-browser testing with matrix strategy
3. Implement test sharding (2-4 shards)
4. Configure artifact upload for reports
5. Add test result summary

## Success Criteria

- [ ] Basic workflow runs tests on push/PR
- [ ] Tests run on multiple browsers
- [ ] Sharding reduces total test time
- [ ] Reports are uploaded as artifacts
- [ ] Failed tests show clear output

## Workflow Comparison

| Workflow | Use Case | Complexity |
|----------|----------|------------|
| `basic-playwright.yml` | Simple projects | Low |
| `multi-browser-matrix.yml` | Cross-browser testing | Medium |
| `sharded-tests.yml` | Large test suites | Medium |
| `visual-regression-ci.yml` | Visual testing | Medium |
| `full-pipeline.yml` | Production projects | High |

## Resources

- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright Docker Image](https://playwright.dev/docs/docker)
