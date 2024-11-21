// src/config/environment.js

const environments = {
    development: {
        API_URL: 'http://localhost:3000/api',
        DEBUG: true,
        VERSION: '1.0.0'
    },
    production: {
        API_URL: 'https://api.production.com',
        DEBUG: false,
        VERSION: '1.0.0'
    },
    test: {
        API_URL: 'http://localhost:3000/api',
        DEBUG: true,
        VERSION: 'test'
    }
};

export const ENV = {
    DEBUG: process.env.NODE_ENV !== 'production',
    API_URL: process.env.API_URL || 'http://localhost:3000',
    VERSION: '1.0.0'
};

// Freeze to prevent modifications
Object.freeze(ENV);
