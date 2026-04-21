import { useMemo } from "react";
import { useDishTinderStore } from "../store/dish-tinder-store";
import { getNextDish, rankDishes } from "../utils/algorithm";
import type { Dish } from "../types";

export const useDishDeck = (dishes: Dish[]) => {
  const preferences = useDishTinderStore((state) => state.preferences);
  const dislikedTags = useDishTinderStore((state) => state.dislikedTags);
  const likedTags = useDishTinderStore((state) => state.likedTags);
  const likedDishIds = useDishTinderStore((state) => state.likedDishIds);
  const dislikedDishIds = useDishTinderStore((state) => state.dislikedDishIds);
  const likeDish = useDishTinderStore((state) => state.likeDish);
  const dislikeDish = useDishTinderStore((state) => state.dislikeDish);

  const seenDishIds = useMemo(() => [...likedDishIds, ...dislikedDishIds], [likedDishIds, dislikedDishIds]);

  const ranked = useMemo(
    () =>
      rankDishes(dishes, {
        preferences,
        dislikedTags,
        likedTags,
        seenDishIds,
      }),
    [dishes, preferences, dislikedTags, likedTags, seenDishIds],
  );

  const currentDish =
    getNextDish(dishes, {
      preferences,
      dislikedTags,
      likedTags,
      seenDishIds,
    }) ?? null;
  const nextDish = ranked[1] ?? null;

  const swipeRight = () => {
    if (!currentDish) return;
    likeDish(currentDish);
  };

  const swipeLeft = () => {
    if (!currentDish) return;
    dislikeDish(currentDish);
  };

  return {
    currentDish,
    nextDish,
    remainingCount: ranked.length,
    swipeRight,
    swipeLeft,
  };
};
