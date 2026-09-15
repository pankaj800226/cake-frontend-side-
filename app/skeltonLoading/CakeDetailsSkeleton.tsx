// components/CakeDetailsSkeleton.tsx
const CakeDetailsSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-[#FFFBFB] py-4 sm:py-8 md:py-10 px-4 sm:px-6 lg:px-8">
      {/* Back Navigation Bar */}
      <div className="max-w-[1400px] mx-auto mb-6">
        <div className="h-4 w-36 rounded bg-stone-200/60 animate-pulse" />
      </div>

      <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 xl:gap-12 items-stretch">
        {/* ================= LEFT SIDE: Image Gallery ================= */}
        <div className="w-full lg:w-[48%] xl:w-[52%] flex flex-col gap-4 flex-shrink-0">
          <div className="relative w-full bg-white rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(219,39,119,0.015)] border border-pink-100/30 overflow-hidden">
            <div className="w-full aspect-[4/3] sm:aspect-[16/11] md:aspect-[16/10] relative bg-stone-100 animate-pulse">
              {/* Logo placeholder */}
              <div className="absolute top-3 right-3 w-[55px] h-[55px] rounded-full bg-stone-200/60" />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="space-y-2 px-1">
            <div className="h-3 w-24 rounded bg-stone-200/60 animate-pulse" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-stone-100 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: Product Details ================= */}
        <div className="w-full lg:w-[52%] xl:w-[48%] flex flex-col gap-5">
          {/* Title */}
          <div className="h-8 sm:h-10 w-3/4 rounded-lg bg-pink-100/60 animate-pulse" />

          {/* Category */}
          <div className="h-4 w-28 rounded bg-stone-200/60 animate-pulse" />

          {/* Rating row */}
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-5 h-5 rounded bg-stone-200/60 animate-pulse" />
            ))}
            <div className="h-4 w-16 rounded bg-stone-200/60 animate-pulse ml-2" />
          </div>

          {/* Description lines */}
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-stone-200/60 animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-stone-200/60 animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-stone-200/60 animate-pulse" />
          </div>

          {/* Price */}
          <div className="h-7 w-32 rounded bg-pink-100/70 animate-pulse mt-1" />

          {/* Size selector */}
          <div className="space-y-2 mt-2">
            <div className="h-3 w-20 rounded bg-stone-200/60 animate-pulse" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-20 rounded-full bg-stone-100 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Flavor selector */}
          <div className="space-y-2 mt-2">
            <div className="h-3 w-24 rounded bg-stone-200/60 animate-pulse" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-24 rounded-full bg-stone-100 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Quantity + buttons */}
          <div className="flex items-center gap-3 mt-4">
            <div className="h-10 w-28 rounded-full bg-stone-100 animate-pulse" />
            <div className="h-11 flex-1 rounded-full bg-pink-100/70 animate-pulse" />
            <div className="h-11 flex-1 rounded-full bg-stone-100 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Match Category skeleton */}
      <div className="max-w-[1400px] mx-auto mt-12">
        <div className="h-6 w-44 rounded bg-stone-200/60 animate-pulse mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-pink-100/40 bg-white"
            >
              <div className="w-full aspect-[4/5] bg-stone-100 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Rating section skeleton */}
      <div className="max-w-[1400px] mx-auto mt-12">
        <div className="h-6 w-40 rounded bg-stone-200/60 animate-pulse mb-5" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-pink-100/40 bg-white p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-stone-100 animate-pulse" />
                <div className="h-4 w-28 rounded bg-stone-200/60 animate-pulse" />
              </div>
              <div className="h-3 w-full rounded bg-stone-200/60 animate-pulse mb-2" />
              <div className="h-3 w-4/5 rounded bg-stone-200/60 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CakeDetailsSkeleton;