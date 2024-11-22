// src/api/mock/MockQuoteApi.js
import { IApiService } from '../interfaces/IApiService.js';
import { MOCK_DATA } from './mockData.js';
import { AppError } from '../../core/utils/ErrorHandler.js';

export class MockQuoteApi extends IApiService {
    constructor() {
        super();
        this.delay = 800;
    }

    async simulateDelay() {
        await new Promise(resolve => setTimeout(resolve, this.delay));
    }

    async generateQuote(billData) {
        await this.simulateDelay();

        if (!billData.referenceNumber) {
            throw new AppError(
                'Reference number is required',
                'VALIDATION_ERROR'
            );
        }

        const quoteId = `Q${Date.now().toString().slice(-6)}`;
        const quote = {
            quoteId,
            referenceNumber: billData.referenceNumber,
            systemSize: 5.0,
            panelCount: 14,
            estimatedProduction: 7300,
            estimatedSavings: 180000,
            cost: 850000,
            paybackPeriod: 4.7,
            roofArea: 280,
            co2Offset: 5.2
        };

        MOCK_DATA.quotes[quoteId] = quote;

        return {
            success: true,
            data: quote
        };
    }

    async getQuoteById(quoteId) {
        await this.simulateDelay();

        const quote = MOCK_DATA.quotes[quoteId];
        if (!quote) {
            throw new AppError(
                'Quote not found',
                'NOT_FOUND',
                { quoteId }
            );
        }

        return {
            success: true,
            data: quote
        };
    }

    async saveQuote(quote) {
        await this.simulateDelay();

        if (!quote.quoteId) {
            throw new AppError(
                'Quote ID is required',
                'VALIDATION_ERROR'
            );
        }

        MOCK_DATA.quotes[quote.quoteId] = {
            ...MOCK_DATA.quotes[quote.quoteId],
            ...quote
        };

        return {
            success: true,
            data: MOCK_DATA.quotes[quote.quoteId]
        };
    }
}
