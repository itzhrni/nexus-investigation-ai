import { create } from "zustand";

export type UserRole = "INVESTIGATOR" | "ADMIN";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  unit: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, role?: UserRole, unit?: string) => Promise<boolean>;
  logout: () => void;
  initializeAuth: () => void;
}

const STORAGE_TOKEN_KEY = "nexus_auth_token";
const STORAGE_USER_KEY = "nexus_auth_user";

const DEMO_USER: UserProfile = {
  id: "USR-DEMO",
  email: "officer@nexus.gov.in",
  role: "INVESTIGATOR",
  unit: "Central PS",
};

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(STORAGE_TOKEN_KEY) || "demo-jwt-token-nexus-2026",
  user: (() => {
    const stored = localStorage.getItem(STORAGE_USER_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    return DEMO_USER;
  })(),
  isAuthenticated: true, // Defaults to authenticated so demo mode remains frictionless

  login: async (email, password = "demo1234", role = "INVESTIGATOR", unit = "Central PS") => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      
      let token = "demo-jwt-token-nexus-2026";
      let user: UserProfile = {
        id: `USR-${cleanEmail.split("@")[0].toUpperCase()}`,
        email: cleanEmail,
        role,
        unit: unit || "Central PS",
      };

      // Attempt live login API if configured or reachable
      const apiMode = import.meta.env.VITE_API_MODE;
      if (apiMode !== "mock") {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: cleanEmail, password, role, unit }),
          });
          if (res.ok) {
            const data = await res.json();
            token = data.access_token;
            user = {
              id: data.user.id,
              email: data.user.email,
              role: data.user.role as UserRole,
              unit: data.user.unit,
            };
          }
        } catch {
          // Fallback to local demo session if backend unreachable
        }
      }

      localStorage.setItem(STORAGE_TOKEN_KEY, token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
      });

      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  initializeAuth: () => {
    const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
    const savedUser = localStorage.getItem(STORAGE_USER_KEY);

    if (savedToken && savedUser) {
      try {
        set({
          token: savedToken,
          user: JSON.parse(savedUser),
          isAuthenticated: true,
        });
        return;
      } catch {
        // Fallback
      }
    }

    // Default demo session
    set({
      token: "demo-jwt-token-nexus-2026",
      user: DEMO_USER,
      isAuthenticated: true,
    });
  },
}));
