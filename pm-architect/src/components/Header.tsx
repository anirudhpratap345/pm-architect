"use client";
import Link from "next/link";

export default function Header() {
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
          <Link href="#product" className="text-gray-300 hover:text-white transition">Product</Link>
          <Link href="#use-cases" className="text-gray-300 hover:text-white transition">Use Cases</Link>
          <Link href="#blog" className="text-gray-300 hover:text-white transition">Blog</Link>
          <Link href="#contact" className="text-gray-300 hover:text-white transition">Contact</Link>
        </div> 
        {/* CTA Buttons */}
        <div className="flex gap-3">
          <Link href="/get-started" className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-6 py-2 font-semibold transition">Get Started</Link>
          <Link href="/demo" className="border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white rounded-full px-6 py-2 font-semibold transition">Book a Demo</Link>
        </div>
      </nav>
    </header>
  );
} 