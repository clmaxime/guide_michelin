import { Badge } from "@/components/ui/badge";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import type { Dish } from "../types";

type DishCardProps = {
  dish: Dish;
  onLike: () => void;
  onDislike: () => void;
  showStampOnlyOnCommit?: boolean;
  commitStamp?: "like" | "dislike" | null;
};

function DishCard({ dish, onLike, onDislike, showStampOnlyOnCommit = true, commitStamp = null }: DishCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-12, 12]);
  const likeOpacity = useTransform(x, [40, 160], [0, 1]);
  const dislikeOpacity = useTransform(x, [-160, -40], [1, 0]);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const runCommit = (direction: "like" | "dislike") => {
    setIsAnimatingOut(true);
    window.setTimeout(() => {
      if (direction === "like") onLike();
      if (direction === "dislike") onDislike();
      x.set(0);
      setIsAnimatingOut(false);
    }, 180);
  };

  return (
    <motion.article
      animate={isAnimatingOut ? { x: commitStamp === "like" ? 420 : -420, opacity: 0 } : { x: 0, opacity: 1 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#131928] shadow-2xl shadow-black/50"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) runCommit("like");
        else if (info.offset.x < -120) runCommit("dislike");
      }}
      style={{ x, rotate }}
      transition={{ duration: 0.18 }}
    >
      <img alt={dish.name} className="h-[30rem] w-full object-cover" loading="lazy" src={dish.image} />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-rose-600/45 to-transparent"
        style={{ opacity: showStampOnlyOnCommit ? (commitStamp === "dislike" ? 1 : 0) : dislikeOpacity }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-l from-emerald-600/45 to-transparent"
        style={{ opacity: showStampOnlyOnCommit ? (commitStamp === "like" ? 1 : 0) : likeOpacity }}
      />

      {(showStampOnlyOnCommit ? commitStamp === "like" : false) ? (
        <p className="absolute left-4 top-5 rounded-lg border border-emerald-200 bg-emerald-500/80 px-3 py-1 text-xl font-bold tracking-wider text-white">
          J'AIME
        </p>
      ) : null}
      {(showStampOnlyOnCommit ? commitStamp === "dislike" : false) ? (
        <p className="absolute right-4 top-5 rounded-lg border border-rose-200 bg-rose-500/80 px-3 py-1 text-xl font-bold tracking-wider text-white">
          JE PASSE
        </p>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/90 via-black/35 to-transparent p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-title text-[2rem] leading-none">{dish.name}</h2>
          <Badge className="rounded-md bg-[#ff4458]">{dish.priceRange}</Badge>
        </div>
        <p className="text-sm text-white/85">{dish.restaurant}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {dish.tags.vegetarian ? <Badge variant="secondary">Végétarien</Badge> : null}
          {dish.tags.vegan ? <Badge variant="secondary">Végétalien</Badge> : null}
          {dish.tags.fish ? <Badge variant="secondary">Poisson</Badge> : null}
          {dish.tags.beef ? <Badge variant="secondary">Bœuf</Badge> : null}
          {dish.tags.chicken ? <Badge variant="secondary">Poulet</Badge> : null}
        </div>
      </div>
    </motion.article>
  );
}

export default DishCard;
