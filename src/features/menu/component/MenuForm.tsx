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

/// 1
interface MenuItemDisplay {
  id: string;
  name: string;
  price: string;
  description: string | null;
  image: string | null;
}
///

const EMPTY_MENU_FORM: MenuFormState = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  image: "",
  isAvailable: true,
};


function toFormState(menuItem?: MenuRecord | null): MenuFormState {
  if (!menuItem) return EMPTY_MENU_FORM;
  return {
    name: menuItem.name ?? "",
    description: menuItem.description ?? "",
    price: String(menuItem.price ?? ""),
    categoryId: menuItem.categoryId ?? "",
    image: menuItem.image ?? "",
    isAvailable: Boolean(menuItem.isAvailable),
  };
}

function emptyRow(categoryId: string): MenuFormState {
  return { ...EMPTY_MENU_FORM, categoryId };
}

export default function MenuForm({
  restaurantId,
  mealId,
  categoryId,
  categoryId: lockedCategoryId,
  categories,
  menuItems = [],
  onSaved,
  onDeleted,
  onCancelEdit,
}: MenuFormProps) {
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
/// 2
 const [showItems, setShowItems] = useState<MenuItemDisplay[]>([]);
 ///

  const [rows, setRows] = useState<MenuFormState[]>([EMPTY_MENU_FORM]);
  const [editingItem, setEditingItem] = useState<MenuRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const isEditing = Boolean(editingItem);

  const defaultCategoryId =
    lockedCategoryId ?? (categories.length > 0 ? categories[0].id : "");

/// 3
 useEffect(() => {
  const fetchItems = async () => {
    
    if (!restaurantId) return;

    setLoading(true); 
    try {

      const params = new URLSearchParams();
      if (restaurantId) params.append("restaurantId", restaurantId);
      if (mealId) params.append("mealId", mealId);
      if (categoryId) params.append("categoryId", categoryId);
      params.append("public", "true"); 

      const url = `/api/menuitem?${params.toString()}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.menuItems) {
        setShowItems(data.menuItems);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchItems();
}, [restaurantId, mealId, categoryId]); 
///





  useEffect(() => {
    if (lockedCategoryId) {
      setRows((prev) =>
        prev.map((r) => ({ ...r, categoryId: lockedCategoryId }))
      );
      setShowForm(true);
    } else if (categories.length > 0) {
      setRows((prev) =>
        prev.map((r) => (r.categoryId ? r : { ...r, categoryId: categories[0].id }))
      );
    }
  }, [lockedCategoryId, categories]);

 
  const handleRowChange = (
    rowIndex: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setRows((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              [name]:
                type === "checkbox"
                  ? (e.target as HTMLInputElement).checked
                  : value,
            }
          : row
      )
    );
  };

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const openForm = (count: number = 1) => {
    setEditingItem(null);
    setRows(Array.from({ length: count }, () => emptyRow(defaultCategoryId)));
    setShowForm(true);
  };

  const startEdit = (item: MenuRecord) => {
    setEditingItem(item);
    setRows([toFormState(item)]);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setShowForm(false);
    setRows([emptyRow(defaultCategoryId)]);
    onCancelEdit?.();
  };

 
  const validateRows = (): boolean => {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.name.trim()) {
        toast.error(`Row ${i + 1}: Item name is required`);
        return false;
      }
      if (!row.categoryId) {
        toast.error(`Row ${i + 1}: Category is required`);
        return false;
      }
      const price = parseFloat(row.price);
      if (isNaN(price) || price < 0) {
        toast.error(`Row ${i + 1}: Price must be a valid number`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRows()) return;

    setLoading(true);

    try {
      if (isEditing) {
      
        const row = rows[0];
        const payload = {
          name: row.name.trim(),
          description: row.description.trim() || "",
          price: parseFloat(row.price),
          categoryId: row.categoryId,
          image: row.image.trim() || "",
          isAvailable: row.isAvailable,
        };

        const res = await fetch(`/api/menuitem/${editingItem!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = (await res.json().catch(() => null)) as {
          error?: string;
          menuItem?: MenuRecord;
        } | null;

        if (!res.ok) {
          toast.error(data?.error ?? "Unable to update item");
          return;
        }
        toast.success("Item updated successfully!");
        onSaved?.(data!.menuItem as MenuRecord);
        cancelEdit();
      } else {
        
        const payload = rows.map((row) => ({
          name: row.name.trim(),
          description: row.description.trim() || "",
          price: parseFloat(row.price),
          categoryId: row.categoryId,
          image: row.image.trim() || "",
          isAvailable: row.isAvailable,
          restaurantId,
          mealId,
        }));

        const res = await fetch("/api/menuitem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload), 
        });

        const data = (await res.json().catch(() => null)) as {
          error?: string;
          menuItems?: MenuRecord[];
          menuItem?: MenuRecord; 
        } | null;

        if (!res.ok) {
          toast.error(data?.error ?? "Unable to create items");
          return;
        }

        toast.success(
          payload.length > 1
            ? `${payload.length} items created successfully!`
            : "Item created successfully!"
        );

       
        const saved = data?.menuItems ?? (data?.menuItem ? [data.menuItem] : []);
        saved.forEach((item) => onSaved?.(item));
        cancelEdit();
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: MenuRecord) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;
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
      toast.success(`"${item.name}" deleted successfully!`);
      onDeleted?.(item.id);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing menu items list */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {showItems.length > 0 ? (
        showItems.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
            <span className="text-sky-600 font-semibold">${item.price}</span>
          </div>
        ))
      ) : (
        <p>No items found for this category.</p>
      )}
    </div> */}
      {/* {menuItems.length > 0 && ( */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            <Soup className="h-4 w-4 inline mr-2" /> Menu Items
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {showItems.length > 0 ? (
        showItems.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
            <span className="text-sky-600 font-semibold">${item.price}</span>
          </div>
        ))
      ) : (
        <p>No items found for this category.</p>
      )}
    </div>
          {menuItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5"
            >
              {item.image && (
                <Image
                  height={40}
                  width={40}
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
      {/* // )} */}

  
      
      

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl bg-white/[0.03] p-6 border border-white/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {isEditing
                ? `Edit: ${editingItem?.name}`
                : rows.length > 1
                ? `Add ${rows.length} Menu Items`
                : "Add Menu Item"}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="relative rounded-xl border border-white/10 p-4 bg-black/20 space-y-4"
              >
                {/* Row header */}
                {rows.length > 1 && (
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-sky-400 font-semibold">
                      Item {rowIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRow(rowIndex)}
                      className="p-1 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                      title="Remove this row"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Name *</label>
                    <input
                      name="name"
                      required
                      value={row.name}
                      onChange={(e) => handleRowChange(rowIndex, e)}
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
                      required
                      value={row.price}
                      onChange={(e) => handleRowChange(rowIndex, e)}
                      placeholder="299.00"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-sky-500 outline-none text-sm"
                    />
                  </div>

                
                  <div className={lockedCategoryId ? "hidden" : "space-y-1"}>
                    <label className="text-xs text-gray-400">Category *</label>
                    <select
                      name="categoryId"
                      required={!lockedCategoryId}
                      value={row.categoryId}
                      onChange={(e) => handleRowChange(rowIndex, e)}
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-sky-500 outline-none text-sm"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Image */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Image URL</label>
                    <input
                      name="image"
                      type="url"
                      value={row.image}
                      onChange={(e) => handleRowChange(rowIndex, e)}
                      placeholder="https://..."
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-sky-500 outline-none text-sm"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs text-gray-400">Description</label>
                    <textarea
                      name="description"
                      value={row.description}
                      onChange={(e) => handleRowChange(rowIndex, e)}
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
                        checked={row.isAvailable}
                        onChange={(e) => handleRowChange(rowIndex, e)}
                        className="w-4 h-4 rounded accent-sky-500"
                      />
                      <span className="text-sm text-gray-300">
                        Available for ordering
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}

    <div className="flex flex-row gap-5 justify-center">     
            {!isEditing && (
              <button
                type="button"
                onClick={() =>
                  setRows((prev) => [...prev, emptyRow(defaultCategoryId)])
                }
                className="flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300 px-3 py-1.5 text-xs font-semibold transition"
           >
                <Plus className="h-3 w-3" /> Add Another Row
              </button>              
            )}
            
     
     
          <button
            type="button"
            onClick={() => openForm(5)}
            className="flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300 px-3 py-1.5 text-xs font-semibold transition"
          >
            <Plus className="h-3 w-3" /> 5 Items
          </button>
          <button
            type="button"
            onClick={() => openForm(10)}
            className="flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300 px-3 py-1.5 text-xs font-semibold transition"
          >
            <Plus className="h-3 w-3" /> 10 Items
          </button>


</div>
            {/* Submit */}
            <button
              type="submit"
              disabled={loading || (!lockedCategoryId && categories.length === 0)}
              className="w-full p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Item"
                : rows.length > 1
                ? `Save ${rows.length} Items`
                : "Save Item"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

