import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Dish, Preferences, Stats } from "../types";
import { updatePreferences } from "../utils/algorithm";

type Store = {
  preferences: Preferences;
  stats: Stats;
  dislikedTags: Record<string, number>;
  likedTags: Record<string, number>;
  likedDishIds: string[];
  dislikedDishIds: string[];
  testMode: boolean;
  onboardingDone: boolean;
  mockLocation: string;
  setPreferences: (next: Partial<Preferences>) => void;
  setExcludedIngredients: (value: string) => void;
  setOnboardingDone: (value: boolean) => void;
  likeDish: (dish: Dish) => void;
  dislikeDish: (dish: Dish) => void;
  toggleTestMode: () => void;
  relaunchSuggestions: () => void;
  reset: () => void;
};

const initialPreferences: Preferences = {
  vegetarianOnly: false,
  excludedIngredients: [],
  budget: ["€", "€€", "€€€"],
  taste: "both",
};

const initialStats: Stats = {
  likes: 0,
  dislikes: 0,
  history: [],
};

export const useDishTinderStore = create<Store>()(
  persist(
    (set, get) => ({
      preferences: initialPreferences,
      stats: initialStats,
      dislikedTags: {},
      likedTags: {},
      likedDishIds: [],
      dislikedDishIds: [],
      testMode: false,
      onboardingDone: false,
      mockLocation: "Paris, France",

      setPreferences: (next) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...next,
          },
        })),

      setExcludedIngredients: (value) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            excludedIngredients: value
              .split(",")
              .map((item) => item.trim().toLowerCase())
              .filter(Boolean),
          },
        })),

      setOnboardingDone: (value) => set({ onboardingDone: value }),

      likeDish: (dish) =>
        set((state) => {
          if (state.likedDishIds.includes(dish.id) || state.dislikedDishIds.includes(dish.id)) return state;
          const updated = updatePreferences(dish, "like", state.likedTags, state.dislikedTags);
          return {
            likedTags: updated.likedTags,
            dislikedTags: updated.dislikedTags,
            likedDishIds: [...state.likedDishIds, dish.id],
            stats: {
              likes: state.stats.likes + 1,
              dislikes: state.stats.dislikes,
              history: [`aimé:${dish.id}`, ...state.stats.history].slice(0, 200),
            },
          };
        }),

      dislikeDish: (dish) =>
        set((state) => {
          if (state.likedDishIds.includes(dish.id) || state.dislikedDishIds.includes(dish.id)) return state;
          const updated = updatePreferences(dish, "dislike", state.likedTags, state.dislikedTags);
          return {
            likedTags: updated.likedTags,
            dislikedTags: updated.dislikedTags,
            dislikedDishIds: [...state.dislikedDishIds, dish.id],
            stats: {
              likes: state.stats.likes,
              dislikes: state.stats.dislikes + 1,
              history: [`passé:${dish.id}`, ...state.stats.history].slice(0, 200),
            },
          };
        }),

      toggleTestMode: () => set((state) => ({ testMode: !state.testMode })),

      relaunchSuggestions: () =>
        set({
          likedDishIds: [],
          dislikedDishIds: [],
        }),

      reset: () =>
        set({
          preferences: initialPreferences,
          stats: initialStats,
          dislikedTags: {},
          likedTags: {},
          likedDishIds: [],
          dislikedDishIds: [],
          testMode: false,
          onboardingDone: false,
        }),
    }),
    {
      name: "dish-tinder-storage",
      partialize: (state) => ({
        preferences: state.preferences,
        stats: state.stats,
        dislikedTags: state.dislikedTags,
        likedTags: state.likedTags,
        likedDishIds: state.likedDishIds,
        dislikedDishIds: state.dislikedDishIds,
        testMode: state.testMode,
        onboardingDone: state.onboardingDone,
      }),
      version: 1,
    },
  ),
);
