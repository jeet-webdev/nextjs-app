import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomeHero() {
  return (
    <header className="relative mx-auto max-w-7xl gap-14 px-6 pb-24 pt-24  lg:items-center">
      <div className="text-center ">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-indigo-400 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
          </span>
          Multi-shop marketplace is live
        </div>

        <h1 className="mb-8 text-5xl font-black leading-[1.02] tracking-tighter text-transparent bg-gradient-to-b from-white to-gray-500 bg-clip-text md:text-7xl xl:text-8xl">
          One Platform for
          <br />
          <span className="text-white">Every Shop.</span>
        </h1>
<p className="mx-auto text-center mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
  Discover trusted shops across categories, compare listings instantly, and create
  your customer account directly from the home page when you are new here.
</p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center ">
          <a
            href="#shops"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-bold transition-all hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 active:scale-95 sm:w-auto"
          >
            Explore Shops <ArrowRight size={20} />
          </a>
          <Link
            href="/login"
            className="w-full rounded-2xl px-8 py-4 text-center font-bold text-gray-300 transition-colors hover:bg-white/5 sm:w-auto"
          >
            Open Dashboard
          </Link>
        </div>
      </div>

    </header>
  );
}
