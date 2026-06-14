/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts', 'vue'],
  transform: {
    '^.+\\.vue$': '<rootDir>/test/vueTransformer.cjs',
    '^.+\\.(ts|js)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(scss|css)$': '<rootDir>/test/styleMock.cjs',
  },
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  testEnvironmentOptions: { customExportConditions: ['node', 'node-addons'] },
}
