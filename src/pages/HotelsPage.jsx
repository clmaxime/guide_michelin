import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { favoritesApi, experiencesApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { michelinHotels } from "@/data/michelin-hotels";
import HeaderSection from "@/sections/HeaderSection";
import FooterSection from "@/sections/FooterSection";
import { useUiStore } from "@/store/ui-store";
import ExperienceCard from "@/components/experiences/ExperienceCard";

function formatLocation(slug) {
  if (!slug) return "Destination Michelin";
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // ignore malformed URI sequence
  }
  return decoded
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildHotelKey(hotel) {
  return `${hotel.locationSlug ?? "hotel"}_${hotel.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

export default function HotelsPage() {
  const setScrolled = useUiStore((state) => state.setScrolled);
  const user = useAuthStore((state) => state.user);
  const [favoriteKeys, setFavoriteKeys] = useState(new Set());
  const [message, setMessage] = useState("");
  const [experienceItems, setExperienceItems] = useState([]);

  useEffect(() => {
    setScrolled(true);
  }, [setScrolled]);

  useEffect(() => {
    if (!user) {
      setFavoriteKeys(new Set());
      return;
    }
    favoritesApi
      .listHotels()
      .then((items) => setFavoriteKeys(new Set(items.map((item) => item.hotelKey))))
      .catch(() => setFavoriteKeys(new Set()));
  }, [user]);

  useEffect(() => {
    experiencesApi
      .highlights(4)
      .then((data) => setExperienceItems(Array.isArray(data) ? data : []))
      .catch(() => setExperienceItems([]));
  }, []);

  async function toggleHotelFavorite(hotel) {
    if (!user) {
      setMessage("Connecte-toi pour ajouter un hôtel en favoris.");
      return;
    }
    const hotelKey = buildHotelKey(hotel);
    const alreadyFavorite = favoriteKeys.has(hotelKey);

    try {
      if (alreadyFavorite) {
        await favoritesApi.deleteHotel(hotelKey);
        setFavoriteKeys((prev) => {
          const next = new Set(prev);
          next.delete(hotelKey);
          return next;
        });
      } else {
        await favoritesApi.upsertHotel({
          hotelKey,
          hotelName: hotel.name,
          hotelImage: hotel.image,
          hotelUrl: hotel.url,
          hotelLocationSlug: hotel.locationSlug,
        });
        setFavoriteKeys((prev) => new Set(prev).add(hotelKey));
      }
      setMessage("");
    } catch {
      setMessage("Impossible de mettre à jour les favoris hôtels.");
    }
  }

  return (
    <>
      <HeaderSection />
      <main className="min-h-screen bg-[#0f0f0f] pt-[4.4rem]">
        <section className="mx-auto w-full max-w-[1220px] px-4 py-12 md:px-7 md:py-14 xl:py-16">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary">Sélection hôtels</p>
              <h1 className="font-title text-[2.1rem] leading-[1.1] text-white md:text-[2.7rem]">Hôtels recommandés</h1>
              <p className="mt-2 max-w-[52rem] text-white/55">
                Une sélection premium inspirée du Guide Michelin, dans une ambiance sombre cohérente avec le reste du site.
              </p>
            </div>
            <Link
              className={buttonVariants({
                className: "rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm text-white hover:bg-white/20",
              })}
              to="/"
            >
              Retour à l'accueil
            </Link>
          </header>

          {message ? <p className="mb-4 text-sm text-white/70">{message}</p> : null}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {michelinHotels.map((hotel) => {
              const hotelKey = buildHotelKey(hotel);
              const isFavorite = favoriteKeys.has(hotelKey);
              return (
                <Card
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] shadow-[0_16px_36px_rgba(0,0,0,0.35)]"
                  key={hotel.url}
                >
                  <div className="relative">
                    <img alt={hotel.name} className="h-52 w-full object-cover" loading="lazy" src={hotel.image} />
                    <button
                      className={`absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full border transition ${
                        isFavorite
                          ? "border-primary bg-primary text-white"
                          : "border-white/30 bg-black/40 text-white hover:bg-black/60"
                      }`}
                      onClick={() => toggleHotelFavorite(hotel)}
                      type="button"
                    >
                      <Heart className={`size-4 ${isFavorite ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <CardContent className="space-y-2 p-4 pt-4">
                    <CardTitle className="mb-1 text-[1.15rem] text-white">{hotel.name}</CardTitle>
                    <p className="text-sm text-white/60">{formatLocation(hotel.locationSlug)}</p>
                    <a
                      className="text-sm font-semibold text-primary hover:underline"
                      href={hotel.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Voir la fiche Michelin
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {experienceItems.length > 0 ? (
            <section className="mt-12">
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary">À proximité</p>
                  <h2 className="font-title text-3xl text-white">Expériences à réserver</h2>
                  <p className="mt-1 text-white/55">Des activités premium pour compléter votre séjour.</p>
                </div>
                <Link
                  className={buttonVariants({
                    className:
                      "rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20",
                  })}
                  to="/experiences"
                >
                  Toutes les expériences
                </Link>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {experienceItems.map((item) => (
                  <ExperienceCard compact experience={item} key={item.id} />
                ))}
              </div>
            </section>
          ) : null}
        </section>
      </main>
      <FooterSection />
    </>
  );
}
