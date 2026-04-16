// import RestaurantGrid from "@/features/restaurants/components/RestaurantGrid";
import MenuGrid from "@/features/menu/component/MenuGrid";
import { type MenuRecord } from "@/features/menu/types/menuTypes";


type MenuSectionProps = {
  menuItems: MenuRecord[];
  onEdit?: (menuItem: MenuRecord) => void;
};

export default function MenuSection({ menuItems }: MenuSectionProps) {
  return (
    <section className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6">
      <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-semibold">All Menu Items</h2>
        <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-200 whitespace-nowrap">
          {menuItems.length} total
        </span>
      </div>

      <MenuGrid
        menuItems={menuItems}
        compact
        emptyMessage="No menu items found."
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        // onEdit={onEdit}
      />
    </section>
  );
}
