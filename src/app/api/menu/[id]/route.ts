import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { type DietaryInfo, type Modifier } from "@/features/menu/types/menuTypes";
import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

type SessionUser = {
  id: string;
  userType: string;
};

type ModifierInput = {
  id?: string;
  name: string;
  price: number;
  menuContent: Record<string, unknown> | null;
};

const menuItemSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  discountedPrice: true,
  currency: true,
  dietary: true,
  isAvailable: true,
  preparationTime: true,
  ingredients: true,
  order: true,
  modifiers: true,
  category: true,
  subCategory: true,
  image: true,
  restaurantId: true,
  createdAt: true,
  updatedAt: true,
} as const;

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toString" in value &&
    typeof value.toString === "function"
  ) {
    const parsed = Number(value.toString());
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function parseRequiredString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function parseOptionalNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = toNumber(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseOptionalInteger(value: unknown): number | null {
  const parsed = parseOptionalNumber(value);
  return parsed === null ? null : Math.trunc(parsed);
}

function mapDietaryInfo(dietaryInfo: unknown): DietaryInfo | null {
  if (!dietaryInfo || typeof dietaryInfo !== "object") {
    return null;
  }

  const value = dietaryInfo as Partial<Record<keyof DietaryInfo, boolean>>;

  return {
    isVegan: typeof value.isVegan === "boolean" ? value.isVegan : false,
    isVegetarian: typeof value.isVegetarian === "boolean" ? value.isVegetarian : false,
    isSpicy: typeof value.isSpicy === "boolean" ? value.isSpicy : false,
    isSweet: typeof value.isSweet === "boolean" ? value.isSweet : false,
    isOily: typeof value.isOily === "boolean" ? value.isOily : false,
    isNutFree: typeof value.isNutFree === "boolean" ? value.isNutFree : false,
    isGlutenFree: typeof value.isGlutenFree === "boolean" ? value.isGlutenFree : false,
  };
}

function mapModifier(modifier: unknown): Modifier | null {
  if (!modifier || typeof modifier !== "object") {
    return null;
  }

  const value = modifier as Partial<Record<keyof Modifier, unknown>>;

  return {
    id: typeof value.id === "string" ? value.id : "",
    name: typeof value.name === "string" ? value.name : "",
    price: toNumber(value.price),
    menuContent:
      typeof value.menuContent === "object" && value.menuContent !== null && !Array.isArray(value.menuContent)
        ? (value.menuContent as Record<string, unknown>)
        : null,
  };
}

function parseModifiers(modifiers: unknown): ModifierInput[] {
  if (!Array.isArray(modifiers)) {
    return [];
  }

  return modifiers
    .map<ModifierInput | null>((modifier) => {
      if (!modifier || typeof modifier !== "object") {
        return null;
      }

      const value = modifier as Record<string, unknown>;
      const name = parseRequiredString(value.name);

      if (!name) {
        return null;
      }

      return {
        id: typeof value.id === "string" && value.id.trim() ? value.id : undefined,
        name,
        price: parseOptionalNumber(value.price) ?? 0,
        menuContent:
          typeof value.menuContent === "object" && value.menuContent !== null && !Array.isArray(value.menuContent)
            ? (value.menuContent as Record<string, unknown>)
            : null,
      } satisfies ModifierInput;
    })
    .filter((modifier): modifier is ModifierInput => modifier !== null);
}

function mapMenuItem(menuItem: {
  id: string;
  name: string;
  description: string | null;
  price: unknown;
  discountedPrice: unknown;
  currency: string;
  category: string;
  subCategory: string | null;
  image: string | null;
  dietary: unknown;
  isAvailable: boolean;
  preparationTime: number | null;
  ingredients: string | null;
  order: number;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
  modifiers: unknown;
}) {
  return {
    id: menuItem.id,
    name: menuItem.name,
    description: menuItem.description ?? "",
    price: toNumber(menuItem.price),
    discountedPrice: menuItem.discountedPrice === null ? null : toNumber(menuItem.discountedPrice),
    currency: menuItem.currency,
    category: menuItem.category,
    subCategory: menuItem.subCategory ?? "",
    image: menuItem.image ?? "",
    dietary: mapDietaryInfo(menuItem.dietary),
    isAvailable: menuItem.isAvailable,
    preparationTime: menuItem.preparationTime === null ? "" : String(menuItem.preparationTime),
    ingredients: menuItem.ingredients ?? "",
    order: menuItem.order,
    restaurantId: menuItem.restaurantId,
    createdAt: menuItem.createdAt.toISOString(),
    updatedAt: menuItem.updatedAt.toISOString(),
    modifiers: Array.isArray(menuItem.modifiers)
      ? menuItem.modifiers
          .map((modifier) => mapModifier(modifier))
          .filter((modifier): modifier is Modifier => modifier !== null)
      : [],
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

async function getAccessibleMenuItem(id: string, currentUser: SessionUser) {
  const menuItem = await prisma.menuItem.findUnique({
    where: { id },
    select: {
      id: true,
      restaurantId: true,
      restaurant: { select: { userId: true } },
    },
  });

  if (!menuItem) {
    return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  }

  const isAdmin = currentUser.userType === "ADMIN";
  const isOwner = currentUser.userType === "OWNER" && menuItem.restaurant.userId === currentUser.id;

  if (!isAdmin && !isOwner) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { menuItem };
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

  const access = await getAccessibleMenuItem(id, currentUser);

  if (access.error) {
    return access.error;
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.description === "string") data.description = parseOptionalString(body.description);
  if (body.price !== undefined) {
    const price = parseOptionalNumber(body.price);
    if (price !== null) data.price = price;
  }
  if (body.discountedPrice !== undefined) data.discountedPrice = parseOptionalNumber(body.discountedPrice);
  if (typeof body.currency === "string") data.currency = body.currency.trim();
  if (typeof body.categoryId === "string") data.categoryId = parseRequiredString(body.categoryId);
  if (typeof body.category === "string") data.category = body.category.trim();
  if (typeof body.subCategory === "string") data.subCategory = parseOptionalString(body.subCategory);
  if (typeof body.image === "string") data.image = parseOptionalString(body.image);
  if (body.dietary !== undefined) data.dietary = mapDietaryInfo(body.dietary) ?? Prisma.JsonNull;
  if (typeof body.isAvailable === "boolean") data.isAvailable = body.isAvailable;
  if (body.preparationTime !== undefined) data.preparationTime = parseOptionalInteger(body.preparationTime);
  if (typeof body.ingredients === "string") data.ingredients = parseOptionalString(body.ingredients);
  if (body.order !== undefined) data.order = parseOptionalInteger(body.order) ?? 0;
  if (Array.isArray(body.modifiers)) {
    const modifiers = parseModifiers(body.modifiers);
    data.modifiers = {
      set: [],
      connect: modifiers.filter((modifier) => modifier.id).map((modifier) => ({ id: modifier.id! })),
      create: modifiers
        .filter((modifier) => !modifier.id)
        .map((modifier) => ({
          name: modifier.name,
          price: modifier.price,
          menuContent: modifier.menuContent ?? Prisma.JsonNull,
        })),
    };
  }

  try {
    const updated = await prisma.menuItem.update({
      where: { id },
      data,
      select: menuItemSelect,
    });

    return NextResponse.json({ menuItem: mapMenuItem(updated) });
  } catch (error) {
   
    return NextResponse.json({ error: "Unable to update menu item" }, { status: 500 });
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

  const access = await getAccessibleMenuItem(id, currentUser);

  if (access.error) {
    return access.error;
  }

  try {
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete menu item" }, { status: 500 });
  }
}

// Menu API testing examples:
// PATCH /api/menu/<menuItemId>
// {
//   "name": "Updated Pizza",
//   "price": 13.5,
//   "discountedPrice": 11.99,
//   "isAvailable": true,
//   "preparationTime": 18,
//   "modifiers": [
//     {
//       "name": "Extra Cheese",
//       "price": 2.5,
//       "menuContent": { "portion": "large" }
//     }
//   ]
// }
// DELETE /api/menu/<menuItemId>