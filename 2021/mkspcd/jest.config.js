module.exports = {
  clearMocks: true,
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/.yarn/', '/dist/', '/tmp/'],
  watchPathIgnorePatterns: ['/.yarn/', '/dist/', '/tmp/'],
}
