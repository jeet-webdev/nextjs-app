import { type MouseEvent } from "react";
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

import { type MenuRecord } from "../types/menuTypes";

type MenuCardProps = {
  menuItem: MenuRecord;
  compact?: boolean;
  onEdit?: (menuItem: MenuRecord) => void;
  onDelete?: (id: string) => Promise<void> | void;
  canManage?: boolean;
};

export default function MenuCard({
  menuItem,
  compact = false,
  onEdit,
  onDelete,
  canManage = false,
}: MenuCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const showActions = canManage && (Boolean(onEdit) || Boolean(onDelete));

  const handleDeleteClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onDelete) return;

    if (confirm(`Are you sure you want to delete "${menuItem.name}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(menuItem.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const statusBadge = (
    <span
      className={`rounded-full px-2 py-1 text-xs ${
        menuItem.isAvailable ? "bg-emerald-500/15 text-emerald-200" : "bg-red-500/15 text-red-200"
      }`}
    >
      {menuItem.isAvailable ? "Available" : "Unavailable"}
    </span>
  );

  const content = compact ? (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4 transition hover:bg-black/50 hover:border-sky-500/30">
      <p className="font-semibold text-white">{menuItem.name}</p>
      <p className="mt-1 text-sm text-sky-300">{menuItem.category}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
        <span>${menuItem.price}</span>
        {statusBadge}
      </div>
    </div>
  ) : (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-4 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.06] hover:border-sky-500/30">
      <h3 className="text-lg font-semibold text-white">{menuItem.name}</h3>
      <p className="mt-2 text-sm text-sky-300">{menuItem.category}</p>
      <div className="mt-4 flex flex-row items-center justify-between text-sm text-gray-300">
       <div className="flex gap-4">
          <span className="text-gray-100">Price: ${menuItem.price}</span>
          {menuItem.discountedPrice && (
             <span className="text-emerald-400">Discount: ${menuItem.discountedPrice}</span>
          )}
        </div>
        {statusBadge}
      </div>
    </article>
  );

  return (
    <div className="relative group">
      {content}

      {/* <div
        className={`absolute right-3 top-3 z-10 flex gap-2 transition-opacity ${
          showActions ? "opacity-0 group-hover:opacity-100" : "pointer-events-none opacity-0"
        }`}
      > */}
      <div className="absolute right-3 top-3 z-10 flex gap-2">
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(menuItem)}
            className="rounded bg-white/10 p-2 text-gray-100 transition hover:bg-white/20"
            title="Edit Item"
          >
            <Edit className="h-4 w-4" />
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDeleteClick}
            className={`rounded bg-red-500/10 p-2 transition hover:bg-red-500/20 ${
              isDeleting ? "opacity-30 cursor-not-allowed" : "text-red-500"
            }`}
            title="Delete Item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}