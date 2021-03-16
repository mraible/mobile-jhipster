import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Points e2e test', () => {
  let startingEntitiesCount = 0;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogin(oauth2Data, Cypress.env('E2E_USERNAME') || 'admin', Cypress.env('E2E_PASSWORD') || 'admin');
    });
    cy.intercept('GET', '/api/points*').as('entitiesRequest');
    cy.visit('');
    cy.clickOnEntityMenuItem('points');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  afterEach(() => {
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogout(oauth2Data);
    });
    cy.clearCache();
  });

  it('should load Points', () => {
    cy.intercept('GET', '/api/points*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('points');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Points').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Points page', () => {
    cy.intercept('GET', '/api/points*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('points');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('points');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Points page', () => {
    cy.intercept('GET', '/api/points*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('points');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Points');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Points page', () => {
    cy.intercept('GET', '/api/points*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('points');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Points');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Points', () => {
    cy.intercept('GET', '/api/points*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('points');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Points');

    cy.get(`[data-cy="date"]`).type('2021-03-15').should('have.value', '2021-03-15');

    cy.get(`[data-cy="exercise"]`).type('49604').should('have.value', '49604');

    cy.get(`[data-cy="meals"]`).type('54133').should('have.value', '54133');

    cy.get(`[data-cy="alcohol"]`).type('8866').should('have.value', '8866');

    cy.get(`[data-cy="notes"]`)
      .type('hacking killer Fantastic', { force: true })
      .invoke('val')
      .should('match', new RegExp('hacking killer Fantastic'));

    cy.setFieldSelectToLastOfEntity('user');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/points*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('points');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Points', () => {
    cy.intercept('GET', '/api/points*').as('entitiesRequest');
    cy.intercept('GET', '/api/points/*').as('dialogDeleteRequest');
    cy.intercept('DELETE', '/api/points/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('points');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('points').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/points*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('points');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
