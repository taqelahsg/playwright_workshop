# Module 11: Playwright Agents & MCP Server

**Duration:** 45 minutes
**Level:** Advanced
**Prerequisites:** Completed Modules 2-10

> **Workshop Focus:** Explore the cutting-edge AI-powered features of Playwright including Test Agents for automated test generation and the MCP (Model Context Protocol) Server for LLM-driven browser automation.

---

## Learning Objectives

By the end of this module, you will be able to:

- Understand Playwright's built-in AI agents (Planner, Generator, Healer)
- Initialize and configure Playwright agents for your project
- Generate test plans and executable tests using AI
- Auto-heal failing tests with the Healer agent
- Understand the Model Context Protocol (MCP) and its purpose
- Configure the Playwright MCP Server for AI-driven browser automation
- Integrate Playwright MCP with AI tools like Claude, VS Code, and Cursor

---

## Part 1: Playwright Test Agents

### What Are Playwright Test Agents?

Playwright offers three built-in AI agents designed to automate test creation and maintenance:

| Agent | Purpose | Input | Output |
|-------|---------|-------|--------|
| **Planner** | Explores the app and produces test plans | User request, seed test, optional PRD | Markdown test plan in `specs/` |
| **Generator** | Transforms markdown specs into executable tests | Markdown specifications | Test files in `tests/` |
| **Healer** | Runs failing tests and automatically fixes them | Failing test name | Patched, passing tests |

### Getting Started with Agents

#### Prerequisites

- **VS Code v1.105+** (released October 2025) for full agentic experience
- Node.js 18+
- Playwright installed in your project

#### Initialize Agents

```bash
npx playwright init-agents --loop=[vscode|claude|opencode]
```

This command sets up the agent configuration files in your project.

### Project Structure with Agents

```
your-project/
├── .github/                    # Agent definitions
├── specs/                      # Human-readable test plans (Planner output)
│   ├── basic-operations.md
│   ├── checkout-flow.md
│   └── user-authentication.md
├── tests/                      # Generated Playwright tests
│   ├── seed.spec.ts            # Environment bootstrap
│   ├── login/
│   │   └── valid-login.spec.ts
│   └── checkout/
│       └── guest-checkout.spec.ts
└── playwright.config.ts
```

---

## The Planner Agent

### Purpose

The Planner agent explores your application and produces structured, human-readable test plans in Markdown format.

### Inputs

- **User request** - What you want to test (e.g., "Generate a plan for guest checkout")
- **Seed test file** - Establishes environment setup and common patterns
- **Product Requirement Document (PRD)** - Optional, provides business context

### Outputs

- Human-readable Markdown test plans in the `specs/` directory
- Plans are precise enough for downstream test generation

### Example Usage

```bash
# Ask the Planner to create a test plan
> Plan tests for the user registration flow including email verification
```

### Sample Output: `specs/user-registration.md`

```markdown
# User Registration Test Plan

## Overview
Test the complete user registration flow including form validation,
email verification, and account creation.

## Preconditions
- Application is accessible at baseURL
- Email service is available for verification

## Test Cases

### TC-001: Valid Registration
**Steps:**
1. Navigate to /register
2. Fill in valid user details (name, email, password)
3. Submit the registration form
4. Check email for verification link
5. Click verification link
6. Verify account is activated

**Expected Outcome:**
- User account is created
- Welcome email is sent
- User can log in with new credentials

### TC-002: Registration with Existing Email
**Steps:**
1. Navigate to /register
2. Enter email that already exists
3. Submit the form

**Expected Outcome:**
- Error message: "Email already registered"
- Form is not submitted

## Test Data
- Valid email: test-{timestamp}@example.com
- Password: SecurePass123!
```

---

## The Generator Agent

### Purpose

The Generator agent transforms Markdown specifications from the `specs/` folder into executable Playwright test files.

### Inputs

- Markdown specifications from `specs/` folder

### Outputs

- Executable test files in `tests/` directory
- Tests verify selectors and assertions live during execution
- May include initial errors for the Healer to resolve

### Example Workflow

```bash
# Generate tests from existing specs
> Generate tests from specs/user-registration.md
```

### Sample Output: `tests/registration/valid-registration.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {

  test('TC-001: should register user with valid credentials', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');

    // Fill registration form
    const timestamp = Date.now();
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill(`test-${timestamp}@example.com`);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.getByLabel('Confirm Password').fill('SecurePass123!');

    // Submit form
    await page.getByRole('button', { name: 'Register' }).click();

    // Verify success
    await expect(page.getByText('Registration successful')).toBeVisible();
    await expect(page.getByText('Please check your email')).toBeVisible();
  });

  test('TC-002: should show error for existing email', async ({ page }) => {
    await page.goto('/register');

    // Use known existing email
    await page.getByLabel('Email').fill('existing@example.com');
    await page.getByLabel('Password').fill('SecurePass123!');

    await page.getByRole('button', { name: 'Register' }).click();

    // Verify error message
    await expect(page.getByText('Email already registered')).toBeVisible();
  });

});
```

---

## The Healer Agent

### Purpose

The Healer agent runs failing tests, inspects the current UI state, and automatically fixes issues.

### Inputs

- Name of the failing test

### Workflow

1. Replays the failing test steps
2. Inspects current UI state using accessibility snapshots
3. Identifies the issue (changed locator, timing, data, etc.)
4. Suggests patches (locator updates, waits, data fixes)
5. Re-runs until passing or declares functionality broken

### Example Usage

```bash
# Heal a failing test
> Heal tests/login/valid-login.spec.ts

# The Healer will:
# 1. Run the test and observe the failure
# 2. Analyze what changed in the UI
# 3. Update locators or add necessary waits
# 4. Re-run to verify the fix
```

### Common Fixes by Healer

| Issue | Healer Solution |
|-------|----------------|
| Changed selector | Updates to new locator |
| Timing issue | Adds appropriate `waitFor` |
| Changed text | Updates text matchers |
| New modal/dialog | Adds dialog handler |
| Data mismatch | Updates test data |

---

## Seed Tests

### What is a Seed Test?

A seed test provides initialized `page` context and common setup patterns for all generated tests.

### Example: `tests/seed.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

// This seed test establishes patterns for generated tests

test.beforeEach(async ({ page }) => {
  // Common setup: navigate to app
  await page.goto('/');

  // Wait for app to be ready
  await page.waitForSelector('[data-ready="true"]');
});

test('app loads successfully', async ({ page }) => {
  await expect(page).toHaveTitle(/My Application/);
  await expect(page.getByRole('navigation')).toBeVisible();
});

// Pattern for authenticated tests
test.describe('authenticated flows', () => {
  test.beforeEach(async ({ page }) => {
    // Login setup
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('/dashboard');
  });

  test('user can access dashboard', async ({ page }) => {
    await expect(page.getByText('Welcome')).toBeVisible();
  });
});
```

---

## Part 2: Playwright MCP Server

### What is MCP (Model Context Protocol)?

The Model Context Protocol (MCP) is a standardized communication layer originally developed by Anthropic that allows AI models (LLMs) to interact with external tools and services in a structured, reliable way.

### What is Playwright MCP Server?

The Playwright MCP Server enables language models to automate web browser interactions using structured accessibility snapshots rather than screenshots.

**Key Benefits:**

- **Fast & Lightweight** - Uses Playwright's accessibility tree, not pixel-based input
- **LLM-Friendly** - No vision models needed; operates on structured data
- **Deterministic** - Reduces ambiguity compared to screenshot-based approaches
- **Universal** - Works with any MCP-compatible AI client

### How It Works

```
┌─────────────────┐     MCP Protocol      ┌──────────────────┐
│                 │ ◄─────────────────►   │                  │
│   AI Client     │   (JSON-RPC)          │  Playwright MCP  │
│   (Claude,      │                       │     Server       │
│    VS Code,     │                       │                  │
│    Cursor)      │                       │   ┌──────────┐   │
│                 │                       │   │ Browser  │   │
└─────────────────┘                       │   │(Chromium)│   │
                                          │   └──────────┘   │
                                          └──────────────────┘
```

---

## Installation & Configuration

### Prerequisites

- Node.js 18+
- An MCP-compatible client (VS Code, Claude Desktop, Cursor, etc.)

### Basic Installation

```bash
npm install @playwright/mcp
```

### Configuration for Different Clients

#### VS Code (Copilot)

Add to your VS Code settings (`.vscode/settings.json`):

```json
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "mcp.servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

#### Claude Desktop

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

#### Cursor IDE

Add to Cursor MCP settings:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

---

## MCP Server Configuration Options

### Command Line Arguments

```bash
npx @playwright/mcp [options]
```

| Option | Description | Example |
|--------|-------------|---------|
| `--browser` | Browser to use | `--browser firefox` |
| `--headless` | Run without UI | `--headless` |
| `--headed` | Run with visible browser | `--headed` |
| `--device` | Emulate device | `--device "iPhone 15"` |
| `--viewport-size` | Set viewport | `--viewport-size 1280x720` |
| `--user-data-dir` | Persist browser data | `--user-data-dir ./browser-data` |
| `--storage-state` | Load auth state | `--storage-state auth.json` |
| `--caps` | Enable capabilities | `--caps vision,pdf` |

### Example Configurations

#### Headless Chrome (CI/CD)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--headless", "--browser", "chromium"]
    }
  }
}
```

#### Mobile Device Emulation

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--device", "iPhone 15"]
    }
  }
}
```

#### With Vision Capabilities

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--caps", "vision"]
    }
  }
}
```

---

## Available MCP Tools

### Core Automation Tools

| Tool | Description |
|------|-------------|
| `browser_navigate` | Navigate to a URL |
| `browser_click` | Click an element |
| `browser_type` | Type text into an input |
| `browser_select` | Select dropdown option |
| `browser_drag` | Drag and drop |
| `browser_file_upload` | Upload files |
| `browser_handle_dialog` | Handle alerts/confirms |

### Snapshot & Inspection

| Tool | Description |
|------|-------------|
| `browser_snapshot` | Get accessibility tree snapshot |
| `browser_screenshot` | Capture screenshot (requires `--caps vision`) |
| `browser_evaluate` | Execute JavaScript |

### Tab Management

| Tool | Description |
|------|-------------|
| `browser_tab_new` | Open new tab |
| `browser_tab_close` | Close current tab |
| `browser_tab_list` | List all tabs |
| `browser_tab_select` | Switch to tab |

### Extended Capabilities (Opt-in)

| Capability | Tools Added | Enable With |
|------------|-------------|-------------|
| `vision` | Coordinate-based interactions | `--caps vision` |
| `pdf` | PDF generation | `--caps pdf` |
| `testing` | Assertions, locator generation | `--caps testing` |
| `tracing` | Session recording | `--caps tracing` |

---

## Practical Examples

### Example 1: Using MCP with Claude Desktop

Once configured, you can interact with websites through natural language:

```
User: Go to https://example.com and click the "Sign In" button

Claude: I'll navigate to the website and click the Sign In button.
[Uses browser_navigate to go to https://example.com]
[Uses browser_snapshot to understand the page structure]
[Uses browser_click to click the Sign In button]

The page has navigated to the login form. Would you like me to fill in
any credentials?
```

### Example 2: Form Filling

```
User: Fill out the contact form with name "John Doe" and email "john@example.com"

Claude: I'll fill out the contact form for you.
[Uses browser_snapshot to identify form fields]
[Uses browser_type to fill "Name" field with "John Doe"]
[Uses browser_type to fill "Email" field with "john@example.com"]
[Uses browser_click to submit the form]

The form has been submitted successfully.
```

### Example 3: Data Extraction

```
User: Get all the product names and prices from this e-commerce page

Claude: I'll extract the product information from the page.
[Uses browser_snapshot to get page structure]
[Parses accessibility tree to find product elements]

Here are the products I found:
1. Widget Pro - $29.99
2. Gadget Plus - $49.99
3. Super Device - $99.99
```

---

## MCP Server Modes

### 1. Persistent Mode (Default)

Stores authenticated sessions across restarts:

```bash
npx @playwright/mcp --user-data-dir ./browser-data
```

### 2. Isolated Mode

Fresh browser context per session:

```bash
npx @playwright/mcp --isolated
```

### 3. Browser Extension Mode

Connect to existing browser tabs (Chrome/Edge only):

```bash
npx @playwright/mcp --extension
```

Requires the "Playwright MCP Bridge" browser extension.

### 4. Standalone HTTP Server

For headless environments or remote access:

```bash
npx @playwright/mcp --port 8080
```

---

## Docker Deployment

### Using Official Docker Image

```dockerfile
FROM mcr.microsoft.com/playwright:latest

# Install MCP server
RUN npm install -g @playwright/mcp

# Run MCP server
CMD ["npx", "@playwright/mcp", "--headless", "--browser", "chromium"]
```

### Docker Compose Example

```yaml
version: '3.8'
services:
  playwright-mcp:
    image: mcr.microsoft.com/playwright:latest
    command: npx @playwright/mcp --headless --port 8080
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
```

---

## Security Considerations

### Origin Filtering

Control which websites the MCP server can access:

```bash
# Only allow specific origins
npx @playwright/mcp --allowed-origins "https://myapp.com,https://api.myapp.com"

# Block specific origins
npx @playwright/mcp --blocked-origins "https://admin.example.com"
```

### Best Practices

1. **Use `--isolated` mode** for testing untrusted content
2. **Configure `--allowed-origins`** in production environments
3. **Avoid storing credentials** in configuration files
4. **Use `--storage-state`** for authenticated sessions instead of hardcoded passwords
5. **Run in Docker** for additional isolation

> **Note:** Origin filtering is a configuration control, not a security boundary. Do not rely on it for security-critical applications.

---

## Combining Agents with MCP

### Workflow Integration

```
┌─────────────────┐
│   User Request  │
│  "Test checkout │
│      flow"      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Planner Agent  │ ──► specs/checkout.md
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generator Agent │ ──► tests/checkout.spec.ts
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Healer Agent   │ ──► Fixed tests
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   MCP Server    │ ──► AI-driven test execution
│                 │     and maintenance
└─────────────────┘
```

---

## Lab Exercise

### Task 1: Initialize Playwright Agents

```bash
# Create a new project
mkdir playwright-agents-lab
cd playwright-agents-lab
npm init -y
npm install -D @playwright/test

# Initialize agents
npx playwright init-agents --loop=vscode
```

### Task 2: Create a Seed Test

Create `tests/seed.spec.ts` for your target application.

### Task 3: Generate a Test Plan

Use the Planner agent to create a test plan for a login flow.

### Task 4: Configure MCP Server

Set up the Playwright MCP Server in your preferred client (VS Code, Claude Desktop, or Cursor).

### Task 5: Interact with MCP

Use natural language to:
1. Navigate to a website
2. Fill out a form
3. Extract data from a page

---

## Success Criteria

- [ ] Successfully initialized Playwright agents
- [ ] Created a seed test file
- [ ] Generated at least one test plan using Planner
- [ ] Converted a test plan to executable tests using Generator
- [ ] Configured Playwright MCP Server
- [ ] Performed basic browser automation via MCP
- [ ] Understand when to use Agents vs MCP

---

## Comparison: Agents vs MCP

| Feature | Playwright Agents | Playwright MCP |
|---------|-------------------|----------------|
| **Purpose** | Test generation & maintenance | Browser automation for LLMs |
| **Primary Use** | Creating test suites | AI-driven interactions |
| **Output** | Test files (.spec.ts) | Real-time browser actions |
| **Integration** | VS Code, Claude, opencode | Any MCP client |
| **Best For** | Test automation workflows | AI assistants needing browser access |

---

## Resources

- [Playwright Agents Documentation](https://playwright.dev/docs/test-agents)
- [Playwright MCP GitHub Repository](https://github.com/microsoft/playwright-mcp)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Playwright MCP NPM Package](https://www.npmjs.com/package/@playwright/mcp)
- [MCP Community Videos](https://playwright.dev/community/mcp-videos)

---

## Troubleshooting

### Agent Issues

**Issue:** Agent commands not recognized
**Solution:** Ensure VS Code v1.105+ is installed and Playwright is up to date

**Issue:** Generated tests have import errors
**Solution:** Check that seed test establishes correct import patterns

### MCP Issues

**Issue:** MCP server won't start
**Solution:** Verify Node.js 18+ is installed: `node --version`

**Issue:** Browser doesn't launch
**Solution:** Run `npx playwright install` to install browsers

**Issue:** Connection refused
**Solution:** Check that no other process is using the same port

---

## Next Steps

Congratulations on completing Module 11! You now have knowledge of:
- AI-powered test generation with Playwright Agents
- LLM-driven browser automation with MCP Server

### Continue Learning:
- Experiment with different MCP capabilities (`--caps`)
- Build automated test pipelines using Agents
- Integrate MCP with your existing AI workflows
- Explore custom MCP tool development

---

> **Note:** All contents of this workshop are proprietary and belong to **Taqelah**. Do not share or distribute without permission.
