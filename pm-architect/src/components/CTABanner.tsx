"use client";

export default function CTABanner() {
  return (
    <section className="w-full flex flex-col items-center justify-center px-6 py-16 bg-[#18181b]">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center max-w-2xl mb-6">
        Make your next technology decision with confidence
      </h2>
      <a
        href="/get-started"
        className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-8 py-4 font-semibold text-lg shadow-lg transition duration-200 min-w-[220px] mb-4 mt-2"
      >
        → Try PMArchitect.ai
      </a>
      <p className="text-gray-400 text-base mt-2">Free to explore. No credit card required.</p>
    </section>
  );
}  