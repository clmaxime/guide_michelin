import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import PhoneShell from "../components/PhoneShell";
import { useDishTinderStore } from "../store/dish-tinder-store";
import type { Preferences } from "../types";

const budgets: Array<"\u20ac" | "\u20ac\u20ac" | "\u20ac\u20ac\u20ac"> = [
  "\u20ac",
  "\u20ac\u20ac",
  "\u20ac\u20ac\u20ac",
];
const tastes: Preferences["taste"][] = ["sweet", "salty", "both"];

function SettingsPage() {
  const preferences = useDishTinderStore((state) => state.preferences);
  const testMode = useDishTinderStore((state) => state.testMode);
  const setPreferences = useDishTinderStore((state) => state.setPreferences);
  const setExcludedIngredients = useDishTinderStore((state) => state.setExcludedIngredients);
  const toggleTestMode = useDishTinderStore((state) => state.toggleTestMode);
  const reset = useDishTinderStore((state) => state.reset);

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,_#1e2740_0%,_#0b0f18_46%,_#070a12_100%)] px-2 sm:px-4">
      <PhoneShell title={"Param\u00e8tres"}>
        <section className="space-y-4 p-4">
          <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-sm">{"Mode v\u00e9g\u00e9tarien"}</span>
            <input
              checked={preferences.vegetarianOnly}
              className="accent-[#ff4458]"
              onChange={(event) => setPreferences({ vegetarianOnly: event.target.checked })}
              type="checkbox"
            />
          </label>

          <div className="space-y-2 rounded-xl border border-white/10 bg-[#141a28] p-3">
            <p className="text-sm text-white/80">{"Budget"}</p>
            <div className="grid grid-cols-3 gap-2">
              {budgets.map((budget) => {
                const selected = preferences.budget.includes(budget);
                return (
                  <button
                    className={cn(
                      "rounded-lg border px-2 py-2 text-sm transition duration-200",
                      selected ? "border-[#ff4458] bg-[#ff4458]/20 text-white" : "border-white/20 text-white/70",
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

          <div className="space-y-2 rounded-xl border border-white/10 bg-[#141a28] p-3">
            <p className="text-sm text-white/80">{"Ingr\u00e9dients exclus"}</p>
            <Input
              className="border-white/20 bg-[#0b111d] text-white placeholder:text-white/45"
              defaultValue={preferences.excludedIngredients.join(", ")}
              onBlur={(event) => setExcludedIngredients(event.target.value)}
              placeholder={"b\u0153uf, poisson, \u00e9pic\u00e9..."}
            />
          </div>

          <div className="space-y-2 rounded-xl border border-white/10 bg-[#141a28] p-3">
            <p className="text-sm text-white/80">{"Pr\u00e9f\u00e9rence de go\u00fbt"}</p>
            <div className="grid grid-cols-3 gap-2">
              {tastes.map((taste) => (
                <button
                  className={cn(
                    "rounded-lg border px-2 py-2 text-sm capitalize transition duration-200",
                    preferences.taste === taste
                      ? "border-[#ff4458] bg-[#ff4458]/20 text-white"
                      : "border-white/20 text-white/70",
                  )}
                  key={taste}
                  onClick={() => setPreferences({ taste })}
                  type="button"
                >
                  {taste === "both" ? "les deux" : taste === "sweet" ? "sucr\u00e9" : "sal\u00e9"}
                </button>
              ))}
            </div>
          </div>

          <Button
            className={cn("w-full", testMode ? "bg-emerald-600 hover:bg-emerald-600/90" : "")}
            onClick={toggleTestMode}
            type="button"
          >
            {`Mode essai : ${testMode ? "activ\u00e9" : "d\u00e9sactiv\u00e9"}`}
          </Button>

          <Button className="w-full" onClick={reset} type="button" variant="outline">
            <RotateCcw className="mr-2 size-4" />
            {"R\u00e9initialisation compl\u00e8te"}
          </Button>
        </section>
      </PhoneShell>
    </main>
  );
}

export default SettingsPage;
