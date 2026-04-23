import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock3, MapPin, Ticket } from "lucide-react";
import HeaderSection from "@/sections/HeaderSection";
import FooterSection from "@/sections/FooterSection";
import { experiencesApi, favoritesApi } from "@/lib/api";
import { formatExperiencePrice } from "@/components/experiences/ExperienceCard";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";

export default function ExperienceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const setScrolled = useUiStore((state) => state.setScrolled);
  const user = useAuthStore((state) => state.user);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setScrolled(true);
  }, [setScrolled]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    experiencesApi
      .findOne(id)
      .then((data) => setItem(data))
      .catch(() => navigate("/experiences", { replace: true }))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (!user || !id) {
      setIsFavorite(false);
      return;
    }
    favoritesApi
      .listExperiences()
      .then((data) => setIsFavorite(data.some((entry) => entry.experienceId === id)))
      .catch(() => setIsFavorite(false));
  }, [user, id]);

  async function toggleFavorite() {
    if (!user || !id) {
      setMessage("Connecte-toi pour enregistrer cette expérience en favoris.");
      return;
    }

    try {
      if (isFavorite) {
        await favoritesApi.deleteExperience(id);
        setIsFavorite(false);
      } else {
        await favoritesApi.upsertExperience({ experienceId: id });
        setIsFavorite(true);
      }
      setMessage("");
    } catch {
      setMessage("Impossible de mettre à jour les favoris.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!item) return null;

  return (
    <>
      <HeaderSection />
      <main className="min-h-screen bg-[#0f0f0f] pt-[4.4rem]">
        <section className="mx-auto w-full max-w-[1220px] px-4 py-8 md:px-7 md:py-10">
          <Link className="mb-5 inline-flex items-center gap-2 text-sm text-white/65 hover:text-white" to="/experiences">
            <ArrowLeft className="size-4" /> Retour aux expériences
          </Link>

          <article className="overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.05] shadow-[0_24px_50px_rgba(0,0,0,0.4)]">
            <div className="relative h-[340px] md:h-[430px]">
              <img alt={item.title} className="h-full w-full object-cover" src={item.imageUrl} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white">
                {item.category}
              </span>
            </div>

            <div className="grid gap-6 p-5 md:p-8 lg:grid-cols-[1.2fr_0.9fr]">
              <div>
                <h1 className="font-title text-4xl text-white md:text-5xl">{item.title}</h1>
                <p className="mt-3 text-white/75">{item.description}</p>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/12 bg-black/25 p-3">
                    <p className="text-[0.64rem] font-semibold uppercase tracking-[0.08em] text-white/50">Durée</p>
                    <p className="mt-1 text-sm font-semibold text-white">{item.duration}</p>
                  </div>
                  <div className="rounded-xl border border-white/12 bg-black/25 p-3">
                    <p className="text-[0.64rem] font-semibold uppercase tracking-[0.08em] text-white/50">Ville</p>
                    <p className="mt-1 text-sm font-semibold text-white">{item.city}</p>
                  </div>
                  <div className="rounded-xl border border-white/12 bg-black/25 p-3">
                    <p className="text-[0.64rem] font-semibold uppercase tracking-[0.08em] text-white/50">Tarif</p>
                    <p className="mt-1 text-sm font-semibold text-white">{formatExperiencePrice(item.priceEur)}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/85"
                    href={item.bookingUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Ticket className="size-4" />
                    Réserver cette expérience
                  </a>
                  <button
                    className="inline-flex h-11 items-center rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20"
                    onClick={toggleFavorite}
                    type="button"
                  >
                    {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                  </button>
                </div>
                {message ? <p className="mt-3 text-sm text-white/65">{message}</p> : null}
              </div>

              <aside className="space-y-4">
                <div className="rounded-2xl border border-white/12 bg-black/20 p-4">
                  <p className="mb-2 text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-white/50">Lieu</p>
                  <p className="inline-flex items-start gap-2 text-sm text-white/80">
                    <MapPin className="mt-0.5 size-4 shrink-0" />
                    <span>
                      {item.locationName}
                      <br />
                      {item.address}
                      <br />
                      {item.city}, {item.country}
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl border border-white/12 bg-black/20 p-4">
                  <p className="mb-2 text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-white/50">Format</p>
                  <p className="inline-flex items-center gap-2 text-sm text-white/80">
                    <Clock3 className="size-4" />
                    Session de {item.duration}
                  </p>
                </div>
              </aside>
            </div>
          </article>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
