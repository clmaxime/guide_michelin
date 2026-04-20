import { create } from "zustand";

export const useUiStore = create((set) => ({
  scrolled: false,
  search: {
    destination: "",
    date: "",
    guests: "",
  },
  setScrolled: (value) => set({ scrolled: value }),
  setSearchField: (field, value) =>
    set((state) => ({
      search: {
        ...state.search,
        [field]: value,
      },
    })),
}));
