import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Search } from "lucide-react";
import { MichelinStars } from "@/components/MichelinStars";
import RestaurantImage from "@/components/RestaurantImage";
import { useRestaurantStore } from "@/store/restaurant-store";

const DAY_ORDER = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"];

function RestaurantCard({ restaurant }) {
  const todayIndex = new Date().getDay();
  const todayKey = DAY_ORDER[todayIndex === 0 ? 6 : todayIndex - 1];
  const todayHoraire = restaurant.horaires?.find((h) => h.jour === todayKey);

  return (
    <Link to={`/restaurants/${restaurant.id}`} className="group relative flex aspect-[3/4] overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
      <RestaurantImage
        imageUrls={restaurant.imageUrls}
        alt={restaurant.nom}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
        <MichelinStars count={restaurant.distinction} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 bg-white/10 p-4 backdrop-blur-md transition-all duration-300 group-hover:bg-white/15">
        <h3 className="font-title mb-1 text-lg font-semibold leading-tight text-white">{restaurant.nom}</h3>
        <div className="mb-2 flex items-start gap-1">
          <MapPin className="mt-0.5 size-3 shrink-0 text-white/60" />
          <p className="line-clamp-1 text-xs text-white/60">{restaurant.adresse}</p>
        </div>
        {todayHoraire && todayHoraire.creneaux.length > 0 ? (
          <p className="text-xs font-medium text-emerald-400">
            Ouvert · {todayHoraire.creneaux[0].ouverture}–{todayHoraire.creneaux[0].fermeture}
          </p>
        ) : (
          <p className="text-xs text-white/40">Horaires non renseignés</p>
        )}
        <div className="mt-3 flex items-center gap-1 text-xs text-white/70 transition-colors group-hover:text-white">
          Voir la fiche <ArrowRight className="size-3" />
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return <div className="aspect-[3/4] animate-pulse rounded-2xl border border-white/10 bg-white/5" />;
}

export default function FeaturedRestaurantsSection() {
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const loading = useRestaurantStore((state) => state.loading);
  const fetchAll = useRestaurantStore((state) => state.fetchAll);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (!loading && restaurants.length === 0) return null;

  return (
    <section className="bg-[#0f0f0f] py-16 md:py-20 xl:py-24" id="restaurants">
      <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="font-title mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Nos restaurants</p>
            <h2 className="font-title text-3xl font-semibold text-white md:text-4xl">Tables d'exception</h2>
            <p className="mt-2 max-w-sm text-sm text-white/50">
              Une sélection d'adresses étoilées, choisies pour l'excellence de leur cuisine.
            </p>
          </div>
          <Link to="/restaurants" className="flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white/80 backdrop-blur-md transition hover:bg-white/20">
            <Search className="size-4" />
            Rechercher
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />) : restaurants.slice(0, 8).map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}
        </div>
      </div>
    </section>
  );
}

