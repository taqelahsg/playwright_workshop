/**
 * TypeScript Test Data
 *
 * Strongly-typed test data for use in parameterized tests
 */

export interface User {
  username: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  isActive: boolean;
}

export interface TodoItem {
  id: number;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  estimatedMinutes?: number;
}

export interface TestScenario {
  name: string;
  description: string;
  tags: string[];
  data: any;
  expectedOutcome: 'pass' | 'fail';
}

// ============================================
// User Test Data
// ============================================

export const testUsers: User[] = [
  {
    username: 'alice',
    email: 'alice@example.com',
    role: 'admin',
    isActive: true,
  },
  {
    username: 'bob',
    email: 'bob@example.com',
    role: 'user',
    isActive: true,
  },
  {
    username: 'charlie',
    email: 'charlie@example.com',
    role: 'user',
    isActive: true,
  },
  {
    username: 'diana',
    email: 'diana@example.com',
    role: 'guest',
    isActive: true,
  },
  {
    username: 'inactive_user',
    email: 'inactive@example.com',
    role: 'user',
    isActive: false,
  },
];

// ============================================
// Todo Item Test Data
// ============================================

export const todoItems: TodoItem[] = [
  {
    id: 1,
    description: 'Write unit tests',
    priority: 'high',
    category: 'testing',
    estimatedMinutes: 120,
  },
  {
    id: 2,
    description: 'Fix critical bug',
    priority: 'critical',
    category: 'bug-fix',
    estimatedMinutes: 60,
  },
  {
    id: 3,
    description: 'Update documentation',
    priority: 'medium',
    category: 'documentation',
    estimatedMinutes: 30,
  },
  {
    id: 4,
    description: 'Code review',
    priority: 'low',
    category: 'review',
    estimatedMinutes: 15,
  },
];

// ============================================
// Edge Case Test Data
// ============================================

export const edgeCaseInputs = [
  { description: 'empty string', value: '', shouldBeValid: false },
  { description: 'whitespace only', value: '   ', shouldBeValid: false },
  { description: 'single character', value: 'x', shouldBeValid: true },
  { description: 'very long string', value: 'x'.repeat(1000), shouldBeValid: false },
  { description: 'special characters', value: '!@#$%^&*()', shouldBeValid: true },
  { description: 'unicode', value: '你好世界 🌍', shouldBeValid: true },
  { description: 'HTML tags', value: '<script>alert("xss")</script>', shouldBeValid: false },
  { description: 'SQL injection', value: "'; DROP TABLE users; --", shouldBeValid: false },
];

// ============================================
// Test Scenario Data
// ============================================

export const testScenarios: TestScenario[] = [
  {
    name: 'valid-login',
    description: 'User logs in with correct credentials',
    tags: ['@smoke', '@authentication'],
    data: { username: 'testuser', password: 'validpass' },
    expectedOutcome: 'pass',
  },
  {
    name: 'invalid-password',
    description: 'User attempts login with wrong password',
    tags: ['@authentication', '@negative'],
    data: { username: 'testuser', password: 'wrongpass' },
    expectedOutcome: 'fail',
  },
  {
    name: 'create-todo',
    description: 'User creates a new todo item',
    tags: ['@smoke', '@crud'],
    data: { description: 'Test task', priority: 'medium' },
    expectedOutcome: 'pass',
  },
  {
    name: 'delete-todo',
    description: 'User deletes an existing todo',
    tags: ['@crud'],
    data: { todoId: 1 },
    expectedOutcome: 'pass',
  },
];

// ============================================
// Browser and Viewport Combinations
// ============================================

export interface BrowserConfig {
  name: string;
  viewport: { width: number; height: number };
  userAgent?: string;
}

export const browserConfigs: BrowserConfig[] = [
  {
    name: 'desktop-chrome',
    viewport: { width: 1920, height: 1080 },
  },
  {
    name: 'desktop-firefox',
    viewport: { width: 1920, height: 1080 },
  },
  {
    name: 'tablet-ipad',
    viewport: { width: 768, height: 1024 },
  },
  {
    name: 'mobile-iphone',
    viewport: { width: 375, height: 667 },
  },
  {
    name: 'mobile-android',
    viewport: { width: 360, height: 640 },
  },
];
