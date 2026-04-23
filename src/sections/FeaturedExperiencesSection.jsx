import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import ExperienceCard from "@/components/experiences/ExperienceCard";
import { experiencesApi } from "@/lib/api";

function ExperienceSkeleton() {
  return <div className="h-[390px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.05]" />;
}

export default function FeaturedExperiencesSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    experiencesApi
      .highlights(8)
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="bg-[#0f0f0f] py-16 md:py-20" id="experiences">
      <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Expériences</p>
            <h2 className="font-title text-3xl text-white md:text-4xl">À vivre sur votre trajet</h2>
            <p className="mt-2 max-w-[42rem] text-sm text-white/55">
              Cours de cuisine, vignobles, dégustations et activités premium inspirées de l'esprit Michelin.
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
            to="/experiences"
          >
            <Sparkles className="size-4" />
            Voir toutes les expériences
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <ExperienceSkeleton key={index} />)
            : items.slice(0, 8).map((item) => <ExperienceCard compact experience={item} key={item.id} />)}
        </div>
      </div>
    </section>
  );
}
