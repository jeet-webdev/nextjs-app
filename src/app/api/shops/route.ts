import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

type ShopDelegate = {
  findMany: (args: {
    select: {
      id: true;
      name: true;
      category: true;
      city: true;
      rating: true;
      createdById: true;
      createdAt: true;
    };
    orderBy: { createdAt: "desc" };
  }) => Promise<
    Array<{
      id: string;
      name: string;
      category: string;
      city: string;
      rating: string;
      createdById: string;
      createdAt: Date;
    }>
  >;
  create: (args: {
    data: {
      name: string;
      category: string;
      city: string;
      rating: string;
      createdById: string;
    };
    select: {
      id: true;
      name: true;
      category: true;
      city: true;
      rating: true;
      createdById: true;
      createdAt: true;
    };
  }) => Promise<{
    id: string;
    name: string;
    category: string;
    city: string;
    rating: string;
    createdById: string;
    createdAt: Date;
  }>;
};

function getShopDelegate() {
  const delegate = (prisma as unknown as { shop?: ShopDelegate }).shop;

  if (!delegate) {
    return null;
  }

  return delegate;
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
    select: {
      id: true,
      userType: true,
    },
  });
}

export async function GET() {
  const currentUser = await getSessionUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shopDelegate = getShopDelegate();

  if (!shopDelegate) {
    return NextResponse.json(
      {
        error:
          "Shop model is not ready. Restart dev server and run prisma generate if needed.",
      },
      { status: 500 },
    );
  }

  try {
    const shops = await shopDelegate.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        city: true,
        rating: true,
        createdById: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ shops });
  } catch {
    return NextResponse.json({ error: "Unable to load shops." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const currentUser = await getSessionUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (currentUser.userType !== "OWNER") {
    return NextResponse.json({ error: "Only owner can create shops." }, { status: 403 });
  }

  const shopDelegate = getShopDelegate();

  if (!shopDelegate) {
    return NextResponse.json(
      {
        error:
          "Shop model is not ready. Restart dev server and run prisma generate if needed.",
      },
      { status: 500 },
    );
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const rating = typeof body.rating === "string" ? body.rating.trim() : "";

  if (!name || !category || !city || !rating) {
    return NextResponse.json(
      { error: "name, category, city and rating are required." },
      { status: 400 },
    );
  }

  try {
    const shop = await shopDelegate.create({
      data: {
        name,
        category,
        city,
        rating,
        createdById: currentUser.id,
      },
      select: {
        id: true,
        name: true,
        category: true,
        city: true,
        rating: true,
        createdById: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ shop }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create shop." }, { status: 500 });
  }
}
