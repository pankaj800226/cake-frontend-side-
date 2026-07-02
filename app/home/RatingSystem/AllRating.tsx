"use client";

import { useState } from 'react';
import { Trash, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Rating as MuiRating,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';
import dayjs from 'dayjs';

interface Review {
    _id: string;
    name: string;
    rating: number;
    date: string;
    comment: string;
    createdAt: string;
    userId: {
        _id: string;
        username: string;
        profileImg: string;
    };
}

interface AllRatingProps {
    ratings: Review[];
    handleDelete: (id: string) => void;
    handleUpdate: (id: string, updatedRating: number, updatedComment: string) => Promise<void> | void;
}

const AllRating = ({ ratings, handleDelete, handleUpdate }: AllRatingProps) => {
    const isAlreadyloginUser = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

    // States for Editing Dialog
    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState('');

    const handleOpenEdit = (review: Review) => {
        setEditId(review._id);
        setRating(review.rating);
        setComment(review.comment);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setEditId(null);
        setComment('');
    };

    // Submits local modal fields up to the parent handler
    const onSubmitEdit = async () => {
        if (editId) {
            await handleUpdate(editId, rating, comment);
            handleCloseEdit();
        }
    };

    return (
        <div className="lg:col-span-7 space-y-3 sm:space-y-4 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
                {ratings.length === 0 ? (
                    <motion.div
                        key="empty-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl border border-dashed border-slate-200 px-3 sm:px-4"
                    >
                        <p className="text-slate-400 font-medium text-xs sm:text-sm">
                            No reviews posted yet. Be the first to share!
                        </p>
                    </motion.div>
                ) : (
                    ratings.map((review) => (
                        <motion.div
                            key={review._id}
                            layout
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="bg-white p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border border-slate-100 hover:border-slate-200/80 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 group"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0 flex items-center justify-center rounded-lg sm:rounded-xl bg-slate-100 text-slate-600 text-xs font-bold tracking-wider border border-slate-200/40">
                                        {review.userId.username ? review.userId.username.charAt(0).toUpperCase() : "?"}
                                    </div>
                                    <div className="space-y-0.5 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm leading-snug truncate max-w-[120px] sm:max-w-[150px] md:max-w-[200px]">
                                                {review.userId.username}
                                            </h4>
                                            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50/80 px-1.5 py-0.5 rounded">
                                                {review.rating}.0
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MuiRating
                                                value={review.rating}
                                                readOnly
                                                size="small"
                                                sx={{
                                                    color: '#10B981',
                                                    fontSize: {
                                                        xs: '0.7rem',
                                                        sm: '0.85rem'
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 sm:gap-2 self-start sm:self-auto">
                                    <span className="text-[9px] sm:text-[10px] md:text-[11px] text-slate-400 font-medium bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md whitespace-nowrap mr-1">
                                        {dayjs(review.createdAt).format("DD MMM YYYY")}
                                    </span>

                                    {/* Action items rendered only for the owner */}
                                    {review?.userId?._id === isAlreadyloginUser && (
                                        <>
                                            {/* Edit Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEdit(review)}
                                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all duration-200 opacity-70 hover:opacity-100"
                                                aria-label="Edit review"
                                            >
                                                <Pencil className="h-4 w-4 cursor-pointer" />
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(review._id)}
                                                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all duration-200 opacity-70 hover:opacity-100"
                                                aria-label="Delete review"
                                            >
                                                <Trash className='h-4 w-4 cursor-pointer' />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <p className="text-[11px] sm:text-xs md:text-sm text-slate-600 leading-relaxed mt-2 sm:mt-3 md:mt-4 border-t border-slate-50 pt-2 sm:pt-2.5 md:pt-3">
                                {review.comment}
                            </p>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>

            {/* MATERIAL UI EDIT DIALOG */}
            <Dialog
                open={openEdit}
                onClose={handleCloseEdit}
                fullWidth
                maxWidth="xs"
                sx={{
                    sx: { borderRadius: '16px', padding: '8px' }
                }}
            >
                <DialogTitle style={{ fontWeight: 700, color: '#1E293B', paddingBottom: '8px' }}>
                    Update Your Review
                </DialogTitle>
                <DialogContent>
                    <div className="space-y-4 mt-2">
                        {/* Star Rating Input */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</span>
                            <MuiRating
                                name="edit-rating-input"
                                value={rating}
                                onChange={(event, newValue) => setRating(newValue || 5)}
                                size="large"
                                sx={{ color: '#10B981' }}
                            />
                        </div>

                        {/* Comment/Feedback input */}
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
                    </div>
                </DialogContent>
                <DialogActions style={{ padding: '0 24px 16px 24px' }}>
                    <Button
                        onClick={handleCloseEdit}
                        style={{ color: '#64748B', fontWeight: 600, textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmitEdit}
                        variant="contained"
                        disableElevation
                        style={{
                            backgroundColor: '#10B981',
                            color: 'white',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: '8px'
                        }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AllRating;