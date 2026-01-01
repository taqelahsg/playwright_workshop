/**
 * FUNCTIONS
 *
 * This file demonstrates:
 * - Function declarations and expressions
 * - Arrow functions
 * - Function parameters (required, optional, default, rest)
 * - Return types
 * - Function overloading
 * - Generic functions
 * - Callback functions
 * - Higher-order functions
 * - Immediately Invoked Function Expressions (IIFE)
 */

console.log("=== FUNCTIONS ===\n");

// ==========================================
// FUNCTION DECLARATIONS
// ==========================================

console.log("=== FUNCTION DECLARATIONS ===\n");

// Basic function declaration
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log("1. Function declaration:", greet("Alice"));

// Function with multiple parameters
function add(a: number, b: number): number {
  return a + b;
}

console.log("2. Add function:", add(5, 3));

// Function with no return value (void)
function logMessage(message: string): void {
  console.log("3. Log message:", message);
}

logMessage("This is a void function");

// Function with explicit return type
function multiply(a: number, b: number): number {
  return a * b;
}

console.log("4. Multiply:", multiply(4, 5));

console.log("\n");

// ==========================================
// FUNCTION EXPRESSIONS
// ==========================================

console.log("=== FUNCTION EXPRESSIONS ===\n");

// Anonymous function expression
const subtract = function(a: number, b: number): number {
  return a - b;
};

console.log("5. Function expression:", subtract(10, 4));

// Named function expression
const divide = function divideNumbers(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
};

console.log("6. Named function expression:", divide(20, 4));

console.log("\n");

// ==========================================
// ARROW FUNCTIONS
// ==========================================

console.log("=== ARROW FUNCTIONS ===\n");

// Basic arrow function
const square = (n: number): number => {
  return n * n;
};

console.log("7. Arrow function:", square(5));

// Concise arrow function (implicit return)
const cube = (n: number): number => n * n * n;

console.log("8. Concise arrow:", cube(3));

// Arrow function with no parameters
const getRandomNumber = (): number => Math.random();

console.log("9. No params arrow:", getRandomNumber());

// Arrow function with multiple parameters
const fullName = (first: string, last: string): string => `${first} ${last}`;

console.log("10. Multiple params:", fullName("John", "Doe"));

// Arrow function returning object (needs parentheses)
const createPerson = (name: string, age: number) => ({ name, age });

console.log("11. Returning object:", createPerson("Alice", 30));

console.log("\n");

// ==========================================
// OPTIONAL PARAMETERS
// ==========================================

console.log("=== OPTIONAL PARAMETERS ===\n");

// Optional parameter with ?
function buildName(firstName: string, lastName?: string): string {
  if (lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName;
}

console.log("12. With last name:", buildName("John", "Doe"));
console.log("13. Without last name:", buildName("Jane"));

// Optional with union type
function printId(id: string | number | undefined): void {
  if (id) {
    console.log("14. ID:", id);
  } else {
    console.log("14. No ID provided");
  }
}

printId(123);
printId(undefined);

console.log("\n");

// ==========================================
// DEFAULT PARAMETERS
// ==========================================

console.log("=== DEFAULT PARAMETERS ===\n");

// Default parameter values
function greetUser(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

console.log("15. With default:", greetUser("Alice"));
console.log("16. Override default:", greetUser("Bob", "Hi"));

// Multiple defaults
function createUser(
  name: string,
  age: number = 18,
  role: string = "user"
): object {
  return { name, age, role };
}

console.log("17. All defaults:", createUser("Charlie"));
console.log("18. Some defaults:", createUser("Dave", 25));
console.log("19. No defaults:", createUser("Eve", 30, "admin"));

console.log("\n");

// ==========================================
// REST PARAMETERS
// ==========================================

console.log("=== REST PARAMETERS ===\n");

// Rest parameters collect remaining arguments
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log("20. Sum of 1,2,3:", sum(1, 2, 3));
console.log("21. Sum of 1,2,3,4,5:", sum(1, 2, 3, 4, 5));

// Rest with other parameters
function multiply2(multiplier: number, ...numbers: number[]): number[] {
  return numbers.map(n => n * multiplier);
}

console.log("22. Multiply by 2:", multiply2(2, 1, 2, 3, 4, 5));

// Gathering remaining arguments
function logInfo(prefix: string, ...messages: string[]): void {
  messages.forEach(msg => console.log(`23. ${prefix}: ${msg}`));
}

logInfo("INFO", "Server started", "Port 3000", "Ready");

console.log("\n");

// ==========================================
// FUNCTION OVERLOADING
// ==========================================

console.log("=== FUNCTION OVERLOADING ===\n");

// Overload signatures
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;

// Implementation
function format(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value.toFixed(2);
  } else {
    return value ? "YES" : "NO";
  }
}

console.log("24. Format string:", format("hello"));
console.log("25. Format number:", format(123.456));
console.log("26. Format boolean:", format(true));

console.log("\n");

// ==========================================
// GENERIC FUNCTIONS
// ==========================================

console.log("=== GENERIC FUNCTIONS ===\n");

// Basic generic function
function identity<T>(arg: T): T {
  return arg;
}

console.log("27. Generic string:", identity<string>("Hello"));
console.log("28. Generic number:", identity<number>(42));

// Generic with type inference
console.log("29. Type inference:", identity(true));

// Generic array function
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

console.log("30. First element:", getFirstElement([1, 2, 3]));
console.log("31. First element:", getFirstElement(["a", "b", "c"]));

// Generic with constraints
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): number {
  console.log("32. Length:", arg.length);
  return arg.length;
}

logLength("Hello");
logLength([1, 2, 3, 4, 5]);

// Generic with multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

console.log("33. Pair:", pair<string, number>("age", 25));

console.log("\n");

// ==========================================
// CALLBACK FUNCTIONS
// ==========================================

console.log("=== CALLBACK FUNCTIONS ===\n");

// Function accepting callback
function processArray(arr: number[], callback: (n: number) => number): number[] {
  return arr.map(callback);
}

const doubled = processArray([1, 2, 3, 4], n => n * 2);
console.log("34. Doubled:", doubled);

const squared = processArray([1, 2, 3, 4], n => n * n);
console.log("35. Squared:", squared);

// Callback with multiple parameters
function calculate(
  a: number,
  b: number,
  operation: (x: number, y: number) => number
): number {
  return operation(a, b);
}

console.log("36. Add:", calculate(10, 5, (x, y) => x + y));
console.log("37. Multiply:", calculate(10, 5, (x, y) => x * y));

console.log("\n");

// ==========================================
// HIGHER-ORDER FUNCTIONS
// ==========================================

console.log("=== HIGHER-ORDER FUNCTIONS ===\n");

// Function returning a function
function createMultiplier(multiplier: number): (n: number) => number {
  return (n: number) => n * multiplier;
}

const multiplyBy2 = createMultiplier(2);
const multiplyBy10 = createMultiplier(10);

console.log("38. Multiply by 2:", multiplyBy2(5));
console.log("39. Multiply by 10:", multiplyBy10(5));

// Currying
function curry(a: number) {
  return function(b: number) {
    return function(c: number) {
      return a + b + c;
    };
  };
}

console.log("40. Curried:", curry(1)(2)(3));

// Arrow function currying
const curriedAdd = (a: number) => (b: number) => (c: number) => a + b + c;

console.log("41. Arrow curried:", curriedAdd(10)(20)(30));

// Partial application
function greetPerson(greeting: string, name: string): string {
  return `${greeting}, ${name}!`;
}

const sayHello = (name: string) => greetPerson("Hello", name);
const sayGoodbye = (name: string) => greetPerson("Goodbye", name);

console.log("42. Partial hello:", sayHello("Alice"));
console.log("43. Partial goodbye:", sayGoodbye("Bob"));

console.log("\n");

// ==========================================
// FUNCTION COMPOSITION
// ==========================================

console.log("=== FUNCTION COMPOSITION ===\n");

// Composing functions
const addOne = (n: number): number => n + 1;
const multiplyByTwo = (n: number): number => n * 2;
const subtractThree = (n: number): number => n - 3;

// Manual composition
const result1 = subtractThree(multiplyByTwo(addOne(5)));
console.log("44. Manual composition:", result1); // (5 + 1) * 2 - 3 = 9

// Compose function
function compose<T>(...fns: Array<(arg: T) => T>) {
  return (value: T): T => {
    return fns.reduceRight((acc, fn) => fn(acc), value);
  };
}

const composed = compose(subtractThree, multiplyByTwo, addOne);
console.log("45. Composed result:", composed(5));

console.log("\n");

// ==========================================
// RECURSION
// ==========================================

console.log("=== RECURSION ===\n");

// Factorial using recursion
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log("46. Factorial of 5:", factorial(5));

// Fibonacci using recursion
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("47. Fibonacci of 7:", fibonacci(7));

// Countdown using recursion
function countdown(n: number): void {
  if (n < 0) return;
  console.log(`48. Countdown: ${n}`);
  countdown(n - 1);
}

countdown(3);

console.log("\n");

// ==========================================
// IMMEDIATELY INVOKED FUNCTION EXPRESSIONS (IIFE)
// ==========================================

console.log("=== IIFE ===\n");

// IIFE - executes immediately
(function() {
  console.log("49. IIFE executed!");
})();

// IIFE with parameters
(function(name: string) {
  console.log("50. IIFE with param:", name);
})("TypeScript");

// Arrow IIFE
(() => {
  console.log("51. Arrow IIFE executed!");
})();

// IIFE with return value
const result = (function(a: number, b: number): number {
  return a + b;
})(10, 20);

console.log("52. IIFE result:", result);

console.log("\n");

// ==========================================
// FUNCTION TYPE ANNOTATIONS
// ==========================================

console.log("=== FUNCTION TYPE ANNOTATIONS ===\n");

// Function type
type MathOperation = (a: number, b: number) => number;

const addNumbers: MathOperation = (a, b) => a + b;
const subtractNumbers: MathOperation = (a, b) => a - b;

console.log("53. Type annotation add:", addNumbers(15, 5));
console.log("54. Type annotation subtract:", subtractNumbers(15, 5));

// Interface for function
interface StringFormatter {
  (str: string): string;
}

const uppercase: StringFormatter = (str) => str.toUpperCase();
const lowercase: StringFormatter = (str) => str.toLowerCase();

console.log("55. Uppercase:", uppercase("hello"));
console.log("56. Lowercase:", lowercase("WORLD"));

console.log("\n");

// ==========================================
// PRACTICAL EXAMPLES
// ==========================================

console.log("=== PRACTICAL EXAMPLES ===\n");

// Debounce function
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

const logDebounced = debounce((msg: string) => {
  console.log("57. Debounced:", msg);
}, 100);

logDebounced("First");
logDebounced("Second");
logDebounced("Third"); // Only this will execute

// Array utilities
function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

console.log("58. Chunked:", chunk([1, 2, 3, 4, 5, 6, 7], 3));

// Memoization
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("59. Cache hit");
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

const expensiveOperation = memoize((n: number) => {
  console.log("60. Computing...");
  return n * n;
});

console.log("First call:", expensiveOperation(5));
console.log("Second call:", expensiveOperation(5)); // Uses cache

console.log("\n=== END OF FUNCTIONS EXAMPLES ===");
