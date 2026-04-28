import { notFound } from "next/navigation";

import RoleDashboardPage from "@/features/dashboard/pages/RoleDashboardPage";
import CustomerDashboardPage from "@/features/dashboard/pages/CustomerDashboardPage";

type DashboardRolePageProps = {
  params: Promise<{ role: string }>;
   expectedRole: "ADMIN" | "OWNER";
};

export default async function DashboardRolePage({ params }: DashboardRolePageProps) {
  const { role } = await params;

  if (role === "admin") {
    return <RoleDashboardPage expectedRole="ADMIN" restaurants={[]} totalRestaurants={0} />;
  }

  if (role === "owner") {
    return <RoleDashboardPage expectedRole="OWNER" restaurants={[]} totalRestaurants={0} />;
  }

  if (role === "customer") {
    return <CustomerDashboardPage />;
  }

  notFound();
}
