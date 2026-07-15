"use client";

import { useEffect, useState } from "react";
import { Button, Link } from "@mui/material";
import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";
import { api } from "../backendApi/api";
import { useRouter, usePathname } from "next/navigation"; // 🟢 Added usePathname to trigger check on route change
import { LogOut, User } from "lucide-react";

const Header = () => {
  const [phone, setPhone] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);

  const router = useRouter();
  const pathname = usePathname(); // 🟢 Tracks the current URL path

  // Helper function to sync auth state
  const syncAuthState = () => {
    if (typeof window !== "undefined") {
      setPhone(localStorage.getItem("phone"));
    }
  };

  useEffect(() => {
    setIsMounted(true);
    syncAuthState();

    // 🟢 1. Listen for storage changes across different tabs/windows
    window.addEventListener("storage", syncAuthState);
    
    // 🟢 2. Custom event listener for instant login updates within the same tab
    window.addEventListener("local-storage-update", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("local-storage-update", syncAuthState);
    };
  }, []);

  // 🟢 3. Re-check state whenever the route/pathname changes (e.g., coming back from /login)
  useEffect(() => {
    syncAuthState();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setBtnLoader(true);
      await axios.post(`${api}/api/userAuth/userLogout`, {}, { withCredentials: true });

      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("phone");
      
      setPhone(null); // 🟢 Instantly update local state to hide logout button

      router.replace("/login");
      toast.success("Logout successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setBtnLoader(false);
    }
  };

  return (
    <header className="w-full bg-white text-neutral-800 border-b border-neutral-100 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

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
          {!isMounted ? (
            <div className="w-24 h-9" />
          ) : phone ? (
            <Button
              onClick={handleLogout}
              variant="contained"
              disabled={btnLoader}
              startIcon={<LogOut className="w-4 h-4" />}
              sx={{
                background: "linear-gradient(135deg, #fb2c36 0%, #b81d24 100%)",
                color: "#ffffff",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                borderRadius: "8px",
                px: 3,
                py: 0.8,
                boxShadow: "0 2px 8px rgba(251, 44, 54, 0.15)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  background: "linear-gradient(135deg, #e0222b 0%, #9e161c 100%)",
                  boxShadow: "0 4px 12px rgba(251, 44, 54, 0.25)",
                  transform: "translateY(-0.5px)",
                },
              }}
            >
              {btnLoader ? "Loading..." : "Logout"}
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
                py: 0.9,
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