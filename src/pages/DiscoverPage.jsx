import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import DishCard from "../features/dish-tinder/DishCard";
import SwipePlaceholder from "../features/dish-tinder/SwipePlaceholder";
import { cuisineOptions, dishOptions, moodOptions } from "../features/dish-tinder/data/dishes";
import { useDishTinderStore } from "../features/dish-tinder/store/dish-tinder-store";

function DiscoverPage() {
  const selectedCuisine = useDishTinderStore((state) => state.selectedCuisine);
  const selectedMood = useDishTinderStore((state) => state.selectedMood);
  const maxPrepTime = useDishTinderStore((state) => state.maxPrepTime);
  const likedIds = useDishTinderStore((state) => state.likedIds);
  const dislikedIds = useDishTinderStore((state) => state.dislikedIds);
  const lastSwipe = useDishTinderStore((state) => state.lastSwipe);
  const setSelectedCuisine = useDishTinderStore((state) => state.setSelectedCuisine);
  const setSelectedMood = useDishTinderStore((state) => state.setSelectedMood);
  const setMaxPrepTime = useDishTinderStore((state) => state.setMaxPrepTime);
  const swipeDish = useDishTinderStore((state) => state.swipeDish);
  const resetSession = useDishTinderStore((state) => state.resetSession);

  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredDishes = useMemo(
    () =>
      dishOptions.filter((dish) => {
        const cuisineMatch = selectedCuisine === "all" || dish.cuisine === selectedCuisine;
        const moodMatch = selectedMood === "all" || dish.mood === selectedMood;
        const prepMatch = dish.prepTime <= maxPrepTime;
        return cuisineMatch && moodMatch && prepMatch;
      }),
    [maxPrepTime, selectedCuisine, selectedMood],
  );

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCuisine, selectedMood, maxPrepTime]);

  const activeDish = filteredDishes[currentIndex] ?? null;
  const remainingCount = Math.max(filteredDishes.length - currentIndex - 1, 0);

  const handleSwipe = (direction) => {
    if (!activeDish) {
      return;
    }

    swipeDish(activeDish.id, direction);
    setCurrentIndex((index) => index + 1);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        handleSwipe("left");
      }
      if (event.key === "ArrowRight") {
        handleSwipe("right");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeDish]);

  const handleReset = () => {
    resetSession();
    setCurrentIndex(0);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,#3d121c_0%,#121217_35%,#09090c_75%)] py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#ffb9c5]">Food Match</p>
            <h1 className="font-title text-[2rem] leading-tight text-white md:text-[2.7rem]">Mode Tinder - Decouverte repas</h1>
            <p className="mt-2 max-w-[42rem] text-sm text-white/75">
              Swipe droite pour sauvegarder, swipe gauche pour passer. Fleches clavier supportees.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="rounded-lg border border-white/20 bg-white/6 text-white hover:bg-white/12" onClick={handleReset} type="button">
              <RotateCcw className="size-4" />
              Reset
            </Button>
            <Link className={buttonVariants({ className: "rounded-lg border border-white/20 bg-transparent text-white hover:bg-white/12" })} to="/">
              <ArrowLeft className="size-4" />
              Accueil
            </Link>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-white">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#ffb9c5]">Filtres</p>
            <label className="mb-3 block">
              <span className="mb-1 block text-xs text-white/65">Cuisine</span>
              <select
                className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm text-white outline-none"
                onChange={(event) => setSelectedCuisine(event.target.value)}
                value={selectedCuisine}
              >
                {cuisineOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "Toutes" : option}
                  </option>
                ))}
              </select>
            </label>
            <label className="mb-3 block">
              <span className="mb-1 block text-xs text-white/65">Ambiance</span>
              <select
                className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm text-white outline-none"
                onChange={(event) => setSelectedMood(event.target.value)}
                value={selectedMood}
              >
                {moodOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "Toutes" : option}
                  </option>
                ))}
              </select>
            </label>
            <label className="mb-4 block">
              <span className="mb-1 block text-xs text-white/65">Preparation max: {maxPrepTime} min</span>
              <input
                className="w-full accent-[#e60023]"
                max="60"
                min="10"
                onChange={(event) => setMaxPrepTime(Number(event.target.value))}
                type="range"
                value={maxPrepTime}
              />
            </label>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg border border-white/15 bg-black/25 py-2">
                <p className="text-[0.65rem] uppercase tracking-[0.08em] text-white/60">Likes</p>
                <p className="text-lg font-bold text-[#8ff3be]">{likedIds.length}</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-black/25 py-2">
                <p className="text-[0.65rem] uppercase tracking-[0.08em] text-white/60">Pass</p>
                <p className="text-lg font-bold text-[#ffb4c1]">{dislikedIds.length}</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-black/25 py-2">
                <p className="text-[0.65rem] uppercase tracking-[0.08em] text-white/60">Restant</p>
                <p className="text-lg font-bold text-white">{remainingCount}</p>
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            <DishCard dish={activeDish} />
            <SwipePlaceholder
              disabled={!activeDish}
              lastSwipe={lastSwipe}
              onSwipeLeft={() => handleSwipe("left")}
              onSwipeRight={() => handleSwipe("right")}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

export default DiscoverPage;
