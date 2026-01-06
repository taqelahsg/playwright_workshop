# Installing Playwright

This guide will walk you through setting up Playwright on Windows, Mac, and Linux.

## Prerequisites

Before installing Playwright, you need to have Node.js and a code editor installed on your system.

---

## Step 1: Install Node.js

Node.js is required to run Playwright. Follow the instructions for your operating system:

### Windows

1. Visit the official Node.js website: https://nodejs.org/
2. Download the **LTS (Long Term Support)** version for Windows
3. Run the downloaded `.msi` installer
4. Follow the installation wizard:
   - Accept the license agreement
   - Choose the installation location (default is recommended)
   - Keep the default features selected
   - Check the box to **automatically install necessary tools**
5. Click **Install** and wait for the installation to complete
6. Click **Finish**

**Verify Installation:**
```bash
node --version
npm --version
```

### Mac

#### Option 1: Using Official Installer
1. Visit https://nodejs.org/
2. Download the **LTS version** for macOS
3. Open the downloaded `.pkg` file
4. Follow the installation wizard
5. Enter your password when prompted

#### Option 2: Using Homebrew (Recommended)
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

**Verify Installation:**
```bash
node --version
npm --version
```

### Linux

#### Ubuntu/Debian
```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# For the latest LTS version, use NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Fedora/RHEL/CentOS
```bash
# Install Node.js and npm
sudo dnf install nodejs npm

# Or using NodeSource for latest LTS
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo dnf install -y nodejs
```

#### Arch Linux
```bash
sudo pacman -S nodejs npm
```

**Verify Installation:**
```bash
node --version
npm --version
```

---

## Step 2: Set Up Node Path

The Node.js path is usually set up automatically during installation. However, if you encounter issues, follow these steps:

### Windows

1. Press `Win + R`, type `sysdm.cpl`, and press Enter
2. Go to the **Advanced** tab
3. Click **Environment Variables**
4. Under **System variables**, find and select **Path**
5. Click **Edit**
6. Ensure these paths are present (add them if missing):
   ```
   C:\Program Files\nodejs\
   C:\Users\<YourUsername>\AppData\Roaming\npm
   ```
7. Click **OK** on all windows
8. **Restart your terminal** for changes to take effect

**Verify:**
```bash
echo %PATH%
```

### Mac

Node.js is typically added to the PATH automatically. If needed, add it manually:

1. Open Terminal
2. Edit your shell configuration file:
   ```bash
   # For zsh (default on macOS Catalina and later)
   nano ~/.zshrc

   # For bash
   nano ~/.bash_profile
   ```
3. Add this line:
   ```bash
   export PATH="/usr/local/bin:$PATH"
   ```
4. Save and exit (`Ctrl + X`, then `Y`, then `Enter`)
5. Reload the configuration:
   ```bash
   source ~/.zshrc
   # or
   source ~/.bash_profile
   ```

**Verify:**
```bash
echo $PATH
```

### Linux

Node.js is typically added to PATH automatically. If needed:

1. Open Terminal
2. Edit your shell configuration:
   ```bash
   nano ~/.bashrc
   # or for zsh
   nano ~/.zshrc
   ```
3. Add this line:
   ```bash
   export PATH="/usr/local/bin:$PATH"
   ```
4. Save and reload:
   ```bash
   source ~/.bashrc
   # or
   source ~/.zshrc
   ```

**Verify:**
```bash
echo $PATH
```

---

## Step 3: Download Visual Studio Code

Visual Studio Code is a free, powerful code editor that works great with Playwright.

### Windows

1. Visit https://code.visualstudio.com/
2. Click **Download for Windows**
3. Run the downloaded installer
4. Follow the installation wizard:
   - Accept the license agreement
   - Choose installation location
   - **Select these options:**
     - ✅ Add "Open with Code" action to context menu
     - ✅ Add to PATH
     - ✅ Register Code as an editor for supported file types
5. Click **Install**
6. Launch VS Code

### Mac

1. Visit https://code.visualstudio.com/
2. Click **Download for Mac**
3. Open the downloaded `.zip` file
4. Drag **Visual Studio Code** to the **Applications** folder
5. Launch VS Code from Applications

**Add to PATH (Optional):**
- Open VS Code
- Press `Cmd + Shift + P`
- Type "shell command"
- Select **"Shell Command: Install 'code' command in PATH"**

### Linux

#### Ubuntu/Debian
```bash
# Download and install from Microsoft repository
sudo apt update
sudo apt install software-properties-common apt-transport-https wget

wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"

sudo apt update
sudo apt install code
```

#### Fedora/RHEL/CentOS
```bash
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc

sudo sh -c 'echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'

sudo dnf install code
```

#### Arch Linux
```bash
yay -S visual-studio-code-bin
```

**Launch VS Code:**
```bash
code
```

---

## Step 4: Initialize Playwright Project

Now that you have Node.js and VS Code installed, let's create a new Playwright project.

### All Operating Systems (Same Process)

1. **Create a project folder:**

   **Windows (PowerShell or Command Prompt):**
   ```bash
   mkdir playwright-project
   cd playwright-project
   ```

   **Mac/Linux (Terminal):**
   ```bash
   mkdir playwright-project
   cd playwright-project
   ```

2. **Initialize Playwright:**

   Run the following command in your terminal:
   ```bash
   npm init playwright@latest
   ```

3. **Follow the setup wizard:**

   You'll be asked several questions:

   ```
   ? Do you want to use TypeScript or JavaScript?
   ❯ TypeScript
     JavaScript
   ```
   ➡️ Choose your preference (TypeScript is recommended)

   ```
   ? Where to put your end-to-end tests?
   ❯ tests
   ```
   ➡️ Press Enter to use the default `tests` folder

   ```
   ? Add a GitHub Actions workflow?
   ❯ Yes
     No
   ```
   ➡️ Choose Yes if you want CI/CD setup

   ```
   ? Install Playwright browsers?
   ❯ Yes
     No
   ```
   ➡️ Choose Yes to download browsers (Chromium, Firefox, WebKit)

4. **Wait for installation:**

   The installation will:
   - Install Playwright packages
   - Download browser binaries
   - Create example test files
   - Set up the project structure

5. **Open the project in VS Code:**

   ```bash
   code .
   ```

---

## Verify Your Installation

After setup is complete, verify everything is working:

```bash
# Run the example tests
npx playwright test

# Open the test report
npx playwright show-report

# Run tests in UI mode
npx playwright test --ui
```

---

## Running Tests with Browser Visibility

By default, Playwright runs tests in **headless mode** (browsers run in the background without a visible UI). However, you can watch tests execute in a real browser window.

### Headed Mode (Show Browser)

To see the browser while tests run, use the `--headed` flag:

```bash
npx playwright test --headed
```

This will:
- Open visible browser windows
- Show all interactions (clicks, typing, navigation)
- Help with debugging and understanding test flow
- Useful for development and troubleshooting

### UI Mode (Interactive Test Runner)

Playwright UI mode provides an interactive interface to run and debug tests:

```bash
npx playwright test --ui
```

UI mode features:
- Visual test explorer with play/pause controls
- Watch tests execute step-by-step
- Time travel debugging through test execution
- View DOM snapshots at each step
- Filter and search tests
- Watch mode to automatically re-run tests on file changes

### Slow Motion Execution

The `slomo` property slows down test execution to make it easier to follow what's happening. This is configured in [playwright.config.ts](playwright.config.ts):

```typescript
use: {
  // Slow down actions by specified milliseconds
  launchOptions: {
    slowMo: 1000, // Adds 1 second delay between actions
  },
}
```

You can also set slow motion per browser project:

```typescript
projects: [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      launchOptions: {
        slowMo: 500, // 500ms delay between actions
      }
    },
  },
]
```

**Combining headed mode with slow motion:**

```bash
# Run tests with visible browser and slow motion (if configured)
npx playwright test --headed
```

**Use cases for slow motion:**
- Demonstrating tests to stakeholders
- Understanding complex test flows
- Recording test execution videos
- Training and educational purposes
- Debugging timing-related issues

### Debug Mode

For detailed step-by-step debugging:

```bash
npx playwright test --debug
```

This opens Playwright Inspector where you can:
- Step through test execution line by line
- Pause and resume tests
- Inspect page elements
- View console logs and network requests

---

## Project Structure

Your new Playwright project will have this structure:

```
playwright-project/
├── .github/
│   └── workflows/
│       └── playwright.yml      # GitHub Actions CI/CD workflow
├── node_modules/               # Installed npm packages and browser binaries
├── playwright-report/          # HTML test reports (generated after test runs)
├── test-results/               # Test execution results, screenshots, videos
├── tests/
│   └── example.spec.ts        # Example test file
├── .gitignore                 # Git ignore rules
├── package.json               # Project dependencies and metadata
├── package-lock.json          # Locked dependency versions
└── playwright.config.ts       # Playwright configuration
```

### Detailed Folder and File Explanations

#### Configuration Files

**playwright.config.ts**
- Main configuration file for all Playwright test settings
- Defines test directory location (default: `./tests`)
- Configures browser projects for cross-browser testing:
  - Chromium (Chrome/Edge)
  - Firefox
  - WebKit (Safari)
- Sets test execution options:
  - `fullyParallel: true` - Runs tests in parallel for faster execution
  - `retries` - Number of retry attempts for failed tests (2 on CI, 0 locally)
  - `workers` - Number of parallel worker processes
  - `reporter: 'html'` - Generates HTML reports
- Configures tracing: `trace: 'on-first-retry'` for debugging failed tests
- Includes commented examples for:
  - Mobile viewport testing (Pixel 5, iPhone 12)
  - Branded browser testing (Microsoft Edge, Google Chrome)
  - Local dev server integration with `webServer` option

**package.json**
- Node.js project manifest file
- Contains project metadata (name, version, license, author)
- Lists dependencies:
  - `@playwright/test` - Playwright testing framework
  - `@types/node` - TypeScript type definitions for Node.js
- Used by npm to manage and install project dependencies

**package-lock.json**
- Automatically generated file that locks exact dependency versions
- Ensures consistent installations across different environments and team members
- Contains complete dependency tree with specific versions and integrity hashes

**.gitignore**
- Specifies files and folders to exclude from version control
- Excludes:
  - `node_modules/` - npm packages (too large, can be reinstalled)
  - `test-results/` - Test execution artifacts
  - `playwright-report/` - HTML reports
  - `blob-report/` - Binary report data
  - `playwright/.cache/` and `playwright/.auth/` - Cache and authentication data

#### Test Files

**tests/ folder**
- Contains all test specification files (`.spec.ts` or `.spec.js`)
- **example.spec.ts** - Default example test file with two sample tests:
  1. `has title` - Navigates to playwright.dev and verifies page title
  2. `get started link` - Clicks "Get started" link and verifies navigation
- You'll add your own test files here following the naming pattern: `*.spec.ts`

#### Report and Results Folders

**test-results/ folder**
- Automatically generated when tests run
- Stores test execution artifacts:
  - Screenshots of failures
  - Videos of test execution
  - Trace files for debugging
  - Test attachments
- Each test run creates a new subfolder
- Excluded from Git to avoid repository bloat

**playwright-report/ folder**
- Contains HTML test reports with visual results
- Generated after test execution completes
- View with: `npx playwright show-report`
- Shows:
  - Test pass/fail status
  - Execution time
  - Screenshots and videos
  - Error messages and stack traces
- Excluded from Git (regenerated on each test run)

#### Dependencies

**node_modules/ folder**
- Contains all installed npm packages and their dependencies
- Includes:
  - Playwright library code
  - Browser binaries (Chromium, Firefox, WebKit)
  - TypeScript and Node.js type definitions
- Can be very large (hundreds of MB)
- Never commit to Git - can be recreated with `npm install`
- Automatically managed by npm

#### CI/CD Integration

**.github/workflows/playwright.yml**
- GitHub Actions workflow configuration for automated testing
- Triggers on:
  - Push to main/master branch
  - Pull requests to main/master branch
- Workflow steps:
  1. Checkout code
  2. Setup Node.js (LTS version)
  3. Install dependencies with `npm ci`
  4. Install Playwright browsers with `npx playwright install --with-deps`
  5. Run tests with `npx playwright test`
  6. Upload test reports as artifacts (retained for 30 days)
- Configured with:
  - 60-minute timeout
  - Runs on Ubuntu (latest)
  - Always uploads reports even if tests fail (`if: !cancelled()`)

---

## Install Playwright VS Code Extension (Recommended)

1. Open VS Code
2. Click the **Extensions** icon (or press `Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **"Playwright Test for VSCode"**
4. Click **Install**

This extension provides:
- Test explorer to run tests directly from VS Code
- Debugging support
- Code generation tools
- IntelliSense for Playwright APIs

---

## Troubleshooting

### Node.js command not found
- Restart your terminal/command prompt
- Verify Node.js is in your PATH
- Reinstall Node.js

### Permission errors on Mac/Linux
- Use `sudo` for commands that fail with permission errors
- Or fix npm permissions: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

### Playwright browser installation fails
- Check your internet connection
- Run manually: `npx playwright install`
- Install specific browser: `npx playwright install chromium`

### Firewall/Antivirus blocking downloads
- Temporarily disable antivirus
- Add exceptions for Node.js and Playwright
- Download browsers manually if needed

---

## Next Steps

Now that you have Playwright installed, you're ready to:
- Write your first test
- Explore the Playwright API
- Configure browsers and devices
- Set up continuous integration

Happy Testing! 🎭
