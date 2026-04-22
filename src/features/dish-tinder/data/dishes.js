import article1 from "../../../../assets/images/site/article_1.webp";
import article2 from "../../../../assets/images/site/article_2.webp";
import article3 from "../../../../assets/images/site/article_3.webp";
import article4 from "../../../../assets/images/site/article_4.webp";
import heroDish from "../../../../assets/images/site/hero_dish.webp";
import inspiration1 from "../../../../assets/images/site/inspiration_1.webp";
import inspiration2 from "../../../../assets/images/site/inspiration_2.webp";
import inspiration3 from "../../../../assets/images/site/inspiration_3.webp";
import inspiration4 from "../../../../assets/images/site/inspiration_4.webp";
import tinderMock from "../../../../assets/images/maquettes/tinder_food.png";

export const dishOptions = [
  {
    id: "dish-1",
    title: "Ramen Tonkotsu",
    caption: "Bouillon longuement reduit, noodles fraiches, oeuf marines",
    cuisine: "Japonais",
    mood: "Comfort",
    prepTime: 25,
    budget: "€€",
    image: heroDish,
    tags: ["Umami", "Soiree chill"],
  },
  {
    id: "dish-2",
    title: "Tacos al Pastor",
    caption: "Porc grille, ananas, salsa roja et coriandre",
    cuisine: "Mexicain",
    mood: "Festif",
    prepTime: 18,
    budget: "€",
    image: article2,
    tags: ["Street food", "A partager"],
  },
  {
    id: "dish-3",
    title: "Risotto al Tartufo",
    caption: "Cremeux, parmesan 24 mois, truffe noire",
    cuisine: "Italien",
    mood: "Date",
    prepTime: 35,
    budget: "€€€",
    image: article3,
    tags: ["Signature", "Gourmet"],
  },
  {
    id: "dish-4",
    title: "Burger Smash",
    caption: "Pain brioché, cheddar mature, sauce maison",
    cuisine: "Americain",
    mood: "Comfort",
    prepTime: 15,
    budget: "€€",
    image: article1,
    tags: ["Crunchy", "Rapide"],
  },
  {
    id: "dish-5",
    title: "Ceviche Nikkei",
    caption: "Poisson cru, leche de tigre, agrumes et coriandre",
    cuisine: "Peruvien",
    mood: "Fresh",
    prepTime: 20,
    budget: "€€",
    image: inspiration1,
    tags: ["Fraicheur", "Epicé"],
  },
  {
    id: "dish-6",
    title: "Pad Thai Crevettes",
    caption: "Nouilles wok, tamarin, cacahuetes torrefiees",
    cuisine: "Thai",
    mood: "Fresh",
    prepTime: 22,
    budget: "€€",
    image: inspiration2,
    tags: ["Wok", "Acidule"],
  },
  {
    id: "dish-7",
    title: "Poulet Yassa",
    caption: "Oignons confits, citron, moutarde et riz parfumé",
    cuisine: "Africain",
    mood: "Family",
    prepTime: 30,
    budget: "€",
    image: inspiration3,
    tags: ["Generous", "Tradition"],
  },
  {
    id: "dish-8",
    title: "Lobster Roll",
    caption: "Pain toasté, homard beurre citronné, herbes fines",
    cuisine: "Seafood",
    mood: "Date",
    prepTime: 28,
    budget: "€€€",
    image: inspiration4,
    tags: ["Premium", "Brunch"],
  },
  {
    id: "dish-9",
    title: "Shawarma Bowl",
    caption: "Poulet epice, houmous, pickles, herbes fraiches",
    cuisine: "Moyen-Orient",
    mood: "Healthy",
    prepTime: 19,
    budget: "€",
    image: article4,
    tags: ["Protein", "Balanced"],
  },
  {
    id: "dish-10",
    title: "Tinder Signature Mix",
    caption: "Selection visuelle de plats en format swipe",
    cuisine: "Fusion",
    mood: "Festif",
    prepTime: 12,
    budget: "€€",
    image: tinderMock,
    tags: ["Trending", "Social"],
  },
];

export const cuisineOptions = ["all", ...new Set(dishOptions.map((dish) => dish.cuisine))];
export const moodOptions = ["all", ...new Set(dishOptions.map((dish) => dish.mood))];
