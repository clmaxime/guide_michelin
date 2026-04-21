import { useQuery } from "@tanstack/react-query";
import { dishes } from "../data/dishes";
import type { Dish } from "../types";

const wait = (delay: number) => new Promise((resolve) => window.setTimeout(resolve, delay));

export const useDishesQuery = () =>
  useQuery<Dish[]>({
    queryKey: ["dish-tinder", "dishes"],
    queryFn: async () => {
      await wait(420);
      return dishes;
    },
    staleTime: Infinity,
  });
