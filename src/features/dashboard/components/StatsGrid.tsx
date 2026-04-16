import StatCard from "./StatCard";
import OverviewStatsChart from "./OverviewStatsChart";

type StatsGridProps = {
  total: number;
  admins: number;
  owners: number;
  customers: number;
  restaurants: number;
  ownedRestaurants?: number | null;
  isOwnerView?: boolean;
};

export default function StatsGrid({
  total,
  admins,
  owners,
  customers,
  restaurants,
  ownedRestaurants = null,
  isOwnerView = false,
}: StatsGridProps) {
  const chartItems = isOwnerView
    ? [
        { label: "Total Users", value: total, color: "#6366f1" },
        { label: "Admins", value: admins, color: "#d946ef" },
        { label: "Owners", value: owners, color: "#0ea5e9" },
        { label: "Customers", value: customers, color: "#10b981" },
        { label: "Total Restaurants", value: restaurants, color: "#f59e0b" },
        { label: "My Restaurants", value: ownedRestaurants ?? 0, color: "#f97316" },
      ]
    : [
        { label: "Total Users", value: total, color: "#6366f1" },
        { label: "Admins", value: admins, color: "#d946ef" },
        { label: "Owners", value: owners, color: "#0ea5e9" },
        { label: "Customers", value: customers, color: "#10b981" },
        { label: "Restaurants", value: restaurants, color: "#f59e0b" },
        { label: "My Restaurants", value: ownedRestaurants ?? 0, color: "#f97316" },
      ];

  return (
    <div className="space-y-6 mb-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 lg:gap-6">
        <StatCard title="Total Users" value={String(total)} />
        <StatCard title="Admins" value={String(admins)} />

        <StatCard title="Owners" value={String(owners)} />
        <StatCard title="Customers" value={String(customers)} />
        {isOwnerView ? (
          <>
            <StatCard title="All Restaurants" value={String(restaurants)} />
            <StatCard title="My Restaurants" value={String(ownedRestaurants ?? 0)} />
          </>
        ) : (
          <>
             <StatCard title="All Restaurants" value={String(restaurants)} />
             <StatCard title="My Restaurants" value={String(ownedRestaurants ?? 0)} />
          </>
        )}
      </div>

      <OverviewStatsChart items={chartItems} />
    </div>
  );
}
