import { type ShopRecord } from "@/features/shops/types";
import ShopCard from "@/features/shops/components/ShopCard";

type ShopGridProps = {
  shops: ShopRecord[];
  emptyMessage: string;
  compact?: boolean;
  className?: string;
};

export default function ShopGrid({
  shops,
  emptyMessage,
  compact = false,
  className = "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3",
}: ShopGridProps) {
  if (shops.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-gray-300">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={className}>
      {shops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} compact={compact} />
      ))}
    </div>
  );
}
