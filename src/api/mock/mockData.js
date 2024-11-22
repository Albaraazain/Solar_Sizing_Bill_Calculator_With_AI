// src/api/mock/mockData.js
export const MOCK_DATA = {
    bills: {
        "123456789": {
            referenceNumber: "123456789",
            customerName: "John Doe",
            address: "123 Solar Street, Sunny City",
            phoneNumber: "+92 300 1234567",
            issueDate: "2024-03-01",
            dueDate: "2024-03-15",
            unitsConsumed: 500,
            ratePerUnit: 21.0,
            amount: 10500,
            taxRate: 17.5,
            taxAmount: 1837.50,
            totalAmount: 12337.50,
            monthlyAverage: 450,
            previousMonthlyAverage: 430,
            peakUsage: 600,
            previousPeakUsage: 580,
            efficiency: 85,
            previousEfficiency: 82,
            consumptionHistory: [
                { month: "Oct", usage: 430 },
                { month: "Nov", usage: 450 },
                { month: "Dec", usage: 480 },
                { month: "Jan", usage: 500 },
                { month: "Feb", usage: 520 },
                { month: "Mar", usage: 500 }
            ]
        }
    },
    quotes: {
        "Q123456": {
            quoteId: "Q123456",
            referenceNumber: "123456789",
            systemSize: 5,
            panelCount: 14,
            estimatedProduction: 7300,
            estimatedSavings: 180000,
            cost: 850000,
            paybackPeriod: 4.7,
            roofArea: 280,
            co2Offset: 5.2
        }
    }
};
