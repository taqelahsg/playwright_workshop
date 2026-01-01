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

console.log("=== VARIABLES AND DATA TYPES ===\n");

// ==========================================
// VARIABLE DECLARATIONS
// ==========================================

// let - block-scoped, can be reassigned
let username: string = "Alice";
username = "Bob"; // OK
console.log("1. let variable:", username);

// const - block-scoped, cannot be reassigned
const PI: number = 3.14159;
// PI = 3.14; // Error: Cannot assign to 'PI' because it is a constant
console.log("2. const variable:", PI);

// var - function-scoped (avoid using, legacy)
var oldStyleVar: string = "Legacy variable";
console.log("3. var variable (avoid):", oldStyleVar);

console.log("\n");

// ==========================================
// PRIMITIVE DATA TYPES
// ==========================================

// String
let firstName: string = "John";
let lastName: string = 'Doe';
let fullName: string = `${firstName} ${lastName}`; // Template literal
console.log("4. String:", fullName);

// Number (integers and floats)
let age: number = 30;
let price: number = 99.99;
let hexValue: number = 0xff; // 255 in hexadecimal
let binaryValue: number = 0b1010; // 10 in binary
console.log("5. Numbers:", { age, price, hexValue, binaryValue });

// Boolean
let isActive: boolean = true;
let hasPermission: boolean = false;
console.log("6. Booleans:", { isActive, hasPermission });

// Null and Undefined
let nothing: null = null;
let notDefined: undefined = undefined;
console.log("7. Null and Undefined:", { nothing, notDefined });

// Symbol (unique identifier)
let uniqueId: symbol = Symbol("id");
let anotherId: symbol = Symbol("id");
console.log("8. Symbols are unique:", uniqueId === anotherId); // false

// BigInt (for very large integers)
let bigNumber: bigint = 9007199254740991n;
console.log("9. BigInt:", bigNumber);

console.log("\n");

// ==========================================
// TYPE INFERENCE
// ==========================================

// TypeScript can infer types automatically
let inferredString = "TypeScript infers this as string";
let inferredNumber = 42;
let inferredBoolean = true;

console.log("10. Type inference works automatically");
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
console.log("11. any type (avoid):", anything);

// unknown - safer alternative to any
let userInput: unknown = "some input";
// console.log(userInput.toUpperCase()); // Error: Object is of type 'unknown'

// Type narrowing with unknown
if (typeof userInput === "string") {
  console.log("12. unknown type (safe):", userInput.toUpperCase());
}

// void - no return value
function logMessage(message: string): void {
  console.log("13. void function:", message);
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
console.log("14. Union type:", id);

// Type narrowing with unions
function printId(id: string | number): void {
  if (typeof id === "string") {
    console.log("15. ID (string):", id.toUpperCase());
  } else {
    console.log("15. ID (number):", id.toFixed(2));
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
console.log("16. Type aliases:", { userId, coordinate });

console.log("\n");

// ==========================================
// OPERATORS
// ==========================================

console.log("=== OPERATORS ===\n");

// Arithmetic operators
let a: number = 10;
let b: number = 3;

console.log("17. Arithmetic operators:");
console.log("   Addition:", a + b);
console.log("   Subtraction:", a - b);
console.log("   Multiplication:", a * b);
console.log("   Division:", a / b);
console.log("   Modulus:", a % b);
console.log("   Exponentiation:", a ** b);

// Increment/Decrement
let counter: number = 5;
console.log("18. Increment/Decrement:");
console.log("   counter++:", counter++); // 5 (post-increment)
console.log("   counter:", counter); // 6
console.log("   ++counter:", ++counter); // 7 (pre-increment)
console.log("   counter--:", counter--); // 7 (post-decrement)
console.log("   counter:", counter); // 6

console.log("\n");

// Comparison operators
console.log("19. Comparison operators:");
console.log("   10 > 5:", 10 > 5);
console.log("   10 < 5:", 10 < 5);
console.log("   10 >= 10:", 10 >= 10);
console.log("   10 <= 5:", 10 <= 5);
console.log("   10 == '10':", 10 == '10'); // true (loose equality)
console.log("   10 === '10':", 10 === '10'); // false (strict equality)
console.log("   10 != '10':", 10 != '10'); // false
console.log("   10 !== '10':", 10 !== '10'); // true

console.log("\n");

// Logical operators
let isAdult: boolean = true;
let hasLicense: boolean = false;

console.log("20. Logical operators:");
console.log("   AND (&&):", isAdult && hasLicense);
console.log("   OR (||):", isAdult || hasLicense);
console.log("   NOT (!):", !isAdult);

console.log("\n");

// String operators
let greeting: string = "Hello";
let name: string = "World";
console.log("21. String concatenation:", greeting + " " + name);
console.log("22. Template literal:", `${greeting} ${name}!`);

console.log("\n");

// Assignment operators
let x: number = 10;
console.log("23. Assignment operators:");
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
console.log("24. Ternary operator:", result);

console.log("\n");

// Nullish coalescing operator (??)
let userAge: number | null = null;
let defaultAge: number = userAge ?? 18; // Use 18 if userAge is null/undefined
console.log("25. Nullish coalescing:", defaultAge);

// Optional chaining operator (?.)
let user: { name: string; address?: { city?: string } } = {
  name: "Alice"
};
console.log("26. Optional chaining:", user.address?.city ?? "No city");

console.log("\n=== END OF VARIABLES AND TYPES EXAMPLES ===");
