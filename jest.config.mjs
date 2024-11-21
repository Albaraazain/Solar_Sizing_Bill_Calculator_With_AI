// jest.config.mjs
export default {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.m?js$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'mjs'],
    testMatch: ['**/__tests__/**/*.test.js'],
    transformIgnorePatterns: ['/node_modules/'],
    moduleDirectories: ['node_modules', 'src'],
    extensionsToTreatAsEsm: [],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    }
};
