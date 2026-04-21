"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { RestaurantRecord } from "@/features/restaurants/types";
import Image from "next/image";

export default function HeroSection() {
  const params = useParams();
  const slug = params.slug as string;

  const [restaurant, setRestaurant] = useState<RestaurantRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        setLoading(true);
        const response = await fetch(`/api/restaurants/slug/${slug}`);
        if (!response.ok) {
          setError(response.status === 404 ? "Restaurant not found" : "Failed to load restaurant details");
          return;
        }
        const data = await response.json();
        setRestaurant(data.restaurant);
        setError(null);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setError("Unable to load restaurant details");
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchRestaurant();
  }, [slug]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-30">
//         <div className="mx-auto max-w-4xl animate-pulse space-y-6">
//           <div className="h-12 rounded-lg bg-white/10" />
//           <div className="h-8 rounded-lg bg-white/10" />
//           <div className="h-64 rounded-lg bg-white/10" />
//         </div>
//       </div>
//     );
//   }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-20">
        {/* <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-6 text-center">
            <h1 className="text-2xl font-bold text-red-400">{error}</h1>
            <p className="mt-2 text-gray-300">The restaurant you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div> */}
      </div>
    );
  }

  const contact = restaurant.contactInfo;

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
//  card component
// function InfoCard({ label, value, color }: { label: string; value: string; color: string }) {
//   return (
//     <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
//       <p className="text-sm text-gray-400">{label}</p>
//       <p className={`mt-2 text-xl font-semibold ${color}`}>{value}</p>
//     </div>
//   );
// }