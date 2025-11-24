describe("Login and Tracking Flow", () => {

  it("should login, consult shipment #2, and logout", () => {
    // --- PASO 1: LOGIN (Igual que antes) ---
    cy.visit("http://localhost:3000/");

    cy.contains("Iniciar Sesión").click();

    cy.origin("https://keycloak-production-7751.up.railway.app", () => {
      cy.get('#username').clear().type("alejo");
      cy.get('#password').clear().type("123");
      cy.get('#kc-login').click();
    });

    // Verificamos que volvió al inicio logueado
    cy.url().should("include", "localhost:3000");
    cy.contains("Cerrar Sesión", { timeout: 10000 }).should("exist");


    // --- PASO 2: NAVEGAR A CONSULTAR ENVÍO ---
    // Buscamos el enlace en la barra de navegación y hacemos click
    cy.contains("nav a", "Consultar envío").click(); 
    // Nota: Agregué 'nav a' para asegurarnos que clickea el del menú y no otro texto random
    
    // Verificamos que la URL cambió (buena práctica)
    cy.url().should("include", "/consultar-envio");


    // --- PASO 3: LLENAR EL FORMULARIO (ID 2) ---
    // Como no vi la pantalla de consultar, asumo que hay un input visible.
    // Usamos .first() por si hay varios, o buscamos por tipo texto.
    // Si falla, tendrías que ver si tiene un placeholder="Ingrese ID" y cambiarlo acá.
    cy.get('input[placeholder="Ej: 7633"]').first().should('be.visible').clear().type("2");


    // --- PASO 4: EJECUTAR LA BÚSQUEDA ---
    // Buscamos el botón que envía el formulario.
    // Usamos { force: true } por si algún elemento visual lo tapa un poquito.
    cy.get('button[type="submit"]').click({ force: true });

    // Esperamos a que aparezca la información del envío.
    // Validamos que aparezca algún texto confirmando que trajo el envío 2.
    // (Ajusta "Estado" o "Detalle" según lo que muestre tu pantalla real)
    cy.contains("2").should("exist"); 
    
    // Esperamos un segundo para que veas el resultado visualmente (opcional)
    cy.wait(1000);


    // --- PASO 5: CERRAR SESIÓN ---
    // Hacemos click en el botón de cerrar sesión
    cy.contains("Cerrar Sesión").click();

    // Validamos que volvimos al estado inicial (debe aparecer "Iniciar Sesión" de nuevo)
    cy.contains("Iniciar Sesión").should("exist");
  });

});