"use client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0B0E] font-sans text-white">
      <Header />
      <main>
        <Hero />
        <div className="py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">PMArchitect.ai</h2>
          <p className="text-xl text-gray-400 mb-8">
            AI-driven decision intelligence platform for modern product and engineering teams
          </p>
          <div className="space-y-4">
            <p className="text-lg text-gray-300">
              • Create and track architectural decisions
            </p>
            <p className="text-lg text-gray-300">
              • Compare model options and tradeoffs
            </p>
            <p className="text-lg text-gray-300">
              • Collaborate with your team
            </p>
            <p className="text-lg text-gray-300">
              • Make informed technical choices
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
