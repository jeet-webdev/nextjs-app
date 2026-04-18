"use client";

import { Menu } from "lucide-react";
import CornerProfile from "./CornerProfile";

type DashboardHeaderProps = {
  isLoggingOut: boolean;
  onLogout: () => void;
  user: { name: string, email?: string } | null;
  userType: string | null;
    onCreateMenuItem?: () => void; //create Menu Item button only for owners and admins
  onCreateUser?: () => void;
  onCreateRestaurant?: () => void;  //create Restaurant button only for owners and admins
  onCreateTableReservation?: () => void; //create Table Reservation button only for owners and admins
  onToggleMobileMenu?: () => void;
};

export default function DashboardHeader({
  isLoggingOut,
  onLogout,
  userType,
  user,
 
  onCreateUser,
  onCreateTableReservation, //create Table Reservation button only for owners and admins
  onCreateRestaurant,  //create Restaurant button only for owners and admins
  onToggleMobileMenu,
   onCreateMenuItem, //create Menu Item button only for owners and admins
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard Overview</h1>
         
         </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto flex-wrap">

        <div className="w-8 sm:w-10 h-8 ms-10 sm:h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs sm:text-sm">
          <CornerProfile
            user={user}
            userType={userType}
            isLoggingOut={isLoggingOut}
            onLogout={onLogout}
            onCreateUser={onCreateUser}
          />
        </div>
      </div>
    </header>
  );
}
