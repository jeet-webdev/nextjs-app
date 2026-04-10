import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { JWT_COOKIE_NAME, verifyAuthToken } from "./src/shared/lib/auth";

const CUSTOMER_USER_TYPES = new Set(["CUSTOMER"]);

function getDashboardPathForRole(userType: string) {
  if (userType === "OWNER") {
    return "/dashboard/owner";
  }

  if (userType === "ADMINISTRATION") {
    return "/dashboard/administration";
  }

  if (userType === "ADMIN") {
    return "/dashboard/admin";
  }

  return "/dashboard/customer";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(JWT_COOKIE_NAME)?.value;
  const session = token ? await verifyAuthToken(token) : null;

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (CUSTOMER_USER_TYPES.has(session.userType)) {
      if (pathname === "/dashboard/customer") {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL("/dashboard/customer", request.url));
    }

    if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL(getDashboardPathForRole(session.userType), request.url));
    }

    if (pathname.startsWith("/dashboard/admin") && session.userType !== "ADMIN") {
      return NextResponse.redirect(new URL(getDashboardPathForRole(session.userType), request.url));
    }

    if (
      pathname.startsWith("/dashboard/administration") &&
      session.userType !== "ADMINISTRATION"
    ) {
      return NextResponse.redirect(new URL(getDashboardPathForRole(session.userType), request.url));
    }

    if (pathname.startsWith("/dashboard/owner") && session.userType !== "OWNER") {
      return NextResponse.redirect(new URL(getDashboardPathForRole(session.userType), request.url));
    }
  }

  if (pathname.startsWith("/customer")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!CUSTOMER_USER_TYPES.has(session.userType)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard/customer", request.url));
  }

  if (pathname.startsWith("/login") && session) {
    const redirectPath = CUSTOMER_USER_TYPES.has(session.userType)
      ? "/dashboard/customer"
      : getDashboardPathForRole(session.userType);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/customer/:path*", "/login"],
};
