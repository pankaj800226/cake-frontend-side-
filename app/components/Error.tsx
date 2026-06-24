"use client";

type ErrorProps = {
    error: string
};

export default function Error({ error }: ErrorProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h2 className="text-red-500 text-lg font-semibold">
                {error}
            </h2>

            <div className="flex gap-3">

                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 rounded bg-green-500 text-white"
                >
                    Reload Page
                </button>
            </div>
        </div>
    );
}