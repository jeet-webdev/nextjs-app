"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { RestaurantRecord } from "@/features/restaurants/types";
import Image from "next/image";

interface MainProps {
  restaurant: RestaurantRecord;
}

export default function RestaurantMainPage({ restaurant }: MainProps) {
  const params = useParams();
  const slug = params.slug as string;





 

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Header Badges */}
    
        <div>
        <h1 className="mb-4 text-4xl font-bold text-white flex items-center gap-4">
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