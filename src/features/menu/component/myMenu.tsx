import { Menu } from "lucide-react";
import MenuCard from "./MenuCard";
import { MenuRecord } from "../types/menuTypes";
import { useEffect, useState } from "react";
import MenuGrid from "./MenuGrid";

type MyMenuProps = {
  menuItems?: MenuRecord[];
  onEdit?: (menuItem: MenuRecord) => void;
  onDelete?: (id: string) => void;
  restaurantId: string;
  localMenuItems?: MenuRecord[];
};

export default function MyMenu({
  menuItems,
  onEdit,
  onDelete,
  restaurantId,
}: MyMenuProps) {
  

//   const [menuItem, setMenuItem] = useState<MenuRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localMenuItems, setLocalMenuItems] = useState<MenuRecord[]>([]);

  //   useEffect(() => {
  //     const loadMenuItem = async () => {
  //       try {
  //         const response = await fetch("/api/menu?public=true");
  //         if (!response.ok) return;

  //         const data = await response.json();

  //         const items = data.menuItems || [];
  //         setMenuItem(items);
  //       } catch (error) {
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };
  //     void loadMenuItem();
  //   }, []);

  useEffect(() => {
    const loadMenuItem = async () => {
      try {
     
        const response = await fetch("/api/menu?public=true");
        if (!response.ok) return;

        const data = await response.json();
        const allItems: MenuRecord[] = data.menuItems || [];

        const filteredItems = allItems.filter(
          (item) => item.restaurantId === restaurantId,
        );

        setLocalMenuItems(filteredItems);
      } catch (error) {
        console.error("Failed to load menu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (restaurantId) {
      void loadMenuItem();
    }
  }, [restaurantId]);
  return (
    <div className="">
      <h1 className="text-2xl font-bold text-white">All My Menu</h1>
      <p className="mt-2 text-gray-400">Manage your menu items here.</p>

      {localMenuItems.length === 0 && !isLoading ? (
        <p className="mt-4 text-sm text-gray-500">
          No menu items found for this restaurant.
        </p>
      ) : (
        <div>
          <p className="mt-2 text-sm text-gray-500">
            {localMenuItems.length} total menu item
            {localMenuItems.length !== 1 ? "s" : ""} found for restaurant ID:{" "}
            {restaurantId}
          </p>
        </div>
      )}
      <MenuGrid
        menuItems={localMenuItems}
        className="mt-2 pt-2"
        emptyMessage={
          isLoading ? "Loading menu items..." : "No menu published yet."
        }
      />
    </div>
  );
}
