import { test as base } from '@playwright/test';

/**
 * Custom Test Options for Project-Level Parameterization
 *
 * These options can be overridden in playwright.config.ts
 * for different test projects, allowing the same tests to run
 * with different configurations.
 */

// ============================================
// Custom Options Type Definition
// ============================================

type CustomTestOptions = {
  // User identity for personalized testing
  person: string;

  // Environment to test against
  environment: string;

  // User role for permission testing
  userRole: 'admin' | 'user' | 'guest';

  // Locale for internationalization testing
  locale: string;
};

// ============================================
// Extend Base Test with Custom Options
// ============================================

export const test = base.extend<CustomTestOptions>({
  // Default value for person option
  person: ['DefaultUser', { option: true }],

  // Default value for environment option
  environment: ['development', { option: true }],

  // Default value for userRole option
  userRole: ['user', { option: true }],

  // Default value for locale option
  locale: ['en-US', { option: true }],
});

// Re-export expect for convenience
export { expect } from '@playwright/test';
