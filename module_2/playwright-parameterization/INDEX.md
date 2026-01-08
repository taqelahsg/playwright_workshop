# Project Index

Quick navigation guide for the Playwright Parameterization project.

## 📚 Documentation (Start Here!)

| File | Purpose | When to Read |
|------|---------|--------------|
| [README.md](./README.md) | Complete project overview | First - Overview and features |
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Setup and installation guide | Second - Setup instructions |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Commands and patterns | Reference - While coding |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Project summary and structure | Reference - Project details |
| [INDEX.md](./INDEX.md) | This file | Navigation |

## 🧪 Test Files (Core Learning Material)

| File | Demonstrates | Difficulty | Lines |
|------|--------------|------------|-------|
| [01-basic-param.spec.ts](./tests/01-basic-param.spec.ts) | forEach parameterization | ⭐ Beginner | ~194 |
| [02-project-param.spec.ts](./tests/02-project-param.spec.ts) | Project-level params | ⭐⭐ Intermediate | ~75 |
| [03-role-param.spec.ts](./tests/03-role-param.spec.ts) | Role & locale params | ⭐⭐ Intermediate | ~125 |
| [04-csv-param.spec.ts](./tests/04-csv-param.spec.ts) | CSV-based tests | ⭐⭐⭐ Advanced | ~140 |
| [05-env-param.spec.ts](./tests/05-env-param.spec.ts) | Environment variables | ⭐⭐ Intermediate | ~120 |
| [06-matrix-param.spec.ts](./tests/06-matrix-param.spec.ts) | Matrix testing | ⭐⭐⭐ Advanced | ~210 |

**Recommended Order**: 01 → 02 → 05 → 03 → 04 → 06

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| [playwright.config.ts](./playwright.config.ts) | Main Playwright configuration with 11 projects |
| [package.json](./package.json) | Dependencies and npm scripts |
| [.env](./.env) | Environment variables (local settings) |
| [.env.example](./.env.example) | Environment variables template |
| [.gitignore](./.gitignore) | Git ignore rules |

## 🎭 Fixtures

| File | Purpose |
|------|---------|
| [custom-test.ts](./fixtures/custom-test.ts) | Custom test options (person, environment, userRole, locale) |

## 📊 Test Data

| File | Type | Records | Purpose |
|------|------|---------|---------|
| [users.csv](./test-data/users.csv) | CSV | 7 | User login test data |
| [todos.csv](./test-data/todos.csv) | CSV | 8 | Todo task test data |
| [test-users.ts](./test-data/test-users.ts) | TypeScript | Multiple | Type-safe test data |

## 🛠️ Utilities

| File | Purpose |
|------|---------|
| [csv-helper.ts](./utils/csv-helper.ts) | Load and parse CSV files |
| [env-config.ts](./utils/env-config.ts) | Type-safe environment configuration |

## 🚀 Quick Commands

```bash
# Installation
npm install
npx playwright install

# Run Tests
npm test                    # All tests
npm run test:basic         # Basic examples
npm run test:csv          # CSV tests
npm run test:ui           # UI mode

# View Results
npm run test:report       # HTML report
```

## 📖 Learning Paths

### Path 1: Quick Start (30 minutes)
1. Read [GETTING_STARTED.md](./GETTING_STARTED.md)
2. Run `npm install && npx playwright install`
3. Run `npm run test:basic`
4. Review [01-basic-param.spec.ts](./tests/01-basic-param.spec.ts)

### Path 2: Complete Tour (2 hours)
1. Read [README.md](./README.md)
2. Follow [GETTING_STARTED.md](./GETTING_STARTED.md)
3. Review all test files in order
4. Run each test project separately
5. Modify test data and re-run

### Path 3: Deep Dive (4+ hours)
1. Read all documentation
2. Study each test file thoroughly
3. Understand [playwright.config.ts](./playwright.config.ts)
4. Modify configurations
5. Create your own parameterized tests
6. Experiment with custom fixtures

## 🎯 By Use Case

### "I want to learn data-driven testing"
→ Start with [01-basic-param.spec.ts](./tests/01-basic-param.spec.ts)

### "I need to test multiple environments"
→ Check [05-env-param.spec.ts](./tests/05-env-param.spec.ts) and [env-config.ts](./utils/env-config.ts)

### "I have lots of test data in CSV"
→ See [04-csv-param.spec.ts](./tests/04-csv-param.spec.ts) and [csv-helper.ts](./utils/csv-helper.ts)

### "I need cross-browser testing"
→ Study [06-matrix-param.spec.ts](./tests/06-matrix-param.spec.ts)

### "I want custom test configurations"
→ Look at [02-project-param.spec.ts](./tests/02-project-param.spec.ts) and [custom-test.ts](./fixtures/custom-test.ts)

### "I need role-based testing"
→ Review [03-role-param.spec.ts](./tests/03-role-param.spec.ts)

## 📁 File Counts

- Documentation files: 6
- Test files: 6
- Configuration files: 5
- Fixture files: 1
- Test data files: 3
- Utility files: 2
- **Total**: 23 files

## 🎓 What Each File Teaches

### Tests
1. **01-basic-param**: forEach loops, arrays, edge cases
2. **02-project-param**: Custom fixtures, project configs
3. **03-role-param**: Conditional logic, combined params
4. **04-csv-param**: Dynamic generation, data filtering
5. **05-env-param**: Configuration management, feature flags
6. **06-matrix-param**: Cross-browser, responsive design

### Utilities
- **csv-helper**: File I/O, parsing, type safety
- **env-config**: Environment management, validation

### Fixtures
- **custom-test**: Extending Playwright, custom options

## 🔍 Find What You Need

| Looking for... | Go to... |
|----------------|----------|
| Setup instructions | [GETTING_STARTED.md](./GETTING_STARTED.md) |
| Command reference | [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) |
| Complete overview | [README.md](./README.md) |
| Project structure | [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) |
| Basic examples | [01-basic-param.spec.ts](./tests/01-basic-param.spec.ts) |
| CSV examples | [04-csv-param.spec.ts](./tests/04-csv-param.spec.ts) |
| Config examples | [playwright.config.ts](./playwright.config.ts) |
| Test data | [test-data/](./test-data/) |

## 📊 Statistics

- **Total test cases**: ~80+ (parameterized)
- **Projects configured**: 11
- **CSV records**: 15
- **Custom options**: 5
- **Utility functions**: 6
- **Documentation pages**: 6

## ✅ Checklist for New Users

- [ ] Read [README.md](./README.md)
- [ ] Follow [GETTING_STARTED.md](./GETTING_STARTED.md)
- [ ] Install dependencies (`npm install`)
- [ ] Install browsers (`npx playwright install`)
- [ ] Run basic tests (`npm run test:basic`)
- [ ] Review [01-basic-param.spec.ts](./tests/01-basic-param.spec.ts)
- [ ] Check HTML report (`npm run test:report`)
- [ ] Try modifying test data
- [ ] Create your own test
- [ ] Reference [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) as needed

---

**Start Here**: [GETTING_STARTED.md](./GETTING_STARTED.md) → Run `npm test` → Explore test files
