"use client";

import Link from "next/link";
import CustomerSignupModal from "./CustomerSignupModal";

export default function HomeNavbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5">
      <div className="flex justify-between items-center p-5 max-w-7xl mx-auto w-full">
        <div className="text-xl font-bold flex items-center gap-2 group cursor-pointer">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform" />
          <span className="tracking-tight">ShopPlatform</span>
        </div>

        <div className="hidden md:flex gap-6 items-center text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">
            Shops
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Categories
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Cities
          </a>
          <CustomerSignupModal />
          <Link
            href="/login"
            className="bg-white text-black px-6 py-2.5 rounded-full font-semibold hover:bg-gray-200 transition-all active:scale-95"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
