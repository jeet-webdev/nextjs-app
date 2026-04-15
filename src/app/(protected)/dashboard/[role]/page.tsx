import { notFound } from "next/navigation";

import RoleDashboardPage from "@/features/dashboard/pages/RoleDashboardPage";
import CustomerDashboardPage from "@/features/dashboard/pages/CustomerDashboardPage";

type DashboardRolePageProps = {
  params: Promise<{ role: string }>;
};

export default async function DashboardRolePage({ params }: DashboardRolePageProps) {
  const { role } = await params;

  if (role === "admin") {
    return <RoleDashboardPage expectedRole="ADMIN" />;
  }

  if (role === "owner") {
    return <RoleDashboardPage expectedRole="OWNER" />;
  }

  if (role === "customer") {
    return <CustomerDashboardPage />;
  }

  notFound();
}
