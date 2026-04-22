import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import michelinStarUrl from "@/assets/michelin-star.svg";

const SOCIALS = ["Instagram", "Facebook", "X", "YouTube"];

const NAV_LINKS = [
  { label: "Restaurants", href: "/restaurants" },
  { label: "Hôtels", href: "/hotels" },
  { label: "Itinéraire", href: "/itinerary" },
  { label: "Découvrir", href: "/discover" },
];

function FooterSection() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#0a0a0a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(230,0,35,0.07),transparent_60%)]" />

      <div className="relative mx-auto w-full max-w-[1220px] px-4 md:px-7">
        {/* Top section */}
        <div className="grid gap-12 py-14 md:grid-cols-[1fr_1fr_1fr] lg:grid-cols-[1.8fr_1fr_1.4fr]">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <img src={michelinStarUrl} alt="★" width={20} height={20} className="opacity-90" />
              <span className="font-title text-xl font-semibold text-white">Guide Michelin</span>
            </div>
            <p className="mb-6 max-w-[22rem] text-sm leading-relaxed text-white/40">
              Depuis 1900, le Guide Michelin sélectionne les meilleures tables et destinations du monde entier.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <MapPin className="size-3.5 shrink-0" />
              <span>Paris, France</span>
            </div>
          </div>

          {/* Nav */}
          <div>
            <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white/30">Explorer</p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white"
                  >
                    <ArrowRight className="size-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white/30">Newsletter</p>
            <p className="mb-4 text-sm text-white/50">Recevez nos sélections et inspirations exclusives.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Votre adresse email"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-white/25 focus:bg-white/8"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#e60023] py-2.5 text-sm font-bold text-white transition hover:bg-[#c9001f]"
              >
                S'inscrire
                <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 py-6">
          <p className="text-xs text-white/20">© {new Date().getFullYear()} Guide Michelin · Tous droits réservés</p>

          <div className="flex items-center gap-2">
            {SOCIALS.map((name) => (
              <a
                key={name}
                href="#top"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/40 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
