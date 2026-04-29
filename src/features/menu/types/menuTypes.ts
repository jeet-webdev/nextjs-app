export interface Modifier {
  id: string;
  name: string;
  price: number;
  menuContent?: Record<string, unknown> | null;
}

export interface DietaryInfo {
  isVegan?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isSweet?: boolean;
  isOily?: boolean;
  isNutFree?: boolean;
  isGlutenFree?: boolean;

}
export interface MenuRecord {
  id: string;
  name: string;
    description: string;
    price: number;
    discountedPrice: number;
    currency: string;
    categoryId: string;
    category: string;
    subCategory: string;
    image: string;
    dietary: DietaryInfo;
    isAvailable: boolean;
    preparationTime: string;
    ingredients: string;
    order: number;
    restaurantId: string;
    createdAt: string;
    updatedAt: string;
    modifiers: Modifier[];
    };

export interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  discountedPrice: string;
  currency: string;
  categoryId: string;
  category: string;
  subCategory: string;
  image: string;
  dietary: DietaryInfo;
  isAvailable: boolean;
  preparationTime: string;
  ingredients: string;
  order: number;
  modifiers: Modifier[];
  restaurantId: string;
}

export interface menuItem extends MenuItemFormData {
  id: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

export const CURRENCIES = ["USD", "EUR", "INR", "CAD", "AUD"] as const;
export type Currency = (typeof CURRENCIES)[number];

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
  discountedPrice: "",
  currency: "USD",
  categoryId: "",
  category: "",
  subCategory: "",
  image: "",
  dietary: {
    isVegan: false,
    isVegetarian: false,
    isSpicy: false,
    isSweet: false,
    isOily: false,
    isNutFree: false,
    isGlutenFree: false,
  },
  isAvailable: true,
  preparationTime: "",
  ingredients: "",
  order: 0,
  modifiers: [],
  restaurantId: "",
};