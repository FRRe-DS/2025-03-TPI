describe('Navigation', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should navigate to Calcular costo page', () => {
    cy.visit('http://localhost:3000/');

    cy.contains('Calcular costo').click();

    cy.url().should('include', '/calcular-costo');

    cy.contains('Calcular costo', { matchCase: false });
  });
});
