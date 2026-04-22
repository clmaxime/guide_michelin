import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";
import { dishesApi, favoritesApi } from "@/lib/api";
import HeaderSection from "@/sections/HeaderSection";
import FooterSection from "@/sections/FooterSection";
import DishCard from "../features/dish-tinder/DishCard";
import SwipePlaceholder from "../features/dish-tinder/SwipePlaceholder";
import { dishOptions as fallbackDishOptions } from "../features/dish-tinder/data/dishes";
import { useDishTinderStore } from "../features/dish-tinder/store/dish-tinder-store";

const normalizeToken = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

function containsToken(sourceArray, target) {
  const normalizedTarget = normalizeToken(target);
  if (!normalizedTarget) {
    return false;
  }

  return sourceArray.some((item) => {
    const normalizedItem = normalizeToken(item);
    return normalizedItem.includes(normalizedTarget) || normalizedTarget.includes(normalizedItem);
  });
}

function mapApiDishToUi(dish) {
  return {
    id: dish.id,
    sourceKey: dish.sourceKey,
    title: dish.title,
    caption: dish.caption,
    cuisine: dish.cuisine,
    mood: dish.mood,
    prepTime: dish.prepTime,
    budget: dish.budget,
    image: dish.image,
    tags: dish.tags ?? [],
    vegan: Boolean(dish.vegan),
    ingredients: dish.ingredients ?? [],
    allergens: dish.allergens ?? [],
    restaurantId: dish.restaurantId,
    restaurantName: dish.restaurantName,
    restaurantAddress: dish.restaurantAddress,
    restaurantHours: dish.restaurantHours,
    restaurantPhone: dish.restaurantPhone,
  };
}

function DiscoverPage() {
  const user = useAuthStore((state) => state.user);
  const preferences = useAuthStore((state) => state.preferences);
  const setScrolled = useUiStore((state) => state.setScrolled);

  const selectedCuisine = useDishTinderStore((state) => state.selectedCuisine);
  const selectedMood = useDishTinderStore((state) => state.selectedMood);
  const likedIds = useDishTinderStore((state) => state.likedIds);
  const dislikedIds = useDishTinderStore((state) => state.dislikedIds);
  const lastSwipe = useDishTinderStore((state) => state.lastSwipe);
  const setSelectedCuisine = useDishTinderStore((state) => state.setSelectedCuisine);
  const setSelectedMood = useDishTinderStore((state) => state.setSelectedMood);
  const swipeDish = useDishTinderStore((state) => state.swipeDish);
  const resetSession = useDishTinderStore((state) => state.resetSession);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [infoMessage, setInfoMessage] = useState("");
  const [dishes, setDishes] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(true);

  useEffect(() => {
    setScrolled(true);
  }, [setScrolled]);

  useEffect(() => {
    let mounted = true;
    setLoadingDishes(true);
    dishesApi
      .list({ limit: 500 })
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setDishes(data.map(mapApiDishToUi));
        } else {
          setDishes(fallbackDishOptions);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setDishes(fallbackDishOptions);
      })
      .finally(() => {
        if (mounted) setLoadingDishes(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const cuisineOptions = useMemo(
    () => ["all", ...new Set(dishes.map((dish) => dish.cuisine).filter(Boolean))],
    [dishes],
  );

  const moodOptions = useMemo(
    () => ["all", ...new Set(dishes.map((dish) => dish.mood).filter(Boolean))],
    [dishes],
  );

  const filteredDishes = useMemo(() => {
    const excludedIngredients = preferences?.excludedIngredients ?? [];
    const excludedAllergens = preferences?.allergens ?? [];
    const excludedTags = preferences?.excludedTags ?? [];

    return dishes.filter((dish) => {
      const cuisineMatch = selectedCuisine === "all" || dish.cuisine === selectedCuisine;
      const moodMatch = selectedMood === "all" || dish.mood === selectedMood;
      if (!cuisineMatch || !moodMatch) {
        return false;
      }

      if (preferences?.veganOnly && !dish.vegan) {
        return false;
      }

      if (containsToken(dish.ingredients ?? [], excludedIngredients)) {
        return false;
      }

      if (containsToken(dish.allergens ?? [], excludedAllergens)) {
        return false;
      }

      if (containsToken(dish.tags ?? [], excludedTags)) {
        return false;
      }

      return true;
    });
  }, [dishes, preferences, selectedCuisine, selectedMood]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCuisine, selectedMood, preferences, dishes]);

  const activeDish = filteredDishes[currentIndex] ?? null;
  const remainingCount = Math.max(filteredDishes.length - currentIndex - 1, 0);

  const handleSwipe = async (direction) => {
    if (!activeDish) {
      return;
    }

    swipeDish(activeDish.id, direction);
    setInfoMessage("");

    if (direction === "right") {
      if (!user) {
        setInfoMessage("Connecte-toi pour enregistrer ce like dans tes favoris.");
      } else {
        try {
          await favoritesApi.upsert({
            dishId: activeDish.id,
            dishTitle: activeDish.title,
            dishCaption: activeDish.caption,
            dishImage: activeDish.image,
            dishCuisine: activeDish.cuisine,
            restaurantId: activeDish.restaurantId,
            restaurantI: activeDish.restaurantId,
            restaurantName: activeDish.restaurantName,
            restaurantAddress: activeDish.restaurantAddress,
            restaurantHours: activeDish.restaurantHours,
            restaurantPhone: activeDish.restaurantPhone,
          });
          setInfoMessage("Ajouté aux favoris (valable 24h).");
        } catch {
          setInfoMessage("Impossible d'ajouter ce plat aux favoris.");
        }
      }
    }

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
    <>
      <HeaderSection />
      <main className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,#3d121c_0%,#121217_35%,#09090c_75%)] pt-[4.4rem]">
        <div className="mx-auto w-full max-w-[1220px] px-4 py-8 md:px-6 md:py-12">
          <header className="mb-5 flex flex-col gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#ffb9c5]">Food Match</p>
              <h1 className="font-title text-[1.8rem] leading-tight text-white sm:text-[2.1rem] md:text-[2.5rem]">Découverte personnalisée</h1>
              <p className="mt-2 max-w-[42rem] text-sm text-white/75">Swipe à droite pour sauvegarder, swipe à gauche pour passer.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button className="rounded-lg border border-white/20 bg-white/6 text-white hover:bg-white/12" onClick={handleReset} type="button">
                <RotateCcw className="size-4" />
                Réinitialiser
              </Button>
              <Link className={buttonVariants({ className: "rounded-lg border border-white/20 bg-transparent text-white hover:bg-white/12" })} to="/">
                <ArrowLeft className="size-4" />
                Accueil
              </Link>
            </div>
          </header>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section className="space-y-4">
              {loadingDishes && !activeDish ? <p className="text-sm text-white/70">Chargement des plats...</p> : null}
              <DishCard dish={activeDish} />
              {infoMessage ? <p className="text-xs text-white/70">{infoMessage}</p> : null}
              <SwipePlaceholder
                disabled={!activeDish}
                lastSwipe={lastSwipe}
                onSwipeLeft={() => handleSwipe("left")}
                onSwipeRight={() => handleSwipe("right")}
              />
            </section>

            <aside className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-white">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#ffb9c5]">Filtres rapides</p>
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
              <label className="mb-4 block">
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

              <div className="mb-4 rounded-xl border border-white/15 bg-black/25 p-3 text-xs text-white/80">
                <p className="mb-1 font-semibold uppercase tracking-[0.08em] text-[#ffb9c5]">Préférences compte</p>
                {user ? (
                  <>
                    <p>Vegan uniquement : {preferences?.veganOnly ? "Oui" : "Non"}</p>
                    <p>Aliments exclus : {(preferences?.excludedIngredients ?? []).join(", ") || "Aucun"}</p>
                    <p>Allergènes exclus : {(preferences?.allergens ?? []).join(", ") || "Aucun"}</p>
                  </>
                ) : (
                  <p>Connecte-toi pour appliquer automatiquement tes préférences enregistrées.</p>
                )}
              </div>

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

              <Link className="mt-4 block text-center text-xs font-semibold uppercase tracking-[0.08em] text-[#ffb9c5] hover:text-white" to="/profile">
                Gérer mes préférences
              </Link>
            </aside>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}

export default DiscoverPage;
