"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { RestaurantRecord } from "@/features/restaurants/types";
import { Mail, MapPin, Phone, PhoneCallIcon } from "lucide-react";

interface FooterProps {
  restaurant: RestaurantRecord;
}
export default function Footer({ restaurant }: FooterProps) {
  const params = useParams();
  const slug = params.slug as string;


  return (
       <footer className="bg-gradient-to-b from-black via-slate-900 to-black px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 space-y-6">
              <h3 className="text-3xl font-black text-gray-500">{restaurant.name}</h3>
             
              <div className="flex gap-4 pt-2">
                <div className="mt-6 flex column gap-4 items-end justify-end">
                      <a 
  href={`tel:${restaurant.contactInfo?.phone}`} 
  className="mt-6 flex items-center justify-end gap-3 text-sm text-gray-400 hover:text-gray-200 transition-colors"
>
  <PhoneCallIcon className="h-5 w-5" />
</a>
      <a 
  href={`mailto:${restaurant.contactInfo?.email}`} 
  className="mt-6 flex items-center justify-end gap-3 text-sm text-gray-400 hover:text-gray-200 transition-colors"
>
  <Mail className="h-5 w-5" />
</a>
      <a 
  href={`tel:${restaurant.contactInfo?.phone}`} 
  className="mt-6 flex items-center justify-end gap-3 text-sm text-gray-400 hover:text-gray-200 transition-colors"
>
  <PhoneCallIcon className="h-5 w-5" />
</a>
      <a 
  href={`mailto:${restaurant.contactInfo?.email}`} 
  className="mt-6 flex items-center justify-end gap-3 text-sm text-gray-400 hover:text-gray-200 transition-colors"
>
  <Mail className="h-5 w-5" />
</a>
              </div>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="uppercase text-[10px] font-black tracking-[0.3em] text-gray-500">Navigation</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#menu" className="hover:text-white transition">Menu</a></li>
                <li><a href="#gallery" className="hover:text-white transition">Gallery</a></li>
                <li><a href="#reviews" className="hover:text-white transition">Reviews</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="uppercase text-[10px] font-black tracking-[0.3em] text-gray-500">Opening Hours</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p className="flex justify-between border-b border-slate-900 pb-2">
                  <span>{restaurant.contactInfo?.openingHours}</span>
                </p>
              </div>
              <h4 className="uppercase text-[10px] font-black tracking-[0.3em] text-gray-500">Closing Hours</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p className="flex justify-between border-b border-slate-900 pb-2">
                  <span>{restaurant.contactInfo?.closingHours}</span>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="uppercase text-[10px] font-black tracking-[0.3em] text-gray-500">Find Us</h4>
              <div className="space-y-4">
                <p className="flex items-start gap-4 text-slate-300">
                  <MapPin size={18} className=" text-gray-400 shrink-0" />
                  <span className="text-sm italic leading-tight">{restaurant.address || "123 Culinary Ave, Food District"}</span>
                </p>
                <p className="flex items-center gap-4 text-slate-300">
                  <Phone size={18} className=" text-gray-400 shrink-0" />
                  <span className="text-sm font-bold">{restaurant.contactInfo?.phone || "+1 (555) 000-0000"}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
              © {new Date().getFullYear()} {restaurant.name}.
            </p>
            <div className="flex gap-8 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
  )
}

