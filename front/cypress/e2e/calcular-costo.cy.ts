describe("Full cost calculation flow", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should navigate to the form, fill in the data, add products, and calculate the shipment", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("Calcular costo").click();

    cy.url().should("include", "/calcular-costo");

    cy.get('input[placeholder="Av. Siempre Viva 123"]')
      .clear().type("Luis Braille");

    cy.get('input[placeholder="Resistencia"]')
      .clear().type("Corrientes");

    cy.get('input[placeholder="Chaco"]')
      .clear().type("Corrientes");

    cy.get('input[placeholder="3500"]')
      .clear().type("A3400BBB");

    cy.get('input[placeholder="AR"]')  // readOnly
      .should("have.value", "AR");

    // Interactuar con el select personalizado
    cy.contains("Método de transporte").parent().find("button").click();
    // Esperar a que aparezca el dropdown y seleccionar la primera opción real (no la opción de placeholder)
    cy.contains("Método de transporte").parent().find("ul").should("be.visible");
    cy.contains("Método de transporte").parent().find("ul li").eq(1).click();

    cy.get('input[placeholder="Ej: 456"]').first()
      .clear().type("1");

    cy.get('input[placeholder="Ej: 5"]').first()
      .clear().type("2");

    cy.contains("+ Agregar producto").click();

    cy.get('input[placeholder="Ej: 456"]').eq(1)
      .clear().type("2");

    cy.get('input[placeholder="Ej: 5"]').eq(1)
      .clear().type("1");

    cy.get('button[type="submit"]').click({ force: true });

    cy.contains("Costo Estimado del Envío", { timeout: 10000 })
    .should("exist");

  });

});
