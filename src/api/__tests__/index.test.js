// src/api/__tests__/index.test.js
import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import { Api } from '../index.js';
import { AuthMiddleware } from '../middleware/authMiddleware.js';
import { ApiErrorHandler } from '../middleware/errorHandler.js';
import { AppError } from '../../core/utils/ErrorHandler.js';

// Mock dependencies
jest.mock('../middleware/authMiddleware.js');
jest.mock('../middleware/errorHandler.js');
jest.mock('../services/billApi.js');
jest.mock('../services/quoteApi.js');

describe('API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        test('initializes successfully when not authenticated', async () => {
            AuthMiddleware.isAuthenticated.mockReturnValue(false);

            const result = await Api.initialize();

            expect(result).toBe(true);
            expect(AuthMiddleware.refreshTokenIfNeeded).not.toHaveBeenCalled();
        });

        test('refreshes token when authenticated', async () => {
            AuthMiddleware.isAuthenticated.mockReturnValue(true);
            AuthMiddleware.refreshTokenIfNeeded.mockResolvedValue(true);

            const result = await Api.initialize();

            expect(result).toBe(true);
            expect(AuthMiddleware.refreshTokenIfNeeded).toHaveBeenCalled();
        });

        test('handles initialization errors gracefully', async () => {
            AuthMiddleware.isAuthenticated.mockReturnValue(true);
            AuthMiddleware.refreshTokenIfNeeded.mockRejectedValue(new Error('Refresh failed'));

            const result = await Api.initialize();

            expect(result).toBe(false);
        });
    });

    describe('request handling', () => {
        test('successfully handles valid requests', async () => {
            const mockResponse = { data: 'test' };
            const mockRequest = jest.fn().mockResolvedValue(mockResponse);

            const result = await Api.handleRequest(mockRequest);

            expect(result).toBe(mockResponse);
        });

        test('handles errors through error handler', async () => {
            const originalError = new Error('Test error');
            const handledError = new AppError('Handled error', 'TEST_ERROR');

            ApiErrorHandler.handle.mockReturnValue(handledError);
            const mockRequest = jest.fn().mockRejectedValue(originalError);

            try {
                await Api.handleRequest(mockRequest);
                fail('Should have thrown an error');
            } catch (error) {
                expect(error).toBe(handledError);
                expect(ApiErrorHandler.handle).toHaveBeenCalledWith(originalError);
            }
        });
    });

    describe('API structure', () => {
        test('exposes all required services and utilities', () => {
            expect(Api.bill).toBeDefined();
            expect(Api.quote).toBeDefined();
            expect(Api.auth).toBeDefined();
            expect(Api.errorHandler).toBeDefined();
            expect(Api.config).toBeDefined();
        });
    });
});
