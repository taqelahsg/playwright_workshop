/**
 * CONTROL FLOW: CONDITIONALS, SWITCH STATEMENTS, AND LOOPS
 *
 * This file demonstrates:
 * - if/else statements
 * - else if chains
 * - switch statements
 * - for loops
 * - while loops
 * - do-while loops
 * - break and continue
 * - for...of and for...in loops
 */

namespace ControlFlow {

console.log("=== CONTROL FLOW EXAMPLES ===\n");

// ==========================================
// IF/ELSE STATEMENTS
// ==========================================

console.log("=== IF/ELSE STATEMENTS ===\n");

let temperature: number = 31;

// Simple if statement
if (temperature > 30) {
  console.log("1. It's hot outside!");
}

// if-else statement
if (temperature > 30) {
  console.log("2. It's hot!");
} else {
  console.log("2. It's comfortable!");
}

// if-else if-else chain
let score: number = 85;

if (score >= 90) {
  console.log("3. Grade: A");
} else if (score >= 80) {
  console.log("3. Grade: B");
} else if (score >= 70) {
  console.log("3. Grade: C");
} else if (score >= 60) {
  console.log("3. Grade: D");
} else {
  console.log("3. Grade: F");
}

// Nested if statements
let age: number = 20;
let hasLicense: boolean = true;

if (age >= 18) {
  if (hasLicense) {
    console.log("4. You can drive!");
  } else {
    console.log("4. You need a license to drive.");
  }
} else {
  console.log("4. You're too young to drive.");
}

// Logical operators in conditions
let isWeekend: boolean = true;
let isHoliday: boolean = false;

if (isWeekend || isHoliday) {
  console.log("5. No work today!");
}

if (!isWeekend && !isHoliday) {
  console.log("5. Time to work.");
} else {
  console.log("5. Enjoy your day off!");
}

console.log("\n");

// ==========================================
// TERNARY OPERATOR
// ==========================================

console.log("=== TERNARY OPERATOR ===\n");

let userAge: number = 17;
let status: string = userAge >= 18 ? "Adult" : "Minor";
console.log("6. Status:", status);

// Nested ternary (use sparingly, can be hard to read)
let grade: number = 75;
let result: string =
  grade >= 90 ? "Excellent" :
  grade >= 70 ? "Good" :
  grade >= 50 ? "Pass" : "Fail";
console.log("7. Result:", result);

console.log("\n");

// ==========================================
// SWITCH STATEMENTS
// ==========================================

console.log("=== SWITCH STATEMENTS ===\n");

// Basic switch statement
let dayOfWeek: number = 3;

switch (dayOfWeek) {
  case 1:
    console.log("8. Monday");
    break;
  case 2:
    console.log("8. Tuesday");
    break;
  case 3:
    console.log("8. Wednesday");
    break;
  case 4:
    console.log("8. Thursday");
    break;
  case 5:
    console.log("8. Friday");
    break;
  case 6:
    console.log("8. Saturday");
    break;
  case 7:
    console.log("8. Sunday");
    break;
  default:
    console.log("8. Invalid day");
}

// Switch with string values
let fruit: string = "apple";

switch (fruit) {
  case "apple":
    console.log("9. Apples are $1.50 per pound");
    break;
  case "banana":
    console.log("9. Bananas are $0.80 per pound");
    break;
  case "orange":
    console.log("9. Oranges are $2.00 per pound");
    break;
  default:
    console.log("9. Fruit not found");
}

// Switch with fall-through (multiple cases)
let month: number = 12;

switch (month) {
  case 12:
  case 1:
  case 2:
    console.log("10. Season: Winter");
    break;
  case 3:
  case 4:
  case 5:
    console.log("10. Season: Spring");
    break;
  case 6:
  case 7:
  case 8:
    console.log("10. Season: Summer");
    break;
  case 9:
  case 10:
  case 11:
    console.log("10. Season: Fall");
    break;
  default:
    console.log("10. Invalid month");
}

// Switch with return values (in a function)
function getTrafficLightAction(color: string): string {
  switch (color.toLowerCase()) {
    case "red":
      return "Stop";
    case "yellow":
      return "Slow down";
    case "green":
      return "Go";
    default:
      return "Invalid color";
  }
}

console.log("11. Traffic light (red):", getTrafficLightAction("red"));
console.log("11. Traffic light (green):", getTrafficLightAction("green"));

console.log("\n");

// ==========================================
// FOR LOOPS
// ==========================================

console.log("=== FOR LOOPS ===\n");

// Basic for loop
console.log("12. Counting from 1 to 5:");
for (let i: number = 1; i <= 5; i++) {
  console.log(`   ${i}`);
}

// Counting backwards
console.log("13. Counting down from 5 to 1:");
for (let i: number = 5; i >= 1; i--) {
  console.log(`   ${i}`);
}

// Loop with step increment
console.log("14. Even numbers from 0 to 10:");
for (let i: number = 0; i <= 10; i += 2) {
  console.log(`   ${i}`);
}

// Nested for loops
console.log("15. Multiplication table (3x3):");
for (let i: number = 1; i <= 3; i++) {
  let row: string = "";
  for (let j: number = 1; j <= 3; j++) {
    row += `${i * j}\t`;
  }
  console.log(`   ${row}`);
}

console.log("\n");

// ==========================================
// FOR...OF LOOPS (iterate over values)
// ==========================================

console.log("=== FOR...OF LOOPS ===\n");

let colors: string[] = ["red", "green", "blue"];

console.log("16. Iterating over array values:");
for (let color of colors) {
  console.log(`   Color: ${color}`);
}

// for...of with strings
let message: string = "Hello";
console.log("17. Iterating over string characters:");
for (let char of message) {
  console.log(`   ${char}`);
}

console.log("\n");

// ==========================================
// FOR...IN LOOPS (iterate over keys/indices)
// ==========================================

console.log("=== FOR...IN LOOPS ===\n");

// for...in with arrays (gets indices)
let fruits: string[] = ["apple", "banana", "cherry"];
console.log("18. Array indices:");
for (let index in fruits) {
  console.log(`   Index ${index}: ${fruits[index]}`);
}

// for...in with objects (gets property names)
let person: { name: string; age: number; city: string } = {
  name: "Alice",
  age: 30,
  city: "New York"
};

console.log("19. Object properties:");
for (let key in person) {
  console.log(`   ${key}: ${person[key as keyof typeof person]}`);
}

console.log("\n");

// ==========================================
// WHILE LOOPS
// ==========================================

console.log("=== WHILE LOOPS ===\n");

// Basic while loop
let count: number = 1;
console.log("20. While loop (1 to 5):");
while (count <= 5) {
  console.log(`   Count: ${count}`);
  count++;
}

// While loop with condition
let balance: number = 100;
let withdrawal: number = 15;
console.log("21. Withdrawal simulation:");
while (balance >= withdrawal) {
  balance -= withdrawal;
  console.log(`   Balance after withdrawal: $${balance}`);
}

console.log("\n");

// ==========================================
// DO-WHILE LOOPS
// ==========================================

console.log("=== DO-WHILE LOOPS ===\n");

// do-while executes at least once
let number: number = 10;
console.log("22. Do-while loop:");
do {
  console.log(`   Number: ${number}`);
  number++;
} while (number <= 12);

// Difference between while and do-while
let x: number = 10;
console.log("23. While loop (condition false from start):");
while (x < 5) {
  console.log(`   This won't print`);
}

let y: number = 10;
console.log("24. Do-while loop (condition false from start):");
do {
  console.log(`   This prints once: ${y}`);
} while (y < 5);

console.log("\n");

// ==========================================
// BREAK AND CONTINUE
// ==========================================

console.log("=== BREAK AND CONTINUE ===\n");

// break - exit loop early
console.log("25. Using break (find first even number):");
for (let i: number = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    console.log(`   Found even number: ${i}`);
    break; // Exit loop
  }
}

// continue - skip current iteration
console.log("26. Using continue (skip odd numbers):");
for (let i: number = 1; i <= 10; i++) {
  if (i % 2 !== 0) {
    continue; // Skip odd numbers
  }
  console.log(`   Even number: ${i}`);
}

// break in nested loops
console.log("27. Break in nested loops:");
outerLoop: for (let i: number = 1; i <= 3; i++) {
  for (let j: number = 1; j <= 3; j++) {
    if (i === 2 && j === 2) {
      console.log(`   Breaking at i=${i}, j=${j}`);
      break outerLoop; // Break outer loop
    }
    console.log(`   i=${i}, j=${j}`);
  }
}

console.log("\n");

// ==========================================
// PRACTICAL EXAMPLES
// ==========================================

console.log("=== PRACTICAL EXAMPLES ===\n");

// Example 1: Find prime numbers
function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;

  for (let i: number = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

console.log("28. Prime numbers from 1 to 20:");
let primes: number[] = [];
for (let i: number = 1; i <= 20; i++) {
  if (isPrime(i)) {
    primes.push(i);
  }
}
console.log(`   ${primes.join(", ")}`);

// Example 2: Fibonacci sequence
console.log("29. Fibonacci sequence (first 10 numbers):");
let fib: number[] = [0, 1];
for (let i: number = 2; i < 10; i++) {
  fib[i] = fib[i - 1] + fib[i - 2];
}
console.log(`   ${fib.join(", ")}`);

console.log("\n=== END OF CONTROL FLOW EXAMPLES ===");

} // End of ControlFlow namespace
