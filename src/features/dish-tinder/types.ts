export type DishTags = {
  meat: boolean;
  beef: boolean;
  chicken: boolean;
  fish: boolean;
  vegetarian: boolean;
  vegan: boolean;
  spicy: boolean;
  sweet: boolean;
  salty: boolean;
};

export type Dish = {
  id: string;
  name: string;
  restaurant: string;
  priceRange: "€" | "€€" | "€€€";
  image: string;
  tags: DishTags;
};

export type Preferences = {
  vegetarianOnly: boolean;
  excludedIngredients: string[];
  budget: Array<"€" | "€€" | "€€€">;
  taste: "sweet" | "salty" | "both";
};

export type Stats = {
  likes: number;
  dislikes: number;
  history: string[];
};
