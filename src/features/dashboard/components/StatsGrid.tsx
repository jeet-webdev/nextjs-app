import StatCard from "./StatCard";

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
  shops,//
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
      <StatCard title="Total Users" value={String(total)} />
      <StatCard title="Administrators" value={String(administrators)} />
      <StatCard title="Admins" value={String(admins)} />
      <StatCard title="Owners" value={String(owners)} />
      <StatCard title="Customers" value={String(customers)} />
      <StatCard title="Shops" value={String(shops)} />
    </div>
  );
}
