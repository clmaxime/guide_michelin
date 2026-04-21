import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import onboardingHero from "../../assets/images/site/tinder/onboarding_hero.webp";
import flowMock from "../../assets/images/site/tinder/flow_preview.webp";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function HomePage() {
  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,_#1b2439_0%,_#0a0d15_50%,_#080a10_100%)] px-4 py-7 text-white md:px-8">
      <div className="mx-auto grid w-full max-w-[1200px] gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <section className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff6f7f]">Le Guide Michelin</p>
          <h1 className="font-title text-5xl leading-[1.03] md:text-6xl">Tinder Food devient une app complete.</h1>
          <p className="max-w-[38rem] text-base text-white/80">
            Decouvrez des plats d'exception autour de vous, swipez avec fluidite et retrouvez vos coups de coeur en
            quelques secondes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className={cn(buttonVariants(), "h-11 rounded-xl px-5 text-sm")} to="/discover">
              Commencer
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <a className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-xl border-white/30 bg-white/5 px-5 text-sm")} href="#preview">
              Voir le flow complet
            </a>
          </div>
          <div className="grid max-w-[32rem] grid-cols-3 gap-3 text-center text-xs text-white/70">
            <div className="rounded-xl border border-white/15 bg-white/5 px-2 py-3">Swipe gesture naturel</div>
            <div className="rounded-xl border border-white/15 bg-white/5 px-2 py-3">Favoris centralises</div>
            <div className="rounded-xl border border-white/15 bg-white/5 px-2 py-3">Algorithme personnalisable</div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[480px] rounded-[2rem] border border-white/15 bg-[#0e1320]/85 p-5 shadow-2xl shadow-black/45">
          <div className="rounded-[1.6rem] border border-white/10 bg-black p-3">
            <img alt="Apercu onboarding Tinder Food" className="h-[34rem] w-full rounded-[1.2rem] object-cover" src={onboardingHero} />
          </div>
        </section>
      </div>

      <section className="mx-auto mt-12 w-full max-w-[1200px]" id="preview">
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-[#0d111b] p-4 md:p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/65">Reference maquettes Tinder</p>
          <img alt="Flow complet Tinder Food" className="w-full rounded-2xl object-cover" src={flowMock} />
        </div>
      </section>
    </main>
  );
}

export default HomePage;
