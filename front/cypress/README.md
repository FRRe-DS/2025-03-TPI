# Cypress E2E Tests

## Configuración para CI

Los tests están configurados para funcionar tanto en desarrollo local como en CI. En CI, se usa **mocking automático** para evitar depender de servicios externos (Keycloak y Backend).

### Variables de Entorno

El sistema detecta automáticamente si está corriendo en CI usando la variable de entorno `CI=true`. Cuando está en CI:

- ✅ **Autenticación**: Se mockea usando localStorage (no requiere Keycloak real)
- ✅ **API Backend**: Se interceptan todas las llamadas y se devuelven fixtures mock
- ✅ **Sin dependencias externas**: Los tests corren completamente aislados

### Configuración en GitHub Actions (ejemplo)

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Next.js app
        run: npm run build
        env:
          NEXT_PUBLIC_KEYCLOAK_URL: https://keycloak-production-7751.up.railway.app
          NEXT_PUBLIC_API_URL: http://localhost:3010
      
      - name: Run Cypress tests with mocks
        run: npm run cypress:run:mock
        # O alternativamente:
        # run: npm run cypress:run
        # env:
        #   CI: true  # Se detecta automáticamente y usa mocks
```

### Cómo Funciona el Mocking

1. **Modo de ejecución**: Se determina por:
   - Variable `CYPRESS_USE_MOCKS=true` (fuerza mocks)
   - Variable `CYPRESS_USE_MOCKS=false` (fuerza servicios reales)
   - Si no está definida, detecta `CI=true` automáticamente
2. **Comando `cy.login()`**: 
   - **Modo real**: Usa Keycloak real (requiere servicios disponibles)
   - **Modo mock**: Mockea la autenticación usando localStorage (sin servicios externos)
3. **Interceptores de API**: En modo mock, todas las llamadas al backend se interceptan y devuelven fixtures
4. **AuthContext**: Detecta `window.Cypress` y usa datos mockeados del localStorage cuando está en modo mock

### Fixtures Disponibles

- `mock-auth.json`: Datos de autenticación mock
- `mock-shipping-cost.json`: Respuesta mock para cálculo de costo
- `mock-shipping-create.json`: Respuesta mock para creación de envío
- `mock-shipping-detail.json`: Respuesta mock para consulta de envío

### Ejecutar Tests Localmente

```bash
# Abrir Cypress UI (usa servicios reales por defecto)
npm run cypress:open

# Ejecutar tests contra servicios REALES (Keycloak y Backend)
npm run cypress:run:real

# Ejecutar tests con MOCKS (sin servicios externos, ideal para CI)
npm run cypress:run:mock

# También puedes usar variables de entorno directamente
CYPRESS_USE_MOCKS=true npm run cypress:run   # Forzar mocks
CYPRESS_USE_MOCKS=false npm run cypress:run  # Forzar servicios reales
```

### Notas

- Los tests en CI no requieren que Keycloak o el Backend estén disponibles
- El mocking es transparente: los tests funcionan igual en ambos modos
- Si necesitas agregar nuevos endpoints, agrega los interceptores en `cypress/support/commands.ts`

