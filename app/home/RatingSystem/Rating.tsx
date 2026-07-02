"use client";

import React, { useEffect, useState } from 'react';
import { Rating as MuiRating, TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { api } from '@/app/backendApi/api';
import AllRating from './AllRating';

interface RatingData {
    _id: string;
    name: string;
    rating: number;
    date: string;
    comment: string;
    createdAt: string;
    cakeId: string;
    userId: {
        _id: string;
        username: string;
        profileImg: string;
    };
}

interface RatingProps {
    cakeId: string | number;
}

const Rating = ({ cakeId }: RatingProps) => {
    const [rating, setRating] = useState<number | null>(5);
    const [comment, setComment] = useState('');
    const [ratings, setRatings] = useState<RatingData[]>([]);
    const [btnLoader, setBtnLoader] = useState(false)


    // fetch rating
    const fetchingRating = async () => {
        try {
            const res = await axios.get(`${api}/api/rating/get/rating/${cakeId}`);
            setRatings(res.data?.rating);
        } catch (error) {
            console.error("Error fetching ratings:", error);
        }
    };

    useEffect(() => {
        if (cakeId) fetchingRating();
    }, [cakeId]);

    // handle create rating
    const handleRating = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rating) {
            toast.error("Please pick a star rating.");
            return;
        }
        if (!comment.trim()) {
            toast.error("Please share your feedback.");
            return;
        }

        try {
            setBtnLoader(true)
            const res = await axios.post(
                `${api}/api/rating/create/rating/${cakeId}`,
                { rating, comment },
                { withCredentials: true }
            );

            if (res.status === 201) {
                toast.success("Thank you for your rating!");
                setComment('');
                setRating(5);
            }

            await fetchingRating();

        } catch (error: any) {
            console.error("Error submitting rating:", error);
            toast.error(error.response?.data?.message || error.message || "Something went wrong");
        } finally {
            setBtnLoader(false)
        }
    };

    // Corrected update handler
    const handleUpdate = async (editcakeId: string, updatedRating: number, updatedComment: string) => {
        if (!updatedComment.trim()) {
            toast.error("Please share your feedback.");
            return;
        }

        try {
            await axios.put(
                `${api}/api/rating/edit/rating/${editcakeId}`,
                { rating: updatedRating, comment: updatedComment },
                { withCredentials: true }
            );

            toast.success("Rating edited successfully!");
            await fetchingRating();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message || "Failed to update review");
        }
    };

    // delete rating
    const handleDelete = async (targetCakeId: string) => {
        try {
            await axios.delete(`${api}/api/rating/delete/rating/${targetCakeId}`,
                { withCredentials: true }
            );
            setRatings((prev) => prev.filter((item) => item?.cakeId !== targetCakeId));
            toast.success("Deleted");

        } catch (error: any) {
            console.log(error);
            toast.error(`${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans antialiased">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-12 lg:py-16">

                {/* Header section */}
                <header className="mb-6 sm:mb-8 md:mb-12 border-b border-slate-200/60 pb-4 sm:pb-6 md:pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
                    <div>
                        <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            Feedback Loop
                        </span>
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mt-2">
                            Customer Experiences
                        </h1>
                    </div>
                    <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 max-w-xs sm:text-right">
                        Authentic reviews from verified users. Your feedback helps us shape a better experience.
                    </p>
                </header>

                {/* Fixed Layout Grid Wrapper */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

                    {/* LEFT SIDE: INPUT FORM */}
                    <div className="lg:col-span-5 lg:sticky lg:top-6">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/60"
                        >
                            <div className="mb-4 sm:mb-5">
                                <h3 className="text-base sm:text-lg font-bold text-slate-800">Share Your Thoughts</h3>
                                <p className="text-[11px] sm:text-xs text-slate-400 mt-1">Fields are required to keep reviews authentic.</p>
                            </div>

                            <form onSubmit={handleRating} className="space-y-3 sm:space-y-4 md:space-y-5">
                                <div className="bg-slate-50/80 p-3 sm:p-3.5 rounded-lg sm:rounded-xl border border-slate-100 flex items-center justify-between gap-2 sm:gap-3">
                                    <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Overall Rating</span>
                                    <MuiRating
                                        name="cake-rating-input"
                                        value={rating}
                                        onChange={(event, newValue) => setRating(newValue)}
                                        size="large"
                                        sx={{
                                            color: '#10B981',
                                            '& .MuiRating-icon': {
                                                fontSize: {
                                                    xs: '1.2rem',
                                                    sm: '1.5rem',
                                                    md: '1.8rem',
                                                    lg: '2rem'
                                                }
                                            }
                                        }}
                                    />
                                </div>

                                <TextField
                                    fullWidth
                                    label="Feedback & Message"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            '&.Mui-focused fieldset': { borderColor: '#10B981' }
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#10B981' }
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disableElevation
                                    sx={{
                                        mt: 0.5,
                                        backgroundColor: '#10B981',
                                        color: 'white',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        padding: { xs: '10px', sm: '11px', md: '12px' },
                                        borderRadius: '10px',
                                        fontSize: { xs: '0.85rem', sm: '0.925rem' },
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            backgroundColor: '#059669',
                                            boxShadow: '0 12px 20px -8px rgba(16, 185, 129, 0.35)',
                                        }
                                    }}
                                >
                                    {btnLoader ? 'Loading...' : 'Submit'}
                                </Button>
                            </form>
                        </motion.div>
                    </div>

                    {/* RIGHT SIDE: REVIEWS LIST */}
                    <div className="lg:col-span-7">
                        <AllRating
                            ratings={ratings}
                            handleDelete={handleDelete}
                            handleUpdate={handleUpdate}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Rating;