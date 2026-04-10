"use client";

type DashboardHeaderProps = {
  isLoggingOut: boolean;
  onLogout: () => void;
  userType: string | null;
};

export default function DashboardHeader({
  isLoggingOut,
  onLogout,
  userType,
}: DashboardHeaderProps) {
  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-sm text-gray-400 mt-1">
          Signed in as {userType}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="px-4 py-2 text-sm rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
          AD
        </div>
      </div>
    </header>
  );
}
