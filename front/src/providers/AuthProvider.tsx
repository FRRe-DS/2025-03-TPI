"use client";

import { useEffect } from "react";
import { AuthProvider as OidcAuthProvider, useAuth } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";
import type { User } from "oidc-client-ts";

// Función helper para establecer cookie de autenticación
function setAuthCookie() {
  document.cookie = "auth_session=true; path=/; SameSite=Lax; max-age=86400"; // 24 horas
}

// Función helper para eliminar cookie de autenticación
function removeAuthCookie() {
  document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

// Componente que sincroniza la cookie con el estado de autenticación
function AuthCookieSync({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  useEffect(() => {
    // Sincronizar cookie cuando el estado de autenticación cambia
    if (!auth.isLoading) {
      if (auth.isAuthenticated) {
        setAuthCookie();
      } else {
        removeAuthCookie();
      }
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  return <>{children}</>;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // Crear userStore solo cuando window está disponible (cliente)
  const userStore = typeof window !== "undefined" 
    ? new WebStorageStateStore({ store: window.sessionStorage })
    : undefined;

  const oidcConfig = {
    authority: process.env.NEXT_PUBLIC_KEYCLOAK_AUTHORITY!,
    client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI!,
    post_logout_redirect_uri: process.env.NEXT_PUBLIC_KEYCLOAK_POST_LOGOUT_REDIRECT_URI!,
    scope: 'openid productos:read',
    automaticSilentRenew: true,
    loadUserInfo: true,
    ...(userStore && { userStore }),
    onSigninCallback: (user: User | undefined) => {
      // Establecer cookie cuando el usuario se autentica
      if (user) {
        setAuthCookie();
      }
      // Clean up URL after redirect
      window.history.replaceState({}, document.title, window.location.pathname);
    },
    onSignoutCallback: () => {
      // Eliminar cookie cuando el usuario cierra sesión
      removeAuthCookie();
    },
    onRemoveUser: () => {
      // Eliminar cookie cuando se remueve el usuario
      removeAuthCookie();
    },
  };

  return (
    <OidcAuthProvider {...oidcConfig}>
      <AuthCookieSync>{children}</AuthCookieSync>
    </OidcAuthProvider>
  );
}

