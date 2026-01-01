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

## License

This tutorial is provided for educational purposes.

---

## Detailed Code Explanations

This section provides in-depth explanations of all code examples in the tutorial.

### 1. Variables and Data Types Explained

#### Variable Declarations (let, const, var)

**Example: Using `let`**
```typescript
// Declare a variable with 'let' keyword
// 'string' is the type annotation - tells TypeScript this variable holds text
let username: string = "Alice";  // username is now "Alice"

// We can reassign 'let' variables to new values
username = "Bob";  // username is now "Bob" - this is allowed!
```
- `let` declares a **block-scoped** variable that can be reassigned
- Only exists within the `{ }` block where it's defined
- Cannot be redeclared in the same scope
- Best used for values that change (loop counters, accumulators)

**Example: Using `const`**
```typescript
// Declare a constant with 'const' keyword
// Constants CANNOT be reassigned once set
const PI: number = 3.14159;  // PI is now 3.14159

// Trying to reassign a const will cause an error
// PI = 3.14;  // ❌ Error: Cannot assign to 'PI' because it is a constant
```
- `const` declares a **block-scoped** constant that cannot be reassigned
- Must be initialized when declared
- **IMPORTANT:** For objects/arrays, the reference is constant but contents can be modified
- Default choice for most declarations

**Example: `const` with Objects**
```typescript
// Create a const object - the REFERENCE is constant, not the content
const userProfile = { name: "Alice", age: 30 };

// We CAN modify properties of a const object
userProfile.age = 31;  // ✅ This works! age is now 31

// But we CANNOT reassign the entire object
// userProfile = { name: "Bob", age: 25 };  // ❌ Error: Cannot reassign const variable
```
- The object reference is constant, but properties can be changed
- Use `readonly` or `Object.freeze()` for true immutability

**Example: `var` (Legacy - Avoid)**
```typescript
var oldStyleVar: string = "Legacy variable";
{
  var anotherVar: string = "var ignores blocks!";
}
console.log(anotherVar); // Still accessible - var is function-scoped
```
- `var` is **function-scoped**, not block-scoped
- Hoisted to the top of the function (accessible before declaration)
- Can be redeclared and reassigned
- **Avoid using** - replaced by `let` and `const` in modern TypeScript

#### Primitive Data Types

**String Type**
```typescript
let firstName: string = "John";
let lastName: string = 'Doe';
let fullName: string = `${firstName} ${lastName}`; // Template literal
```
- Strings can use single quotes `'`, double quotes `"`, or backticks `` ` ``
- Template literals (backticks) support string interpolation with `${expression}`

**Number Type**
```typescript
let age: number = 30;
let price: number = 99.99;
let hexValue: number = 0xff; // 255 in hexadecimal
let binaryValue: number = 0b1010; // 10 in binary
```
- All numbers are floating-point (no separate int/float types)
- Supports decimal, hexadecimal (`0x`), binary (`0b`), and octal (`0o`) notation

**Boolean Type**
```typescript
let isActive: boolean = true;
let hasPermission: boolean = false;
```
- Only two values: `true` and `false`
- Result of comparison and logical operations

**Null and Undefined**
```typescript
let nothing: null = null;        // Intentional absence of value
let notDefined: undefined = undefined; // Variable declared but not assigned
```
- `null`: Explicitly set to represent "no value"
- `undefined`: Default value of uninitialized variables

**Symbol**
```typescript
let uniqueId: symbol = Symbol("id");
let anotherId: symbol = Symbol("id");
console.log(uniqueId === anotherId); // false - each Symbol is unique
```
- Creates unique, immutable identifiers
- Even with same description, each Symbol is different

**BigInt**
```typescript
let bigNumber: bigint = 9007199254740991n;
```
- For integers larger than `Number.MAX_SAFE_INTEGER`
- Append `n` to the number

#### Type Inference

```typescript
let inferredString = "TypeScript infers this as string";
let inferredNumber = 42;
// inferredNumber = "string"; // Error: Type 'string' is not assignable to type 'number'
```
- TypeScript automatically determines types from initial values
- Provides type safety without explicit annotations

#### Special Types

**`any` Type (Avoid)**
```typescript
let anything: any = "a string";
anything = 42;      // OK
anything = true;    // OK
```
- Disables type checking
- Use only when migrating JavaScript code or truly dynamic data

**`unknown` Type (Safe Alternative)**
```typescript
let userInput: unknown = "some input";
// console.log(userInput.toUpperCase()); // Error: Object is of type 'unknown'

if (typeof userInput === "string") {
  console.log(userInput.toUpperCase()); // OK - type narrowed
}
```
- Similar to `any` but requires type checking before use
- Forces you to verify the type before operations

**`void` Type**
```typescript
function logMessage(message: string): void {
  console.log(message); // No return value
}
```
- Indicates function doesn't return a value
- Can return `undefined` or nothing

**`never` Type**
```typescript
function throwError(message: string): never {
  throw new Error(message); // Never returns normally
}
```
- Function never returns (throws error or infinite loop)
- Used for exhaustiveness checking

#### Union Types

```typescript
let id: string | number;
id = "ABC123"; // OK
id = 12345;    // OK
```
- Variable can be one of multiple types
- Use `|` to combine types

**Type Narrowing**
```typescript
// This function accepts EITHER a string OR a number (union type)
function printId(id: string | number): void {
  // Check if id is a string using typeof
  if (typeof id === "string") {
    // Inside this block, TypeScript KNOWS id is a string
    console.log(id.toUpperCase());  // ✅ Can use string methods
  } else {
    // TypeScript KNOWS id must be a number here
    console.log(id.toFixed(2));  // ✅ Can use number methods
  }
}
```
- TypeScript narrows the type based on conditions

#### Type Aliases

```typescript
type ID = string | number;
type Point = {
  x: number;
  y: number;
};

let userId: ID = "user_123";
let coordinate: Point = { x: 10, y: 20 };
```
- Create reusable type names
- Makes complex types more readable

#### Operators

**Arithmetic Operators**
```typescript
console.log(10 + 3);   // Addition: 13
console.log(10 - 3);   // Subtraction: 7
console.log(10 * 3);   // Multiplication: 30
console.log(10 / 3);   // Division: 3.333...
console.log(10 % 3);   // Modulus (remainder): 1
console.log(10 ** 3);  // Exponentiation: 1000
```

**Increment/Decrement**
```typescript
let counter = 5;
console.log(counter++); // Post-increment: prints 5, then counter becomes 6
console.log(++counter); // Pre-increment: counter becomes 7, then prints 7
```

**Comparison Operators**
```typescript
console.log(10 == '10');  // true  - loose equality (type coercion)
console.log(10 === '10'); // false - strict equality (no coercion)
```
- **Always use `===` and `!==`** in TypeScript for type-safe comparisons

**Logical Operators**
```typescript
console.log(true && false);  // AND: false
console.log(true || false);  // OR: true
console.log(!true);          // NOT: false
```

**Nullish Coalescing (`??`)**
```typescript
let userAge: number | null = null;
let defaultAge: number = userAge ?? 18; // Use 18 if userAge is null/undefined
```
- Returns right side only if left is `null` or `undefined`
- Different from `||` which returns right side for any falsy value

**Optional Chaining (`?.`)**
```typescript
let user = { name: "Alice" }; // No address property
console.log(user.address?.city ?? "No city"); // Safely access nested properties
```
- Stops evaluation if property is `null` or `undefined`
- Prevents "Cannot read property of undefined" errors

---

### 2. Control Flow Explained

#### If/Else Statements

**Simple If**
```typescript
if (temperature > 30) {
  console.log("It's hot outside!");
}
```
- Executes block only if condition is `true`

**If-Else**
```typescript
if (temperature > 30) {
  console.log("It's hot!");
} else {
  console.log("It's comfortable!");
}
```
- One block executes based on condition

**If-Else If-Else Chain**
```typescript
if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}
```
- Evaluates conditions in order
- First true condition executes
- `else` is optional default

#### Ternary Operator

```typescript
let status = userAge >= 18 ? "Adult" : "Minor";
```
- Concise if-else for simple conditions
- Format: `condition ? valueIfTrue : valueIfFalse`

**Nested Ternary (Use Sparingly)**
```typescript
let result =
  grade >= 90 ? "Excellent" :
  grade >= 70 ? "Good" :
  grade >= 50 ? "Pass" : "Fail";
```
- Can be hard to read
- Consider if-else for complex logic

#### Switch Statements

**Basic Switch**
```typescript
switch (dayOfWeek) {
  case 1:
    console.log("Monday");
    break;  // Prevents fall-through
  case 2:
    console.log("Tuesday");
    break;
  default:
    console.log("Invalid day");
}
```
- Compares value against multiple cases
- `break` exits the switch (important!)
- `default` is optional catch-all

**Fall-Through Cases**
```typescript
switch (month) {
  case 12:
  case 1:
  case 2:
    console.log("Winter");
    break;  // One break for multiple cases
  case 3:
  case 4:
  case 5:
    console.log("Spring");
    break;
}
```
- Multiple cases can share code
- Useful for grouping similar values

#### For Loops

**Basic For Loop**
```typescript
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
```
- Format: `for (initialization; condition; increment)`
- `let i = 1`: Executed once at start
- `i <= 5`: Checked before each iteration
- `i++`: Executed after each iteration

**Counting Backwards**
```typescript
for (let i = 5; i >= 1; i--) {
  console.log(i);
}
```

**Step Increment**
```typescript
for (let i = 0; i <= 10; i += 2) {
  console.log(i); // 0, 2, 4, 6, 8, 10
}
```

**Nested Loops**
```typescript
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    console.log(`i=${i}, j=${j}`);
  }
}
```
- Outer loop runs 3 times
- Inner loop runs 3 times for each outer iteration
- Total: 9 iterations

#### For...Of Loop (Values)

```typescript
let colors = ["red", "green", "blue"];
for (let color of colors) {
  console.log(color); // red, green, blue
}
```
- Iterates over **values** in an iterable (array, string, etc.)
- Simpler than traditional for loop
- Cannot access index directly

#### For...In Loop (Keys)

```typescript
let fruits = ["apple", "banana", "cherry"];
for (let index in fruits) {
  console.log(`Index ${index}: ${fruits[index]}`);
}
```
- Iterates over **keys/indices** of an object or array
- For arrays: gets indices as strings
- For objects: gets property names

**For...In with Objects**
```typescript
let person = { name: "Alice", age: 30 };
for (let key in person) {
  console.log(`${key}: ${person[key]}`);
}
```

#### While Loops

```typescript
let count = 1;
while (count <= 5) {
  console.log(count);
  count++; // Must update condition or infinite loop!
}
```
- Condition checked **before** each iteration
- May not execute at all if condition is initially false

#### Do-While Loops

```typescript
let number = 10;
do {
  console.log(number);
  number++;
} while (number <= 12);
```
- Condition checked **after** each iteration
- **Always executes at least once**

**Difference: While vs Do-While**
```typescript
let x = 10;
while (x < 5) {
  console.log("Won't print"); // Never executes
}

let y = 10;
do {
  console.log("Prints once"); // Executes once
} while (y < 5);
```

#### Break and Continue

**Break - Exit Loop**
```typescript
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    console.log(`Found even number: ${i}`);
    break; // Exit loop immediately
  }
}
```
- Exits the loop entirely
- Use to stop searching after finding what you need

**Continue - Skip Iteration**
```typescript
for (let i = 1; i <= 10; i++) {
  if (i % 2 !== 0) {
    continue; // Skip odd numbers
  }
  console.log(`Even number: ${i}`);
}
```
- Skips rest of current iteration
- Continues with next iteration

**Labeled Break (Advanced)**
```typescript
outerLoop: for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    if (i === 2 && j === 2) {
      break outerLoop; // Break outer loop from inner loop
    }
    console.log(`i=${i}, j=${j}`);
  }
}
```
- Labels allow breaking/continuing outer loops from inner loops

---

### 3. Arrays, Tuples, and Objects Explained

#### Array Basics

**Declaration**
```typescript
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];
let mixed: (string | number)[] = [1, "two", 3, "four"];
let moreNumbers: Array<number> = [10, 20, 30]; // Alternative syntax
```

**Accessing Elements**
```typescript
console.log(numbers[0]);                    // First element: 1
console.log(numbers[numbers.length - 1]);   // Last element: 5
```
- Arrays are zero-indexed
- `length` property gives array size

#### Array Modification Methods

**Adding/Removing Elements**
```typescript
let fruits = ["apple", "banana"];

fruits.push("cherry");        // Add to end: ["apple", "banana", "cherry"]
let removed = fruits.pop();   // Remove from end: "cherry"

fruits.unshift("strawberry"); // Add to beginning: ["strawberry", "apple", "banana"]
let first = fruits.shift();   // Remove from beginning: "strawberry"
```

**Splice - Insert/Remove at Any Position**
```typescript
let colors = ["red", "green", "blue", "yellow"];
colors.splice(2, 1, "purple", "orange");
// At index 2, remove 1 element, add "purple" and "orange"
// Result: ["red", "green", "purple", "orange", "yellow"]
```
- `splice(startIndex, deleteCount, item1, item2, ...)`
- **Modifies** original array

**Slice - Extract Portion**
```typescript
let colors = ["red", "green", "blue", "yellow"];
let someColors = colors.slice(1, 3); // ["green", "blue"]
console.log(colors); // Original unchanged
```
- `slice(start, end)` - end is exclusive
- **Does not modify** original array
- Returns new array

#### Array Search Methods

**indexOf and includes**
```typescript
let scores = [85, 92, 78, 90, 88];

console.log(scores.indexOf(90));  // 3 (index of element)
console.log(scores.indexOf(100)); // -1 (not found)

console.log(scores.includes(92)); // true
console.log(scores.includes(100)); // false
```

**find and findIndex**
```typescript
let firstHighScore = scores.find(score => score >= 90);
// Returns first element matching condition: 92

let index = scores.findIndex(score => score >= 90);
// Returns index of first match: 1
```

#### Array Iteration Methods

**forEach - Execute Function for Each Element**
```typescript
// forEach runs a function for EACH element in the array
// Parameters: (currentElement, index) => { ... }
scores.forEach((score, index) => {
  // score = current element value
  // index = position in array (0, 1, 2, ...)
  console.log(`Index ${index}: ${score}`);
});
```
- Cannot return value or break loop
- Use for side effects (logging, updating external state)

**map - Transform Each Element**
```typescript
// map creates a NEW array by transforming each element
// It takes each element, applies a function, and returns the result
let doubled = scores.map(score => score * 2);
// For each score: 85*2=170, 92*2=184, 78*2=156, 90*2=180, 88*2=176
// Result: [170, 184, 156, 180, 176]
```
- Returns **new array** with transformed values
- Original array unchanged

**filter - Keep Matching Elements**
```typescript
// filter creates a NEW array with only elements that pass a test
// It checks each element and keeps only those where the function returns true
let highScores = scores.filter(score => score >= 85);
// Check each score: 85>=85✅, 92>=85✅, 78>=85❌, 90>=85✅, 88>=85✅
// Result: [85, 92, 90, 88] - only scores that are 85 or higher
```
- Returns **new array** with elements passing test
- Original array unchanged

**reduce - Reduce to Single Value**
```typescript
// reduce combines all elements into a SINGLE value
// Parameters: (accumulator, currentElement) => newAccumulator, initialValue
let total = scores.reduce((sum, score) => sum + score, 0);
// sum starts at 0 (initial value)
// Step 1: sum=0, score=85 → 0+85=85
// Step 2: sum=85, score=92 → 85+92=177
// Step 3: sum=177, score=78 → 177+78=255
// Step 4: sum=255, score=90 → 255+90=345
// Step 5: sum=345, score=88 → 345+88=433
// Result: 433 (total of all scores)
```
- Format: `reduce((accumulator, currentValue) => newAccumulator, initialValue)`
- Powerful for summing, counting, grouping, etc.

**some and every**
```typescript
// some() checks if AT LEAST ONE element passes the test
// Returns true if ANY element makes the condition true
let hasFailingGrade = scores.some(score => score < 60);
// Check: 85<60? No, 92<60? No, 78<60? No, 90<60? No, 88<60? No
// Result: false (no failing grades found)

// every() checks if ALL elements pass the test
// Returns true only if EVERY element makes the condition true
let allPassing = scores.every(score => score >= 60);
// Check: 85>=60? Yes, 92>=60? Yes, 78>=60? Yes, 90>=60? Yes, 88>=60? Yes
// Result: true (all scores are passing)
```
- `some`: Returns true if **any** element matches
- `every`: Returns true if **all** elements match

#### Array Sorting

```typescript
// Start with an unsorted array
let unsorted = [5, 2, 8, 1, 9];

// Ascending order (smallest to largest)
// [...unsorted] creates a COPY so we don't modify the original
// (a, b) => a - b means: if a < b return negative (a comes first)
let sorted = [...unsorted].sort((a, b) => a - b);
// Comparison: a-b < 0 means a comes before b
// Result: [1, 2, 5, 8, 9]

// Descending order (largest to smallest)
// (a, b) => b - a means: if b < a return negative (b comes first)
let sortedDesc = [...unsorted].sort((a, b) => b - a);
// Comparison: b-a < 0 means b comes before a
// Result: [9, 8, 5, 2, 1]
```
- **Important:** `sort()` modifies original array
- Use spread operator `[...array]` to create copy first
- For numbers, **must provide compare function** (otherwise sorts as strings)

**String Sorting**
```typescript
// Strings can be sorted without a compare function
let words = ["banana", "apple", "cherry"];
words.sort();  // Alphabetically: ["apple", "banana", "cherry"]
// For strings, default sort works correctly (alphabetical order)
```

#### Array Joining and Combining

**join - Array to String**
```typescript
// join() combines all elements into a STRING
// You specify the separator between elements
let letters = ["a", "b", "c"];
let joined = letters.join("-");  // Use "-" as separator
// Result: "a-b-c" (a string, not an array!)
```

**concat - Combine Arrays**
```typescript
// concat() creates a NEW array by combining two or more arrays
let arr1 = ["a", "b"];
let arr2 = ["c", "d"];
let combined = arr1.concat(arr2);  // Merge arr1 and arr2
// Result: ["a", "b", "c", "d"] - a new array with all elements
// arr1 and arr2 remain unchanged
```

**Spread Operator**
```typescript
// ... (spread operator) "spreads out" array elements
// Modern alternative to concat()
let spreadCombined = [...arr1, ...arr2];
// ...arr1 expands to "a", "b"
// ...arr2 expands to "c", "d"
// Result: ["a", "b", "c", "d"] - same as concat but more flexible
```

#### Multi-Dimensional Arrays

**2D Array (Matrix)**
```typescript
// A 2D array is an "array of arrays" - like a table or grid
// number[][] means "array of number arrays"
let matrix: number[][] = [
  [1, 2, 3],    // Row 0
  [4, 5, 6],    // Row 1
  [7, 8, 9]     // Row 2
];
// Visualize as:
//   Col0 Col1 Col2
//   [1,  2,   3  ]  Row 0
//   [4,  5,   6  ]  Row 1
//   [7,  8,   9  ]  Row 2

console.log(matrix[1][2]);
// matrix[1] gets Row 1 → [4, 5, 6]
// [2] gets index 2 of that row → 6
// Result: 6
```

**3D Array**
```typescript
// A 3D array is an "array of 2D arrays" - like stacked grids
// number[][][] means "array of array of number arrays"
let cube: number[][][] = [
  [[1, 2], [3, 4]],  // Layer 0
  [[5, 6], [7, 8]]   // Layer 1
];

console.log(cube[1][0][1]);
// cube[1] gets Layer 1 → [[5, 6], [7, 8]]
// [0] gets first row of that layer → [5, 6]
// [1] gets index 1 of that row → 6
// Result: 6
```

#### Tuples

**Fixed-Length Typed Arrays**
```typescript
// A tuple is like an array but with FIXED length and SPECIFIC types for each position
// [string, number, boolean] means: position 0 is string, position 1 is number, position 2 is boolean
let person: [string, number, boolean] = ["Alice", 30, true];
//           [name,   age,    active]
// Position 0: "Alice" (string) - name
// Position 1: 30 (number) - age
// Position 2: true (boolean) - active status
```
- Fixed number of elements
- Each position has specific type
- Order matters

**Destructuring Tuples**
```typescript
// Destructuring "unpacks" the tuple into individual variables
// Variable names can be anything - position matters, not names
let [name, age, isActive] = person;
// name = person[0] = "Alice"
// age = person[1] = 30
// isActive = person[2] = true
console.log(name, age, isActive); // Alice, 30, true
```

**Optional Elements**
```typescript
// The ? makes an element optional - it can be present or omitted
let optionalTuple: [string, number?] = ["Bob"];
// Position 0: "Bob" (required string) ✅
// Position 1: undefined (optional number, not provided) ✅
// This is valid because the second element is optional
```

**Rest Elements**
```typescript
// ...number[] means "any number of numbers can follow"
// First element is fixed (string), remaining elements can be any amount of numbers
let restTuple: [string, ...number[]] = ["scores", 85, 90, 92, 88];
// Position 0: "scores" (string) - required
// Position 1+: 85, 90, 92, 88 (any number of numbers) - rest elements
// Useful when you have a fixed start but variable-length data
```

**Readonly Tuples**
```typescript
// 'readonly' keyword prevents any modifications to the tuple
let readonlyTuple: readonly [string, number] = ["Charlie", 25];
// You can READ the values but cannot CHANGE them
// readonlyTuple[0] = "Dave"; // ❌ Error: Cannot assign to '0' because it is a read-only property
// Useful for data that should never change after creation
```

#### Objects

**Object Literals**
```typescript
// An object is a collection of key-value pairs (properties)
// Curly braces { } define an object
let user = {
  name: "John Doe",        // property: name, value: "John Doe"
  age: 28,                 // property: age, value: 28
  email: "john@example.com" // property: email, value: "john@example.com"
};
// Objects group related data together
```

**Accessing Properties**
```typescript
// Two ways to access object properties:

// 1. Dot notation - most common, cleaner syntax
console.log(user.name);     // "John Doe"

// 2. Bracket notation - useful for dynamic keys or keys with spaces
console.log(user["email"]); // "john@example.com"
// Use brackets when key is in a variable or contains special characters
```

**Modifying Properties**
```typescript
// You can change property values by reassigning them
user.age = 29;           // Change age from 28 to 29
console.log(user.age);   // 29 - updated value
// Object properties are mutable (can be changed)
```

#### Interfaces

```typescript
// An interface defines the STRUCTURE (shape) an object must have
// It's like a contract - objects must follow this blueprint
interface Product {
  id: number;           // Required: must be a number
  name: string;         // Required: must be a string
  price: number;        // Required: must be a number
  inStock: boolean;     // Required: must be a boolean
  description?: string; // Optional: ? means not required
}

// Create an object that follows the Product interface
let laptop: Product = {
  id: 1,
  name: "Laptop",
  price: 999.99,
  inStock: true
  // description omitted - that's OK because it's optional
};
// TypeScript checks that laptop has all required properties with correct types
```
- Defines shape of objects
- Optional properties with `?`
- Enforces type safety

**Readonly Properties**
```typescript
// 'readonly' prevents properties from being changed after creation
interface Point {
  readonly x: number;  // Can only be set during initialization
  readonly y: number;  // Cannot be changed later
}

let point: Point = { x: 10, y: 20 };  // ✅ Setting values during creation
// point.x = 15; // ❌ Error: Cannot assign to 'x' because it is a read-only property
// Readonly ensures coordinates can't be accidentally modified
```

#### Nested Objects

```typescript
// Objects can contain other objects (nested structure)
// Define an Address interface
interface Address {
  street: string;
  city: string;
  zipCode: string;
}

// Employee has an 'address' property that is itself an Address object
interface Employee {
  id: number;
  name: string;
  address: Address;    // This property is an object (nested)
  skills: string[];    // This property is an array
}

// Create an employee with nested address object
let employee: Employee = {
  id: 101,
  name: "Alice Smith",
  address: {           // Nested object - object inside an object
    street: "123 Main St",
    city: "New York",
    zipCode: "10001"
  },
  skills: ["TypeScript", "React", "Node.js"]  // Array of strings
};

// Access nested property using dot notation
console.log(employee.address.city);
// employee.address gets the address object
// .city gets the city property from that object
// Result: "New York"
```

#### Object Methods

```typescript
// Objects can have FUNCTIONS as properties - these are called "methods"
let calculator = {
  value: 0,  // Property to store current value

  // add is a METHOD (function inside an object)
  add(n: number): number {
    this.value += n;      // 'this' refers to the calculator object
    return this.value;    // Return the updated value
  },

  // subtract is another METHOD
  subtract(n: number): number {
    this.value -= n;      // 'this' accesses the object's value property
    return this.value;
  }
};

calculator.add(10);       // value becomes 0 + 10 = 10
calculator.subtract(3);   // value becomes 10 - 3 = 7
// Methods let objects have behaviors, not just data
```
- Methods can access object properties via `this`

#### Object Utility Methods

**Object.keys**
```typescript
let car = { brand: "Toyota", model: "Camry", year: 2023 };

// Object.keys() returns an ARRAY of all property names (keys)
Object.keys(car);    // ["brand", "model", "year"]

// Object.values() returns an ARRAY of all property values
Object.values(car);  // ["Toyota", "Camry", 2023]

// Object.entries() returns an ARRAY of [key, value] pairs
Object.entries(car); // [["brand", "Toyota"], ["model", "Camry"], ["year", 2023]]
// Useful for iterating over objects
```

**Object.assign - Copy/Merge**
```typescript
// Object.assign() copies properties from one or more objects to a target object
// Format: Object.assign(target, ...sources)

// Copy an object: copy all properties from 'car' into a new empty object {}
let copy = Object.assign({}, car);
// Result: { brand: "Toyota", model: "Camry", year: 2023 }

// Merge objects: combine car properties with new properties
let merged = Object.assign({}, car, { color: "blue" });
// Result: { brand: "Toyota", model: "Camry", year: 2023, color: "blue" }
```

**Spread Operator for Objects**
```typescript
// ... (spread operator) "spreads out" object properties
// Modern, cleaner alternative to Object.assign()

// Copy an object
let spreadCopy = { ...car };
// ...car expands to: brand: "Toyota", model: "Camry", year: 2023
// Result: { brand: "Toyota", model: "Camry", year: 2023 }

// Merge and override properties
let spreadMerge = { ...car, color: "red", year: 2024 };
// Spreads car's properties, then adds color and overrides year
// Result: { brand: "Toyota", model: "Camry", year: 2024, color: "red" }
```

#### Destructuring

**Object Destructuring**
```typescript
// Destructuring extracts properties from objects into individual variables
let book = { title: "TypeScript Handbook", author: "Microsoft", year: 2023 };

// Extract title and author properties into variables
let { title, author } = book;
// title = book.title = "TypeScript Handbook"
// author = book.author = "Microsoft"
console.log(title, author); // TypeScript Handbook, Microsoft
// Cleaner than: let title = book.title; let author = book.author;
```

**Destructuring with Renaming**
```typescript
// You can rename variables while destructuring using the syntax: oldName: newName
let { title: bookTitle, year: publicationYear } = book;
// bookTitle = book.title = "TypeScript Handbook"
// publicationYear = book.year = 2023
// Useful when property names conflict with existing variables
```

**Destructuring with Defaults**
```typescript
// Provide default values for properties that might not exist
let { title, edition = 1 } = book;
// title = book.title = "TypeScript Handbook"
// edition = book.edition ?? 1 = 1 (book doesn't have 'edition', so use default)
// Prevents undefined values for missing properties
```

**Array Destructuring**
```typescript
// Destructuring works with arrays too - extracts by POSITION
let colors = ["red", "green", "blue"];
let [first, second] = colors;
// first = colors[0] = "red"
// second = colors[1] = "green"
// "blue" is not extracted (we only asked for 2 variables)
console.log(first, second); // red, green
```

**Rest in Destructuring**
```typescript
// ...rest collects ALL remaining properties into a new object
let { title, ...rest } = book;
// title = "TypeScript Handbook" (extracted separately)
// rest = { author: "Microsoft", year: 2023 } (everything else)
console.log(rest); // { author: "Microsoft", year: 2023 }
// Useful for extracting some properties while keeping the rest together
```

#### Type Aliases vs Interfaces

**Type Alias**
```typescript
// 'type' creates a reusable type definition
// Can define object shapes, unions, primitives, etc.
type Animal = {
  name: string;
  age: number;
};
// Now Animal can be used as a type anywhere
```

**Interface**
```typescript
// 'interface' defines object structure (similar to type for objects)
// Preferred for object shapes, can be extended
interface Vehicle {
  brand: string;
  speed: number;
}
// Interfaces are more traditional for OOP-style code
```

**Extending Interfaces**
```typescript
// Interfaces can be extended to create new interfaces
// ElectricVehicle INHERITS all properties from Vehicle
interface ElectricVehicle extends Vehicle {
  batteryLife: number;  // Plus adds its own property
}
// ElectricVehicle has: brand, speed, AND batteryLife
```

**Intersection Types**
```typescript
// Type aliases can be combined using & (intersection)
type Person = { name: string };
type Contact = { email: string };
type PersonWithContact = Person & Contact;  // Combines both types

// Objects of this type must have BOTH name and email
let contact: PersonWithContact = {
  name: "Alice",
  email: "alice@example.com"
};
// Intersection merges multiple types into one
```

---

### 4. Functions Explained

#### Function Declarations

```typescript
// Traditional function declaration syntax
// function keyword, name, parameters with types, return type
function greet(name: string): string {
  // name: string - parameter must be a string
  // : string - function returns a string
  return `Hello, ${name}!`;  // Return a greeting message
}
// Can be called before it's defined (hoisted)
```
- Traditional function syntax
- Hoisted (can be called before declaration)
- Named function for stack traces

#### Function Expressions

```typescript
// Function assigned to a variable (function expression)
// The function itself is anonymous (no name after 'function' keyword)
const subtract = function(a: number, b: number): number {
  // Takes two numbers as parameters
  return a - b;  // Returns the difference
};
// NOT hoisted - must be defined before use
// subtract is a const variable holding a function
```
- Assigned to a variable
- Not hoisted
- Can be anonymous or named

#### Arrow Functions

**Basic Arrow Function**
```typescript
// Arrow function - modern, concise syntax
// Uses => (arrow) instead of 'function' keyword
const square = (n: number): number => {
  // (n: number) - parameter
  // : number - return type
  // => - arrow indicating function body follows
  return n * n;  // Calculate square
};
// Shorter syntax, lexical 'this' binding
```

**Concise Arrow Function (Implicit Return)**
```typescript
// When function body is a single expression, you can omit {} and 'return'
const cube = (n: number): number => n * n * n;
// No braces {} = implicit return
// The expression n * n * n is automatically returned
// Same as: const cube = (n: number): number => { return n * n * n; };
```
- No braces `{}`: implicit return
- For single expressions

**Returning Objects**
```typescript
// To return an object literal with implicit return, wrap it in parentheses
const createPerson = (name: string, age: number) => ({ name, age });
// ({ name, age }) - parentheses distinguish object from function body braces
// { name, age } is shorthand for { name: name, age: age }
// Without (), TypeScript would think { } is the function body, not an object
```
- Wrap object in parentheses to distinguish from function body

#### Parameters

**Optional Parameters**
```typescript
// The ? makes a parameter optional - caller can omit it
function buildName(firstName: string, lastName?: string): string {
  // firstName is REQUIRED
  // lastName? is OPTIONAL (will be undefined if not provided)
  if (lastName) {
    // If lastName was provided
    return `${firstName} ${lastName}`;
  }
  // If lastName was not provided
  return firstName;
}

buildName("John", "Doe"); // "John Doe" - both parameters provided
buildName("Jane");        // "Jane" - lastName is undefined, only firstName used
```
- Mark with `?`
- Must come after required parameters

**Default Parameters**
```typescript
// = "Hello" provides a default value if parameter is not provided
function greetUser(name: string, greeting: string = "Hello"): string {
  // name - required
  // greeting = "Hello" - optional with default value
  // If greeting is not provided, it defaults to "Hello"
  return `${greeting}, ${name}!`;
}

greetUser("Alice");         // "Hello, Alice!" - greeting uses default "Hello"
greetUser("Bob", "Hi");     // "Hi, Bob!" - greeting is "Hi" (overrides default)
```
- Provides default value if argument not passed

**Rest Parameters**
```typescript
// ...numbers collects ALL arguments into an array
// Allows passing any number of arguments
function sum(...numbers: number[]): number {
  // numbers is an ARRAY containing all passed arguments
  // Use reduce to add all numbers together
  return numbers.reduce((total, n) => total + n, 0);
  // Starting with 0, add each number to the total
}

sum(1, 2, 3);        // numbers = [1, 2, 3] → 6
sum(1, 2, 3, 4, 5);  // numbers = [1, 2, 3, 4, 5] → 15
// Can pass any number of arguments
```
- Collects remaining arguments into array
- Must be last parameter
- Use `...` syntax

#### Function Overloading

```typescript
// Overload signatures - define multiple ways to call the function
function format(value: string): string;   // Can be called with string
function format(value: number): string;   // Can be called with number
function format(value: boolean): string;  // Can be called with boolean

// Implementation signature - the actual function that handles all cases
function format(value: string | number | boolean): string {
  // Check what type was passed and handle accordingly
  if (typeof value === "string") {
    return value.toUpperCase();  // Strings → uppercase
  } else if (typeof value === "number") {
    return value.toFixed(2);     // Numbers → 2 decimal places
  } else {
    return value ? "YES" : "NO";  // Booleans → YES/NO
  }
}

format("hello");  // "HELLO" - uses string overload
format(123.456);  // "123.46" - uses number overload
format(true);     // "YES" - uses boolean overload
```
- Multiple function signatures
- One implementation handling all cases

#### Generic Functions

**Basic Generic**
```typescript
// <T> is a TYPE PARAMETER - a placeholder for any type
// Makes the function work with ANY type while maintaining type safety
function identity<T>(arg: T): T {
  // T can be string, number, boolean, or any other type
  // arg's type is T, and return type is also T (same type in and out)
  return arg;  // Returns the same value that was passed in
}

identity<string>("Hello"); // Explicit: T = string, returns string
identity(42);              // Type inferred: T = number, returns number
// Generic functions are reusable for any type
```
- `<T>` is a type parameter (placeholder)
- Makes function reusable for any type

**Generic with Constraints**
```typescript
// Define what properties T must have
interface HasLength {
  length: number;  // T must have a 'length' property
}

// <T extends HasLength> - T can be any type, BUT it MUST have a length property
function logLength<T extends HasLength>(arg: T): number {
  // Since T extends HasLength, we KNOW arg.length exists
  console.log(arg.length);  // Safe to access .length
  return arg.length;
}

logLength("Hello");      // 5 (string has length) ✅
logLength([1, 2, 3, 4]); // 4 (array has length) ✅
// logLength(42);        // ❌ Error: number doesn't have length property
// Constraints limit T to only types with required properties
```
- `extends` constrains type to those with specific properties

**Multiple Type Parameters**
```typescript
// Functions can have MULTIPLE type parameters (T, U, V, etc.)
// <T, U> means two different type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  // first has type T, second has type U (can be different types)
  // Returns a tuple: [T, U]
  return [first, second];
}

pair<string, number>("age", 25); // T=string, U=number → ["age", 25]
// Useful when you need different types for different parameters
```

#### Callback Functions

```typescript
// A callback is a FUNCTION passed as an ARGUMENT to another function
// callback: (n: number) => number means callback takes a number and returns a number
function processArray(arr: number[], callback: (n: number) => number): number[] {
  // arr - array to process
  // callback - function to apply to each element
  return arr.map(callback);  // Apply callback to each element
}

// Pass an arrow function as the callback
const doubled = processArray([1, 2, 3, 4], n => n * 2);
// callback is: n => n * 2
// Result: [2, 4, 6, 8]
// Callbacks allow functions to be customized with different behaviors
```
- Function passed as argument
- Called by another function

#### Higher-Order Functions

**Function Returning Function**
```typescript
// A higher-order function is a function that RETURNS another function
// Return type: (n: number) => number means it returns a function
function createMultiplier(multiplier: number): (n: number) => number {
  // This function CREATES and RETURNS a new function
  return (n: number) => n * multiplier;
  // The returned function "remembers" the multiplier value (closure)
}

// multiplyBy2 is a FUNCTION (not a number)
const multiplyBy2 = createMultiplier(2);  // Creates function that multiplies by 2
const multiplyBy10 = createMultiplier(10); // Creates function that multiplies by 10

multiplyBy2(5);  // 5 * 2 = 10
multiplyBy10(5); // 5 * 10 = 50
// Each function "remembers" its own multiplier value
```

**Currying**
```typescript
// Currying: breaking a function with multiple parameters into a chain of functions
// Each function takes ONE parameter and returns another function (until the last one)
const curriedAdd = (a: number) => (b: number) => (c: number) => a + b + c;
// Step 1: takes 'a', returns function that takes 'b'
// Step 2: takes 'b', returns function that takes 'c'
// Step 3: takes 'c', returns a + b + c

curriedAdd(1)(2)(3); // Call with (1), then (2), then (3) → 1 + 2 + 3 = 6
// Allows partial application of functions
```
- Transform function with multiple arguments into sequence of functions

#### Function Composition

```typescript
// Function composition: combining multiple functions to create a new function
// Each function's output becomes the next function's input
const addOne = (n: number) => n + 1;
const multiplyByTwo = (n: number) => n * 2;
const subtractThree = (n: number) => n - 3;

// Nested function calls - read from INSIDE OUT
const result = subtractThree(multiplyByTwo(addOne(5)));
// Step 1: addOne(5) = 6
// Step 2: multiplyByTwo(6) = 12
// Step 3: subtractThree(12) = 9
// Final result: 9
```

**Compose Helper**
```typescript
// compose() creates a single function from multiple functions
// ...fns collects all function arguments into an array
function compose<T>(...fns: Array<(arg: T) => T>) {
  // Returns a NEW function that applies all the functions in sequence
  return (value: T): T => {
    // reduceRight applies functions from RIGHT to LEFT
    return fns.reduceRight((acc, fn) => fn(acc), value);
    // Start with 'value', apply last function, then second-to-last, etc.
  };
}

// Create a composed function (not yet executed)
const composed = compose(subtractThree, multiplyByTwo, addOne);
// Order: addOne → multiplyByTwo → subtractThree (right to left)
composed(5); // 5 → addOne(5)=6 → multiplyByTwo(6)=12 → subtractThree(12)=9
```
- Combines multiple functions into one
- Executes right to left

#### Recursion

**Factorial**
```typescript
// Recursion: a function that CALLS ITSELF
function factorial(n: number): number {
  // BASE CASE: stop recursion when n <= 1
  if (n <= 1) return 1;

  // RECURSIVE CASE: call factorial again with n-1
  return n * factorial(n - 1);
  // factorial(5) = 5 * factorial(4)
  //              = 5 * 4 * factorial(3)
  //              = 5 * 4 * 3 * factorial(2)
  //              = 5 * 4 * 3 * 2 * factorial(1)
  //              = 5 * 4 * 3 * 2 * 1 = 120
}

factorial(5); // 120
```
- Function calls itself
- Must have base case to stop recursion

**Fibonacci**
```typescript
// Fibonacci: each number is the sum of the previous two numbers
function fibonacci(n: number): number {
  // BASE CASES: fib(0)=0, fib(1)=1
  if (n <= 1) return n;

  // RECURSIVE CASE: add the two previous fibonacci numbers
  return fibonacci(n - 1) + fibonacci(n - 2);
  // fibonacci(7) = fib(6) + fib(5)
  //              = (fib(5) + fib(4)) + (fib(4) + fib(3))
  //              ... eventually resolves to 13
}

fibonacci(7); // Sequence: 0,1,1,2,3,5,8,13 → 13
```

#### IIFE (Immediately Invoked Function Expression)

```typescript
// IIFE: A function that runs IMMEDIATELY when it's defined
// Wrap function in (), then call it with () at the end
(function() {
  console.log("IIFE executed!");
})();
// ( function() {...} ) defines the function
// () at the end immediately calls it
// Runs as soon as JavaScript reads this line
```
- Executes immediately when defined
- Creates private scope

**With Parameters**
```typescript
// IIFEs can accept parameters
(function(name: string) {
  console.log(`Hello, ${name}`);
})("TypeScript");
// ("TypeScript") passes "TypeScript" as the 'name' parameter
// Immediately logs: "Hello, TypeScript"
```

**Arrow IIFE**
```typescript
// IIFEs work with arrow functions too
(() => {
  console.log("Arrow IIFE");
})();
// Arrow function wrapped in (), then immediately called with ()
```

#### Function Type Annotations

**Type Alias for Function**
```typescript
// Create a reusable type for functions that take 2 numbers and return a number
type MathOperation = (a: number, b: number) => number;

// Both functions must follow the MathOperation type signature
const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
// Type safety: both functions guaranteed to have same signature
```

**Interface for Function**
```typescript
// Interfaces can also define function signatures
interface StringFormatter {
  (str: string): string;  // Function that takes a string, returns a string
}

const uppercase: StringFormatter = (str) => str.toUpperCase();
// uppercase must follow StringFormatter signature
```

#### Practical Examples

**Debounce**
```typescript
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
```
- Delays function execution
- Resets timer on each call
- Useful for search inputs, window resize

**Memoization**
```typescript
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
```
- Caches function results
- Returns cached result for same inputs
- Improves performance for expensive operations

---

### 5. Scope and Best Practices Explained

#### Scope Types

**Global Scope**
```typescript
const globalVariable = "I am global";

function accessGlobal() {
  console.log(globalVariable); // Can access
}
```
- Accessible everywhere
- **Avoid** global variables in real applications

**Function Scope**
```typescript
function functionScopeExample() {
  const functionScoped = "Only in this function";
  console.log(functionScoped); // OK
}
// console.log(functionScoped); // Error: Not defined
```
- Variables only exist within function

**Block Scope**
```typescript
if (true) {
  const blockScoped = "Only in this block";
  console.log(blockScoped); // OK
}
// console.log(blockScoped); // Error: Not defined
```
- `let` and `const` are block-scoped
- Blocks: `if`, `for`, `while`, `{}`, etc.

**Var vs Let/Const Scope**
```typescript
if (true) {
  var functionScopedVar = "I leak out";
}
console.log(functionScopedVar); // OK (but shouldn't be!)
```
- `var` ignores block scope
- Another reason to avoid `var`

#### Variable Hoisting

**Var Hoisting**
```typescript
console.log(hoistedVar); // undefined (not error)
var hoistedVar = "I am hoisted";
```
- Declaration moved to top
- Initialization stays in place

**Let/Const Temporal Dead Zone**
```typescript
// console.log(hoistedLet); // Error: Cannot access before initialization
let hoistedLet = "Not hoisted the same way";
```
- Cannot access before declaration
- Prevents bugs from hoisting

**Function Hoisting**
```typescript
hoistedFunction(); // Works!

function hoistedFunction() {
  console.log("Function declaration hoisted");
}
```
- Function declarations fully hoisted
- Function expressions are not

#### Closures

**Basic Closure**
```typescript
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
counter(); // 1
counter(); // 2
counter(); // 3
```
- Inner function "closes over" outer variables
- `count` persists between calls
- `count` is private

**Closure for Private Variables**
```typescript
function createBankAccount(initialBalance: number) {
  let balance = initialBalance; // Private

  return {
    deposit(amount: number) {
      balance += amount;
    },
    withdraw(amount: number) {
      if (amount <= balance) {
        balance -= amount;
      }
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
account.deposit(50);
// console.log(balance); // Error: balance is private
```
- Emulates private variables
- Only exposed methods can access `balance`

#### This Keyword

**This in Methods**
```typescript
const person = {
  name: "Alice",
  regularFunction: function() {
    console.log(this.name); // Alice
  },
  arrowFunction: () => {
    console.log(this.name); // undefined (arrow has no 'this')
  }
};
```
- Regular functions: `this` refers to object
- Arrow functions: inherit `this` from surrounding scope

**Arrow Functions Preserve This**
```typescript
class Counter {
  private count = 0;

  arrowCallback() {
    setTimeout(() => {
      this.count++; // 'this' refers to Counter instance
      console.log(this.count);
    }, 100);
  }
}
```
- Arrow functions don't have own `this`
- Useful in callbacks

#### Best Practices Summary

**1. Use `const` by Default**
```typescript
const PI = 3.14159;
let radius = 5; // Only use let when reassignment needed
```

**2. Descriptive Names**
```typescript
const userAge = 25; // Good
const a = 25;       // Bad
```

**3. Type Annotations**
```typescript
function calculateArea(width: number, height: number): number {
  return width * height;
}
```

**4. Interfaces for Objects**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}
```

**5. Enums for Constants**
```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}
```

**6. Optional Chaining and Nullish Coalescing**
```typescript
const port = config.server?.port ?? 3000;
```

**7. Readonly Properties**
```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}
```

**8. Union Types**
```typescript
type ID = string | number;
```

**9. Type Guards**
```typescript
if (typeof value === "string") {
  console.log(value.length); // TypeScript knows it's a string
}
```

**10. Avoid `any`**
```typescript
// Bad: let data: any = getData();
// Good: let data: User = getData();
```

#### Error Handling

**Try-Catch-Finally**
```typescript
function divide(a: number, b: number): number {
  try {
    if (b === 0) {
      throw new Error("Division by zero");
    }
    return a / b;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error:", error.message);
    }
    return 0;
  } finally {
    console.log("Finally always executes");
  }
}
```
- `try`: Code that might throw error
- `catch`: Handle error
- `finally`: Always executes (cleanup)

**Custom Errors**
```typescript
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

throw new ValidationError("Age cannot be negative");
```

#### Naming Conventions

```typescript
// camelCase: variables, functions
const firstName = "John";
function calculateTotal() {}

// PascalCase: classes, interfaces
class UserAccount {}
interface UserProfile {}

// UPPER_SNAKE_CASE: constants
const MAX_RETRIES = 3;
const API_ENDPOINT = "https://api.example.com";

// _prefix: private (by convention)
class BankAccount {
  private _balance: number;
}
```

#### Code Organization

**Namespaces**
```typescript
namespace MathUtils {
  export function add(a: number, b: number) {
    return a + b;
  }
}

MathUtils.add(5, 3);
```

**Classes for Encapsulation**
```typescript
class Calculator {
  private result = 0;

  add(n: number): this {
    this.result += n;
    return this; // Method chaining
  }

  getResult(): number {
    return this.result;
  }
}

new Calculator().add(5).add(3).getResult(); // 8
```

#### Performance Tips

1. **Cache array length in loops**
```typescript
const length = array.length;
for (let i = 0; i < length; i++) {}
```

2. **Use `const` for functions**
```typescript
const multiply = (a: number, b: number) => a * b;
```

3. **Avoid nested loops**
```typescript
// Use map/filter/reduce instead
const products = numbers1.flatMap(n1 =>
  numbers2.map(n2 => n1 * n2)
);
```

---

## Summary

You now have a complete TypeScript learning environment with:
- ✅ Node.js and npm installed
- ✅ Visual Studio Code set up
- ✅ All dependencies installed
- ✅ 5 comprehensive example files
- ✅ Easy-to-run npm scripts
- ✅ Detailed code explanations

Start learning by running:
```bash
npm run dev
```

Happy coding! 🎉
