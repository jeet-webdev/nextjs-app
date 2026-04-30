import React, { useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

import type { CategoryRecord } from "@/features/category/categoryForm";
import { type MenuRecord } from "@/features/menu/types/menuTypes";
import TextField from "@mui/material/TextField";
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


type MenuFormProps = {
  restaurantId: string;
  categories: CategoryRecord[];
  menuItem?: MenuRecord | null;
  onSaved?: (menuItem: MenuRecord) => void;
  onCancelEdit?: () => void;
};

type MenuFormState = {
  name: string;
  description: string;
  price: string;
  discountedPrice: string;
  categoryId: string;
  category: string;
  subCategory: string;
  image: string;
  isAvailable: boolean;
  preparationTime: string;
  ingredients: string;
};

const EMPTY_MENU_FORM: MenuFormState = {
  name: "",
  description: "",
  price: "",
  discountedPrice: "",
  categoryId: "",
  category: "",
  subCategory: "",
  image: "",
  isAvailable: true,
  preparationTime: "",
  ingredients: "",
};

function toFormState(menuItem?: MenuRecord | null): MenuFormState {
  if (!menuItem) {
    return EMPTY_MENU_FORM;
  }

  return {
    name: menuItem.name ?? "",
    description: menuItem.description ?? "",
    price: String(menuItem.price ?? ""),
    discountedPrice:
      menuItem.discountedPrice !== null &&
      menuItem.discountedPrice !== undefined
        ? String(menuItem.discountedPrice)
        : "",
    categoryId: menuItem.categoryId ?? "",
    category: menuItem.category ?? "",
    subCategory: menuItem.subCategory ?? "",
    image: menuItem.image ?? "",
    isAvailable: Boolean(menuItem.isAvailable),
    preparationTime: menuItem.preparationTime ?? "",
    ingredients: menuItem.ingredients ?? "",
  };
}

export default function MenuForm({
  restaurantId,
  categories,
  menuItem = null,
  onSaved,
  onCancelEdit,
}: MenuFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MenuFormState>(EMPTY_MENU_FORM);
  const isEditing = Boolean(menuItem);

  useEffect(() => {
    setFormData(toFormState(menuItem));
  }, [menuItem]);

  useEffect(() => {
    setFormData((current) => {
      const selectedCategory = categories.find(
        (category) => category.id === current.categoryId,
      );

      if (selectedCategory) {
        if (current.category === selectedCategory.name) {
          return current;
        }

        return {
          ...current,
          category: selectedCategory.name,
        };
      }

      if (categories.length === 0) {
        return {
          ...current,
          categoryId: "",
          category: "",
        };
      }

      return {
        ...current,
        categoryId: categories[0].id,
        category: categories[0].name,
      };
    });
  }, [categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      restaurantId,
      price: parseFloat(formData.price) || 0,
      discountedPrice: formData.discountedPrice
        ? parseFloat(formData.discountedPrice)
        : null,
      preparationTime: parseInt(formData.preparationTime) || 0,
      dietary: { isVegetarian: true, isSpicy: false },
    };

    try {
      const response = await fetch(
        isEditing ? `/api/menuitem/${menuItem?.id}` : "/api/menuitem",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        menuItem?: MenuRecord;
      } | null;

      if (!response.ok) {
        toast.error(
          data?.error ??
            `Unable to ${isEditing ? "update" : "create"} menu item.`,
        );
        return;
      }

      toast.success(
        isEditing
          ? "Menu item updated successfully!"
          : "Menu item created successfully!",
      );
      setFormData(EMPTY_MENU_FORM);
      onSaved?.(data?.menuItem as MenuRecord);
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast.error(`Unable to ${isEditing ? "update" : "create"} menu item.`);
    } finally {
      setLoading(false);
    }
  };
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [menuItemFormData, setMenuItemFormData] =
    useState<MenuFormState>(EMPTY_MENU_FORM);

  return (
    <div className="rounded-2xl bg-white/[0.03] p-6 border border-white/5">
      <div>
        <button
          type="button"
          onClick={() => {
            setShowMenuItemForm((v) => !v);
            setMenuItemFormData(EMPTY_MENU_FORM);
          }}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
            showMenuItemForm
              ? "border-white/10 bg-white/5 text-gray-400 hover:text-white"
              : "border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300"
          }`}
        >
          {showMenuItemForm ? (
            <>
              <X className="h-3 w-3" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" /> Add Item
            </>
          )}
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">
          {isEditing
            ? `Edit ${menuItem?.name ?? "Menu Item"}`
            : "Create Menu Item"}
        </h2>
        {isEditing && onCancelEdit ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:border-white/20 hover:text-white"
          >
            Cancel edit
          </button>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-white/10 rounded-lg p-4 bg-black/20">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 ml-1">Menu Name</label>
            <input
              name="name"
              required
              className="p-3 bg-black/40 border border-white/10 rounded-lg w-full text-white focus:border-sky-500 outline-none"
              placeholder="ex. Paneer Tikka"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <input type="hidden" name="restaurantId" value={restaurantId} />
          <div className="space-y-1">
            <label className="text-xs text-gray-400 ml-1">Category</label>
            <select
              name="categoryId"
              required
              className="p-3 bg-black/40 border border-white/10 rounded-lg w-full text-white"
              value={formData.categoryId}
              onChange={(event) => {
                const selectedCategory = categories.find(
                  (category) => category.id === event.target.value,
                );

                setFormData((current) => ({
                  ...current,
                  categoryId: event.target.value,
                  category: selectedCategory?.name ?? "",
                }));
              }}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
             <TextField
              id="standard-password-input"
              label="Price (USD)"
              name="price"
              type="number"
              required
              placeholder="299"
              value={formData.price}
              onChange={handleChange}
              variant="standard"
            />
            <TextField
              id="standard-password-input"
              label="name"
              name="name"
              type="text"
              required
              placeholder="Paneer Tikka"
              value={formData.name}
              onChange={handleChange}
              variant="standard"
            />
            <TextField
              id="standard-password-input"
              label="Description"
              name="description"
              type="text"
              required
              placeholder="Description ex. Grilled paneer with spices..."
              value={formData.description}
              onChange={handleChange}
              variant="standard"
            />
          </div>
           <FormControl component="fieldset">
     
      <FormGroup aria-label="position" row>
        <FormControlLabel
          value="end"
          control={<Checkbox />}
          label="Menu Available"
          labelPlacement="end"
          name="isAvailable"
          checked={formData.isAvailable}
          />
      </FormGroup>
    </FormControl>
       
        </div>
        <div className="mt-3 flex flex-row gap-5">
          <button
            type="submit"
            disabled={loading || categories.length === 0}
            className="w-full p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {!loading ? <Plus className="h-4 w-4" /> : null}
            {loading
              ? "Saving..."
              : isEditing
                ? "Update Menu Item"
                : "Save Menu Item"}
          </button>
        </div>
      </form>
    </div>
  );
}
