"use client";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const params = useSearchParams();
  const error = params.get("error");
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0E] px-4">
      <div className="w-full max-w-md bg-[#18181b] rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
        <p className="text-red-500 mb-4">{error || "An unknown error occurred."}</p>
        <a href="/auth/signin" className="text-sky-500 hover:underline">Back to sign in</a>
      </div>
    </div>
  );
} 