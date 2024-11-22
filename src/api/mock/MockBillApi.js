// src/api/mock/MockBillApi.js
import { IApiService } from '../interfaces/IApiService.js';
import { MOCK_DATA } from './mockData.js';
import { AppError } from '/src/core/utils/ErrorHandler.js';


export class MockBillApi extends IApiService {
    constructor() {
        super();
        this.delay = 800; // Simulate network delay
    }

    async simulateDelay() {
        await new Promise(resolve => setTimeout(resolve, this.delay));
    }

    async getBillDetails(referenceNumber) {
        await this.simulateDelay();

        if (!referenceNumber) {
            throw new AppError(
                'Reference number is required',
                'VALIDATION_ERROR'
            );
        }

        const bill = MOCK_DATA.bills[referenceNumber];
        if (!bill) {
            throw new AppError(
                'Bill not found',
                'NOT_FOUND',
                { referenceNumber }
            );
        }

        return {
            success: true,
            data: bill
        };
    }



    async analyzeBill(referenceNumber) {
        await this.simulateDelay();

        if (!referenceNumber.match(/^\d{9}$/)) {
            throw new AppError(
                'Invalid reference number format',
                'VALIDATION_ERROR',
                { field: 'referenceNumber' }
            );
        }

        const bill = MOCK_DATA.bills[referenceNumber];
        if (!bill) {
            throw new AppError(
                'Bill not found',
                'NOT_FOUND',
                { referenceNumber }
            );
        }

        return {
            success: true,
            data: {
                ...bill,
                analysis: {
                    recommendedSystemSize: 5.0,
                    estimatedSavings: 15000,
                    paybackPeriod: 4.7
                }
            }
        };
    }

    async validateReferenceNumber(referenceNumber) {
        await this.simulateDelay();

        if (!referenceNumber.match(/^\d{9}$/)) {
            throw new AppError(
                'Invalid reference number format',
                'VALIDATION_ERROR',
                { field: 'referenceNumber' }
            );
        }

        return {
            success: true,
            data: {
                isValid: Boolean(MOCK_DATA.bills[referenceNumber])
            }
        };
    }
}
