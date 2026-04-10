import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifyAuthToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const totalUsers = await prisma.user.count();

  return NextResponse.json({ totalUsers });
}
//