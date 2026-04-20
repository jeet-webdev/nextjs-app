import Link from "next/link";

import { type RestaurantRecord } from "@/features/restaurants/types";
import { Archive, DeleteIcon, Edit, EditIcon } from "lucide-react";

type RestaurantCardProps = {
  restaurant: RestaurantRecord;
  compact?: boolean;
  onEdit?: (restaurant: RestaurantRecord) => void;
  onDelete?: (restaurant: RestaurantRecord) => void;
};

export default function RestaurantCard({
  restaurant,
  compact = false,
  onEdit,
  onDelete,
}: RestaurantCardProps) {
  const content = compact ? (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4 transition hover:bg-black/50 hover:border-sky-500/30">
      <p className="font-semibold text-white">{restaurant.name}</p>
      <p className="mt-1 text-sm text-sky-300">{restaurant.category}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
        <span>{restaurant.city}</span>
        {/* <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-200">
          {restaurant.status ?? "OPEN"}
        </span> */}
        {restaurant.status === "OPEN" ? (
  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-200">
    Open
  </span>
) : (
  <span className="rounded-full bg-red-500/15 px-2 py-1 text-red-200">
    Closed
  </span>
)}
      </div>
    </div>
  ) : (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.06] hover:border-sky-500/30">
      <h3 className="text-lg font-semibold text-white">{restaurant.name}</h3>
      <p className="mt-2 text-sm text-sky-300">{restaurant.category}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
        <span>{restaurant.city}</span>
        {/* <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-200">
          {restaurant.status ?? "OPEN"}
        </span> */}
        {/* {restaurant.status === "OPEN" && (
          <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-200">
            Open Now
          </span>
        ) : (
          <span className="rounded-full bg-red-500/15 px-2 py-1 text-red-200">
            Closed
          </span>
        )} */}

      {restaurant.status === "OPEN" ? (
  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-200">
    Open
  </span>
) : (
  <span className="rounded-full bg-red-500/15 px-2 py-1 text-red-200">
    Closed
  </span>
)}
      </div>
    </article>
  );

  return (
    <div className="relative">
      <Link href={`/${restaurant.slug}`}>{content}</Link>

      {/* {onDelete ? (
        <div className="absolute right-3 bottom-3 z-10">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              onDelete(restaurant);
            }}
            className="rounded bg-white/10 px-2 py-1 text-xs text-gray-100 transition hover:bg-white/20"
          >
            <DeleteIcon className="h-5 w-5">Delete</DeleteIcon>
             <DeleteIcon className="h-5 w-5" /> 
          </button>
        </div>
      ) : null} */}

      {onEdit ? (
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              onEdit(restaurant);
            }}
            className="rounded bg-white/10 px-2 py-1 text-xs text-gray-100 transition hover:bg-white/20"
          >
            <EditIcon className="h-5 w-5" />
          </button>
        </div>
      ) : null}
      {onDelete ? (
        <div className="absolute right-3 bottom-10 z-10">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              onDelete(restaurant);
            }}
            className="rounded bg-white/10 px-2 py-1 text-xs text-gray-100 transition hover:bg-white/20"
          >
            {/* <DeleteIcon className="h-5 w-5" /> */}
            <Archive className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
