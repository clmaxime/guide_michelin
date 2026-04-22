import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { useRestaurantStore } from "@/store/restaurant-store";

const DAY_ORDER = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"];

function MichelinStars({ count, size = "sm" }) {
  const cls = size === "sm" ? "size-3" : "size-4";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className={`${cls} fill-primary text-primary`} />
      ))}
    </div>
  );
}

function RestaurantCard({ restaurant }) {
  const image = restaurant.imageUrls?.[0];
  const todayIndex = new Date().getDay();
  const todayKey = DAY_ORDER[todayIndex === 0 ? 6 : todayIndex - 1];
  const todayHoraire = restaurant.horaires?.find((h) => h.jour === todayKey);

  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="group relative flex aspect-[3/4] overflow-hidden rounded-2xl"
    >
      {image ? (
        <img
          src={image}
          alt={restaurant.nom}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
      )}

      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* top badge */}
      <div className="absolute left-3 top-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20 px-3 py-1">
        <MichelinStars count={restaurant.distinction} />
      </div>

      {/* bottom frosted glass panel */}
      <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md bg-white/10 border-t border-white/15 p-4 transition-all duration-300 group-hover:bg-white/15">
        <h3 className="font-title text-white text-lg font-semibold leading-tight mb-1">
          {restaurant.nom}
        </h3>
        <div className="flex items-start gap-1 mb-2">
          <MapPin className="size-3 text-white/60 mt-0.5 shrink-0" />
          <p className="text-white/60 text-xs line-clamp-1">{restaurant.adresse}</p>
        </div>
        {todayHoraire && todayHoraire.creneaux.length > 0 ? (
          <p className="text-xs text-emerald-400 font-medium">
            Ouvert · {todayHoraire.creneaux[0].ouverture}–{todayHoraire.creneaux[0].fermeture}
          </p>
        ) : (
          <p className="text-xs text-white/40">Horaires non renseignés</p>
        )}
        <div className="mt-3 flex items-center gap-1 text-xs text-white/70 group-hover:text-white transition-colors">
          Voir la fiche <ArrowRight className="size-3" />
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="aspect-[3/4] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
  );
}

function FeaturedRestaurantsSection() {
  const restaurants = useRestaurantStore((s) => s.restaurants);
  const loading = useRestaurantStore((s) => s.loading);
  const fetchAll = useRestaurantStore((s) => s.fetchAll);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (!loading && restaurants.length === 0) return null;

  return (
    <section className="bg-[#0f0f0f] py-16 md:py-20 xl:py-24" id="restaurants">
      <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-title mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Nos Restaurants
            </p>
            <h2 className="font-title text-3xl font-semibold text-white md:text-4xl">
              Tables d'exception
            </h2>
            <p className="mt-2 text-sm text-white/50 max-w-sm">
              Une sélection d'adresses étoilées, choisies pour l'excellence de leur cuisine.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : restaurants.slice(0, 8).map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      </div>
    </section>
  );
}

export default FeaturedRestaurantsSection;
