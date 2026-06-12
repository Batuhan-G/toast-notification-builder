/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts', 'vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(ts|js)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(scss|css)$': '<rootDir>/test/styleMock.cjs',
  },
  testMatch: ['**/__tests__/**/*.spec.ts'],
  // vue3-jest needs this to know the Vue version context
  testEnvironmentOptions: { customExportConditions: ['node', 'node-addons'] },
};
