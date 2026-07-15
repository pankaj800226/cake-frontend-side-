'use client'

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, Phone } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import axios from 'axios';
import { api } from '../backendApi/api';
import { useRouter } from 'next/navigation';
import Error from '../components/Error';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error,setError] = useState('')

    const [formData, setFormData] = useState({
        phone: '',
        password: '',
    });


    const [btnLoading, setBtnLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // Destructuring updated clean keys
        const { phone, password } = formData;

        if (phone.length !== 10) {
            toast.error("10 digits allowed only");
            return

        }

        if (!phone || !password) {
            return toast.error("All fields are required");
        }

        try {
            setBtnLoading(true);

            // API payload keys changed to use phone and password
            const res = await axios.post(`${api}/api/userAuth/userLogin`,
                { phone, password },
                { withCredentials: true }
            );
            
            if (res.data.code === 404) {
                toast.error("User Not Found");
            } else if (res.data.code === 405) {
                toast.error("Password invalid");
            } else if (res.data.code === 200) {
                localStorage.setItem("userId", String(res.data.userId));
                localStorage.setItem("username", res.data.username);
                localStorage.setItem("phone", res.data.phone);

                toast.success("Welcome back!");
                
                // Hard reload using window.location fixes the cookie reading bug on servers
                window.location.href = "/";

            }

        } catch (error:any) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
            setError(
                error.response?.data?.message ||
                error.message
            );
        } finally {
            setBtnLoading(false);
        }
    };

    if(error) return <Error error={error}/>
    

    return (
        <div className="min-h-screen bg-[#FFFBFB] flex items-center justify-center p-4 antialiased">
            <div className="w-full max-w-[440px] bg-white rounded-3xl border border-stone-100 shadow-[0_8px_40px_rgba(219,39,119,0.03)] p-6 sm:p-8 flex flex-col gap-6">

                {/* Brand/Security Header Section */}
                <div className="text-center space-y-2 mt-2">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-pink-50 text-pink-600 border border-pink-100/40 mb-2 shadow-sm">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-serif font-black text-stone-800 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-400 font-medium">
                        Log in to manage your bakery configuration
                    </p>
                </div>

                {/* Form Fields Action Panel */}
                <form onSubmit={handleLogin} className="space-y-4">

                    {/* PHONE FIELD */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                            Phone Number
                        </label>
                        <div className="relative flex items-center">
                            <Phone className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                            <input
                                type="text"
                                inputMode="numeric"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="123456789"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50/40 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500 transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* PASSWORD FIELD WITH DYNAMIC EYE TOGGLE */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-200 bg-stone-50/40 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500 transition-all text-sm font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100/60 active:scale-95 transition-all cursor-pointer"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Action Trigger Button */}
                    <button
                        type="submit"
                        disabled={btnLoading}
                        className="w-full mt-2 bg-pink-600 hover:bg-pink-700 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-[0_4px_12px_rgba(219,39,119,0.15)] hover:shadow-[0_6px_20px_rgba(219,39,119,0.25)] transition-all text-sm cursor-pointer tracking-wide uppercase text-center"
                    >
                        {btnLoading ? "Loading ..." : 'Login'}
                    </button>
                </form>

                {/* Footer Alternative Link Text */}
                <p className="text-center text-xs font-medium text-stone-400">
                    Don't have an account yet?{' '}
                    <Link
                        href="/register"
                        className="text-pink-600 font-bold hover:underline cursor-pointer transition-colors duration-150"
                    >
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;