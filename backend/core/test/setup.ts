/**
 * Global test setup configuration.
 *
 * This file is executed before test suites
 * and provides a centralized place for:
 *
 * - Environment initialization
 * - Global test configuration
 * - Mock registration
 * - Test utilities
 */

/**
 * Force test environment.
 */
process.env.NODE_ENV = 'test';

/**
 * Default JWT secret used during testing.
 *
 * This value should only be used inside
 * automated test environments.
 */
process.env.JWT_SECRET =
  process.env.JWT_SECRET || 'MWT_TEST_SECRET';

/**
 * Verify required environment configuration.
 */
beforeAll(() => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is missing in test environment',
    );
  }
});

/**
 * Global cleanup hook.
 */
afterAll(async () => {
  /**
   * Reserved for future cleanup logic.
   *
   * Examples:
   * - Close database connections
   * - Stop mock servers
   * - Clear temporary files
   */
});