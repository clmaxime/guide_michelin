import { Button } from "@/components/ui/button";

function SwipePlaceholder({ disabled, onSwipeLeft, onSwipeRight, lastSwipe }) {
  return (
    <div className="grid w-full grid-cols-2 gap-3" role="presentation">
      <Button
        className="h-12 rounded-xl border border-[#f87d91]/35 bg-[#261217] text-sm font-semibold text-[#ffd0d8] hover:bg-[#311820]"
        disabled={disabled}
        onClick={onSwipeLeft}
        type="button"
      >
        Je n'aime pas
      </Button>
      <Button
        className="h-12 rounded-xl border border-[#7ed1a2]/35 bg-[#0f2218] text-sm font-semibold text-[#cdf4de] hover:bg-[#143022]"
        disabled={disabled}
        onClick={onSwipeRight}
        type="button"
      >
        J'aime
      </Button>
    </div>
  );
}

export default SwipePlaceholder;
