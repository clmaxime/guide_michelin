import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { favoritesApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { michelinHotels } from "@/data/michelin-hotels";
import HeaderSection from "@/sections/HeaderSection";
import FooterSection from "@/sections/FooterSection";
import { useUiStore } from "@/store/ui-store";

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

function HotelsPage() {
  const setScrolled = useUiStore((state) => state.setScrolled);
  const user = useAuthStore((state) => state.user);
  const [favoriteKeys, setFavoriteKeys] = useState(new Set());
  const [message, setMessage] = useState("");

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

  async function toggleHotelFavorite(hotel) {
    if (!user) {
      setMessage("Connecte-toi pour ajouter un hÃ´tel en favoris.");
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
      setMessage("Impossible de mettre Ã  jour les favoris hÃ´tels.");
    }
  }

  return (
    <>
      <HeaderSection />
      <main className="bg-secondary pt-[4.4rem]">
        <section className="mx-auto w-full max-w-[1220px] px-4 py-12 md:px-7 md:py-14 xl:py-16">
          <header className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary">SÃ©lection hÃ´tels</p>
              <h1 className="font-title text-[2rem] leading-[1.1] text-foreground md:text-[2.5rem]">HÃ´tels recommandÃ©s</h1>
              <p className="mt-2 max-w-[50rem] text-muted-foreground">
                Une sÃ©lection premium inspirÃ©e du Guide Michelin, avec accÃ¨s direct Ã  chaque fiche officielle.
              </p>
            </div>
            <Link className={buttonVariants({ className: "rounded-full px-5 py-2 text-sm" })} to="/">
              Retour Ã  l'accueil
            </Link>
          </header>

          {message ? <p className="mb-4 text-sm text-muted-foreground">{message}</p> : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {michelinHotels.map((hotel) => {
              const hotelKey = buildHotelKey(hotel);
              const isFavorite = favoriteKeys.has(hotelKey);
              return (
                <Card className="overflow-hidden rounded-2xl border border-border/70 bg-white/80 shadow-sm" key={hotel.url}>
                  <div className="relative">
                    <img alt={hotel.name} className="h-52 w-full object-cover" loading="lazy" src={hotel.image} />
                    <button
                      className={`absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full border transition ${
                        isFavorite ? "border-primary bg-primary text-white" : "border-white/30 bg-black/30 text-white hover:bg-black/50"
                      }`}
                      onClick={() => toggleHotelFavorite(hotel)}
                      type="button"
                    >
                      <Heart className={`size-4 ${isFavorite ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <CardContent className="p-4 pt-4">
                    <CardTitle className="mb-1 text-[1.15rem]">{hotel.name}</CardTitle>
                    <p className="mb-3 text-sm text-muted-foreground">{formatLocation(hotel.locationSlug)}</p>
                    <a className="text-sm font-semibold text-primary hover:underline" href={hotel.url} rel="noopener noreferrer" target="_blank">
                      Voir la fiche Michelin
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}

export default HotelsPage;
