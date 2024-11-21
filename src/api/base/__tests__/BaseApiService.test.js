// src/api/base/__tests__/BaseApiService.test.js
import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import { BaseApiService } from '../BaseApiService.js';
import axiosClient from '../../client/axiosClient.js';

// Mock dependencies
jest.mock('../../client/axiosClient.js');

// what this test is for is that we need to make sure that the base api service is able to make requests to the server using the axios client
// and that it is able to handle errors that may occur during the request
// we also need to make sure that the base api service is able to handle different types of requests such as get, post, put, and delete
// so in simple terms just an example: if we make a get request to the server, we should get a response from the server and if there is an error we should be able to handle it


describe('BaseApiService', () => {
    let service;
    const testEndpoint = '/test';
    const mockData = { test: 'data' };
    const mockResponse = { success: true };

    beforeEach(() => {
        service = new BaseApiService('/api');
        jest.clearAllMocks();
    });

    describe('HTTP Methods', () => {
        test('get method calls axios get with correct parameters', async () => {
            axiosClient.get.mockResolvedValue(mockResponse);

            const result = await service.get(testEndpoint);

            expect(axiosClient.get).toHaveBeenCalledWith('/api/test', {});
            expect(result).toBe(mockResponse);
        });

        test('post method calls axios post with correct parameters', async () => {
            axiosClient.post.mockResolvedValue(mockResponse);

            const result = await service.post(testEndpoint, mockData);

            expect(axiosClient.post).toHaveBeenCalledWith('/api/test', mockData, {});
            expect(result).toBe(mockResponse);
        });

        test('put method calls axios put with correct parameters', async () => {
            axiosClient.put.mockResolvedValue(mockResponse);

            const result = await service.put(testEndpoint, mockData);

            expect(axiosClient.put).toHaveBeenCalledWith('/api/test', mockData, {});
            expect(result).toBe(mockResponse);
        });

        test('delete method calls axios delete with correct parameters', async () => {
            axiosClient.delete.mockResolvedValue(mockResponse);

            const result = await service.delete(testEndpoint);

            expect(axiosClient.delete).toHaveBeenCalledWith('/api/test', {});
            expect(result).toBe(mockResponse);
        });
    });

    describe('Error Handling', () => {
        test('handles 400 error correctly', async () => {
            const errorResponse = {
                response: {
                    status: 400,
                    data: { message: 'Bad Request' }
                }
            };
            axiosClient.get.mockRejectedValue(errorResponse);

            try {
                await service.get(testEndpoint);
            } catch (error) {
                expect(error.code).toBe('BAD_REQUEST');
                expect(error.message).toBe('Bad Request');
            }
        });

        test('handles network error correctly', async () => {
            const networkError = new Error('Network Error');
            axiosClient.get.mockRejectedValue(networkError);

            try {
                await service.get(testEndpoint);
            } catch (error) {
                expect(error.code).toBe('NETWORK_ERROR');
                expect(error.message).toBe('Network error');
            }
        });
    });
});
