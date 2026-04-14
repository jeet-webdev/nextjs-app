export type ShopRecord = {
  id: string;
  name: string;
  category: string;
  city: string;
  slug: string;
  rating: string;
  createdById?: string;
  createdAt?: string;
};

export type ShopFormState = {
  name: string;
  category: string;
  city: string;
  slug: string;
  rating: string;
};

export const EMPTY_SHOP_FORM: ShopFormState = {
  name: "",
  category: "",
  city: "",
  slug: "",
  rating: "",
};
//