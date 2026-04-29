"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import RestaurantGrid from "@/features/restaurants/components/RestaurantGrid";
import { type RestaurantRecord } from "@/features/restaurants/types";
import { clearStoredUserRole } from "@/shared/lib/auth-storage";

export default function CustomerDashboardPage() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantRecord[]>([]);
  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const response = await fetch("/api/users/count", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          router.push("/login");
          router.refresh();
          return;
        }

        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          setError(data.error ?? "Unable to load user count1.");
          return;
        }

        const data = (await response.json()) as { totalUsers: number };
        setTotalUsers(data.totalUsers);
      } catch {
        // setError("Unable to load user count2.");
      }
    };

    void loadCounts();
  }, [router]);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const response = await fetch("/api/restaurants", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          router.push("/login");
          router.refresh();
          return;
        }

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { restaurants: RestaurantRecord[] };
        setRestaurants(data.restaurants);
      } catch {
        // Keep the page visible even when restaurants are unavailable.
      }
    };

    void loadRestaurants();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      clearStoredUserRole();
      router.push("/");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06131f] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.22),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(14,116,144,0.24),transparent_34%),linear-gradient(180deg,#06131f_0%,#071a27_100%)]" />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="mb-10 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-xl border border-white/20 bg-white/5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Customer Space</p>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">Discover Restaurants</h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-300">
            Explore curated restaurants and view live community size.
          </p>

        

          {error && <p className="mt-4 text-xs sm:text-sm text-red-400">{error}</p>}
        </header>

        <RestaurantGrid
          restaurants={restaurants}
          emptyMessage="No restaurants published yet."
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        />
      </main>
    </div>
  );
}
