import { z } from 'zod';

export const restaurantSchema = z.object({
    name: z.string().min(1, "Restaurant name is required").max(100, "Restaurant name is too long"),
    city: z.string().min(1, "City is required").max(50, "City is too long"),
    slug: z.string()
        .min(3, "Slug must be at least 3 characters")
        .max(100, "Slug is too long")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message: "Slug must be lowercase, alphanumeric, and separated by hyphens (e.g., 'my-slug')",
        }),
    status: z.enum(["OPEN", "CLOSED"]).optional(),
    address: z.string().min(1, "Address is required").max(200, "Address is too long"),
    logo: z.string().url("Logo must be a valid URL"),
    seoTitle: z.string().max(60, "SEO Title should be 60 characters or less").optional(),
    seoDescription: z.string().max(160, "SEO Description should be 160 characters or less").optional(),
    content: z.object({
        title: z.string().max(100, "COntent Title is too long").optional(),
        description: z.string().max(300, "Content Description is too long").optional(),
        imageUrl: z.string().url("Content Image URL must be a valid URL").optional(),
        menuBookUrl: z.string().url("Menu Book URL must be a valid URL").optional(),
        heroImageUrl: z.string().url("Hero Image URL must be a valid URL").optional(),
        heroTitle: z.string().max(100, "Hero Title is too long").optional(),
        heroDescription: z.string().max(300, "Hero Description is too long").optional(),
    }).optional(),
    contactInfo: z.object({
        phone: z.string().regex(/^\+?[0-9\s\-().]{7,20}$/, "Enter a valid phone number"),
        email: z.string().email({ pattern: z.regexes.email }),
        website: z.string().url("Website must be a valid URL").optional(),
        openingHours: z.string().max(20, "Opening hours description is too long"),
        closingHours: z.string().max(20, "Closing hours description is too long"),
    }),
});

type RestaurantFormState = z.infer<typeof restaurantSchema>;
