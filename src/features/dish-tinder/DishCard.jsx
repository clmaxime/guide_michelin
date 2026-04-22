import { Badge } from "@/components/ui/badge";

function DishCard({ dish }) {
  if (!dish) {
    return (
      <div className="flex min-h-[28rem] items-center justify-center rounded-3xl border border-white/15 bg-white/5 p-8 text-center text-white/75">
        Aucun résultat avec ces filtres. Élargis la recherche pour continuer le swipe.
      </div>
    );
  }

  return (
    <article className="relative min-h-[28rem] overflow-hidden rounded-3xl border border-white/15 bg-[#121214] shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
      <img alt={dish.title} className="absolute inset-0 h-full w-full object-cover opacity-[0.55]" src={dish.image} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,12,0.2)_0%,rgba(10,10,12,0.86)_72%,rgba(10,10,12,0.98)_100%)]" />
      <div className="relative z-10 flex h-full min-h-[28rem] flex-col justify-end gap-3 p-6">
        <div className="flex flex-wrap gap-2">
          <Badge className="rounded-full bg-[#e60023] px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.08em]">{dish.cuisine}</Badge>
          <Badge className="rounded-full bg-white/20 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.08em]">{dish.mood}</Badge>
          <Badge className="rounded-full bg-white/20 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.08em]">{dish.budget}</Badge>
        </div>
        <h2 className="font-title text-[2rem] leading-tight text-white">{dish.title}</h2>
        <p className="max-w-[34rem] text-sm text-white/85">{dish.caption}</p>
        <div className="flex flex-wrap gap-2 text-xs text-white/75">
          {dish.tags.map((tag) => (
            <span className="rounded-full border border-white/18 bg-black/30 px-2.5 py-1" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#ffc4ce]">Préparation estimée: {dish.prepTime} min</p>
      </div>
    </article>
  );
}

export default DishCard;
