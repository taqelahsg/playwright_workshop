# Quick Reference Guide

## 🚀 Installation

```bash
npm install
npx playwright install
```

## 📊 Reporter Quick Reference

| Reporter | Command | Output | Best For |
|----------|---------|--------|----------|
| **List** | `npm run test:list` | Console | Local dev |
| **Dot** | `npm run test:dot` | Console | CI pipelines |
| **Line** | `npm run test:line` | Console | Large suites |
| **HTML** | `npm run test:html` | File | Debugging |
| **JSON** | `npm run test:json` | File | Automation |
| **JUnit** | `npm run test:junit` | File | CI integration |
| **Custom** | `npm run test:custom` | Console | Custom format |
| **Multiple** | `npm run test:multiple` | All | Get everything |

## 🎯 Common Tasks

### Run tests locally
```bash
npm test
```

### Debug failures
```bash
npm run test:html
npx playwright show-report
```

### Generate CI reports
```bash
npm run test:ci
```

### Test with sharding
```bash
npm run test:sharded
```

## 📁 File Reference

### Tests
- `tests/example-basic.spec.ts` - Passing tests
- `tests/example-with-failures.spec.ts` - Failing tests (demo)
- `tests/example-api.spec.ts` - API tests

### Configs
- `playwright.config.ts` - Default
- `examples/ci-reporters.config.ts` - CI setup
- `examples/multiple-reporters.config.ts` - Multiple reporters
- `examples/custom-reporter.config.ts` - Custom reporter
- `examples/html-only.config.ts` - HTML only
- `examples/blob-sharding.config.ts` - Sharding

### Custom Reporters
- `reporters/custom-reporter.ts` - Console formatter
- `reporters/slack-reporter.ts` - Slack notifications

## 🔧 Configuration Snippets

### Single Reporter
```typescript
reporter: 'html'
```

### Multiple Reporters
```typescript
reporter: [
  ['list'],
  ['html', { open: 'on-failure' }],
  ['json', { outputFile: 'results.json' }]
]
```

### Custom Reporter
```typescript
reporter: [
  ['./reporters/custom-reporter.ts']
]
```

## 📖 View Reports

```bash
# HTML
npx playwright show-report

# JSON
cat test-results/results.json | jq .

# JUnit
cat test-results/results.xml
```

## 🎨 Reporter Features

### List Reporter
- ✅ Real-time updates
- ✅ Detailed errors
- ✅ Test file paths
- ❌ Too verbose for CI

### HTML Reporter
- ✅ Interactive UI
- ✅ Screenshots & videos
- ✅ Trace viewer
- ✅ Filter & search
- ❌ Requires viewing

### JSON Reporter
- ✅ Machine-readable
- ✅ Complete data
- ✅ Easy parsing
- ❌ Not human-friendly

### JUnit Reporter
- ✅ Standard format
- ✅ CI compatible
- ✅ Wide support
- ❌ No artifacts

## 💡 Pro Tips

1. **Local dev**: Use `list` + `html` on failure
2. **CI/CD**: Use `dot` + `html` + `junit`
3. **Debugging**: Use `html` with full artifacts
4. **Automation**: Use `json` for parsing
5. **Sharding**: Use `blob` then merge

## 🐛 Troubleshooting

### HTML not opening?
```typescript
reporter: [['html', { open: 'always' }]]
```

### Large report files?
```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry'
}
```

### Need Slack notifications?
```bash
export SLACK_WEBHOOK_URL="your-webhook-url"
npm run test:custom -- --config=examples/slack-reporter.config.ts
```

## 📚 Learn More

- [GETTING_STARTED.md](GETTING_STARTED.md) - Full setup guide
- [../INDEX.md](../INDEX.md) - Complete module index
- [Playwright Docs](https://playwright.dev/docs/test-reporters)

---

**Quick Start**: `npm install && npx playwright install && npm test` 🚀
