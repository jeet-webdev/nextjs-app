import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { type ContactDetails } from "@/features/restaurants/types";
import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
function mapContent(content: unknown): { title: string; description: string; imageUrl: string; menuBookUrl: string } | null {
  if (!content || typeof content !== "object") {
    return null;
  }
  const value = content as Partial<{ title: unknown; description: unknown; imageUrl: unknown; menuBookUrl: unknown }>;
  return {
    title: typeof value.title === "string" ? value.title : "",
    description: typeof value.description === "string" ? value.description : "",
    imageUrl: typeof value.imageUrl === "string" ? value.imageUrl : "",
    menuBookUrl: typeof value.menuBookUrl === "string" ? value.menuBookUrl : "",
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

function mapRestaurant(restaurant: {
  id: string;
  name: string;
  category: string;
  city: string;
  slug: string;
  Address: string | null;
  logo: string | null;
  contactInfo: unknown;
  content: unknown;

  seoTitle: string | null;
  seoDescription: string | null;
  status: "OPEN" | "CLOSED";
  userId: string;
  createdAt: Date;
}) {
  return {
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
  };
}

async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await verifyAuthToken(token);

  if (!session) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      userType: true,
    },
  });
}

async function getRestaurantCounts(currentUser: { id: string; userType: string } | null) {
  const totalRestaurants = await prisma.restaurant.count();

  if (currentUser?.userType !== "OWNER") {
    return {
      totalRestaurants,
      ownedRestaurants: null,
    };
  }

  const ownedRestaurants = await prisma.restaurant.count({
    where: { userId: currentUser.id },
  });

  return {
    totalRestaurants,
    ownedRestaurants,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublicRequest = searchParams.get("public") === "true";
    let currentUser = null;

    if (!isPublicRequest) {
      currentUser = await getSessionUser();

      if (!currentUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const restaurants = await prisma.restaurant.findMany({
      where: isPublicRequest
        ? undefined
        : currentUser?.userType === "OWNER"
          ? { userId: currentUser.id }
          : undefined,
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
      orderBy: { createdAt: "desc" },
      ...(isPublicRequest ? { take: 12 } : {}),
    });

    const counts = isPublicRequest ? null : await getRestaurantCounts(currentUser);

    return NextResponse.json({
      restaurants: restaurants.map(mapRestaurant),
      totalRestaurants: counts?.totalRestaurants ?? restaurants.length,
      ownedRestaurants: counts?.ownedRestaurants ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Unable to load restaurants." }, { status: 500 });
  }
}

const ALLOWED_CREATORS = ["ADMIN", "OWNER"] as const;

type AllowedCreator = (typeof ALLOWED_CREATORS)[number];

export async function POST(request: Request) {
  const currentUser = await getSessionUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ALLOWED_CREATORS.includes(currentUser.userType as AllowedCreator)) {
    return NextResponse.json({ error: "Only admins or owners can create restaurants." }, { status: 403 });
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : null;
  const logo = typeof body.logo === "string" ? body.logo.trim() : null;
  const seoTitle = typeof body.seoTitle === "string" ? body.seoTitle.trim() : null;
  const seoDescription = typeof body.seoDescription === "string" ? body.seoDescription.trim() : null;
  const contactInfo = mapContactInfo(body.contactInfo);
  const content = mapContent(body.content);

  if (!name || !category || !city || !address) {
    return NextResponse.json({ error: "name, category, city and address are required." }, { status: 400 });
  }

  const normalizedSlug = (slug || name)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  try {
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        category,
        city,
        slug: normalizedSlug,
        Address: address,
        logo: logo ?? undefined,
        contactInfo: contactInfo ?? undefined,
        seoTitle: seoTitle ?? undefined,
        seoDescription: seoDescription ?? undefined,
        content: content ?? undefined,
        userId: currentUser.id,
      },
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

    return NextResponse.json({ restaurant: mapRestaurant(restaurant) }, { status: 201 });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json({ error: "Unable to create restaurant." }, { status: 500 });
  }
}
