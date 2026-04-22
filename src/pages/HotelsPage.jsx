import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, MapPin, Search } from "lucide-react";
import { michelinHotels } from "@/data/michelin-hotels";
import HeaderSection from "@/sections/HeaderSection";

function formatLocation(slug) {
  if (!slug) return "Destination Michelin";
  let decoded = slug;
  try { decoded = decodeURIComponent(slug); } catch { /* ignore */ }
  return decoded
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function HotelCard({ hotel }) {
  return (
    <a
      href={hotel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex aspect-[3/4] overflow-hidden rounded-2xl"
    >
      {hotel.image ? (
        <img
          src={hotel.image}
          alt={hotel.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md bg-white/10 border-t border-white/15 p-4 transition-all duration-300 group-hover:bg-white/15">
        <h3 className="font-title text-white text-lg font-semibold leading-tight mb-1 line-clamp-1">
          {hotel.name}
        </h3>
        {hotel.locationSlug && (
          <div className="flex items-center gap-1 mb-3">
            <MapPin className="size-3 text-white/50 shrink-0" />
            <p className="text-white/50 text-xs">{formatLocation(hotel.locationSlug)}</p>
          </div>
        )}
        <div className="flex items-center gap-1 text-xs font-semibold text-[#e60023] group-hover:text-red-400 transition-colors">
          Voir la fiche Michelin <ExternalLink className="size-3" />
        </div>
      </div>
    </a>
  );
}

function HotelsPage() {
  const [search, setSearch] = useState("");

  const filtered = michelinHotels.filter((h) => {
    const q = search.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      formatLocation(h.locationSlug).toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <HeaderSection />

      <main className="mx-auto w-full max-w-[1220px] px-4 py-10 md:px-7 md:py-14">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/40">Guide Michelin</p>
            <h1 className="font-title text-[2rem] leading-[1.1] text-white md:text-[2.5rem]">
              Hôtels de prestige
            </h1>
            <p className="mt-2 text-sm text-white/40">
              {michelinHotels.length} établissements sélectionnés par le Guide Michelin
            </p>
          </div>
          <Link
            to="/"
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Retour à l'accueil
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
          <Search className="size-4 shrink-0 text-white/40" />
          <input
            type="text"
            placeholder="Rechercher un hôtel ou une destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
          {search && (
            <span className="text-xs text-white/30">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((hotel) => (
              <HotelCard key={hotel.url} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <p className="font-medium text-white/30">Aucun hôtel trouvé pour « {search} »</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default HotelsPage;
