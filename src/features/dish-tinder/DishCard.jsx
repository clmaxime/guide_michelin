import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

const SWIPE_THRESHOLD = 90;
const SWIPE_ESCAPE = 520;

function DishCard({ dish, onSwipeLeft, onSwipeRight, swipeTrigger }) {
  const pointerIdRef = useRef(null);
  const startXRef = useRef(0);
  const draggingRef = useRef(false);
  const dragXRef = useRef(0);
  const processedTriggerRef = useRef(0);
  const [dragX, setDragX] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [feedbackDirection, setFeedbackDirection] = useState(null);

  useEffect(() => {
    dragXRef.current = 0;
    setDragX(0);
    setIsAnimatingOut(false);
    setFeedbackDirection(null);
    pointerIdRef.current = null;
    startXRef.current = 0;
    draggingRef.current = false;
  }, [dish?.id]);

  useEffect(() => {
    if (!swipeTrigger?.nonce || processedTriggerRef.current === swipeTrigger.nonce || !dish) {
      return;
    }

    processedTriggerRef.current = swipeTrigger.nonce;
    triggerSwipe(swipeTrigger.direction);
  }, [dish, swipeTrigger]);

  if (!dish) {
    return (
      <div className="flex min-h-[28rem] items-center justify-center rounded-3xl border border-white/15 bg-white/5 p-8 text-center text-white/75">
        Aucun résultat avec ces filtres. Élargis la recherche pour continuer le swipe.
      </div>
    );
  }

  const triggerSwipe = (direction) => {
    if (isAnimatingOut) {
      return;
    }

    draggingRef.current = false;
    pointerIdRef.current = null;
    setIsAnimatingOut(true);
    setFeedbackDirection(direction);
    dragXRef.current = direction === "right" ? SWIPE_ESCAPE : -SWIPE_ESCAPE;
    setDragX(dragXRef.current);

    window.setTimeout(() => {
      if (direction === "right") {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }, 180);
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    dragXRef.current = 0;
    draggingRef.current = true;
    setIsAnimatingOut(false);
    setFeedbackDirection(null);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current || pointerIdRef.current !== event.pointerId || isAnimatingOut) {
      return;
    }

    dragXRef.current = event.clientX - startXRef.current;
    setDragX(dragXRef.current);
  };

  const handlePointerEnd = (event) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    event.currentTarget.releasePointerCapture?.(event.pointerId);
    draggingRef.current = false;
    pointerIdRef.current = null;

    if (Math.abs(dragXRef.current) >= SWIPE_THRESHOLD) {
      triggerSwipe(dragXRef.current > 0 ? "right" : "left");
      return;
    }

    dragXRef.current = 0;
    setDragX(0);
  };

  const rotation = dragX / 18;
  const likeOpacity = Math.min(Math.max(dragX / 120, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragX / 120, 0), 1);
  const greenFlashOpacity = feedbackDirection === "right" ? 0.82 : 0;
  const redFlashOpacity = feedbackDirection === "left" ? 0.82 : 0;

  return (
    <article
      className="relative min-h-[28rem] overflow-hidden rounded-3xl border border-white/15 bg-[#121214] shadow-[0_18px_40px_rgba(0,0,0,0.45)] touch-pan-y select-none"
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      style={{
        transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
        transition: draggingRef.current ? "none" : "transform 180ms ease-out",
      }}
    >
      <img alt={dish.title} className="absolute inset-0 h-full w-full object-cover opacity-[0.55]" src={dish.image} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,12,0.2)_0%,rgba(10,10,12,0.86)_72%,rgba(10,10,12,0.98)_100%)]" />
      <div
        className="pointer-events-none absolute inset-[-18%] z-10 bg-[radial-gradient(circle_at_25%_35%,rgba(255,92,125,0.98),rgba(248,125,145,0.7)_22%,rgba(248,125,145,0.28)_42%,transparent_68%)] blur-2xl transition-all duration-200"
        style={{
          opacity: redFlashOpacity,
          transform: feedbackDirection === "left" ? "scale(1.08)" : "scale(0.92)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-[-18%] z-10 bg-[radial-gradient(circle_at_75%_35%,rgba(91,255,158,0.98),rgba(126,209,162,0.7)_22%,rgba(126,209,162,0.3)_42%,transparent_68%)] blur-2xl transition-all duration-200"
        style={{
          opacity: greenFlashOpacity,
          transform: feedbackDirection === "right" ? "scale(1.08)" : "scale(0.92)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-150"
        style={{
          background:
            feedbackDirection === "right"
              ? "linear-gradient(135deg, rgba(63,191,120,0.42), rgba(18,18,20,0.08) 38%, rgba(91,255,158,0.28))"
              : "linear-gradient(135deg, rgba(255,84,112,0.42), rgba(18,18,20,0.08) 38%, rgba(248,125,145,0.26))",
          opacity: feedbackDirection ? 1 : 0,
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-between p-5">
        <span
          className="rounded-full border border-[#7ed1a2]/80 bg-[#0f2218]/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#cdf4de] shadow-[0_0_30px_rgba(91,255,158,0.35)] transition-all duration-200"
          style={{
            opacity: Math.max(likeOpacity, feedbackDirection === "right" ? 1 : 0),
            transform: feedbackDirection === "right" ? "scale(1.16) translateY(-2px)" : "scale(1)",
          }}
        >
          J'aime
        </span>
        <span
          className="rounded-full border border-[#f87d91]/80 bg-[#261217]/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#ffd0d8] shadow-[0_0_30px_rgba(255,92,125,0.35)] transition-all duration-200"
          style={{
            opacity: Math.max(nopeOpacity, feedbackDirection === "left" ? 1 : 0),
            transform: feedbackDirection === "left" ? "scale(1.16) translateY(-2px)" : "scale(1)",
          }}
        >
          Non merci
        </span>
      </div>
      <div className="relative z-20 flex h-full min-h-[28rem] flex-col justify-end gap-3 p-6">
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
      </div>
    </article>
  );
}

export default DishCard;
