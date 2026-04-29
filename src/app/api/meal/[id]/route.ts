import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

type SessionUser = { id: string; userType: string };

const mealSelect = {
  id: true,
  name: true,
  isAvailable: true,
  restaurantId: true,
  createdAt: true,
  updatedAt: true,
} as const;

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

/**
 * Find meal by ID and verify the current user has access to it.
 * ADMINs can access any meal; OWNERs only their own restaurant's meals.
 */
async function getAccessibleMeal(id: string, currentUser: SessionUser) {
  const meal = await prisma.meal.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      isAvailable: true,
      restaurantId: true,
      restaurant: { select: { userId: true } },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!meal) {
    return { error: "Meal not found.", status: 404 } as const;
  }

  const isAdmin = currentUser.userType === "ADMIN";
  const isOwner =
    currentUser.userType === "OWNER" &&
    meal.restaurant.userId === currentUser.id;

  if (!isAdmin && !isOwner) {
    return { error: "Forbidden.", status: 403 } as const;
  }

  return { meal };
}

// GET /api/meal/[id]
// ?public=true → no auth required, only if isAvailable
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const isPublic = searchParams.get("public") === "true";

  try {
    if (isPublic) {
      const meal = await prisma.meal.findFirst({
        where: { id, isAvailable: true },
        select: mealSelect,
      });

      if (!meal) {
        return NextResponse.json({ error: "Meal not found." }, { status: 404 });
      }

      return NextResponse.json({ meal: mapMeal(meal) });
    }

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const access = await getAccessibleMeal(id, user);
    if ("error" in access) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    return NextResponse.json({ meal: mapMeal(access.meal) });
  } catch (err) {
    console.error("[GET /api/meal/[id]]", err);
    return NextResponse.json(
      { error: "Unable to load meal." },
      { status: 500 },
    );
  }
}

// PATCH /api/meal/[id]
// Body: { name?: string, isAvailable?: boolean }
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const access = await getAccessibleMeal(id, user);
    if ("error" in access) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const updateData: { name?: string; isAvailable?: boolean } = {};

    if (body.name !== undefined) {
      const name =
        typeof body.name === "string" ? body.name.trim() : "";
      if (!name) {
        return NextResponse.json(
          { error: "name cannot be empty." },
          { status: 400 },
        );
      }
      updateData.name = name;
    }

    if (body.isAvailable !== undefined) {
      if (typeof body.isAvailable !== "boolean") {
        return NextResponse.json(
          { error: "isAvailable must be a boolean." },
          { status: 400 },
        );
      }
      updateData.isAvailable = body.isAvailable;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided to update." },
        { status: 400 },
      );
    }

    const updated = await prisma.meal.update({
      where: { id },
      data: updateData,
      select: mealSelect,
    });

    return NextResponse.json({ meal: mapMeal(updated) });
  } catch (err) {
    console.error("[PATCH /api/meal/[id]]", err);
    return NextResponse.json(
      { error: "Unable to update meal." },
      { status: 500 },
    );
  }
}

// DELETE /api/meal/[id]
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const access = await getAccessibleMeal(id, user);
    if ("error" in access) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    await prisma.meal.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/meal/[id]]", err);
    return NextResponse.json(
      { error: "Unable to delete meal." },
      { status: 500 },
    );
  }
}