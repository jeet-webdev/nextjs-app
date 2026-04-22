import { type RestaurantFormState } from "@/features/restaurants/types";
import { RestaurantStatus } from "@prisma/client";
import { useState } from "react";
type RestaurantsFormProps = {
  onSubmit: (e: React.FormEvent) => void;
  form: RestaurantFormState;
  setForm: React.Dispatch<React.SetStateAction<RestaurantFormState>>;
  isSubmitting: boolean;
  error?: string;
  allCount: number;
  isEditing?: boolean;
  onCancel?: () => void;
};

export default function RestaurantsForm({ onSubmit, form, setForm, isSubmitting, error, allCount, isEditing = false, onCancel, }: RestaurantsFormProps) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6 mb-8">
      <h2 className="text-base sm:text-lg font-semibold mb-4">{isEditing ? "Edit Restaurant" : "Create Restaurant"}</h2>

      <form className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" onSubmit={onSubmit}>
        {/* Basic Info Fields */}
        <div>
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          placeholder="Restaurant Name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
           aria-errormessage={error}

        />
        { !form.name?error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Restaurant name is required.</p> : null} 
        {/* {!form.name && <p className="mt-2 text-xs sm:text-sm text-rose-400">Restaurant name is required.</p>} */}
  
     
        </div>
        <div>
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
        aria-errormessage={error}
        />
        {!form.category?error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Category is required.</p> : null}
        </div>
        <div>

        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
        aria-errormessage={error}
        />
        {!form.city?error && <p className="mt-2 text-xs sm:text-sm text-rose-400">City is required.</p> : null}
        
        </div>
        <div>
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          placeholder="Slug (unique identifier for URL)"
          value={form.slug}
          onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
         aria-errormessage={error}
        />
        
        {!form.slug?error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Slug is required.</p> : null}
   
        </div>
<div>
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          placeholder="Restaurant Address"
          value={form.address}
          onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
          aria-errormessage={error}
        />
        {!form.address?error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Address is required.</p> : null}
        </div>

        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          placeholder="Logo URL"
          value={form.logo}
          onChange={(e) => setForm((prev) => ({ ...prev, logo: e.target.value }))}
        />
       

        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="SEO Title"
          value={form.seoTitle}
          onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
        />

        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="SEO Description"
          value={form.seoDescription}
          onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
        />
         <input 
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Title"
          value={form.content.heroTitle}
          onChange={(e) => setForm((prev) => ({ ...prev, content: { ...prev.content, heroTitle: e.target.value } }))}
        />
          <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Description"
          value={form.content.heroDescription}
          onChange={(e) => setForm((prev) => ({ ...prev, content: { ...prev.content, heroDescription: e.target.value } }))}
        />
          <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Hero Image URL"
          value={form.content.heroImageUrl}
          onChange={(e) => setForm((prev) => ({ ...prev, content: { ...prev.content, heroImageUrl: e.target.value } }))}
        />

        <input 
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Title"
          value={form.content.title}
          onChange={(e) => setForm((prev) => ({ ...prev, content: { ...prev.content, title: e.target.value } }))}
        />
        <input 
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Description"
          value={form.content.description}
          onChange={(e) => setForm((prev) => ({ ...prev, content: { ...prev.content, description: e.target.value } }))}
        />
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Image URL"
          value={form.content.imageUrl}
          onChange={(e) => setForm((prev) => ({ ...prev, content: { ...prev.content, imageUrl: e.target.value } }))}
        />
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Menu Book URL"
          value={form.content.menuBookUrl}
          onChange={(e) => setForm((prev) => ({ ...prev, content: { ...prev.content, menuBookUrl: e.target.value } }))}
        />
        {/* Contact Info Fields */}
        <div>
        <input
  className="p-3 bg-black/40 border border-white/10 rounded-lg"
  placeholder="Phone Number"
  value={form.contactInfo.phone}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, phone: e.target.value },
    }))
  }
  aria-errormessage={error}
 
        />
        {!form.contactInfo.phone ? error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Phone number is required.</p> : null}
        </div>

{/* Email Input */}
<div>
<input
  className="p-3 bg-black/40 border border-white/10 rounded-lg"
  placeholder="Email Address"
  value={form.contactInfo.email}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, email: e.target.value },
    }))
  }
aria-errormessage={error}
/>
{!form.contactInfo.email ? error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Email address is required.</p> : null}
</div>

{/* Opening Hours */}
<div>
<input
  className="p-3 bg-black/40 border border-white/10 rounded-lg"
  placeholder="Opening Hours"
  value={form.contactInfo.openingHours}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, openingHours: e.target.value },
    }))
  }
  aria-errormessage={error}
/>

 {!form.contactInfo.openingHours ? error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Opening hours are required.</p> : null}
</div>
{/* Closing Hours */}
<div>
  <input
  className="p-3 bg-black/40 border border-white/10 rounded-lg"
  placeholder="Closing Hours"
  value={form.contactInfo.closingHours}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, closingHours: e.target.value },
    }))
  }
aria-errormessage={error}
/>
{!form.contactInfo.closingHours ? error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Closing hours are required.</p> : null}
</div>
{/* Website */}
<div className="flex gap-3 col-span-1 sm:col-span-2">
  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-white">
    <input
      type="checkbox"
      checked={form.status === "OPEN"} 
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          status: e.target.checked ? "OPEN" : "CLOSED",
        }))
      }
      className="h-4 w-4 rounded border-white/10 bg-white/5 text-sky-500 focus:ring-sky-500"
    />
    <span>Open Now</span>
  </label>
</div>
        <div className="flex gap-3 col-span-1 sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="p-3 bg-sky-600 hover:bg-sky-700 rounded-lg font-semibold disabled:opacity-60"
          >
            {isSubmitting ? (isEditing ? "Saving..." : "Publishing...") : isEditing ? "Save Changes" : "Publish Restaurant"}
          </button>

          {isEditing && onCancel ? (
            <button type="button" onClick={onCancel} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {error && <p className="text-rose-400 text-sm mt-3">{error}</p>}

      <div className="mt-4 text-sm text-gray-300">
        Live restaurants: <span className="font-semibold text-white">{allCount}</span>
      </div>
    </div>
  );
}
