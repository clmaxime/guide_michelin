function createCountMap() {
  return Object.create(null);
}

const WEIGHTS = {
  cuisineMatch: 4,
  moodMatch: 2,
  prepTime: 1,
  cuisinePenaltyWeight: 1.15,
  meatPenaltyWeight: 1.1,
  shownCuisinePenalty: 1.35,
  shownMeatPenalty: 0.95,
  strongMeatBonus: 3.2,
  secondaryMeatBonus: 1.7,
  offPreferenceMeatPenalty: 2.6,
};

function increment(map, key, amount = 1) {
  if (!key) {
    return;
  }

  map[key] = (map[key] ?? 0) + amount;
}

function getMeatKey(meat) {
  return meat ?? "none";
}

function getDeterministicJitter(id) {
  let hash = 0;

  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) % 4099;
  }

  return hash / 40990;
}

function getProgressiveBoost(netLikes, steps) {
  if (netLikes <= 0) {
    return -Math.abs(netLikes) * steps.dislike;
  }

  if (netLikes < steps.startAt) {
    return 0;
  }

  const level = netLikes - steps.startAt + 1;
  return Math.min(level * steps.step, steps.cap);
}

export function buildDishProfile(dishes, likedIds = [], dislikedIds = []) {
  const dishesById = new Map(dishes.map((dish) => [dish.id, dish]));
  const cuisineLikes = createCountMap();
  const cuisineDislikes = createCountMap();
  const meatLikes = createCountMap();
  const meatDislikes = createCountMap();
  const shownCuisineCounts = createCountMap();
  const shownMeatCounts = createCountMap();

  likedIds.forEach((id) => {
    const dish = dishesById.get(id);

    if (!dish) {
      return;
    }

    increment(cuisineLikes, dish.cuisine);
    increment(meatLikes, getMeatKey(dish.meat));
    increment(shownCuisineCounts, dish.cuisine);
    increment(shownMeatCounts, getMeatKey(dish.meat));
  });

  dislikedIds.forEach((id) => {
    const dish = dishesById.get(id);

    if (!dish) {
      return;
    }

    increment(cuisineDislikes, dish.cuisine);
    increment(meatDislikes, getMeatKey(dish.meat));
    increment(shownCuisineCounts, dish.cuisine);
    increment(shownMeatCounts, getMeatKey(dish.meat));
  });

  return {
    cuisineLikes,
    cuisineDislikes,
    meatLikes,
    meatDislikes,
    shownCuisineCounts,
    shownMeatCounts,
  };
}

function getPreferredMeats(profile) {
  const meatKeys = new Set([
    ...Object.keys(profile.meatLikes),
    ...Object.keys(profile.meatDislikes),
    ...Object.keys(profile.shownMeatCounts),
  ]);

  const rankedMeats = [...meatKeys]
    .map((meatKey) => ({
      meatKey,
      netLikes: (profile.meatLikes[meatKey] ?? 0) - (profile.meatDislikes[meatKey] ?? 0),
    }))
    .filter((entry) => entry.netLikes >= 3)
    .sort((leftEntry, rightEntry) => rightEntry.netLikes - leftEntry.netLikes);

  return {
    topMeat: rankedMeats[0]?.meatKey ?? null,
    secondaryMeat: rankedMeats[1]?.meatKey ?? null,
    preferredMeats: new Set(rankedMeats.map((entry) => entry.meatKey)),
  };
}

export function scoreDish(dish, context) {
  const {
    selectedCuisine = "all",
    selectedMood = "all",
    maxPrepTime = Number.POSITIVE_INFINITY,
    profile,
    preferredMeats,
  } = context;

  const cuisineKey = dish.cuisine;
  const meatKey = getMeatKey(dish.meat);
  const cuisineNetLikes = (profile.cuisineLikes[cuisineKey] ?? 0) - (profile.cuisineDislikes[cuisineKey] ?? 0);
  const meatNetLikes = (profile.meatLikes[meatKey] ?? 0) - (profile.meatDislikes[meatKey] ?? 0);
  const shownCuisineCount = profile.shownCuisineCounts[cuisineKey] ?? 0;
  const shownMeatCount = profile.shownMeatCounts[meatKey] ?? 0;

  let score = 0;

  if (selectedCuisine !== "all" && dish.cuisine === selectedCuisine) {
    score += WEIGHTS.cuisineMatch;
  }

  if (selectedMood !== "all" && dish.mood === selectedMood) {
    score += WEIGHTS.moodMatch;
  }

  if (dish.prepTime <= maxPrepTime) {
    score += WEIGHTS.prepTime;
  }

  score += getProgressiveBoost(cuisineNetLikes, {
    startAt: 3,
    step: 1.6,
    cap: 6.4,
    dislike: 2.2,
  });

  score += getProgressiveBoost(meatNetLikes, {
    startAt: 3,
    step: 1.3,
    cap: 4.8,
    dislike: 1.8,
  });

  if (preferredMeats.topMeat && meatKey === preferredMeats.topMeat) {
    score += WEIGHTS.strongMeatBonus;
  } else if (preferredMeats.secondaryMeat && meatKey === preferredMeats.secondaryMeat) {
    score += WEIGHTS.secondaryMeatBonus;
  } else if (preferredMeats.preferredMeats.size > 0 && !preferredMeats.preferredMeats.has(meatKey)) {
    score -= WEIGHTS.offPreferenceMeatPenalty;
  }

  // Evite l'effet "je like 2 americains => tout le reste americain arrive d'un coup".
  score -= Math.max(shownCuisineCount - 1, 0) * WEIGHTS.shownCuisinePenalty;
  score -= Math.max(shownMeatCount - 1, 0) * WEIGHTS.shownMeatPenalty;

  if (cuisineNetLikes < 0) {
    score += cuisineNetLikes * WEIGHTS.cuisinePenaltyWeight;
  }

  if (meatNetLikes < 0) {
    score += meatNetLikes * WEIGHTS.meatPenaltyWeight;
  }

  score += getDeterministicJitter(dish.id);

  return score;
}

export function sortDishes(dishes, context) {
  const profile = buildDishProfile(context.catalog ?? dishes, context.likedIds ?? [], context.dislikedIds ?? []);
  const preferredMeats = getPreferredMeats(profile);
  const swipedIds = new Set([...(context.likedIds ?? []), ...(context.dislikedIds ?? [])]);

  return [...dishes]
    .filter((dish) => !swipedIds.has(dish.id))
    .sort((leftDish, rightDish) => {
      const leftScore = scoreDish(leftDish, { ...context, profile, preferredMeats });
      const rightScore = scoreDish(rightDish, { ...context, profile, preferredMeats });

      if (rightScore !== leftScore) {
        return rightScore - leftScore;
      }

      return leftDish.prepTime - rightDish.prepTime;
    });
}
