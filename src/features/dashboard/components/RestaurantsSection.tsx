import RestaurantGrid from "@/features/restaurants/components/RestaurantGrid";
import { type RestaurantRecord } from "@/features/restaurants/types";

type RestaurantsSectionProps = {
  restaurants: RestaurantRecord[];
  onEdit?: (restaurant: RestaurantRecord) => void;
  onDelete?: (restaurant: RestaurantRecord) => void;
  onCreateRestaurant?: () => void;
};


export default function RestaurantsSection({ restaurants, onEdit, onDelete, onCreateRestaurant }: RestaurantsSectionProps) {
  return (
    <section className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6">
      <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-semibold">All Restaurants</h2>
        <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-200 whitespace-nowrap">
          {restaurants.length} total
        </span>
        {onCreateRestaurant && (
          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 sm:px-4 sm:text-sm"
            onClick={onCreateRestaurant}
          >
            Create Restaurant
          </button>
        )}
     
      </div>

      <RestaurantGrid
        restaurants={restaurants}
        compact
        emptyMessage="No restaurants found."
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        onEdit={onEdit}
        onDelete={onDelete}
        onCreateRestaurant={onCreateRestaurant}
      />
    </section>
  );
}
