import { type ShopFormState, type ShopRecord } from "@/features/shops/types";
import ShopGrid from "@/features/shops/components/ShopGrid";

type ShopsFormProps = {
  ownerShops: ShopRecord[];
  allShopsCount: number;
  shopForm: ShopFormState;
  setShopForm: React.Dispatch<React.SetStateAction<ShopFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmittingShop: boolean;
  shopError: string;
};

export default function ShopsForm({
  ownerShops,
  allShopsCount,
  shopForm,
  setShopForm,
  onSubmit,
  isSubmittingShop,
  shopError,
}: ShopsFormProps) {
  return (
    <>
      <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">My Shops</h2>
        <ShopGrid
          shops={ownerShops}
          compact
          emptyMessage="You have not published any shops yet."
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        />
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Create Shop For Customers</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmit}>
          <input
            className="p-3 bg-black/40 border border-white/10 rounded-lg"
            placeholder="Shop Name"
            value={shopForm.name}
            onChange={(e) => setShopForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            className="p-3 bg-black/40 border border-white/10 rounded-lg"
            placeholder="Category"
            value={shopForm.category}
            onChange={(e) => setShopForm((prev) => ({ ...prev, category: e.target.value }))}
          />
          <input
            className="p-3 bg-black/40 border border-white/10 rounded-lg"
            placeholder="City"
            value={shopForm.city}
            onChange={(e) => setShopForm((prev) => ({ ...prev, city: e.target.value }))}
          />
          <input
            className="p-3 bg-black/40 border border-white/10 rounded-lg"
            placeholder="Rating"
            value={shopForm.rating}
            onChange={(e) => setShopForm((prev) => ({ ...prev, rating: e.target.value }))}
          />
          <button
            type="submit"
            disabled={isSubmittingShop}
            className="p-3 bg-sky-600 hover:bg-sky-700 rounded-lg font-semibold disabled:opacity-60"
          >
            {isSubmittingShop ? "Publishing..." : "Publish Shop"}
          </button>
        </form>
        {shopError && <p className="text-rose-400 text-sm mt-3">{shopError}</p>}

        <div className="mt-4 text-sm text-gray-300">
          Live shops available to customers: <span className="font-semibold text-white">{allShopsCount}</span>
        </div>
      </div>
    </>
  );
}
