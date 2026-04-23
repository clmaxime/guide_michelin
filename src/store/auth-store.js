import { create } from "zustand";
import { authApi } from "@/lib/api";

const defaultPreferences = {
  veganOnly: false,
  excludedIngredients: [],
  allergens: [],
  excludedTags: [],
};

export const useAuthStore = create((set) => ({
  user: null,
  preferences: defaultPreferences,
  loading: true,

  init: async () => {
    try {
      const data = await authApi.profile();
      set({ user: data, preferences: data.preferences ?? defaultPreferences, loading: false });
    } catch {
      set({ user: null, preferences: defaultPreferences, loading: false });
    }
  },

  login: async (email, password) => {
    const data = await authApi.login({ email, password });
    set({ user: data.user, preferences: data.user?.preferences ?? defaultPreferences });
    const profile = await authApi.profile();
    set({ user: profile, preferences: profile.preferences ?? defaultPreferences });
    return data;
  },

  register: async (dto) => {
    return authApi.register(dto);
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, preferences: defaultPreferences });
  },

  savePreferences: async (payload) => {
    const preferences = await authApi.savePreferences(payload);
    set((state) => ({
      preferences,
      user: state.user ? { ...state.user, preferences } : state.user,
    }));
    return preferences;
  },
}));
