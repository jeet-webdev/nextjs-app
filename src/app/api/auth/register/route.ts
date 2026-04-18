import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import {
  getDashboardPathForUserType,
  JWT_COOKIE_NAME,
  shouldUseSecureCookie,
  signAuthToken,
} from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { normalizePhoneInput, parsePhoneForStorage } from "@/shared/lib/user-phone";

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phoneInput = normalizePhoneInput(body.phone);
    const phone = phoneInput ? parsePhoneForStorage(body.phone) : null;
    const password = typeof body.password === "string" ? body.password : "";
    const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Email, password, and confirm password are required." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    if (phoneInput && !phone) {
      return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        ...(phone ? { phone } : {}),
        password: hashedPassword,
        userType: "CUSTOMER",
      },
    });

    const token = await signAuthToken({
      sub: user.id,
      email: user.email,
      userType: user.userType,
    });

    const response = NextResponse.json(
      {
        success: true,
        redirectPath: getDashboardPathForUserType(user.userType),
      },
      { status: 201 },
    );

    response.cookies.set({
      name: JWT_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: shouldUseSecureCookie(request),
      sameSite: "strict",
      path: "/",
      maxAge: ONE_WEEK_IN_SECONDS,
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Email already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Unable to create account right now." }, { status: 500 });
  }
}