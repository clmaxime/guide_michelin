import michelinStarUrl from "@/assets/michelin-star.svg";

export const MICHELIN_LABELS = {
  1: "Une étoile : une cuisine d'une grande finesse",
  2: "Deux étoiles : une cuisine d'exception",
  3: "Trois étoiles : une cuisine unique",
};

const SIZES = {
  xs: 10,
  sm: 14,
  md: 18,
  lg: 24,
};

export function MichelinStars({ count, size = "sm" }) {
  const px = SIZES[size] ?? SIZES.sm;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <img key={i} src={michelinStarUrl} alt="★" width={px} height={px} />
      ))}
    </span>
  );
}
