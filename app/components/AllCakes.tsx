"use client";

import Image from 'next/image';
import Link from 'next/link';
import CategoryFilter from './CategoryFilter';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Error from './Error';
import Loading from './Loading';
import { api } from '../backendApi/api';

interface CakeSize { weight: string; price: number; _id?: string; }
interface CakeItem {
    _id: string;
    title: string;
    slug: string;
    category?: any;
    photo: string;
    des?: string;
    eggless?: string;
    callUsForInstantHelpNo?: string;
    sizes: CakeSize[];
    categoryName: string
}
interface Category {
    _id: string;
    categoryName: string;
    slug: string;
}

const AllCakes = () => {
    const [allCakes, setAllCakes] = useState<CakeItem[]>([]);
    const [filteredCakes, setFilteredCakes] = useState<CakeItem[]>([]);
    const [allCategory, setAllCategory] = useState<Category[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    console.log(allCakes);
    
    // Fetch all cakes
    useEffect(() => {
        const fetchCakes = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${api}/api/cakes/find/cakes`);
                setAllCakes(res.data);
                setFilteredCakes(res.data); 
            } catch (error) {
                console.error("Error fetching API database rows:", error);
                setError("Failed to load cakes registry");
            } finally {
                setLoading(false);
            }
        };
        fetchCakes();
    }, []);

    // Fetch all categories
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`${api}/api/category/get/category`);
                setAllCategory(res.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategory();
    }, []);

    if (error) return <Error error={error} />;
    if (loading) return <Loading />;

    return (
        <div className="w-full bg-[#FFFBFB] min-h-screen pb-16 sm:pb-24">

            {/* CLEAN & READABLE PROPS INJECTION */}
            <CategoryFilter
                allCakes={allCakes}
                allCategories={allCategory}
                onFilterChange={setFilteredCakes}
            />

            <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-6 sm:mt-8">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-black text-stone-800 tracking-tight">
                        The Cake <span className="font-light italic text-pink-600/90">Gallery</span>
                    </h2>
                    <div className="w-12 h-[1.5px] bg-pink-200 mx-auto mt-3"></div>
                </div>

                {filteredCakes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-pink-100 rounded-3xl bg-white shadow-sm max-w-xl mx-auto p-6 mt-8">
                        <span className="text-4xl mb-4 animate-pulse">🍰</span>
                        <h3 className="text-lg font-bold text-stone-700">Gallery Empty</h3>
                        <p className="text-stone-400 text-xs mt-1 max-w-xs">
                            No artisan options found matching your currently active menu filters.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 mt-8 md:pb-12">
                        {filteredCakes.map((item, index) => (
                            <div
                                key={item._id}
                                className={`group relative flex flex-col overflow-hidden bg-white rounded-2xl border border-pink-100/40 shadow-[0_4px_20px_rgb(219,39,119,0.02)] transition-all duration-500 hover:shadow-xl hover:shadow-pink-600/5 ${index % 3 === 1 ? 'md:translate-y-5' : ''}`}
                            >
                                <Link href={`/cakes/${item._id}`} className="w-full h-full block relative">
                                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-50">
                                        <Image
                                            src={item.photo[0]}
                                            alt={item.title}
                                            fill
                                            priority={index < 3}
                                            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                                            className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                                        <span className="absolute top-4 left-4 font-sans text-[10px] font-bold text-white/80 tracking-widest bg-stone-900/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                                            {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex flex-col justify-end transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                        {item.category && (
                                            <span className="text-pink-400 font-sans tracking-widest text-[10px] uppercase font-bold mb-1.5 block opacity-95">
                                                {/* {typeof item.category === 'object' ? item.category.categoryName : String(item.category)} */}
                                                {item?.category?.categoryName}
                                            </span>
                                        )}
                                        <h3 className="font-serif text-lg md:text-xl font-black text-white tracking-wide leading-snug drop-shadow-sm">
                                            {item.title}
                                        </h3>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllCakes;