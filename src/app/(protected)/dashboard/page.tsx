"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  getDashboardPathForUserType,
  type CurrentUser,
  type UserType,
} from "@/features/users/types";

export default function DashboardRoleRouterPage() {
  const router = useRouter();

  useEffect(() => {
    const resolveRoleRoute = async () => {
      try {
        const response = await fetch("/api/users", { method: "GET" });

        if (response.status === 401) {
          router.push("/login");
          router.refresh();
          return;
        }

        if (response.status === 403) {
          router.push("/");
          router.refresh();
          return;
        }

        if (!response.ok) {
          router.push("/login");
          router.refresh();
          return;
        }

        const data = (await response.json()) as {
          currentUser: CurrentUser;
        };

        router.push(getDashboardPathForUserType(data.currentUser.userType as UserType));
        router.refresh();
      } catch {
        router.push("/login");
        router.refresh();
      }
    };

    void resolveRoleRoute();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-[#020205]">
      <p className="text-sm text-gray-400">Preparing your dashboard...</p>
    </div>
  );
}
