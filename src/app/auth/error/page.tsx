"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0E] px-4">
      <div className="w-full max-w-md bg-[#18181b] rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Authentication Error</h1>
        
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="text-red-400 font-medium mb-2">Error Details</div>
          <div className="text-red-300 text-sm">
            {error || "An unknown authentication error occurred"}
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-400 text-sm text-center">
            There was a problem signing you in. Please try again or contact support if the issue persists.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => window.location.href = "/auth/signin"}
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white rounded-lg py-2 font-semibold transition"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg py-2 font-semibold transition"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0E]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
} 