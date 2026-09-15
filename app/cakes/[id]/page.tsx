// app/cakes/[id]/page.tsx
"use client";

import Image from "next/image";
import { use, useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

import { toast } from "sonner";
import axios from "axios";
import { api } from "@/app/backendApi/api";
import Error from "@/app/components/Error";
import ProductDetailsActions from "../ProductDetailsActions";
import Rating from "@/app/home/RatingSystem/Rating";
import MatchCategory from "../MatchCategory";
import CakeDetailsSkeleton from "../../skeltonLoading/CakeDetailsSkeleton";
import OrderDialog from "../dialog/OrderDialog";
import BookingDialog from "../dialog/BookingDialog";

interface CakeSize {
    weight: string;
    price: number;
    _id?: string;
}

interface CakeCategory {
    _id: string;
    categoryName: string;
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
    averageRating: number;
    stock: number;
}

type Props = {
    params: Promise<{ id: string }>;
};

const CakeDetails = ({ params }: Props) => {
    const { id } = use(params);

    const [cakesDetails, setCakesDetails] = useState<CakeItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSize, setSelectedSize] = useState<number>(0);
    const [selectedFlavors, setSelectedFlavors] = useState<number[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [open, setOpen] = useState(false);
    const [shippingInfoOpen, setShippingOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState(0);
    const [_, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState<number>(0);

    const handleOpenDialog = () => {
        const userId =
            typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        if (!userId) {
            toast.error("Please login to place an order!");
            const currentPath = window.location.pathname;
            window.location.href = `/login?redirect=${encodeURIComponent(
                currentPath
            )}`;
            return;
        }
        setOpen(true);
    };

    const handleCloseDialog = () => setOpen(false);

    const handleOpenShippingDialog = () => {
        const userId =
            typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        if (!userId) {
            toast.error("Please login to book a delivery!");
            const currentPath = window.location.pathname;
            window.location.href = `/login?redirect=${encodeURIComponent(
                currentPath
            )}`;
            return;
        }
        setShippingOpen(true);
    };

    const handleCloseShippingDialog = () => setShippingOpen(false);

    useEffect(() => {
        setSelectedImage(0);
        setSelectedSize(0);
        setSelectedFlavors([0]);
    }, [cakesDetails]);

    useEffect(() => {
        const fetchCakesId = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${api}/api/cakes/cakesSlug/${id}`);
                setCakesDetails(res.data);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const message =
                        err.response?.data?.message || err.message || "Something went wrong";

                    toast.error(message);
                    setError(message);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCakesId();
    }, [id]);

    useEffect(() => {
        if (!cakesDetails?._id) return;

        const fetchingRating = async () => {
            try {
                const res = await axios.get(
                    `${api}/api/rating/get/rating/${cakesDetails?._id}`
                );

                const ratingData = res.data.rating || [];
                setRatings(ratingData);

                const avg =
                    ratingData.length > 0
                        ? ratingData.reduce(
                            (sum: number, item: { rating: string }) => sum + Number(item.rating),
                            0
                        ) / ratingData.length
                        : 0;

                setAverageRating(avg);
            } catch (error: unknown) {
                console.error("Error fetching ratings:", error);
                if (axios.isAxiosError(error)) {
                    toast.error(`${error.response?.data?.message || error.message}`);
                    setError(error.response?.data?.message || error.message);
                } else {
                    toast.error("Something went wrong");
                    setError("Something went wrong");
                }
            }
        };

        fetchingRating();
    }, [cakesDetails?._id]);

    if (loading) return <CakeDetailsSkeleton />;
    if (!cakesDetails) return <CakeDetailsSkeleton />;

    const size = cakesDetails.sizes[selectedSize];

    const flavor =
        cakesDetails.selectedFlavor?.filter((_, index) =>
            selectedFlavors.includes(index)
        ) || [];

    const basePrice = size ? size.price : 0;
    const extraFlavorPrice = flavor.reduce(
        (sum, item) => sum + item.flavorsPrice,
        0
    );
    const totalPrice = (basePrice + extraFlavorPrice) * quantity;

    if (error) return <Error error={error} />;

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
                {/* LEFT SIDE: Image Gallery Panel */}
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

                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={55}
                                height={55}
                                className="absolute top-3 right-3 z-20 opacity-30 saturate-100 rounded-full pointer-events-none select-none"
                            />
                        </div>
                    </div>

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
                                        className={`relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-xl border-2 transition-all duration-200 flex-shrink-0 ${selectedImage === index
                                            ? "border-pink-600 scale-105 shadow-sm"
                                            : "border-stone-200 hover:border-pink-200"
                                            }`}
                                    >
                                        <Image
                                            alt="Cake View"
                                            src={img}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE: Data & Choice Selection Form */}
                <ProductDetailsActions
                    cakesDetails={cakesDetails}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    selectedFlavors={selectedFlavors}
                    setSelectedFlavors={setSelectedFlavors}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    comment={comment}
                    setComment={setComment}
                    totalPrice={totalPrice}
                    handleOpenDialog={handleOpenDialog}
                    handleOpenShippingDialog={handleOpenShippingDialog}
                    averageRating={averageRating}
                />
            </motion.div>

            {/* ORDER DIALOG */}
            <OrderDialog
                open={open}
                onClose={handleCloseDialog}
                cakesDetails={cakesDetails}
                size={size}
                flavor={flavor}
                quantity={quantity}
                totalPrice={totalPrice}
                extraFlavorPrice={extraFlavorPrice}
                comment={comment}
            />

            {/* BOOKING DIALOG */}
            <BookingDialog
                open={shippingInfoOpen}
                onClose={handleCloseShippingDialog}
                cakesDetails={cakesDetails}
                size={size}
                flavor={flavor}
                quantity={quantity}
                totalPrice={totalPrice}
                extraFlavorPrice={extraFlavorPrice}
                comment={comment}
            />

            <MatchCategory cakesDetails={cakesDetails} />
            <Rating cakeId={cakesDetails._id} />
        </div>
    );
};

export default CakeDetails;