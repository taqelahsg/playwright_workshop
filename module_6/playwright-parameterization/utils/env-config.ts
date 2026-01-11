/**
 * Environment Configuration
 *
 * Type-safe access to environment variables
 */

export interface EnvironmentConfig {
  baseUrl: string;
  testUser: {
    email: string;
    password: string;
  };
  api: {
    key: string;
    version: string;
  };
  environment: string;
  features: {
    advancedFeatures: boolean;
    debugMode: boolean;
  };
  timeouts: {
    default: number;
    navigation: number;
  };
}

/**
 * Parse environment variable as boolean
 */
function parseBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Parse environment variable as number
 */
function parseNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Get environment configuration
 */
export function getEnvConfig(): EnvironmentConfig {
  return {
    baseUrl: process.env.BASE_URL || 'https://demo.playwright.dev/todomvc',

    testUser: {
      email: process.env.TEST_USER_EMAIL || 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'password123',
    },

    api: {
      key: process.env.API_KEY || '',
      version: process.env.API_VERSION || 'v1',
    },

    environment: process.env.TEST_ENVIRONMENT || 'development',

    features: {
      advancedFeatures: parseBoolean(process.env.ENABLE_ADVANCED_FEATURES, false),
      debugMode: parseBoolean(process.env.ENABLE_DEBUG_MODE, true),
    },

    timeouts: {
      default: parseNumber(process.env.DEFAULT_TIMEOUT, 30000),
      navigation: parseNumber(process.env.NAVIGATION_TIMEOUT, 10000),
    },
  };
}

/**
 * Validate required environment variables
 */
export function validateEnvConfig(): void {
  const required = ['BASE_URL'];
  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.warn(`Warning: Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using default values. Copy .env.example to .env for custom configuration.');
  }
}

// Export singleton instance
export const env = getEnvConfig();
