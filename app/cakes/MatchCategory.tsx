import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '../backendApi/api';
import Loading from '../components/Loading';
import { toast } from 'sonner';
import Error from '../components/Error';

interface CakeType {
    _id: string;
    title: string;
    photo: string[];
    categoryName?: string;
    slug: string
}

interface CakeCategory {
    _id: string;
    categoryName: string;
}

interface MatchCategoryProps {
    cakesDetails: {
        _id: string;
        category?: CakeCategory;  // 👈 Match the optional CakeCategory type
    };
}

const MatchCategory: React.FC<MatchCategoryProps> = ({ cakesDetails }) => {
    const [relatedCakes, setRelatedCakes] = useState<CakeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState('')


    useEffect(() => {
        const fetchRelatedCakes = async () => {
            if (cakesDetails?.category && cakesDetails?._id) {
                try {
                    setLoading(true);

                    
                    const categoryId = cakesDetails.category._id

                    const response = await axios.get(
                        `${api}/api/cakes/related/${categoryId}/${cakesDetails._id}`
                    );

                    if (response.data.success) {
                        setRelatedCakes(response.data.cakes);
                    }
                } catch (error:any) {
                    console.error("Error", error);
                    toast.error(`${error}`)
                    setError(
                        error.response?.data?.message ||
                        error.message
                    );
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchRelatedCakes();
    }, [cakesDetails]);

    if (loading) {
        return (
            <Loading />
        );
    }

    if(error) return <Error error={error}/>
    

    // Empty State
    if (relatedCakes.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No related cakes found!
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 relative inline-block after:content-[''] after:absolute after:w-12 after:h-1 after:bg-pink-500 after:left-0 after:-bottom-2">
                You May Also Like
            </h3>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {relatedCakes.map((cake) => (
                    <Link
                        href={`/cakes/${cake.slug}`}
                        key={cake._id}
                        className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                    >
                        <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                            <Image
                                src={cake.photo?.[0] || '/placeholder-cake.jpg'}
                                alt={cake.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                        </div>

                        {/* Cake Details Text */}
                        <div className="p-4 flex flex-col flex-grow">
                            <span className="text-xs font-semibold uppercase tracking-wider text-pink-500 mb-1">
                                {cake.categoryName}
                            </span>
                            <h4 className="font-semibold text-gray-800 text-lg line-clamp-1 group-hover:text-pink-600 transition-colors duration-200">
                                {cake.title}
                            </h4>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MatchCategory;