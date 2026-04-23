import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import HeaderSection from "@/sections/HeaderSection";
import FooterSection from "@/sections/FooterSection";
import DishCard from "../features/dish-tinder/DishCard";
import SwipePlaceholder from "../features/dish-tinder/SwipePlaceholder";
import { useDishTinderStore } from "../features/dish-tinder/store/dish-tinder-store";
import { sortDishes } from "../lib/dishAlgo";
import { favoritesApi, dishesApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

function buildFavoritePayload(dish) {
  return {
    dishId: dish.id,
    dishTitle: dish.title,
    dishImage: dish.image,
    dishCuisine: dish.cuisine,
    dishCaption: dish.caption,
    restaurantId: dish.restaurantId ?? null,
    restaurantName: dish.restaurantName ?? "Selection Tinder Michelin",
    restaurantAddress: dish.restaurantAddress ?? "Adresse a confirmer",
    restaurantHours: dish.restaurantHours ?? "",
    restaurantPhone: dish.restaurantPhone ?? "",
  };
}

function DiscoverPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [maxPrepTime, setMaxPrepTime] = useState(120);
  const [swipeTrigger, setSwipeTrigger] = useState({ direction: null, nonce: 0 });
  const [uiFeedback, setUiFeedback] = useState({ direction: null, nonce: 0 });
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const cuisineOptions = useMemo(
    () => ["all", ...new Set(dishes.map((dish) => dish.cuisine).filter(Boolean))],
    [dishes],
  );
  const moodOptions = useMemo(
    () => ["all", ...new Set(dishes.map((dish) => dish.mood).filter(Boolean))],
    [dishes],
  );

  const selectedCuisine = useDishTinderStore((state) => state.selectedCuisine);
  const selectedMood = useDishTinderStore((state) => state.selectedMood);
  const likedIds = useDishTinderStore((state) => state.likedIds);
  const dislikedIds = useDishTinderStore((state) => state.dislikedIds);
  const lastSwipe = useDishTinderStore((state) => state.lastSwipe);
  const setSelectedCuisine = useDishTinderStore((state) => state.setSelectedCuisine);
  const setSelectedMood = useDishTinderStore((state) => state.setSelectedMood);
  const swipeDish = useDishTinderStore((state) => state.swipeDish);
  const resetSession = useDishTinderStore((state) => state.resetSession);

  const filteredDishes = useMemo(
    () =>
      dishes.filter((dish) => {
        const cuisineMatch = selectedCuisine === "all" || dish.cuisine === selectedCuisine;
        const moodMatch = selectedMood === "all" || dish.mood === selectedMood;
        const prepMatch = dish.prepTime <= maxPrepTime;
        return cuisineMatch && moodMatch && prepMatch;
      }),
    [maxPrepTime, selectedCuisine, selectedMood, dishes],
  );

  const recommendedDishes = useMemo(
    () =>
      sortDishes(filteredDishes, {
        catalog: dishes,
        selectedCuisine,
        selectedMood,
        maxPrepTime,
        likedIds,
        dislikedIds,
      }),
    [dislikedIds, filteredDishes, likedIds, maxPrepTime, selectedCuisine, selectedMood, dishes],
  );

  const activeDish = recommendedDishes[0] ?? null;

  const handleSwipeComplete = async (direction) => {
    if (!activeDish) {
      return;
    }

    swipeDish(activeDish.id, direction);

    if (direction === "right" && user) {
      try {
        await favoritesApi.upsert(buildFavoritePayload(activeDish));
      } catch {
        // Best effort sync with the shared favorites system from main.
      }
    }
  };

  const handleSwipeRequest = (direction) => {
    if (!activeDish) {
      return;
    }

    setSwipeTrigger((current) => ({ direction, nonce: current.nonce + 1 }));
    setUiFeedback((current) => ({ direction, nonce: current.nonce + 1 }));
  };

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const data = await dishesApi.list({ limit: 500 }); // Backend validation max is 500
      setDishes(data);
    } catch (error) {
      console.error("Failed to fetch dishes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  useEffect(() => {
    if (!uiFeedback.direction) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setUiFeedback((current) => ({ ...current, direction: null }));
    }, 260);

    return () => window.clearTimeout(timeoutId);
  }, [uiFeedback]);

  useEffect(() => {
    if (likedIds.length >= 15) {
      navigate("/favorites", { replace: true });
    }
  }, [likedIds.length, navigate]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        handleSwipeRequest("left");
      }
      if (event.key === "ArrowRight") {
        handleSwipeRequest("right");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeDish]);

  const handleReset = async () => {
    resetSession();
    setSelectedCuisine("all");
    setSelectedMood("all");
    setMaxPrepTime(120);
    await fetchDishes();
  };

  return (
    <>
      <HeaderSection />
      <main className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,#3d121c_0%,#121217_35%,#09090c_75%)] py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-title text-[2rem] leading-tight text-white md:text-[2.7rem]">Mode Tinder - Decouverte repas</h1>
              <p className="mt-2 max-w-[42rem] text-sm text-white/75">
                Swipe avec le doigt sur mobile, ou utilise les boutons et les fleches du clavier sur desktop.
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
            </aside>

            <section className="relative isolate space-y-4 overflow-hidden rounded-[2rem] p-3 md:p-4">
              <div
                className="pointer-events-none absolute inset-0 z-0 rounded-[2rem] transition-opacity duration-200"
                style={{
                  background:
                    uiFeedback.direction === "right"
                      ? "radial-gradient(circle at 72% 40%, rgba(91,255,158,0.3), transparent 42%), linear-gradient(135deg, rgba(91,255,158,0.12), rgba(12,12,16,0.02) 45%, rgba(91,255,158,0.08))"
                      : "radial-gradient(circle at 28% 40%, rgba(255,92,125,0.3), transparent 42%), linear-gradient(135deg, rgba(255,92,125,0.12), rgba(12,12,16,0.02) 45%, rgba(255,92,125,0.08))",
                  boxShadow:
                    uiFeedback.direction === "right"
                      ? "0 0 0 1px rgba(91,255,158,0.18) inset, 0 0 90px rgba(91,255,158,0.16)"
                      : "0 0 0 1px rgba(255,92,125,0.18) inset, 0 0 90px rgba(255,92,125,0.16)",
                  opacity: uiFeedback.direction ? 1 : 0,
                }}
              />
              <div
                className="pointer-events-none absolute inset-[-12%] z-0 blur-3xl transition-all duration-200"
                style={{
                  background:
                    uiFeedback.direction === "right"
                      ? "radial-gradient(circle at 75% 50%, rgba(91,255,158,0.34), transparent 45%)"
                      : "radial-gradient(circle at 25% 50%, rgba(255,92,125,0.34), transparent 45%)",
                  opacity: uiFeedback.direction ? 1 : 0,
                  transform: uiFeedback.direction ? "scale(1)" : "scale(0.92)",
                }}
              />
              {loading ? (
                <div className="flex min-h-[28rem] items-center justify-center rounded-3xl border border-white/15 bg-white/5 p-8 text-center text-white/75">
                  Chargement des plats...
                </div>
              ) : (
                <DishCard
                  dish={activeDish}
                  onSwipeLeft={() => handleSwipeComplete("left")}
                  onSwipeRight={() => handleSwipeComplete("right")}
                  swipeTrigger={swipeTrigger}
                />
              )}
              <SwipePlaceholder
                disabled={!activeDish || loading}
                lastSwipe={lastSwipe}
                onSwipeLeft={() => handleSwipeRequest("left")}
                onSwipeRight={() => handleSwipeRequest("right")}
              />
            </section>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}

export default DiscoverPage;
