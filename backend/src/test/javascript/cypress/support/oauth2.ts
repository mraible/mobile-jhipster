/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />

Cypress.Commands.add('getOauth2Data', () => {
  cy.request({
    method: 'GET',
    url: '/oauth2/authorization/oidc',
    followRedirect: false,
  }).then(response => {
    const url = new URL(response.headers['location']);
    const clientId = url.searchParams.get('client_id');
    const responseType = url.searchParams.get('response_type');
    const redirectUri = url.searchParams.get('redirect_uri');
    const nonce = url.searchParams.get('nonce');
    const state = url.searchParams.get('state');
    const scope = url.searchParams.get('scope');
    const origin = url.origin;
    const authenticationUrl = `${origin}${url.pathname}`;
    const isOkta = origin.includes('okta');

    let logoutUrl = '';
    if (isOkta) {
      logoutUrl = `${origin}${url.pathname.split('/', 2).join('/')}/v1/logout`;
    } else {
      logoutUrl = `${origin}${url.pathname.split('/', 4).join('/')}/protocol/openid-connect/logout`;
    }

    const data = {
      url,
      clientId,
      responseType,
      scope,
      redirectUri,
      nonce,
      state,
      authenticationUrl,
      logoutUrl,
      isOkta,
    };
    cy.wrap(data).as('oauth2Data');
  });
});

Cypress.Commands.add('oauthLogin', (oauth2Data: any, username: string, password: string) => {
  if (oauth2Data.isOkta) {
    cy.oktaLogin(username, password);
  } else {
    cy.keycloakLogin(oauth2Data, username, password);
  }
});

Cypress.Commands.add('keycloakLogin', (oauth2Data: any, username: string, password: string) => {
  cy.request({
    url: `${oauth2Data.url}`,
    followRedirect: false,
  })
    .then(response => {
      const html = document.createElement('html');
      html.innerHTML = response.body;

      const form = html.getElementsByTagName('form')[0];
      const url = form.action;
      return cy.request({
        method: 'POST',
        url,
        followRedirect: false,
        form: true,
        body: {
          username: username,
          password: password,
        },
      });
    })
    .then(() => {
      cy.request({
        method: 'GET',
        url: '/oauth2/authorization/oidc',
        followRedirect: true,
      }).then(() => {
        cy.visit('/');
      });
    });
});

Cypress.Commands.add('oktaLogin', (username, password) => {
  cy.task('login', {
    baseUrl: Cypress.config().baseUrl,
    username: username,
    password: password,
  }).then((cookies: Array<any>) => {
    cookies.forEach(c => {
      const name = c.name;
      const value = c.value;
      const options = {
        ...c,
      };
      cy.setCookie(name, value, options);
    });
    cy.visit('/');
  });
});

Cypress.Commands.add('oauthLogout', (oauth2Data: any) => {
  if (oauth2Data.isOkta) {
    cy.task('logout').then(cookies => {
      cy.clearCookies();
    });
  } else {
    return cy.request({
      url: `${oauth2Data.logoutUrl}`,
    });
  }
});

Cypress.Commands.add('clearCache', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then(win => {
    win.sessionStorage.clear();
  });
});

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      getOauth2Data(): Cypress.Chainable;
      oauthLogin(oauth2Data: any, username: string, password: string): Cypress.Chainable;
      keycloakLogin(oauth2Data: any, username: string, password: string): Cypress.Chainable;
      oktaLogin(username: string, password: string): Cypress.Chainable;
      oauthLogout(oauth2Data: any): Cypress.Chainable;
      clearCache(): Cypress.Chainable;
    }
  }
}

// Convert this to a module instead of script (allows import/export)
export {};
