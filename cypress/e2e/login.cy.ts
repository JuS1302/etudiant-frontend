// Parcours E2E : connexion, déconnexion et protection des écrans (guard).
// L'API est simulée avec cy.intercept : le back n'a pas besoin de tourner.
describe('Connexion', () => {

  it('connecte l\'agent puis affiche la liste des étudiants', () => {
    // GIVEN : l'API de connexion renvoie un token, et la liste des étudiants est vide
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'fake-token' } }).as('login');
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] });
    cy.visit('/login');

    // WHEN : je saisis mes identifiants et je valide
    cy.get('input[formControlName="login"]').type('john');
    cy.get('input[formControlName="password"]').type('secret');
    cy.contains('button', 'Login').click();

    // THEN : les identifiants sont envoyés, j'arrive sur /students et la barre affiche « Déconnexion »
    cy.wait('@login').its('request.body').should('deep.equal', { login: 'john', password: 'secret' });
    cy.url().should('include', '/students');
    cy.contains('nav', 'Déconnexion');
  });

  it('déconnecte l\'agent et le renvoie vers la page de connexion', () => {
    // GIVEN : je suis connectée (un token est déjà rangé)
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] });
    cy.visit('/students', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-token');
      },
    });

    // WHEN : je clique sur « Déconnexion »
    cy.contains('button', 'Déconnexion').click();

    // THEN : j'arrive sur /login et la barre propose à nouveau « Connexion »
    cy.url().should('include', '/login');
    cy.contains('nav', 'Connexion');
  });

  it('renvoie vers la page de connexion si on ouvre /students sans être connecté', () => {
    // WHEN : j'ouvre la liste sans token
    cy.visit('/students');

    // THEN : le guard me redirige vers /login
    cy.url().should('include', '/login');
  });
});
