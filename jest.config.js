/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // preset: "ts-jest",
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  modulePathIgnorePatterns: ["<rootDir>/vendor/"],
  transform: {
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ["/node_modules/(?!(d3-selection)).+\\.js$"],
};
