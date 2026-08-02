"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiClient, ApiRequestError } from "./apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const fetchAuthenticatedUser = useCallback(async () => {
    try {
      const responseBody = await apiClient("/api/auth/me");
      setAuthenticatedUser(responseBody.user);
      return responseBody.user;
    } catch (error) {
      if (error instanceof ApiRequestError && error.statusCode === 401) {
        setAuthenticatedUser(null);
        return null;
      }

      setAuthenticatedUser(null);
      return null;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, [fetchAuthenticatedUser]);

  async function login(credentials) {
    const responseBody = await apiClient("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    setAuthenticatedUser(responseBody.user);
    return responseBody.user;
  }

  async function signup(signupPayload) {
    const responseBody = await apiClient("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(signupPayload),
    });

    setAuthenticatedUser(responseBody.user);
    return responseBody.user;
  }

  async function logout() {
    await apiClient("/api/auth/logout", { method: "POST" });
    setAuthenticatedUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        authenticatedUser,
        isAuthLoading,
        fetchAuthenticatedUser,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return authContext;
}
