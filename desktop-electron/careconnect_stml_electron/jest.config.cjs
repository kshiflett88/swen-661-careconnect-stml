/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)', '**/*.jest.test.(ts|tsx)'],
  collectCoverageFrom: [
    'src/components/SignInView.tsx',
    'src/components/SignInHelpView.tsx',
    'src/components/ConfirmDialog.tsx',
    'electron/main.ts',
    'electron/preload.ts',
  ],
  coverageDirectory: '<rootDir>/coverage-jest',
  coverageReporters: ['text', 'html', 'lcov'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }],
  },
};
