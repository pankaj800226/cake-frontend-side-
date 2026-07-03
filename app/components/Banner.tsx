"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";

const Banner = () => {
    return (
        <div className="w-full relative h-[32vh] min-h-[240px] sm:h-[35vh] md:h-[38vh] lg:h-[42vh] bg-stone-950 overflow-hidden group select-none">

            {/* Full-bleed Background Image Wrapper */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/banner.png"
                    alt="Artisanal Bakery Showcase"
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-103"
                />

                {/* Blending the top cleanly into the dark header */}
                <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/50 to-transparent" />
            </div>

            {/* Content Container balanced perfectly with header max-width */}
            <div className="relative h-full w-full max-w-[1600px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col justify-center items-start z-10">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="space-y-3 max-w-xl sm:max-w-2xl"
                >
                    {/* Micro-Indicator Pill Badge */}
                    <div className="inline-flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
                        <FiHeart className="text-rose-400 w-3 h-3 fill-rose-400 animate-pulse" />
                        <span className="text-stone-200 text-[10px] sm:text-[11px] font-sans font-bold tracking-widest uppercase">
                            Crafted with Passion
                        </span>
                    </div>

                    {/* Master Display Heading */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight leading-[1.2] drop-shadow-md">
                        Artisan Baking, <br />
                        <span className="bg-gradient-to-r from-rose-300 via-pink-200 to-amber-100 bg-clip-text text-transparent">
                            Perfected For You
                        </span>
                    </h1>
                </motion.div>
            </div>
        </div>
    );
};

export default Banner;