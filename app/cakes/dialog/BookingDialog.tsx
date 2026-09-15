// app/cakes/[id]/dialogs/BookingDialog.tsx
"use client";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { api } from "@/app/backendApi/api";

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
    photo: string[];
    sizes: CakeSize[];
    selectedFlavor?: CakeFlavor[];
    averageRating: number;
    stock: number;
}

interface BookingDialogProps {
    open: boolean;
    onClose: () => void;
    cakesDetails: CakeItem;
    size: CakeSize | undefined;
    flavor: CakeFlavor[];
    quantity: number;
    totalPrice: number;
    extraFlavorPrice: number;
    comment: string;
}

const BookingDialog = ({
    open,
    onClose,
    cakesDetails,
    size,
    flavor,
    quantity,
    totalPrice,
    extraFlavorPrice,
    comment,
}: BookingDialogProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [bookLoader, setBookLoader] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({
        username: "",
        pincode: "",
        address: "",
        phone: "",
        orderDate: "",
        pickupdate: "",
    });

    const today = new Date().toISOString().split("T")[0];

    const handleOrderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "phone" || name === "pincode") {
            const numbersOnly = value.replace(/[^0-9]/g, "");
            setShippingInfo((prev) => ({ ...prev, [name]: numbersOnly }));
            return;
        }
        setShippingInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handlePincodeChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const pincode = e.target.value;

        setShippingInfo((prev) => ({ ...prev, pincode }));

        if (pincode.length !== 6) return;

        try {
            const res = await axios.get(
                `https://api.postalpincode.in/pincode/${pincode}`
            );

            const office = res.data[0]?.PostOffice?.[0];

            if (office) {
                setShippingInfo((prev) => ({
                    ...prev,
                    pincode,
                    address: `${office.Name}, ${office.District}, ${office.State}`,
                }));
            }
        } catch (error: unknown) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || error.message || "Something went wrong";
                toast.error(message);
            }
        }
    };

    const handleBookingNow = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { username, phone, address, pincode, orderDate, pickupdate } =
            shippingInfo;

        if (
            !username ||
            !phone ||
            !address ||
            !pincode ||
            !orderDate ||
            !pickupdate
        ) {
            toast.error("All fields are required");
            return;
        }

        try {
            setBookLoader(true);
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
                    pickupdate,
                },
                { withCredentials: true }
            );

            toast.success(response.data.message);
            toast.success("Booking Successfully");

            const flavorNamesString =
                flavor.length > 0
                    ? flavor.map((f) => f.flavorName).join(", ")
                    : "Standard";

            const message =
                `👋 Hi, I want to book a cake:\n\n` +
                `🍰 *Cake:* ${cakesDetails.title}\n` +
                `⚖️ *Weight:* ${size?.weight || "N/A"}\n` +
                `🍫 *Flavor Additions:* ${flavorNamesString}\n` +
                `💳 *Extra Addons Cost:* ₹${extraFlavorPrice}\n\n` +
                `📦 *Quantity:* ${quantity}\n` +
                `💰 *Total Price:* ₹${totalPrice}\n\n` +
                `👤 *Booking Details:*\n` +
                `• *Name:* ${username}\n` +
                `• *Phone:* ${phone}\n` +
                `• *Address:* ${address}, ${pincode}\n` +
                `• *Order Date:* ${orderDate}\n` +
                `• *Pickup Date:* ${pickupdate}\n` +
                `• *Instructions:* ${comment || "None"}`;

            const url = `https://wa.me/91${phone}?text=${encodeURIComponent(
                message
            )}`;
            window.open(url, "_blank");

            onClose();
        } catch (error: unknown) {
            console.error("Booking error:", error);
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || error.message || "Something went wrong";
                toast.error(message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setBookLoader(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={isMobile}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: isMobile ? "0px" : "20px",
                        padding: { xs: "6px", sm: "12px" },
                        boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                    },
                },
            }}
        >
            <form onSubmit={handleBookingNow} className="flex flex-col h-full">
                {size && (
                    <DialogTitle
                        sx={{
                            fontFamily: "serif",
                            color: "#1c1917",
                            pb: 1,
                            pt: 3,
                            px: 3,
                            fontSize: "1.3rem",
                            fontWeight: 900,
                        }}
                    >
                        Complete Shipping Booking
                        <span className="block text-xs font-sans font-medium text-stone-500 mt-1.5 tracking-normal normal-case">
                            Selected Item:{" "}
                            <span className="text-pink-600 font-bold">
                                {cakesDetails.title}
                            </span>{" "}
                            ({size.weight})
                        </span>
                    </DialogTitle>
                )}

                <DialogContent
                    sx={{ px: 3, py: 1.5, flexGrow: 1 }}
                    className="space-y-4"
                >
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
                                htmlInput: {
                                    style: { fontSize: "0.9rem", padding: "12px" },
                                },
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
                                htmlInput: {
                                    style: { fontSize: "0.9rem", padding: "12px" },
                                    maxLength: 10,
                                },
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
                                htmlInput: {
                                    style: { fontSize: "0.9rem", padding: "12px" },
                                },
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
                                htmlInput: {
                                    style: { fontSize: "0.9rem", padding: "12px" },
                                },
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
                                    style: { fontSize: "0.9rem", padding: "12px" },
                                },
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
                                    style: { fontSize: "0.9rem", padding: "12px" },
                                },
                            }}
                        />
                    </div>
                </DialogContent>

                <DialogActions
                    sx={{ p: 3, pt: 1, gap: 1, mt: isMobile ? "auto" : 0 }}
                >
                    <Button
                        onClick={onClose}
                        sx={{
                            color: "#57534e",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            py: 1,
                        }}
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
                            textTransform: "none",
                            fontWeight: 800,
                            fontSize: "0.9rem",
                            px: 3,
                            py: 1.2,
                            borderRadius: "12px",
                            "&:hover": { backgroundColor: "#be185d" },
                        }}
                    >
                        {bookLoader ? "Loading..." : "Book Now"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default BookingDialog;