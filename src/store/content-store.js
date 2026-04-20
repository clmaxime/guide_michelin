import { create } from "zustand";
import {
  articleCards,
  categoryCards,
  destinationCards,
  favoriteIcon,
  footerSocials,
  headerLinks,
  heroAssets,
  inspirationCards,
  searchFields,
} from "@/data/content";

export const useContentStore = create(() => ({
  heroAssets,
  headerLinks,
  searchFields,
  categoryCards,
  inspirationCards,
  articleCards,
  destinationCards,
  footerSocials,
  favoriteIcon,
}));
