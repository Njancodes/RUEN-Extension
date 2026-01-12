export default {
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        url: 'http://localhost',
        pretendToBeVisual: true
    },
    setupFilesAfterEnv: ['/home/nijo/CODe/JS/RUEN/RUEN-Extension/jest.setup.js'],
    moduleFileExtensions: ['js'],
    moduleDirectories: ['node_modules', '/home/nijo/CODe/JS/RUEN/RUEN-Extension'],
    testMatch: ['**/__tests__/**/*.test.js'],

    transform: {
        '^.+\\.js$': 'babel-jest'
    },

    collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**',
        '!**/dist/**',
        '!**/jest.config.js',
        '!**/__tests__/**'
    ]
};