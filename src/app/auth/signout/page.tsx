"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/" });
  }, []);
  return <div className="min-h-screen flex items-center justify-center text-white bg-[#0B0B0E]">Signing out...</div>;
} 