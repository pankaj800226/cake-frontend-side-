"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";

interface CakeSize {
    weight: string;
    price: number;
}

interface CakeItem {
    _id: string;
    title: string;
    category?: any;
    photo: string;
    sizes: CakeSize[];
}

interface Category {
    _id: string;
    categoryName: string;
}

interface CategoryFilterProps {
    allCakes: CakeItem[];
    allCategories: Category[];
    onFilterChange: (filtered: CakeItem[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    allCakes,
    allCategories,
    onFilterChange,
}) => {
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [isOpen, setIsOpen] = useState(false);

    const cakeCounts = useMemo(() => {
        const counts: Record<string, number> = { All: allCakes.length };

        allCakes.forEach((cake) => {
            if (!cake.category) return;

            // Populated object handler fallback mechanism
            const catId = typeof cake.category === "object" ? cake.category._id : cake.category;

            if (catId) {
                counts[catId] = (counts[catId] || 0) + 1;
            }
        });

        return counts;
    }, [allCakes]);

    // 2. Clear filtration triggers
    const handleCategoryClick = (categoryId: string) => {
        setActiveCategory(categoryId);
        setIsOpen(false);

        if (categoryId === "All") {
            onFilterChange(allCakes);
        } else {
            const filtered = allCakes.filter((cake) => {
                if (!cake.category) return false;
                const cakeCatId = typeof cake.category === "object" ? cake.category._id : cake.category;
                return cakeCatId === categoryId;
            });
            onFilterChange(filtered);
        }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-6 sm:pt-8">
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 bg-transparent border-b border-pink-100/40 pb-4">

                {/* Mobile Drawer Trigger Switch Layout */}
                <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex lg:hidden items-center gap-2 bg-white border border-stone-200/80 text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                    >
                        <SlidersHorizontal size={14} className="text-pink-600" />
                        <span>Menu</span>
                        {activeCategory !== "All" && <span className="w-1.5 h-1.5 rounded-full bg-pink-600 animate-pulse" />}
                    </button>
                </div>

                {/* Center Segment Row: Fixed Desktop Scroll Horizon Panel */}
                <div className="hidden lg:flex flex-1 max-w-4xl mx-auto items-center gap-2.5 overflow-x-auto px-4 pb-1 pt-1 scrollbar-none snap-x">
                    <button
                        onClick={() => handleCategoryClick("All")}
                        className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans font-extrabold text-xs whitespace-nowrap transition-all duration-300 cursor-pointer ${activeCategory === "All"
                            ? "bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md shadow-pink-600/10"
                            : "bg-white text-stone-600 border border-stone-200/60 hover:text-pink-600"
                            }`}
                    >
                        <span>All Cakes</span>

                    </button>

                    {allCategories.map((item) => {
                        const isActive = activeCategory === item._id;
                        const count = cakeCounts[item._id] || 0;

                        return (
                            <button
                                key={item._id}
                                onClick={() => handleCategoryClick(item._id)}
                                className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans font-extrabold text-xs whitespace-nowrap transition-all duration-300 cursor-pointer ${isActive
                                    ? "bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md shadow-pink-600/10"
                                    : "bg-white text-stone-600 border border-stone-200/60 hover:text-pink-600"
                                    }`}
                            >
                                <span>{item.categoryName}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-400"}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Right Side Info: Live Metric Indicators */}
                <div className="w-full sm:w-auto text-center sm:text-right flex-shrink-0">
                    <button
                        className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans font-extrabold text-xs whitespace-nowrap transition-all duration-300 cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/20 hover:scale-[1.02]"
                    >
                        <span>All Cakes : {allCakes.length}</span>
                    </button>
                </div>
            </div>

            {/* ================= MOBILE EXPANSION DRAWER SIDEBAR ================= */}
            <div
                className={`fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsOpen(false)}
            />

            <div className={`fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl z-50 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div>
                    <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal size={16} className="text-pink-600" />
                            <h3 className="font-sans font-black text-stone-800 text-base">Categories</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-xl bg-stone-50 text-stone-500 cursor-pointer"><X size={16} /></button>
                    </div>

                    <div className="flex flex-col gap-2.5 mt-6 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
                        <button
                            onClick={() => handleCategoryClick("All")}
                            className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl font-sans font-bold text-xs cursor-pointer ${activeCategory === "All" ? "bg-gradient-to-r from-pink-600 to-rose-500 text-white" : "bg-stone-50 text-stone-600"}`}
                        >
                            <span>All Cakes</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${activeCategory === "All" ? "bg-white/20 text-white" : "bg-stone-200/60 text-stone-500"}`}>{allCakes.length}</span>
                        </button>

                        {allCategories.map((item) => {
                            const isActive = activeCategory === item._id;
                            const count = cakeCounts[item._id] || 0;

                            return (
                                <button
                                    key={item._id}
                                    onClick={() => handleCategoryClick(item._id)}
                                    className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl font-sans font-bold text-xs cursor-pointer ${isActive ? "bg-gradient-to-r from-pink-600 to-rose-500 text-white" : "bg-stone-50 text-stone-600"}`}
                                >
                                    <span>{item.categoryName}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${isActive ? "bg-white/20 text-white" : "bg-stone-200/60 text-stone-500"}`}>{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryFilter;