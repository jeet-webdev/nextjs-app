import { ArrowRight } from "lucide-react";

export default function HomeHero() {
  return (
    <header className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-semibold mb-8 animate-fade-in">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
        </span>
        Multi-shop marketplace is live
      </div>

      <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.05] bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
        One Platform for <br />
        <span className="text-white">Every Shop.</span>
      </h1>
{/* // */}
      <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
        Discover trusted shops across categories, compare listings instantly,
        and manage your marketplace experience from one unified platform.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button className="w-full sm:w-auto bg-indigo-600 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 transition-all active:scale-95">
          Explore Shops <ArrowRight size={20} />
        </button>
        <button className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-gray-300 hover:bg-white/5 transition-colors">
          Open Dashboard
        </button>
      </div>
    </header>
  );
}
