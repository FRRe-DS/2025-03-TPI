describe("Full shipment creation flow", () => {

  it("should navigate to the form, fill in the data, add products, and create the shipment", () => {
    
    cy.visit("http://localhost:3000/");

    cy.contains("Crear envío").click();
    cy.url().should("include", "/crear-envio");

    cy.get('input[placeholder="Ej: 456"]').first()
     .clear().type("683");

    cy.get('input[placeholder="Av. Siempre Viva 123"]')
      .clear().type("Mendoza 1062");

    cy.get('input[placeholder="Resistencia"]')
      .clear().type("Corrientes");

    cy.get('input[placeholder="Chaco"]')
      .clear().type("Corrientes");

    cy.get('input[placeholder="3500"]')
      .clear().type("3400");

    cy.get('input[placeholder="AR"]').should("have.value", "AR");

    cy.get("select").select("Barco");

    cy.get('input[placeholder="Ej: 456"]').eq(1)
      .clear().type("1");

     cy.get('input[placeholder="Ej: 5"]').eq(0)
      .clear().type("6");

      cy.contains("+ Agregar producto").click();

    cy.get('input[placeholder="Ej: 456"]').eq(2)
      .clear().type("3");

    cy.get('input[placeholder="Ej: 5"]').eq(1)
      .clear().type("12");

    cy.get('button[type="submit"]').click({ force: true });

    cy.contains("Envío Creado con Éxito", { timeout: 15000 })
      .should("exist");
  });
});