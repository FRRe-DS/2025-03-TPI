import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      // Force mocking mode via CYPRESS_USE_MOCKS environment variable
      // If not set, defaults to CI detection (mocks in CI, real services in dev)
      useMocks: process.env.CYPRESS_USE_MOCKS === 'true' || (process.env.CYPRESS_USE_MOCKS !== 'false' && (process.env.CI === 'true' || !!process.env.CI)),
      // Keycloak URL (will be mocked if useMocks is true)
      keycloakUrl: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://keycloak-production-7751.up.railway.app',
      // API URL (will be mocked if useMocks is true)
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010',
    },
  },
});
