import { create } from "zustand";
import { authApi } from "@/lib/api";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  init: async () => {
    try {
      const data = await authApi.profile();
      set({ user: data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    const data = await authApi.login({ email, password });
    set({ user: data.user });
    return data;
  },

  register: async (dto) => {
    return authApi.register(dto);
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null });
  },
}));
