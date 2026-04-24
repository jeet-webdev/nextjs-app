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

function toJsonInput(value: Record<string, unknown> | null): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  return value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
}

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

async function getMenuItemCounts(currentUser: SessionUser | null) {
  const [totalMenuItems, ownedMenuItems] = await Promise.all([
    prisma.menuItem.count(),
    currentUser?.userType === "OWNER"
      ? prisma.menuItem.count({ where: { restaurant: { is: { userId: currentUser.id } } } })
      : null,
  ]);

  return { totalMenuItems, ownedMenuItems };
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

    const menuItems = await prisma.menuItem.findMany({
      where,
      select: menuItemSelect,
      orderBy: { createdAt: "desc" },
      ...(isPublicRequest ? { take: 12 } : {}),
    });

    const counts = isPublicRequest ? null : await getMenuItemCounts(currentUser);

    return NextResponse.json({
      menuItems: menuItems.map(mapMenuItem),
      totalMenuItems: counts?.totalMenuItems ?? menuItems.length,
      ownedMenuItems: counts?.ownedMenuItems ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Unable to load menu items." }, { status: 500 });
  }
}

const ALLOWED_CREATORS = ["ADMIN", "OWNER"] as const;
type AllowedCreator = (typeof ALLOWED_CREATORS)[number];

export async function POST(request: Request) {
  const currentUser = await getSessionUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ALLOWED_CREATORS.includes(currentUser.userType as AllowedCreator)) {
    return NextResponse.json(
      { error: "Only admins or owners can create menu items." },
      { status: 403 },
    );
  }

  const body = await request.json();
  const restaurantId = parseRequiredString(body.restaurantId);
  const name = parseRequiredString(body.name);
  const category = parseRequiredString(body.category);
  const price = parseOptionalNumber(body.price);
  const currency = parseRequiredString(body.currency) || "USD";
  const description = parseOptionalString(body.description);
  const discountedPrice = parseOptionalNumber(body.discountedPrice);
  const subCategory = parseOptionalString(body.subCategory);
  const image = parseOptionalString(body.image);
  const dietary =
    body.dietary === undefined
      ? undefined
      : mapDietaryInfo(body.dietary)
        ? toJsonInput(mapDietaryInfo(body.dietary) as unknown as Record<string, unknown>)
        : Prisma.JsonNull;
  const isAvailable = typeof body.isAvailable === "boolean" ? body.isAvailable : true;
  const preparationTime = parseOptionalInteger(body.preparationTime);
  const ingredients = parseOptionalString(body.ingredients);
  const itemOrder = parseOptionalInteger(body.order) ?? 0;
  const modifiers = parseModifiers(body.modifiers);

  if (!restaurantId || !name || !category || price === null) {
    return NextResponse.json(
      { error: "restaurantId, name, category and price are required." },
      { status: 400 },
    );
  }

//   const access = await assertRestaurantAccess(restaurantId, currentUser);

//   if (access.error) {
//     return access.error;
//   }

  try {
    const createdMenuItem = await prisma.menuItem.create({
      data: {
        restaurantId,
        name,
        description,
        price,
        discountedPrice,
        currency,
        category,
        subCategory,
        image,
        dietary,
        isAvailable,
        preparationTime,
        ingredients,
        order: itemOrder,
        modifiers: modifiers.length
          ? {
              connect: modifiers.filter((modifier) => modifier.id).map((modifier) => ({ id: modifier.id! })),
              create: modifiers
                .filter((modifier) => !modifier.id)
                .map((modifier) => ({
                  name: modifier.name,
                  price: modifier.price,
                  menuContent: toJsonInput(modifier.menuContent),
                })),
            }
          : undefined,
      },
      select: { id: true },
    });

    const menuItem = await prisma.menuItem.findUniqueOrThrow({
      where: { id: createdMenuItem.id },
      select: menuItemSelect,
    });

    return NextResponse.json({ menuItem: mapMenuItem(menuItem) }, { status: 201 });
  } catch (error) {
  
    return NextResponse.json({ error: "Unable to create menu item." }, { status: 500 });
  }
}
