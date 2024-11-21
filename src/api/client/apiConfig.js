// src/api/client/apiConfig.js
export const API_CONFIG = {
    BASE_URL: process.env.API_URL || 'http://localhost:3000/api',
    TIMEOUT: 10000,
    ENDPOINTS: {
        BILL: {
            ANALYZE: '/bill/analyze',
            GET: '/bill',
        },
        QUOTE: {
            GENERATE: '/quote/generate',
            GET: '/quote',
        }
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};
