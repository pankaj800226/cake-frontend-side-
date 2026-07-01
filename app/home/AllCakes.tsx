"use client";

import Image from 'next/image';
import Link from 'next/link';
import CategoryFilter from './CategoryFilter';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Error from '../components/Error';
import Loading from '../components/Loading';
import { api } from '../backendApi/api';
import CakesNotFound from '../components/CakesNotFound';

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


    // Fetch all cakes
    useEffect(() => {
        const fetchCakes = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${api}/api/cakes/find/cakes`);
                setAllCakes(res.data);
                setFilteredCakes(res.data);
            } catch (error: any) {
                console.error("Error fetching API database rows:", error);
                setError(`error: ${error?.message || error}`);
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
            } catch (error: any) {
                console.error("Error fetching categories:", error);
                setError(`error: ${error?.message || error}`);
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
                    <CakesNotFound />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 mt-8 md:pb-12">
                        {filteredCakes.map((item, index) => (
                            <div
                                key={item._id}
                                className={`group relative flex flex-col overflow-hidden bg-white rounded-2xl border border-pink-100/40 shadow-[0_4px_20px_rgb(219,39,119,0.02)] transition-all duration-500 hover:shadow-xl hover:shadow-pink-600/5 ${index % 3 === 1 ? 'md:translate-y-5' : ''}`}
                            >
                                <Link href={`/cakes/${item._id}`} className="w-full h-full block relative">
                                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-50">
                                        {/* Product Image */}
                                        <Image
                                            src={item.photo[0]}
                                            alt={item.title}
                                            fill
                                            priority={index < 3}
                                            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                                            className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                                        />

                                        {/* Watermark Logo */}
                                        <Image
                                            src="/logo.png"
                                            alt="Logo"
                                            width={55}
                                            height={55}
                                            className="absolute top-3 right-3 z-20 opacity-30 saturate-100 rounded-full pointer-events-none select-none"
                                        />

                                        {/* Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                                        <span className="absolute top-4 left-4 z-20 font-sans text-[10px] font-bold text-white/80 tracking-widest bg-stone-900/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
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