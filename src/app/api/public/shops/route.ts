import { NextResponse } from "next/server";

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
    take: number;
  }) => Promise<
    Array<{
      id: string;
      name: string;
      category: string;
      city: string;
      rating: string;
      createdById: string;//
      createdAt: Date;
    }>
  >;
};

function getShopDelegate() {
  const delegate = (prisma as unknown as { shop?: ShopDelegate }).shop;

  if (!delegate) {
    return null;
  }

  return delegate;
}

export async function GET() {
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
      take: 12,
    });

    return NextResponse.json({ shops });
  } catch {
    return NextResponse.json({ error: "Unable to load shops." }, { status: 500 });
  }
}
