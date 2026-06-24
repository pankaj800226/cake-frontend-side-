import React from 'react';
import Image from 'next/image'; // or 'import Image from "next/image"' depending on your framework
import logo from '../assests/logo.png';

interface CakesProps {
    cake: string;
}

const CakesNotFound: React.FC<CakesProps> = ({ cake }) => {
    
    // Function to trigger a complete page reload/refresh
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-center justify-center text-center py-12 px-4 max-w-md mx-auto space-y-4">
            {/* Logo Display */}
            <div className="flex-shrink-0">
                <Image
                    src={logo}
                    alt="logo"
                    width={70}
                    height={70}
                    className="object-contain opacity-80"
                />
            </div>

            {/* Error Message */}
            <div className="space-y-1">
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                    No Results
                </p>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                    {cake} Cake Not Found
                </h3>
                <p className="text-sm text-gray-500 max-w-xs">
                    We couldn't find any cakes matching this selection. Try refreshing the menu.
                </p>
            </div>

            {/* Simple Refresh Button */}
            <button
                type="button"
                onClick={handleRefresh}
                className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider cursor-pointer"
            >
                Refresh Menu
            </button>
        </div>
    );
};

export default CakesNotFound;