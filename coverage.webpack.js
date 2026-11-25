// Réglage webpack utilisé UNIQUEMENT par "npm run start:e2e" (cible serve-e2e de angular.json).
// Il « marque » (instrumente) le code de src/ pour compter les lignes exécutées pendant les tests Cypress.
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        loader: '@jsdevtools/coverage-istanbul-loader',
        options: { esModules: true },
        // "post" : on marque le code APRÈS sa traduction TypeScript → JavaScript
        enforce: 'post',
        include: path.join(__dirname, 'src'),
        // On ne compte pas les fichiers de tests Jest
        exclude: [/\.spec\.ts$/, /node_modules/],
      },
    ],
  },
};
