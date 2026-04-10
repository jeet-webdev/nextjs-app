import { LayoutDashboard, Settings, Users } from "lucide-react";
import NavItem from "./NavItem";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/5 p-6 space-y-8">
      <div className="text-xl font-bold text-indigo-500 px-2">AdminOS</div>
      <nav className="space-y-2">
        <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active />
        <NavItem icon={<Users size={20} />} label="Users" />
        <NavItem icon={<Settings size={20} />} label="Settings" />
      </nav>
    </aside>
  );
}
//