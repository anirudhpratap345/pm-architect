"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 min-h-[70vh] bg-gradient-to-b from-[#0B0B0E] to-[#121212]">
      {/* Subtle background illustration */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path fill="#38bdf8" fillOpacity="0.07" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
      </div>
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-2xl mx-auto text-white drop-shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      > 
        Bridge the AI Decision Gap Between PMs and Engineers
      </motion.h1>
      <motion.p
        className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        Empower PMs to confidently choose the right models, understand tradeoffs, and align with engineers — even under tight deadlines.
      </motion.p>
      <motion.div
        className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        <a
          href="/get-started"
          className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-8 py-4 font-semibold text-lg shadow-lg transition duration-200 min-w-[220px]"
        >
          Start using PMArchitect
        </a>
        <a
          href="/demo"
          className="border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white rounded-full px-8 py-4 font-semibold text-lg transition duration-200 min-w-[180px]"
        >
          Book a demo
        </a>
      </motion.div>
      {/* Avatars and trust text */}
      <div className="flex items-center gap-2 mt-12 justify-center">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-10 h-10 rounded-full border-2 border-sky-500" alt="Meta" />
        <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-10 h-10 rounded-full border-2 border-sky-500" alt="Google" />
        <img src="https://randomuser.me/api/portraits/men/65.jpg" className="w-10 h-10 rounded-full border-2 border-sky-500" alt="Startup" />
        <span className="ml-4 text-gray-400 text-sm">Trusted by product leaders at Meta, Google, and fast-growing startups.</span>
      </div>
    </section>
  );
} 