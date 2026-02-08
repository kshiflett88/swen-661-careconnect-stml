module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/types.ts",
    "!src/**/navigation/types.ts",
    "!src/**/index.ts",
  ],
  coverageReporters: ["text", "lcov"],
};