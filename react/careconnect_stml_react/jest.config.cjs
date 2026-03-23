module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.js"],
  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.[jt]s?(x)"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$": "<rootDir>/src/test/fileMock.js",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/__tests__/**",
    "!src/test/**",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov"],
};