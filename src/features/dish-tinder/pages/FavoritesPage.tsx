import { Heart } from "lucide-react";
import PhoneShell from "../components/PhoneShell";
import { useDishesQuery } from "../hooks/useDishesQuery";
import { useDishTinderStore } from "../store/dish-tinder-store";

function FavoritesPage() {
  const { data = [] } = useDishesQuery();
  const likedDishIds = useDishTinderStore((state) => state.likedDishIds);
  const favorites = data.filter((dish) => likedDishIds.includes(dish.id));

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,_#1e2740_0%,_#0b0f18_46%,_#070a12_100%)] px-2 sm:px-4">
      <PhoneShell title="Favoris">
        <section className="space-y-3 p-4">
          {favorites.length === 0 ? (
            <div className="grid min-h-[30rem] place-items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div>
                <Heart className="mx-auto mb-3 size-8 text-white/70" />
                <p className="text-lg font-semibold">Aucun favori</p>
                <p className="mt-2 text-sm text-white/70">Balaye à droite dans Découvrir pour alimenter cette liste.</p>
              </div>
            </div>
          ) : (
            favorites.map((dish) => (
              <article className="flex gap-3 rounded-2xl border border-white/10 bg-[#141a28] p-2" key={dish.id}>
                <img alt={dish.name} className="h-24 w-24 rounded-xl object-cover" src={dish.image} />
                <div className="space-y-1 pt-1">
                  <h2 className="font-title text-2xl leading-none">{dish.name}</h2>
                  <p className="text-sm text-white/85">{dish.restaurant}</p>
                  <p className="text-xs text-white/70">{dish.priceRange}</p>
                </div>
              </article>
            ))
          )}
        </section>
      </PhoneShell>
    </main>
  );
}

export default FavoritesPage;
