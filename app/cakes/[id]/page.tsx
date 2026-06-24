"use client";

import Image from "next/image";
import { use, useEffect, useState } from "react";
import { FiMinus, FiPlus, FiMessageSquare, FiShoppingBag, FiArrowLeft, FiCheck } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    useMediaQuery,
    useTheme
} from "@mui/material";

import { toast } from "sonner";
import axios from "axios";
import { api } from "@/app/backendApi/api";
import Loading from "@/app/components/Loading";
import Error from "@/app/components/Error";

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
    category?: string;
    photo: string[];
    des?: string;
    eggless?: string;
    callUsForInstantHelpNo?: string;
    sizes: CakeSize[];
    selectedFlavor?: CakeFlavor[];
}

type Props = {
    params: Promise<{ id: string }>
}

const CakeDetails = ({ params }: Props) => {
    const { id } = use(params);

    const [cakesDetails, setCakesDetails] = useState<CakeItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSize, setSelectedSize] = useState<number>(0);
    const [selectedFlavors, setSelectedFlavors] = useState<number[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);

    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        tableNo: "",
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        setSelectedImage(0);
        setSelectedSize(0);
        setSelectedFlavors([0]);
    }, [cakesDetails]);

    useEffect(() => {
        const fetchCakesId = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${api}/api/cakes/cakesId/${id}`);
                setCakesDetails(res.data);
            } catch (err: any) {
                console.error("Error loading product detail:", err);
                toast.error("Failed to load cake details");
                setError(`error: ${err?.message || err}`);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCakesId();
    }, [id]);

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;
    if (!cakesDetails) return <Loading />;

    const size = cakesDetails.sizes[selectedSize];

    // Get all selected flavor objects from selected flavor indexes
    // convert index to object 
    const flavor = cakesDetails.selectedFlavor?.filter((_, index) => selectedFlavors.includes(index)) || []



    const basePrice = size ? size.price : 0;

    const extraFlavorPrice = flavor.reduce((sum, item) => sum + item.flavorsPrice, 0);

    const totalPrice = (basePrice + extraFlavorPrice) * quantity;

    const handleOpenDialog = () => setOpen(true);
    const handleCloseDialog = () => setOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "phone") {
            const numbersOnly = value.replace(/[^0-9]/g, "");
            setCustomer((prev) => ({ ...prev, [name]: numbersOnly }));
            return;
        }
        setCustomer((prev) => ({ ...prev, [name]: value }));
    };

    // handle order 
    const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, phone, tableNo } = customer;

        if (!name || !phone || !tableNo) {
            toast.error("All fields are required");
            return;
        }

        try {
            await axios.post(
                `${api}/api/order/create/order`,
                {
                    cakeId: cakesDetails._id,
                    selectedSize: size,
                    selectedFlavor: flavor,
                    quantity,
                    totalPrice,
                    comment,
                    customer
                },
                { withCredentials: true }
            );
        } catch (apiErr) {
            console.error("Order API backup logs:", apiErr);
        }

        // Process active multiple flavors names list safely
        const flavorNamesString = flavor.length > 0 ? flavor.map(f => f.flavorName).join(", ") : "Standard";

        const message =
            `Hi, I want to order:\n\n` +
            `🍰 *Cake:* ${cakesDetails.title}\n` +
            `⚖️ *Weight:* ${size?.weight || "N/A"}\n` +
            `🍫 *Flavor Additions:* ${flavorNamesString}\n` +
            `💳 *Extra Addons Cost:* ₹${extraFlavorPrice}\n\n` +
            `📦 *Quantity:* ${quantity}\n` +
            `💰 *Total Price:* ₹${totalPrice}\n\n` +
            `👤 *Customer Details:*\n` +
            `• *Name:* ${customer.name}\n` +
            `• *Phone:* ${customer.phone}\n` +
            `• *Table No:* ${customer.tableNo}\n` +
            `• *Instructions:* ${comment || "None"}`;

        const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
        setOpen(false);
    };

    return (
        <div className="w-full min-h-screen bg-[#FFFBFB] py-4 sm:py-8 md:py-10 px-4 sm:px-6 lg:px-8">
            {/* Back Navigation Bar */}
            <div className="max-w-[1400px] mx-auto mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-500 hover:text-pink-600 transition-colors duration-200 group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span>Return to Menu</span>
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 xl:gap-12 items-stretch"
            >
                {/* ================= LEFT SIDE: Image Gallery Panel ================= */}
                <div className="w-full lg:w-[48%] xl:w-[52%] flex flex-col gap-4 flex-shrink-0">
                    <div className="relative w-full bg-white rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(219,39,119,0.015)] border border-pink-100/30 overflow-hidden">
                        <div className="w-full aspect-[4/3] sm:aspect-[16/11] md:aspect-[16/10] relative">
                            {cakesDetails.photo?.[selectedImage] && (
                                <Image
                                    src={cakesDetails.photo[selectedImage]}
                                    alt={cakesDetails.title}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            )}
                        </div>
                    </div>

                    {/* Thumbnails list mapping */}
                    {cakesDetails.photo && cakesDetails.photo.length > 1 && (
                        <div className="space-y-2 px-1">
                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                                Gallery Views
                            </p>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                                {cakesDetails.photo.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        type="button"
                                        className={`relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-xl border-2 transition-all duration-200 flex-shrink-0 ${selectedImage === index ? "border-pink-600 scale-105 shadow-sm" : "border-stone-200 hover:border-pink-200"
                                            }`}
                                    >
                                        <Image alt="Cake View" src={img} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ================= RIGHT SIDE: Data & Choice Selection Form ================= */}
                <div className="w-full lg:flex-1 flex flex-col justify-between space-y-6 lg:space-y-0 lg:py-1">

                    {/* Header Block Section */}
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-4">
                                <span className="inline-block bg-pink-50 text-pink-700 text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded">
                                    {cakesDetails.category || "Premium Cake"}
                                </span>
                                {cakesDetails.callUsForInstantHelpNo && (
                                    <span className="text-xs font-mono font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                                        Helpline: {cakesDetails.callUsForInstantHelpNo}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-serif font-black text-stone-800 tracking-tight leading-tight">
                                {cakesDetails.title}
                            </h2>
                        </div>

                        {cakesDetails.des && (
                            <p className="text-stone-600 text-xs sm:text-sm font-normal leading-relaxed max-w-2xl">
                                {cakesDetails.des}
                            </p>
                        )}

                        <div className="pt-0.5">
                            <span className="inline-flex items-center gap-1.5 bg-emerald-50/90 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-emerald-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {cakesDetails.eggless || "100% Eggless Pure Veg"}
                            </span>
                        </div>
                    </div>

                    {/* Center Block Choices Area */}
                    <div className="space-y-5 py-5 border-t border-b border-stone-100">
                        {/* Size Mapping Options */}
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

                        {/* Enhanced Multiple Choice Flavors Selection Segment */}
                        {cakesDetails.selectedFlavor && cakesDetails.selectedFlavor.length > 0 && (
                            <div className="space-y-2.5">
                                <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest">
                                    Choose Flavors & Addons <span className="text-[10px] lowercase text-stone-400 font-normal">(Select multi if required)</span>
                                </p>
                                <div className="flex flex-wrap gap-2">
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
                            </div>
                        )}

                        {/* Quantity Options Segment */}
                        <div className="space-y-2">
                            <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest">Quantity</p>
                            <div className="flex items-center gap-1 bg-stone-100/70 border border-stone-200/40 rounded-xl p-1 select-none w-fit">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition cursor-pointer"
                                >
                                    <FiMinus className="w-3" />
                                </button>
                                <span className="w-8 text-center font-sans font-extrabold text-stone-800 text-xs">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity((prev) => prev + 1)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition cursor-pointer"
                                >
                                    <FiPlus className="w-3" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Baking Customization Segment */}
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

                    {/* Footer Bottom Sheet Strip */}
                    <div className="pt-4 flex items-center justify-between gap-4 mt-auto">
                        <div>
                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Total Price</p>
                            <p className="text-2xl sm:text-3xl font-sans font-black text-stone-900 tracking-tight">
                                ₹{totalPrice}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleOpenDialog}
                            className="px-8 sm:px-12 bg-pink-600 hover:bg-pink-700 active:scale-[0.98] text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all text-center text-xs sm:text-sm cursor-pointer tracking-wider uppercase inline-flex items-center justify-center gap-2"
                        >
                            <FiShoppingBag className="w-4 h-4" />
                            <span>Order Now</span>
                        </button>
                    </div>

                </div>
            </motion.div >

            {/* ================= MATERIAL UI DIALOG CONTAINER ================= */}
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                fullScreen={isMobile}
                maxWidth="xs"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: isMobile ? "0px" : "20px",
                            padding: { xs: "6px", sm: "12px" },
                            boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)"
                        }
                    }
                }}
            >
                <form onSubmit={handleOrderSubmit} className="flex flex-col h-full">
                    {size && (
                        <DialogTitle sx={{ fontFamily: 'serif', color: '#1c1917', pb: 1, pt: 3, px: 3, fontSize: '1.3rem', fontWeight: 900 }}>
                            Complete Your Order
                            <span className="block text-xs font-sans font-medium text-stone-500 mt-1.5 tracking-normal normal-case">
                                Selected Item: <span className="text-pink-600 font-bold">{cakesDetails.title}</span> ({size.weight})
                            </span>
                        </DialogTitle>
                    )}

                    <DialogContent sx={{ px: 3, py: 1.5, flexGrow: 1 }} className="space-y-4">
                        <div className="space-y-4 pt-1">
                            <TextField
                                autoFocus
                                fullWidth
                                required
                                margin="dense"
                                label="Full Name"
                                name="name"
                                variant="outlined"
                                value={customer.name}
                                onChange={handleInputChange}
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: { style: { fontSize: '0.9rem', padding: '12px' } }
                                }}
                            />

                            <TextField
                                fullWidth
                                required
                                margin="dense"
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                variant="outlined"
                                value={customer.phone}
                                onChange={handleInputChange}
                                placeholder="98765XXXXX"
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: { style: { fontSize: '0.9rem', padding: '12px' }, maxLength: 10 }
                                }}
                            />

                            <TextField
                                fullWidth
                                required
                                margin="dense"
                                label="Table / Seat Number"
                                name="tableNo"
                                variant="outlined"
                                value={customer.tableNo}
                                onChange={handleInputChange}
                                placeholder="E.g., Table 12"
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: { style: { fontSize: '0.9rem', padding: '12px' } }
                                }}
                            />
                        </div>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, pt: 1, gap: 1, mt: isMobile ? 'auto' : 0 }}>
                        <Button
                            onClick={handleCloseDialog}
                            sx={{ color: '#57534e', textTransform: 'none', fontWeight: 700, fontSize: '0.9rem', py: 1 }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disableElevation
                            sx={{
                                flexGrow: isMobile ? 1 : 0,
                                backgroundColor: "#db2777",
                                color: "#ffffff",
                                textTransform: 'none',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                px: 3,
                                py: 1.2,
                                borderRadius: '12px',
                                '&:hover': { backgroundColor: "#be185d" }
                            }}
                        >
                            Send via WhatsApp
                        </Button>
                    </DialogActions>
                </form>
            </Dialog >
        </div >
    );
};

export default CakeDetails;