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

async function getAccessibleCategory(id: string, currentUser: SessionUser) {
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      ...categorySelect,
      restaurant: { select: { userId: true } },
    },
  });

  if (!category) {
    return { error: "Category not found.", status: 404 } as const;
  }

  const isAdmin = currentUser.userType === "ADMIN";
  const isOwner =
    currentUser.userType === "OWNER" &&
    category.restaurant.userId === currentUser.id;

  if (!isAdmin && !isOwner) {
    return { error: "Forbidden.", status: 403 } as const;
  }

  return { category };
}

// GET /api/category/[id]
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const isPublic = searchParams.get("public") === "true";

  try {
    if (isPublic) {
      const category = await prisma.category.findFirst({
        where: { id, isAvailable: true },
        select: categorySelect,
      });
      if (!category) {
        return NextResponse.json(
          { error: "Category not found." },
          { status: 404 },
        );
      }
      return NextResponse.json({ category: mapCategory(category) });
    }

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const access = await getAccessibleCategory(id, user);
    if ("error" in access) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    return NextResponse.json({ category: mapCategory(access.category) });
  } catch (err) {
  
    return NextResponse.json(
      { error: "Unable to load category." },
      { status: 500 },
    );
  }
}

// PATCH /api/category/[id]
// Body: { name?: string, isAvailable?: boolean, mealId?: string }
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

    const access = await getAccessibleCategory(id, user);
    if ("error" in access) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const updateData: { name?: string; description?: string; isAvailable?: boolean; mealId?: string, openingTime?: string, closingTime?: string } = {};

    if (body.name !== undefined) {
      const name = typeof body.name === "string" ? body.name.trim() : "";
      if (!name) {
        return NextResponse.json(
          { error: "name cannot be empty." },
          { status: 400 },
        );
      }
      updateData.name = name;
    }

    if (body.description !== undefined) {
      const description = typeof body.description === "string" ? body.description.trim() : "";
    
      updateData.description = description;
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


    

    if (body.openingTime !== undefined) {
      if(typeof body.openingTime !== "string" || !body.openingTime.trim()) {
        return NextResponse.json(
          { error: "openingTime must be a non-empty string." },
          { status: 400 },
        );
      }
      updateData.openingTime = body.openingTime;
    }
    if (body.closingTime !== undefined) {
      if(typeof body.closingTime !== "string" || !body.closingTime.trim()) {
        return NextResponse.json(
          { error: "closingTime must be a non-empty string." },
          { status: 400 },
        );
      }
      updateData.closingTime = body.closingTime;
    }


    if (body.mealId !== undefined) {
      const mealId = typeof body.mealId === "string" ? body.mealId.trim() : "";
      if (!mealId) {
        return NextResponse.json(
          { error: "mealId cannot be empty." },
          { status: 400 },
        );
      }

      
      const meal = await prisma.meal.findFirst({
        where: { id: mealId, restaurantId: access.category.restaurantId },
        select: { id: true },
      });

      if (!meal) {
        return NextResponse.json(
          { error: "Meal not found in this restaurant." },
          { status: 404 },
        );
      }

      updateData.mealId = mealId;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided to update." },
        { status: 400 },
      );
    }

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
      select: categorySelect,
    });

    return NextResponse.json({ category: mapCategory(updated) });
  } catch (err) {

    return NextResponse.json(
      { error: "Unable to update category." },
      { status: 500 },
    );
  }
}

// DELETE /api/category/[id]
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

    const access = await getAccessibleCategory(id, user);
    if ("error" in access) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
  
    return NextResponse.json(
      { error: "Unable to delete category." },
      { status: 500 },
    );
  }
}