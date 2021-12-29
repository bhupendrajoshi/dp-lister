/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts)$",
  collectCoverageFrom : ["**/*.ts"],
  coveragePathIgnorePatterns: ["node_modules", "dist"]
};
