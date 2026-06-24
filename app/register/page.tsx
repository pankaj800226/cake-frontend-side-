'use client'

import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import axios from 'axios';
import { api } from '../backendApi/api';
import { useRouter } from 'next/navigation';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        password: '',
    });
    const [btnLoading, setBtnLoading] = useState(false);

    const router = useRouter();

    // input change 
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // register
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const { username, phone, password } = formData;

        if (!username || !phone || !password) {
            toast.error("All fields are required");
            return;
        }

        try {
            setBtnLoading(true);
            const res = await axios.post(`${api}/api/userAuth/userRegister`, { username, phone, password });

            if (res.data.code === 409) {
                toast.error("User already exists"); 
            } else if (res.data.code === 200) {
                toast.success("Registered successfully!");
                router.push('/login');
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBFB] flex items-center justify-center p-4 antialiased">
            <div className="w-full max-w-[440px] bg-white rounded-3xl border border-stone-100 shadow-[0_8px_40px_rgba(219,39,119,0.03)] p-6 sm:p-8 flex flex-col gap-6">

                {/* Brand/Security Header Section */}
                <div className="text-center space-y-2 mt-2">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-pink-50 text-pink-600 border border-pink-100/40 mb-2 shadow-sm">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-serif font-black text-stone-800 tracking-tight">
                        Create Your Account
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-400 font-medium">
                        Join us to manage your culinary inventory seamlessly
                    </p>
                </div>

                {/* Form Fields Action Panel */}
                <form onSubmit={handleRegister} className="space-y-4">

                    {/* USERNAME FIELD */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                            Username
                        </label>
                        <div className="relative flex items-center">
                            <User className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                            <input
                                type="text"
                                name="username" 
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="chef_wonder"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50/40 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500 transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* PHONE FIELD */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                            Phone Number
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
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
                        className="w-full mt-2 bg-pink-600 hover:bg-pink-700 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-[0_4px_12px_rgba(219,39,119,0.15)] hover:shadow-[0_6px_20px_rgba(219,39,119,0.25)] transition-all text-sm cursor-pointer tracking-wide uppercase text-center"
                    >
                        {btnLoading ? "Loading..." : 'Register'}
                    </button>
                </form>

                {/* Footer Alternative Link Text */}
                <p className="text-center text-xs font-medium text-stone-400">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-pink-600 font-bold hover:underline cursor-pointer transition-colors duration-150"
                    >
                        Log In
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Register;