"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Menu } from "lucide-react";
import { getStoredUserRole } from "@/shared/lib/auth-storage";
import MyMenu from "@/features/menu/component/myMenu";
import type { RestaurantRecord } from "@/features/restaurants/types";

export default function RestaurantMenuPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [restaurant, setRestaurant] = useState<RestaurantRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const [dashboardPath, setDashboardPath] = useState("/dashboard");

useEffect(() => {
  const role = getStoredUserRole();
  if (role === "ADMIN") {
    setDashboardPath("/dashboard/admin");
  } else if (role === "OWNER") {
    setDashboardPath("/dashboard/owner");
  }
}, []);


  useEffect(() => {
    async function loadRestaurant() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/restaurants/slug/${slug}`);

        if (!response.ok) {
          setError(response.status === 404 ? "Restaurant not found." : "Failed to load restaurant menu.");
          return;
        }

        const data = await response.json();
        setRestaurant(data.restaurant);
        setError(null);
      } catch {
        setError("Failed to load restaurant menu.");
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      void loadRestaurant();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-24 text-white">
        <div className="mx-auto max-w-5xl animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-white/10" />
          <div className="h-12 w-64 rounded bg-white/10" />
          <div className="h-40 rounded-3xl bg-white/10" />
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-24 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/20 bg-red-950/20 p-8 text-center">
          <h1 className="text-2xl font-semibold text-red-300">{error ?? "Restaurant not found."}</h1>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-sm text-red-200 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-24 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        
        <Link
          // href={`/${restaurant.slug}`}
          // href={`/dashboard/admin` || `/dashboard/owner`}
          href={dashboardPath}
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {restaurant.name}
        </Link>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Restaurant Menu</p>
              <h1 className="mt-2 text-3xl font-semibold">{restaurant.name}</h1>
              <p className="mt-2 text-sm text-gray-400">
                {restaurant.category} in {restaurant.city}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-2 text-sm text-sky-200">
            <Link href={dashboardPath} className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
           All MEnu items for {restaurant.name} restaurant
            </Link>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
          <MyMenu restaurantId={restaurant.id} menuItems={restaurant.menuItems} />
        </section>
      </div>
    </div>
  );
}