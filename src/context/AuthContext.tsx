"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// More flexible user interface


// Strict user interface (recommended)
interface StrictUser {
  id: number;
  email: string;
  name?: string;
  role: string;
  phoneNumber?: string;
  createdAt?: string;
  firstName?: string;
  lastName?: string;
  // Add only the properties you actually use
}

interface AuthContextType {
  user: StrictUser | null;
  login: (userData: StrictUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  token?: string | null;
  setToken?: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StrictUser | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
      } catch (error) {
        console.error("Error parsing stored user:", error);
        return null;
      }
    }
    return null;
  });

  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });

  const login = (userData: StrictUser) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setTokenState(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const setToken = (newToken: string) => {
    try {
      localStorage.setItem("token", newToken);
      setTokenState(newToken);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated,
      token,
      setToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}