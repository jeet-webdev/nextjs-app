import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma"; 

const ALLOWED_USER_TYPES = ["OWNER", "CUSTOMER", "ADMIN", "ADMINISTRATION"] as const;
const DASHBOARD_USER_TYPES = ["ADMIN", "ADMINISTRATION", "OWNER"] as const;

type AllowedUserType = (typeof ALLOWED_USER_TYPES)[number];
type DashboardUserType = (typeof DASHBOARD_USER_TYPES)[number];

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

export async function GET() {
  const currentUser = await getSessionUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!DASHBOARD_USER_TYPES.includes(currentUser.userType as DashboardUserType)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      userType: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ currentUser, users });
}

export async function POST(request: Request) {
  const currentUser = await getSessionUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const creatableUserTypes: AllowedUserType[] =
    currentUser.userType === "ADMIN" || currentUser.userType === "ADMINISTRATION"
      ? [...ALLOWED_USER_TYPES]
      : currentUser.userType === "OWNER"
        ? ["CUSTOMER"]
        : [];

  if (creatableUserTypes.length === 0) {
    return NextResponse.json(
      { error: "You do not have permission to create users." },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const userType =
      typeof body.userType === "string" &&
      ALLOWED_USER_TYPES.includes(body.userType as AllowedUserType)
        ? (body.userType as AllowedUserType)
        : null;

    if (!name || !email || !password || !phone || !userType) {
      return NextResponse.json(
        { error: "name, email, password, phone and userType are required." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    if (!creatableUserTypes.includes(userType)) {
      return NextResponse.json(
        {
          error:
            currentUser.userType === "ADMIN" || currentUser.userType === "ADMINISTRATION"
              ? "Admin and administrator can create any user type."
              : "Owner can only create users.",
        },
        { status: 403 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
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
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: unknown }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Email already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Unable to create user." }, { status: 500 });
  }
}
