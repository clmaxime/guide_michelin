function DishSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#131928] p-3">
      <div className="h-[30rem] animate-pulse rounded-2xl bg-white/8" />
      <div className="mt-3 space-y-2">
        <div className="h-6 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}

export default DishSkeleton;
