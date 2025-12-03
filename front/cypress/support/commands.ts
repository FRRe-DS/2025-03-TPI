/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Mock authentication by setting Keycloak data in localStorage
 * This simulates a logged-in user without actually calling Keycloak
 */
function mockKeycloakAuth(username: string = 'alejo') {
  cy.fixture('mock-auth').then((authData) => {
    // Set Keycloak token and user info in localStorage
    // The AuthContext will check for this when window.Cypress is true
    const keycloakData = {
      token: authData.token,
      refreshToken: authData.refreshToken,
      idToken: authData.token,
      tokenParsed: {
        sub: authData.user.id,
        preferred_username: authData.user.username,
        email: authData.user.email,
        exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
      },
      refreshTokenParsed: {
        exp: Math.floor(Date.now() / 1000) + 7200, // Expires in 2 hours
      },
      timeSkew: 0,
      authenticated: true,
    };

    // Store in localStorage - AuthContext will check for 'keycloakCypress'
    cy.window().then((win) => {
      win.localStorage.setItem('keycloakCypress', JSON.stringify(keycloakData));
    });
  });
}

/**
 * Setup API mocks for backend endpoints
 */
function setupApiMocks() {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:3010';

  // Mock shipping cost calculation
  cy.intercept('POST', `${apiUrl}/shipping/cost`, { fixture: 'mock-shipping-cost.json' }).as('calculateCost');

  // Mock shipping creation
  cy.intercept('POST', `${apiUrl}/shipping`, { fixture: 'mock-shipping-create.json' }).as('createShipping');

  // Mock shipping detail query
  cy.intercept('GET', `${apiUrl}/shipping/*`, { fixture: 'mock-shipping-detail.json' }).as('getShippingDetail');

  // Mock shipping status update
  cy.intercept('PATCH', `${apiUrl}/shipping/*/status`, { statusCode: 200, body: { success: true } }).as('updateShippingStatus');
}

/**
 * Mock Keycloak redirects and responses
 */
function mockKeycloakRedirects() {
  const keycloakUrl = Cypress.env('keycloakUrl') || 'https://keycloak-production-7751.up.railway.app';

  // Intercept Keycloak authorization requests - be specific to avoid redirect loops
  cy.intercept('GET', `${keycloakUrl}/realms/**/protocol/openid-connect/auth*`, (req) => {
    // Simulate successful auth redirect back to app
    req.redirect('http://localhost:3000/?code=mock-auth-code');
  }).as('keycloakAuth');

  // Intercept Keycloak token requests
  cy.intercept('POST', `${keycloakUrl}/realms/**/protocol/openid-connect/token`, {
    statusCode: 200,
    body: {
      access_token: 'mock-jwt-token-for-testing',
      refresh_token: 'mock-refresh-token',
      id_token: 'mock-id-token',
      expires_in: 3600,
    },
  }).as('keycloakToken');
}

// Custom login command with session caching
// Uses mocking if useMocks is true (CI mode or forced via CYPRESS_USE_MOCKS)
Cypress.Commands.add('login', (username?: string, password?: string) => {
  const user = username || 'alejo';
  const pass = password || '123';
  const useMocks = Cypress.env('useMocks');

  cy.session(
    `keycloak-${user}-${useMocks ? 'mock' : 'real'}`,
    () => {
      if (useMocks) {
        // CI Mode: Mock authentication
        cy.log('🔧 Using mocked authentication (CI mode)');

        // Mock Keycloak redirects (API mocks are set up globally in e2e.ts)
        mockKeycloakRedirects();

        // Mock the Keycloak authentication first
        mockKeycloakAuth(user);

        // Visit the home page - AuthContext will detect Cypress and use mocked auth
        cy.visit('http://localhost:3000/', {
          onBeforeLoad(win) {
            // Ensure Cypress is available in window for AuthContext detection
            (win as any).Cypress = true;
          },
        });

        // Wait for the app to initialize and process the mocked auth
        cy.wait(1000);

        // Verify we're logged in (the app should detect the mocked auth)
        cy.contains('Cerrar Sesión', { timeout: 10000 }).should('exist');
      } else {
        // Development Mode: Real Keycloak authentication
        cy.log('🔐 Using real Keycloak authentication');

        // Visit the home page
        cy.visit('http://localhost:3000/');

        // Click on login button
        cy.contains('Iniciar Sesión').click();

        // Handle Keycloak login
        const keycloakUrl = Cypress.env('keycloakUrl') || 'https://keycloak-production-7751.up.railway.app';
        cy.origin(keycloakUrl, { args: { username: user, password: pass } }, ({ username, password }) => {
          cy.get('#username').clear().type(username);
          cy.get('#password').clear().type(password);
          cy.get('#kc-login').click();
        });

        // Verify we're back on localhost and logged in
        cy.url().should('include', 'localhost:3000');
        cy.contains('Cerrar Sesión', { timeout: 10000 }).should('exist');
      }
    },
    {
      validate() {
        if (useMocks) {
          // In mock mode, validate that mocked auth is still present
          cy.window().then((win) => {
            const keycloakData = win.localStorage.getItem('keycloakCypress');
            expect(keycloakData).to.exist;
          });
          // Also verify the UI shows logged in state
          cy.visit('http://localhost:3000/');
          cy.contains('Cerrar Sesión', { timeout: 5000 }).should('exist');
        } else {
          // In real mode, validate that the session is still valid
          cy.visit('http://localhost:3000/');
          cy.contains('Cerrar Sesión', { timeout: 5000 }).should('exist');
        }
      },
    }
  );
});

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): Chainable<void>;
    }
  }
}