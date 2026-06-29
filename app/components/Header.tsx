"use client";

import { useEffect, useState } from "react";
import { Button, Link } from "@mui/material";
import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";
import { api } from "../backendApi/api";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const Header = () => {
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPhone(localStorage.getItem("phone"));
    }
  }, []);

  const router = useRouter()

  const handleLogout = async () => {
    try {
      await axios.post(`${api}/api/userAuth/userLogout`, {}, { withCredentials: true })

      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("phone");

      router.replace("/login");

    } catch (error) {
      console.log(error);
      toast.error(`error${error}`)
    }
  };



  return (
    <header className="w-full bg-white text-slate-800 shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-15 flex items-center justify-between">

        <div className="relative w-40 h-8 flex items-center">
          <Link href="/" underline="none">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center">
          {phone ? (
            <Button
              onClick={handleLogout}
              variant="contained"
              startIcon={<LogOut />}
                
              sx={{
                background: "linear-gradient(135deg, #fb2c36 0%, #b81d24 100%)",
                color: "#ffffff",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                borderRadius: "6px",
                px: 2.5,
                py: 0.5,
                boxShadow: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, #e0222b 0%, #9e161c 100%)",
                  boxShadow: "none",
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
                fontSize: "0.875rem",
                borderRadius: "6px",
                px: 2.5,
                py: 0.7,
                display: "inline-flex",
                alignItems: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  opacity: 0.9,
                  transform: "translateY(-1px)",
                },
              }}
            >
              Login
            </Link>
          )}
        </nav>

      </div>
    </header>
  );
};

export default Header;