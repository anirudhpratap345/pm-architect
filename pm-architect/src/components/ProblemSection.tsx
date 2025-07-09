"use client";

export default function ProblemSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center px-6 py-16 bg-[#111]">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center max-w-2xl mb-12">
        Why is AI architecture decision-making broken for PMs?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {/* Card 1 */}
        <div className="bg-[#18181b] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg transition hover:scale-105 hover:shadow-2xl duration-200">
          <div className="text-3xl mb-3">❌</div>
          <h3 className="text-lg font-semibold text-white mb-2">Engineers speak in jargon</h3>
          <p className="text-gray-400 text-base">CNNs, FLOPs, attention heads...</p>
        </div>
        {/* Card 2 */}
        <div className="bg-[#18181b] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg transition hover:scale-105 hover:shadow-2xl duration-200">
          <div className="text-3xl mb-3">❌</div>
          <h3 className="text-lg font-semibold text-white mb-2">Docs are dense or missing</h3>
          <p className="text-gray-400 text-base">Slack is chaos.</p>
        </div> 
        {/* Card 3 */}
        <div className="bg-[#18181b] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg transition hover:scale-105 hover:shadow-2xl duration-200">
          <div className="text-3xl mb-3">❌</div>
          <h3 className="text-lg font-semibold text-white mb-2">PMs are left out</h3>
          <p className="text-gray-400 text-base">of critical decisions they're responsible for.</p>
        </div>
      </div>
    </section>
  );
} 