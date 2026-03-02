/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src", "<rootDir>/electron", "<rootDir>/tests"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest/setupTests.ts", "<rootDir>/src/test/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testMatch: ["**/*.test.ts", "**/*.test.tsx", "**/__tests__/**/*.(test|spec).(ts|tsx)", "**/*.jest.test.(ts|tsx)"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "electron/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/main.tsx",
    "!src/ipc/**",
  ],
  coverageDirectory: "<rootDir>/coverage-jest",
  coverageReporters: ["text", "html", "lcov"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.jest.json",
      },
    ],
  },
};
