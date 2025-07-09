"use client";

export default function UseCasesSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center px-6 py-16 bg-[#111]">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center max-w-2xl mb-12">
        Built for your AI workflow
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {/* Product Managers */}
        <div className="bg-[#18181b] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg transition hover:scale-105 hover:shadow-2xl duration-200">
          <div className="text-3xl mb-3">🧑‍💼</div>
          <h3 className="text-lg font-semibold text-white mb-2">Product Managers</h3>
          <p className="text-gray-400 text-base">Make architecture calls without code</p>
        </div>
        {/* TPMs */}
        <div className="bg-[#18181b] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg transition hover:scale-105 hover:shadow-2xl duration-200">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-lg font-semibold text-white mb-2">TPMs</h3>
          <p className="text-gray-400 text-base">Track in-flight decisions and model progress</p>
        </div> 
        {/* Engineering Managers */}
        <div className="bg-[#18181b] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg transition hover:scale-105 hover:shadow-2xl duration-200">
          <div className="text-3xl mb-3">🛠️</div>
          <h3 className="text-lg font-semibold text-white mb-2">Engineering Managers</h3>
          <p className="text-gray-400 text-base">Benchmark infra choices at a glance</p>
        </div>
      </div>
    </section>
  );
} 