"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "react-toastify";

export type CategoryRecord = {
  id: string;
  name: string;
  isAvailable: boolean;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
};

type CategoryFormProps = {
  restaurantId: string;
  onSaved?: (category: CategoryRecord) => void;
};

type CategoryFormState = {
  name: string;
  isAvailable: boolean;
};

const EMPTY_CATEGORY_FORM: CategoryFormState = {
  name: "",
  isAvailable: true,
};

export default function CategoryForm({
  restaurantId,
  onSaved,
}: CategoryFormProps) {
  const [formData, setFormData] =
    useState<CategoryFormState>(EMPTY_CATEGORY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",

        body: JSON.stringify({
          restaurantId,
          name: formData.name.trim(),
          isAvailable: formData.isAvailable,

        }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        category?: CategoryRecord;
      } | null;

      if (!response.ok || !data?.category) {
        toast.error(data?.error ?? "Unable to create category.");
        return;
      }

      setFormData(EMPTY_CATEGORY_FORM);
      onSaved?.(data.category);
      toast.success("Category created successfully.");
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Unable to create category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">Create Category</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-white/10 bg-black/20 p-4 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <label className="ml-1 text-xs text-gray-400">Category Name</label>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-white outline-none focus:border-sky-500"
              placeholder="ex. Main Course"
              value={formData.name}
              onChange={(event) => {
                setFormData((current) => ({
                  ...current,
                  name: event.target.value,
                }));
              }}
            />
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 p-3">
            <input
              id="category-isAvailable"
              name="isAvailable"
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(event) => {
                setFormData((current) => ({
                  ...current,
                  isAvailable: event.target.checked,
                }));
              }}
              className="h-5 w-5 accent-sky-500"
            />
            <label
              htmlFor="category-isAvailable"
              className="text-sm text-white"
            >
              Category Available
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 p-3 font-semibold text-white transition-colors hover:bg-sky-700"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isSubmitting ? "Saving..." : "Save Category"}
        </button>
      </form>
    </div>
  );
}
