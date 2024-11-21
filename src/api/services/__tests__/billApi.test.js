// src/api/services/__tests__/billApi.test.js
import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import { billApi } from '../billApi.js';
import { API_CONFIG } from '../../client/apiConfig.js';
import axiosClient from '../../client/axiosClient.js';

jest.mock('../../client/axiosClient.js');

describe('BillApi', () => {
    const mockReferenceNumber = '123456789';
    const mockResponse = { success: true, data: {} };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('analyzeBill sends correct request', async () => {
        axiosClient.post.mockResolvedValue(mockResponse);
        await billApi.analyzeBill(mockReferenceNumber);

        expect(axiosClient.post).toHaveBeenCalledWith(
            '/bill/analyze',
            { referenceNumber: mockReferenceNumber },
            {}
        );
    });

    test('getBillDetails sends correct request', async () => {
        axiosClient.get.mockResolvedValue(mockResponse);
        await billApi.getBillDetails(mockReferenceNumber);

        expect(axiosClient.get).toHaveBeenCalledWith(
            `/bill/${mockReferenceNumber}`,
            {}
        );
    });

    test('getConsumptionHistory sends correct request', async () => {
        axiosClient.get.mockResolvedValue(mockResponse);
        await billApi.getConsumptionHistory(mockReferenceNumber);

        expect(axiosClient.get).toHaveBeenCalledWith(
            `/bill/${mockReferenceNumber}/history`,
            {}
        );
    });

    test('validateReferenceNumber sends correct request', async () => {
        axiosClient.post.mockResolvedValue(mockResponse);
        await billApi.validateReferenceNumber(mockReferenceNumber);

        expect(axiosClient.post).toHaveBeenCalledWith(
            '/bill/validate',
            { referenceNumber: mockReferenceNumber },
            {}
        );
    });

    test('handles API errors correctly', async () => {
        const mockError = {
            response: {
                status: 400,
                data: { message: 'Invalid reference number' }
            }
        };
        axiosClient.post.mockRejectedValue(mockError);

        await expect(billApi.analyzeBill(mockReferenceNumber))
            .rejects
            .toMatchObject({
                code: 'BAD_REQUEST',
                message: 'Invalid reference number'
            });
    });
});
