"use client";

export default function SolutionSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center px-6 py-16 bg-[#121212]">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center max-w-2xl mb-12">
        PMArchitect simplifies decisions — without dumbing them down.
      </h2>
      <div className="flex flex-col md:flex-row gap-12 max-w-6xl w-full items-center justify-center">
        {/* Visual Mockup Placeholder */}
        <div className="flex-1 flex items-center justify-center w-full md:w-auto">
          <div className="w-full h-64 md:w-80 md:h-80 bg-[#18181b] rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-700">
            <span className="text-gray-500 text-lg">[Product Mockup]</span>
          </div>
        </div> 
        {/* Benefits */}
        <div className="flex-1 grid grid-cols-1 gap-6">
          {/* Benefit 1 */}
          <div className="bg-[#18181b] rounded-2xl p-6 flex items-start gap-4 shadow-lg transition hover:scale-105 hover:shadow-2xl duration-200">
            <span className="text-2xl">🔄</span>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Model Comparisons</h3>
              <p className="text-gray-400 text-base">Compare LLMs, GNNs, CNNs based on speed, cost, performance.</p>
            </div>
          </div>
          {/* Benefit 2 */}
          <div className="bg-[#18181b] rounded-2xl p-6 flex items-start gap-4 shadow-lg transition hover:scale-105 hover:shadow-2xl duration-200">
            <span className="text-2xl">⚙️</span>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Infrastructure Insight</h3>
              <p className="text-gray-400 text-base">GPU/CPU cost breakdowns, latency predictions.</p>
            </div>
          </div>
          {/* Benefit 3 */}
          <div className="bg-[#18181b] rounded-2xl p-6 flex items-start gap-4 shadow-lg transition hover:scale-105 hover:shadow-2xl duration-200">
            <span className="text-2xl">🧠</span>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Humanized AI</h3>
              <p className="text-gray-400 text-base">Explanations in PM language, not research papers.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 