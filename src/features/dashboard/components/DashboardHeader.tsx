"use client";

import { Menu } from "lucide-react";
import CornerProfile from "./CornerProfile";

type DashboardHeaderProps = {
  isLoggingOut: boolean;
  onLogout: () => void;
  user: { name: string, email?: string } | null;
  userType: string | null;
  onCreateUser?: () => void;
  onCreateRestaurant?: () => void;
  onToggleMobileMenu?: () => void;
};

export default function DashboardHeader({
  isLoggingOut,
  onLogout,
  userType,
  user,
  onCreateUser,
  onCreateRestaurant,
  onToggleMobileMenu,
}: DashboardHeaderProps) {
  return (
    <header className="flex sticky top-0 z-50 flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
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
        {/* {onCreateRestaurant ? (
          <button
            type="button"
            onClick={onCreateRestaurant}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Create Restaurant
          </button>
        ) : null} */}

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
