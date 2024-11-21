// src/api/client/__tests__/axiosClient.test.js
import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import axiosClient from '../axiosClient.js';
import { eventBus } from '../../../core/events/EventBus.js';
import { ErrorHandler } from '../../../core/utils/ErrorHandler.js';

// Mock dependencies
jest.mock('../../../core/events/EventBus.js');
jest.mock('../../../core/utils/ErrorHandler.js');

// what this tests for is that the axios client adds the token to the request headers
// when it is available in the local storage
// meaning that the client is able to handle authenticated requests
// it also tests that the client handles unauthorized responses
// and request errors

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();
Object.defineProperty(global, 'localStorage', {
    value: localStorageMock
});

describe('Axios Client', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('adds auth token to request headers when available', async () => {
        const token = 'test-token';
        localStorage.setItem('token', token);

        const config = { headers: {} };
        const modifiedConfig = await axiosClient.interceptors.request.handlers[0].fulfilled(config);

        expect(modifiedConfig.headers.Authorization).toBe(`Bearer ${token}`);
    });

    test('handles unauthorized response', async () => {
        const error = {
            response: { status: 401 }
        };

        try {
            await axiosClient.interceptors.response.handlers[0].rejected(error);
        } catch (e) {
            expect(eventBus.publish).toHaveBeenCalledWith('auth:unauthorized');
            expect(ErrorHandler.handle).toHaveBeenCalledWith(error);
        }
    });

    test('handles request errors', async () => {
        const error = new Error('Network Error');

        try {
            await axiosClient.interceptors.request.handlers[0].rejected(error);
        } catch (e) {
            expect(ErrorHandler.handle).toHaveBeenCalledWith(error);
        }
    });
});
