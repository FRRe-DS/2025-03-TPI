"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import Keycloak from "keycloak-js";

const keycloakClient = new Keycloak({
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
});

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  keycloak: Keycloak;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    
    keycloakClient
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setToken(keycloakClient.token || null);
        setIsLoading(false);

        keycloakClient.onTokenExpired = () => {
          keycloakClient
            .updateToken(30)
            .then((refreshed) => {
              if (refreshed) {
                setToken(keycloakClient.token || null);
              }
            })
            .catch(() => {
              setIsAuthenticated(false);
              setToken(null);
            });
        };
      })
      .catch((error) => {
        console.error("Error inicializando Keycloak:", error);
        setIsLoading(false);
      });
  }, []);

  const login = () => {
    keycloakClient.login();
  };

  const logout = () => {
    keycloakClient.logout();
  };

  const value: AuthContextType = {
    token,
    isAuthenticated,
    keycloak: keycloakClient,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}

export { keycloakClient };

