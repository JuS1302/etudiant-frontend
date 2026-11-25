import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Adresse du front lancé avec "npm start" : chaque cy.visit('/...') part de là
    baseUrl: 'http://localhost:4200',
    // Les fichiers de test E2E se terminent par .cy.ts
    specPattern: 'cypress/e2e/**/*.cy.ts',
    // Pas de fichier de commandes partagées pour l'instant
    supportFile: false,
    // Pas de vidéo des tests : plus rapide
    video: false,
  },
});
