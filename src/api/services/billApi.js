// src/api/services/billApi.js
import axios from 'axios';
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
            const payload = { referenceNumber };
            console.log('Sending payload:', payload);  // Log the payload
            const response = await axios.post('http://localhost:8000/api/bill/validate/', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.isValid) {
                console.log('Reference number is valid');
                console.log(response.data);
            } else {
                console.error('Reference number is invalid:', response.data.error);
            }
            return response.data;
        } catch (error) {
            console.error('Error validating reference number:', error);
            throw error;
        }
    }
    
}

export const billApi = new BillApi();
