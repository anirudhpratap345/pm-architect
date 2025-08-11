"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Notifications from "./Notifications";

export default function Header() {
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/70 border-b border-gray-800 backdrop-blur-md shadow-lg">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-extrabold text-2xl tracking-tight text-white">PM</span>
            <span className="hidden sm:inline text-gray-300 font-semibold text-lg">Architect.ai</span>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {session ? (
            // Authenticated user navigation
            <>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
              <Link href="/teams" className="text-gray-300 hover:text-white transition">Teams</Link>
              <Link href="/templates" className="text-gray-300 hover:text-white transition">Templates</Link>
              <Link href="/decision/new" className="text-gray-300 hover:text-white transition">New Decision</Link>
              <Link href="/profile" className="text-gray-300 hover:text-white transition">Profile</Link>
            </>
          ) : (
            // Public navigation
            <>
              <a href="#product" className="text-gray-300 hover:text-white transition">Product</a>
              <a href="#use-cases" className="text-gray-300 hover:text-white transition">Use Cases</a>
              <a href="#blog" className="text-gray-300 hover:text-white transition">Blog</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
            </>
          )}
        </div>

        {/* CTA Buttons & Auth */}
        <div className="flex gap-3 items-center">
          {!session && (
            <>
              <a href="/get-started" className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-6 py-2 font-semibold transition">Get Started</a>
              <a href="/demo" className="border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white transition">Book a Demo</a>
            </>
          )}

          {/* Auth */}
          {session ? (
            <div className="flex items-center gap-2 ml-4 relative">
              <Notifications />
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition"
                >
                  {session.user?.image ? (
                    <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full border-2 border-sky-500" />
                  ) : (
                    <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                    </div>
                  )}
                  <span className="hidden sm:inline text-sm">{session.user?.name || session.user?.email}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/teams"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Teams
                    </Link>
                    <Link
                      href="/templates"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Templates
                    </Link>
                    <Link
                      href="/decision/new"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      New Decision
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
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

      {/* Mobile Menu Overlay */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
} 