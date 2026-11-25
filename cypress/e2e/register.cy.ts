// Parcours E2E : inscription d'un nouvel agent.
// L'API est simulée avec cy.intercept : le back n'a pas besoin de tourner.
describe('Inscription', () => {

  it('inscrit un agent puis redirige vers la page de connexion', () => {
    // GIVEN : l'API d'inscription répond 201 (créé)
    cy.intercept('POST', '/api/register', { statusCode: 201, body: {} }).as('register');
    // L'inscription réussie affiche une alerte : on la remplace pour qu'elle ne bloque pas le test
    cy.visit('/register', {
      onBeforeLoad(win) {
        cy.stub(win, 'alert');
      },
    });

    // WHEN : je remplis le formulaire et je valide
    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="login"]').type('john');
    cy.get('input[formControlName="password"]').type('secret');
    cy.contains('button', 'Register').click();

    // THEN : la requête envoie bien l'agent, et j'arrive sur /login
    cy.wait('@register').its('request.body').should('deep.equal', {
      firstName: 'John', lastName: 'Doe', login: 'john', password: 'secret',
    });
    cy.url().should('include', '/login');
  });
});
