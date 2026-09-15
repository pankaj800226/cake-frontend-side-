// app/cakes/[id]/dialogs/OrderDialog.tsx
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

interface OrderDialogProps {
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

const OrderDialog = ({
    open,
    onClose,
    cakesDetails,
    size,
    flavor,
    quantity,
    totalPrice,
    extraFlavorPrice,
    comment,
}: OrderDialogProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [orderLoader, setOrderLoader] = useState(false);
    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        tableNo: "",
        date: "",
    });

    const today = new Date().toISOString().split("T")[0];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "phone") {
            const numbersOnly = value.replace(/[^0-9]/g, "");
            setCustomer((prev) => ({ ...prev, [name]: numbersOnly }));
            return;
        }
        setCustomer((prev) => ({ ...prev, [name]: value }));
    };

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
                    customer,
                },
                { withCredentials: true }
            );

            toast.success(response.data.message);

            const flavorNamesString =
                flavor.length > 0
                    ? flavor.map((f) => f.flavorName).join(", ")
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

            const url = `https://wa.me/91${phone}?text=${encodeURIComponent(
                message
            )}`;

            window.open(url, "_blank");
            onClose();
        } catch (error: unknown) {
            console.error("order error:", error);
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || error.message || "Something went wrong";
                toast.error(message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setOrderLoader(false);
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
            <form onSubmit={handleOrderSubmit} className="flex flex-col h-full">
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
                        Complete Your Order
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
                            name="name"
                            variant="outlined"
                            value={customer.name}
                            onChange={handleInputChange}
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
                            value={customer.phone}
                            onChange={handleInputChange}
                            placeholder="98765XXXXX"
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
                                    min: today,
                                    style: { fontSize: "0.9rem", padding: "12px" },
                                },
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
                        {orderLoader ? "Loading ... " : "Order Now"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default OrderDialog;