export default {
    transform: {
        '^.+\\.m?js$': 'babel-jest'
    },
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'mjs'],
    testMatch: ['**/__tests__/**/*.test.js'],
    transformIgnorePatterns: ['/node_modules/'],
}
