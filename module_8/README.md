# Module 8: Building a Playwright Framework with Claude Code

**Duration:** 45-60 minutes
**Level:** Intermediate to Advanced
**Prerequisites:** Completed Modules 2-7

> **Workshop Focus:** This module teaches you how to leverage AI-assisted development with Claude Code to rapidly build a production-ready Playwright test automation framework from scratch.

---

## What is Claude Code?

Claude Code is Anthropic's official CLI tool that brings Claude's AI capabilities directly into your terminal. It can:

- **Write code** - Generate complete test files, page objects, and configurations
- **Refactor code** - Improve existing code structure and patterns
- **Debug issues** - Analyze errors and suggest fixes
- **Explain code** - Help understand complex test logic
- **Execute commands** - Run tests, install packages, and manage files

**Installation:**
```bash
npm install -g @anthropic-ai/claude-code
```

---

## Learning Objectives

By the end of this module, you will be able to:
- Use Claude Code to scaffold a complete Playwright framework
- Generate page objects, fixtures, and test utilities with AI assistance
- Create configuration files and folder structures efficiently
- Build reusable components using AI-driven development
- Understand best practices for AI-assisted test automation

---

## Topics Covered

### 1. Introduction to AI-Assisted Test Development
**File:** [1_intro_claude_code.md](1_intro_claude_code.md)

Learn about:
- What is Claude Code and how it works
- Benefits of AI-assisted test development
- When to use AI vs manual coding
- Setting up Claude Code for your project

### 2. Framework Architecture Design
**File:** [2_framework_architecture.md](2_framework_architecture.md)

Learn about:
- Designing a scalable framework structure
- Folder organization best practices
- Component relationships (Pages, Tests, Fixtures, Utils)
- Configuration management strategies

### 3. Building Framework Components with Claude Code
**File:** [3_building_components.md](3_building_components.md)

Learn about:
- Scaffolding the project structure
- Creating base page objects
- Building custom fixtures
- Generating test utilities and helpers
- Creating configuration files

### 4. Live Framework Build (Hands-on Lab)
**File:** [lab_exercise_build_framework.md](lab_exercise_build_framework.md)

Hands-on exercise to build a complete framework using Claude Code prompts.

---

## Framework Structure We'll Build

```
playwright-framework/
├── tests/
│   ├── e2e/
│   │   ├── auth/
│   │   │   ├── login.spec.ts
│   │   │   └── logout.spec.ts
│   │   ├── cart/
│   │   │   └── add-to-cart.spec.ts
│   │   └── checkout/
│   │       └── checkout-flow.spec.ts
│   └── api/
│       └── inventory.spec.ts
├── pages/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── ProductPage.ts
│   └── CartPage.ts
├── fixtures/
│   ├── base.fixture.ts
│   ├── auth.fixture.ts
│   └── test-data.fixture.ts
├── utils/
│   ├── helpers.ts
│   ├── api-client.ts
│   └── test-data-generator.ts
├── config/
│   ├── environments.ts
│   └── test-config.ts
├── data/
│   ├── users.json
│   └── products.json
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Key Claude Code Prompts for Framework Building

### 1. Project Scaffolding
```
Create a Playwright project structure with:
- Page Object Model pattern
- Custom fixtures for authentication
- Environment-based configuration
- Test data management
- API testing support
```

### 2. Base Page Object
```
Create a BasePage class in TypeScript for Playwright with:
- Constructor accepting Page object
- Common navigation methods
- Wait helpers
- Screenshot capture
- Error handling utilities
```

### 3. Custom Fixtures
```
Create Playwright fixtures for:
- Authenticated user session
- Test data setup/teardown
- API client for backend calls
- Worker-scoped database connection
```

### 4. Configuration
```
Create a playwright.config.ts with:
- Multiple browser projects (Chrome, Firefox, Safari)
- Mobile device projects (iPhone, Pixel)
- Environment-based baseURL
- Retry and timeout settings
- HTML and JSON reporters
- Trace on failure
```

---

## Success Criteria

After completing this module, you should be able to:
- [ ] Set up and use Claude Code effectively
- [ ] Design a scalable framework architecture
- [ ] Use AI prompts to generate framework components
- [ ] Create a complete Page Object Model structure
- [ ] Build custom fixtures for common scenarios
- [ ] Generate test utilities and helpers
- [ ] Configure multi-browser and multi-environment testing

---

## Quick Reference

### Essential Claude Code Commands

```bash
# Start Claude Code in your project
claude

# Ask Claude to create files
> Create a LoginPage class with methods for login, logout, and error validation

# Ask Claude to refactor
> Refactor this test to use Page Object Model

# Ask Claude to debug
> Why is this test failing with timeout error?

# Ask Claude to explain
> Explain how this fixture works
```

### Effective Prompting Tips

1. **Be specific** - Include details about patterns and conventions
2. **Provide context** - Mention existing files and structures
3. **Request explanations** - Ask Claude to explain generated code
4. **Iterate** - Refine prompts based on output
5. **Validate** - Review and test generated code

---

## Tips for Success

1. **Start with architecture** - Plan structure before coding
2. **Use incremental prompts** - Build complexity gradually
3. **Review generated code** - AI assists, you validate
4. **Maintain consistency** - Keep naming conventions uniform
5. **Document as you go** - Add comments and README files
6. **Test frequently** - Run tests after each component

---

## Additional Resources

- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [Test Fixtures Guide](https://playwright.dev/docs/test-fixtures)

---

## Common Issues and Solutions

### Issue: Claude Code not recognizing project context
**Solution:** Run `claude` from the project root directory

### Issue: Generated code has import errors
**Solution:** Ask Claude to check and fix imports:
```
Fix the import statements in this file
```

### Issue: Tests fail after generation
**Solution:** Ask Claude to debug:
```
This test is failing with [error]. Can you fix it?
```

### Issue: Inconsistent code style
**Solution:** Provide style guidelines in your prompt:
```
Use async/await, arrow functions, and follow existing naming conventions
```

---

## Next Module Preview

In **Module 9: Best Practices & CI/CD Integration**, you'll learn:
- Production-ready framework patterns
- CI/CD pipeline integration (GitHub Actions)
- Test reporting and monitoring
- Scaling test suites effectively

---

**Ready to start? Open [1_intro_claude_code.md](1_intro_claude_code.md) to begin!**

---

> **Note:** All contents of this workshop are proprietary and belong to **Taqelah**. Do not share or distribute without permission.
