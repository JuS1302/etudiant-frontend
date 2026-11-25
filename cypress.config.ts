import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Adresse du front lancé avec "npm run start:e2e" : chaque cy.visit('/...') part de là
    baseUrl: 'http://localhost:4200',
    // Les fichiers de test E2E se terminent par .cy.ts
    specPattern: 'cypress/e2e/**/*.cy.ts',
    // Fichier chargé avant les tests : il collecte la couverture dans le navigateur
    supportFile: 'cypress/support/e2e.ts',
    // Pas de vidéo des tests : plus rapide
    video: false,

    /**
     * Branche le plugin de couverture : à la fin des tests, il fusionne les lignes exécutées
     * et génère le rapport dans coverage-e2e/ (réglages dans .nycrc.json).
     */
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
  },
});
