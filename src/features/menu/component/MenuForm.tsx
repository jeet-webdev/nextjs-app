import React, { useState } from "react";
import { RestaurantFormState } from "@/features/restaurants/types";
import { Delete, Edit2, Plus, VenetianMaskIcon, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

type MenuFormProps = {
  restaurantId: string; 
  onDelete?: (id: string) => void;
  onEdit?: (menuItem: RestaurantFormState) => void;
};

export default function MenuForm({ restaurantId, onDelete }: MenuFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
    category: "",
    subCategory: "",
    image: "",
    isAvailable: true,
    preparationTime: "",
    ingredients: "",
  });

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
      // restaurantId: restaurantId,
      // subCategory: formData.subCategory,
      // discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : undefined,
      preparationTime: parseInt(formData.preparationTime) || 0,
    
      dietary: { isVegetarian: true, isSpicy: false }, 
    };

    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Menu item created successfully!");
        // setFormData()    //hit api when new menu created to fetch new menu items and update the menu grid      
      }
    } catch (error) {
      console.error("Error saving menu item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white/[0.03] p-6 border border-white/5">
      <h2 className="text-lg font-semibold mb-4 text-white">Create Menu Item</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-white/10 rounded-lg p-4 bg-black/20">
          
          <div className="space-y-1">
            <label className="text-xs text-gray-400 ml-1">Item Name</label>
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
            <label className="text-xs text-gray-400 ml-1">Price (INR)</label>
            <input
              name="price"
              type="number"
              required
              className="p-3 bg-black/40 border border-white/10 rounded-lg w-full text-white"
              placeholder="299"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
           
            <input
              name="discountedPrice"
              type="number"
              className="p-3 bg-black/40 border border-white/10 rounded-lg w-full text-white"
              placeholder="299"
              value={formData.discountedPrice}
              onChange={handleChange}
            />
      

         
            {/* <div className="sm:col-span-2 space-y-1">
            <label className="text-xs text-gray-400 ml-1">Subcategory</label>
            <input
              name="Subcategory"
              className="p-3 bg-black/40 border border-white/10 rounded-lg w-full text-white"
              placeholder="subCategory "
              value={formData.subCategory}
              onChange={handleChange}
            />
          </div> */}

  <div className="sm:col-span-2 space-y-1">
            <label className="text-xs text-gray-400 ml-1">Description</label>
            <input
              name="description"
              className="p-3 bg-black/40 border border-white/10 rounded-lg w-full text-white"
              placeholder="Description ex. Grilled paneer with spices..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <input
            name="category"
            className="p-3 bg-black/40 border border-white/10 rounded-lg w-full text-white"
            placeholder="Category (ex. Main Course)"
            value={formData.category}
            onChange={handleChange}
          />
          <input
            name="subCategory"
            className="p-3 bg-black/40 border border-white/10 rounded-lg w-full text-white"
            placeholder="Sub Category (ex. Vegetarian)"
            value={formData.subCategory}
            onChange={handleChange}
          />

          <input
            name="image"
            className="p-3 bg-black/40 border border-white/10 rounded-lg w-full text-white"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
          />

          <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/10 rounded-lg">
            <input
              id="isAvailable"
              name="isAvailable"
              type="checkbox"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="h-5 w-5 accent-sky-500"
            />
            <label htmlFor="isAvailable" className="text-sm text-white">Item Available</label>
          </div>
        </div>
<div className="flex flex-row gap-5 mt-3">
 <Edit2 className="h-10 w-10 text-yellow-400 bg-yellow-500/10 rounded-2xl p-2 hover:text-yellow-900 flex justify-end" />
  <VenetianMaskIcon className="h-10 w-10 text-blue-400 bg-blue-500/10 rounded-2xl p-2 hover:text-blue-900 flex justify-end" />
   <Delete className="h-10 w-10 text-red-400 bg-red-500/10 rounded-2xl p-2 hover:text-red-900 flex justify-end" />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors flex justify-center items-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Saving..." : "Save Menu Item"}
        </button>
</div>
 
      </form>
    </div>
  );
}