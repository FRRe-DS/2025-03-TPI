# Configuración de Keycloak para OIDC con PKCE

## Problema: Error "invalid_client_credentials"

Este error ocurre cuando el cliente en Keycloak no está configurado correctamente para usar PKCE (Proof Key for Code Exchange) con aplicaciones SPA (Single Page Applications).

## Pasos para configurar el cliente en Keycloak

1. **Accede al Admin Console de Keycloak**
   - Ve a `http://localhost:8080`
   - Inicia sesión como administrador

2. **Selecciona el Realm**
   - Selecciona el realm `ds-2025-realm`

3. **Ve a Clients**
   - En el menú lateral, ve a **Clients**
   - Busca o crea el cliente `grupo-11`

4. **Configuración del Cliente**

   **Settings Tab:**
   - **Client ID**: `grupo-11`
   - **Client Protocol**: `openid-connect`
   - **Access Type**: **`public`** ⚠️ **MUY IMPORTANTE** - Debe ser público, NO confidencial
   - **Standard Flow Enabled**: **ON** ✅
   - **Direct Access Grants Enabled**: Opcional (para pruebas)
   - **Valid Redirect URIs**: 
     - `http://localhost:3000`
     - `http://localhost:3000/*`
   - **Web Origins**: 
     - `http://localhost:3000`
     - `+` (permite todos los orígenes)

   **Advanced Settings (si está disponible):**
   - **PKCE Code Challenge Method**: `S256` (debe estar habilitado)
   - **Proof Key for Code Exchange Code Challenge Method**: `S256`

5. **Guardar la configuración**
   - Haz clic en **Save**

## Verificación

Después de configurar el cliente, deberías poder:
1. Iniciar sesión desde tu aplicación Next.js
2. Ver el código de autorización en la URL después del login
3. El intercambio de tokens debería funcionar sin el error "invalid_client_credentials"

## Notas importantes

- **Access Type = Public**: Las aplicaciones SPA que usan PKCE DEBEN ser públicas (sin client_secret)
- **PKCE es obligatorio**: En versiones recientes de Keycloak, PKCE es requerido para clientes públicos
- **Redirect URIs**: Deben coincidir exactamente con los configurados en tu aplicación
- **Web Origins**: Necesario para permitir CORS desde tu aplicación

## Troubleshooting

Si aún ves el error después de configurar:

1. **Verifica que el cliente sea público**:
   - En la configuración del cliente, asegúrate de que "Access Type" sea "public"
   - NO debe tener "Client secret" configurado

2. **Verifica PKCE**:
   - En Keycloak 18+, PKCE es obligatorio para clientes públicos
   - Asegúrate de que esté habilitado en la configuración avanzada

3. **Verifica Redirect URIs**:
   - Deben coincidir exactamente (incluyendo trailing slash o no)
   - `http://localhost:3000` debe estar en la lista

4. **Revisa los logs de Keycloak**:
   - Busca errores relacionados con `CODE_TO_TOKEN_ERROR`
   - Verifica que el `client_id` coincida

