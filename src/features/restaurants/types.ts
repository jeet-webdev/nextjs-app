export type ContactDetails = {
  phone: string;
  email: string;
  openingHours: string;
  closingHours: string;
  website: string;
};
export type FirstContent = {
  title: string;
  description: string;
  imageUrl: string;
  menuBookUrl: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string;
};

export type RestaurantRecord = {
  id: string;
  name: string;
  category: string;
  contactInfo?: ContactDetails | null;
  content?: FirstContent | null;
  city: string;
  slug: string;
  address?: string | null;
  logo?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  userId: string;
  status?: "OPEN" | "CLOSED";
  createdAt?: string;
};

export type RestaurantFormState = {
  name: string;
  category: string;
  contactInfo: ContactDetails; 
  content: FirstContent;
  city: string;
  slug: string;
  status?: "OPEN" | "CLOSED";
  address: string;
  logo: string;
  seoTitle: string;
  seoDescription: string;
};

export const EMPTY_RESTAURANT_FORM: RestaurantFormState = {
  name: "",
  category: "",
  city: "",
  slug: "",
  status: "OPEN",
  address: "",
  logo: "",
  seoTitle: "",
  seoDescription: "",
  contactInfo: {
    phone: "",
    email: "",
    website: "",
    openingHours: "",
    closingHours: "",
  },
  content: {
    title: "",
    description: "",
    imageUrl: "",
    menuBookUrl: "",
    heroTitle: "",
    heroDescription: "",
    heroImageUrl: "",
  },

};