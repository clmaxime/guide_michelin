import { create } from "zustand";
import { restaurantApi } from "@/lib/api";

export const useRestaurantStore = create((set) => ({
  restaurants: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    try {
      const data = await restaurantApi.findAll();
      set({ restaurants: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
