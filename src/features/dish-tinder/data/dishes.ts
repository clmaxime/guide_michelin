import type { Dish } from "../types";

import plat01 from "../../../../assets/images/plats/08de650cb7184f1ba12bd2fc5a19f57b.webp";
import plat02 from "../../../../assets/images/plats/11940b730fe948918e44082da6a72e68.webp";
import plat03 from "../../../../assets/images/plats/325e42d3c7b64cc0b677108951a9edef.webp";
import plat04 from "../../../../assets/images/plats/43a87895d0c74c36bdf9cd96af95fe3f.webp";
import plat05 from "../../../../assets/images/plats/45a8eeb3ccc0407fa299ca845ada75a0.webp";
import plat06 from "../../../../assets/images/plats/4693ffc07f7d48cfa47a5e8030fa68e9.webp";
import plat07 from "../../../../assets/images/plats/53e3b01ea07f4abcbe3266da614bc726.webp";
import plat08 from "../../../../assets/images/plats/5e05d730f82e4ade88099d2b4c4aa3f0.webp";
import plat09 from "../../../../assets/images/plats/7d9374159d2d447daea4141a6fbc3979.webp";
import plat10 from "../../../../assets/images/plats/8a971aa265f84d65b27018ac51d13714.webp";
import plat11 from "../../../../assets/images/plats/9729ec20e285418b82f85bd9eaa9ff1f.webp";
import plat12 from "../../../../assets/images/plats/9ae12ce62ab34c068eb060df43d9e02c.webp";
import plat13 from "../../../../assets/images/plats/bc69e3ce94a34155860c215a7128e55c.webp";
import plat14 from "../../../../assets/images/plats/be1a63f3285b4d4983cf48f861e8ef0c.webp";
import plat15 from "../../../../assets/images/plats/c90085e404034a8ca889465082c9a193.webp";
import plat16 from "../../../../assets/images/plats/d004503da6b94e6cb11d8b18f4b9780d.webp";
import plat17 from "../../../../assets/images/plats/dfe3666c1bb74e1391313ecebda9a30b.webp";
import plat18 from "../../../../assets/images/plats/e1095354a10e4b44ba8d872a80d688ac.webp";

export const dishes: Dish[] = [
  { id: "dish-01", name: "Tartare de boeuf truffe", restaurant: "Atelier Royal", priceRange: "€€€", image: plat01, tags: { meat: true, beef: true, chicken: false, fish: false, vegetarian: false, vegan: false, spicy: false, sweet: false, salty: true } },
  { id: "dish-02", name: "Saint-Jacques snackees", restaurant: "Le Clarence", priceRange: "€€€", image: plat02, tags: { meat: false, beef: false, chicken: false, fish: true, vegetarian: false, vegan: false, spicy: false, sweet: false, salty: true } },
  { id: "dish-03", name: "Poulet miso grille", restaurant: "Maison Kumo", priceRange: "€€", image: plat03, tags: { meat: true, beef: false, chicken: true, fish: false, vegetarian: false, vegan: false, spicy: true, sweet: false, salty: true } },
  { id: "dish-04", name: "Ramen vegetal umami", restaurant: "Nori Lab", priceRange: "€€", image: plat04, tags: { meat: false, beef: false, chicken: false, fish: false, vegetarian: true, vegan: true, spicy: true, sweet: false, salty: true } },
  { id: "dish-05", name: "Risotto parmesan citron", restaurant: "Casa Lunga", priceRange: "€€", image: plat05, tags: { meat: false, beef: false, chicken: false, fish: false, vegetarian: true, vegan: false, spicy: false, sweet: false, salty: true } },
  { id: "dish-06", name: "Cabillaud beurre blanc", restaurant: "Le Phare", priceRange: "€€€", image: plat06, tags: { meat: false, beef: false, chicken: false, fish: true, vegetarian: false, vegan: false, spicy: false, sweet: false, salty: true } },
  { id: "dish-07", name: "Burger wagyu premium", restaurant: "Braise Paris", priceRange: "€€€", image: plat07, tags: { meat: true, beef: true, chicken: false, fish: false, vegetarian: false, vegan: false, spicy: false, sweet: false, salty: true } },
  { id: "dish-08", name: "Bowl tofu sesame", restaurant: "Green Canvas", priceRange: "€", image: plat08, tags: { meat: false, beef: false, chicken: false, fish: false, vegetarian: true, vegan: true, spicy: false, sweet: false, salty: true } },
  { id: "dish-09", name: "Tacos poulet epices", restaurant: "Barrio 17", priceRange: "€", image: plat09, tags: { meat: true, beef: false, chicken: true, fish: false, vegetarian: false, vegan: false, spicy: true, sweet: false, salty: true } },
  { id: "dish-10", name: "Saumon laque", restaurant: "Maree Fine", priceRange: "€€", image: plat10, tags: { meat: false, beef: false, chicken: false, fish: true, vegetarian: false, vegan: false, spicy: false, sweet: true, salty: true } },
  { id: "dish-11", name: "Poke thon mangue", restaurant: "Pacific Table", priceRange: "€€", image: plat11, tags: { meat: false, beef: false, chicken: false, fish: true, vegetarian: false, vegan: false, spicy: false, sweet: true, salty: true } },
  { id: "dish-12", name: "Gnocchi sauce tomate", restaurant: "Casa Lunga", priceRange: "€", image: plat12, tags: { meat: false, beef: false, chicken: false, fish: false, vegetarian: true, vegan: false, spicy: false, sweet: false, salty: true } },
  { id: "dish-13", name: "Poulet croustillant miel", restaurant: "Braise Paris", priceRange: "€€", image: plat13, tags: { meat: true, beef: false, chicken: true, fish: false, vegetarian: false, vegan: false, spicy: true, sweet: true, salty: true } },
  { id: "dish-14", name: "Piece de boeuf maturee", restaurant: "Atelier Royal", priceRange: "€€€", image: plat14, tags: { meat: true, beef: true, chicken: false, fish: false, vegetarian: false, vegan: false, spicy: false, sweet: false, salty: true } },
  { id: "dish-15", name: "Sushi vegetal", restaurant: "Nori Lab", priceRange: "€€", image: plat15, tags: { meat: false, beef: false, chicken: false, fish: false, vegetarian: true, vegan: true, spicy: false, sweet: false, salty: true } },
  { id: "dish-16", name: "Curry legumes coco", restaurant: "Green Canvas", priceRange: "€", image: plat16, tags: { meat: false, beef: false, chicken: false, fish: false, vegetarian: true, vegan: true, spicy: true, sweet: true, salty: true } },
  { id: "dish-17", name: "Cheesecake vanille", restaurant: "Sucre Studio", priceRange: "€€", image: plat17, tags: { meat: false, beef: false, chicken: false, fish: false, vegetarian: true, vegan: false, spicy: false, sweet: true, salty: false } },
  { id: "dish-18", name: "Tarte chocolat fleur de sel", restaurant: "Sucre Studio", priceRange: "€€", image: plat18, tags: { meat: false, beef: false, chicken: false, fish: false, vegetarian: true, vegan: false, spicy: false, sweet: true, salty: true } },
  { id: "dish-19", name: "Bar grille agrumes", restaurant: "Le Phare", priceRange: "€€€", image: plat06, tags: { meat: false, beef: false, chicken: false, fish: true, vegetarian: false, vegan: false, spicy: false, sweet: false, salty: true } },
  { id: "dish-20", name: "Mousse pistache framboise", restaurant: "Sucre Studio", priceRange: "€", image: plat17, tags: { meat: false, beef: false, chicken: false, fish: false, vegetarian: true, vegan: false, spicy: false, sweet: true, salty: false } },
];
