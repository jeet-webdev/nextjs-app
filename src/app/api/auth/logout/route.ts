import { NextResponse } from "next/server";

import { JWT_COOKIE_NAME } from "@/shared/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: JWT_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
//