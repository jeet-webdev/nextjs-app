
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { Decimal } from "@prisma/client/runtime/client";

type SessionUser = { id: string; userType: string };

const modifierSelect = {
  id: true,
  name: true,
  price: true,
  menuContent:true,
  noOfItem:true,
  inIncluded:true,
  menuItemId:true,
  categoryId: true,
  mealId: true,
  restaurantId: true,
//   createdAt: true,
//   updatedAt: true,
} as const;

function parseRequiredString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toDecimalString(val: Decimal | null | undefined): string | null {
  if (val === null || val === undefined) return null;
  return val.toString();
}

function mapModifier(item: {
  id: string;
  name: string;
  price: Decimal;
  menuContent: any;
  noOfCOntent: string;
  restaurantId: string;
  mealId: string;
  categoryId: string;
//   createdAt: Date;
//   updatedAt: Date;
}) {
  return {
    id: item.id,
    name: item.name,
    price: toDecimalString(item.price),
    menuContent: item.menuContent,
    // noOfItem: item.noOfItem,
    restaurantId: item.restaurantId,
    mealId: item.mealId,
    categoryId: item.categoryId,
    // createdAt: item.createdAt.toISOString(),
    // updatedAt: item.updatedAt.toISOString(),
  };
}

async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifyAuthToken(token);
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, userType: true },
  });
}

async function assertRestaurantAccess(
  restaurantId: string,
  currentUser: SessionUser
) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { id: true, userId: true },
  });

  if (!restaurant) return { error: "Restaurant not found.", status: 404 };

  if (
    currentUser.userType === "OWNER" &&
    restaurant.userId !== currentUser.id
  ) {
    return {
      error: "You do not have permission to manage this restaurant.",
      status: 403,
    };
  }

  return { restaurant };
}

// GET /api/modifier
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId")?.trim();
    const categoryId = searchParams.get("categoryId")?.trim();
    const mealId = searchParams.get("mealId")?.trim();
    const isPublic = searchParams.get("public") === "true";

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId query param is required." },
        { status: 400 }
      );
    }

    const where = {
      restaurantId,
      ...(categoryId ? { categoryId } : {}),
      ...(mealId ? { mealId } : {}),
      ...(isPublic ? { isAvailable: true } : {}),
    };

    // if (isPublic) {
    //   const items = await prisma.modifier.findMany({ where, select: modifierSelect });
    //   return NextResponse.json({ modifier: items.map(mapModifier) });
    // }

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const access = await assertRestaurantAccess(restaurantId, user);
    if ("error" in access) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

    // const items = await prisma.menuItem.findMany({ where, select: menuItemSelect });
    // return NextResponse.json({ menuItems: items.map(mapMenuItem) });
  } catch {
    return NextResponse.json({ error: "Unable to load menu items." }, { status: 500 });
  }
}
