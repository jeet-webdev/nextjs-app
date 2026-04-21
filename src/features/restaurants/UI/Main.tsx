"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { RestaurantRecord } from "@/features/restaurants/types";
import Image from "next/image";

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
        console.error("Error fetching restaurant:", err);
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
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Header Badges */}
        {/* <div className="mt-10"> */}
        <div>
        <h1 className="mb-4 text-4xl font-bold text-white flex items-center gap-4">
 
  {/* <Image 
    src={restaurant.logo}
    height={48}
    width={48} 
    alt={`${restaurant.name} logo`} 
    className="h-12 w-12 object-contain" 
  /> */}
  {restaurant.name}
</h1>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-lg bg-sky-500/20 px-4 py-2 text-sm text-sky-200">
              Category: <span className="font-semibold">{restaurant.category}</span>
            </span>
            <span className="rounded-lg bg-purple-500/20 px-4 py-2 text-sm text-purple-200">
              Location: <span className="font-semibold">{restaurant.city}</span>
            </span>
            <span className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm text-emerald-200">
              Status: <span className="font-semibold">{restaurant.status ?? "OPEN"}</span>
            </span>
          </div>
        </div>

        {/* Basic Info */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <h2 className="mb-4 text-lg font-semibold text-white">Restaurant Info</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard label="Restaurant Name" value={restaurant.name} color="text-white" />
            <InfoCard label="Category" value={restaurant.category} color="text-sky-300" />
            <InfoCard label="City" value={restaurant.city} color="text-emerald-300" />
            <InfoCard label="Address" value={restaurant.address || "Not provided"} color="text-purple-300" />
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <h2 className="mb-4 text-lg font-semibold text-white">Contact & Hours</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard label="Phone" value={restaurant.contactInfo?.phone || "Not provided"} color="text-yellow-300" />
            <InfoCard label="Email" value={restaurant.contactInfo?.email || "Not provided"} color="text-pink-300" />
            <InfoCard label="Opening Hours" value={restaurant.contactInfo?.openingHours || "Not provided"} color="text-teal-300" />
            <InfoCard label="Closing Hours" value={restaurant.contactInfo?.closingHours || "Not provided"} color="text-orange-300" />
          </div>
        </div>

        {/* Meta Info */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <h2 className="mb-4 text-lg font-semibold text-white">Additional Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Slug</span>
              <span className="font-mono text-gray-200">{restaurant.slug}</span>
            </div>
            {restaurant.createdAt && (
              <div className="flex justify-between">
                <span className="text-gray-400">Created At</span>
                <span className="text-gray-200">{new Date(restaurant.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
//  card component
function InfoCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`mt-2 text-xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}