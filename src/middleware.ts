
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { JWT_COOKIE_NAME, verifyAuthToken } from "./shared/lib/auth";

const CUSTOMER_USER_TYPES = new Set(["CUSTOMER"]);

function matchesDashboardRole(pathname: string, role: string) {
  return pathname === `/dashboard/${role}` || pathname.startsWith(`/dashboard/${role}/`);
}

function getDashboardPathForRole(userType: string) {
  if (userType === "OWNER") return "/dashboard/owner";
  if (userType === "ADMIN") return "/dashboard/admin";
  return "/dashboard/customer";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(JWT_COOKIE_NAME)?.value;
  const session = token ? await verifyAuthToken(token) : null;

  // ─── Dashboard routes ────────────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    // Not logged in → go to login
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // CUSTOMER users can only access /dashboard/customer
    if (CUSTOMER_USER_TYPES.has(session.userType)) {
      if (pathname === "/dashboard/customer") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/dashboard/customer", request.url));
    }

    // /dashboard → redirect to the correct role dashboard
    if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL(getDashboardPathForRole(session.userType), request.url));
    }

    // /dashboard/admin
    if (matchesDashboardRole(pathname, "admin")) {
      if (session.userType !== "ADMIN") {
        return NextResponse.redirect(new URL(getDashboardPathForRole(session.userType), request.url));
      }
      return NextResponse.next();
    }

    // /dashboard/owner
    if (matchesDashboardRole(pathname, "owner")) {
      if (session.userType !== "OWNER") {
        return NextResponse.redirect(new URL(getDashboardPathForRole(session.userType), request.url));
      }
      return NextResponse.next();
    }
  }

  // ─── /customer routes ────────────────────────────────────────────────────────
  if (pathname.startsWith("/customer")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!CUSTOMER_USER_TYPES.has(session.userType)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard/customer", request.url));
  }

  // ─── /login ──────────────────────────────────────────────────────────────────
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