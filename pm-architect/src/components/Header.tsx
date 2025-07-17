"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-50 w-full bg-black/70 border-b border-gray-800 backdrop-blur-md shadow-lg">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-2xl tracking-tight text-white">PM</span>
          <span className="hidden sm:inline text-gray-300 font-semibold text-lg">Architect.ai</span>
        </div>
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#product" className="text-gray-300 hover:text-white transition">Product</a>
          <a href="#use-cases" className="text-gray-300 hover:text-white transition">Use Cases</a>
          <a href="#blog" className="text-gray-300 hover:text-white transition">Blog</a>
          <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
        </div> 
        {/* CTA Buttons & Auth */}
        <div className="flex gap-3 items-center">
          <a href="/get-started" className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-6 py-2 font-semibold transition">Get Started</a>
          <a href="/demo" className="border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white rounded-full px-6 py-2 font-semibold transition">Book a Demo</a>
          {/* Auth */}
          {session ? (
            <div className="flex items-center gap-2 ml-4">
              {session.user?.image && (
                <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full border-2 border-sky-500" />
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-gray-300 hover:text-white text-sm px-3 py-1 rounded transition border border-gray-700 ml-2"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="text-gray-300 hover:text-white text-sm px-3 py-1 rounded transition border border-gray-700 ml-2"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>
    </header>
  );
} 