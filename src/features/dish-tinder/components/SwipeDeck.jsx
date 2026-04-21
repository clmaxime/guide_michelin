import { Heart, Info, X } from "lucide-react";
import { useState } from "react";
import { useDishTinderStore } from "../store/dish-tinder-store";

function SwipeDeck() {
  const dishes = useDishTinderStore((state) => state.dishes);
  const currentIndex = useDishTinderStore((state) => state.currentIndex);
  const swipeDish = useDishTinderStore((state) => state.swipeDish);
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });
  const [swipeStamp, setSwipeStamp] = useState(null);

  const currentDish = dishes[currentIndex];
  const nextDish = dishes[currentIndex + 1];

  const resetDrag = () => setDrag({ x: 0, y: 0, dragging: false });

  const triggerSwipe = (direction) => {
    setSwipeStamp(direction === "right" ? "like" : "pass");
    setDrag((previous) => ({
      ...previous,
      x: direction === "right" ? 460 : -460,
      y: -24,
      dragging: false,
    }));
    window.setTimeout(() => {
      swipeDish(direction);
      setSwipeStamp(null);
      resetDrag();
    }, 180);
  };

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ x: 0, y: 0, dragging: true, startX: event.clientX, startY: event.clientY });
  };

  const handlePointerMove = (event) => {
    if (!drag.dragging) return;
    const x = event.clientX - drag.startX;
    const y = (event.clientY - drag.startY) * 0.3;
    setDrag((previous) => ({ ...previous, x, y }));
  };

  const handlePointerUp = () => {
    if (!drag.dragging) return;
    if (Math.abs(drag.x) > 85) {
      triggerSwipe(drag.x > 0 ? "right" : "left");
      return;
    }
    resetDrag();
  };

  if (!currentDish) {
    return (
      <div className="grid min-h-[28rem] place-items-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
        <div>
          <p className="text-xl font-semibold">Plus de plats pour le moment</p>
          <p className="mt-2 text-sm text-white/70">Reviens plus tard ou modifie tes preferences.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative min-h-[28rem]">
        {nextDish ? (
          <article className="absolute inset-x-5 top-3 overflow-hidden rounded-3xl border border-white/10 bg-[#141926] opacity-65 shadow-xl">
            <img alt={nextDish.title} className="h-[22.5rem] w-full object-cover" src={nextDish.image} />
          </article>
        ) : null}
        <article
          className="absolute inset-x-0 top-0 overflow-hidden rounded-3xl border border-white/10 bg-[#141926] shadow-2xl"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            opacity: Math.abs(drag.x) > 200 ? 0 : 1,
            transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 18}deg)`,
            transition: drag.dragging ? "none" : "transform 180ms ease, opacity 180ms ease",
            touchAction: "none",
          }}
        >
          <img alt={currentDish.title} className="h-[22.5rem] w-full object-cover" src={currentDish.image} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          {swipeStamp === "like" ? (
            <p className="absolute left-4 top-5 rounded-lg border border-emerald-300 bg-emerald-600/70 px-3 py-1 text-lg font-bold tracking-wider text-white">
              J'ADORE
            </p>
          ) : null}
          {swipeStamp === "pass" ? (
            <p className="absolute right-4 top-5 rounded-lg border border-rose-300 bg-rose-600/70 px-3 py-1 text-lg font-bold tracking-wider text-white">
              PASSER
            </p>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 space-y-2 p-4">
            <h2 className="font-title text-3xl">{currentDish.title}</h2>
            <p className="text-sm text-white/85">{currentDish.restaurant}</p>
            <p className="text-xs text-white/70">
              {currentDish.price} • {currentDish.distance} • {currentDish.cuisine}
            </p>
          </div>
        </article>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          className="grid h-14 place-content-center rounded-full border border-white/20 bg-transparent text-white/80 transition duration-300 hover:bg-white/5"
          onClick={() => triggerSwipe("left")}
          type="button"
        >
          <X className="size-6" />
        </button>
        <button
          className="grid h-14 place-content-center rounded-full border border-white/20 bg-transparent text-white/80 transition duration-300 hover:bg-white/5"
          type="button"
        >
          <Info className="size-5" />
        </button>
        <button
          className="grid h-14 place-content-center rounded-full bg-[#ff4458] text-white shadow-lg shadow-[#ff4458]/35 transition duration-300 hover:brightness-95"
          onClick={() => triggerSwipe("right")}
          type="button"
        >
          <Heart className="size-6" />
        </button>
      </div>
    </div>
  );
}

export default SwipeDeck;
