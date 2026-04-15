import { NextResponse } from "next/server";

import { JWT_COOKIE_NAME, shouldUseSecureCookie } from "@/shared/lib/auth";

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: JWT_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: shouldUseSecureCookie(request),
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
