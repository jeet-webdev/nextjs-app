// export type RestaurantRecord = {
//   id: string;
//   name: string;
//   category: string;
//   contactInfo?: JSON | null;
//   city: string;
//   slug: string;
//   address?: string | null;
//   logo?: string | null;
//   seoTitle?: string | null;
//   seoDescription?: string | null;
//   userId: string;
//   status?: "OPEN" | "CLOSED";
//   createdAt?: string;
// };
// export type ContactDetails = {
//   phone: string;
//   email: string;
//   openingHours?: string;
//   closingHours?: string;
//   website?: string;
// };
// export type RestaurantFormState = {
//   name: string;
//   category: string;
//   // contactInfo?: JSON | null;
//   contactInfo: ContactDetails;
//   city: string;
//   slug: string;
//   address: string;
//   logo: string;
//   seoTitle: string;
//   seoDescription: string;
// };

// export const EMPTY_RESTAURANT_FORM: RestaurantFormState = {
//   name: "",
//   category: "",
//   // contactInfo: null,
//   city: "",
//   slug: "",
//   address: "",
//   logo: "",
//   seoTitle: "",
//   seoDescription: "",
//   contactInfo: {
//     phone: "",
//     email: "",
//     website: "",
//     openingHours: "",
//     closingHours: ""
//   },
// };


export type ContactDetails = {
  phone: string;
  email: string;
  openingHours: string;
  closingHours: string;
  website: string;
};

export type RestaurantRecord = {
  id: string;
  name: string;
  category: string;
  contactInfo?: ContactDetails | null;
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
  contactInfo: ContactDetails; // Use the interface here
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
};