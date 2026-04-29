"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Ban, Menu } from "lucide-react";
import { toast } from "react-toastify";

import CategoryForm, {
  type CategoryRecord,
} from "@/features/category/categoryForm";
import MyMenu from "@/features/menu/component/myMenu";
import type { MenuRecord } from "@/features/menu/types/menuTypes";
import type { RestaurantRecord } from "@/features/restaurants/types";
import MenuForm from "@/features/menu/component/MenuForm";

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
  const [editingMenuItem, setEditingMenuItem] = useState<MenuRecord | null>(
    null,
  );
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryFormHide, setCategoryFormHide] = useState(true);

  const handelCategoryForm = () => {
    setCategoryFormHide(false);
  };

  useEffect(() => {
    setRestaurantDetails(restaurant);
  }, [restaurant]);

  const refreshMenuItems = () => {
    setRefreshKey((current) => current + 1);
  };

  const handleEditMenuItem = (menuItem: MenuRecord) => {
    setEditingMenuItem(menuItem);
  };

  const handleCancelEdit = () => {
    setEditingMenuItem(null);
  };

  const handleMenuSaved = () => {
    setEditingMenuItem(null);
    refreshMenuItems();
  };

  const handleCategorySaved = (category: CategoryRecord) => {
    setCategories((current) => {
      const next = [
        ...current.filter((item) => item.id !== category.id),
        category,
      ];
      return next.sort((left, right) => left.name.localeCompare(right.name));
    });
  };

  const handleDeleteMenuItem = async (id: string) => {
    const response = await fetch(`/api/menu/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      toast.error(data?.error ?? "Failed to delete menu item.");
      return;
    }

    toast.success("Menu item deleted.");

    if (editingMenuItem?.id === id) {
      setEditingMenuItem(null);
    }

    refreshMenuItems();
  };

  useEffect(() => {
    async function loadRestaurant() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/restaurants/slug/${restaurant.slug}`,
        );

        if (!response.ok) {
          setError(
            response.status === 404
              ? "Restaurant not found."
              : "Failed to load restaurant menu.",
          );
          return;
        }

        const data = await response.json();
        setRestaurantDetails(data.restaurant);
        setError(null);
      } catch {
        setError("Failed to load restaurant menu.");
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

  useEffect(() => {
    async function loadCategories() {
      if (!restaurantDetails?.id) {
        setCategories([]);
        setIsLoadingCategories(false);
        return;
      }

      try {
        setIsLoadingCategories(true);
        const response = await fetch(
          `/api/category?restaurantId=${encodeURIComponent(restaurantDetails.id)}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          toast.error(data?.error ?? "Failed to load categories.");
          setCategories([]);
          return;
        }

        const data = (await response.json()) as { category?: CategoryRecord[] };
        setCategories(Array.isArray(data.category) ? data.category : []);
      } catch {
        toast.error("Failed to load categories.");
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    }

    void loadCategories();
  }, [restaurantDetails?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-24 text-white">
        <div className="mx-auto min-w-5xl animate-pulse space-y-4">
          {" "}
         
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
      <div className="mx-auto min-w-5xl space-y-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
                Restaurant Menu
              </p>
              <h1 className="mt-2 text-3xl font-semibold">
                {restaurantDetails.name}
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                {restaurantDetails.city}
              </p>
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
        <section className="rounded-3xl mb-8 border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
          <div className="space-y-6">
            {categoryFormHide ? (
              <button
                type="button"
                onClick={() => setCategoryFormHide(false)}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition"
              >
                + Add New Category
              </button>
            ) : (
              <div className="relative p-4 border border-white/10 rounded-2xl bg-white/5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Add Category</h3>
                  <button
                    onClick={() => setCategoryFormHide(true)}
                    className="text-gray-400 hover:text-white hover:bg-green text-sm"
                  >
                  <Ban></Ban> Cancel
                  </button>
                </div>

                <CategoryForm
                  restaurantId={restaurantDetails.id}
                  onSaved={(category) => {
                    handleCategorySaved(category);
                    setCategoryFormHide(true);
                  }}
                />
              </div>
            )}

            {isLoadingCategories ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-300">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                Create at least one category first. The menu form will appear
                after that.
              </div>
            ) : (
              <MenuForm
                restaurantId={restaurantDetails.id}
                categories={categories}
                menuItem={editingMenuItem}
                onSaved={handleMenuSaved}
                onCancelEdit={handleCancelEdit}
              />
            )}
          </div>
          <MyMenu
            restaurantId={restaurantDetails.id}
            menuItems={restaurantDetails.menuItems ?? []}
            canManage
            refreshKey={refreshKey}
            onEdit={handleEditMenuItem}
            onDelete={handleDeleteMenuItem}
          />
        </section>
      </div>
    </div>
  );
}
