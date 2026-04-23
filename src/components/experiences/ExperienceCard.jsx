import { Heart, MapPin, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

export function formatExperiencePrice(price) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ExperienceCard({
  experience,
  isFavorite = false,
  onToggleFavorite,
  compact = false,
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] shadow-[0_16px_36px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors duration-300 hover:border-white/20">
      <div className={`relative ${compact ? "h-40" : "h-52"}`}>
        <img alt={experience.title} className="h-full w-full object-cover" loading="lazy" src={experience.imageUrl} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

        <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.08em] text-white">
          {experience.category}
        </span>

        {onToggleFavorite ? (
          <button
            className={`absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full border transition ${
              isFavorite ? "border-primary bg-primary text-white" : "border-white/30 bg-black/45 text-white hover:bg-black/65"
            }`}
            onClick={() => onToggleFavorite(experience.id)}
            type="button"
          >
            <Heart className={`size-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <h3 className={`font-title text-white ${compact ? "text-xl" : "text-2xl"}`}>{experience.title}</h3>
        <p className="line-clamp-2 text-sm text-white/65">{experience.description}</p>

        <div className="flex items-start gap-1.5 text-sm text-white/70">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          <span className="line-clamp-1">
            {experience.locationName}, {experience.city}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2">
          <div>
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.08em] text-white/50">À partir de</p>
            <p className="text-sm font-semibold text-white">{formatExperiencePrice(experience.priceEur)} / pers.</p>
          </div>
          <p className="text-xs text-white/60">{experience.duration}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link className="inline-flex h-10 items-center rounded-xl bg-primary px-3.5 text-sm font-semibold text-white transition hover:bg-primary/85" to={`/experiences/${experience.id}`}>
            Consulter
          </Link>
          <a className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 text-sm font-semibold text-white transition hover:bg-white/20" href={experience.bookingUrl} rel="noopener noreferrer" target="_blank">
            <Ticket className="size-3.5" />
            Réserver
          </a>
        </div>
      </div>
    </article>
  );
}
