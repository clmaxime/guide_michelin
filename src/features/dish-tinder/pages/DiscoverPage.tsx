import { RotateCcw, TestTube2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DishCard from "../components/DishCard";
import DishSkeleton from "../components/DishSkeleton";
import OnboardingPanel from "../components/OnboardingPanel";
import PhoneShell from "../components/PhoneShell";
import { useDishDeck } from "../hooks/useDishDeck";
import { useDishesQuery } from "../hooks/useDishesQuery";
import { useDishTinderStore } from "../store/dish-tinder-store";

function DiscoverPage() {
  const { data = [], isLoading } = useDishesQuery();
  const { currentDish, nextDish, remainingCount, swipeLeft, swipeRight } = useDishDeck(data);
  const onboardingDone = useDishTinderStore((state) => state.onboardingDone);
  const mockLocation = useDishTinderStore((state) => state.mockLocation);
  const testMode = useDishTinderStore((state) => state.testMode);
  const toggleTestMode = useDishTinderStore((state) => state.toggleTestMode);
  const reset = useDishTinderStore((state) => state.reset);
  const relaunchSuggestions = useDishTinderStore((state) => state.relaunchSuggestions);
  const [commitStamp, setCommitStamp] = useState<"like" | "dislike" | null>(null);

  const runLike = () => {
    setCommitStamp("like");
    window.setTimeout(() => {
      swipeRight();
      setCommitStamp(null);
    }, 180);
  };

  const runDislike = () => {
    setCommitStamp("dislike");
    window.setTimeout(() => {
      swipeLeft();
      setCommitStamp(null);
    }, 180);
  };

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,_#1e2740_0%,_#0b0f18_46%,_#070a12_100%)] px-2 sm:px-4">
      <PhoneShell
        rightSlot={
          <div className="flex items-center justify-end gap-2">
            <button
              className={`rounded-lg border px-2 py-1 text-[11px] transition ${testMode ? "border-[#ff4458] bg-[#ff4458]/20 text-white" : "border-white/20 text-white/70"}`}
              onClick={toggleTestMode}
              type="button"
            >
              <TestTube2 className="mx-auto size-3.5" />
              essai
            </button>
            <button className="rounded-lg border border-white/20 p-1.5 text-white/70" onClick={reset} type="button">
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        }
        title="Découvrir"
      >
        <section className="space-y-4 p-4">
          <header className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.08em] text-white/60">Localisation simulée</p>
            <p className="text-sm text-white/90">{mockLocation}</p>
          </header>

          {!onboardingDone ? <OnboardingPanel /> : null}

          {onboardingDone ? (
            <>
              {isLoading ? <DishSkeleton /> : null}
              {!isLoading && currentDish ? (
                <div className="space-y-3">
                  {nextDish ? (
                    <article className="translate-y-2 scale-[0.98] overflow-hidden rounded-3xl border border-white/10 opacity-60">
                      <img alt={nextDish.name} className="h-40 w-full object-cover" src={nextDish.image} />
                    </article>
                  ) : null}

                  <DishCard commitStamp={commitStamp} dish={currentDish} onDislike={runDislike} onLike={runLike} />

                  <div className="grid grid-cols-2 gap-3">
                    <Button className="h-11 rounded-xl border border-white/20 bg-white/5 text-white hover:bg-white/10" onClick={runDislike} type="button" variant="outline">
                      Je passe
                    </Button>
                    <Button className="h-11 rounded-xl" onClick={runLike} type="button">
                      J'aime
                    </Button>
                  </div>
                </div>
              ) : null}

              {!isLoading && !currentDish ? (
                <article className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-lg font-semibold">Plus de plats disponibles</p>
                  <p className="text-sm text-white/70">Tu as balayé toute la sélection actuelle.</p>
                  <Button className="w-full" onClick={relaunchSuggestions} type="button">
                    Relancer suggestions
                  </Button>
                </article>
              ) : null}

              <p className="text-center text-xs text-white/60">{remainingCount} plat(s) restant(s)</p>
            </>
          ) : null}
        </section>
      </PhoneShell>
    </main>
  );
}

export default DiscoverPage;
