// components/CakeGallerySkeleton.tsx
const CakeGallerySkeleton = () => {
  return (
    <div className="w-full bg-[#FFFBFB] min-h-screen pb-16 sm:pb-24">
      {/* Filter bar skeleton */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 rounded-full bg-pink-100/60 animate-pulse"
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-6 sm:mt-8">
        {/* Heading skeleton */}
        <div className="text-center">
          <div className="h-10 w-64 mx-auto rounded-lg bg-pink-100/60 animate-pulse" />
          <div className="w-12 h-[1.5px] bg-pink-200 mx-auto mt-3" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 mt-8 md:pb-12">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`group relative flex flex-col overflow-hidden bg-white rounded-2xl border border-pink-100/40 shadow-[0_4px_20px_rgb(219,39,119,0.02)] ${
                index % 3 === 1 ? "md:translate-y-5" : ""
              }`}
            >
              {/* Image area */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-100 animate-pulse">
                {/* Watermark logo placeholder */}
                <div className="absolute top-3 right-3 w-[55px] h-[55px] rounded-full bg-stone-200/60" />

                {/* Index badge */}
                <div className="absolute top-4 left-4 w-8 h-6 rounded-md bg-stone-200/60" />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/20 to-transparent" />

                {/* Bottom content placeholder */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6">
                  <div className="h-3 w-20 rounded bg-pink-200/60 mb-2" />
                  <div className="h-5 w-3/4 rounded bg-white/40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CakeGallerySkeleton;