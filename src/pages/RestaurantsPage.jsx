import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Heart, Locate, MapPin, Search, Star, X } from "lucide-react";
import { MichelinStars } from "@/components/MichelinStars";
import michelinStarUrl from "@/assets/michelin-star.svg";
import { restaurantApi, favoritesApi } from "@/lib/api";
import { useUiStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";
import HeaderSection from "@/sections/HeaderSection";

const DAY_ORDER = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"];
const RANGES = [5, 10, 20, 50];


function FilterBar({ filters, onChange }) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  function handleSearch(e) {
    onChange({ search: e.target.value, lat: undefined, lng: undefined, range: filters.range, distinction: filters.distinction });
  }

  function handleDistinction(val) {
    onChange({ ...filters, distinction: filters.distinction === val ? undefined : val });
  }

  function handleRange(val) {
    onChange({ ...filters, range: val });
  }

  function requestGeo() {
    if (!navigator.geolocation) {
      setGeoError("Géolocalisation non supportée");
      return;
    }

    setGeoLoading(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onChange({ ...filters, lat: coords.latitude, lng: coords.longitude });
        setGeoLoading(false);
      },
      () => {
        setGeoError("Position refusée");
        setGeoLoading(false);
      },
      { timeout: 8000 },
    );
  }

  function clearGeo() {
    onChange({ ...filters, lat: undefined, lng: undefined });
  }

  const hasGeo = filters.lat != null;

  return (
    <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
      <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
            <input
              className="w-full rounded-xl border border-white/15 bg-white/10 py-2.5 pl-9 pr-9 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
              onChange={handleSearch}
              placeholder="Rechercher un restaurant..."
              value={filters.search ?? ""}
            />
            {filters.search && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                onClick={() => onChange({ ...filters, search: "" })}
                type="button"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="mr-1 text-xs text-white/40">Étoiles</span>
            {[1, 2, 3].map((n) => (
              <button
                className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  filters.distinction === n
                    ? "border-primary bg-primary text-white"
                    : "border-white/15 bg-white/10 text-white/70 hover:bg-white/15"
                }`}
                key={n}
                onClick={() => handleDistinction(n)}
                type="button"
              >
                {n}
                <Star className="size-3 fill-current" />
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {hasGeo ? (
              <>
                <div className="flex items-center gap-1">
                  {RANGES.map((km) => (
                    <button
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                        filters.range === km
                          ? "border-white/30 bg-white/25 text-white"
                          : "border-white/10 bg-white/10 text-white/50 hover:bg-white/15"
                      }`}
                      key={km}
                      onClick={() => handleRange(km)}
                      type="button"
                    >
                      {km} km
                    </button>
                  ))}
                </div>
                <button
                  className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/30"
                  onClick={clearGeo}
                  type="button"
                >
                  <MapPin className="size-3.5" />
                  Autour de moi
                  <X className="ml-0.5 size-3" />
                </button>
              </>
            ) : (
              <button
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md transition hover:bg-white/20 disabled:opacity-50"
                disabled={geoLoading}
                onClick={requestGeo}
                type="button"
              >
                <Locate className={`size-3.5 ${geoLoading ? "animate-pulse" : ""}`} />
                {geoLoading ? "Localisation..." : "Autour de moi"}
              </button>
            )}
          </div>
        </div>

        {geoError ? <p className="mt-2 text-xs text-red-400">{geoError}</p> : null}
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant, isFavorite, onToggleFavorite }) {
  const image = restaurant.imageUrls?.[0];
  const todayIndex = new Date().getDay();
  const todayKey = DAY_ORDER[todayIndex === 0 ? 6 : todayIndex - 1];
  const todayHoraire = restaurant.horaires?.find((h) => h.jour === todayKey);

  return (
    <Link className="group relative flex aspect-[3/4] overflow-hidden rounded-2xl" to={`/restaurants/${restaurant.id}`}>
      {image ? (
        <img
          alt={restaurant.nom}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          src={image}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur-md">
        <MichelinStars count={restaurant.distinction} />
      </div>

      {restaurant.distance != null ? (
        <div className="absolute right-3 top-3 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
          {restaurant.distance} km
        </div>
      ) : null}

      <button
        className={`absolute ${restaurant.distance != null ? "top-12" : "top-3"} right-3 z-10 inline-flex size-8 items-center justify-center rounded-full border transition ${
          isFavorite
            ? "border-primary bg-primary text-white"
            : "border-white/20 bg-black/30 text-white hover:bg-black/50"
        }`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onToggleFavorite(restaurant.id);
        }}
        type="button"
      >
        <Heart className={`size-4 ${isFavorite ? "fill-current" : ""}`} />
      </button>

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 bg-white/10 p-4 backdrop-blur-md transition-all duration-300 group-hover:bg-white/15">
        <h3 className="mb-1 font-title text-lg font-semibold leading-tight text-white">{restaurant.nom}</h3>
        <div className="mb-2 flex items-start gap-1">
          <MapPin className="mt-0.5 size-3 shrink-0 text-white/50" />
          <p className="line-clamp-1 text-xs text-white/50">{restaurant.adresse}</p>
        </div>
        {todayHoraire?.creneaux?.length > 0 ? (
          <p className="text-xs font-medium text-emerald-400">
            Ouvert · {todayHoraire.creneaux[0].ouverture}–{todayHoraire.creneaux[0].fermeture}
          </p>
        ) : (
          <p className="text-xs text-white/30">Horaires non renseignés</p>
        )}
        <div className="mt-3 flex items-center gap-1 text-xs text-white/60 transition-colors group-hover:text-white">
          Voir la fiche <ArrowRight className="size-3" />
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return <div className="aspect-[3/4] animate-pulse rounded-2xl border border-white/10 bg-white/5" />;
}

const DEFAULT_FILTERS = { search: "", distinction: undefined, lat: undefined, lng: undefined, range: 10 };

export default function RestaurantsPage() {
  const setScrolled = useUiStore((s) => s.setScrolled);
  const user = useAuthStore((s) => s.user);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [restaurants, setRestaurants] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const debounceRef = useRef(null);

  useEffect(() => {
    setScrolled(true);
  }, [setScrolled]);

  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }

    favoritesApi
      .listRestaurants()
      .then((items) => setFavoriteIds(new Set(items.map((item) => item.restaurantId))))
      .catch(() => setFavoriteIds(new Set()));
  }, [user]);

  const fetch = useCallback((params) => {
    setLoading(true);
    restaurantApi
      .findAll(params)
      .then(setRestaurants)
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, []);

  function handleFiltersChange(next) {
    setFilters(next);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    const delay = next.search !== filters.search ? 400 : 0;
    debounceRef.current = setTimeout(() => fetch(next), delay);
  }

  useEffect(() => {
    fetch(DEFAULT_FILTERS);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [fetch]);

  async function handleToggleRestaurantFavorite(restaurantId) {
    if (!user) {
      setFavoriteMessage("Connecte-toi pour ajouter ce restaurant en favoris.");
      return;
    }

    const alreadyFavorite = favoriteIds.has(restaurantId);

    try {
      if (alreadyFavorite) {
        await favoritesApi.deleteRestaurant(restaurantId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(restaurantId);
          return next;
        });
      } else {
        await favoritesApi.upsertRestaurant({ restaurantId });
        setFavoriteIds((prev) => new Set(prev).add(restaurantId));
      }
      setFavoriteMessage("");
    } catch {
      setFavoriteMessage("Impossible de mettre à jour les favoris restaurants.");
    }
  }

  return (
    <>
      <HeaderSection />

      <div className="min-h-screen bg-[#0f0f0f] pt-[4.4rem]">
        <div className="relative overflow-hidden border-b border-white/5 py-14">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-[1220px] px-4 md:px-7">
            <Link className="mb-6 inline-flex items-center gap-2 text-xs text-white/40 transition hover:text-white/70" to="/">
              <ArrowLeft className="size-3.5" /> Accueil
            </Link>
            <p className="mb-1 font-title text-xs font-semibold uppercase tracking-[0.2em] text-primary">Guide Michelin</p>
            <h1 className="font-title text-4xl font-semibold text-white md:text-5xl">Restaurants</h1>
            <p className="mt-2 text-sm text-white/40">Trouvez votre prochaine table d'exception.</p>
          </div>
        </div>

        <div className="sticky top-[4.4rem] z-10 border-b border-white/5 bg-[#0f0f0f]/80 py-4 backdrop-blur-sm">
          <FilterBar filters={filters} onChange={handleFiltersChange} />
        </div>

        <div className="mx-auto max-w-[1220px] px-4 py-10 md:px-7">
          {!loading ? (
            <p className="mb-6 text-xs text-white/30">
              {restaurants.length === 0 ? "Aucun résultat" : `${restaurants.length} restaurant${restaurants.length > 1 ? "s" : ""}`}
              {filters.lat != null && ` · dans un rayon de ${filters.range} km`}
            </p>
          ) : null}

          {favoriteMessage ? <p className="mb-4 text-sm text-white/70">{favoriteMessage}</p> : null}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : restaurants.map((r) => (
                  <RestaurantCard
                    isFavorite={favoriteIds.has(r.id)}
                    key={r.id}
                    onToggleFavorite={handleToggleRestaurantFavorite}
                    restaurant={r}
                  />
                ))}
          </div>

          {!loading && restaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex gap-1">
                {[1, 2, 3].map((i) => (
                  <Star className="size-6 text-white/10" key={i} />
                ))}
              </div>
              <p className="font-title text-xl text-white/30">Aucun restaurant trouvé</p>
              <p className="mt-1 text-sm text-white/20">Essayez d'ajuster vos filtres</p>
              <button
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/70 backdrop-blur-md transition hover:bg-white/15"
                onClick={() => handleFiltersChange(DEFAULT_FILTERS)}
                type="button"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
