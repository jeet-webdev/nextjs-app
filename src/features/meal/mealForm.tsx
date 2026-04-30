"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  ChevronDown,
  Pencil,
  Trash2,
  Check,
  X,
  UtensilsCrossed,
  ChefHat,
} from "lucide-react";
import { toast } from "react-toastify";
import CategoryForm from "@/features/category/categoryForm"; // adjust path if needed

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

type MealFormState = { name: string; isAvailable: boolean };
const EMPTY: MealFormState = { name: "", isAvailable: true };

export default function MealForm({ restaurantId, onSaved }: MealFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<MealFormState>(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);

  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<MealFormState>(EMPTY);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchMeals = useCallback(async () => {
    if (!restaurantId) return;
    setIsLoadingMeals(true);
    try {
      const res = await fetch(
        `/api/meal?restaurantId=${encodeURIComponent(restaurantId)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) setMeals(data.meals ?? []);
      else toast.error(data.error ?? "Failed to load meals.");
    } catch {
      toast.error("Network error while fetching meals.");
    } finally {
      setIsLoadingMeals(false);
    }
  }, [restaurantId]);

  useEffect(() => { void fetchMeals(); }, [fetchMeals]);

  // ── Create ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = formData.name.trim();
    if (!name) { toast.error("Meal name is required."); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ restaurantId, name, isAvailable: formData.isAvailable }),
      });
      const data = await res.json();
      if (!res.ok || !data?.meal) {
        toast.error(data?.error ?? "Unable to create meal.");
        return;
      }
      setMeals((prev) => [data.meal, ...prev]);
      setFormData(EMPTY);
      setShowForm(false);
      setOpenIds((prev) => ({ ...prev, [data.meal.id]: true }));
      onSaved?.(data.meal);
      toast.success("Menu created successfully."); {/*  meal */}
    } catch {
      toast.error("Unable to create menu.");  {/*  meal */}
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Edit ───────────────────────────────────────────────────────────────────
  const startEdit = (meal: MealRecord) => {
    setEditingId(meal.id);
    setEditForm({ name: meal.name, isAvailable: meal.isAvailable });
    setOpenIds((prev) => ({ ...prev, [meal.id]: true }));
  };
  const cancelEdit = () => { setEditingId(null); setEditForm(EMPTY); };

  const saveEdit = async (meal: MealRecord) => {
    const name = editForm.name.trim();
    if (!name) { toast.error("Meal name is required."); return; }

    setIsSavingEdit(true);
    try {
      const res = await fetch(`/api/meal/${meal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, isAvailable: editForm.isAvailable }),
      });
      const data = await res.json();
      if (!res.ok || !data?.meal) {
        toast.error(data?.error ?? "Unable to update meal.");
        return;
      }
      setMeals((prev) => prev.map((m) => (m.id === meal.id ? data.meal : m)));
      cancelEdit();
      toast.success("Menu updated."); {/*  meal */}
    } catch {
      toast.error("Unable to update menu.");  {/*  meal */}
    } finally {
      setIsSavingEdit(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (meal: MealRecord) => {
    if (!confirm(`Delete "${meal.name}"? This will also remove its categories and menu items.`)) return;
    setDeletingId(meal.id);
    try {
      const res = await fetch(`/api/meal/${meal.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data?.error ?? "Unable to delete menu."); return; }
      setMeals((prev) => prev.filter((m) => m.id !== meal.id));
      toast.success("Menu deleted."); {/*  meal */}
    } catch {
      toast.error("Unable to delete menu.");  {/*  meal */}
    } finally {
      setDeletingId(null);
    }
  };

  const toggleOpen = (id: string) =>
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-4">
      {/* ── Section header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="h-4 w-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
            Menu
          </h2>
          {meals.length > 0 && (
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-500">
              {meals.length}
            </span>
          )}
        </div>

        {/* menu/meal create form button */}
        <button
          type="button"
          onClick={() => { setShowForm((v) => !v); setFormData(EMPTY); }}
          className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all duration-150 ${
            showForm
              ? "border-white/10 bg-white/5 text-gray-400 hover:text-white"
              : "border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300"
          }`}
        >
          {showForm ? (
            <><X className="h-3.5 w-3.5" /> Cancel</>
          ) : (
            <><Plus className="h-3.5 w-3.5" /> New Menu</>
          )}
        </button>
      </div>

      {/* ── close menu/meal create form ── */}
      {showForm && (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
         <h3 className="mb-4 text-sm font-semibold text-white">Create Menu</h3>  {/*  meal */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="ml-0.5 text-[11px] text-gray-500">Menu Name</label> {/*  meal */}
              <input
                required
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-sky-500 transition-colors"
                placeholder="e.g. Main Course, Beverages, Desserts"
                value={formData.name}
                onChange={(e) => setFormData((c) => ({ ...c, name: e.target.value }))}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 select-none">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData((c) => ({ ...c, isAvailable: e.target.checked }))}
                className="h-4 w-4 accent-sky-500"
              />
              <span className="text-sm text-gray-300">Available to customers</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {isSubmitting ? "Saving..." : "Create Menu"}  {/*  meal */}
            </button>
          </form>
        </div>
      )}

      {/* ── Meals list ── */}
      {isLoadingMeals ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-sky-500" />
        </div>
      ) : meals.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/5 py-12 text-gray-600">
          <UtensilsCrossed className="h-7 w-7 opacity-30" />
          <p className="text-sm">No menu — click New Menu to add one.</p>  {/*  meal */}
        </div>
      ) : (
        <div className="space-y-2">
          {meals.map((meal) => {
            const isOpen = !!openIds[meal.id];
            const isEditing = editingId === meal.id;
            const isDeleting = deletingId === meal.id;

            return (
              <div
                key={meal.id}
                className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all"
              >
                {/* Accordion header */}
                <button
                  type="button"
                  onClick={() => toggleOpen(meal.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-white">{meal.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
                      meal.isAvailable
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-gray-500/10 text-gray-600"
                    }`}>
                      {meal.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div className="border-t border-white/[0.04] px-5 pb-5 pt-4">
                    {isEditing ? (
                      /* ── Edit meal form ── */
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="ml-0.5 text-[11px] text-gray-500">Menu Name</label>  {/*  meal */}
                          <input
                            autoFocus
                            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-500 transition-colors"
                            value={editForm.name}
                            onChange={(e) => setEditForm((c) => ({ ...c, name: e.target.value }))}
                          />
                        </div>

                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 select-none">
                          <input
                            type="checkbox"
                            checked={editForm.isAvailable}
                            onChange={(e) => setEditForm((c) => ({ ...c, isAvailable: e.target.checked }))}
                            className="h-4 w-4 accent-sky-500"
                          />
                          <span className="text-sm text-gray-300">Available to customers</span>
                        </label>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => saveEdit(meal)}
                            disabled={isSavingEdit}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
                          >
                            {isSavingEdit ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={isSavingEdit}
                            className="flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-500 hover:text-gray-300 disabled:opacity-60"
                          >
                            <X className="h-3.5 w-3.5" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── View mode ── */
                      <div className="space-y-1">
                        {/* Meal action buttons */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(meal)}
                            className="flex items-center gap-1.5 rounded-xl border border-white/[0.07] px-4 py-2 text-xs font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                          >
                          <Pencil className="h-3 w-3" /> Edit Menu        {/* meal */}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(meal)}
                            disabled={isDeleting}
                            className="flex items-center gap-1.5 rounded-xl border border-rose-500/10 px-4 py-2 text-xs font-medium text-rose-500/60 transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-60"
                          >
                            {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                            Delete
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ── Categories always visible inside accordion ── */}
                    <div className="mt-4 border-t border-white/[0.04] pt-4">
                      <CategoryForm restaurantId={restaurantId} mealId={meal.id} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
