import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

type SessionUser = {
  id: string;
  userType: string;
};

const categorySelect = {
  id: true,
  name: true,
  isAvailable: true,
  restaurantId: true,
  createdAt: true,
  updatedAt: true,
} as const;

function parseRequiredString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function mapCategory(category: {
  id: string;
  name: string;
  isAvailable: boolean;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: category.id,
    name: category.name,
    isAvailable: category.isAvailable,
    restaurantId: category.restaurantId,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
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
    select: { id: true, userType: true },
  });
}

async function assertRestaurantAccess(restaurantId: string, currentUser: SessionUser) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { id: true, userId: true },
  });

  if (!restaurant) {
    return { error: NextResponse.json({ error: "Restaurant not found." }, { status: 404 }) };
  }

  if (currentUser.userType === "OWNER" && restaurant.userId !== currentUser.id) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { restaurant };
}

async function getCategoryCounts(currentUser: SessionUser | null) {
  const [totalCategory, ownedCategory] = await Promise.all([
    prisma.category.count(),
    currentUser?.userType === "OWNER"
      ? prisma.category.count({ where: { restaurant: { is: { userId: currentUser.id } } } })
      : null,
  ]);

  return { totalCategory, ownedCategory };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublicRequest = searchParams.get("public") === "true";
    const restaurantId = searchParams.get("restaurantId")?.trim() || null;
    let currentUser = null;

    if (!isPublicRequest) {
      currentUser = await getSessionUser();

      if (!currentUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (restaurantId && currentUser?.userType === "OWNER") {
      const access = await assertRestaurantAccess(restaurantId, currentUser);

      if (access.error) {
        return access.error;
      }
    }

    const where = isPublicRequest
      ? {
          ...(restaurantId ? { restaurantId } : {}),
          isAvailable: true,
        }
      : currentUser?.userType === "OWNER"
        ? {
            restaurant: { is: { userId: currentUser.id } },
            ...(restaurantId ? { restaurantId } : {}),
          }
        : restaurantId
          ? { restaurantId }
          : undefined;

    const categories = await prisma.category.findMany({
      where,
      select: categorySelect,
      orderBy: { createdAt: "desc" },
      ...(isPublicRequest ? { take: 12 } : {}),
    });

    const counts = isPublicRequest ? null : await getCategoryCounts(currentUser);

    return NextResponse.json({
      category: categories.map(mapCategory),
      totalCategory: counts?.totalCategory ?? categories.length,
      ownedCategory: counts?.ownedCategory ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Unable to load category." }, { status: 500 });
  }
}

const ALLOWED_CREATORS = ["ADMIN", "OWNER"] as const;
type AllowedCreator = (typeof ALLOWED_CREATORS)[number];

export async function POST(request: Request) {
  const currentUser = await getSessionUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Only admins or owners can create category items." }, { status: 401 });
  }

  if (!ALLOWED_CREATORS.includes(currentUser.userType as AllowedCreator)) {
    return NextResponse.json(
      { error: "Only admins or owners can create category items." },
      { status: 403 },
    );
  }

  const body = await request.json();
  const restaurantId = parseRequiredString(body.restaurantId);
  const name = parseRequiredString(body.name);
  const isAvailable = typeof body.isAvailable === "boolean" ? body.isAvailable : true;

  if (!restaurantId || !name) {
    return NextResponse.json(
      { error: "restaurantId and name are required." },
      { status: 400 },
    );
  }

  const access = await assertRestaurantAccess(restaurantId, currentUser);

  if (access.error) {
    return access.error;
  }

  try {
    const createdCategory = await prisma.category.create({
      data: {
        restaurantId,
        name,
        isAvailable,
      },
      select: categorySelect,
    });

    return NextResponse.json({ category: mapCategory(createdCategory) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create category." }, { status: 500 });
  }
}