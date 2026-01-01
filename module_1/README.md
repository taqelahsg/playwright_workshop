# TypeScript Basics Tutorial

A comprehensive tutorial covering all the fundamentals of TypeScript with practical, runnable examples.

## 📚 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Guide](#installation-guide)
   - [Installing Node.js](#installing-nodejs)
   - [Installing Visual Studio Code](#installing-visual-studio-code)
   - [Project Setup](#project-setup)
3. [Project Structure](#project-structure)
4. [Running the Examples](#running-the-examples)
5. [Topics Covered](#topics-covered)
6. [Learning Path](#learning-path)
7. [Additional Resources](#additional-resources)

---

## Prerequisites

Before starting this tutorial, you should have:
- Basic understanding of programming concepts
- Familiarity with JavaScript (helpful but not required)
- A computer with internet connection

---

## Installation Guide

### Installing Node.js

Node.js is required to run TypeScript code. Follow the steps for your operating system:

#### Windows

1. **Download Node.js:**
   - Visit [https://nodejs.org/](https://nodejs.org/)
   - Download the LTS (Long Term Support) version
   - The installer will be named something like `node-v20.x.x-x64.msi`

2. **Run the Installer:**
   - Double-click the downloaded file
   - Follow the installation wizard
   - Accept the license agreement
   - Keep the default installation path
   - Make sure "Add to PATH" is checked
   - Click "Install"

3. **Verify Installation:**
   - Open Command Prompt (press `Win + R`, type `cmd`, press Enter)
   - Run the following commands:
   ```bash
   node --version
   npm --version
   ```
   - You should see version numbers (e.g., `v20.11.0` and `10.2.4`)

#### macOS

1. **Using Official Installer:**
   - Visit [https://nodejs.org/](https://nodejs.org/)
   - Download the LTS version for macOS
   - Open the downloaded `.pkg` file
   - Follow the installation wizard

2. **Using Homebrew (Recommended):**
   - Open Terminal
   - Install Homebrew if not already installed:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   - Install Node.js:
   ```bash
   brew install node
   ```

3. **Verify Installation:**
   ```bash
   node --version
   npm --version
   ```

#### Linux (Ubuntu/Debian)

1. **Using Package Manager:**
   ```bash
   # Update package index
   sudo apt update

   # Install Node.js and npm
   sudo apt install nodejs npm
   ```

2. **Using NodeSource (Latest Version):**
   ```bash
   # Download and run the setup script
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

   # Install Node.js
   sudo apt-get install -y nodejs
   ```

3. **Verify Installation:**
   ```bash
   node --version
   npm --version
   ```

---

### Installing Visual Studio Code

Visual Studio Code (VS Code) is a free, powerful code editor with excellent TypeScript support.

#### Windows

1. **Download VS Code:**
   - Visit [https://code.visualstudio.com/](https://code.visualstudio.com/)
   - Click "Download for Windows"

2. **Install:**
   - Run the downloaded installer
   - Accept the license agreement
   - Choose installation location
   - **Important:** Check these options:
     - ✅ Add "Open with Code" action to Windows Explorer file context menu
     - ✅ Add "Open with Code" action to Windows Explorer directory context menu
     - ✅ Add to PATH
   - Click "Install"

3. **Launch VS Code:**
   - Open VS Code from Start Menu
   - Or right-click any folder and select "Open with Code"

#### macOS

1. **Download VS Code:**
   - Visit [https://code.visualstudio.com/](https://code.visualstudio.com/)
   - Click "Download for Mac"

2. **Install:**
   - Open the downloaded `.zip` file
   - Drag "Visual Studio Code" to Applications folder
   - Open VS Code from Applications

3. **Add to PATH (Optional):**
   - Open VS Code
   - Press `Cmd + Shift + P`
   - Type "shell command"
   - Select "Shell Command: Install 'code' command in PATH"

#### Linux

1. **Using Snap:**
   ```bash
   sudo snap install --classic code
   ```

2. **Using APT (Debian/Ubuntu):**
   ```bash
   # Import Microsoft GPG key
   wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
   sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg

   # Add VS Code repository
   sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'

   # Update and install
   sudo apt update
   sudo apt install code
   ```

---

### Recommended VS Code Extensions for TypeScript

Once VS Code is installed, install these extensions for the best TypeScript experience:

1. **Open Extensions Panel:**
   - Click the Extensions icon in the sidebar (or press `Ctrl+Shift+X` / `Cmd+Shift+X`)

2. **Install These Extensions:**
   - **ESLint** - JavaScript and TypeScript linting
   - **Prettier - Code formatter** - Code formatting
   - **Path Intellisense** - Autocomplete file paths
   - **Error Lens** - Show errors inline
   - **Material Icon Theme** - Better file icons (optional)

---

### Project Setup

Now that you have Node.js and VS Code installed, let's set up this project:

1. **Clone or Download This Project:**
   ```bash
   # If you have this as a git repository:
   git clone <repository-url>
   cd module_1

   # Or if you downloaded as a ZIP, extract it and navigate to the folder
   cd path/to/module_1
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - TypeScript compiler (`typescript`)
   - TypeScript execution environment (`ts-node`)
   - Node.js type definitions (`@types/node`)

3. **Verify Installation:**
   ```bash
   npm run dev
   ```

   You should see the welcome message and tutorial overview.

---

## Project Structure

```
module_1/
├── src/                          # Source files
│   ├── 01-variables-and-types.ts       # Variables, types, operators
│   ├── 02-control-flow.ts              # If/else, loops, switch
│   ├── 03-arrays-tuples-objects.ts     # Data structures
│   ├── 04-functions.ts                 # Functions and methods
│   ├── 05-scope-and-best-practices.ts  # Scope and best practices
│   └── index.ts                        # Main entry point
├── dist/                         # Compiled JavaScript (after build)
├── node_modules/                 # Dependencies (auto-generated)
├── package.json                  # Project configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

---

## Running the Examples

### Quick Start

Run the main introduction:
```bash
npm run dev
```

### Run Individual Examples

Each topic has its own example file that you can run independently:

```bash
# Variables, Data Types, and Operators
npm run example:variables

# Control Flow (if/else, loops, switch)
npm run example:control-flow

# Arrays, Tuples, and Objects
npm run example:arrays-objects

# Functions
npm run example:functions

# Scope Management and Best Practices
npm run example:scope
```

### Run All Examples

To run all examples in sequence:
```bash
npm run run-all
```

### Build the Project

Compile TypeScript to JavaScript:
```bash
npm run build
```

This creates a `dist/` folder with compiled JavaScript files.

### Run Compiled JavaScript

After building, you can run the compiled code:
```bash
npm start
```

---

## Topics Covered

### 1. Variables, Data Types, and Operators

**File:** [src/01-variables-and-types.ts](src/01-variables-and-types.ts)

Learn about:
- Variable declarations (`let`, `const`, `var`)
- Primitive types (string, number, boolean, null, undefined, symbol, bigint)
- Special types (any, unknown, never, void)
- Type annotations and type inference
- Union types and type aliases
- All operators (arithmetic, comparison, logical, etc.)
- Nullish coalescing (`??`) and optional chaining (`?.`)

**Run:** `npm run example:variables`

---

### 2. Control Flow

**File:** [src/02-control-flow.ts](src/02-control-flow.ts)

Master control flow with:
- `if/else` statements and conditionals
- Ternary operator
- `switch` statements with fall-through
- `for` loops (basic, countdown, nested)
- `for...of` loops (iterate over values)
- `for...in` loops (iterate over keys)
- `while` and `do-while` loops
- `break` and `continue` statements
- Labeled loops
- Practical examples (prime numbers, Fibonacci, FizzBuzz)

**Run:** `npm run example:control-flow`

---

### 3. Arrays, Tuples, and Objects

**File:** [src/03-arrays-tuples-objects.ts](src/03-arrays-tuples-objects.ts)

Explore data structures:

**Arrays:**
- Declaration and initialization
- Array methods (push, pop, shift, unshift, slice, splice)
- Searching (indexOf, includes, find, findIndex)
- Iteration (forEach, map, filter, reduce)
- Sorting and reversing
- Multi-dimensional arrays

**Tuples:**
- Fixed-length arrays with specific types
- Optional and rest elements
- Readonly tuples

**Objects:**
- Object literals and interfaces
- Optional and readonly properties
- Nested objects
- Object methods
- Object utility methods (Object.keys, Object.values, Object.entries)
- Destructuring
- Type aliases vs interfaces

**Run:** `npm run example:arrays-objects`

---

### 4. Functions

**File:** [src/04-functions.ts](src/04-functions.ts)

Deep dive into functions:
- Function declarations and expressions
- Arrow functions (concise and explicit)
- Optional, default, and rest parameters
- Function overloading
- Generic functions with constraints
- Callback functions
- Higher-order functions
- Function composition and currying
- Recursion
- IIFE (Immediately Invoked Function Expressions)
- Function type annotations
- Practical examples (debounce, memoization, chunking)

**Run:** `npm run example:functions`

---

### 5. Scope Management and Best Practices

**File:** [src/05-scope-and-best-practices.ts](src/05-scope-and-best-practices.ts)

Understand scope and write better code:

**Scope:**
- Global, function, and block scope
- Variable hoisting
- Closures and private variables
- The `this` keyword and context

**Best Practices:**
- `const` vs `let` vs `var` (when to use each)
- Type annotations for clarity
- Interfaces and enums
- Optional chaining and nullish coalescing
- Readonly properties
- Union types and type guards
- Avoiding `any` type

**Error Handling:**
- Try-catch-finally blocks
- Custom error types

**Code Organization:**
- Naming conventions (camelCase, PascalCase, UPPER_SNAKE_CASE)
- Code organization with namespaces
- Classes and encapsulation
- Performance tips

**Run:** `npm run example:scope`

---

## Learning Path

We recommend following this order:

1. **Start with Variables** (`npm run example:variables`)
   - Understand basic types and operators
   - Learn type annotations

2. **Move to Control Flow** (`npm run example:control-flow`)
   - Master conditionals and loops
   - Practice with examples

3. **Study Data Structures** (`npm run example:arrays-objects`)
   - Learn array methods
   - Understand objects and interfaces

4. **Deep Dive into Functions** (`npm run example:functions`)
   - Master different function styles
   - Learn advanced concepts

5. **Learn Best Practices** (`npm run example:scope`)
   - Understand scope
   - Apply best practices

---

## Understanding the Code

### Reading the Examples

Each example file follows this structure:

```typescript
/**
 * File header with description
 */

console.log("=== SECTION NAME ===\n");

// Code example with comments
let example: string = "Hello";

// Output showing results
console.log("1. Description:", example);
```

### Numbered Output

Examples are numbered for easy reference:
```typescript
console.log("1. First example:", value);
console.log("2. Second example:", value);
```

### Running in VS Code

#### Method 1: Using Code Runner Extension (Recommended)

1. **Install Code Runner Extension:**
   - Open Extensions panel (`Cmd+Shift+X` or `Ctrl+Shift+X`)
   - Search for "Code Runner" by Jun Han
   - Click Install

2. **Run Any TypeScript File:**
   - Open any `.ts` file in the editor
   - Right-click and select "Run Code"
   - Or press `Ctrl+Alt+N` (Windows/Linux) or `Cmd+Alt+N` (Mac)
   - View the output in the integrated terminal

3. **Configuration:**
   - The project includes [.vscode/settings.json](.vscode/settings.json) with Code Runner pre-configured
   - It uses `npx ts-node` to run TypeScript files directly

#### Method 2: Using npm Scripts

1. Open the integrated terminal (`Ctrl+\`` or `Cmd+\``)
2. Run the appropriate npm script:
   ```bash
   npm run example:variables
   ```
3. See the output in the terminal

#### Method 3: Direct Terminal Execution

Run any TypeScript file directly:
```bash
npx ts-node src/01-variables-and-types.ts
```

---

## Troubleshooting

### Common Issues

**Issue: `npm: command not found`**
- **Solution:** Node.js is not installed or not in PATH. Reinstall Node.js and ensure "Add to PATH" is checked.

**Issue: `tsc: command not found`**
- **Solution:** Run `npm install` in the project directory to install TypeScript.

**Issue: TypeScript errors in VS Code**
- **Solution:**
  1. Reload VS Code (`Ctrl+Shift+P` / `Cmd+Shift+P` > "Reload Window")
  2. Make sure TypeScript is installed: `npm install`

**Issue: Cannot find module 'typescript'**
- **Solution:** Run `npm install` to install all dependencies.

**Issue: Permission denied (Linux/macOS)**
- **Solution:** Use `sudo` or fix npm permissions:
  ```bash
  sudo npm install
  # Or fix permissions permanently
  mkdir ~/.npm-global
  npm config set prefix '~/.npm-global'
  echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
  source ~/.profile
  ```

---

## Additional Resources

### Official Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)

### Learning Resources
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Execute Program - TypeScript Course](https://www.executeprogram.com/courses/typescript)
- [TypeScript Exercises](https://typescript-exercises.github.io/)

### Tools
- [TS Playground](https://www.typescriptlang.org/play) - Try TypeScript online
- [npm](https://www.npmjs.com/) - Package manager
- [VS Code](https://code.visualstudio.com/) - Code editor

### Community
- [TypeScript GitHub](https://github.com/microsoft/TypeScript)
- [Stack Overflow - TypeScript](https://stackoverflow.com/questions/tagged/typescript)
- [TypeScript Discord](https://discord.com/invite/typescript)

---

## Next Steps

After completing this tutorial:

1. **Build a small project** - Apply what you've learned
2. **Learn about:**
   - Classes and Object-Oriented Programming
   - Modules and namespaces
   - Async/await and Promises
   - Decorators
   - Advanced types (conditional types, mapped types)
3. **Explore frameworks:**
   - React with TypeScript
   - Node.js with Express and TypeScript
   - Angular (uses TypeScript by default)

---

## Contributing

Found an issue or want to improve the examples? Feel free to:
- Report issues
- Suggest improvements
- Add more examples

---

## License

This tutorial is provided for educational purposes.

---

## Summary

You now have a complete TypeScript learning environment with:
- ✅ Node.js and npm installed
- ✅ Visual Studio Code set up
- ✅ All dependencies installed
- ✅ 5 comprehensive example files
- ✅ Easy-to-run npm scripts

Start learning by running:
```bash
npm run dev
```

Happy coding! 🎉
