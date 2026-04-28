import RestaurantGrid from "@/features/restaurants/components/RestaurantGrid";
import { type RestaurantRecord } from "@/features/restaurants/types";

type MenuSectionProps = {
  restaurants: RestaurantRecord[];
  onViewMenu: (restaurant: RestaurantRecord) => void;
  onCreateRestaurant?: () => void;
};

export default function MenuSection({
  restaurants,
  onViewMenu,
  onCreateRestaurant,
}: MenuSectionProps) {
  return (
    <section className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6">
      <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-semibold">Create And Manage Menu Items</h2>
          <p className="mt-1 text-sm text-gray-400">
            Choose a restaurant, then add or edit menu items for that restaurant.
          </p>
        </div>
        <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-200 whitespace-nowrap">
          {restaurants.length} restaurants
        </span>
        {onCreateRestaurant ? (
          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 sm:px-4 sm:text-sm"
            onClick={onCreateRestaurant}
          >
            Create Restaurant
          </button>
        ) : null}
      </div>

      <RestaurantGrid
        restaurants={restaurants}
        compact
        emptyMessage="No restaurants available for menu management."
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        onViewMenu={onViewMenu}
      />
    </section>
  );
}
