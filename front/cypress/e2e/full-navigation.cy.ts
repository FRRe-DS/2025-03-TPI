describe('Navigation Flow', () => {
  const baseURL = 'http://localhost:3000/';

  beforeEach(() => {
    cy.login();
  });

  it('should navigate to Calcular Costo page and verify content', () => {
    cy.visit(baseURL);

    cy.contains('Calcular Costo').click(); 

    cy.url().should('include', '/calcular-costo');

    cy.contains('Calcular Costo de Envío', { matchCase: false }); 
  });

  it('should navigate to Crear Envío page and verify content', () => {
    cy.visit(baseURL);

    cy.contains('Crear Envío').click(); 

    cy.url().should('include', '/crear-envio');

    cy.contains('Crear Nuevo Envío', { matchCase: false }); 
  });

  it('should navigate to Consultar Envío page and verify content', () => {
    cy.visit(baseURL);

    cy.contains('Consultar Envío').click(); 

    cy.url().should('include', '/consultar-envio');

    cy.contains('Consultar Envío', { matchCase: false }); 
  });
})