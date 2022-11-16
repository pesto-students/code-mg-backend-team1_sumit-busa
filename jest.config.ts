const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./mocks.ts'],
  // testPathIgnorePatterns: ['tests/integration', 'build'],
  modulePathIgnorePatterns: ['<rootDir>/src/tests/integration', '<rootDir>/build'],
  testEnvironmentOptions: {
    NODE_ENV: 'test',
    APP_ENV: 'test',
  },
  moduleNameMapper: {
    '@/(.*)': 'src/$1',
  },

  modulePaths: ['node_modules', '.'],
  restoreMocks: true,
  coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/app.ts', 'tests'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
}

export default config
