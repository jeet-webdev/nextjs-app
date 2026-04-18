import { NextResponse, NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";
import { cookies } from "next/headers";
import { JWT_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth";
import { normalizePhoneInput, parsePhoneForStorage, serializeUserPhone } from "@/shared/lib/user-phone";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifyAuthToken(token);
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, userType: true },
  });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
    try {
        const { id } = await params;
        const currentUser = await getSessionUser();

        if (!currentUser || (currentUser.userType !== "ADMIN" && currentUser.id !== id)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await request.json();
        const { userType, name, email, phone, password } = body;
        const phoneInput = normalizePhoneInput(phone);
        const parsedPhone = phoneInput ? parsePhoneForStorage(phone) : null;
        
        const updateData: Prisma.UserUpdateInput = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email.toLowerCase();
        if (phoneInput && !parsedPhone) {
          return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
        }
        if (parsedPhone) updateData.phone = parsedPhone;

       
        if (userType && currentUser.userType === "ADMIN") {
            updateData.userType = userType;
        }

        if (password) {
            if (password.length < 6) {
                return NextResponse.json({ error: "Password too short" }, { status: 400 });
            }
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, phone: true, userType: true },
        });

        return NextResponse.json({ message: "User updated successfully", user: serializeUserPhone(updatedUser) }, { status: 200 });
    } catch (error) {
        console.error("Update Error:", error);
        toast.error('Failed to update user');
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const currentUser = await getSessionUser();

    if (!currentUser || currentUser.userType !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 400 });
    }
        if (currentUser.id === id) {
      return NextResponse.json({ error: "You cannot delete yourself" }, { status: 400 });
    }
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" }, { status: 201 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "User not found or delete failed" }, { status: 500 });
  }
}