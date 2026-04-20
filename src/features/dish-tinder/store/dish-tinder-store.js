import { create } from "zustand";

export const useDishTinderStore = create((set) => ({
  swipeDirection: null,
  setSwipeDirection: (direction) => set({ swipeDirection: direction }),
  resetSwipeDirection: () => set({ swipeDirection: null }),
}));
