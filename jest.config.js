module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^.+\\.(css|scss)$': 'identity-obj-proxy',
    },
    testPathIgnorePatterns: [
        '/node_modules/',
        '/.next/'
    ],
}; 
