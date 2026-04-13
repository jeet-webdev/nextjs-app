import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { JWT_COOKIE_NAME, verifyAuthToken, type AuthUserType } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

const ADMIN_USER_TYPES = ["ADMIN", "ADMINISTRATION"] as const;

type AdminUserType = (typeof ADMIN_USER_TYPES)[number];

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
      name: true,
      email: true,
      userType: true,
    },
  });
}

export async function POST(request: Request) {
  try {
    const currentUser = await getSessionUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdminUser = ADMIN_USER_TYPES.includes(currentUser.userType as AdminUserType);

    if (!isAdminUser) {
      return NextResponse.json(
        { error: "You do not have permission to create administrator accounts." },
        { status: 403 },
      );
    }

    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";
    const userType =
      typeof body.userType === "string" && ADMIN_USER_TYPES.includes(body.userType as AdminUserType)
        ? (body.userType as AdminUserType)
        : "ADMIN";

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "name, email, password, and confirmPassword are required." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        userType,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        userType: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Email already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Unable to create administrator account." }, { status: 500 });
  }
}
