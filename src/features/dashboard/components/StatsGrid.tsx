import StatCard from "./StatCard";
import OverviewStatsChart from "./OverviewStatsChart";

type StatsGridProps = {
  total: number;
  administrators: number;
  admins: number;
  owners: number;
  customers: number;
  shops: number;
};

export default function StatsGrid({
  total,
  administrators,
  admins,
  owners,
  customers,
  shops,
}: StatsGridProps) {
  const chartItems = [
    { label: "Total Users", value: total, color: "#6366f1" },
    { label: "Administrators", value: administrators, color: "#8b5cf6" },
    { label: "Admins", value: admins, color: "#d946ef" },
    { label: "Owners", value: owners, color: "#0ea5e9" },
    { label: "Customers", value: customers, color: "#10b981" },
    { label: "Restaurants", value: shops, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-6 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="Total Users" value={String(total)} />
        <StatCard title="Administrators" value={String(administrators)} />
        <StatCard title="Admins" value={String(admins)} />
        <StatCard title="Owners" value={String(owners)} />
        <StatCard title="Customers" value={String(customers)} />
        <StatCard title="Restaurants" value={String(shops)} />
      </div>

      <OverviewStatsChart items={chartItems} />
    </div>
  );
}
