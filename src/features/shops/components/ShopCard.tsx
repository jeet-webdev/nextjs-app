import Link from "next/link";
import { type ShopRecord } from "@/features/shops/types";

type ShopCardProps = {
  shop: ShopRecord;
  compact?: boolean;
};

export default function ShopCard({ shop, compact = false }: ShopCardProps) {
  if (compact) {
    return (
      <Link href={`/${shop.slug}`}>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 cursor-pointer transition hover:bg-black/50 hover:border-sky-500/30">
          <p className="font-semibold text-white">{shop.name}</p>
          <p className="text-sm text-sky-300 mt-1">{shop.category}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
            <span>{shop.city}</span>
            <span className="px-2 py-1 rounded-full bg-sky-500/20 text-sky-200">
              {shop.rating}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/${shop.slug}`}>
      <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.06] hover:border-sky-500/30 cursor-pointer">
        <h3 className="text-lg font-semibold text-white">{shop.name}</h3>
        <p className="mt-2 text-sm text-sky-300">{shop.category}</p>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
          <span>{shop.city}</span>
          <span className="rounded-full bg-sky-500/20 px-2 py-1 text-sky-200">{shop.rating}</span>
        </div>
      </article>
    </Link>
  );
}
