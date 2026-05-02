export interface Modifier {
  id: string;
  name: string;
  price: number;
  menuContent?: Record<string, unknown> | null;
}

export interface MenuRecord {
  id: string;
  name: string;
    description: string;
    price: number;
    categoryId: string;
    image: string;
    isAvailable: boolean;
    restaurantId: string;
    createdAt: string;
    updatedAt: string;
    modifiers: Modifier[];
    };

export interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  image: string;
  isAvailable: boolean;  
  modifiers: Modifier[];
  restaurantId: string;
}

export interface menuItem extends MenuItemFormData {
  id: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

export const MENU_CATEGORIES = [
  "Main Course",
  "Desserts",
  "Beverages",
  "Soft Drinks",
  "Alcoholic Drinks",
  "Specials",
  "Breakfast",
  "Brunch",
  "Lunch",
  "Dinner",
  "Vegan",
  "Vegetarian",
  "Seafood",
  "Grills",
  "Other",
] as const;
export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export const defaultMenuItemFormData: MenuItemFormData = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  image: "",
  isAvailable: true,
  modifiers: [],
  restaurantId: "",
};