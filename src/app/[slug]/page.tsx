"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { ShopRecord } from "@/features/shops/types";

export default function ShopDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [shop, setShop] = useState<ShopRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShop() {
      try {
        setLoading(true);
        const response = await fetch(`/api/shops/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Shop not found");
          } else {
            setError("Failed to load shop details");
          }
          return;
        }

        const data = await response.json();
        setShop(data.shop);
        setError(null);
      } catch (err) {
        console.error("Error fetching shop:", err);
        setError("Unable to load shop details");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchShop();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-12 rounded-lg bg-white/10"></div>
            <div className="h-8 rounded-lg bg-white/10"></div>
            <div className="h-64 rounded-lg bg-white/10"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-6 text-center">
            <h1 className="text-2xl font-bold text-red-400">{error}</h1>
            <p className="mt-2 text-gray-300">The shop you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-white">{shop.name}</h1>
          <div className="flex flex-wrap gap-4">
            <div className="rounded-lg bg-sky-500/20 px-4 py-2">
              <p className="text-sm text-sky-200">Category: <span className="font-semibold">{shop.category}</span></p>
            </div>
            <div className="rounded-lg bg-emerald-500/20 px-4 py-2">
              <p className="text-sm text-emerald-200">Rating: <span className="font-semibold">{shop.rating}</span></p>
            </div>
            <div className="rounded-lg bg-purple-500/20 px-4 py-2">
              <p className="text-sm text-purple-200">Location: <span className="font-semibold">{shop.city}</span></p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur">
          <div className="space-y-6">
            {/* Shop Info Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <p className="text-sm text-gray-400">Shop Name</p>
                <p className="mt-2 text-xl font-semibold text-white">{shop.name}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <p className="text-sm text-gray-400">Category</p>
                <p className="mt-2 text-xl font-semibold text-sky-300">{shop.category}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <p className="text-sm text-gray-400">Location</p>
                <p className="mt-2 text-xl font-semibold text-emerald-300">{shop.city}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <p className="text-sm text-gray-400">Rating</p>
                <p className="mt-2 text-xl font-semibold text-purple-300">{shop.rating}</p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="border-t border-white/10 pt-6">
              <h2 className="text-lg font-semibold text-white mb-4">Additional Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  {/* <span className="text-gray-400">Shop ID</span>
                  <span className="text-gray-200 font-mono">{shop.id}</span> */}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Slug</span>
                  <span className="text-gray-200 font-mono">{shop.slug}</span>
                </div>
                {shop.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Created At</span>
                    <span className="text-gray-200">
                      {new Date(shop.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
