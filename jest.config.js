/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  modulePathIgnorePatterns: ["<rootDir>/vendor/"],
  transform: {
    "^.+\\.(js|jsx)?$": "babel-jest",
    "^.+\\.(ts|tsx)?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!d3-color|d3-dispatch|d3-drag|d3-ease|d3-hierarchy|d3-interpolate|d3-path|d3-selection|d3-shape|d3-timer|d3-transition|d3-zoom|uuid)",
  ],
};
