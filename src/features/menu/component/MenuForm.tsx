import React, { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Soup, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

import type { CategoryRecord } from "@/features/category/categoryForm";
import { type MenuRecord } from "@/features/menu/types/menuTypes";

import Image from "next/image";

type MenuFormProps = {
  restaurantId: string;
  categories: CategoryRecord[];
  mealId?: string;
  categoryId?: string;
  menuItems?: MenuRecord[];
  onSaved?: (menuItem: MenuRecord) => void;
  onDeleted?: (id: string) => void;
  onCancelEdit?: () => void;
};

type MenuFormState = {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  image: string;
  isAvailable: boolean;
};

const EMPTY_MENU_FORM: MenuFormState = {
  name: "",
  description: "",
  price: "",

  categoryId: "",

  image: "",
  isAvailable: true,
};

function toFormState(menuItem?: MenuRecord | null): MenuFormState {
  if (!menuItem) {
    return EMPTY_MENU_FORM;
  }

  return {
    name: menuItem.name ?? "",
    description: menuItem.description ?? "",
    price: String(menuItem.price ?? ""),

    categoryId: menuItem.categoryId ?? "",

    image: menuItem.image ?? "",
    isAvailable: Boolean(menuItem.isAvailable),
  };
}

export default function MenuForm({
  restaurantId,
  mealId,
  categoryId: lockedCategoryId,
  categories,
  menuItems = [],
  onSaved,
  onDeleted,
  onCancelEdit,
}: MenuFormProps) {
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MenuFormState>(EMPTY_MENU_FORM);
  const [editingItem, setEditingItem] = useState<MenuRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const isEditing = Boolean(editingItem);

  useEffect(() => {
    if (lockedCategoryId) {
      setFormData((prev) => ({ ...prev, categoryId: lockedCategoryId }));
      setShowForm(true);
    } else if (categories.length > 0) {
      setFormData((prev) =>
        prev.categoryId ? prev : { ...prev, categoryId: categories[0].id },
      );
    }
  }, [lockedCategoryId, categories]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const startEdit = (item: MenuRecord) => {
    setEditingItem(item);
    setFormData(toFormState(item));
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setShowForm(false);
    setFormData(
      lockedCategoryId
        ? { ...EMPTY_MENU_FORM, categoryId: lockedCategoryId }
        : EMPTY_MENU_FORM,
    );
    if (!lockedCategoryId) setShowForm(false);
  };

  // editing part

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Item Name is required");
    if (!formData.categoryId) return toast.error("Category ID is required");

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0)
      return toast.error("Price must be a valid number");

    setLoading(true);

    //payload sending multiple data with putting [] but now it show error
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || "",
      price: price,
      categoryId: formData.categoryId,
      image: formData.image.trim() || "",
      isAvailable: formData.isAvailable,

      ...(isEditing ? {} : { restaurantId, mealId }),
    };

    try {
      const res = await fetch(
        isEditing ? `/api/menuitem/${editingItem!.id}` : "/api/menuitem",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        menuItem?: MenuRecord;
      } | null;

      if (!res.ok) {
        toast.error(
          data?.error ?? `unable to ${isEditing ? "update" : "create"} item`,
        );
        return;
      }

      toast.success(
        isEditing ? "Item updated successfully!" : "Item created successfully!",
      );
      onSaved?.(data!.menuItem as MenuRecord);
      cancelEdit();
    } catch {
      toast.error("Network error. please try again");
    } finally {
      setLoading(false);
    }
  };

  // delete part

  const handleDelete = async (item: MenuRecord) => {
    if (!confirm(`Are you sure you want to delete ${item.name}`)) return;
    setDeletingId(item.id);
    try {
      const res = await fetch(`/api/menuitem/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!res.ok) {
        toast.error(data?.error ?? "Unable to delete item");
        return;
      }
      toast.success(`${item.name} deleted successfully!`);
      onDeleted?.(item.id);
    } catch {
      toast.error("Network error. please try again");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* get the existing item  */}
      {menuItems.length >= 1 && (
        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            <Soup className="h-4 w-4 inline mr-2" /> Menu Items
          </h3>
          {menuItems.map((item) => (
            <div
              key={`${item.id}`} //{item.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5"
            >
              {item.image && (
                <Image
                  height={20}
                  width={15}
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-400">
                  ${item.price}{" "}
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                      item.isAvailable
                        ? "bg-green-500/10 text-green-400"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                  className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition disabled:opacity-40"
                >
                  {deletingId === item.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* show or hide form */}
      {!showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300 px-3 py-1.5 text-xs font-semibold transition"
        >
          <Plus className="h-3 w-3" /> Add Item
        </button>
      )}

      {/* ── crud */}
      {showForm && (
        <div className="rounded-2xl bg-white/[0.03] p-6 border border-white/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {isEditing ? `Edit: ${editingItem?.name}` : "Add Menu Item"}
            </h2>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:text-white transition"
            >
              <X className="h-3.5 w-3.5 inline mr-1" />
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Name *</label>
                <input
                  name="name"
                  // required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Paneer Tikka"
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-sky-500 outline-none text-sm"
                />
              </div>

              {/* Price */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Price *</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                   // required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="299.00"
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-sky-500 outline-none text-sm"
                />
              </div>

              {/* Category */}
              <div className=" hidden hiddenspace-y-1">
                <label className="text-xs text-gray-400">Category *</label>
                {lockedCategoryId ? (
                  <div className="w-full p-3 bg-black/20 border border-white/5 rounded-lg text-gray-500 text-sm flex items-center gap-2">
                    <span className="text-sky-400 text-xs">●</span>
                    Pre-selected from category
                    <input
                      type="hidden"
                      name="categoryId"
                      value={lockedCategoryId}
                    />
                  </div>
                ) : (
                  <select
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-sky-500 outline-none text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Image */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Image URL</label>
                <input
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-sky-500 outline-none text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Short description..."
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-sky-500 outline-none text-sm resize-none"
                />
              </div>

              {/* isAvailable */}
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="w-4 h-4 rounded accent-sky-500"
                  />
                  <span className="text-sm text-gray-300">
                    Available for ordering
                  </span>
                </label>
              </div>
            </div>
            <div className="flex flex-row justify-end gap-5 pace-y-2">
              <button className=" p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition flex justify-center items-center gap-2 disabled:opacity-50">
                <Plus className="h-4 w-4" />
                Add More
              </button>
              <button className=" p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition flex justify-center items-center gap-2 disabled:opacity-50">
                <Plus className="h-4 w-4" />
                5 Items
              </button>
              <button className="p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition flex justify-center items-center gap-2 disabled:opacity-50">
                <Plus className="h-4 w-4" />
                10 Items
              </button>
            </div>
            <button
              type="submit"
              disabled={
                loading || (!lockedCategoryId && categories.length === 0)
              }
              className="w-full p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {loading ? "Saving..." : isEditing ? "Update Item" : "Save Item"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
