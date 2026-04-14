import StatCard from "./StatCard";

export default function HomeStats() {
  return (
    <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-40">
      <StatCard label="Restaurants Onboarded" value="Growing" detail="New restaurants every week" />
      <StatCard label="Category Coverage" value="Multi" detail="From grocery to fashion" />
      <StatCard label="Unified Platform" value="1 Place" detail="Browse and compare easily" />
    </section>
  );
}
//