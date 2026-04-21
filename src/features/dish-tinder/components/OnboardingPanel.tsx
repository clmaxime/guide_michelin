import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useDishTinderStore } from "../store/dish-tinder-store";
import type { Preferences } from "../types";

const budgets: Array<"\u20ac" | "\u20ac\u20ac" | "\u20ac\u20ac\u20ac"> = [
  "\u20ac",
  "\u20ac\u20ac",
  "\u20ac\u20ac\u20ac",
];
const tastes: Preferences["taste"][] = ["sweet", "salty", "both"];

function OnboardingPanel() {
  const preferences = useDishTinderStore((state) => state.preferences);
  const setPreferences = useDishTinderStore((state) => state.setPreferences);
  const setExcludedIngredients = useDishTinderStore((state) => state.setExcludedIngredients);
  const setOnboardingDone = useDishTinderStore((state) => state.setOnboardingDone);
  const [allergies, setAllergies] = useState(preferences.excludedIngredients.join(", "));

  return (
    <section className="space-y-5 rounded-2xl border border-white/10 bg-[#131928] p-4">
      <div>
        <h2 className="font-title text-3xl">{"Configuration rapide"}</h2>
        <p className="mt-1 text-sm text-white/70">{"R\u00e9glons tes pr\u00e9f\u00e9rences avant de balayer."}</p>
      </div>

      <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <span className="text-sm">{"V\u00e9g\u00e9tarien uniquement"}</span>
        <input
          checked={preferences.vegetarianOnly}
          className="accent-[#ff4458]"
          onChange={(event) => setPreferences({ vegetarianOnly: event.target.checked })}
          type="checkbox"
        />
      </label>

      <div className="space-y-2">
        <p className="text-sm text-white/80">{"Budget"}</p>
        <div className="grid grid-cols-3 gap-2">
          {budgets.map((budget) => {
            const selected = preferences.budget.includes(budget);
            return (
              <button
                className={cn(
                  "rounded-lg border px-2 py-2 text-sm transition duration-200",
                  selected ? "border-[#ff4458] bg-[#ff4458]/20 text-white" : "border-white/20 bg-white/5 text-white/75",
                )}
                key={budget}
                onClick={() => {
                  const next = selected
                    ? preferences.budget.filter((item) => item !== budget)
                    : [...preferences.budget, budget];
                  setPreferences({ budget: next.length > 0 ? next : budgets });
                }}
                type="button"
              >
                {budget}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-white/80">{"Allergies / ingr\u00e9dients exclus"}</p>
        <Input
          className="border-white/20 bg-[#0b111d] text-white placeholder:text-white/45"
          onChange={(event) => setAllergies(event.target.value)}
          placeholder={"b\u0153uf, poulet, poisson..."}
          value={allergies}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-white/80">{"Go\u00fbt principal"}</p>
        <div className="grid grid-cols-3 gap-2">
          {tastes.map((taste) => (
            <button
              className={cn(
                "rounded-lg border px-2 py-2 text-sm capitalize transition duration-200",
                preferences.taste === taste
                  ? "border-[#ff4458] bg-[#ff4458]/20 text-white"
                  : "border-white/20 bg-white/5 text-white/75",
              )}
              key={taste}
              onClick={() => setPreferences({ taste })}
              type="button"
            >
              {taste === "both" ? "Les deux" : taste === "sweet" ? "Sucr\u00e9" : "Sal\u00e9"}
            </button>
          ))}
        </div>
      </div>

      <Button
        className="w-full"
        onClick={() => {
          setExcludedIngredients(allergies);
          setOnboardingDone(true);
        }}
        type="button"
      >
        {"Lancer les suggestions"}
      </Button>
    </section>
  );
}

export default OnboardingPanel;
