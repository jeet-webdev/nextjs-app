import MenuCard from "./MenuCard";
import { type MenuRecord } from "@/features/menu/types/menuTypes";

type MenuGridProps = {
  menuItems?: MenuRecord[];
  emptyMessage: string;
  compact?: boolean;
  className?: string;
  onEdit?: (menuItem: MenuRecord) => void;
};

export default function MenuGrid({
  emptyMessage,
  menuItems = [],

  compact = false,
  className = "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3",
  onEdit,
}: MenuGridProps) {


  if (menuItems.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-gray-300">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={className}>
      {menuItems.map((item) => (
        <MenuCard
          key={item.id}
          menuItem={item}
          compact={compact}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
