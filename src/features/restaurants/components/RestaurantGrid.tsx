import RestaurantCard from "@/features/restaurants/components/RestaurantCard";
import { type RestaurantRecord } from "@/features/restaurants/types";

type RestaurantGridProps = {
  restaurants: RestaurantRecord[];
  emptyMessage: string;
  compact?: boolean;
  className?: string;
  onEdit?: (restaurant: RestaurantRecord) => void;
  onDelete?: (restaurant: RestaurantRecord) => void;
  onCreateRestaurant?: () => void;
  onView?: (restaurant: RestaurantRecord) => void;
};

export default function RestaurantGrid({
  restaurants,
  emptyMessage,
  compact = false,
  className = "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3",
  onEdit,
  onDelete,
  onCreateRestaurant,
  onView,
}: RestaurantGridProps) {
 

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4 text-sm font-semibold sm:p-6 sm:text-base">
        {/* {createButton ?? <h2 className="text-base sm:text-lg font-semibold">Restaurants</h2>} */}
      </div>
      <div className={className}>
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            compact={compact}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>
    </>
  );
}
