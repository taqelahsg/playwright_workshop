/**
 * SCOPE MANAGEMENT AND BEST PRACTICES
 *
 * This file demonstrates:
 * - Global, function, and block scope
 * - Variable hoisting
 * - Closures
 * - this keyword and context
 * - const vs let vs var
 * - Best practices for TypeScript
 * - Code organization
 * - Naming conventions
 * - Error handling
 */

console.log("=== SCOPE MANAGEMENT AND BEST PRACTICES ===\n");

// ==========================================
// GLOBAL SCOPE
// ==========================================

console.log("=== GLOBAL SCOPE ===\n");

// Global variable (avoid in real applications)
const globalVariable: string = "I am global";

function accessGlobal(): void {
  console.log("1. Accessing global:", globalVariable);
}

accessGlobal();

console.log("\n");

// ==========================================
// FUNCTION SCOPE
// ==========================================

console.log("=== FUNCTION SCOPE ===\n");

function functionScopeExample(): void {
  const functionScoped: string = "I exist only in this function";
  console.log("2. Inside function:", functionScoped);
}

functionScopeExample();
// console.log(functionScoped); // Error: Cannot find name 'functionScoped'

// Nested function scope
function outerFunction(): void {
  const outerVariable: string = "outer";

  function innerFunction(): void {
    const innerVariable: string = "inner";
    console.log("3. Inner can access outer:", outerVariable);
    console.log("4. Inner variable:", innerVariable);
  }

  innerFunction();
  // console.log(innerVariable); // Error: Cannot find name 'innerVariable'
}

outerFunction();

console.log("\n");

// ==========================================
// BLOCK SCOPE
// ==========================================

console.log("=== BLOCK SCOPE ===\n");

// let and const are block-scoped
if (true) {
  const blockScoped: string = "I exist only in this block";
  let alsoBlockScoped: number = 42;
  console.log("5. Inside block:", blockScoped, alsoBlockScoped);
}
// console.log(blockScoped); // Error: Cannot find name 'blockScoped'

// Block scope in loops
for (let i: number = 0; i < 3; i++) {
  const loopVariable: string = `Iteration ${i}`;
  console.log("6.", loopVariable);
}
// console.log(i); // Error: Cannot find name 'i'

// var is function-scoped, not block-scoped (avoid using var)
if (true) {
  var functionScopedVar: string = "I leak out of the block";
}
console.log("7. Var leaks:", functionScopedVar); // This works (but shouldn't)

console.log("\n");

// ==========================================
// VARIABLE HOISTING
// ==========================================

console.log("=== VARIABLE HOISTING ===\n");

// var declarations are hoisted
console.log("8. Hoisted var:", typeof hoistedVar); // undefined (not error)
var hoistedVar: string = "I am hoisted";
console.log("9. Hoisted var after:", hoistedVar);

// let and const are in temporal dead zone before declaration
// console.log(hoistedLet); // Error: Cannot access before initialization
let hoistedLet: string = "Not hoisted the same way";
console.log("10. Let after declaration:", hoistedLet);

// Function declarations are fully hoisted
hoistedFunction(); // Works before declaration

function hoistedFunction(): void {
  console.log("11. Function declaration hoisted");
}

// Function expressions are not hoisted
// hoistedExpression(); // Error: Cannot access before initialization
const hoistedExpression = function(): void {
  console.log("Function expression not hoisted");
};

console.log("\n");

// ==========================================
// CLOSURES
// ==========================================

console.log("=== CLOSURES ===\n");

// Basic closure
function createCounter(): () => number {
  let count: number = 0;
  return function(): number {
    count++;
    return count;
  };
}

const counter1 = createCounter();
console.log("12. Counter:", counter1()); // 1
console.log("13. Counter:", counter1()); // 2
console.log("14. Counter:", counter1()); // 3

const counter2 = createCounter();
console.log("15. New counter:", counter2()); // 1 (separate closure)

// Closure with private variables
function createBankAccount(initialBalance: number) {
  let balance: number = initialBalance;

  return {
    deposit(amount: number): void {
      balance += amount;
      console.log(`16. Deposited $${amount}. Balance: $${balance}`);
    },
    withdraw(amount: number): void {
      if (amount <= balance) {
        balance -= amount;
        console.log(`17. Withdrew $${amount}. Balance: $${balance}`);
      } else {
        console.log("17. Insufficient funds");
      }
    },
    getBalance(): number {
      return balance;
    }
  };
}

const account = createBankAccount(100);
account.deposit(50);
account.withdraw(30);
console.log("18. Current balance:", account.getBalance());
// console.log(balance); // Error: balance is private

// Closure in loops (common pitfall with var)
console.log("19. Closure with let (correct):");
for (let i: number = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(`   Let: ${i}`);
  }, 10);
}

console.log("\n");

// ==========================================
// THIS KEYWORD AND CONTEXT
// ==========================================

console.log("=== THIS KEYWORD ===\n");

// this in object methods
const person = {
  name: "Alice",
  regularFunction: function(): void {
    console.log("20. Regular function this:", this.name);
  },
  arrowFunction: (): void => {
    // Arrow functions don't have their own 'this'
    console.log("21. Arrow function this: (no own this)");
  }
};

person.regularFunction(); // Works
person.arrowFunction(); // this is undefined or global

// this with explicit binding
function greet(this: { name: string }, greeting: string): void {
  console.log(`22. ${greeting}, ${this.name}!`);
}

const user = { name: "Bob" };
greet.call(user, "Hello"); // Explicitly set this

// Arrow function preserves outer this
class Counter {
  private count: number = 0;

  increment(): void {
    this.count++;
  }

  // Regular function loses this context
  regularCallback(): void {
    setTimeout(function() {
      // this.count++; // Error: 'this' is undefined
    }, 10);
  }

  // Arrow function preserves this
  arrowCallback(): void {
    setTimeout(() => {
      this.count++;
      console.log("23. Arrow preserves this:", this.count);
    }, 20);
  }
}

const counter = new Counter();
counter.increment();
counter.arrowCallback();

console.log("\n");

// ==========================================
// CONST VS LET VS VAR
// ==========================================

console.log("=== CONST VS LET VS VAR ===\n");

// const - cannot reassign (but can mutate objects/arrays)
const constantPrimitive: number = 42;
// constantPrimitive = 43; // Error: Cannot assign to const

const constantObject = { value: 42 };
constantObject.value = 43; // OK - mutating property
console.log("24. Mutated const object:", constantObject.value);
// constantObject = { value: 44 }; // Error: Cannot reassign

const constantArray: number[] = [1, 2, 3];
constantArray.push(4); // OK - mutating array
console.log("25. Mutated const array:", constantArray);
// constantArray = [5, 6, 7]; // Error: Cannot reassign

// let - can reassign
let mutableVariable: number = 10;
mutableVariable = 20;
console.log("26. Reassigned let:", mutableVariable);

// var - avoid in modern TypeScript (function-scoped, hoisted)
var oldStyle: string = "Avoid using var";
console.log("27. Var (avoid):", oldStyle);

console.log("\n");

// ==========================================
// BEST PRACTICES
// ==========================================

console.log("=== BEST PRACTICES ===\n");

// 1. Use const by default, let when reassignment needed
const PI: number = 3.14159; // Won't change
let radius: number = 5; // Might change
console.log("28. Prefer const:", PI * radius * radius);

// 2. Use descriptive variable names
const userAge: number = 25; // Good
const a: number = 25; // Bad

// 3. Use type annotations for clarity
function calculateArea(width: number, height: number): number {
  return width * height;
}
console.log("29. Type annotations:", calculateArea(5, 10));

// 4. Use interfaces for object shapes
interface User {
  id: number;
  name: string;
  email: string;
}

const user1: User = {
  id: 1,
  name: "John",
  email: "john@example.com"
};
console.log("30. Interface:", user1.name);

// 5. Use enums for constants
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

function move(direction: Direction): void {
  console.log("31. Moving:", direction);
}

move(Direction.Up);

// 6. Use optional chaining and nullish coalescing
interface Config {
  server?: {
    port?: number;
  };
}

const config: Config = {};
const port: number = config.server?.port ?? 3000;
console.log("32. Optional chaining:", port);

// 7. Use readonly for immutability
interface Point {
  readonly x: number;
  readonly y: number;
}

const point: Point = { x: 10, y: 20 };
// point.x = 15; // Error: Cannot assign to readonly property
console.log("33. Readonly:", point);

// 8. Use union types for multiple possible types
type ID = string | number;
function printID(id: ID): void {
  console.log("34. Union type ID:", id);
}

printID(123);
printID("ABC");

// 9. Use type guards for narrowing
function processValue(value: string | number): void {
  if (typeof value === "string") {
    console.log("35. String length:", value.length);
  } else {
    console.log("36. Number squared:", value * value);
  }
}

processValue("hello");
processValue(5);

// 10. Avoid 'any' type
// Bad: let data: any = getData();
// Good: let data: User = getData();

console.log("\n");

// ==========================================
// ERROR HANDLING
// ==========================================

console.log("=== ERROR HANDLING ===\n");

// Try-catch for error handling
function divide(a: number, b: number): number {
  try {
    if (b === 0) {
      throw new Error("Division by zero");
    }
    return a / b;
  } catch (error) {
    if (error instanceof Error) {
      console.log("37. Error caught:", error.message);
    }
    return 0;
  } finally {
    console.log("38. Finally always executes");
  }
}

divide(10, 0);

// Custom error types
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateAge(age: number): void {
  try {
    if (age < 0) {
      throw new ValidationError("Age cannot be negative");
    }
    console.log("39. Valid age:", age);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log("40. Validation error:", error.message);
    }
  }
}

validateAge(-5);
validateAge(25);

console.log("\n");

// ==========================================
// NAMING CONVENTIONS
// ==========================================

console.log("=== NAMING CONVENTIONS ===\n");

// camelCase for variables and functions
const firstName: string = "John";
function calculateTotal(price: number, tax: number): number {
  return price + tax;
}
console.log("41. camelCase:", firstName, calculateTotal(100, 10));

// PascalCase for classes and interfaces
class UserAccount {
  constructor(public username: string) {}
}

interface UserProfile {
  username: string;
  email: string;
}

console.log("42. PascalCase:", new UserAccount("alice").username);

// UPPER_SNAKE_CASE for constants
const MAX_RETRIES: number = 3;
const API_ENDPOINT: string = "https://api.example.com";
console.log("43. Constants:", MAX_RETRIES, API_ENDPOINT);

// Prefix with _ for private (by convention)
class BankAccount {
  private _balance: number;

  constructor(initialBalance: number) {
    this._balance = initialBalance;
  }

  getBalance(): number {
    return this._balance;
  }
}

console.log("44. Private prefix:", new BankAccount(1000).getBalance());

console.log("\n");

// ==========================================
// CODE ORGANIZATION
// ==========================================

console.log("=== CODE ORGANIZATION ===\n");

// Use modules for organization (in real projects)
// export function utility() { ... }
// import { utility } from './utils';

// Group related functionality
namespace MathUtils {
  export function add(a: number, b: number): number {
    return a + b;
  }

  export function multiply(a: number, b: number): number {
    return a * b;
  }
}

console.log("45. Namespace:", MathUtils.add(5, 3));

// Use classes for encapsulation
class Calculator {
  private result: number = 0;

  add(n: number): this {
    this.result += n;
    return this; // Method chaining
  }

  multiply(n: number): this {
    this.result *= n;
    return this;
  }

  getResult(): number {
    return this.result;
  }
}

const calc = new Calculator();
console.log("46. Method chaining:", calc.add(5).multiply(3).getResult());

console.log("\n");

// ==========================================
// PERFORMANCE BEST PRACTICES
// ==========================================

console.log("=== PERFORMANCE BEST PRACTICES ===\n");

// Cache values instead of recalculating
const expensiveArray: number[] = Array.from({ length: 1000 }, (_, i) => i);
const arrayLength: number = expensiveArray.length; // Cache length

for (let i: number = 0; i < arrayLength; i++) {
  // Use cached length instead of expensiveArray.length
}
console.log("47. Cache array length for loops");

// Use const for functions that don't reassign
const multiply3 = (a: number, b: number): number => a * b;
console.log("48. Const for functions:", multiply3(4, 5));

// Avoid nested loops when possible
const numbers1: number[] = [1, 2, 3];
const numbers2: number[] = [4, 5, 6];

// Use map/filter instead of nested loops
const products = numbers1.flatMap(n1 =>
  numbers2.map(n2 => n1 * n2)
);
console.log("49. Avoid nested loops:", products.slice(0, 3));

console.log("\n");

// ==========================================
// SUMMARY OF BEST PRACTICES
// ==========================================

console.log("=== SUMMARY OF BEST PRACTICES ===\n");
console.log("1. Use 'const' by default, 'let' when needed, never 'var'");
console.log("2. Use descriptive variable and function names");
console.log("3. Add type annotations for clarity");
console.log("4. Use interfaces for object shapes");
console.log("5. Use enums for related constants");
console.log("6. Use optional chaining (?.) and nullish coalescing (??)");
console.log("7. Use readonly for immutable properties");
console.log("8. Use union types for flexible types");
console.log("9. Avoid 'any' type - use specific types");
console.log("10. Use proper error handling with try-catch");
console.log("11. Follow naming conventions (camelCase, PascalCase, etc.)");
console.log("12. Organize code with modules and namespaces");
console.log("13. Use closures for encapsulation");
console.log("14. Understand scope (block, function, global)");
console.log("15. Use arrow functions to preserve 'this' context");

console.log("\n=== END OF SCOPE AND BEST PRACTICES ===");
