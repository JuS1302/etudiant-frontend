// Parcours E2E : les écrans étudiants (liste, ajout, détail, modification, suppression).
// L'API est simulée avec cy.intercept : le back n'a pas besoin de tourner.
describe('Écrans étudiants', () => {

  const marie = {
    id: 1, firstName: 'Marie', lastName: 'Curie', email: 'marie@test.fr',
    createdAt: '2026-11-25T10:00:00', updatedAt: '2026-11-25T10:00:00',
  };
  const pierre = {
    id: 2, firstName: 'Pierre', lastName: 'Curie', email: 'pierre@test.fr',
    createdAt: '2026-11-25T10:00:00', updatedAt: '2026-11-25T10:00:00',
  };

  /**
   * Ouvre une page en étant déjà connectée : on range un faux token avant le chargement,
   * pour que le guard laisse passer.
   */
  function visitAsLoggedIn(url: string) {
    cy.visit(url, {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-token');
      },
    });
  }

  it('affiche la liste des étudiants', () => {
    // GIVEN : l'API renvoie 2 étudiants
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [marie, pierre] });

    // WHEN
    visitAsLoggedIn('/students');

    // THEN : une ligne par étudiant dans le tableau
    cy.get('tbody tr').should('have.length', 2);
    cy.get('tbody tr').eq(0).should('contain', 'Marie');
    cy.get('tbody tr').eq(1).should('contain', 'Pierre');
  });

  it('ajoute un étudiant puis affiche son détail', () => {
    // GIVEN : la liste est vide, la création renvoie Marie, et son détail aussi
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] });
    cy.intercept('POST', '/api/students', { statusCode: 201, body: marie }).as('create');
    cy.intercept('GET', '/api/students/1', { statusCode: 200, body: marie });
    visitAsLoggedIn('/students');

    // WHEN : je clique sur « Ajouter un étudiant », je remplis le formulaire et j'enregistre
    cy.contains('Ajouter un étudiant').click();
    cy.get('input[formControlName="firstName"]').type('Marie');
    cy.get('input[formControlName="lastName"]').type('Curie');
    cy.get('input[formControlName="email"]').type('marie@test.fr');
    cy.contains('button', 'Enregistrer').click();

    // THEN : l'étudiant est envoyé, et j'arrive sur son détail
    cy.wait('@create').its('request.body').should('deep.equal', {
      firstName: 'Marie', lastName: 'Curie', email: 'marie@test.fr',
    });
    cy.url().should('include', '/students/1');
    cy.contains('marie@test.fr');
  });

  it('affiche le détail d\'un étudiant', () => {
    // GIVEN : l'API renvoie Marie
    cy.intercept('GET', '/api/students/1', { statusCode: 200, body: marie });

    // WHEN
    visitAsLoggedIn('/students/1');

    // THEN : ses informations sont affichées
    cy.contains('Détail de l\'étudiant');
    cy.contains('Marie');
    cy.contains('marie@test.fr');
  });

  it('modifie un étudiant puis affiche son détail', () => {
    // GIVEN : l'API renvoie Marie, et la modification renvoie Marie avec son nouveau nom
    const marieModified = { ...marie, lastName: 'Sklodowska-Curie' };
    cy.intercept('GET', '/api/students/1', { statusCode: 200, body: marie });
    cy.intercept('PUT', '/api/students/1', { statusCode: 200, body: marieModified }).as('update');
    visitAsLoggedIn('/students/1/edit');

    // WHEN : je change le nom et j'enregistre
    cy.get('input[formControlName="lastName"]').should('have.value', 'Curie').clear().type('Sklodowska-Curie');
    cy.contains('button', 'Enregistrer').click();

    // THEN : les nouvelles valeurs sont envoyées, et j'arrive sur le détail
    cy.wait('@update').its('request.body').should('deep.equal', {
      firstName: 'Marie', lastName: 'Sklodowska-Curie', email: 'marie@test.fr',
    });
    cy.url().should('match', /\/students\/1$/);
  });

  it('supprime un étudiant depuis la liste', () => {
    // GIVEN : l'API renvoie 2 étudiants, et la suppression répond 204
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [marie, pierre] });
    cy.intercept('DELETE', '/api/students/1', { statusCode: 204 }).as('delete');
    visitAsLoggedIn('/students');
    // On accepte automatiquement la fenêtre « Supprimer Marie Curie ? »
    cy.on('window:confirm', () => true);

    // WHEN : je clique sur « Supprimer » sur la ligne de Marie
    cy.get('tbody tr').eq(0).contains('button', 'Supprimer').click();

    // THEN : la requête DELETE part, et il ne reste que Pierre
    cy.wait('@delete');
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr').eq(0).should('contain', 'Pierre');
  });

  it('supprime un étudiant depuis son détail puis revient à la liste', () => {
    // GIVEN : l'API renvoie Marie, la suppression répond 204, puis la liste est vide
    cy.intercept('GET', '/api/students/1', { statusCode: 200, body: marie });
    cy.intercept('DELETE', '/api/students/1', { statusCode: 204 }).as('delete');
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] });
    visitAsLoggedIn('/students/1');
    cy.on('window:confirm', () => true);

    // WHEN
    cy.contains('button', 'Supprimer').click();

    // THEN : la requête DELETE part, et je reviens sur la liste
    cy.wait('@delete');
    cy.url().should('match', /\/students$/);
  });
});
