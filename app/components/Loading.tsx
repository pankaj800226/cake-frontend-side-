import Image from "next/image";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFBFB]">
      {/* Container for logo with fixed dimension boundaries */}
      <div className="relative h-24 w-24 sm:h-28 sm:w-28 animate-pulse mb-4">
        <Image
          src="/logo.png"
          alt="Baking Wonders Loading..."
          fill
          priority
          className="object-contain"
        />
      </div>

      {/* Subtle loader text/spinner bar indicator */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-1 w-24 bg-stone-100 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-pink-600 rounded-full w-1/2 animate-[loading_1s_ease-in-out_infinite]" />
        </div>
        <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-stone-400 font-sans animate-bounce">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;