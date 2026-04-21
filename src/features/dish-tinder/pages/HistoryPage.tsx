import PhoneShell from "../components/PhoneShell";
import { useDishTinderStore } from "../store/dish-tinder-store";

function HistoryPage() {
  const stats = useDishTinderStore((state) => state.stats);

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,_#1e2740_0%,_#0b0f18_46%,_#070a12_100%)] px-2 sm:px-4">
      <PhoneShell title="Historique">
        <section className="space-y-4 p-4">
          <article className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <p className="text-xs uppercase text-white/60">J'aime</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-300">{stats.likes}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <p className="text-xs uppercase text-white/60">Passes</p>
              <p className="mt-1 text-2xl font-semibold text-rose-300">{stats.dislikes}</p>
            </div>
          </article>

          <div className="rounded-xl border border-white/10 bg-[#141a28] p-3">
            <p className="mb-2 text-sm text-white/80">Actions récentes</p>
            <ul className="space-y-1.5 text-xs text-white/70">
              {stats.history.length === 0 ? <li>Aucune action pour le moment.</li> : null}
              {stats.history.map((entry) => (
                <li className="rounded-md border border-white/10 px-2 py-1" key={entry}>
                  {entry
                    .replace("aime:", "aimé : ")
                    .replace("passe:", "passé : ")
                    .replace("aimé:", "aimé : ")
                    .replace("passé:", "passé : ")}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </PhoneShell>
    </main>
  );
}

export default HistoryPage;
