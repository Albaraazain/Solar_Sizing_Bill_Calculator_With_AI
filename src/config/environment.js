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

export const ENV = environments[process.env.NODE_ENV || 'development'];

// Freeze to prevent modifications
Object.freeze(ENV);
