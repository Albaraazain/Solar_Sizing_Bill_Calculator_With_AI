// jest.config.mjs
export default {
    testEnvironment: 'node',
    transform: {
        '^.+\\.m?js$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'mjs'],
    testMatch: ['**/__tests__/**/*.test.js'],
    transformIgnorePatterns: ['/node_modules/'],
    // Add moduleDirectories to help with imports
    moduleDirectories: ['node_modules', 'src'],
    // Handle ES modules
    extensionsToTreatAsEsm: [],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    }
};
