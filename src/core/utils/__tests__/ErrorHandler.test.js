// src/core/utils/__tests__/ErrorHandler.test.js
const { AppError, ErrorHandler } = require('../ErrorHandler');
const { eventBus } = require('../../events/EventBus');

describe('ErrorHandler', () => {
    beforeEach(() => {
        eventBus.clear();
    });

    test('handles AppError', done => {
        eventBus.subscribe('error', errorData => {
            expect(errorData.code).toBe('TEST_ERROR');
            expect(errorData.message).toBe('Test error');
            done();
        });

        const error = new AppError('Test error', 'TEST_ERROR');
        ErrorHandler.handle(error);
    });

    test('handles unknown errors', done => {
        eventBus.subscribe('error', errorData => {
            expect(errorData.code).toBe('UNKNOWN_ERROR');
            expect(errorData.message).toBe('An unexpected error occurred');
            done();
        });

        ErrorHandler.handle(new Error('Random error'));
    });
});
