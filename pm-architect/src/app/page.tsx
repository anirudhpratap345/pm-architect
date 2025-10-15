"use client";
import Header from "@/components/Header";
import HomeHero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import ExampleComparison from "@/components/home/ExampleComparison";
import AgentFlow from "@/components/home/AgentFlow";
import IntelligentInsights from "@/components/home/IntelligentInsights";
import ValidationSection from "@/components/home/ValidationSection";
import FinalCTA from "@/components/home/FinalCTA";
import HomeFooter from "@/components/home/Footer";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0B0E] font-sans text-white">
      <Header />
      <main>
        <HomeHero />
        <HowItWorks />
        <ExampleComparison />
        <AgentFlow />
        <IntelligentInsights />
        <ValidationSection />
        <FinalCTA />
      </main>
      <HomeFooter />
    </div>
  );
}
