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
         {/* {(expectedRole === "OWNER" || expectedRole === "ADMIN") && hasRestaurant && showRestaurantManagement ? (
          <div className="ml-4 border-l border-white/10 pl-2 space-y-1">
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
          </div>
        )
       :
       (
        
    expectedRole === "OWNER" && !hasRestaurant && (
         <NavItem
              icon={<HousePlus size={20} />}
              label="Create Restaurant"
              active={activeSection === "create-restaurant"}
              onClick={() => onSectionChange("create-restaurant")}
            />
          )
        )} */}
    
    </nav>
    </aside>
  );
}