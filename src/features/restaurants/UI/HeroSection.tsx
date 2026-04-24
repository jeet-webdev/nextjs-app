"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { RestaurantRecord } from "@/features/restaurants/types";
import Image from "next/image";
 
interface HeroSectionProps {
  restaurant: RestaurantRecord;
}

export default function HeroSection({ restaurant }: HeroSectionProps) {
  const params = useParams();
  const slug = params.slug as string;
  return (
 <div className="max-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-12">
  <div className="mx-auto max-w-4xl space-y-6">
    <div className="relative h-64 rounded-lg overflow-hidden">
      {restaurant.content?.heroImageUrl ? (
        <Image
          src={restaurant.content.heroImageUrl}
          alt={`${restaurant.name} Hero Image`}
          fill
          priority 
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 896px" 
        />
      ) : (
        <div className="h-full w-full bg-white/5 flex items-center justify-center">
          <span className="text-gray-400">No hero image available</span>
        </div>
      )}
      
      {/* Overlay Content */}
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white">
          {restaurant.content?.heroTitle}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          {restaurant.content?.heroDescription}
        </p>
      </div>
    </div>
  </div>
   </div>
    
  );
}