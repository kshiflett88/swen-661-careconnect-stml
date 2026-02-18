module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.tsx"],
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/e2e/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/types.ts",
    "!src/**/navigation/types.ts",
    "!src/**/index.ts",
  ],
  coverageReporters: ["text", "lcov"],
};