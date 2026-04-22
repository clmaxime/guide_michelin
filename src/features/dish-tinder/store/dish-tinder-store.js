import { create } from "zustand";

export const useDishTinderStore = create((set) => ({
  selectedCuisine: "all",
  selectedMood: "all",
  lastSwipe: null,
  likedIds: [],
  dislikedIds: [],
  setSelectedCuisine: (value) => set({ selectedCuisine: value }),
  setSelectedMood: (value) => set({ selectedMood: value }),
  swipeDish: (dishId, direction) =>
    set((state) => {
      const isLike = direction === "right";
      return {
        lastSwipe: direction,
        likedIds: isLike ? [...new Set([...state.likedIds, dishId])] : state.likedIds.filter((id) => id !== dishId),
        dislikedIds: isLike ? state.dislikedIds.filter((id) => id !== dishId) : [...new Set([...state.dislikedIds, dishId])],
      };
    }),
  resetSession: () =>
    set({
      selectedCuisine: "all",
      selectedMood: "all",
      lastSwipe: null,
      likedIds: [],
      dislikedIds: [],
    }),
}));
