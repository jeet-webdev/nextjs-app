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
  image: true,
  isAvailable: true,
  restaurantId: true,
  mealId: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
} as const;

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

async function getAccessibleMenuItem(id: string, currentUser: SessionUser) {
  const item = await prisma.menuItem.findUnique({
    where: { id },
    select: {
      ...menuItemSelect,
      restaurant: { select: { userId: true } },
    },
  });

  if (!item) {
    return { error: "Menu item not found.", status: 404 } as const;
  }

  const isAdmin = currentUser.userType === "ADMIN";
  const isOwner =
    currentUser.userType === "OWNER" &&
    item.restaurant.userId === currentUser.id;

  if (!isAdmin && !isOwner) {
    return { error: "Forbidden.", status: 403 } as const;
  }

  return { item };
}

// GET /api/menuitem/[id]
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const isPublic = searchParams.get("public") === "true";

  try {
    if (isPublic) {
      const item = await prisma.menuItem.findFirst({
        where: { id, isAvailable: true },
        select: menuItemSelect,
      });

      if (!item) {
        return NextResponse.json(
          { error: "Menu item not found." },
          { status: 404 },
        );
      }

      return NextResponse.json({ menuItem: mapMenuItem(item) });
    }

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const access = await getAccessibleMenuItem(id, user);
    if ("error" in access) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    return NextResponse.json({ menuItem: mapMenuItem(access.item) });
  } catch (err) {
    console.error("[GET /api/menuitem/[id]]", err);
    return NextResponse.json(
      { error: "Unable to load menu item." },
      { status: 500 },
    );
  }
}

// PATCH /api/menuitem/[id]
// Body: any subset of { name, description, price, discountedPrice, currency,
//                       image, dietary, isAvailable, preparationTime, ingredients, order, categoryId, mealId }
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

    const access = await getAccessibleMenuItem(id, user);
    if ("error" in access) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const updateData: Record<string, unknown> = {};

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
      updateData.description =
        typeof body.description === "string"
          ? body.description.trim() || null
          : null;
    }

    if (body.price !== undefined) {
      const price = Number(body.price);
      if (isNaN(price) || price < 0) {
        return NextResponse.json(
          { error: "price must be a non-negative number." },
          { status: 400 },
        );
      }
      updateData.price = price;
    }

  

    if (body.image !== undefined) {
      updateData.image =
        typeof body.image === "string" ? body.image.trim() || null : null;
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

   

    // If moving to a different category, validate it belongs to the same restaurant
    if (body.categoryId !== undefined) {
      const categoryId =
        typeof body.categoryId === "string" ? body.categoryId.trim() : "";
      if (!categoryId) {
        return NextResponse.json(
          { error: "categoryId cannot be empty." },
          { status: 400 },
        );
      }

      const targetMealId =
        typeof body.mealId === "string"
          ? body.mealId.trim()
          : access.item.mealId;

      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          restaurantId: access.item.restaurantId,
          mealId: targetMealId,
        },
        select: { id: true },
      });

      if (!category) {
        return NextResponse.json(
          {
            error:
              "Category not found or does not belong to this restaurant/meal.",
          },
          { status: 404 },
        );
      }

      updateData.categoryId = categoryId;
    }

    if (body.mealId !== undefined) {
      const mealId =
        typeof body.mealId === "string" ? body.mealId.trim() : "";
      if (!mealId) {
        return NextResponse.json(
          { error: "mealId cannot be empty." },
          { status: 400 },
        );
      }

      const meal = await prisma.meal.findFirst({
        where: { id: mealId, restaurantId: access.item.restaurantId },
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

    const updated = await prisma.menuItem.update({
      where: { id },
      data: updateData,
      select: menuItemSelect,
    });

    return NextResponse.json({ menuItem: mapMenuItem(updated) });
  } catch (err) {
    console.error("[PATCH /api/menuitem/[id]]", err);
    return NextResponse.json(
      { error: "Unable to update menu item." },
      { status: 500 },
    );
  }
}

// DELETE /api/menuitem/[id]
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

    const access = await getAccessibleMenuItem(id, user);
    if ("error" in access) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    await prisma.menuItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/menuitem/[id]]", err);
    return NextResponse.json(
      { error: "Unable to delete menu item." },
      { status: 500 },
    );
  }
}