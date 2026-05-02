
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { Decimal } from "@prisma/client/runtime/client";

type SessionUser = { id: string; userType: string };

const menuItemSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  image: true,
  isAvailable: true,
  restaurantId: true,
  mealId: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
} as const;

function parseRequiredString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toDecimalString(val: Decimal | null | undefined): string | null {
  if (val === null || val === undefined) return null;
  return val.toString();
}

function mapMenuItem(item: {
  id: string;
  name: string;
  description: string | null;
  price: Decimal;
  image: string | null;
  isAvailable: boolean;
  restaurantId: string;
  mealId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: toDecimalString(item.price),
    image: item.image,
    isAvailable: item.isAvailable,
    restaurantId: item.restaurantId,
    mealId: item.mealId,
    categoryId: item.categoryId,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
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

// GET /api/menuitem
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

    if (isPublic) {
      const items = await prisma.menuItem.findMany({ where, select: menuItemSelect });
      return NextResponse.json({ menuItems: items.map(mapMenuItem) });
    }

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const access = await assertRestaurantAccess(restaurantId, user);
    if ("error" in access) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

    const items = await prisma.menuItem.findMany({ where, select: menuItemSelect });
    return NextResponse.json({ menuItems: items.map(mapMenuItem) });
  } catch {
    return NextResponse.json({ error: "Unable to load menu items." }, { status: 500 });
  }
}


//get /api/menuitem/categoryId    that will show items only a specific category

//  http://localhost:3000/api/menuitem
// ?restaurantId=__
// &mealId=__
// &categoryId=__


// POST /api/menuitem
export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (user.userType !== "ADMIN" && user.userType !== "OWNER") {
      return NextResponse.json(
        { error: "Only admins or owners can create menu items." },
        { status: 403 }
      );
    }

    const raw = await request.json();

    const items = (Array.isArray(raw) ? raw : [raw]) as Record<string, unknown>[];

    if (items.length === 0) {
      return NextResponse.json({ error: "No items provided." }, { status: 400 });
    }

    for (let i = 0; i < items.length; i++) {
      const body = items[i];
      const label = items.length > 1 ? `Item ${i + 1}: ` : "";

      if (!parseRequiredString(body.name))
        return NextResponse.json({ error: `${label}name is required.` }, { status: 400 });
      if (!parseRequiredString(body.restaurantId))
        return NextResponse.json({ error: `${label}restaurantId is required.` }, { status: 400 });
      if (!parseRequiredString(body.mealId))
        return NextResponse.json({ error: `${label}mealId is required.` }, { status: 400 });
      if (!parseRequiredString(body.categoryId))
        return NextResponse.json({ error: `${label}categoryId is required.` }, { status: 400 });

      const price = Number(body.price);
      if (isNaN(price) || price < 0)
        return NextResponse.json({ error: `${label}price must be a non-negative number.` }, { status: 400 });
    }

    const restaurantId = parseRequiredString(items[0].restaurantId);
    const access = await assertRestaurantAccess(restaurantId, user);
    if ("error" in access) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

    const mealId = parseRequiredString(items[0].mealId);
    const categoryIds = [...new Set(items.map((b) => parseRequiredString(b.categoryId)))];
    const validCategories = await prisma.category.findMany({
      where: { id: { in: categoryIds }, restaurantId, mealId },
      select: { id: true },
    });
    const validCategoryIds = new Set(validCategories.map((c) => c.id));
    for (const body of items) {
      const cid = parseRequiredString(body.categoryId);
      if (!validCategoryIds.has(cid)) {
        return NextResponse.json(
          { error: `Category "${cid}" not found or does not belong to this restaurant/meal.` },
          { status: 404 }
        );
      }
    }

    // Create all items
    const created = await Promise.all(
      items.map((body) =>
        prisma.menuItem.create({
          data: {
            name: parseRequiredString(body.name),
            restaurantId: parseRequiredString(body.restaurantId),
            mealId: parseRequiredString(body.mealId),
            categoryId: parseRequiredString(body.categoryId),
            price: Number(body.price),
            description: typeof body.description === "string" ? body.description.trim() || null : null,
            image: typeof body.image === "string" ? body.image.trim() || null : null,
            isAvailable: typeof body.isAvailable === "boolean" ? body.isAvailable : true,
          },
          select: menuItemSelect,
        })
      )
    );

    
    if (created.length === 1) {
      return NextResponse.json(
        { menuItem: mapMenuItem(created[0]), menuItems: [mapMenuItem(created[0])] },
        { status: 201 }
      );
    }
    return NextResponse.json({ menuItems: created.map(mapMenuItem) }, { status: 201 });

  } catch {
    return NextResponse.json({ error: "Unable to create menu item." }, { status: 500 });
  }
}

