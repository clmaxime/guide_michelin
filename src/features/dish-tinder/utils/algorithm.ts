import type { Dish, Preferences } from "../types";

type AlgoState = {
  preferences: Preferences;
  dislikedTags: Record<string, number>;
  likedTags: Record<string, number>;
  seenDishIds: string[];
};

const TAGS = ["meat", "beef", "chicken", "fish", "vegetarian", "vegan", "spicy", "sweet", "salty"] as const;

const isExcludedByPreferences = (dish: Dish, preferences: Preferences) => {
  if (preferences.vegetarianOnly && !dish.tags.vegetarian) return true;
  if (preferences.budget.length > 0 && !preferences.budget.includes(dish.priceRange)) return true;

  for (const ingredient of preferences.excludedIngredients) {
    const key = ingredient.trim().toLowerCase();
    if (!key) continue;
    if ((dish.tags as Record<string, boolean>)[key]) return true;
  }

  return false;
};

export const getDishScore = (dish: Dish, state: AlgoState) => {
  if (isExcludedByPreferences(dish, state.preferences)) return -100;

  let score = 20;
  const dishTags = dish.tags as Record<string, boolean>;

  TAGS.forEach((tag) => {
    if (!dishTags[tag]) return;
    score -= (state.dislikedTags[tag] ?? 0) * 10;
    score += (state.likedTags[tag] ?? 0) * 5;
  });

  if (state.preferences.taste === "sweet" && dish.tags.sweet) score += 10;
  if (state.preferences.taste === "salty" && dish.tags.salty) score += 10;
  if (state.preferences.taste === "sweet" && !dish.tags.sweet) score -= 8;
  if (state.preferences.taste === "salty" && !dish.tags.salty) score -= 8;

  return score;
};

export const rankDishes = (dishes: Dish[], state: AlgoState) => {
  const blockedTags = Object.entries(state.dislikedTags)
    .filter(([, count]) => count >= 5)
    .map(([tag]) => tag);

  return dishes
    .filter((dish) => !state.seenDishIds.includes(dish.id))
    .filter((dish) => {
      if (blockedTags.length === 0) return true;
      const dishTags = dish.tags as Record<string, boolean>;
      return !blockedTags.some((tag) => dishTags[tag]);
    })
    .map((dish) => ({ dish, score: getDishScore(dish, state) }))
    .filter((entry) => entry.score > -100)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.dish);
};

export const getNextDish = (dishes: Dish[], state: AlgoState): Dish | null => {
  const ranked = rankDishes(dishes, state);
  return ranked[0] ?? null;
};

export const updatePreferences = (
  dish: Dish,
  action: "like" | "dislike",
  likedTags: Record<string, number>,
  dislikedTags: Record<string, number>,
) => {
  const nextLiked = { ...likedTags };
  const nextDisliked = { ...dislikedTags };
  const tags = dish.tags as Record<string, boolean>;

  Object.entries(tags).forEach(([tag, enabled]) => {
    if (!enabled) return;
    if (action === "like") nextLiked[tag] = (nextLiked[tag] ?? 0) + 1;
    if (action === "dislike") nextDisliked[tag] = (nextDisliked[tag] ?? 0) + 1;
  });

  return { likedTags: nextLiked, dislikedTags: nextDisliked };
};
