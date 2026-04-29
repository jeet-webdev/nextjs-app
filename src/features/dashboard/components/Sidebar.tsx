import { LayoutDashboard, Store, Users, BeerIcon, LogsIcon, HousePlus  } from "lucide-react";
import NavItem from "./NavItem";
import { User } from "@prisma/client";

type DashboardSection = "overview" | "users" | "restaurants" | "create-restaurant" | "menu-items" | "table-reservations";

type SidebarProps = {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  ownedRestaurants?: number | null;
  expectedRole: "ADMIN" | "OWNER";

};

export default function Sidebar({ activeSection, onSectionChange , ownedRestaurants, expectedRole }: SidebarProps) {
   
    
    

const showRestaurantManagement = ["restaurants", "table-reservations", "menu-items"].includes(activeSection);
const hasRestaurant =  ownedRestaurants && ownedRestaurants > 0 && expectedRole === "OWNER" || expectedRole === "ADMIN";
  return (
    <aside className="hidden sticky top-0 h-screen lg:block w-64 border-r border-white/5 p-6 space-y-8">
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