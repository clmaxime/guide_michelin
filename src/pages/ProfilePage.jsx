import { RotateCcw } from "lucide-react";
import PhoneShell from "@/features/dish-tinder/components/PhoneShell";
import { useDishTinderStore } from "@/features/dish-tinder/store/dish-tinder-store";
import algoScreen from "../../assets/images/site/tinder/algo_screen.webp";
import emptyScreen from "../../assets/images/site/tinder/empty_screen.webp";

function ProfilePage() {
  const likedIds = useDishTinderStore((state) => state.likedIds);
  const passedIds = useDishTinderStore((state) => state.passedIds);
  const resetDeck = useDishTinderStore((state) => state.resetDeck);

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,_#1a2238_0%,_#0a0d15_45%,_#080a10_100%)] px-2 sm:px-4">
      <PhoneShell title="Profil">
        <section className="space-y-4 p-4">
          <article className="rounded-2xl border border-white/10 bg-[#121622] p-4">
            <p className="text-sm text-white/70">Ton algorithme apprend de tes choix</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">
                <p className="text-xs uppercase text-white/60">Likes</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-300">{likedIds.length}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">
                <p className="text-xs uppercase text-white/60">Passes</p>
                <p className="mt-1 text-2xl font-semibold text-rose-300">{passedIds.length}</p>
              </div>
            </div>
          </article>

          <article className="grid grid-cols-2 gap-3">
            <img alt="Apercu algorithme" className="h-56 w-full rounded-2xl border border-white/10 object-cover" src={algoScreen} />
            <img alt="Apercu suggestions" className="h-56 w-full rounded-2xl border border-white/10 object-cover" src={emptyScreen} />
          </article>

          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff4458] px-4 py-3 font-semibold text-white transition duration-300 hover:brightness-95"
            onClick={resetDeck}
            type="button"
          >
            <RotateCcw className="size-4" />
            Reinitialiser mes preferences
          </button>
        </section>
      </PhoneShell>
    </main>
  );
}

export default ProfilePage;
