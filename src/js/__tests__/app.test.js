// src/js/__tests__/app.test.js
import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import { App } from '../app.js';
import { Api } from '../../api/index.js';
import { Router } from '../router.js';
import { eventBus } from '../core/events/EventBus.js';
import { ErrorHandler } from '../core/utils/ErrorHandler.js';

// Mock dependencies
jest.mock('../../api/index.js');
jest.mock('../router.js');
jest.mock('../core/events/EventBus.js');
jest.mock('../core/utils/ErrorHandler.js');

describe('App', () => {
    let app;
    const mockToasts = {
        show: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        app = new App();
        window.toasts = mockToasts;
    });

    describe('initialization', () => {
        test('initializes successfully', async () => {
            Api.initialize.mockResolvedValue(true);

            const result = await app.initialize();

            expect(result).toBe(true);
            expect(Api.initialize).toHaveBeenCalled();
            expect(Router).toHaveBeenCalled();
        });

        test('handles initialization failure', async () => {
            Api.initialize.mockResolvedValue(false);

            const result = await app.initialize();

            expect(result).toBe(false);
            expect(ErrorHandler.handle).toHaveBeenCalled();
        });
    });

    describe('event handling', () => {
        test('handles unauthorized event', () => {
            app.router = { push: jest.fn() };
            eventBus.publish('auth:unauthorized');

            expect(mockToasts.show).toHaveBeenCalledWith(
                'Please log in to continue',
                'error'
            );
            expect(app.router.push).toHaveBeenCalledWith('/login');
        });

        test('handles session expired event', () => {
            app.router = { push: jest.fn() };
            eventBus.publish('auth:session-expired');

            expect(mockToasts.show).toHaveBeenCalledWith(
                'Your session has expired. Please log in again.',
                'warning'
            );
            expect(app.router.push).toHaveBeenCalledWith('/login');
        });

        test('handles network error', () => {
            const networkError = {
                code: 'NETWORK_ERROR',
                message: 'Network failed'
            };

            eventBus.publish('error', networkError);

            expect(mockToasts.show).toHaveBeenCalledWith(
                'Network error. Please check your connection.',
                'error'
            );
        });
    });

    describe('error handling', () => {
        test('sets up global error handlers', () => {
            const mockError = new Error('Test error');
            window.onerror('Error message', 'test.js', 1, 1, mockError);

            expect(ErrorHandler.handle).toHaveBeenCalledWith(mockError);
        });

        test('handles unhandled rejections', () => {
            const mockError = new Error('Promise rejection');
            window.onunhandledrejection({ reason: mockError });

            expect(ErrorHandler.handle).toHaveBeenCalledWith(mockError);
        });
    });
});
