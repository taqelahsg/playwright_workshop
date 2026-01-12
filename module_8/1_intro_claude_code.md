# Introduction to Claude Code for Test Automation

## What is Claude Code?

Claude Code is Anthropic's official command-line interface (CLI) that brings Claude AI directly into your development workflow. It's designed to help developers write, debug, and maintain code more efficiently.

### Key Capabilities

| Capability | Description | Example Use Case |
|------------|-------------|------------------|
| **Code Generation** | Create new files and components | Generate page objects, test files |
| **Code Refactoring** | Improve existing code | Convert tests to POM pattern |
| **Debugging** | Analyze and fix errors | Fix flaky test issues |
| **Documentation** | Add comments and docs | Document test utilities |
| **File Operations** | Create, read, edit files | Scaffold project structure |
| **Command Execution** | Run terminal commands | Execute tests, install packages |

---

## Installing Claude Code

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Anthropic API key (or Claude Pro subscription)

### Installation Steps

```bash
# Install globally
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version

# Start Claude Code
claude
```

### First-Time Setup

When you first run `claude`, you'll be prompted to:
1. Authenticate with your Anthropic account
2. Grant necessary permissions
3. Configure default settings

---

## Why Use AI for Test Automation?

### Benefits

1. **Speed** - Generate boilerplate code in seconds
2. **Consistency** - Maintain patterns across all tests
3. **Learning** - Discover best practices through suggestions
4. **Debugging** - Get intelligent error analysis
5. **Documentation** - Auto-generate comments and docs

### When to Use AI

| Use AI For | Don't Use AI For |
|------------|------------------|
| Boilerplate code | Business-critical logic validation |
| Page object templates | Security-sensitive code |
| Test data generation | Final code review |
| Error debugging | Understanding your specific domain |
| Refactoring patterns | Complex algorithmic decisions |

---

## Claude Code Basics

### Starting a Session

```bash
# Navigate to your project
cd my-playwright-project

# Start Claude Code
claude

# You'll see a prompt like:
# >
```

### Basic Commands

```bash
# Ask Claude to create a file
> Create a new Playwright test file for login functionality

# Ask Claude to explain code
> Explain what this test does

# Ask Claude to fix an issue
> This test is failing with "element not found". Fix it.

# Ask Claude to refactor
> Refactor this test to use Page Object Model

# Exit Claude Code
> /exit
```

### Slash Commands

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/clear` | Clear conversation history |
| `/compact` | Summarize conversation |
| `/exit` | Exit Claude Code |

---

## Effective Prompting for Test Automation

### The CRAP Framework

Good prompts follow the **CRAP** framework:

- **C**ontext - Provide background information
- **R**equirements - Specify what you need
- **A**ssumptions - State any constraints
- **P**attern - Reference existing patterns to follow

### Example Prompts

#### Bad Prompt
```
Create a login test
```

#### Good Prompt
```
Create a Playwright test file for login functionality with:
- Context: Testing the Taqelah demo site (https://taqelah.sg/taqelah-demo-site.html)
- Requirements:
  - Test successful login with valid credentials (username: ladies, password: ladies_GO)
  - Test failed login with invalid password
  - Test empty field validation
- Pattern: Use Page Object Model, follow existing test structure in tests/ folder
- Include proper assertions and error handling
```

---

## Prompt Templates for Test Automation

### 1. Page Object Generation

```
Create a [PageName]Page class for Playwright with:
- URL: [page URL]
- Elements:
  - [list of elements with selectors]
- Methods:
  - [list of actions the page supports]
- Follow the existing BasePage pattern
- Use TypeScript with proper types
```

### 2. Test File Generation

```
Create a Playwright test file for [feature] with:
- Test scenarios:
  1. [scenario 1]
  2. [scenario 2]
  3. [scenario 3]
- Use the [PageName]Page object
- Include @smoke tag for critical tests
- Add proper test descriptions
- Handle setup and teardown
```

### 3. Fixture Generation

```
Create a Playwright fixture for [purpose] that:
- Sets up: [setup requirements]
- Provides: [what fixture provides to tests]
- Cleans up: [teardown requirements]
- Scope: [test/worker]
- Follow existing fixture patterns in fixtures/ folder
```

### 4. Debugging

```
This test is failing with the following error:
[paste error message]

The test code is:
[paste test code]

Please:
1. Explain why this error occurs
2. Suggest a fix
3. Show the corrected code
```

---

## Live Demo: Creating a Simple Test

Let's walk through creating a test with Claude Code.

### Step 1: Start Claude Code

```bash
cd playwright-project
claude
```

### Step 2: Ask for a Test

```
> Create a simple Playwright test that:
> - Goes to https://taqelah.sg/taqelah-demo-site.html
> - Clicks on the login button
> - Fills in username "ladies" and password "ladies_GO"
> - Clicks submit
> - Verifies the dashboard loads
> Save it as tests/demo-login.spec.ts
```

### Step 3: Review and Run

Claude will:
1. Create the file with proper structure
2. Include necessary imports
3. Add assertions
4. Save to the specified location

Then run:
```bash
npx playwright test tests/demo-login.spec.ts --headed
```

---

## Best Practices

### 1. Provide Context
Always tell Claude about your project structure, conventions, and existing patterns.

### 2. Be Specific
Instead of "create a test", specify exactly what the test should do.

### 3. Iterate
Start simple, then ask Claude to enhance or refactor.

### 4. Validate
Always review generated code before committing.

### 5. Learn
Ask Claude to explain generated code to improve your skills.

---

## Hands-On Exercise

Try these prompts in Claude Code:

1. **Basic Test**
   ```
   Create a test that verifies the page title of https://playwright.dev
   ```

2. **With Assertions**
   ```
   Create a test for https://playwright.dev that:
   - Checks the page title contains "Playwright"
   - Verifies the "Get Started" link is visible
   - Clicks "Get Started" and verifies navigation
   ```

3. **Page Object**
   ```
   Create a PlaywrightHomePage class with:
   - goto() method
   - clickGetStarted() method
   - getTitle() method
   - isLoaded() method
   ```

---

## Summary

- Claude Code brings AI assistance directly to your terminal
- Use the CRAP framework for effective prompts
- Start with simple requests, then iterate
- Always validate generated code
- AI assists development but doesn't replace understanding

---

## Next Topic

Continue to [2_framework_architecture.md](2_framework_architecture.md) to learn about designing a scalable framework structure.
