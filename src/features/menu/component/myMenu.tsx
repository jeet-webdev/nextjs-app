import { Menu } from "lucide-react";
import MenuCard from "./MenuCard";
import { MenuRecord } from "../types/menuTypes";
import { useEffect, useState } from "react";
import MenuGrid from "./MenuGrid";

type MyMenuProps = {
  menuItems?: MenuRecord[];
  onEdit?: (menuItem: MenuRecord) => void;
  onDelete?: (id: string) => Promise<void> | void;
  restaurantId: string;
  localMenuItems?: MenuRecord[];
  canManage?: boolean;
  refreshKey?: number;
};

export default function MyMenu({
  menuItems,
  onEdit,
  onDelete,
  restaurantId,
  canManage = false,
  refreshKey = 0,
}: MyMenuProps) {
  
  const [isLoading, setIsLoading] = useState(true);
  const [localMenuItems, setLocalMenuItems] = useState<MenuRecord[]>([]);



  useEffect(() => {
    const loadMenuItem = async () => {
      try {
        const query = canManage
          ? `/api/menuitem?restaurantId=${encodeURIComponent(restaurantId)}`
          : `/api/menuitem?public=true&restaurantId=${encodeURIComponent(restaurantId)}`;
        const response = await fetch(query, canManage ? { credentials: "include" } : undefined);

        if (!response.ok) return;

        const data = await response.json();
        const allItems: MenuRecord[] = data.menuItems || [];
        setLocalMenuItems(allItems);
      } catch (error) {
        console.error("Failed to load menu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (restaurantId) {
      void loadMenuItem();
    }
  }, [canManage, refreshKey, restaurantId]);
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold text-white">All My Menu</h1> */}
      <p className="mt-20 text-gray-400">Manage your  items here.</p>

      {localMenuItems.length === 0 && !isLoading ? (
        <p className="mt-4 text-sm text-gray-500">
          No  items found for this restaurant.
        </p>
      ) : (
        <div>
          <p className="mt-2 text-sm text-gray-500">
            total  item: {localMenuItems.length} 
          </p>
        </div>
      )}
      <MenuGrid
        menuItems={localMenuItems}
        className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
        canManage={canManage}
        onEdit={onEdit}
        onDelete={onDelete}
        emptyMessage={
          isLoading ? "Loading Item items..." : "No Item published yet."
        }
      />
    </div>
  );
}
