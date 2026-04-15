import { LayoutDashboard, Store, Users } from "lucide-react";
import NavItem from "./NavItem";

type DashboardSection = "overview" | "users" | "restaurants";

type SidebarProps = {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
};

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="hidden lg:block w-64 border-r border-white/5 p-6 space-y-8">
      <div className="text-xl font-bold text-indigo-500 px-2">RestroAdminOS</div>
      <nav className="space-y-2">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          label="Overview"
          active={activeSection === "overview"}
          onClick={() => onSectionChange("overview")}
        />
        <NavItem
          icon={<Users size={20} />}
          label="Users"
          active={activeSection === "users"}
          onClick={() => onSectionChange("users")}
        />
        <NavItem
          icon={<Store size={20} />}
          label="Restaurants"
          active={activeSection === "restaurants"}
          onClick={() => onSectionChange("restaurants")}
        />
      </nav>
    </aside>
  );
}