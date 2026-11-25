module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts|js)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  collectCoverage: true,
  // Compte TOUS les fichiers de l'application, même ceux qu'aucun test n'ouvre encore
  // (sans ça, Jest ne mesure que les fichiers importés par un test, et le pourcentage est trompeur).
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/core/models/**',
    '!src/app/core/service/user-mock.service.ts',
  ],
  coverageReporters: ['html', 'text-summary'],
};
