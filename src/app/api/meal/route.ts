import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

type SessionUser = { id: string; userType: string };
const OWNER = "OWNER";
const ADMIN = "ADMIN";

const mealSelect = {
  id: true,
  name: true,
  isAvailable: true,
  restaurantId: true,
  createdAt: true,
  updatedAt: true,
} as const;

function parseRequiredString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function mapMeal(meal: any) {
  return {
    ...meal,
    createdAt: meal.createdAt.toISOString(),
    updatedAt: meal.updatedAt.toISOString(),
  };
}

async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifyAuthToken(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, userType: true },
  });
  
  return user as SessionUser | null;
}

async function assertRestaurantAccess(restaurantId: string, currentUser: SessionUser) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { id: true, userId: true },
  });

  if (!restaurant) {
    return { error: "Restaurant not found.", status: 404 };
  }
 if (currentUser.userType === OWNER && restaurant.userId !== currentUser.id) {
    return { error: "You do not have permission to manage this restaurant.", status: 403 };
  }

  return { restaurant };
}



export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId")?.trim();

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 });
    }

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await assertRestaurantAccess(restaurantId, user);
    if (access.error) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

    const meals = await prisma.meal.findMany({
      where: { restaurantId },
      select: mealSelect,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ meals: meals.map(mapMeal) });
  } catch (err) {
    console.error("GET MEAL ERROR:", err);
    return NextResponse.json({ error: "Unable to load meals." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    
   
    if (!user || ![ADMIN, OWNER].includes(user.userType)) {
      return NextResponse.json(
        { error: "Only admins or owners can create meals." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const name = parseRequiredString(body.name);
    const restaurantId = parseRequiredString(body.restaurantId);
    const isAvailable = typeof body.isAvailable === "boolean" ? body.isAvailable : true;


    if (!name || !restaurantId) {
      return NextResponse.json(
        { error: "Meal name and Restaurant ID are required." },
        { status: 400 }
      );
    }

   
    const access = await assertRestaurantAccess(restaurantId, user);
    if (access.error) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

  
    const createdMeal = await prisma.meal.create({
      data: {
        name,
        isAvailable,
        restaurantId,
      },
      select: mealSelect,
    });

    return NextResponse.json({ meal: mapMeal(createdMeal) }, { status: 201 });
  } catch (err) {
    console.error("POST MEAL ERROR:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}






















// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
// import { prisma } from "@/shared/lib/prisma";

// type SessionUser = { id: string; userType: string };
// const OWNER = "OWNER";
// const ADMIN = "ADMIN";

// const mealSelect = {
//   id: true,
//   name: true,
//   isAvailable: true,
//   restaurantId: true,
//   createdAt: true,
//   updatedAt: true,
// } as const;

// function parseRequiredString(value: unknown): string {
//   return typeof value === "string" ? value.trim() : "";
// }

// function mapMeal(meal: any) {
//   return {
//     ...meal,
//     createdAt: meal.createdAt.toISOString(),
//     updatedAt: meal.updatedAt.toISOString(),
//   };
// }

// async function getSessionUser(): Promise<SessionUser | null> {
//   const cookieStore = await cookies();
//   const token = cookieStore.get(JWT_COOKIE_NAME)?.value;
//   if (!token) return null;

//   const session = await verifyAuthToken(token);
//   if (!session) return null;

//   const user = await prisma.user.findUnique({
//     where: { id: session.sub },
//     select: { id: true, userType: true },
//   });

//   return user as SessionUser | null;
// }

// async function assertRestaurantAccess(
//   restaurantId: string,
//   currentUser: SessionUser
// ) {
//   const restaurant = await prisma.restaurant.findUnique({
//     where: { id: restaurantId },
//     select: { id: true, userId: true },
//   });

//   if (!restaurant) {
//     return { error: "Restaurant not found.", status: 404 };
//   }

//   if (
//     currentUser.userType === OWNER &&
//     restaurant.userId !== currentUser.id
//   ) {
//     return {
//       error: "You do not have permission to manage this restaurant.",
//       status: 403,
//     };
//   }

//   return { restaurant };
// }

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const restaurantId = searchParams.get("restaurantId")?.trim();

//     if (!restaurantId) {
//       return NextResponse.json(
//         { error: "Restaurant ID is required" },
//         { status: 400 }
//       );
//     }

//     const user = await getSessionUser();
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const access = await assertRestaurantAccess(restaurantId, user);
//     if ("error" in access && access.error) {
//       return NextResponse.json(
//         { error: access.error },
//         { status: access.status }
//       );
//     }

//     const meals = await prisma.meal.findMany({
//       where: { restaurantId },
//       select: mealSelect,
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ meals: meals.map(mapMeal) });
//   } catch (err) {
//     console.error("GET MEAL ERROR:", err);
//     return NextResponse.json(
//       { error: "Unable to load meals." },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const user = await getSessionUser();

//     if (!user || ![ADMIN, OWNER].includes(user.userType)) {
//       return NextResponse.json(
//         { error: "Only admins or owners can create meals." },
//         { status: 403 }
//       );
//     }

//     const body = await request.json();
//     const name = parseRequiredString(body.name);
//     const restaurantId = parseRequiredString(body.restaurantId);
//     const isAvailable =
//       typeof body.isAvailable === "boolean" ? body.isAvailable : true;

//     if (!name || !restaurantId) {
//       return NextResponse.json(
//         { error: "Meal name and Restaurant ID are required." },
//         { status: 400 }
//       );
//     }

//     const access = await assertRestaurantAccess(restaurantId, user);
//     if ("error" in access && access.error) {
//       return NextResponse.json(
//         { error: access.error },
//         { status: access.status }
//       );
//     }

//     const createdMeal = await prisma.meal.create({
//       data: {
//         name,
//         isAvailable,
//         restaurantId,
//       },
//       select: mealSelect,
//     });

//     return NextResponse.json({ meal: mapMeal(createdMeal) }, { status: 201 });
//   } catch (err) {
//     console.error("POST MEAL ERROR:", err);
//     return NextResponse.json(
//       { error: "Internal server error." },
//       { status: 500 }
//     );
//   }
// }