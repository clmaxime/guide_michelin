import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

function TinderTeaserSection() {
  return (
    <section className="bg-[#0a0a0d] py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(122deg,#1a060b_0%,#101016_46%,#151518_100%)] px-6 py-9 md:px-10 md:py-11">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.07]" />
          <div className="absolute -left-10 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#e60023]/25 blur-3xl" />
          <div className="absolute -right-14 -top-14 h-52 w-52 rounded-full bg-[#cf3f56]/20 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.45fr_0.95fr] lg:items-end">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.09em] text-[#ffbcc8]">
                <Sparkles className="size-3.5" />
                Match Culinaire
              </p>
              <h2 className="font-title text-[2rem] leading-[1.03] text-white md:text-[3rem]">
                Le swipe food pour décider vite, manger mieux.
              </h2>
              <p className="mt-4 max-w-[44rem] text-[1.03rem] leading-relaxed text-white/82">
                Découvre des idées de plats en quelques secondes, like ce qui te donne faim et garde tes coups de cœur.
                Une expérience rapide, visuelle et pensée pour les choix de dernière minute.
              </p>
              <Link
                className={buttonVariants({
                  className:
                    "mt-7 inline-flex h-14 items-center gap-2 rounded-xl px-8 text-base font-bold shadow-[0_14px_34px_rgba(230,0,35,0.34)]",
                })}
                to="/discover"
              >
                Aller au mode Inspiration
                <ArrowUpRight className="size-4" />
              </Link>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-4 backdrop-blur-sm">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#ffbcc8]">Mode Rapide</p>
                <p className="mt-1 text-sm text-white/90">Swipe intuitif, décision en moins d'une minute.</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-4 backdrop-blur-sm">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#ffbcc8]">Mood Based</p>
                <p className="mt-1 text-sm text-white/90">Choisis selon l'envie du moment, sans friction.</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-4 backdrop-blur-sm">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#ffbcc8]">Smart Picks</p>
                <p className="mt-1 text-sm text-white/90">Retrouve tes matchs et compose ton prochain repas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TinderTeaserSection;
