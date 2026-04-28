import Link from "next/link";
import { type RestaurantRecord } from "@/features/restaurants/types";
import { Archive, EditIcon, MapPin, Menu, Utensils, View } from "lucide-react";
import Image from "next/image";


type RestaurantCardProps = {
  restaurant: RestaurantRecord;
  compact?: boolean;
  onEdit?: (restaurant: RestaurantRecord) => void;
  onDelete?: (restaurant: RestaurantRecord) => void;
  onView?: (restaurant: RestaurantRecord) => void;
  onViewMenu?: (restaurant: RestaurantRecord) => void;
};

export default function RestaurantCard({
  restaurant,
  compact = false,
  onEdit,
  onDelete,
  onView,
  onViewMenu,
}: RestaurantCardProps) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-white/20 hover:border-sky-500/50">
      {/* Image Section */}
      <div
        className={`relative w-full overflow-hidden ${compact ? "h-32" : "h-48"}`}
      >
        {restaurant.content?.heroImageUrl ? (
          <Image
            src={restaurant.content.heroImageUrl}
            alt={restaurant.name}
            fill
            className="object-cover "
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center ">
            <Utensils className="h-8 w-8 text-white/20" />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur-md ${
              restaurant.status === "OPEN"
                ? "bg-emerald-500/50 text-emerald-300 border border-emerald-500/30"
                : "bg-rose-500/50 text-rose-300 border border-rose-500/30"
            }`}
          >
            <span
              className={` rounded-full ${restaurant.status === "OPEN" ? "bg-emerald-400 " : "bg-rose-400"}`}
            />
            {restaurant.status === "OPEN" ? "Open Now" : "Closed"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between">
          <h3
            className={`font-bold text-white transition-colors group-hover:text-sky-400}`}
          >
            {restaurant.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {/* <span className="text-xs font-medium uppercase px-2 py-0.5 rounded">
            {restaurant.category}
          </span> */}
        </div>
        <div className="mt-auto flex items-center flex-row gap-10 text-sm text-gray-400">
          <div className="flex  ">
            <MapPin className="mr-1 h-3.5 w-3.5 text-gray-500" />
            <span className="truncate">{restaurant.city}</span>
          </div>
        </div>
      </div>

      <div className="absolute right-2 top-2 flex flex-col gap-2 ">
        {(onEdit || onDelete) && (
          <>
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(restaurant);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-sky-500 hover:scale-110"
                title="Edit"
              >
                <EditIcon className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(restaurant);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-rose-500 hover:scale-110"
                title="Archive"
              >
                <Archive className="h-4 w-4" />
              </button>
            )}
          </>
        )}
        <Link
          href={`/${restaurant.slug}`}
          onClick={() => onView?.(restaurant)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-green-500/60 hover:scale-110"
          title="View"
        >
          <View className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-auto border-t border-white/10 p-4">
        {onViewMenu ? (
          <button
            type="button"
            onClick={() => onViewMenu(restaurant)}
            className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-sky-400"
          >
            <Menu className="h-4 w-4" />
            View Menu
          </button>
        ) : (
          <Link
            href={`/${restaurant.slug}/menu`}
            onClick={() => onView?.(restaurant)}
            className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-sky-400"
          >
            <Menu className="h-4 w-4" />
            View Menu
          </Link>
        )}
      </div>
    </div>
  );
}
