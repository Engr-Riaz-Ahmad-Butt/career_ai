/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            isolatedModules: true,
        }],
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
};
