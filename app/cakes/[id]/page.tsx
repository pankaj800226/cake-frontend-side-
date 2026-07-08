"use client";

import Image from "next/image";
import { use, useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
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
import ProductDetailsActions from "../ProductDetailsActions";
import Rating from "@/app/home/RatingSystem/Rating";
import MatchCategory from "../MatchCategory";

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
    const [shippingInfoOpen, setShippingOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [_, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState<number>(0);



    // btn loading 
    const [bookLoader, setBookLoader] = useState(false)
    const [orderLoader, setOrderLoader] = useState(false)

    // order state
    const [shippingInfo, setShippingInfo] = useState({
        username: "",
        pincode: "",
        address: "",
        phone: "",
        orderDate: "",
        pickupdate: ""
    })

    // booking 
    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        tableNo: "",
        date: ""
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const handleOpenDialog = () => setOpen(true);
    const handleCloseDialog = () => setOpen(false);

    const handleOpenShippingDialog = () => setShippingOpen(true)
    const handleCloseShippingDialog = () => setShippingOpen(false)



    useEffect(() => {
        setSelectedImage(0);
        setSelectedSize(0);
        setSelectedFlavors([0]);
    }, [cakesDetails]);

    // cake id
    useEffect(() => {
        const fetchCakesId = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${api}/api/cakes/cakesSlug/${id}`);
                setCakesDetails(res.data);
            } catch (err: any) {
                console.error("Error loading product detail:", err);
                toast.error(`${err.message}`);
                setError(
                    err.response?.data?.message ||
                    err.message
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCakesId();
    }, [id]);

    // fetch shipping order
    useEffect(() => {
        const fetchBookingId = async () => {
            try {
                const res = await axios.get(
                    `${api}/api/booking/bookingInfo`,
                    { withCredentials: true }
                );

                setShippingInfo({
                    username: res.data.username,
                    phone: res.data.phone,
                    address: res.data.address,
                    pincode: res.data.pincode,
                    orderDate: res.data.orderDate?.split("T")[0],
                    pickupdate: res.data.pickupdate?.split("T")[0],
                });

            } catch (error: any) {
                console.log(error);
                toast.error(`error${error.message}`)
                if (error.response?.status === 404) {
                    return;
                }
                setError(
                    error.response?.data?.message ||
                    error.message
                );



            }
        }

        fetchBookingId()
    }, [id])


    // fetch rating calculate
    useEffect(() => {
        if (!cakesDetails?._id) return;

        const fetchingRating = async () => {
            try {
                const res = await axios.get(`${api}/api/rating/get/rating/${cakesDetails?._id}`);

                const ratingData = res.data.rating || []
                setRatings(ratingData)

                //  calculate average

                const avg = ratingData.length > 0
                    ? ratingData.reduce(
                        (sum: number, item: any) => sum + Number(item.rating), 0

                    ) / ratingData.length
                    : 0

                setAverageRating(avg)



            } catch (error: any) {
                console.error("Error fetching ratings:", error);
                toast.error(`${error.message}`)
                setError(
                    error.response?.data?.message ||
                    error.message
                );
            }
        };

        fetchingRating()
    }, [cakesDetails?._id])


    if (!cakesDetails) return <Loading />;

    const size = cakesDetails.sizes[selectedSize];

    // convert index to object 
    const flavor = cakesDetails.selectedFlavor?.filter((_, index) => selectedFlavors.includes(index)) || []

    // price calculate
    const basePrice = size ? size.price : 0;
    const extraFlavorPrice = flavor.reduce((sum, item) => sum + item.flavorsPrice, 0);
    const totalPrice = (basePrice + extraFlavorPrice) * quantity;

    // change booking 
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "phone") {
            const numbersOnly = value.replace(/[^0-9]/g, "");
            setCustomer((prev) => ({ ...prev, [name]: numbersOnly }));
            return;
        }
        setCustomer((prev) => ({ ...prev, [name]: value }));
    };

    // order change
    const handleOrderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "phone" || name === "pincode") {
            const numbersOnly = value.replace(/[^0-9]/g, "");
            setShippingInfo((prev) => ({ ...prev, [name]: numbersOnly }));
            return;
        }
        setShippingInfo((prev) => ({ ...prev, [name]: value }))
    }

    // autometic pincode throught addres show
    const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const pincode = e.target.value

        setShippingInfo((prev) => ({
            ...prev,
            pincode
        }))

        if (pincode.length !== 6) return

        try {
            const res = await axios.get(
                `https://api.postalpincode.in/pincode/${pincode}`
            )

            const office = res.data[0]?.PostOffice?.[0]

            if (office) {
                setShippingInfo((prev) => ({
                    ...prev,
                    pincode,
                    address: `${office.Name}, ${office.District}, ${office.State}`,
                }))

            }
        } catch (error: any) {
            console.log(error);
            setError(
                error.response?.data?.message ||
                error.message
            );
        }
    }

    // handle order 
    const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { name, phone, date } = customer;

        if (!name || !phone || !date) {
            toast.error("All fields are required");
            return;
        }

        try {
            setOrderLoader(true);

            const response = await axios.post(
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

            toast.success(response.data.message);

            // WhatsApp message
            const flavorNamesString =
                flavor.length > 0
                    ? flavor.map(f => f.flavorName).join(", ")
                    : "Standard";

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
                `• *Date:* ${customer.date}\n` +
                `• *Instructions:* ${comment || "None"}`;

            const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

            window.open(url, "_blank");

            setOpen(false);

        } catch (err: any) {
            console.log(err);

            toast.error(
                err.response?.data?.message
            );

            setError(
                error.response?.data?.message ||
                error.message
            );

        } finally {
            setOrderLoader(false);
        }
    };


    // handle booking product
    const handleBookingNow = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { username, phone, address, pincode, orderDate, pickupdate } = shippingInfo

        if (!username || !phone || !address || !pincode || !orderDate || !pickupdate) {
            toast.error("All fields are required")
            return
        }

        try {
            setBookLoader(true)
            const response = await axios.post(
                `${api}/api/booking/product/book`,
                {
                    cakeId: cakesDetails._id,
                    selectedSize: size,
                    selectedFlavor: flavor,
                    quantity,
                    totalPrice,
                    comment,
                    username,
                    phone,
                    address,
                    pincode,
                    orderDate,
                    pickupdate
                },
                { withCredentials: true }
            )

            toast.success(response.data.message);

            toast.success("Booking Successfully")

            setShippingOpen(false)
        } catch (error: any) {
            console.log(error);
            setError(
                error.response?.data?.message ||
                error.message
            );

            toast.error(
                error.response?.data?.message
            );
        } finally {
            setBookLoader(false)
        }
    }

    const today = new Date().toISOString().split("T")[0];


    if (loading) return <Loading />;
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

                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={55}
                                height={55}
                                className="absolute top-3 right-3 z-20 opacity-30 saturate-100 rounded-full pointer-events-none select-none"
                            />
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
            </motion.div >

            {/* ================= Complete Your Order (Order Now) CONTAINER ================= */}
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
                                margin="dense"
                                label="Table / Seat Number"
                                type="date"
                                name="tableNo"
                                variant="outlined"
                                value={customer.tableNo}
                                onChange={handleInputChange}
                                placeholder="E.g., Table 12"
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: {
                                        min: today,   // 👈 disables previous dates
                                        style: { fontSize: '0.9rem', padding: '12px' }
                                    }
                                }}
                            />

                            <TextField
                                fullWidth
                                margin="dense"
                                label="Date"
                                name="date"
                                type="date"
                                variant="outlined"
                                value={customer.date}
                                onChange={handleInputChange}
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: {
                                        min: today,   // 👈 disables previous dates
                                        style: { fontSize: '0.9rem', padding: '12px' }
                                    }
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
                            {orderLoader ? "Loading ... " : "Order Now"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog >

            {/* ================= Delivery Info (Book Now) CONTAINER ================= */}
            <Dialog
                open={shippingInfoOpen}
                onClose={handleCloseShippingDialog}
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
                <form onSubmit={handleBookingNow} className="flex flex-col h-full">
                    {size && (
                        <DialogTitle sx={{ fontFamily: 'serif', color: '#1c1917', pb: 1, pt: 3, px: 3, fontSize: '1.3rem', fontWeight: 900 }}>
                            Complete Shipping Booking
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
                                margin="dense"
                                label="Full Name"
                                name="username"
                                variant="outlined"
                                placeholder="Full Name"
                                value={shippingInfo.username}
                                onChange={handleOrderInputChange}
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: { style: { fontSize: '0.9rem', padding: '12px' } }
                                }}
                            />

                            <TextField
                                fullWidth
                                margin="dense"
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                variant="outlined"
                                placeholder="98765XXXXX"
                                value={shippingInfo.phone}
                                onChange={handleOrderInputChange}
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: { style: { fontSize: '0.9rem', padding: '12px' }, maxLength: 10 }
                                }}
                            />

                            <TextField
                                fullWidth
                                margin="dense"
                                label="Address"
                                type="text"
                                name="address"
                                variant="outlined"
                                placeholder="Patna"
                                value={shippingInfo.address}
                                onChange={handleOrderInputChange}
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: { style: { fontSize: '0.9rem', padding: '12px' } }
                                }}
                            />

                            <TextField
                                fullWidth
                                margin="dense"
                                label="Pincode"
                                type="tel"
                                name="pincode"
                                variant="outlined"
                                value={shippingInfo.pincode}
                                onChange={handlePincodeChange}
                                placeholder="800001"
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: { style: { fontSize: '0.9rem', padding: '12px' } }
                                }}
                            />

                            <TextField
                                fullWidth
                                margin="dense"
                                label="Order Date"
                                type="date"
                                name="orderDate"
                                variant="outlined"
                                value={shippingInfo.orderDate}
                                onChange={handleOrderInputChange}
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: {
                                        min: today,
                                        style: { fontSize: '0.9rem', padding: '12px' }
                                    }
                                }}
                            />

                            <TextField
                                fullWidth
                                margin="dense"
                                label="PickUp Date"
                                name="pickupdate"
                                type="date"
                                variant="outlined"
                                value={shippingInfo.pickupdate}
                                onChange={handleOrderInputChange}
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: {
                                        min: today,
                                        style: { fontSize: '0.9rem', padding: '12px' }
                                    }
                                }}
                            />
                        </div>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, pt: 1, gap: 1, mt: isMobile ? 'auto' : 0 }}>
                        <Button
                            onClick={handleCloseShippingDialog}
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
                            {bookLoader ? "Loading..." : "Book Now"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog >


            {/* match categotry  */}
            <MatchCategory cakesDetails={cakesDetails} />

            <Rating cakeId={cakesDetails._id} />



        </div >
    );
};

export default CakeDetails;