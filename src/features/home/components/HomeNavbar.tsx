"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, UtensilsCrossed, LayoutGrid, MapPin, LogIn } from "lucide-react";
import CustomerSignupModal from "./CustomerSignupModal";
import logo from "@/app/icons8-food-bubbles-96.png";

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5">
      <div className="flex justify-between items-center px-5 py-4 max-w-7xl mx-auto w-full">
        <Link
          href="/"
          className="text-xl font-bold flex items-center gap-2 group cursor-pointer"
        >
          <Image
            src={logo}
            alt="RestaurantPlatform logo"
            width={100}
            height={100}
            className="w-15 h-15 shadow-indigo-500/20 group-hover:scale-110 transition-transform"
          />
          <span className="tracking-tight">RestaurantPlatform</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center text-sm font-medium text-gray-400">
          <a href="#restaurants" className="hover:text-white transition-colors">
            Restaurants
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

        {/* Hamburger Button (mobile only) */}
        <button
          className="md:hidden p-2 rounded-xl border border-white/10 hover:bg-white/5 transition text-gray-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          {/* backdrop */}
          <div
            className="md:hidden fixed inset-0 top-[73px] bg-black/60 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="md:hidden flex flex-col items-center justify-center relative z-50 mx-4 mb-4 rounded-2xl border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Header strip */}
            {/* <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src={logo} alt="logo" width={28} height={28} className="rounded-lg" />
                <span className="text-sm font-bold text-white">RestaurantPlatform</span>
              </div> 
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div> */}

            {/* Nav Links */}
            <div className="px-3 py-3 flex flex-col gap-1">
              <a
                href="#restaurants"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
              >
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition">
                  <UtensilsCrossed size={15} />
                </span>
                Restaurants
              </a>
              <a
                href="#"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
              >
                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition">
                  <LayoutGrid size={15} />
                </span>
                Categories
              </a>
              <a
                href="#"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
              >
                <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20 transition">
                  <MapPin size={15} />
                </span>
                Cities
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="px-4 pb-4 pt-1 flex flex-col gap-3">
              <div>
                <CustomerSignupModal />
              </div>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all active:scale-95 text-sm"
              >
                <LogIn size={16} />
                Login
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
