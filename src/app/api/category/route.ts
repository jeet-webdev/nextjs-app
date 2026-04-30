import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

type SessionUser = { id: string; userType: string };

const categorySelect = {
  id: true,
  name: true,
  description: true,
  isAvailable: true,
  openingTime: true,
  closingTime: true,
  restaurantId: true,
  mealId: true,
  createdAt: true,
  updatedAt: true,
} as const;

function parseRequiredString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function mapCategory(cat: {
  id: string;
  name: string;
  description: string | null;
  isAvailable: boolean;
  openingTime: string  | null;
  closingTime: string  | null;
  restaurantId: string;
  mealId: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...cat,
    createdAt: cat.createdAt.toISOString(),
    updatedAt: cat.updatedAt.toISOString(),
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

// GET /api/category?restaurantId=xxx
// GET /api/category?restaurantId=xxx&mealId=xxx   (filter by meal)
// GET /api/category?restaurantId=xxx&public=true  (no auth, available only)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId")?.trim();
    const mealId = searchParams.get("mealId")?.trim();
    const isPublic = searchParams.get("public") === "true";

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId query param is required." },
        { status: 400 },
      );
    }

    if (isPublic) {
      const categories = await prisma.category.findMany({
        where: {
          restaurantId,
          isAvailable: true,
          ...(mealId ? { mealId } : {}),
        },
        select: categorySelect,
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ categories: categories.map(mapCategory) });
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

    const categories = await prisma.category.findMany({
      where: {
        restaurantId,
        ...(mealId ? { mealId } : {}),
      },
      select: categorySelect,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ categories: categories.map(mapCategory) });
  } catch (err) {
    console.error("[GET /api/category]", err);
    return NextResponse.json(
      { error: "Unable to load categories." },
      { status: 500 },
    );
  }
}

// POST /api/category
// Body: { name: string, description: string, restaurantId: string, mealId: string, isAvailable?: boolean }
export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (user.userType !== "ADMIN" && user.userType !== "OWNER") {
      return NextResponse.json(
        { error: "Only admins or owners can create categories." },
        { status: 403 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const name = parseRequiredString(body.name);
    const description = parseRequiredString(body.description) || "";  // default to empty string if not provided
    const restaurantId = parseRequiredString(body.restaurantId);
    const mealId = parseRequiredString(body.mealId);
    const isAvailable =
      typeof body.isAvailable === "boolean" ? body.isAvailable : true;
    const openingTime = parseRequiredString(body.openingTime);
    const closingTime = parseRequiredString(body.closingTime);

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required." },
        { status: 400 },
      );
    }
    // if(!description) {
    //   return NextResponse.json(
    //     { error: "Category description is required." },
    //     { status: 400 },
    //   );
    // }


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
if (!openingTime) {
      return NextResponse.json(
        { error: "Opening time is required." },
        { status: 400 },
      );
    }
if (!closingTime) {
      return NextResponse.json(
        { error: "Closing time is required." },
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

    // Verify meal belongs to the same restaurant
    const meal = await prisma.meal.findFirst({
      where: { id: mealId, restaurantId },
      select: { id: true },
    });

    if (!meal) {
      return NextResponse.json(
        { error: "Meal not found in this restaurant." },
        { status: 404 },
      );
    }

    const category = await prisma.category.create({
      data: { name, description, isAvailable, restaurantId, mealId , openingTime, closingTime},  // default to always open
      select: categorySelect,
    });

    return NextResponse.json({ category: mapCategory(category) }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/category]", err);
    return NextResponse.json(
      { error: "Unable to create category." },
      { status: 500 },
    );
  }
}