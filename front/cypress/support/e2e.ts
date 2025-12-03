// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Setup global API mocks if useMocks is enabled
// This ensures interceptors are available for all tests
beforeEach(() => {
  const useMocks = Cypress.env('useMocks');
  if (useMocks) {
    const apiUrl = Cypress.env('apiUrl') || 'http://localhost:3010';
    const keycloakUrl = Cypress.env('keycloakUrl') || 'https://keycloak-production-7751.up.railway.app';

    // Setup API mocks - intercept ALL calls to the API
    // Use both specific URL and wildcard patterns to ensure we catch everything
    
    // Intercept GET /shipping/transport-methods
    cy.intercept('GET', `${apiUrl}/shipping/transport-methods*`, { fixture: 'mock-transport-methods.json' }).as('getTransportMethods');
    cy.intercept('GET', '**/shipping/transport-methods*', { fixture: 'mock-transport-methods.json' });
    
    // Intercept POST /shipping/cost
    cy.intercept('POST', `${apiUrl}/shipping/cost*`, { fixture: 'mock-shipping-cost.json' }).as('calculateCost');
    cy.intercept('POST', '**/shipping/cost*', { fixture: 'mock-shipping-cost.json' });
    
    // Intercept POST /shipping (for creation - must check it's not /cost)
    cy.intercept('POST', `${apiUrl}/shipping`, (req) => {
      if (!req.url.includes('/shipping/cost')) {
        req.reply({ fixture: 'mock-shipping-create.json' });
      }
    }).as('createShipping');
    cy.intercept('POST', '**/shipping', (req) => {
      if (!req.url.includes('/shipping/cost')) {
        req.reply({ fixture: 'mock-shipping-create.json' });
      }
    });
    
    // Intercept GET /shipping/{id} (for detail - must check it's not transport-methods)
    cy.intercept('GET', `${apiUrl}/shipping/*`, (req) => {
      if (!req.url.includes('transport-methods')) {
        req.reply({ fixture: 'mock-shipping-detail.json' });
      }
    }).as('getShippingDetail');
    cy.intercept('GET', '**/shipping/*', (req) => {
      if (!req.url.includes('transport-methods')) {
        req.reply({ fixture: 'mock-shipping-detail.json' });
      }
    });
    
    // Intercept PATCH /shipping/*/status
    cy.intercept('PATCH', `${apiUrl}/shipping/*/status*`, { statusCode: 200, body: { success: true } }).as('updateShippingStatus');
    cy.intercept('PATCH', '**/shipping/*/status*', { statusCode: 200, body: { success: true } });

    // Mock Keycloak redirects and responses
    cy.intercept('GET', `${keycloakUrl}/realms/**/protocol/openid-connect/auth*`, (req) => {
      req.redirect('http://localhost:3000/?code=mock-auth-code');
    }).as('keycloakAuth');

    cy.intercept('POST', `${keycloakUrl}/realms/**/protocol/openid-connect/token*`, {
      statusCode: 200,
      body: {
        access_token: 'mock-jwt-token-for-testing',
        refresh_token: 'mock-refresh-token',
        id_token: 'mock-id-token',
        expires_in: 3600,
      },
    }).as('keycloakToken');
  }
});