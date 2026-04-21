import { RotateCcw, SlidersHorizontal } from "lucide-react";
import PhoneShell from "@/features/dish-tinder/components/PhoneShell";
import SwipeDeck from "@/features/dish-tinder/components/SwipeDeck";
import { useDishTinderStore } from "@/features/dish-tinder/store/dish-tinder-store";
import dishDetail from "../../assets/images/site/tinder/dish_detail.webp";

function DiscoverPage() {
  const dishes = useDishTinderStore((state) => state.dishes);
  const currentIndex = useDishTinderStore((state) => state.currentIndex);
  const resetDeck = useDishTinderStore((state) => state.resetDeck);

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,_#1a2238_0%,_#0a0d15_45%,_#080a10_100%)] px-2 sm:px-4">
      <PhoneShell title="Decouvrir">
        <section className="space-y-4 p-4">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-white/65">Autour de moi</p>
              <p className="text-sm text-white/85">Paris, France</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 rounded-lg border border-white/20 px-2 py-1.5 text-xs text-white/80 transition duration-300 hover:bg-white/5"
                onClick={resetDeck}
                type="button"
              >
                <RotateCcw className="size-3.5" />
                Reset test
              </button>
              <button className="rounded-lg border border-white/20 p-2 text-white/80" type="button">
                <SlidersHorizontal className="size-4" />
              </button>
            </div>
          </header>

          <SwipeDeck />

          {currentIndex >= dishes.length ? (
            <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#121622]">
              <img alt="Apercu detail plat" className="h-64 w-full object-cover" src={dishDetail} />
            </article>
          ) : null}
        </section>
      </PhoneShell>
    </main>
  );
}

export default DiscoverPage;
