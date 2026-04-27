import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { normalizePhoneInput, parsePhoneForStorage, serializeUserPhone } from "@/shared/lib/user-phone";

const ALLOWED_USER_TYPES = ["OWNER", "CUSTOMER", "ADMIN"] as const;
const DASHBOARD_USER_TYPES = ["ADMIN", "OWNER"] as const;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

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

function parsePositiveInteger(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
}

// export async function GET(request: Request) {
//   const currentUser = await getSessionUser();

//   if (!currentUser) {
//     return NextResponse.json({ error: "Only ADMIN and OWNER can acceess this data " }, { status: 401 });
//   }

//   if (!DASHBOARD_USER_TYPES.includes(currentUser.userType as DashboardUserType)) {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }

//   const { searchParams } = new URL(request.url);
//   const page = parsePositiveInteger(searchParams.get("page"), DEFAULT_PAGE);
//   const requestedLimit = parsePositiveInteger(searchParams.get("limit"), DEFAULT_LIMIT);
//   const limit = Math.min(requestedLimit, MAX_LIMIT);
//   const skip = (page - 1) * limit;
//   const whereClause: Prisma.UserWhereInput = {};

//   if (currentUser.userType === "OWNER") {
//     whereClause.userType = "CUSTOMER";
//   }

//   const [users, totalUsers, groupedCounts] = await Promise.all([
//     prisma.user.findMany({
//       where: whereClause,
//       skip,
//       take: limit,
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         phone: true,
//         userType: true,
//         createdAt: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     }),
//     prisma.user.count({ where: whereClause }),
//     prisma.user.groupBy({
//       by: ["userType"],
//       where: whereClause,
//       _count: {
//         _all: true,
//       },
//     }),
//   ]);

//   const stats = {
//     total: totalUsers,
//     admins: 0,
//     owners: 0,
//     customers: 0,
//   };

//   for (const countGroup of groupedCounts) {
//     if (countGroup.userType === "ADMIN") {
//       stats.admins = countGroup._count._all;
//     }

//     if (countGroup.userType === "OWNER") {
//       stats.owners = countGroup._count._all;
//     }

//     if (countGroup.userType === "CUSTOMER") {
//       stats.customers = countGroup._count._all;
//     }
//   }

//   return NextResponse.json({
//     currentUser,
//     users: users.map(serializeUserPhone),
//     pagination: {
//       page,
//       limit,
//       totalItems: totalUsers,
//       totalPages: Math.max(1, Math.ceil(totalUsers / limit)),
//     },
//     stats,
//   });
// }


async function getAbsoluteTotal() {
  return await prisma.user.count();
}

export async function GET(request: Request) {
  const currentUser = await getSessionUser();
 
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!DASHBOARD_USER_TYPES.includes(currentUser.userType as DashboardUserType)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

 
  const { searchParams } = new URL(request.url);
  const page = parsePositiveInteger(searchParams.get("page"), DEFAULT_PAGE);
  const requestedLimit = parsePositiveInteger(searchParams.get("limit"), DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const skip = (page - 1) * limit;

 
  const whereClause: Prisma.UserWhereInput = {};
  if (currentUser.userType === "OWNER") {
    whereClause.userType = "CUSTOMER";
  }

  
  const [users, filteredCount, absoluteTotal, groupedCounts] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        userType: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where: whereClause }),  //this is for pagination
    prisma.user.count(),                        //for total count of user only show by admin
    prisma.user.groupBy({
      by: ["userType"],
      where: whereClause,
      _count: { _all: true },
    }),
  ]);

  
  const stats = {
    total: filteredCount,
    admins: 0,
    owners: 0,
    customers: 0,
  };

  for (const countGroup of groupedCounts) {
    if (countGroup.userType === "ADMIN") stats.admins = countGroup._count._all;
    if (countGroup.userType === "OWNER") stats.owners = countGroup._count._all;
    if (countGroup.userType === "CUSTOMER") stats.customers = countGroup._count._all;
  }


  return NextResponse.json({
  
    totalUsers: currentUser.userType !== "OWNER" ? absoluteTotal : filteredCount,
    currentUser,
    users: users.map(serializeUserPhone),
    pagination: {
      page,
      limit,
      totalItems: filteredCount,
      totalPages: Math.max(1, Math.ceil(filteredCount / limit)),
    },
    stats,
  });
}


export async function POST(request: Request) {
  const currentUser = await getSessionUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const creatableUserTypes: AllowedUserType[] =
    currentUser.userType === "ADMIN"
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
    const phoneInput = normalizePhoneInput(body.phone);
    const phone = parsePhoneForStorage(body.phone);
    const userType =
      typeof body.userType === "string" &&
      ALLOWED_USER_TYPES.includes(body.userType as AllowedUserType)
        ? (body.userType as AllowedUserType)
        : null;

    if (!name || !email || !password || !phoneInput || !phone || !userType) {
      return NextResponse.json(
        { error: "Invalid Details please fix and ALL Input Fields are required." },
        { status: 400 },
      );
    }

    if (!phone) {
      return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    if (!creatableUserTypes.includes(userType)) {
      return NextResponse.json(
        {
          error:
            currentUser.userType === "ADMIN"
              ? "Admin can create any user type."
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

    return NextResponse.json({ user: serializeUserPhone(user) }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Email already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Unable to create user." }, { status: 500 });
  }
}


