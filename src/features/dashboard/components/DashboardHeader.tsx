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
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Signed in as {userType}
          </p>
          {/* <p className="text-xs sm:text-sm text-gray-400 mt-1">Hello, {user?.name}</p>
          {user?.email && (
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Email: {user.email}</p>
          )} */}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto flex-wrap">
         {/* {onCreateRestaurant ? (
          <button
            type="button"
            onClick={onCreateRestaurant}
            className="hidden px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold whitespace-nowrap"
          >
            Create Restaurant
          </button>
        ) : null} */}
        {/* { onCreateTableReservation ? (
          <button
            type="button"         
            onClick={onCreateTableReservation}
            className="hidden px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold whitespace-nowrap"
          >           Create Table Reservation        
          </button> 
        ) : null} */}

        {/* {onCreateUser ? (
          <button
            type="button"
            onClick={onCreateUser}
            className=" hidden px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold whitespace-nowrap"
          >
            Create User
          </button>
        ) : null} */}
        {/* {onCreateMenuItem ? (
          <button
            type="button"
            onClick={onCreateMenuItem}
            className="hidden px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold whitespace-nowrap"
          >
            Create Menu Item
          </button>
        ) : null} */}

        {/* <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button> */}
        <div className="w-8 sm:w-10 h-8 ms-10 sm:h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs sm:text-sm">
          <CornerProfile
            user={user}
            isLoggingOut={isLoggingOut}
            onLogout={onLogout}
            onCreateUser={onCreateUser}
          />
        </div>
      </div>
    </header>
  );
}
