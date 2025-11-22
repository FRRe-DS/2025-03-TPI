"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import Keycloak from "keycloak-js";

// Configuración del cliente de Keycloak
const keycloakClient = new Keycloak({
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
});

// Tipo para el contexto
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  keycloak: Keycloak;
  isLoading: boolean;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

    isInitialized.current = true;

    // Inicializar Keycloak
    keycloakClient
      .init({
        onLoad: "login-required",
        pkceMethod: "S256",
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setToken(keycloakClient.token || null);
        setIsLoading(false);

        // Configurar actualización automática del token
        keycloakClient.onTokenExpired = () => {
          keycloakClient
            .updateToken(30)
            .then((refreshed) => {
              if (refreshed) {
                setToken(keycloakClient.token || null);
              }
            })
            .catch(() => {
              // Si falla la actualización, forzar login
              keycloakClient.login();
            });
        };
      })
      .catch((error) => {
        console.error("Error inicializando Keycloak:", error);
        setIsLoading(false);
      });
  }, []);

  const value: AuthContextType = {
    token,
    isAuthenticated,
    keycloak: keycloakClient,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}

// Exportar el cliente de Keycloak por si se necesita acceso directo
export { keycloakClient };

