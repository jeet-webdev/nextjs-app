import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { signAuthToken, JWT_COOKIE_NAME } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
const BCRYPT_HASH_REGEX = /^\$2[aby]\$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

    let user = await prisma.user.findUnique({ where: { email } });

    // Bootstrap a default admin user on first login attempt.
    if (!user && email === adminEmail && password === adminPassword) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          name: "System Admin",
          email,
          password: hashedPassword,
          phone: "",
          userType: "ADMIN",
        },
      });
    }//

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isPasswordValid = BCRYPT_HASH_REGEX.test(user.password)
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (email === adminEmail) {
      const updateData: { name?: string; userType?: "ADMIN" } = {};

      if (!user.name) {
        updateData.name = "System Admin";
      }

      if (user.userType !== "ADMIN") {
        updateData.userType = "ADMIN";
      }

      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      }
    }

    if (!BCRYPT_HASH_REGEX.test(user.password)) {
      const upgradedHash = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: upgradedHash },
      });
    }

    const token = await signAuthToken({
      sub: user.id,
      email: user.email,
      userType: user.userType,
    });

    const redirectPath =
      user.userType === "CUSTOMER"
        ? "/dashboard/customer"
        : user.userType === "OWNER"
          ? "/dashboard/owner"
          : user.userType === "ADMINISTRATION"
            ? "/dashboard/administration"
            : "/dashboard/admin";

    const response = NextResponse.json({
      success: true,
      redirectPath,
    });
    response.cookies.set({
      name: JWT_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ONE_WEEK_IN_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Unable to login right now." }, { status: 500 });
  }
}
