import { type ShopRecord } from "@/features/shops/types";
import ShopGrid from "@/features/shops/components/ShopGrid";

type RestaurantsSectionProps = {
  shops: ShopRecord[];
};

export default function RestaurantsSection({ shops }: RestaurantsSectionProps) {
  return (
    <section className="bg-white/5 rounded-xl border border-white/10 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Restaurants</h2>
        <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-200">
          {shops.length} total
        </span>
      </div>

      <ShopGrid
        shops={shops}
        compact
        emptyMessage="No restaurants found."
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      />
    </section>
  );
}
