import { NextResponse } from "next/server";

import { FirstContent, type ContactDetails } from "@/features/restaurants/types";
import { prisma } from "@/shared/lib/prisma";

function mapContent(content: unknown): FirstContent | null {
  if (!content || typeof content !== "object") {    
    return null;
  } 
  const value = content as Partial<Record<keyof FirstContent, unknown>>;
  return {
    title: typeof value.title === "string" ? value.title : "",
    description: typeof value.description === "string" ? value.description : "",
    imageUrl: typeof value.imageUrl === "string" ? value.imageUrl : "",
    menuBookUrl: typeof value.menuBookUrl === "string" ? value.menuBookUrl : "",
    heroImageUrl: typeof value.heroImageUrl === "string" ? value.heroImageUrl : "",
    heroTitle: typeof value.heroTitle === "string" ? value.heroTitle : "",
    heroDescription: typeof value.heroDescription === "string" ? value.heroDescription : "",
  };
}
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
        content: true,
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
        content: mapContent(restaurant.content),
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
