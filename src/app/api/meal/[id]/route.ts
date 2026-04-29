import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

type SessionUser = {
  id: string;
  userType: string;
};

const mealSelect = {
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

function mapMeal(meal: {
  id: string;
  name: string;
  isAvailable: boolean;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: meal.id,
    name: meal.name,
    isAvailable: meal.isAvailable,
    restaurantId: meal.restaurantId,
    createdAt: meal.createdAt.toISOString(),
    updatedAt: meal.updatedAt.toISOString(),
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

async function getAccessibleMeal(id: string, currentUser: SessionUser) {
  const meal = await prisma.meal.findUnique({
    where: { id },
    select: {
      id: true,
      restaurantId: true,
      restaurant: { select: { userId: true } },
    },
  });

  if (!meal) {
    return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  }

  const isAdmin = currentUser.userType === "ADMIN";
  const isOwner = currentUser.userType === "OWNER" && meal.restaurant.userId === currentUser.id;

  if (!isAdmin && !isOwner) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { meal };
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const isPublicRequest = searchParams.get("public") === "true";

  try {
    if (isPublicRequest) {
      const meal = await prisma.meal.findFirst({
        where: { id, isAvailable: true },
        select: mealSelect,
      });

      if (!meal) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      return NextResponse.json({ meal: mapMeal(meal) });
    }

    const currentUser = await getSessionUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getAccessibleMeal(id, currentUser);

    if (access.error) {
      return access.error;
    }

    const meal = await prisma.meal.findUnique({
      where: { id },
      select: mealSelect,
    });

    if (!meal) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ meal: mapMeal(meal) });
  } catch {
    return NextResponse.json({ error: "Unable to load meal." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const currentUser = await getSessionUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const access = await getAccessibleMeal(id, currentUser);

  if (access.error) {
    return access.error;
  }

  const body = await request.json();
  const data: {
    name?: string;
    isAvailable?: boolean;
    restaurantId?: string;
  } = {};

  if (typeof body.name === "string") {
    const name = body.name.trim();

    if (!name) {
      return NextResponse.json({ error: "name cannot be empty." }, { status: 400 });
    }

    data.name = name;
  }

  if (typeof body.isAvailable === "boolean") {
    data.isAvailable = body.isAvailable;
  }

  if (body.restaurantId !== undefined) {
    const restaurantId = parseRequiredString(body.restaurantId);

    if (!restaurantId) {
      return NextResponse.json({ error: "restaurantId cannot be empty." }, { status: 400 });
    }

    const restaurantAccess = await assertRestaurantAccess(restaurantId, currentUser);

    if (restaurantAccess.error) {
      return restaurantAccess.error;
    }

    data.restaurantId = restaurantId;
  }

  try {
    const updated = await prisma.meal.update({
      where: { id },
      data,
      select: mealSelect,
    });

    return NextResponse.json({ meal: mapMeal(updated) });
  } catch {
    return NextResponse.json({ error: "Unable to update meal." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const currentUser = await getSessionUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const access = await getAccessibleMeal(id, currentUser);

  if (access.error) {
    return access.error;
  }

  try {
    await prisma.meal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete meal." }, { status: 500 });
  }
}