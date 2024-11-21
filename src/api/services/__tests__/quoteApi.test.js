// src/api/services/__tests__/quoteApi.test.js
import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import { quoteApi } from '../quoteApi.js';
import axiosClient from '../../client/axiosClient.js';

jest.mock('../../client/axiosClient.js');

describe('QuoteApi', () => {
    const mockQuoteId = '123456789';
    const mockBillData = { referenceNumber: '123', consumption: 500 };
    const mockQuoteData = { systemSize: 5, cost: 10000 };
    const mockResponse = { success: true, data: {} };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('generateQuote sends correct request', async () => {
        axiosClient.post.mockResolvedValue(mockResponse);
        await quoteApi.generateQuote(mockBillData);

        expect(axiosClient.post).toHaveBeenCalledWith(
            '/quote/generate',
            mockBillData,
            {}
        );
    });

    test('getQuoteById sends correct request', async () => {
        axiosClient.get.mockResolvedValue(mockResponse);
        await quoteApi.getQuoteById(mockQuoteId);

        expect(axiosClient.get).toHaveBeenCalledWith(
            `/quote/${mockQuoteId}`,
            {}
        );
    });

    test('updateQuote sends correct request', async () => {
        axiosClient.put.mockResolvedValue(mockResponse);
        await quoteApi.updateQuote(mockQuoteId, mockQuoteData);

        expect(axiosClient.put).toHaveBeenCalledWith(
            `/quote/${mockQuoteId}`,
            mockQuoteData,
            {}
        );
    });

    test('saveQuote sends correct request', async () => {
        axiosClient.post.mockResolvedValue(mockResponse);
        await quoteApi.saveQuote(mockQuoteData);

        expect(axiosClient.post).toHaveBeenCalledWith(
            '/quote',
            mockQuoteData,
            {}
        );
    });

    test('handles API errors correctly', async () => {
        const mockError = {
            response: {
                status: 400,
                data: { message: 'Invalid quote data' }
            }
        };
        axiosClient.post.mockRejectedValue(mockError);

        await expect(quoteApi.generateQuote(mockBillData))
            .rejects
            .toMatchObject({
                code: 'BAD_REQUEST',
                message: 'Invalid quote data'
            });
    });
});
