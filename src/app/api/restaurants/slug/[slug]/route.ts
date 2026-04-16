import { NextResponse } from "next/server";

import { type ContactDetails } from "@/features/restaurants/types";
import { prisma } from "@/shared/lib/prisma";

function mapContactInfo(contactInfo: unknown): ContactDetails | null {
  if (!contactInfo || typeof contactInfo !== "object") {
    return null;
  }

  const value = contactInfo as Partial<Record<keyof ContactDetails, unknown>>;

  return {
    phone: typeof value.phone === "string" ? value.phone : "",
    email: typeof value.email === "string" ? value.email : "",
    openingHours: typeof value.openingHours === "string" ? value.openingHours : "",
    closingHours: typeof value.closingHours === "string" ? value.closingHours : "",
    website: typeof value.website === "string" ? value.website : "",
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json({ error: "Restaurant slug is required." }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        category: true,
        city: true,
        slug: true,
        Address: true,
        logo: true,
        contactInfo: true,
        seoTitle: true,
        seoDescription: true,
        status: true,
        userId: true,
        createdAt: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
    }

    return NextResponse.json({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        category: restaurant.category,
        city: restaurant.city,
        slug: restaurant.slug,
        address: restaurant.Address,
        logo: restaurant.logo,
        contactInfo: mapContactInfo(restaurant.contactInfo),
        seoTitle: restaurant.seoTitle,
        seoDescription: restaurant.seoDescription,
        status: restaurant.status,
        userId: restaurant.userId,
        createdAt: restaurant.createdAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to load restaurant details." }, { status: 500 });
  }
}
