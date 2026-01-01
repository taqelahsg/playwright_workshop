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

## Detailed Code Explanations

This section provides in-depth explanations of all code examples in the tutorial.

### 1. Variables and Data Types Explained

#### Variable Declarations (let, const, var)

**Example: Using `let`**
```typescript
let username: string = "Alice";
username = "Bob"; // OK - can reassign
```
- `let` declares a **block-scoped** variable that can be reassigned
- Only exists within the `{ }` block where it's defined
- Cannot be redeclared in the same scope
- Best used for values that change (loop counters, accumulators)

**Example: Using `const`**
```typescript
const PI: number = 3.14159;
// PI = 3.14; // Error: Cannot assign to 'PI' because it is a constant
```
- `const` declares a **block-scoped** constant that cannot be reassigned
- Must be initialized when declared
- **IMPORTANT:** For objects/arrays, the reference is constant but contents can be modified
- Default choice for most declarations

**Example: `const` with Objects**
```typescript
const userProfile = { name: "Alice", age: 30 };
userProfile.age = 31; // OK - can modify object properties
// userProfile = { name: "Bob", age: 25 }; // Error: Cannot reassign const variable
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
function printId(id: string | number): void {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // TypeScript knows it's a string
  } else {
    console.log(id.toFixed(2));    // TypeScript knows it's a number
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
scores.forEach((score, index) => {
  console.log(`Index ${index}: ${score}`);
});
```
- Cannot return value or break loop
- Use for side effects (logging, updating external state)

**map - Transform Each Element**
```typescript
let doubled = scores.map(score => score * 2);
// [170, 184, 156, 180, 176]
```
- Returns **new array** with transformed values
- Original array unchanged

**filter - Keep Matching Elements**
```typescript
let highScores = scores.filter(score => score >= 85);
// [85, 92, 90, 88]
```
- Returns **new array** with elements passing test
- Original array unchanged

**reduce - Reduce to Single Value**
```typescript
let total = scores.reduce((sum, score) => sum + score, 0);
// sum starts at 0, adds each score
// Result: 433
```
- Format: `reduce((accumulator, currentValue) => newAccumulator, initialValue)`
- Powerful for summing, counting, grouping, etc.

**some and every**
```typescript
let hasFailingGrade = scores.some(score => score < 60);  // false
let allPassing = scores.every(score => score >= 60);     // true
```
- `some`: Returns true if **any** element matches
- `every`: Returns true if **all** elements match

#### Array Sorting

```typescript
let unsorted = [5, 2, 8, 1, 9];

// Ascending
let sorted = [...unsorted].sort((a, b) => a - b);
// [1, 2, 5, 8, 9]

// Descending
let sortedDesc = [...unsorted].sort((a, b) => b - a);
// [9, 8, 5, 2, 1]
```
- **Important:** `sort()` modifies original array
- Use spread operator `[...array]` to create copy first
- For numbers, **must provide compare function** (otherwise sorts as strings)

**String Sorting**
```typescript
let words = ["banana", "apple", "cherry"];
words.sort(); // ["apple", "banana", "cherry"]
```

#### Array Joining and Combining

**join - Array to String**
```typescript
let letters = ["a", "b", "c"];
let joined = letters.join("-"); // "a-b-c"
```

**concat - Combine Arrays**
```typescript
let arr1 = ["a", "b"];
let arr2 = ["c", "d"];
let combined = arr1.concat(arr2); // ["a", "b", "c", "d"]
```

**Spread Operator**
```typescript
let spreadCombined = [...arr1, ...arr2]; // ["a", "b", "c", "d"]
```

#### Multi-Dimensional Arrays

**2D Array (Matrix)**
```typescript
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

console.log(matrix[1][2]); // 6 (row 1, column 2)
```

**3D Array**
```typescript
let cube: number[][][] = [
  [[1, 2], [3, 4]],
  [[5, 6], [7, 8]]
];
console.log(cube[1][0][1]); // 6
```

#### Tuples

**Fixed-Length Typed Arrays**
```typescript
let person: [string, number, boolean] = ["Alice", 30, true];
//           [name,   age,    active]
```
- Fixed number of elements
- Each position has specific type
- Order matters

**Destructuring Tuples**
```typescript
let [name, age, isActive] = person;
console.log(name, age, isActive); // Alice, 30, true
```

**Optional Elements**
```typescript
let optionalTuple: [string, number?] = ["Bob"];
// Second element is optional
```

**Rest Elements**
```typescript
let restTuple: [string, ...number[]] = ["scores", 85, 90, 92, 88];
// First is string, rest are numbers
```

**Readonly Tuples**
```typescript
let readonlyTuple: readonly [string, number] = ["Charlie", 25];
// readonlyTuple[0] = "Dave"; // Error: Cannot modify
```

#### Objects

**Object Literals**
```typescript
let user = {
  name: "John Doe",
  age: 28,
  email: "john@example.com"
};
```

**Accessing Properties**
```typescript
console.log(user.name);     // Dot notation
console.log(user["email"]); // Bracket notation (for dynamic keys)
```

**Modifying Properties**
```typescript
user.age = 29;
console.log(user.age); // 29
```

#### Interfaces

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  description?: string; // Optional property
}

let laptop: Product = {
  id: 1,
  name: "Laptop",
  price: 999.99,
  inStock: true
  // description omitted (optional)
};
```
- Defines shape of objects
- Optional properties with `?`
- Enforces type safety

**Readonly Properties**
```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

let point: Point = { x: 10, y: 20 };
// point.x = 15; // Error: Cannot assign to readonly property
```

#### Nested Objects

```typescript
interface Address {
  street: string;
  city: string;
  zipCode: string;
}

interface Employee {
  id: number;
  name: string;
  address: Address;
  skills: string[];
}

let employee: Employee = {
  id: 101,
  name: "Alice Smith",
  address: {
    street: "123 Main St",
    city: "New York",
    zipCode: "10001"
  },
  skills: ["TypeScript", "React", "Node.js"]
};

console.log(employee.address.city); // New York
```

#### Object Methods

```typescript
let calculator = {
  value: 0,
  add(n: number): number {
    this.value += n;
    return this.value;
  },
  subtract(n: number): number {
    this.value -= n;
    return this.value;
  }
};

calculator.add(10);  // 10
calculator.subtract(3); // 7
```
- Methods can access object properties via `this`

#### Object Utility Methods

**Object.keys**
```typescript
let car = { brand: "Toyota", model: "Camry", year: 2023 };

Object.keys(car);    // ["brand", "model", "year"]
Object.values(car);  // ["Toyota", "Camry", 2023]
Object.entries(car); // [["brand", "Toyota"], ["model", "Camry"], ["year", 2023]]
```

**Object.assign - Copy/Merge**
```typescript
let copy = Object.assign({}, car);
let merged = Object.assign({}, car, { color: "blue" });
```

**Spread Operator for Objects**
```typescript
let spreadCopy = { ...car };
let spreadMerge = { ...car, color: "red", year: 2024 };
```

#### Destructuring

**Object Destructuring**
```typescript
let book = { title: "TypeScript Handbook", author: "Microsoft", year: 2023 };

let { title, author } = book;
console.log(title, author); // TypeScript Handbook, Microsoft
```

**Destructuring with Renaming**
```typescript
let { title: bookTitle, year: publicationYear } = book;
```

**Destructuring with Defaults**
```typescript
let { title, edition = 1 } = book; // edition defaults to 1 if not present
```

**Array Destructuring**
```typescript
let colors = ["red", "green", "blue"];
let [first, second] = colors;
console.log(first, second); // red, green
```

**Rest in Destructuring**
```typescript
let { title, ...rest } = book;
console.log(rest); // { author: "Microsoft", year: 2023 }
```

#### Type Aliases vs Interfaces

**Type Alias**
```typescript
type Animal = {
  name: string;
  age: number;
};
```

**Interface**
```typescript
interface Vehicle {
  brand: string;
  speed: number;
}
```

**Extending Interfaces**
```typescript
interface ElectricVehicle extends Vehicle {
  batteryLife: number;
}
```

**Intersection Types**
```typescript
type Person = { name: string };
type Contact = { email: string };
type PersonWithContact = Person & Contact;

let contact: PersonWithContact = {
  name: "Alice",
  email: "alice@example.com"
};
```

---

### 4. Functions Explained

#### Function Declarations

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```
- Traditional function syntax
- Hoisted (can be called before declaration)
- Named function for stack traces

#### Function Expressions

```typescript
const subtract = function(a: number, b: number): number {
  return a - b;
};
```
- Assigned to a variable
- Not hoisted
- Can be anonymous or named

#### Arrow Functions

**Basic Arrow Function**
```typescript
const square = (n: number): number => {
  return n * n;
};
```

**Concise Arrow Function (Implicit Return)**
```typescript
const cube = (n: number): number => n * n * n;
```
- No braces `{}`: implicit return
- For single expressions

**Returning Objects**
```typescript
const createPerson = (name: string, age: number) => ({ name, age });
```
- Wrap object in parentheses to distinguish from function body

#### Parameters

**Optional Parameters**
```typescript
function buildName(firstName: string, lastName?: string): string {
  if (lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName;
}

buildName("John", "Doe"); // John Doe
buildName("Jane");        // Jane
```
- Mark with `?`
- Must come after required parameters

**Default Parameters**
```typescript
function greetUser(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

greetUser("Alice");         // Hello, Alice!
greetUser("Bob", "Hi");     // Hi, Bob!
```
- Provides default value if argument not passed

**Rest Parameters**
```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3);        // 6
sum(1, 2, 3, 4, 5);  // 15
```
- Collects remaining arguments into array
- Must be last parameter
- Use `...` syntax

#### Function Overloading

```typescript
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;

function format(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value.toFixed(2);
  } else {
    return value ? "YES" : "NO";
  }
}

format("hello");  // HELLO
format(123.456);  // 123.46
format(true);     // YES
```
- Multiple function signatures
- One implementation handling all cases

#### Generic Functions

**Basic Generic**
```typescript
function identity<T>(arg: T): T {
  return arg;
}

identity<string>("Hello"); // Explicit type
identity(42);              // Type inferred
```
- `<T>` is a type parameter (placeholder)
- Makes function reusable for any type

**Generic with Constraints**
```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): number {
  console.log(arg.length);
  return arg.length;
}

logLength("Hello");      // 5 (string has length)
logLength([1, 2, 3, 4]); // 4 (array has length)
// logLength(42);        // Error: number doesn't have length
```
- `extends` constrains type to those with specific properties

**Multiple Type Parameters**
```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

pair<string, number>("age", 25); // ["age", 25]
```

#### Callback Functions

```typescript
function processArray(arr: number[], callback: (n: number) => number): number[] {
  return arr.map(callback);
}

const doubled = processArray([1, 2, 3, 4], n => n * 2);
// [2, 4, 6, 8]
```
- Function passed as argument
- Called by another function

#### Higher-Order Functions

**Function Returning Function**
```typescript
function createMultiplier(multiplier: number): (n: number) => number {
  return (n: number) => n * multiplier;
}

const multiplyBy2 = createMultiplier(2);
const multiplyBy10 = createMultiplier(10);

multiplyBy2(5);  // 10
multiplyBy10(5); // 50
```

**Currying**
```typescript
const curriedAdd = (a: number) => (b: number) => (c: number) => a + b + c;

curriedAdd(1)(2)(3); // 6
```
- Transform function with multiple arguments into sequence of functions

#### Function Composition

```typescript
const addOne = (n: number) => n + 1;
const multiplyByTwo = (n: number) => n * 2;
const subtractThree = (n: number) => n - 3;

const result = subtractThree(multiplyByTwo(addOne(5)));
// (5 + 1) * 2 - 3 = 9
```

**Compose Helper**
```typescript
function compose<T>(...fns: Array<(arg: T) => T>) {
  return (value: T): T => {
    return fns.reduceRight((acc, fn) => fn(acc), value);
  };
}

const composed = compose(subtractThree, multiplyByTwo, addOne);
composed(5); // 9
```
- Combines multiple functions into one
- Executes right to left

#### Recursion

**Factorial**
```typescript
function factorial(n: number): number {
  if (n <= 1) return 1;        // Base case
  return n * factorial(n - 1); // Recursive case
}

factorial(5); // 5 * 4 * 3 * 2 * 1 = 120
```
- Function calls itself
- Must have base case to stop recursion

**Fibonacci**
```typescript
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

fibonacci(7); // 13
```

#### IIFE (Immediately Invoked Function Expression)

```typescript
(function() {
  console.log("IIFE executed!");
})();
```
- Executes immediately when defined
- Creates private scope

**With Parameters**
```typescript
(function(name: string) {
  console.log(`Hello, ${name}`);
})("TypeScript");
```

**Arrow IIFE**
```typescript
(() => {
  console.log("Arrow IIFE");
})();
```

#### Function Type Annotations

**Type Alias for Function**
```typescript
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
```

**Interface for Function**
```typescript
interface StringFormatter {
  (str: string): string;
}

const uppercase: StringFormatter = (str) => str.toUpperCase();
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
