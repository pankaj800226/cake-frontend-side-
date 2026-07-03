"use client";

import { useEffect, useState } from "react";
import { Button, Link } from "@mui/material";
import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";
import { api } from "../backendApi/api";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

const Header = () => {
  const [phone, setPhone] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setPhone(localStorage.getItem("phone"));
    }
  }, []);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(`${api}/api/userAuth/userLogout`, {}, { withCredentials: true });

      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("phone");

      router.replace("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="w-full bg-white text-neutral-800 border-b border-neutral-100 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      {/* 🟢 Height ko h-18 se h-14 (3.5rem) kiya taaki header sleek lage */}
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* 🟢 Logo container ka size w-48 h-10 se badha kar w-56 h-12 kiya */}
        <div className="relative w-56 h-12 flex items-center">
          <Link href="/" underline="none" className="block relative w-full h-full transition-opacity hover:opacity-90">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-4">
          {/* Prevent Hydration Layout Shift */}
          {!isMounted ? (
            <div className="w-24 h-9" /> 
          ) : phone ? (
            <Button
              onClick={handleLogout}
              variant="contained"
              startIcon={<LogOut className="w-4 h-4" />}
              sx={{
                background: "linear-gradient(135deg, #fb2c36 0%, #b81d24 100%)",
                color: "#ffffff",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                borderRadius: "8px",
                px: 3,
                py: 0.8, // 🟢 Height choti ki toh padding thoda adjust kiya balance ke liye
                boxShadow: "0 2px 8px rgba(251, 44, 54, 0.15)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  background: "linear-gradient(135deg, #e0222b 0%, #9e161c 100%)",
                  boxShadow: "0 4px 12px rgba(251, 44, 54, 0.25)",
                  transform: "translateY(-0.5px)",
                },
              }}
            >
              Logout
            </Button>
          ) : (
            <Link
              href="/login"
              underline="none"
              sx={{
                background: "linear-gradient(135deg, #fb2c36 0%, #b81d24 100%)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.85rem",
                borderRadius: "8px",
                px: 3,
                py: 0.9, // 🟢 Height ke hisab se padding minor adjust kiya
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                boxShadow: "0 2px 8px rgba(251, 44, 54, 0.15)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  background: "linear-gradient(135deg, #e0222b 0%, #9e161c 100%)",
                  boxShadow: "0 4px 12px rgba(251, 44, 54, 0.25)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <User className="w-4 h-4" />
              Login
            </Link>
          )}
        </nav>

      </div>
    </header>
  );
};

export default Header;