"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "react-toastify";

export type MealRecord = {
  id: string;
  name: string;
  isAvailable: boolean;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
};

type MealFormProps = {
  restaurantId: string;
  onSaved?: (meal: MealRecord) => void;
};

type MealFormState = {
  name: string;
  isAvailable: boolean;
};

const EMPTY_MEAL_FORM: MealFormState = {
  name: "",
  isAvailable: true,
};

export default function MealForm({ restaurantId, onSaved }: MealFormProps) {
  const [formData, setFormData] = useState<MealFormState>(EMPTY_MEAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);

  const fetchMeals = useCallback(async () => {
    if (!restaurantId) return;
    setIsLoadingMeals(true);
    try {
      const response = await fetch(
        `/api/meal?restaurantId=${encodeURIComponent(restaurantId)}`,
        { method: "GET", credentials: "include" }
      );
      const data = await response.json();
      if (response.ok) {
        setMeals(data.meals ?? []);
      } else {
        toast.error(data.error ?? "Failed to load meals.");
      }
    } catch {
      toast.error("Network error while fetching meals.");
    } finally {
      setIsLoadingMeals(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    void fetchMeals();
  }, [fetchMeals]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Meal name is required.");
      return;
    }

  
    console.log("Submitting meal with:", {
      restaurantId,
      name: formData.name.trim(),
      isAvailable: formData.isAvailable,
    });

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          restaurantId,
          name: formData.name.trim(),
          isAvailable: formData.isAvailable,
        }),
      });

    
      const data = await response.json();
      console.log("STATUS:", response.status);
      console.log("RESPONSE DATA:", data);

      if (!response.ok || !data?.meal) {
        toast.error(data?.error ?? "Unable to create meal.");
        return;
      }

      setMeals((current) => [data.meal, ...current]);
      setFormData(EMPTY_MEAL_FORM);
      onSaved?.(data.meal);
      toast.success("Meal created successfully.");
    } catch (err) {
      console.error("CATCH ERROR:", err);
      toast.error("Unable to create meal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">Create Meal</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 rounded-lg border border-white/10 bg-black/20 p-4 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <label className="ml-1 text-xs text-gray-400">Meal Name</label>
              <input
                name="name"
                required
                className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-white outline-none focus:border-sky-500"
                placeholder="ex. Main Course"
                value={formData.name}
                onChange={(e) =>
                  setFormData((cur) => ({ ...cur, name: e.target.value }))
                }
              />
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 p-3">
              <input
                id="meal-isAvailable"
                name="isAvailable"
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) =>
                  setFormData((cur) => ({
                    ...cur,
                    isAvailable: e.target.checked,
                  }))
                }
                className="h-5 w-5 accent-sky-500"
              />
              <label htmlFor="meal-isAvailable" className="text-sm text-white">
                Meal Available
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 p-3 font-semibold text-white transition-colors hover:bg-sky-700 disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {isSubmitting ? "Saving..." : "Save Meal"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <h3 className="text-md mb-4 font-semibold text-white">Existing Meals</h3>

        {isLoadingMeals ? (
          <div className="flex justify-center p-4">
            <Loader2 className="animate-spin text-sky-500" />
          </div>
        ) : meals.length === 0 ? (
          <p className="text-sm text-gray-500">No meals created yet.</p>
        ) : (
          <div className="space-y-2">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between rounded-lg bg-black/20 p-3"
              >
                <span className="text-white">{meal.name}</span>
                <span
                  className={`text-xs font-medium ${
                    meal.isAvailable ? "text-sky-400" : "text-gray-500"
                  }`}
                >
                  {meal.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}