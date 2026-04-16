import RestaurantGrid from "@/features/restaurants/components/RestaurantGrid";
import {
  type RestaurantFormState,
  type RestaurantRecord,
} from "@/features/restaurants/types";

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
            required
            value={restaurantForm.name}
            onChange={(event) => setRestaurantForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <input
            className="rounded-lg border border-white/10 bg-black/40 p-3"
            placeholder="Category"
            required
            value={restaurantForm.category}
            onChange={(event) => setRestaurantForm((prev) => ({ ...prev, category: event.target.value }))}
          />
          <input
            className="rounded-lg border border-white/10 bg-black/40 p-3"
            placeholder="City"
            required
            value={restaurantForm.city}
            onChange={(event) => setRestaurantForm((prev) => ({ ...prev, city: event.target.value }))}
          />
          <input
            className="rounded-lg border border-white/10 bg-black/40 p-3"
            placeholder="Slug (optional)"
            value={restaurantForm.slug}
            onChange={(event) => setRestaurantForm((prev) => ({ ...prev, slug: event.target.value }))}
          />
          <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          placeholder="Address"
          required
          value={restaurantForm.address}
          onChange={(e) => setRestaurantForm  ((prev) => ({ ...prev, address: e.target.value }))}
        />

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
  className="p-3 bg-black/40 border border-white/10 rounded-lg"
  placeholder="Phone Number"
  value={restaurantForm.contactInfo.phone}
  onChange={(e) =>
    setRestaurantForm((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, phone: e.target.value },
    }))
  }
/>

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
/>
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
/>
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
/>
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
