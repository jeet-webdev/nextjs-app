import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { type ContactDetails } from "@/features/restaurants/types";

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
function mapRestaurant(restaurant: {
  id: string;
  name: string;
  category: string;
  city: string;
  slug: string;
  Address: string | null;
  logo: string | null;
  contactInfo?: any;
  seoTitle: string | null;
  seoDescription: string | null;
  status: "OPEN" | "CLOSED";
  userId: string;
  createdAt: Date;
  content?: any;
})
 {
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

  if (!token) return null;

  const session = await verifyAuthToken(token);
  if (!session) return null;

  return prisma.user.findUnique({ where: { id: session.sub }, select: { id: true, userType: true } });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const currentUser = await getSessionUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isAdmin = currentUser.userType === "ADMIN";
  const isOwner = currentUser.userType === "OWNER" && restaurant.userId === currentUser.id;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.category === "string") data.category = body.category.trim();
  if (typeof body.city === "string") data.city = body.city.trim();
  if (typeof body.slug === "string") data.slug = body.slug.trim();
  if (typeof body.address === "string") data.Address = body.address.trim();
  if (typeof body.logo === "string") data.logo = body.logo.trim();
  if (body.contactInfo && typeof body.contactInfo === "object") {
    const contactInfo: ContactDetails = {
      phone: typeof body.contactInfo.phone === "string" ? body.contactInfo.phone.trim() : "",
      email: typeof body.contactInfo.email === "string" ? body.contactInfo.email.trim() : "",
      openingHours: typeof body.contactInfo.openingHours === "string" ? body.contactInfo.openingHours.trim() : "",
      closingHours: typeof body.contactInfo.closingHours === "string" ? body.contactInfo.closingHours.trim() : "",
      website: typeof body.contactInfo.website === "string" ? body.contactInfo.website.trim() : "",
    };
    data.contactInfo = contactInfo;
  }

  if(body.content && typeof body.content === "object") {
    const content = {
      title: typeof body.content.title === "string" ? body.content.title.trim() : "",
      description: typeof body.content.description === "string" ? body.content.description.trim() : "",
      imageUrl: typeof body.content.imageUrl === "string" ? body.content.imageUrl.trim() : "",
      menuBookUrl: typeof body.content.menuBookUrl === "string" ? body.content.menuBookUrl.trim() : "",
    };
    data.content = content;
  }




  if (typeof body.seoTitle === "string") data.seoTitle = body.seoTitle.trim();
  if (typeof body.seoDescription === "string") data.seoDescription = body.seoDescription.trim();

  try {
    const updated = await prisma.restaurant.update({
      where: { id },
      data,
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
    return NextResponse.json({ restaurant: mapRestaurant(updated) });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return NextResponse.json({ error: "Unable to update restaurant" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }, 
) {
  const { id } = await context.params;

  const currentUser = await getSessionUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isAdmin = currentUser.userType === "ADMIN";
  const isOwner = currentUser.userType === "OWNER" && restaurant.userId === currentUser.id;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.restaurant.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete restaurant" }, { status: 500 });
  }
}
