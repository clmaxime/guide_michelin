import { Heart } from "lucide-react";
import PhoneShell from "@/features/dish-tinder/components/PhoneShell";
import { useDishTinderStore } from "@/features/dish-tinder/store/dish-tinder-store";

function FavoritesPage() {
  const dishes = useDishTinderStore((state) => state.dishes);
  const likedIds = useDishTinderStore((state) => state.likedIds);
  const likedDishes = dishes.filter((dish) => likedIds.includes(dish.id));

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,_#1a2238_0%,_#0a0d15_45%,_#080a10_100%)] px-2 sm:px-4">
      <PhoneShell title="Mes favoris">
        <section className="space-y-3 p-4">
          {likedDishes.length === 0 ? (
            <div className="grid min-h-[30rem] place-items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div>
                <Heart className="mx-auto mb-3 size-8 text-white/65" />
                <p className="text-lg font-semibold">Aucun favori pour le moment</p>
                <p className="mt-2 text-sm text-white/70">Swipe a droite dans Decouvrir pour construire ta liste.</p>
              </div>
            </div>
          ) : (
            likedDishes.map((dish) => (
              <article className="flex gap-3 rounded-2xl border border-white/10 bg-[#121622] p-2" key={dish.id}>
                <img alt={dish.title} className="h-24 w-24 rounded-xl object-cover" src={dish.image} />
                <div className="flex-1 space-y-1 pt-1">
                  <h2 className="font-title text-2xl leading-none">{dish.title}</h2>
                  <p className="text-sm text-white/85">{dish.restaurant}</p>
                  <p className="text-xs text-white/70">
                    {dish.price} • {dish.distance}
                  </p>
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
