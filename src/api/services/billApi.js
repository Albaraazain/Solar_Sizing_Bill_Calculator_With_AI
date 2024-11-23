// src/api/services/billApi.js
import { BaseApiService } from '../base/BaseApiService.js';
import { API_CONFIG } from '../client/apiConfig.js';

export class BillApi extends BaseApiService {
    constructor() {
        super(API_CONFIG.ENDPOINTS.BILL.BASE);
    }

    async analyzeBill(referenceNumber) {
        return this.post(API_CONFIG.ENDPOINTS.BILL.ANALYZE, { referenceNumber });
    }

    async getBillDetails(referenceNumber) {
        return this.get(`${API_CONFIG.ENDPOINTS.BILL.GET}/${referenceNumber}`);
    }

    async getConsumptionHistory(referenceNumber) {
        return this.get(`${API_CONFIG.ENDPOINTS.BILL.GET}/${referenceNumber}/history`);
    }

    async validateReferenceNumber(referenceNumber) {
        try {
            const response = await this.post(`${API_CONFIG.ENDPOINTS.BILL.VALIDATE}`, { referenceNumber });
            if (response.status == 'success') {
                return {
                    valid: true,
                    message: response.message,
                    referenceNumber: response.reference_number
                };
            } else {
                return {
                    valid: false,
                    message: response.message,
                    referenceNumber: response.reference_number
                };
            }
        } catch (error) {
            console.error('Error validating reference number:', error);
            return {
                valid: false,
                message: 'Unable to validate reference number due to a network or server error.'
            };
        }
    }
    
}

export const billApi = new BillApi();
