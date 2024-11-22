// src/api/factory/ApiFactory.js
import { ENV } from '/src/config/environment.js';
import { MockBillApi } from '../mock/MockBillApi.js';
import { MockQuoteApi } from '../mock/MockQuoteApi.js';
import { BillApi } from '../services/billApi.js';
import { QuoteApi } from '../services/quoteApi.js';

export class ApiFactory {
    static createBillApi() {
        return ENV.USE_MOCK_API ? new MockBillApi() : new BillApi();
    }

    static createQuoteApi() {
        return ENV.USE_MOCK_API ? new MockQuoteApi() : new QuoteApi();
    }
}
