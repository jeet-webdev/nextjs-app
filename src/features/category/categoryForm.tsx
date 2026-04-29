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
  Tag,
  FolderOpen,
} from "lucide-react";
import { toast } from "react-toastify";

export type CategoryRecord = {
  id: string;
  name: string;
  isAvailable: boolean;
  restaurantId: string;
  mealId: string;
  createdAt: string;
  updatedAt: string;
};

type CategoryFormProps = {
  restaurantId: string;
  mealId: string;
};

type CategoryFormState = { name: string; isAvailable: boolean };
const EMPTY: CategoryFormState = { name: "", isAvailable: true };

export default function CategoryForm({ restaurantId, mealId }: CategoryFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CategoryFormState>(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CategoryFormState>(EMPTY);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    if (!restaurantId || !mealId) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/category?restaurantId=${encodeURIComponent(restaurantId)}&mealId=${encodeURIComponent(mealId)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) setCategories(data.categories ?? []);
      else toast.error(data.error ?? "Failed to load categories.");
    } catch {
      toast.error("Network error fetching categories.");
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, mealId]);

  useEffect(() => { void fetchCategories(); }, [fetchCategories]);

  // ── Create ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = formData.name.trim();
    if (!name) { toast.error("Category name is required."); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ restaurantId, mealId, name, isAvailable: formData.isAvailable }),
      });
      const data = await res.json();
      if (!res.ok || !data?.category) {
        toast.error(data?.error ?? "Unable to create category.");
        return;
      }
      setCategories((prev) => [data.category, ...prev]);
      setFormData(EMPTY);
      setShowForm(false);
      setOpenIds((prev) => ({ ...prev, [data.category.id]: true }));
      toast.success("Category created.");
    } catch {
      toast.error("Unable to create category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const startEdit = (cat: CategoryRecord) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, isAvailable: cat.isAvailable });
    setOpenIds((prev) => ({ ...prev, [cat.id]: true }));
  };
  const cancelEdit = () => { setEditingId(null); setEditForm(EMPTY); };

  const saveEdit = async (cat: CategoryRecord) => {
    const name = editForm.name.trim();
    if (!name) { toast.error("Category name is required."); return; }

    setIsSavingEdit(true);
    try {
      const res = await fetch(`/api/category/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, isAvailable: editForm.isAvailable }),
      });
      const data = await res.json();
      if (!res.ok || !data?.category) {
        toast.error(data?.error ?? "Unable to update category.");
        return;
      }
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? data.category : c)));
      cancelEdit();
      toast.success("Category updated.");
    } catch {
      toast.error("Unable to update category.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (cat: CategoryRecord) => {
    if (!confirm(`Delete "${cat.name}"? This will also remove its menu items.`)) return;
    setDeletingId(cat.id);
    try {
      const res = await fetch(`/api/category/${cat.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data?.error ?? "Unable to delete category."); return; }
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      toast.success("Category deleted.");
    } catch {
      toast.error("Unable to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleOpen = (id: string) =>
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="mt-3 space-y-3">
      {/* ── Header row: label + Add button ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-widest">
          <FolderOpen className="h-3 w-3" />
          Categories
          {categories.length > 0 && (
            <span className="ml-1 rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-500">
              {categories.length}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => { setShowForm((v) => !v); setFormData(EMPTY); }}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
            showForm
              ? "border-white/10 bg-white/5 text-gray-400 hover:text-white"
              : "border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300"
          }`}
        >
          {showForm ? (
            <><X className="h-3 w-3" /> Cancel</>
          ) : (
            <><Plus className="h-3 w-3" /> Add Category</>
          )}
        </button>
      </div>

      {/* ── Collapsible add form ── */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-sky-500/15 bg-sky-500/5 p-3 space-y-2.5"
        >
          <input
            required
            autoFocus
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-600 focus:border-sky-500 transition-colors"
            placeholder="e.g. Starters, Mains, Desserts"
            value={formData.name}
            onChange={(e) => setFormData((c) => ({ ...c, name: e.target.value }))}
          />

          <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs select-none">
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) => setFormData((c) => ({ ...c, isAvailable: e.target.checked }))}
              className="h-3.5 w-3.5 accent-sky-500"
            />
            <span className="text-gray-400">Available to customers</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-sky-600 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-700 disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
            {isSubmitting ? "Saving..." : "Save Category"}
          </button>
        </form>
      )}

      {/* ── List ── */}
      {isLoading ? (
        <div className="flex justify-center py-3">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-500" />
        </div>
      ) : categories.length === 0 ? (
        <p className="py-2 text-center text-xs text-gray-700">
          No categories yet.
        </p>
      ) : (
        <div className="space-y-1">
          {categories.map((cat) => {
            const isOpen = !!openIds[cat.id];
            const isEditing = editingId === cat.id;
            const isDeleting = deletingId === cat.id;

            return (
              <div
                key={cat.id}
                className="overflow-hidden rounded-lg border border-white/[0.05] bg-white/[0.02]"
              >
                {/* Row header */}
                <button
                  type="button"
                  onClick={() => toggleOpen(cat.id)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="h-2.5 w-2.5 text-sky-600" />
                    <span className="text-xs font-medium text-gray-300">{cat.name}</span>
                    <span className={`rounded-full px-1.5 py-px text-[9px] font-semibold tracking-wide ${
                      cat.isAvailable
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-gray-500/10 text-gray-600"
                    }`}>
                      {cat.isAvailable ? "ON" : "OFF"}
                    </span>
                  </div>
                  <ChevronDown className={`h-3 w-3 text-gray-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Row body */}
                {isOpen && (
                  <div className="border-t border-white/[0.03] px-3 py-2.5">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          autoFocus
                          className="w-full rounded-md border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs text-white outline-none focus:border-sky-500 transition-colors"
                          value={editForm.name}
                          onChange={(e) => setEditForm((c) => ({ ...c, name: e.target.value }))}
                        />
                        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-xs select-none">
                          <input
                            type="checkbox"
                            checked={editForm.isAvailable}
                            onChange={(e) => setEditForm((c) => ({ ...c, isAvailable: e.target.checked }))}
                            className="h-3 w-3 accent-sky-500"
                          />
                          <span className="text-gray-400">Available to customers</span>
                        </label>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => saveEdit(cat)}
                            disabled={isSavingEdit}
                            className="flex flex-1 items-center justify-center gap-1 rounded-md bg-sky-600 py-1.5 text-[11px] font-semibold text-white disabled:opacity-60"
                          >
                            {isSavingEdit ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Check className="h-2.5 w-2.5" />}
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={isSavingEdit}
                            className="flex items-center gap-1 rounded-md border border-white/10 px-3 py-1.5 text-[11px] text-gray-500 hover:text-gray-300 disabled:opacity-60"
                          >
                            <X className="h-2.5 w-2.5" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] text-gray-700">{cat.id}</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(cat)}
                            className="flex items-center gap-1 rounded-md border border-white/[0.07] px-2 py-1 text-[11px] text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300"
                          >
                            <Pencil className="h-2.5 w-2.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cat)}
                            disabled={isDeleting}
                            className="flex items-center gap-1 rounded-md border border-rose-500/10 px-2 py-1 text-[11px] text-rose-500/70 transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-60"
                          >
                            {isDeleting ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Trash2 className="h-2.5 w-2.5" />}
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
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