import { create } from "zustand";
import { User, LoginRequest, RegisterRequest, AuthResponse } from "../types";
import apiClient from "../lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (credentials: LoginRequest) => {
    try {
      const response: AuthResponse = await apiClient.post("/auth/login", credentials);
      apiClient.setAuthTokens(response.access_token, response.refresh_token);
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    try {
      const response: AuthResponse = await apiClient.post("/auth/register", data);
      apiClient.setAuthTokens(response.access_token, response.refresh_token);
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    apiClient.logout();
    set({ user: null, isAuthenticated: false });
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  },

  checkAuth: async () => {
    try {
      const user: User = await apiClient.get("/auth/me");
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (user: User) => {
    set({ user });
  },
}));
