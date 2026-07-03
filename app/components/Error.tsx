import React, { useState } from 'react';

type ErrorProps = {
  error: string;
  errorDescription?: string; 
};

const Error = ({ error, errorDescription }: ErrorProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-200/80 text-center dark:bg-neutral-900 dark:border-neutral-800">
        
        {/* Soft White/Light Gray Icon Wrapper */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 mb-6 dark:bg-neutral-800 dark:text-neutral-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-neutral-900 mb-2 tracking-tight dark:text-neutral-100">
          Something went wrong
        </h2>
        
        {/* User-friendly Error Message */}
        <p className="text-neutral-500 text-sm mb-8 leading-relaxed dark:text-neutral-400">
          {error || "An unexpected error occurred. Please try again or contact support if the issue persists."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 justify-center mb-6">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-sm bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 transition-colors dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-800"
          >
            Go to Homepage
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-sm bg-neutral-900 hover:bg-neutral-800 text-white transition-colors dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-950"
          >
            Reload Page
          </button>
        </div>

        {/* Collapsible Technical Details */}
        {errorDescription && (
          <div className="border-t border-neutral-100 pt-4 text-left dark:border-neutral-800">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs font-medium text-neutral-400 hover:text-neutral-600 flex items-center gap-1 mx-auto transition-colors dark:hover:text-neutral-300"
            >
              {showDetails ? 'Hide' : 'Show'} technical details
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            
            {showDetails && (
              <pre className="mt-4 p-3.5 bg-neutral-50 text-neutral-600 rounded-xl text-[11px] font-mono overflow-x-auto border border-neutral-150 dark:bg-neutral-950 dark:text-neutral-400 dark:border-neutral-800/60">
                {errorDescription}
              </pre>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Error;