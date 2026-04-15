import RestaurantCard from "@/features/restaurants/components/RestaurantCard";
import { type RestaurantRecord } from "@/features/restaurants/types";

type RestaurantGridProps = {
  restaurants: RestaurantRecord[];
  emptyMessage: string;
  compact?: boolean;
  className?: string;
  onEdit?: (restaurant: RestaurantRecord) => void;
};

export default function RestaurantGrid({
  restaurants,
  emptyMessage,
  compact = false,
  className = "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3",
  onEdit,
}: RestaurantGridProps) {
  if (restaurants.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-gray-300">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={className}>
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          compact={compact}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
