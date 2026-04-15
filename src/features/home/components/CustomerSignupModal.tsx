"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import CustomerSignupForm from "@/features/auth/components/CustomerSignupForm";

export default function CustomerSignupModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const modal = typeof document !== "undefined"
    ? createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="relative w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl md:p-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition"
            >
              <X size={18} />
            </button>
            <CustomerSignupForm onSuccess={() => setIsOpen(false)} />
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-500 text-black px-6 py-2.5 rounded-full font-semibold hover:bg-emerald-400 transition-all active:scale-95"
      >
        Sign as Customer
      </button>

      {isOpen ? modal : null}
    </>
  );
}
