import { LayoutDashboard, Store, Users, BeerIcon, LogsIcon, HousePlus  } from "lucide-react";
import NavItem from "./NavItem";

type DashboardSection = "overview" | "users" | "restaurants" | "create-restaurant" | "menu-items" | "table-reservations";

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
         <NavItem
          icon={<BeerIcon size={20} />}
          label="Table Reservations"
          active={activeSection === "table-reservations"}
          onClick={() => onSectionChange("table-reservations")}
        />
         <NavItem
          icon={<LogsIcon size={20} />}
          label="Menu Items"
          active={activeSection === "menu-items"}
          onClick={() => onSectionChange("menu-items")}
        />      
      </nav>
    </aside>
  );
}