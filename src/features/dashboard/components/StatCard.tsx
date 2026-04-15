type DashboardStatCardProps = {
  title: string;
  value: string;
};

export default function StatCard({ title, value }: DashboardStatCardProps) {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}