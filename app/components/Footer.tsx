"use client";

import { Instagram, LinkedIn } from "@mui/icons-material";
import { BsYoutube } from "react-icons/bs";


const Footer = () => {
    return (
        <footer className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white py-6 px-4 border-t border-pink-600/20 select-none">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Copyright Text */}
                <h3 className="font-sans text-xs sm:text-sm font-bold tracking-wider uppercase opacity-95">
                    &copy; {new Date().getFullYear()} Copyright Cakes Ordering
                </h3>

                {/* Social Links Section */}
                <div className="flex items-center gap-5">
                    <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-pink-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
                        aria-label="Instagram"
                    >
                        <Instagram className="w-4 h-4 sm:w-5 h-5" />
                    </a>
                    
                    <a 
                        href="https://youtube.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-red-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
                        aria-label="YouTube"
                    >
                        <BsYoutube className="w-4 h-4 sm:w-5 h-5" />
                    </a>

                    <a 
                        href="https://linkedin.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
                        aria-label="LinkedIn"
                    >
                        <LinkedIn className="w-4 h-4 sm:w-5 h-5" />
                    </a>
                </div>

            </div>
        </footer>
    );
};

export default Footer;