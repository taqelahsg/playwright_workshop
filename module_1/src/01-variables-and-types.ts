/**
 * VARIABLES, DATA TYPES, AND OPERATORS
 *
 * This file demonstrates:
 * - Variable declarations (let, const, var)
 * - Primitive types (string, number, boolean, null, undefined)
 * - Special types (any, unknown, never, void)
 * - Type annotations and type inference
 * - Operators (arithmetic, comparison, logical, etc.)
 */

// Namespace: A way to group related code and prevent naming conflicts in the global scope.
// Everything inside this namespace is scoped to 'VariablesAndTypes' and won't pollute the global namespace.
// Access members outside using: VariablesAndTypes.memberName
namespace VariablesAndTypes {

console.log("=== VARIABLES AND DATA TYPES ===\n");

// ==========================================
// VARIABLE DECLARATIONS: let, const, var
// ==========================================

/*
 * KEY DIFFERENCES:
 *
 * let:
 *   - Block-scoped (only exists within { } block)
 *   - Can be reassigned
 *   - Cannot be redeclared in the same scope
 *   - Not hoisted (temporal dead zone)
 *
 * const:
 *   - Block-scoped (only exists within { } block)
 *   - Cannot be reassigned
 *   - Must be initialized when declared
 *   - Objects/arrays can have their contents modified
 *
 * var:
 *   - Function-scoped (exists throughout entire function)
 *   - Can be reassigned and redeclared
 *   - Hoisted to top of function (can use before declaration)(returns undefined)
 *   - AVOID using - legacy from pre-ES6 JavaScript
 */

// Example 1: let - use for variables that will change
let username: string = "Alice";
username = "Bob"; // OK - can reassign
console.log("1. let variable:", username);

// Example 2: const - use for values that shouldn't change
const PI: number = 3.14159;
// PI = 3.14; // Error: Cannot assign to 'PI' because it is a constant
console.log("2. const variable:", PI);

// Example 3: const with objects - the reference is constant, but contents can change
const userProfile = { name: "Alice", age: 30 };
userProfile.age = 31; // OK - can modify object properties
// userProfile = { name: "Bob", age: 25 }; // Error: Cannot reassign const variable
console.log("3. const object (mutable contents):", userProfile);

// Example 4: const with arrays - same principle
const colors: string[] = ["red", "green"];
colors.push("blue"); // OK - can modify array contents
// colors = ["yellow"]; // Error: Cannot reassign const variable
console.log("4. const array (mutable contents):", colors);

// Example 5: Block scope with let and const
{
  let blockScoped: string = "Inside block";
  const alsoBlockScoped: string = "Also inside";
  console.log("5. Inside block:", blockScoped, alsoBlockScoped);
}
// console.log(blockScoped); // Error: blockScoped is not defined outside the block

// Example 6: var - function-scoped (AVOID USING)
var oldStyleVar: string = "Legacy variable";
{
  var anotherVar: string = "var ignores blocks!";
}
console.log("6. var variables (both accessible):", oldStyleVar, anotherVar);

// Example 7: Hoisting differences
console.log("7. Hoisting example:");
// With var, you can access before declaration (value is undefined)
// @ts-expect-error - Demonstrating var hoisting behavior
console.log("   var before declaration:", typeof hoistedVar, hoistedVar); // undefined
var hoistedVar = "I'm hoisted";
console.log("   var after declaration:", hoistedVar);

// With let/const, accessing before declaration causes an error (temporal dead zone)
// Uncomment to see the error:
// console.log(hoistedLet); // ReferenceError: Cannot access before initialization
let hoistedLet = "I'm not hoisted";
const hoistedConst = "I'm also not hoisted";
console.log("   let/const after declaration:", hoistedLet, hoistedConst);

/*
 * WHEN TO USE EACH:
 *
 * Use const by default:
 *   - For values that won't be reassigned
 *   - Makes code more predictable and prevents bugs
 *   - Examples: configuration, constants, object/array references
 *
 * Use let when you need to reassign:
 *   - Loop counters
 *   - Variables that accumulate values
 *   - Conditional assignments
 *
 * Avoid var:
 *   - Only exists for backwards compatibility
 *   - Use let or const instead
 */

console.log("\n");

// ==========================================
// PRIMITIVE DATA TYPES
// ==========================================

// String
let firstName: string = "John";
let lastName: string = 'Doe';
let fullName: string = `${firstName} ${lastName}`; // Template literal
console.log("8. String:", fullName);

// Number (integers and floats)
let age: number = 30;
let price: number = 99.99;
let hexValue: number = 0xff; // 255 in hexadecimal
let binaryValue: number = 0b1010; // 10 in binary
console.log("9. Numbers:", { age, price, hexValue, binaryValue });

// Boolean
let isActive: boolean = true;
let hasPermission: boolean = false;
console.log("10. Booleans:", { isActive, hasPermission });

// Null and Undefined
let nothing: null = null;
let notDefined: undefined = undefined;
console.log("11. Null and Undefined:", { nothing, notDefined });

// Symbol (unique identifier)
let uniqueId: symbol = Symbol("id");
let anotherId: symbol = Symbol("id");
console.log("12. Symbols are unique:", uniqueId === anotherId); // false

// BigInt (for very large integers)
let bigNumber: bigint = 9007199254740991n;
console.log("13. BigInt:", bigNumber);

console.log("\n");

// ==========================================
// TYPE INFERENCE
// ==========================================

// TypeScript can infer types automatically
let inferredString = "TypeScript infers this as string";
let inferredNumber = 42;
let inferredBoolean = true;

console.log("14. Type inference works automatically");
// Try uncommenting the next line to see type error:
// inferredNumber = "string"; // Error: Type 'string' is not assignable to type 'number'

console.log("\n");

// ==========================================
// SPECIAL TYPES
// ==========================================

// any - disables type checking (avoid when possible)
let anything: any = "a string";
anything = 42;
anything = true;
console.log("15. any type (avoid):", anything);

// unknown - safer alternative to any
let userInput: unknown = "some input";
// console.log(userInput.toUpperCase()); // Error: Object is of type 'unknown'

// Type narrowing with unknown
if (typeof userInput === "string") {
  console.log("16. unknown type (safe):", userInput.toUpperCase());
}

// void - no return value
function logMessage(message: string): void {
  console.log("17. void function:", message);
}
logMessage("Functions can return void");

// never - function never returns (throws or infinite loop)
function throwError(message: string): never {
  throw new Error(message);
}

console.log("\n");

// ==========================================
// UNION TYPES
// ==========================================

let id: string | number;
id = "ABC123"; // OK
id = 12345; // OK
console.log("18. Union type:", id);

// Type narrowing with unions
function printId(id: string | number): void {
  if (typeof id === "string") {
    console.log("19. ID (string):", id.toUpperCase());
  } else {
    console.log("20. ID (number):", id.toFixed(2));
  }
}
printId("xyz789");
printId(42);

console.log("\n");

// ==========================================
// TYPE ALIASES
// ==========================================

type ID = string | number;
type Point = {
  x: number;
  y: number;
};

let userId: ID = "user_123";
let coordinate: Point = { x: 10, y: 20 };
console.log("21. Type aliases:", { userId, coordinate });

console.log("\n");

// ==========================================
// OPERATORS
// ==========================================

console.log("=== OPERATORS ===\n");

// Arithmetic operators
let a: number = 10;
let b: number = 3;

console.log("22. Arithmetic operators:");
console.log("   Addition:", a + b);
console.log("   Subtraction:", a - b);
console.log("   Multiplication:", a * b);
console.log("   Division:", a / b);
console.log("   Modulus:", a % b);
console.log("   Exponentiation:", a ** b);

// Increment/Decrement
let counter: number = 5;
console.log("23. Increment/Decrement:");
console.log("   counter++:", counter++); // 5 (post-increment)
console.log("   counter:", counter); // 6
console.log("   ++counter:", ++counter); // 7 (pre-increment)
console.log("   counter--:", counter--); // 7 (post-decrement)
console.log("   counter:", counter); // 6

console.log("\n");

// Comparison operators
console.log("24. Comparison operators:");
console.log("   10 > 5:", 10 > 5);
console.log("   10 < 5:", 10 < 5);
console.log("   10 >= 10:", 10 >= 10);
console.log("   10 <= 5:", 10 <= 5);
// @ts-expect-error - Intentional type mismatch to demonstrate loose vs strict equality
console.log("   10 == '10':", 10 == '10'); // true (loose equality)
// @ts-expect-error - Intentional type mismatch to demonstrate loose vs strict equality
console.log("   10 === '10':", 10 === '10'); // false (strict equality)
// @ts-expect-error - Intentional type mismatch to demonstrate loose vs strict equality
console.log("   10 != '10':", 10 != '10'); // false
// @ts-expect-error - Intentional type mismatch to demonstrate loose vs strict equality
console.log("   10 !== '10':", 10 !== '10'); // true

console.log("\n");

// Logical operators
let isAdult: boolean = true;
let hasLicense: boolean = false;

console.log("25. Logical operators:");
console.log("   AND (&&):", isAdult && hasLicense);
console.log("   OR (||):", isAdult || hasLicense);
console.log("   NOT (!):", !isAdult);

console.log("\n");

// String operators
let greeting: string = "Hello";
let name: string = "World";
console.log("26. String concatenation:", greeting + " " + name);
console.log("27. Template literal:", `${greeting} ${name}!`);

console.log("\n");

// Assignment operators
let x: number = 10;
console.log("28. Assignment operators:");
x += 5; // x = x + 5
console.log("   x += 5:", x);
x -= 3; // x = x - 3
console.log("   x -= 3:", x);
x *= 2; // x = x * 2
console.log("   x *= 2:", x);
x /= 4; // x = x / 4
console.log("   x /= 4:", x);
x %= 3; // x = x % 3
console.log("   x %= 3:", x);

console.log("\n");

// Ternary operator
let score: number = 85;
let result: string = score >= 60 ? "Pass" : "Fail";
console.log("29. Ternary operator:", result);

console.log("\n");

// Nullish coalescing operator (??)
let userAge: number | null = null;
let defaultAge: number = userAge ?? 18; // Use 18 if userAge is null/undefined
console.log("30. Nullish coalescing:", defaultAge);

// Optional chaining operator (?.)
let user: { name: string; address?: { city?: string } } = {
  name: "Alice"
};
console.log("31. Optional chaining:", user.address?.city ?? "No city");

console.log("\n=== END OF VARIABLES AND TYPES EXAMPLES ===");

} // End of VariablesAndTypes namespace
