"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Menu } from "lucide-react";
import { toast } from "react-toastify";

import type { RestaurantRecord } from "@/features/restaurants/types";
import type { MenuRecord } from "@/features/menu/types/menuTypes";
import MyMenu from "@/features/menu/component/myMenu";
import MealForm, { type MealRecord } from "@/features/meal/mealForm";

type RestaurantMenuPageProps = {
  restaurant: RestaurantRecord;
  onBack: () => void;
};

export default function RestaurantMenuPage({
  restaurant,
  onBack,
}: RestaurantMenuPageProps) {
  const [restaurantDetails, setRestaurantDetails] =
    useState<RestaurantRecord | null>(restaurant);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuRecord | null>(null);


  useEffect(() => {
    setRestaurantDetails(restaurant);
  }, [restaurant]);

  useEffect(() => {
    async function loadRestaurant() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/restaurants/slug/${restaurant.slug}`);

        if (!response.ok) {
          setError(
            response.status === 404
              ? "Restaurant not found."
              : "Failed to load restaurant.",
          );
          return;
        }

        const data = await response.json();
        setRestaurantDetails(data.restaurant);
        setError(null);
      } catch {
        setError("Failed to load restaurant.");
      } finally {
        setIsLoading(false);
      }
    }

    if (restaurant.slug) {
      void loadRestaurant();
    } else {
      setIsLoading(false);
    }
  }, [restaurant.slug]);

  const handleEditMenuItem = (menuItem: MenuRecord) => setEditingMenuItem(menuItem);
  const handleCancelEdit = () => setEditingMenuItem(null);
  const handleMenuSaved = () => {
    setEditingMenuItem(null);
    setRefreshKey((k) => k + 1);
  };

  const handleDeleteMenuItem = async (id: string) => {
    const response = await fetch(`/api/menuitem/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      toast.error(data?.error ?? "Failed to delete menu item.");
      return;
    }

    toast.success("Menu item deleted.");
    if (editingMenuItem?.id === id) setEditingMenuItem(null);
    setRefreshKey((k) => k + 1);
  };

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

  if (error || !restaurantDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-24 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/20 bg-red-950/20 p-8 text-center">
          <h1 className="text-2xl font-semibold text-red-300">
            {error ?? "Restaurant not found."}
          </h1>
          <button
            type="button"
            onClick={onBack}
            className="mt-6 inline-flex items-center gap-2 text-sm text-red-200 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-2 text-white">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Restaurant header */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
                Restaurant Menu
              </p>
              <h1 className="mt-2 text-3xl font-semibold">
                {restaurantDetails.name}
              </h1>
              <p className="mt-2 text-sm text-gray-400">{restaurantDetails.city}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-2 text-sm text-sky-200">
              <Menu className="h-4 w-4" />
              All Menu items for {restaurantDetails.name}
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to restaurants
        </button>

     
        <section className="rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
          <h2 className="mb-6 text-xl font-semibold text-white">
            Menu
            <span className="ml-2 text-sm font-normal text-gray-500">
              — All your menu here
            </span>
          </h2>
          <MealForm restaurantId={restaurantDetails.id} />
        </section>

           

      </div>
    </div>
  );
}