import Link from "next/link";
import { type MenuRecord } from "../types/menuTypes";

type MenuCardProps = {
  menuItem: MenuRecord;
  compact?: boolean;
  onEdit?: (menuItem: MenuRecord) => void;
  restaurantId?: string;
};

export default function MenuCard({
  menuItem,
  compact = false,
  onEdit,
  restaurantId,
}: MenuCardProps) {
  

  const content = compact ? (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4 transition hover:bg-black/50 hover:border-sky-500/30">
      <p className="font-semibold text-white">{menuItem.name}</p>
      <p className="mt-1 text-sm text-sky-300">{menuItem.category}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
        <span>{menuItem.price}</span>
        {/* <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-200">
          {menuItem.status ?? "OPEN"}
        </span> */}
        {menuItem.isAvailable ? (
          <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-200">
            Available
          </span>
        ) : (
          <span className="rounded-full bg-red-500/15 px-2 py-1 text-red-200">
            Unavailable
          </span>
        )}
      </div>
    </div>
  ) : (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-4 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.06] hover:border-sky-500/30">
      <h3 className="text-lg font-semibold text-white">{menuItem.name}</h3>
      {/* <p className="mt-2 text-sm text-sky-300">{menuItem.restaurantId}</p> */}
      <p className="mt-2 text-sm text-sky-300">{menuItem.category}</p>
      <div className="mt-4 flex flex-row items-center justify-between text-sm text-gray-300">
        <span className="text-red-500">Price: {menuItem.price}</span>
        <span className="text-green-500">Discounted Price: {menuItem.discountedPrice}</span>
        {menuItem.isAvailable ? (
          <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-200">
            Available
          </span>
        ) : (
          <span className="rounded-full bg-red-500/15 px-2 py-1 text-red-200">
            Unavailable
          </span>
        )}
      </div>
    </article>
  );

  return (
    <div className="relative">
      {/* <Link href={`/${menuItem.restaurantId}`}>{content}</Link> */}
      {content}

      {onEdit ? (
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              onEdit(menuItem);
            }}
            className="rounded bg-white/10 px-2 py-1 text-xs text-gray-100 transition hover:bg-white/20"
          >
            Edit
          </button>
        </div>
      ) : null}
    </div>
  );
}
