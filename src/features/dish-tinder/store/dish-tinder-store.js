import { create } from "zustand";
import { dishFeed } from "../data/dishes";

export const useDishTinderStore = create((set) => ({
  dishes: dishFeed,
  currentIndex: 0,
  likedIds: [],
  passedIds: [],
  swipeDirection: null,
  activeTab: "discover",
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSwipeDirection: (direction) => set({ swipeDirection: direction }),
  resetSwipeDirection: () => set({ swipeDirection: null }),
  swipeDish: (direction) =>
    set((state) => {
      const currentDish = state.dishes[state.currentIndex];
      if (!currentDish) return state;

      if (direction === "right") {
        return {
          currentIndex: state.currentIndex + 1,
          likedIds: [...state.likedIds, currentDish.id],
          swipeDirection: direction,
        };
      }

      if (direction === "left") {
        return {
          currentIndex: state.currentIndex + 1,
          passedIds: [...state.passedIds, currentDish.id],
          swipeDirection: direction,
        };
      }

      return state;
    }),
  resetDeck: () =>
    set({
      currentIndex: 0,
      likedIds: [],
      passedIds: [],
      swipeDirection: null,
    }),
}));
