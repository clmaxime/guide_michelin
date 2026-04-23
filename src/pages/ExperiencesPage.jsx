import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import HeaderSection from "@/sections/HeaderSection";
import FooterSection from "@/sections/FooterSection";
import ExperienceCard from "@/components/experiences/ExperienceCard";
import { experiencesApi, favoritesApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";

const CATEGORIES = [
  "Toutes",
  "Cours de cuisine",
  "Vignoble",
  "Dégustation",
  "Découverte locale",
  "Mixologie",
  "Expérience privée",
  "Gastronomie",
];

function SkeletonCard() {
  return <div className="h-[390px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.05]" />;
}

export default function ExperiencesPage() {
  const setScrolled = useUiStore((state) => state.setScrolled);
  const user = useAuthStore((state) => state.user);

  const [items, setItems] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("Toutes");

  useEffect(() => {
    setScrolled(true);
  }, [setScrolled]);

  useEffect(() => {
    setLoading(true);
    experiencesApi
      .list({
        search: search || undefined,
        city: city || undefined,
        category: category === "Toutes" ? undefined : category,
        limit: 36,
      })
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [search, city, category]);

  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    favoritesApi
      .listExperiences()
      .then((data) => setFavoriteIds(new Set(data.map((item) => item.experienceId))))
      .catch(() => setFavoriteIds(new Set()));
  }, [user]);

  async function handleToggleFavorite(experienceId) {
    if (!user) {
      setMessage("Connecte-toi pour enregistrer une expérience en favoris.");
      return;
    }

    const isFavorite = favoriteIds.has(experienceId);
    try {
      if (isFavorite) {
        await favoritesApi.deleteExperience(experienceId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(experienceId);
          return next;
        });
      } else {
        await favoritesApi.upsertExperience({ experienceId });
        setFavoriteIds((prev) => new Set(prev).add(experienceId));
      }
      setMessage("");
    } catch {
      setMessage("Impossible de mettre à jour les favoris expériences.");
    }
  }

  const cityOptions = useMemo(
    () => ["Toutes", ...new Set(items.map((item) => item.city).filter(Boolean))],
    [items],
  );

  return (
    <>
      <HeaderSection />
      <main className="min-h-screen bg-[#0f0f0f] pt-[4.4rem]">
        <section className="mx-auto w-full max-w-[1220px] px-4 py-10 md:px-7">
          <header className="mb-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">Collection</p>
            <h1 className="font-title text-4xl text-white md:text-5xl">Expériences gastronomiques</h1>
            <p className="mt-2 max-w-[48rem] text-white/60">
              Réservez des activités inspirées des plus belles destinations culinaires: ateliers,
              dégustations, vignobles et expériences privées.
            </p>
          </header>

          <div className="mb-6 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-3 md:grid-cols-[1fr_220px_220px]">
            <input
              className="h-11 rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-white/35"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une activité, un lieu..."
              value={search}
            />
            <select
              className="h-11 rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white outline-none"
              onChange={(event) => setCity(event.target.value === "Toutes" ? "" : event.target.value)}
              value={city || "Toutes"}
            >
              {cityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              className="h-11 rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white outline-none"
              onChange={(event) => setCategory(event.target.value)}
              value={category}
            >
              {CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {message ? <p className="mb-4 text-sm text-white/70">{message}</p> : null}

          <div className="mb-6 flex items-center justify-between text-sm text-white/50">
            <span>{loading ? "Chargement..." : `${items.length} expérience${items.length > 1 ? "s" : ""}`}</span>
            <Link className="inline-flex items-center gap-1.5 text-white/70 transition hover:text-white" to="/favorites">
              <Sparkles className="size-4" />
              Voir mes favoris
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
              : items.map((item) => (
                  <ExperienceCard
                    experience={item}
                    isFavorite={favoriteIds.has(item.id)}
                    key={item.id}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
