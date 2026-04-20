import { Button } from "@/components/ui/button";
import { useDishTinderStore } from "./store/dish-tinder-store";

function SwipePlaceholder() {
  const swipeDirection = useDishTinderStore((state) => state.swipeDirection);
  const setSwipeDirection = useDishTinderStore((state) => state.setSwipeDirection);

  return (
    <div className="grid w-full max-w-[30rem] grid-cols-2 gap-3" role="presentation">
      <Button
        className="h-auto rounded-xl border border-dashed border-[#c8c8c8] bg-gradient-to-br from-[#f5f5f5] to-white p-4 text-center font-semibold text-[#595959] hover:bg-[#f5f5f5]"
        onClick={() => setSwipeDirection("left")}
        type="button"
        variant="outline"
      >
        Swipe left
      </Button>
      <Button
        className="h-auto rounded-xl border border-dashed border-[#c8c8c8] bg-gradient-to-br from-[#f5f5f5] to-white p-4 text-center font-semibold text-[#595959] hover:bg-[#f5f5f5]"
        onClick={() => setSwipeDirection("right")}
        type="button"
        variant="outline"
      >
        Swipe right
      </Button>
      {swipeDirection ? (
        <p className="col-span-2 text-center text-sm text-muted-foreground">Direction actuelle: {swipeDirection}</p>
      ) : null}
    </div>
  );
}

export default SwipePlaceholder;
