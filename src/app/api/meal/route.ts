import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

type SessionUser = { id: string; userType: string };

const mealSelect = {
  id: true,
  name: true,
  isAvailable: true,
  // alwaysAvailable: true,
  description: true,
  openingTime: true,
  closingTime: true,
  restaurantId: true,
  createdAt: true,
  updatedAt: true,
} as const;

function parseRequiredString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}



function mapMeal(meal: {
  id: string;
  name: string;
  isAvailable: boolean;
  // alwaysAvailable: boolean;
  description: string | null;
  openingTime: string  | null;
  closingTime: string  | null;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: meal.id,
    name: meal.name,
    isAvailable: meal.isAvailable,
    description: meal.description,
    openingTime: meal.openingTime,
    closingTime: meal.closingTime,
    restaurantId: meal.restaurantId,
    // alwaysAvailable: meal.alwaysAvailable,
    createdAt: meal.createdAt.toISOString(),
    updatedAt: meal.updatedAt.toISOString(),
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
): Promise<
  | { restaurant: { id: string; userId: string }; error?: never; status?: never }
  | { error: string; status: number; restaurant?: never }
> {
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

// GET /api/meal?restaurantId=xxx
// GET /api/meal?restaurantId=xxx&public=true  (no auth required, only available meals)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId")?.trim();
    const isPublic = searchParams.get("public") === "true";

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId query param is required." },
        { status: 400 },
      );
    }

    // Public route — no auth, only available meals
    if (isPublic) {
      const meals = await prisma.meal.findMany({
        where: { restaurantId, isAvailable: true },
        select: mealSelect,
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ meals: meals.map(mapMeal) });
    }

    // Private route — auth required
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

    const meals = await prisma.meal.findMany({
      where: { restaurantId },
      select: mealSelect,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ meals: meals.map(mapMeal) });
  } catch (err) {
    console.error("[GET /api/meal]", err);
    return NextResponse.json(
      { error: "Unable to load meals." },
      { status: 500 },
    );
  }
}

// POST /api/meal
// Body: { name: string, restaurantId: string, isAvailable?: boolean, openingTime?: string, closingTime?: string }
export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (user.userType !== "ADMIN" && user.userType !== "OWNER") {
      return NextResponse.json(
        { error: "Only admins or owners can create meals." },
        { status: 403 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const name = parseRequiredString(body.name);
    const description = parseRequiredString(body.description) || "";  // default to empty string if not provided
    const restaurantId = parseRequiredString(body.restaurantId);
    const isAvailable =
      typeof body.isAvailable === "boolean" ? body.isAvailable : true;
    // const alwaysAvailable =
    //   typeof body.alwaysAvailable === "boolean" ? body.alwaysAvailable : false;
    // const description =
    //   typeof body.description === "string" ? body.description.trim() : "";
    const openingTime = parseRequiredString(body.openingTime);
    const closingTime = parseRequiredString(body.closingTime);

    if (!name) {
      return NextResponse.json(
        { error: "Meal name is required." },
        { status: 400 },
      );
    }

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId is required." },
        { status: 400 },
      );
    }

    const access = await assertRestaurantAccess(restaurantId, user);
    if (access.error) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    const meal = await prisma.meal.create({
       data: { name, isAvailable, restaurantId , openingTime, closingTime, description},    //  alwaysAvailable,
      select: mealSelect,
    });

    return NextResponse.json({ meal: mapMeal(meal) }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/meal]", err);
    return NextResponse.json(
      { error: "Unable to create meal." },
      { status: 500 },
    );
  }
}