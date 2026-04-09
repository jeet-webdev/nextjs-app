"use client";
import { LayoutDashboard, Users, Settings, TrendingUp, DollarSign, MousePointer2 } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#020205] text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 p-6 space-y-8">
        <div className="text-xl font-bold text-indigo-500 px-2">AdminOS</div>
        <nav className="space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Overview" active />
          <NavItem icon={<Users size={20}/>} label="Customers" />
          <NavItem icon={<TrendingUp size={20}/>} label="Analytics" />
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">AD</div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Monthly Revenue" value="$128,430" change="+12.5%" icon={<DollarSign className="text-emerald-500" />} />
          <StatCard title="Active Sessions" value="4,322" change="+3.2%" icon={<MousePointer2 className="text-blue-500" />} />
          <StatCard title="New Signups" value="892" change="+18.4%" icon={<Users className="text-purple-500" />} />
        </div>

        {/* Mock Table */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 font-semibold">Recent Users</div>
          <table className="w-full text-left">
            <thead className="text-xs uppercase text-gray-500 bg-white/5">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Status</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: "John Doe", email: "john@example.com", status: "Active", plan: "Pro" },
                { name: "Sarah Smith", email: "sarah@gmail.com", status: "Pending", plan: "Enterprise" },
                { name: "Mike Ross", email: "mike@suits.io", status: "Active", plan: "Free" },
              ].map((user, i) => (
                <tr key={i} className="hover:bg-white/5 transition">
                  <td className="p-4">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="p-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-xs rounded-full">{user.status}</span></td>
                  <td className="p-4 text-gray-400">{user.plan}</td>
                  <td className="p-4 text-gray-500 text-sm">2 hours ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${active ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
      {icon} <span>{label}</span>
    </div>
  );
}

function StatCard({ title, value, change, icon }: any) {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-black rounded-lg border border-white/10">{icon}</div>
        <span className="text-xs text-emerald-500 font-medium">{change}</span>
      </div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}