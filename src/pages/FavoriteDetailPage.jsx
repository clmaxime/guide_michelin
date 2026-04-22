import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  ChefHat,
  Clock3,
  ExternalLink,
  MapPin,
  Phone,
  RefreshCcw,
  Sparkles,
  Utensils,
} from "lucide-react";
import HeaderSection from "@/sections/HeaderSection";
import FooterSection from "@/sections/FooterSection";
import { Button } from "@/components/ui/button";
import { favoritesApi, restaurantApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function estimatePrepTime(title) {
  const base = Array.from(String(title ?? "")).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 16 + (base % 22);
}

function extractIngredients(caption) {
  return String(caption ?? "")
    .split(/[,.·;-]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function formatDate(value) {
  return new Date(value).toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function FavoriteDetailPage() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();
  const { dishId } = useParams();
  const setScrolled = useUiStore((state) => state.setScrolled);

  const [favorite, setFavorite] = useState(null);
  const [matchedRestaurant, setMatchedRestaurant] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    setScrolled(true);
  }, [setScrolled]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, navigate, user]);

  useEffect(() => {
    if (!dishId || !user) return;
    favoritesApi
      .getOne(dishId)
      .then((data) => {
        setFavorite(data);
        setMessage("");
      })
      .catch(() => setMessage("Fiche introuvable ou expirée."));
  }, [dishId, user]);

  useEffect(() => {
    if (!favorite) return;

    const directId = favorite.restaurantId ?? favorite.restaurantI;
    if (directId) {
      restaurantApi
        .findOne(directId)
        .then((restaurant) => setMatchedRestaurant(restaurant))
        .catch(() => setMatchedRestaurant(null));
      return;
    }

    if (!favorite.restaurantName) return;

    restaurantApi
      .findAll({ search: favorite.restaurantName })
      .then((restaurants) => {
        if (!Array.isArray(restaurants) || restaurants.length === 0) {
          setMatchedRestaurant(null);
          return;
        }

        const byName = restaurants.find(
          (item) => normalize(item.nom) === normalize(favorite.restaurantName),
        );

        if (byName) {
          setMatchedRestaurant(byName);
          return;
        }

        const byAddress = restaurants.find((item) =>
          normalize(item.adresse).includes(normalize(favorite.restaurantAddress)),
        );

        setMatchedRestaurant(byAddress ?? restaurants[0]);
      })
      .catch(() => setMatchedRestaurant(null));
  }, [favorite]);

  const ingredients = useMemo(() => extractIngredients(favorite?.dishCaption), [favorite]);
  const prepTime = useMemo(() => estimatePrepTime(favorite?.dishTitle), [favorite]);
  const restaurantRouteId = favorite?.restaurantId ?? favorite?.restaurantI ?? matchedRestaurant?.id ?? null;

  const handleExtend = async () => {
    if (!favorite) return;
    setBusy("extend");
    setMessage("");
    try {
      await favoritesApi.extend(favorite.dishId);
      const refreshed = await favoritesApi.getOne(favorite.dishId);
      setFavorite(refreshed);
      setMessage("Favori prolongé de 24h.");
    } catch {
      setMessage("Impossible de prolonger ce favori.");
    } finally {
      setBusy("");
    }
  };

  if (loading || !user) return null;

  return (
    <>
      <HeaderSection />
      <main className="min-h-screen bg-[radial-gradient(circle_at_0%_0%,#f9eef1_0%,#f5f5f7_40%,#f2f3f5_100%)] pt-[4.4rem]">
        <section className="mx-auto w-full max-w-[1120px] px-4 py-7 md:px-7 md:py-10">
          <Link className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline" to="/favorites">
            <ArrowLeft className="size-4" />
            Retour aux favoris
          </Link>

          {message && !favorite ? (
            <div className="rounded-2xl border border-[#ead8dd] bg-white p-5 text-sm text-[#5e6166]">{message}</div>
          ) : null}

          {!message && !favorite ? <p className="text-sm text-[#5e6166]">Chargement de la fiche...</p> : null}

          {favorite ? (
            <article className="overflow-hidden rounded-[1.9rem] border border-[#eadce0] bg-white shadow-[0_24px_50px_rgba(17,17,17,0.08)]">
              <div className="relative">
                <img alt={favorite.dishTitle} className="h-[300px] w-full object-cover md:h-[360px]" src={favorite.dishImage} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                <p className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.09em] text-primary">
                  {favorite.dishCuisine}
                </p>
              </div>

              <div className="grid gap-6 p-5 md:p-8 lg:grid-cols-[1.25fr_0.95fr]">
                <div>
                  <h1 className="font-title text-4xl leading-tight text-[#151619] md:text-5xl">{favorite.dishTitle}</h1>
                  <p className="mt-3 text-base text-[#4f5258]">{favorite.dishCaption}</p>

                  <div className="mt-5 grid gap-2 sm:grid-cols-3">
                    <div className="rounded-2xl border border-[#ece3e6] bg-[#faf7f8] p-3">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#8a6a71]">Préparation</p>
                      <p className="mt-1 text-sm font-semibold text-[#1c1d20]">~ {prepTime} min</p>
                    </div>
                    <div className="rounded-2xl border border-[#ece8f3] bg-[#f8f6ff] p-3">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#7362a6]">Style</p>
                      <p className="mt-1 text-sm font-semibold text-[#1c1d20]">Gastronomique</p>
                    </div>
                    <div className="rounded-2xl border border-[#e7edea] bg-[#f5faf8] p-3">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#4f8b72]">Service</p>
                      <p className="mt-1 text-sm font-semibold text-[#1c1d20]">À la carte</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#ece3e6] bg-[#fffafa] p-4">
                    <p className="mb-2 inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#8a6a71]">
                      <ChefHat className="size-3.5" />
                      Profil du plat
                    </p>
                    {ingredients.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {ingredients.map((ingredient) => (
                          <span className="rounded-full border border-[#ead9de] bg-white px-2.5 py-1 text-xs text-[#4f5258]" key={ingredient}>
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#5e6166]">Informations complémentaires bientôt disponibles.</p>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button className="rounded-xl" disabled={busy === "extend"} onClick={handleExtend} type="button">
                      <RefreshCcw className="size-4" />
                      Prolonger de 24h
                    </Button>
                    <Link className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#ded2d7] bg-white px-4 text-sm font-semibold text-[#1d1e22] transition hover:bg-[#faf7f8]" to="/favorites">
                      Retour à la liste
                    </Link>
                  </div>

                  {message ? <p className="mt-3 text-sm text-[#5e6166]">{message}</p> : null}
                </div>

                <aside className="space-y-4">
                  <div className="rounded-2xl border border-[#ece3e6] bg-[#faf7f8] p-4">
                    <p className="mb-2 inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#8a6a71]">
                      <Utensils className="size-3.5" />
                      Restaurant
                    </p>
                    <h2 className="font-title text-2xl text-[#1a1b1e]">{favorite.restaurantName}</h2>
                    <p className="mt-1 inline-flex items-start gap-1.5 text-sm text-[#4f5258]">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" />
                      {favorite.restaurantAddress}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#4f5258]">
                      <Clock3 className="size-3.5" />
                      {favorite.restaurantHours || "Horaires non renseignés"}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#4f5258]">
                      <Phone className="size-3.5" />
                      {favorite.restaurantPhone || "Téléphone non renseigné"}
                    </p>

                    {restaurantRouteId ? (
                      <Link
                        className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#17181a] px-3.5 text-sm font-semibold text-white transition hover:bg-black"
                        to={`/restaurants/${restaurantRouteId}`}
                      >
                        Voir la fiche restaurant
                        <ExternalLink className="size-3.5" />
                      </Link>
                    ) : (
                      <p className="mt-4 text-sm text-[#5e6166]">Lien restaurant indisponible pour ce favori.</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-[#ece3e6] bg-white p-4">
                    <p className="mb-1 inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#8a6a71]">
                      <CalendarClock className="size-3.5" />
                      Validité du favori
                    </p>
                    <p className="text-sm text-[#4f5258]">Valable jusqu'au <span className="font-semibold text-[#1a1b1e]">{formatDate(favorite.expiresAt)}</span></p>
                  </div>

                  <div className="rounded-2xl border border-[#ece3e6] bg-white p-4">
                    <p className="mb-1 inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#8a6a71]">
                      <Sparkles className="size-3.5" />
                      Conseil
                    </p>
                    <p className="text-sm text-[#4f5258]">Consulte la fiche restaurant pour vérifier les horaires et réserver au bon moment.</p>
                  </div>
                </aside>
              </div>
            </article>
          ) : null}
        </section>
      </main>
      <FooterSection />
    </>
  );
}

export default FavoriteDetailPage;
