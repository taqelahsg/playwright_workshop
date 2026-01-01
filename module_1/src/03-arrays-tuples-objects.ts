/**
 * ARRAYS, TUPLES, AND OBJECTS
 *
 * This file demonstrates:
 * - Array declaration and initialization
 * - Array methods (push, pop, shift, unshift, slice, splice, etc.)
 * - Multi-dimensional arrays
 * - Tuples and their use cases
 * - Object literals
 * - Object properties and methods
 * - Interfaces and type aliases for objects
 * - Optional and readonly properties
 * - Nested objects and arrays
 */

console.log("=== ARRAYS, TUPLES, AND OBJECTS ===\n");

// ==========================================
// ARRAYS - BASICS
// ==========================================

console.log("=== ARRAYS - BASICS ===\n");

// Array declaration
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];
let mixed: (string | number)[] = [1, "two", 3, "four"];

// Alternative syntax
let moreNumbers: Array<number> = [10, 20, 30];

console.log("1. Number array:", numbers);
console.log("2. String array:", names);
console.log("3. Mixed array:", mixed);

// Array access
console.log("4. First element:", numbers[0]);
console.log("5. Last element:", numbers[numbers.length - 1]);

// Array length
console.log("6. Array length:", numbers.length);

console.log("\n");

// ==========================================
// ARRAY METHODS - ADDING/REMOVING ELEMENTS
// ==========================================

console.log("=== ARRAY METHODS - ADDING/REMOVING ===\n");

let fruits: string[] = ["apple", "banana"];

// push - add to end
fruits.push("cherry");
console.log("7. After push:", fruits);

// pop - remove from end
let removed = fruits.pop();
console.log("8. After pop:", fruits, "| Removed:", removed);

// unshift - add to beginning
fruits.unshift("strawberry");
console.log("9. After unshift:", fruits);

// shift - remove from beginning
let firstFruit = fruits.shift();
console.log("10. After shift:", fruits, "| Removed:", firstFruit);

// splice - add/remove at any position
let colors: string[] = ["red", "green", "blue", "yellow"];
colors.splice(2, 1, "purple", "orange"); // At index 2, remove 1, add 2
console.log("11. After splice:", colors);

// slice - extract portion (doesn't modify original)
let someColors = colors.slice(1, 3);
console.log("12. Sliced (1, 3):", someColors);
console.log("13. Original unchanged:", colors);

console.log("\n");

// ==========================================
// ARRAY METHODS - SEARCHING AND ITERATING
// ==========================================

console.log("=== ARRAY METHODS - SEARCHING/ITERATING ===\n");

let scores: number[] = [85, 92, 78, 90, 88];

// indexOf - find index of element
console.log("14. Index of 90:", scores.indexOf(90));
console.log("15. Index of 100:", scores.indexOf(100)); // -1 if not found

// includes - check if element exists
console.log("16. Includes 92:", scores.includes(92));
console.log("17. Includes 100:", scores.includes(100));

// find - find first element matching condition
let firstHighScore = scores.find(score => score >= 90);
console.log("18. First score >= 90:", firstHighScore);

// findIndex - find index of first matching element
let firstHighScoreIndex = scores.findIndex(score => score >= 90);
console.log("19. Index of first score >= 90:", firstHighScoreIndex);

// filter - get all elements matching condition
let highScores = scores.filter(score => score >= 85);
console.log("20. All scores >= 85:", highScores);

// map - transform each element
let doubledScores = scores.map(score => score * 2);
console.log("21. Doubled scores:", doubledScores);

// reduce - reduce to single value
let totalScore = scores.reduce((sum, score) => sum + score, 0);
console.log("22. Total score:", totalScore);

// forEach - iterate over each element
console.log("23. ForEach iteration:");
scores.forEach((score, index) => {
  console.log(`   Index ${index}: ${score}`);
});

// some - check if at least one element matches
let hasFailingGrade = scores.some(score => score < 60);
console.log("24. Has failing grade:", hasFailingGrade);

// every - check if all elements match
let allPassing = scores.every(score => score >= 60);
console.log("25. All passing:", allPassing);

console.log("\n");

// ==========================================
// ARRAY METHODS - SORTING AND REVERSING
// ==========================================

console.log("=== ARRAY METHODS - SORTING ===\n");

let unsorted: number[] = [5, 2, 8, 1, 9];

// sort - sorts in place (modifies original)
let sorted = [...unsorted].sort((a, b) => a - b); // Ascending
console.log("26. Sorted ascending:", sorted);

let sortedDesc = [...unsorted].sort((a, b) => b - a); // Descending
console.log("27. Sorted descending:", sortedDesc);

// String sorting
let words: string[] = ["banana", "apple", "cherry"];
words.sort();
console.log("28. Sorted strings:", words);

// reverse - reverses in place
let reversed = [...sorted].reverse();
console.log("29. Reversed:", reversed);

console.log("\n");

// ==========================================
// ARRAY METHODS - JOINING AND SPLITTING
// ==========================================

console.log("=== ARRAY METHODS - JOINING/SPLITTING ===\n");

let letters: string[] = ["a", "b", "c"];

// join - array to string
let joined = letters.join("-");
console.log("30. Joined with '-':", joined);

// concat - combine arrays
let moreLetters: string[] = ["d", "e"];
let combined = letters.concat(moreLetters);
console.log("31. Concatenated:", combined);

// Spread operator for combining
let spreadCombined = [...letters, ...moreLetters];
console.log("32. Combined with spread:", spreadCombined);

console.log("\n");

// ==========================================
// MULTI-DIMENSIONAL ARRAYS
// ==========================================

console.log("=== MULTI-DIMENSIONAL ARRAYS ===\n");

// 2D array (matrix)
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

console.log("33. 2D Array:");
matrix.forEach((row, i) => {
  console.log(`   Row ${i}:`, row);
});

console.log("34. Element at [1][2]:", matrix[1][2]); // 6

// 3D array
let cube: number[][][] = [
  [[1, 2], [3, 4]],
  [[5, 6], [7, 8]]
];
console.log("35. 3D Array element [1][0][1]:", cube[1][0][1]); // 6

console.log("\n");

// ==========================================
// TUPLES
// ==========================================

console.log("=== TUPLES ===\n");

// Tuple - fixed-length array with specific types
let person: [string, number, boolean] = ["Alice", 30, true];
console.log("36. Tuple:", person);
console.log("37. Tuple elements:", person[0], person[1], person[2]);

// Destructuring tuples
let [name, age, isActive] = person;
console.log("38. Destructured:", { name, age, isActive });

// Optional tuple elements
let optionalTuple: [string, number?] = ["Bob"];
console.log("39. Optional tuple:", optionalTuple);

// Rest elements in tuples
let restTuple: [string, ...number[]] = ["scores", 85, 90, 92, 88];
console.log("40. Rest tuple:", restTuple);

// Readonly tuples
let readonlyTuple: readonly [string, number] = ["Charlie", 25];
// readonlyTuple[0] = "Dave"; // Error: Cannot assign to '0' because it is a read-only property

// Tuple use case: function returning multiple values
function getCoordinates(): [number, number] {
  return [10, 20];
}
let [x, y] = getCoordinates();
console.log("41. Coordinates:", { x, y });

console.log("\n");

// ==========================================
// OBJECTS - BASICS
// ==========================================

console.log("=== OBJECTS - BASICS ===\n");

// Object literal
let user: { name: string; age: number; email: string } = {
  name: "John Doe",
  age: 28,
  email: "john@example.com"
};

console.log("42. User object:", user);
console.log("43. User name:", user.name);
console.log("44. User age:", user.age);

// Accessing properties
console.log("45. Dot notation:", user.email);
console.log("46. Bracket notation:", user["email"]);

// Adding properties
let dynamicUser: any = { name: "Jane" };
dynamicUser.age = 25;
dynamicUser["email"] = "jane@example.com";
console.log("47. Dynamic properties:", dynamicUser);

// Modifying properties
user.age = 29;
console.log("48. Updated age:", user.age);

console.log("\n");

// ==========================================
// OBJECT INTERFACES
// ==========================================

console.log("=== OBJECT INTERFACES ===\n");

// Interface definition
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
};

console.log("49. Product:", laptop);

// Optional properties
let mouse: Product = {
  id: 2,
  name: "Mouse",
  price: 29.99,
  inStock: true,
  description: "Wireless mouse"
};

console.log("50. Product with description:", mouse);

// Readonly properties
interface Point {
  readonly x: number;
  readonly y: number;
}

let point: Point = { x: 10, y: 20 };
console.log("51. Point:", point);
// point.x = 15; // Error: Cannot assign to 'x' because it is a read-only property

console.log("\n");

// ==========================================
// NESTED OBJECTS
// ==========================================

console.log("=== NESTED OBJECTS ===\n");

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

console.log("52. Employee:", employee);
console.log("53. Employee city:", employee.address.city);
console.log("54. Employee skills:", employee.skills);

console.log("\n");

// ==========================================
// OBJECT METHODS
// ==========================================

console.log("=== OBJECT METHODS ===\n");

// Object with methods
interface Calculator {
  value: number;
  add: (n: number) => number;
  subtract: (n: number) => number;
  reset: () => void;
}

let calculator: Calculator = {
  value: 0,
  add(n: number): number {
    this.value += n;
    return this.value;
  },
  subtract(n: number): number {
    this.value -= n;
    return this.value;
  },
  reset(): void {
    this.value = 0;
  }
};

console.log("55. Initial value:", calculator.value);
console.log("56. After add(10):", calculator.add(10));
console.log("57. After subtract(3):", calculator.subtract(3));
calculator.reset();
console.log("58. After reset:", calculator.value);

console.log("\n");

// ==========================================
// OBJECT UTILITY METHODS
// ==========================================

console.log("=== OBJECT UTILITY METHODS ===\n");

let car = {
  brand: "Toyota",
  model: "Camry",
  year: 2023
};

// Object.keys - get all keys
console.log("59. Object keys:", Object.keys(car));

// Object.values - get all values
console.log("60. Object values:", Object.values(car));

// Object.entries - get key-value pairs
console.log("61. Object entries:", Object.entries(car));

// Object.assign - copy/merge objects
let carCopy = Object.assign({}, car);
console.log("62. Object copy:", carCopy);

let carWithColor = Object.assign({}, car, { color: "blue" });
console.log("63. Merged object:", carWithColor);

// Spread operator for objects
let spreadCopy = { ...car };
console.log("64. Spread copy:", spreadCopy);

let spreadMerge = { ...car, color: "red", year: 2024 };
console.log("65. Spread merge:", spreadMerge);

console.log("\n");

// ==========================================
// DESTRUCTURING
// ==========================================

console.log("=== DESTRUCTURING ===\n");

// Object destructuring
let book = {
  title: "TypeScript Handbook",
  author: "Microsoft",
  year: 2023,
  pages: 500
};

let { title, author } = book;
console.log("66. Destructured:", { title, author });

// Destructuring with renaming
let { title: bookTitle, year: publicationYear } = book;
console.log("67. Destructured with rename:", { bookTitle, publicationYear });

// Destructuring with default values
let { title: t, edition = 1 } = book;
console.log("68. With default:", { t, edition });

// Array destructuring
let colors2 = ["red", "green", "blue"];
let [first, second] = colors2;
console.log("69. Array destructured:", { first, second });

// Rest in destructuring
let { title: bookT, ...rest } = book;
console.log("70. Rest of object:", rest);

console.log("\n");

// ==========================================
// TYPE ALIASES VS INTERFACES
// ==========================================

console.log("=== TYPE ALIASES VS INTERFACES ===\n");

// Type alias
type Animal = {
  name: string;
  age: number;
};

let dog: Animal = { name: "Buddy", age: 5 };
console.log("71. Type alias:", dog);

// Interface
interface Vehicle {
  brand: string;
  speed: number;
}

let bike: Vehicle = { brand: "Honda", speed: 120 };
console.log("72. Interface:", bike);

// Extending interfaces
interface ElectricVehicle extends Vehicle {
  batteryLife: number;
}

let tesla: ElectricVehicle = {
  brand: "Tesla",
  speed: 200,
  batteryLife: 400
};
console.log("73. Extended interface:", tesla);

// Intersection types
type Person2 = { name: string };
type Contact = { email: string };
type PersonWithContact = Person2 & Contact;

let contact: PersonWithContact = {
  name: "Alice",
  email: "alice@example.com"
};
console.log("74. Intersection type:", contact);

console.log("\n=== END OF ARRAYS, TUPLES, AND OBJECTS EXAMPLES ===");
