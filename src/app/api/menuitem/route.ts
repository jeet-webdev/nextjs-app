import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
// import { Decimal } from "@prisma/client/runtime/library";
import { Decimal } from "@prisma/client/runtime/client";

type SessionUser = { id: string; userType: string };

const menuItemSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  discountedPrice: true,
  currency: true,
  image: true,
  dietary: true,
  isAvailable: true,
  preparationTime: true,
  ingredients: true,
  order: true,
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
  discountedPrice: Decimal | null;
  currency: string;
  image: string | null;
  dietary: unknown;
  isAvailable: boolean;
  preparationTime: number | null;
  ingredients: string | null;
  order: number;
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
    discountedPrice: toDecimalString(item.discountedPrice),
    currency: item.currency,
    image: item.image,
    dietary: item.dietary,
    isAvailable: item.isAvailable,
    preparationTime: item.preparationTime,
    ingredients: item.ingredients,
    order: item.order,
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
  currentUser: SessionUser,
) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { id: true, userId: true },
  });

  if (!restaurant) {
    return { error: "Restaurant not found.", status: 404 };
  }

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

// GET /api/menuitem?restaurantId=xxx
// GET /api/menuitem?restaurantId=xxx&categoryId=xxx
// GET /api/menuitem?restaurantId=xxx&mealId=xxx
// GET /api/menuitem?restaurantId=xxx&public=true  (no auth, available only)
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
        { status: 400 },
      );
    }

    const where = {
      restaurantId,
      ...(categoryId ? { categoryId } : {}),
      ...(mealId ? { mealId } : {}),
      ...(isPublic ? { isAvailable: true } : {}),
    };

    if (isPublic) {
      const items = await prisma.menuItem.findMany({
        where,
        select: menuItemSelect,
      });
      return NextResponse.json({ menuItems: items.map(mapMenuItem) });
    }

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const access = await assertRestaurantAccess(restaurantId, user);
    if (access.error) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    const items = await prisma.menuItem.findMany({
      where,
      select: menuItemSelect,
    });

    return NextResponse.json({ menuItems: items.map(mapMenuItem) });
  } catch (err) {
    console.error("[GET /api/menuitem]", err);
    return NextResponse.json(
      { error: "Unable to load menu items." },
      { status: 500 },
    );
  }
}

// POST /api/menuitem
// Body: { name, price, restaurantId, mealId, categoryId, description?, discountedPrice?,
//         currency?, image?, dietary?, isAvailable?, preparationTime?, ingredients?, order? }
export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (user.userType !== "ADMIN" && user.userType !== "OWNER") {
      return NextResponse.json(
        { error: "Only admins or owners can create menu items." },
        { status: 403 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    const name = parseRequiredString(body.name);
    const restaurantId = parseRequiredString(body.restaurantId);
    const mealId = parseRequiredString(body.mealId);
    const categoryId = parseRequiredString(body.categoryId);

    if (!name) {
      return NextResponse.json(
        { error: "name is required." },
        { status: 400 },
      );
    }
    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId is required." },
        { status: 400 },
      );
    }
    if (!mealId) {
      return NextResponse.json(
        { error: "mealId is required." },
        { status: 400 },
      );
    }
    if (!categoryId) {
      return NextResponse.json(
        { error: "categoryId is required." },
        { status: 400 },
      );
    }

    const price = Number(body.price);
    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "price must be a non-negative number." },
        { status: 400 },
      );
    }

    // Verify restaurant access
    const access = await assertRestaurantAccess(restaurantId, user);
    if (access.error) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    // Verify category belongs to the same restaurant and meal
    const category = await prisma.category.findFirst({
      where: { id: categoryId, restaurantId, mealId },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json(
        {
          error:
            "Category not found or does not belong to the given restaurant and meal.",
        },
        { status: 404 },
      );
    }

    const discountedPrice =
      body.discountedPrice !== undefined && body.discountedPrice !== null
        ? Number(body.discountedPrice)
        : null;

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        restaurantId,
        mealId,
        categoryId,
        price,
        description:
          typeof body.description === "string"
            ? body.description.trim() || null
            : null,
        image:
          typeof body.image === "string" ? body.image.trim() || null : null,
          isAvailable:
          typeof body.isAvailable === "boolean" ? body.isAvailable : true,
       
        
      },
      select: menuItemSelect,
    });

    return NextResponse.json(
      { menuItem: mapMenuItem(menuItem) },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/menuitem]", err);
    return NextResponse.json(
      { error: "Unable to create menu item." },
      { status: 500 },
    );
  }
}