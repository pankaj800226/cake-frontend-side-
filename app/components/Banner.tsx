"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";

const Banner = () => {
    return (
        /* Increased height globally for a premium hero aesthetic across all device breakpoints */
        <div className="w-full relative h-[28vh] min-h-[220px] sm:h-[30vh] md:h-[34vh] lg:h-[38vh] bg-stone-900 overflow-hidden group select-none">

            {/* Full-bleed Background Image Wrapper */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/banner.png"
                    alt="Artisanal Bakery Showcase"
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                />

                {/* Layered Gradient Overlays for High Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-stone-900/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-pink-900/5 mix-blend-multiply" />
            </div>

            {/* Content Flex Alignment Layer */}
            <div className="relative h-full w-full max-w-[1600px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col justify-center items-start z-10">
                {/* Spacing adjusted for higher layout breathing space */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="space-y-2 sm:space-y-3.5 max-w-xl sm:max-w-2xl"
                >
                    {/* Micro-Indicator Pill Badge */}
                    <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
                        <FiHeart className="text-pink-400 w-3 h-3 fill-pink-400 animate-pulse" />
                        <span className="text-white/90 text-[10px] sm:text-[11px] font-sans font-black tracking-widest uppercase">
                            Crafted with Passion
                        </span>
                    </div>

                    {/* Master Display Heading - Scales beautifully with higher height box */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight leading-[1.15] drop-shadow-md">
                        Artisan Baking, <br />
                        <span className="bg-gradient-to-r from-pink-300 via-rose-200 to-amber-100 bg-clip-text text-transparent">
                            Perfected For You
                        </span>
                    </h1>
                </motion.div>
            </div>

            {/* Abstract Lighting Accents */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
            <div className="absolute -bottom-10 left-1/3 w-[30vw] h-[30vw] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        </div>
    );
};

export default Banner;