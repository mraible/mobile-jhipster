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

describe('BloodPressure e2e test', () => {
  let startingEntitiesCount = 0;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogin(oauth2Data, Cypress.env('E2E_USERNAME') || 'admin', Cypress.env('E2E_PASSWORD') || 'admin');
    });
    cy.intercept('GET', '/api/blood-pressures*').as('entitiesRequest');
    cy.visit('');
    cy.clickOnEntityMenuItem('blood-pressure');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  afterEach(() => {
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogout(oauth2Data);
    });
    cy.clearCache();
  });

  it('should load BloodPressures', () => {
    cy.intercept('GET', '/api/blood-pressures*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('blood-pressure');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('BloodPressure').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details BloodPressure page', () => {
    cy.intercept('GET', '/api/blood-pressures*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('blood-pressure');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('bloodPressure');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create BloodPressure page', () => {
    cy.intercept('GET', '/api/blood-pressures*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('blood-pressure');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('BloodPressure');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit BloodPressure page', () => {
    cy.intercept('GET', '/api/blood-pressures*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('blood-pressure');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('BloodPressure');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of BloodPressure', () => {
    cy.intercept('GET', '/api/blood-pressures*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('blood-pressure');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('BloodPressure');

    cy.get(`[data-cy="timestamp"]`).type('2021-03-17T11:30').invoke('val').should('equal', '2021-03-17T11:30');

    cy.get(`[data-cy="systolic"]`).type('46531').should('have.value', '46531');

    cy.get(`[data-cy="diastolic"]`).type('33005').should('have.value', '33005');

    cy.setFieldSelectToLastOfEntity('user');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/blood-pressures*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('blood-pressure');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of BloodPressure', () => {
    cy.intercept('GET', '/api/blood-pressures*').as('entitiesRequest');
    cy.intercept('GET', '/api/blood-pressures/*').as('dialogDeleteRequest');
    cy.intercept('DELETE', '/api/blood-pressures/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('blood-pressure');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('bloodPressure').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/blood-pressures*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('blood-pressure');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
