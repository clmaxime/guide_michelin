import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, ChevronRight, ExternalLink } from "lucide-react";
import { MichelinStars, MICHELIN_LABELS } from "@/components/MichelinStars";
import { experiencesApi, restaurantApi } from "@/lib/api";
import { MAPBOX_ACCESS_TOKEN } from "@/lib/mapbox";
import { useUiStore } from "@/store/ui-store";
import HeaderSection from "@/sections/HeaderSection";
import ExperienceCard from "@/components/experiences/ExperienceCard";

const DAY_ORDER = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"];
const DAY_LABELS = {
  LUNDI: "Lundi",
  MARDI: "Mardi",
  MERCREDI: "Mercredi",
  JEUDI: "Jeudi",
  VENDREDI: "Vendredi",
  SAMEDI: "Samedi",
  DIMANCHE: "Dimanche",
};

function GlassCard({ className = "", children }) {
  return <div className={`rounded-2xl border border-white/15 bg-white/[0.08] text-white backdrop-blur-xl ${className}`}>{children}</div>;
}

function GlassButton({ to, onClick, children, className = "" }) {
  const base =
    "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95";
  if (to) {
    return (
      <Link to={to} className={`${base} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={`${base} ${className}`} type="button">
      {children}
    </button>
  );
}

function HorairesCard({ horaires }) {
  const todayIndex = new Date().getDay();
  const todayKey = DAY_ORDER[todayIndex === 0 ? 6 : todayIndex - 1];
  const sorted = [...(horaires ?? [])].sort((a, b) => DAY_ORDER.indexOf(a.jour) - DAY_ORDER.indexOf(b.jour));

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="size-4 text-primary" />
        <h3 className="font-title text-lg font-semibold">Horaires</h3>
      </div>
      {sorted.length === 0 ? (
        <p className="text-sm text-white/40">Non renseignÃ©s</p>
      ) : (
        <ul className="space-y-2">
          {sorted.map((h) => (
            <li
              key={h.jour}
              className={`flex items-start justify-between gap-4 rounded-lg px-3 py-2 text-sm ${
                h.jour === todayKey ? "bg-white/10 ring-1 ring-white/20" : ""
              }`}
            >
              <span className={`w-24 shrink-0 font-medium ${h.jour === todayKey ? "text-primary" : "text-white/70"}`}>
                {DAY_LABELS[h.jour]}
                {h.jour === todayKey ? (
                  <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary">Auj.</span>
                ) : null}
              </span>
              <div className="flex flex-col items-end gap-0.5">
                {h.creneaux.map((c, i) => (
                  <span key={i} className="tabular-nums text-white/90">
                    {c.ouverture} - {c.fermeture}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}

function InfoCard({ restaurant }) {
  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="size-4 text-primary" />
        <h3 className="font-title text-lg font-semibold">Informations</h3>
      </div>
      <div className="space-y-4">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/40">Adresse</p>
          <p className="text-sm leading-relaxed text-white/90">{restaurant.adresse}</p>
        </div>
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">Distinction</p>
          <div className="flex items-center gap-2">
            <MichelinStars count={restaurant.distinction} size="lg" />
            <span className="text-sm text-white/70">{MICHELIN_LABELS[restaurant.distinction]}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function MapCard({ restaurant }) {
  const { latitude: lat, longitude: lng, nom, adresse } = restaurant;
  if (!lat || !lng || !MAPBOX_ACCESS_TOKEN) return null;

  const mapUrl =
    `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/` +
    `pin-s+e60023(${lng},${lat})/` +
    `${lng},${lat},15,0/` +
    `800x320@2x` +
    `?access_token=${MAPBOX_ACCESS_TOKEN}&attribution=false&logo=false`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${nom} ${adresse}`)}`;

  return (
    <GlassCard className="overflow-hidden">
      <div className="relative">
        <img src={mapUrl} alt={`Carte - ${nom}`} className="h-64 w-full object-cover" loading="lazy" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-1">
            <div className="rounded-full bg-primary p-2 shadow-[0_0_20px_rgba(230,0,35,0.6)]">
              <MapPin className="size-4 text-white" />
            </div>
            <div className="h-2 w-0.5 bg-primary/60" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-sm leading-snug text-white/70">{adresse}</p>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md transition hover:bg-white/20"
        >
          Ouvrir
          <ExternalLink className="size-3" />
        </a>
      </div>
    </GlassCard>
  );
}

function Gallery({ images }) {
  if (images.length <= 1) return null;
  return (
    <GlassCard className="p-6">
      <h3 className="mb-4 font-title text-lg font-semibold">Galerie</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.slice(1).map((url, i) => (
          <div key={i} className="aspect-square overflow-hidden rounded-xl">
            <img src={url} alt={`Photo ${i + 2}`} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const setScrolled = useUiStore((state) => state.setScrolled);
  const [restaurant, setRestaurant] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setScrolled(false);
  }, [setScrolled]);

  useEffect(() => {
    setLoading(true);
    restaurantApi
      .findOne(id)
      .then((data) => setRestaurant(data))
      .catch(() => navigate("/", { replace: true }))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (!restaurant?.latitude || !restaurant?.longitude) {
      setExperiences([]);
      return;
    }

    experiencesApi
      .list({ lat: restaurant.latitude, lng: restaurant.longitude, range: 20, limit: 8 })
      .then((data) => setExperiences(Array.isArray(data) ? data : []))
      .catch(() => setExperiences([]));
  }, [restaurant]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f0f0f]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!restaurant) return null;
  const heroImage = restaurant.imageUrls?.[0];

  return (
    <>
      <HeaderSection />
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {heroImage ? (
          <img src={heroImage} alt={restaurant.nom} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        <div className="absolute left-6 top-24 z-10">
          <GlassButton to="/restaurants">
            <ArrowLeft className="size-4" />
            Retour
          </GlassButton>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="mx-auto max-w-[1220px] px-6 pb-14 md:px-10">
            <MichelinStars count={restaurant.distinction} size="lg" />
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary/80">{MICHELIN_LABELS[restaurant.distinction]}</p>
            <h1 className="mt-3 font-title text-5xl font-semibold leading-none text-white md:text-7xl">{restaurant.nom}</h1>
            <div className="mt-4 flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-white/50" />
              <p className="text-sm text-white/60">{restaurant.adresse}</p>
            </div>
            <div className="mt-8 flex select-none items-center gap-2 text-xs text-white/30">
              <ChevronRight className="size-3 rotate-90" />
              DÃ©couvrir
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        {heroImage ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(48px) brightness(0.18) saturate(1.4)",
              transform: "scale(1.15)",
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-[#0a0a0a]" />
        )}

        <div className="relative z-10 mx-auto max-w-[1220px] px-4 py-16 md:px-7 md:py-24">
          <div className="grid gap-5 md:grid-cols-2">
            <InfoCard restaurant={restaurant} />
            <HorairesCard horaires={restaurant.horaires} />
          </div>
          <div className="mt-5">
            <MapCard restaurant={restaurant} />
          </div>
          {restaurant.imageUrls?.length > 1 ? (
            <div className="mt-5">
              <Gallery images={restaurant.imageUrls} />
            </div>
          ) : null}
          {experiences.length > 0 ? (
            <div className="mt-5 rounded-2xl border border-white/15 bg-white/[0.08] p-6 backdrop-blur-xl">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.1em] text-primary">Suggestions</p>
                  <h2 className="font-title text-3xl text-white">Exp&eacute;riences autour du restaurant</h2>
                  <p className="mt-1 text-sm text-white/55">Affich&eacute;es dans un rayon maximum de 20 km.</p>
                </div>
                <Link
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
                  to="/experiences"
                >
                  Voir tout
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {experiences.map((experience) => (
                  <ExperienceCard compact experience={experience} key={experience.id} />
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-10 flex justify-center">
            <GlassButton to="/">
              <ArrowLeft className="size-4" />
              Retour Ã  l'accueil
            </GlassButton>
          </div>
        </div>
      </section>
    </>
  );
}

