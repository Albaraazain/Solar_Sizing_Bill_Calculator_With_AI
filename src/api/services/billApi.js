// src/api/services/billApi.js
import { BaseApiService } from '../base/BaseApiService.js';
import { API_CONFIG } from '../client/apiConfig.js';

class BillApi extends BaseApiService {
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
        return this.post(`${API_CONFIG.ENDPOINTS.BILL.VALIDATE}`, { referenceNumber });
    }
}

export const billApi = new BillApi();
