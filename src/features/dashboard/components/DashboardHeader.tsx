"use client";

import { Menu } from "lucide-react";

type DashboardHeaderProps = {
  isLoggingOut: boolean;
  onLogout: () => void;
  userType: string | null;
  onCreateUser?: () => void;
  onToggleMobileMenu?: () => void;
};

export default function DashboardHeader({
  isLoggingOut,
  onLogout,
  userType,
  onCreateUser,
  onToggleMobileMenu,
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
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Signed in as {userType}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto flex-wrap">
        {onCreateUser ? (
          <button
            type="button"
            onClick={onCreateUser}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold whitespace-nowrap"
          >
            Create User
          </button>
        ) : null}
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs sm:text-sm">
          AD
        </div>
      </div>
    </header>
  );
}
