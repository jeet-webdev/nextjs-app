"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { RestaurantRecord } from "@/features/restaurants/types";
import Image from "next/image";

import Main from "../../features/restaurants/UI/Main";
import RHeader from "../../features/restaurants/UI/RHeader";
import Footer from "@/features/restaurants/UI/Footer";
import HeroSection from "@/features/restaurants/UI/HeroSection";
import { toast } from "react-toastify";

export default function RestaurantDetailPage() {
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
        // toast.error("An error occurred while fetching restaurant details. Please try again later.");
        setError("Unable to load restaurant details");
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchRestaurant();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-30">
        <div className="mx-auto max-w-4xl animate-pulse space-y-6">
          <div className="h-12 rounded-lg bg-white/10" />
          <div className="h-8 rounded-lg bg-white/10" />
          <div className="h-64 rounded-lg bg-white/10" />
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-6 text-center">
            <h1 className="text-2xl font-bold text-red-400">{error}</h1>
            <p className="mt-2 text-gray-300">The restaurant you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
      </div>
    );
  }

   return (
    <>
      <RHeader restaurant={restaurant} />
      <HeroSection restaurant={restaurant} />
      <Main restaurant={restaurant} />
      <Footer restaurant={restaurant} />
    </>
  )


 
}