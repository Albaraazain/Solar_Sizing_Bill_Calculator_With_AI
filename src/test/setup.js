// src/test/setup.js
import { jest, expect, beforeEach } from '@jest/globals';

// Global test setup
beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
});

// Add global test utilities if needed
const createMockEventBus = () => ({
    subscribers: new Map(),
    subscribe: jest.fn(),
    publish: jest.fn(),
    clear: jest.fn()
});

// Add custom matchers if needed
expect.extend({
    toBeWithinRange(received, floor, ceiling) {
        const pass = received >= floor && received <= ceiling;
        if (pass) {
            return {
                message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
                pass: true
            };
        } else {
            return {
                message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
                pass: false
            };
        }
    }
});

// Export utilities
export { createMockEventBus };
