import RestaurantGrid from "@/features/restaurants/components/RestaurantGrid";
import { restaurantSchema } from "@/features/restaurants/restaurantValidation";
import {
  type RestaurantFormState,
  type RestaurantRecord,
} from "@/features/restaurants/types";
import {z} from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type RestaurantFormData = z.infer<typeof restaurantSchema>;

type OwnerRestaurantsFormProps = {
  restaurants: RestaurantRecord[];
  allRestaurantsCount: number;
  restaurantForm: RestaurantFormState;
  setRestaurantForm: React.Dispatch<React.SetStateAction<RestaurantFormState>>;
  onSubmit: (event: React.FormEvent) => void;
  isSubmitting: boolean;
  error: string;
  onEdit?: (restaurant: RestaurantRecord) => void;
  isEditing?: boolean;
  onCancel?: () => void;
};

export default function OwnerRestaurantsForm({
  restaurants,
  allRestaurantsCount,
  restaurantForm,
  setRestaurantForm,
  onSubmit,
  isSubmitting,
  error,
  onEdit,
  isEditing = false,
  onCancel,
}: OwnerRestaurantsFormProps) {
  return (
    <>
      <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <h2 className="mb-4 text-base font-semibold sm:text-lg">My Restaurants</h2>
        <RestaurantGrid
          restaurants={restaurants}
          compact
          emptyMessage="You have not published any restaurants yet."
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          onEdit={onEdit}
        />
      </div>

      <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <h2 className="mb-4 text-base font-semibold sm:text-lg">{isEditing ? "Edit Restaurant" : "Create Restaurant"}</h2>
        <form className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4" onSubmit={onSubmit}>
          <input
            className="rounded-lg border border-white/10 bg-black/40 p-3"
            placeholder="Restaurant Name"
           value={restaurantForm.name}
            onChange={(event) => setRestaurantForm((prev) => ({ ...prev, name: event.target.value }))}
            aria-errormessage={error}
          />
          {!restaurantForm.name && !error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Restaurant name is required.</p>}
          <input
            className="rounded-lg border border-white/10 bg-black/40 p-3"
            placeholder="Category"
            value={restaurantForm.category}
            onChange={(event) => setRestaurantForm((prev) => ({ ...prev, category: event.target.value }))}
            aria-errormessage={error}
            />
          {!restaurantForm.category && !error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Category is required.</p>}
          <input
            className="rounded-lg border border-white/10 bg-black/40 p-3"
            placeholder="City"
            value={restaurantForm.city}
            onChange={(event) => setRestaurantForm((prev) => ({ ...prev, city: event.target.value }))}
            aria-errormessage={error}
          />
          {!restaurantForm.city && !error && <p className="mt-2 text-xs sm:text-sm text-rose-400">City is required.</p>}
          <input
            className="rounded-lg border border-white/10 bg-black/40 p-3"
            placeholder="Slug (unique identifier for URL)"
            value={restaurantForm.slug}
            onChange={(event) => setRestaurantForm((prev) => ({ ...prev, slug: event.target.value }))}
            aria-errormessage={error}
          />
          {!restaurantForm.slug && !error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Slug is required.</p>}

          <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          placeholder="Restaurant Address"
          value={restaurantForm.address}
          onChange={(e) => setRestaurantForm  ((prev) => ({ ...prev, address: e.target.value }))}
        aria-errormessage={error}
        />
        {!restaurantForm.address && !error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Address is required.</p>}

        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          placeholder="Logo URL"
          value={restaurantForm.logo}
          onChange={(e) => setRestaurantForm((prev) => ({ ...prev, logo: e.target.value }))}
        />
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="SEO Title"
          value={restaurantForm.seoTitle}
          onChange={(e) => setRestaurantForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
        />

        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="SEO Description"
          value={restaurantForm.seoDescription}
          onChange={(e) => setRestaurantForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
        />
         <input 
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Hero Title"
          value={restaurantForm.content.heroTitle}
          onChange={(e) => setRestaurantForm((prev) => ({ ...prev, content: { ...prev.content, heroTitle: e.target.value } }))}
        />
          <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Hero Description"
          value={restaurantForm.content.heroDescription}
          onChange={(e) => setRestaurantForm((prev) => ({ ...prev, content: { ...prev.content, heroDescription: e.target.value } }))}
        />
          <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Hero Image URL"
          value={restaurantForm.content.heroImageUrl}
          onChange={(e) => setRestaurantForm((prev) => ({ ...prev, content: { ...prev.content, heroImageUrl: e.target.value } }))}
        />
        <input 
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Title"
          value={restaurantForm.content.title}
          onChange={(e) => setRestaurantForm((prev) => ({ ...prev, content: { ...prev.content, title: e.target.value } }))}
          // aria-errormessage={error}
        />
        {/* {!restaurantForm.content.title && !error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Content title is required.</p>} */}
        <input 
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Description"
          value={restaurantForm.content.description}
          onChange={(e) => setRestaurantForm((prev) => ({ ...prev, content: { ...prev.content, description: e.target.value } }))}
        />
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Content Image URL"
          value={restaurantForm.content.imageUrl}
          onChange={(e) => setRestaurantForm((prev) => ({ ...prev, content: { ...prev.content, imageUrl: e.target.value } }))}
        />
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg col-span-1 sm:col-span-2"
          placeholder="Menu Book URL"
          value={restaurantForm.content.menuBookUrl}
          onChange={(e) => setRestaurantForm((prev) => ({ ...prev, content: { ...prev.content, menuBookUrl: e.target.value } }))}
        />
   <input
  className="p-3 bg-black/40 border border-white/10 rounded-lg"
  placeholder="Phone Number"
  value={restaurantForm.contactInfo.phone}
  onChange={(e) =>
    setRestaurantForm((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, phone: e.target.value },
    }))
  }
  aria-errormessage={error}
/>
{!restaurantForm.contactInfo.phone && !error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Phone number is required.</p>}

{/* Email Input */}
<input
  className="p-3 bg-black/40 border border-white/10 rounded-lg"
  placeholder="Email Address"
  value={restaurantForm.contactInfo.email}
  onChange={(e) =>
    setRestaurantForm((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, email: e.target.value },
    }))
  }
  aria-errormessage={error}
/>
{!restaurantForm.contactInfo.email && !error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Email is required.</p>}

{/* Opening Hours */}
<input
  className="p-3 bg-black/40 border border-white/10 rounded-lg"
  placeholder="Opening Hours"
  value={restaurantForm.contactInfo.openingHours}
  onChange={(e) =>
    setRestaurantForm((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, openingHours: e.target.value },
    }))
  }
  aria-errormessage={error}
/>
{!restaurantForm.contactInfo.openingHours && !error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Opening hours are required.</p>}

{/* Closing Hours */}
<input
  className="p-3 bg-black/40 border border-white/10 rounded-lg"
  placeholder="Closing Hours"
  value={restaurantForm.contactInfo.closingHours}
  onChange={(e) =>
    setRestaurantForm((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, closingHours: e.target.value },
    }))
  }
  aria-errormessage={error}
/>
{!restaurantForm.contactInfo.closingHours && !error && <p className="mt-2 text-xs sm:text-sm text-rose-400">Closing hours are required.</p>}
    <div className="sm:col-span-2 flex gap-3">
      
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-sky-600 p-3 font-semibold transition hover:bg-sky-700 disabled:opacity-60"
            >
              {isSubmitting ? (isEditing ? "Saving..." : "Publishing...") : isEditing ? "Save Changes" : "Publish Restaurant"}
            </button>

            {isEditing && onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg bg-white/5 p-3 transition hover:bg-white/10"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
        {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}

        <div className="mt-4 text-sm text-gray-300">
          Live restaurants available to customers: <span className="font-semibold text-white">{allRestaurantsCount}</span>
        </div>
      </div>
    </>
  );
}

