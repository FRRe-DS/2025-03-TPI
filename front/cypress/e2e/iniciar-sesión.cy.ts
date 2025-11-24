describe("Login Flow", () => {

  it("should login successfully with valid credentials", () => {
    // 1. Visitamos tu página local
    cy.visit("http://localhost:3000/");

    // 2. Hacemos click en el botón rojo "Iniciar Sesión" (Imagen 2)
    cy.contains("Iniciar Sesión").click();

    // 3. Manejamos el salto a la página de Keycloak (Imagen 1)
    // IMPORTANTE: Ponemos la dirección base de Keycloak que pusimos en el .env
    cy.origin("https://keycloak-production-7751.up.railway.app", () => {
      
      // Todo lo que pasa acá adentro ocurre en la pantalla gris de Keycloak
      
      // Escribimos el usuario (alejo)
      cy.get('#username').clear().type("alejo");

      // Escribimos la contraseña (123)
      cy.get('#password').clear().type("123");

      // Apretamos el botón azul "Sign In"
      // '#kc-login' es el ID estándar de ese botón en Keycloak
      cy.get('#kc-login').click();
    });

    // 4. Vuelta a casa
    // Verificamos que volvimos a localhost
    cy.url().should("include", "localhost:3000");

    // Verificamos que el botón cambió a "Cerrar Sesión" (prueba de éxito)
    // Le damos un poco más de tiempo (10s) por si Keycloak tarda en redirigir
    cy.contains("Cerrar Sesión", { timeout: 10000 }).should("exist");
  });

});