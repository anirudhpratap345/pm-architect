"use client";

export default function TestimonialsSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center px-6 py-16 bg-[#121212]">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center max-w-2xl mb-12">
        Loved by cross-functional teams
      </h2>
      <div className="flex flex-col md:flex-row gap-8 max-w-4xl w-full justify-center items-center">
        {/* Testimonial 1 */}
        <div className="bg-[#18181b] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg transition hover:scale-105 hover:shadow-2xl duration-200 w-full md:w-1/2">
          <img src="https://randomuser.me/api/portraits/men/45.jpg" className="w-14 h-14 rounded-full border-2 border-sky-500 mb-4" alt="User" />
          <p className="text-gray-200 text-lg mb-2">“I finally understand model tradeoffs.”</p>
          <span className="text-gray-400 text-sm">— Product Manager</span>
        </div>
        {/* Testimonial 2 */}
        <div className="bg-[#18181b] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg transition hover:scale-105 hover:shadow-2xl duration-200 w-full md:w-1/2">
          <img src="https://randomuser.me/api/portraits/women/46.jpg" className="w-14 h-14 rounded-full border-2 border-sky-500 mb-4" alt="User" />
          <p className="text-gray-200 text-lg mb-2">“Our PMs now speak the same language as our AI team.”</p>
          <span className="text-gray-400 text-sm">— Engineering Manager</span>
        </div>
      </div>
    </section>
  ); 
} 