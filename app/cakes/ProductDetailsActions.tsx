import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FiCheck, FiMessageSquare, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import {Rating as MuiRating } from "@mui/material";
import { toast } from 'sonner';


interface CakeCategory {
    _id: string;
    categoryName: string;
}

interface CakeSize {
    weight: string;
    price: number;
    _id?: string;
}

interface CakeFlavor {
    flavorName: string;
    flavorsPrice: number;
    _id?: string;
}

interface CakeItem {
    _id: string;
    title: string;
    category?: CakeCategory;
    photo: string[];
    des?: string;
    eggless?: string;
    callUsForInstantHelpNo?: string;
    sizes: CakeSize[];
    selectedFlavor?: CakeFlavor[];
    averageRating: number
    stock: number
}

interface ProductRightSideDataProps {
    cakesDetails: CakeItem;
    selectedSize: number;
    setSelectedSize: (index: number) => void;
    selectedFlavors: number[];
    setSelectedFlavors: React.Dispatch<React.SetStateAction<number[]>>;
    quantity: number;
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
    comment: string;
    setComment: React.Dispatch<React.SetStateAction<string>>;
    totalPrice: number;
    handleOpenDialog: () => void;
    handleOpenShippingDialog: () => void;
    averageRating: number
}

const ProductDetailsActions = ({
    cakesDetails,
    selectedSize,
    setSelectedSize,
    selectedFlavors,
    setSelectedFlavors,
    quantity,
    setQuantity,
    comment,
    setComment,
    totalPrice,
    handleOpenDialog,
    handleOpenShippingDialog,
    averageRating
}: ProductRightSideDataProps) => {

    const ids = React.useId();

    return (
        <div className="w-full lg:flex-1 flex flex-col justify-between space-y-6 lg:space-y-0 lg:py-1">
            <div className="space-y-3">
                <div className="space-y-1.5">
                    <h2 className="text-2xl sm:text-3xl xl:text-4xl font-serif font-black text-stone-800 tracking-tight leading-tight">
                        {cakesDetails.title}
                    </h2>
                </div>

                {cakesDetails.des && (
                    <p className="text-stone-600 text-xs sm:text-sm font-normal leading-relaxed max-w-2xl">
                        {cakesDetails.des}
                    </p>
                )}

                <div className="pt-0.5 flex justify-between align-center">

                    {/* rating show */}
                    <div
                        className="flex items-center gap-2">
                        <MuiRating
                            value={averageRating}
                            precision={0.1}
                            readOnly

                            sx={{ color: "#FFA41C" }}
                        />
                        <span className="text-sm font-semibold text-stone-600">
                            {averageRating.toFixed(1)}
                        </span>
                    </div>


                    <span className="inline-flex items-center gap-1.5 bg-emerald-50/90 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-emerald-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Eggless
                    </span>



                </div>
            </div>

            {/* Center Choices Area */}
            <div className="space-y-5 py-5 border-t border-b border-stone-100">
                <div className="space-y-2">
                    <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest">Select Size & Weight</p>
                    <div className="flex gap-2 flex-wrap">
                        {cakesDetails.sizes.map((item, index) => {
                            const isSelected = selectedSize === index;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setSelectedSize(index)}
                                    className={`px-4 py-2 rounded-xl border font-bold text-xs transition-all duration-150 cursor-pointer active:scale-95 ${isSelected
                                        ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300"
                                        }`}
                                >
                                    {item.weight} : ₹{item.price}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* flavour select */}
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />}
                        aria-controls={`${ids}-panel1-content`}
                        id={`${ids}-panel1-header`}
                    >
                        <Typography
                            component="span"
                            sx={{
                                fontWeight: 500,
                                color: 'text.primary',
                                textTransform: 'uppercase',
                                fontSize: '0.85rem',
                                letterSpacing: '1px'
                            }}
                        >
                            Select Flavor
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        {cakesDetails.selectedFlavor && cakesDetails.selectedFlavor.length > 0 && (
                            <div className="flex flex-col gap-2 md:flex-row">
                                {cakesDetails.selectedFlavor.map((fla, index) => {
                                    const isChecked = selectedFlavors.includes(index);
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => {
                                                if (isChecked) {
                                                    setSelectedFlavors(prev => prev.filter(i => i !== index));
                                                } else {
                                                    setSelectedFlavors(prev => [...prev, index]);
                                                }
                                            }}
                                            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-150 cursor-pointer ${isChecked
                                                ? "bg-pink-50 border-pink-500 text-pink-700 shadow-sm"
                                                : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                                                }`}
                                        >
                                            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${isChecked ? "bg-pink-600 border-pink-600 text-white" : "border-stone-300 bg-white"
                                                }`}>
                                                {isChecked && <FiCheck className="w-2.5 h-2.5 stroke-[4]" />}
                                            </div>
                                            <span>{fla.flavorName}</span>
                                            <span className={`text-[10px] font-medium ${isChecked ? "text-pink-600" : "text-stone-400"}`}>
                                                {fla.flavorsPrice > 0 ? `(+₹${fla.flavorsPrice})` : "(Free)"}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </AccordionDetails>
                </Accordion>

                <div className="space-y-2">
                    <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest">Quantity</p>

                    <div className='flex justify-between'>
                        {/* + -  */}
                        <div className="flex items-center gap-1 bg-stone-100/70 border border-stone-200/40 rounded-xl p-1 select-none w-fit">

                            <button
                                type="button"
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition cursor-pointer"
                            >
                                <FiMinus className="w-3" />
                            </button>

                            <span className="w-8 text-center font-sans font-extrabold text-stone-800 text-xs">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    if (quantity >= cakesDetails.stock) {
                                        toast.error(`Only ${cakesDetails.stock} cake(s) available`)
                                        return
                                    }

                                    setQuantity(prev => prev + 1)
                                }}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition cursor-pointer"
                            >
                                <FiPlus className="w-3" />
                            </button>
                        </div>


                        {/*  stock check  */}
                        {cakesDetails.stock <= 5 && cakesDetails.stock > 0 && (
                            <p className="text-sm text-orange-500 font-semibold">
                                Only {cakesDetails.stock} left in stock
                            </p>
                        )}
                    </div>

                </div>
            </div>

            {/* Notes Customization Segment */}
            <div className="w-full space-y-2 pt-1">
                <label className="inline-flex items-center gap-1.5 text-stone-500 font-bold text-[11px] uppercase tracking-widest">
                    <FiMessageSquare className="text-stone-400" />
                    <span>Baking Customization Notes</span>
                </label>
                <textarea
                    placeholder="E.g., Write 'Happy Birthday Pankaj', deliver with candles..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                    className="w-full p-3.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-pink-600 focus:border-pink-600 transition-all duration-150 resize-none shadow-sm"
                />
            </div>

            {/* Footer Interactive Actions */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
                <div>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Total Price</p>
                    <p className="text-2xl sm:text-3xl font-sans font-black text-stone-900 tracking-tight">
                        ₹{totalPrice}
                    </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={handleOpenDialog}
                        className="flex-1 sm:flex-none px-6 sm:px-8 bg-pink-600 hover:bg-pink-700 active:scale-[0.98] text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all text-center text-xs sm:text-sm cursor-pointer tracking-wider uppercase inline-flex items-center justify-center gap-2"
                    >
                        <FiShoppingBag className="w-4 h-4" />
                        <span>Order Now</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleOpenShippingDialog}
                        className="flex-1 sm:flex-none px-6 sm:px-8 bg-orange-400 hover:bg-orange-500 active:scale-[0.98] text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all text-center text-xs sm:text-sm cursor-pointer tracking-wider uppercase inline-flex items-center justify-center gap-2"
                    >
                        <FiShoppingBag className="w-4 h-4" />
                        <span>Pick Up </span>
                    </button>
                </div>
            </div>




            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            </div>
                        
        </div>
    )
}

export default ProductDetailsActions;