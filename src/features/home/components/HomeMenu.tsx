"use client";

import { useEffect, useState } from "react";
import { type MenuRecord } from "@/features/menu/types/menuTypes";
import MenuGrid from "@/features/menu/component/MenuGrid";

export default function HomeMenu() {
  const [menuItem, setMenuItem] = useState<MenuRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMenuItem = async () => {
      try {
        const response = await fetch("/api/menuitem?public=true");
        if (!response.ok) return;

        const data = await response.json();
      

   
        const items = data.menuItems || []; 
        setMenuItem(items);
      } catch (error) {
      
      } finally {
        setIsLoading(false);
      }
    };

    void loadMenuItem();
  }, []);

  return (
    <section id="restaurants" className="mx-auto w-full max-w-7xl px-6 pb-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">Marketplace</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
            Multiple Menu, One Platform
          </h2>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-200">
      
          Live Menu: <span className="font-semibold text-white">{menuItem?.length || 0}</span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Active Menu</p>
          <p className="mt-1 text-2xl font-black text-white">{menuItem?.length || 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Total Menu</p>
          <p className="mt-1 text-2xl font-black text-white">{menuItem?.length || 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Top Menu</p>
            <p className="mt-1 text-2xl font-black text-white">{menuItem?.[Math.floor(Math.random() * menuItem.length)]?.name || "Pizza"}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Top Category</p>
          <p className="mt-1 text-2xl font-black text-white">{menuItem?.[Math.floor(Math.random() * menuItem.length)]?.category || "Pizza"}</p>
        </div>
      </div>

      <MenuGrid 
        menuItems={menuItem} 
        emptyMessage={isLoading ? "Loading menu items..." : "No menu published yet."} 
      />
    </section>
  );
}
