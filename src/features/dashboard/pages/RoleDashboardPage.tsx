"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCreatableUserTypes,
  getDashboardPathForUserType,
  type CurrentUser,
  type FormState,
  type UserRecord,
  type UserType,
} from "@/features/users/types";
import {
  EMPTY_SHOP_FORM,
  type ShopFormState,
  type ShopRecord,
} from "@/features/shops/types";
import Sidebar from "@/features/dashboard/components/Sidebar";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import StatsGrid from "@/features/dashboard/components/StatsGrid";
import AddUserForm from "@/features/dashboard/components/AddUserForm";
import UsersTable from "@/features/dashboard/components/UsersTable";

type RoleDashboardPageProps = {
  expectedRole: "ADMIN" | "ADMINISTRATION" | "OWNER";
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  userType: "CUSTOMER",
};

export default function RoleDashboardPage({ expectedRole }: RoleDashboardPageProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingShop, setIsSubmittingShop] = useState(false);
  const [error, setError] = useState("");
  const [shopError, setShopError] = useState("");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [shops, setShops] = useState<ShopRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [shopForm, setShopForm] = useState<ShopFormState>(EMPTY_SHOP_FORM);
  const router = useRouter();

  const creatableUserTypes = useMemo(
    () => getCreatableUserTypes(currentUser?.userType),
    [currentUser],
  );

  const stats = useMemo(() => {
    const total = users.length;
    const administrators = users.filter((user) => user.userType === "ADMINISTRATION").length;
    const admins = users.filter((user) => user.userType === "ADMIN").length;
    const owners = users.filter((user) => user.userType === "OWNER").length;
    const customers = users.filter((user) => user.userType === "CUSTOMER").length;

    return { total, administrators, admins, owners, customers };
  }, [users]);

  const visibleUsers = useMemo(() => {
    if (expectedRole === "OWNER") {
      return users.filter((user) => user.userType === "CUSTOMER");
    }

    return users;
  }, [expectedRole, users]);

  const ownerShops = useMemo(() => {
    if (!currentUser || expectedRole !== "OWNER") {
      return [];
    }

    return shops.filter((shop) => shop.createdById === currentUser.id);
  }, [currentUser, expectedRole, shops]);

  const tableTitle = expectedRole === "OWNER" ? "Customers" : "All Users";
  const emptyMessage =
    expectedRole === "OWNER" ? "No customers yet." : "No users found.";
  const formTitle = expectedRole === "OWNER" ? "Create Customer" : "Create User";
  const submitLabel = expectedRole === "OWNER" ? "Create Customer" : "Create Account";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users", { method: "GET" });

        if (response.status === 401) {
          router.push("/login");
          router.refresh();
          return;
        }

        if (response.status === 403) {
          router.push("/");
          router.refresh();
          return;
        }

        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          setError(data.error ?? "Unable to load users.");
          return;
        }

        const data = (await response.json()) as {
          currentUser: CurrentUser;
          users: UserRecord[];
        };

        if (data.currentUser.userType !== expectedRole) {
          const nextPath = getDashboardPathForUserType(data.currentUser.userType as UserType);
          router.push(nextPath);
          router.refresh();
          return;
        }

        setCurrentUser(data.currentUser);
        setUsers(data.users);
      } catch {
        setError("Unable to load users.");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    void fetchUsers();
  }, [expectedRole, router]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch("/api/shops", { method: "GET" });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { shops: ShopRecord[] };
        setShops(data.shops);
      } catch {
        // Keep dashboard usable even if shops fail to load.
      }
    };

    void fetchShops();
  }, []);

  useEffect(() => {
    if (creatableUserTypes.length === 0) {
      return;
    }

    setForm((prev) => {
      const nextUserType = creatableUserTypes.includes(prev.userType)
        ? prev.userType
        : creatableUserTypes[0];

      if (prev.userType === nextUserType) {
        return prev;
      }

      return {
        ...prev,
        userType: nextUserType,
      };
    });
  }, [creatableUserTypes]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.push("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string; user?: UserRecord };

      if (!response.ok || !data.user) {
        setError(data.error ?? "Unable to create user.");
        return;
      }

      setUsers((prev) => [data.user as UserRecord, ...prev]);
      setForm({
        ...EMPTY_FORM,
        userType: creatableUserTypes[0] ?? "CUSTOMER",
      });
    } catch {
      setError("Unable to create user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setShopError("");
    setIsSubmittingShop(true);

    try {
      const response = await fetch("/api/shops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shopForm),
      });

      const responseText = await response.text();
      const data = (() => {
        try {
          return JSON.parse(responseText) as { error?: string; shop?: ShopRecord };
        } catch {
          return {} as { error?: string; shop?: ShopRecord };
        }
      })();

      if (!response.ok || !data.shop) {
        setShopError(data.error ?? "Unable to create shop.");
        return;
      }

      setShops((prev) => [data.shop as ShopRecord, ...prev]);
      setShopForm(EMPTY_SHOP_FORM);
    } catch {
      setShopError("Unable to create shop.");
    } finally {
      setIsSubmittingShop(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020205] text-gray-100">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <DashboardHeader
          isLoggingOut={isLoggingOut}
          onLogout={handleLogout}
          userType={currentUser?.userType ?? null}
        />

        <StatsGrid
          total={stats.total}
          administrators={stats.administrators}
          admins={stats.admins}
          owners={stats.owners}
          customers={stats.customers}
          shops={shops.length}
        />

        {creatableUserTypes.length > 0 ? (
          <AddUserForm
            form={form}
            isSubmitting={isSubmitting}
            error={error}
            userTypeOptions={creatableUserTypes}
            title={formTitle}
            submitLabel={submitLabel}
            onSubmit={handleCreateUser}
            onChange={setForm}
          />
        ) : error ? (
          <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-8">
            <p className="text-rose-400 text-sm">{error}</p>
          </div>
        ) : null}

        {expectedRole === "OWNER" ? (
          <>
            <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">My Shops</h2>
              {ownerShops.length === 0 ? (
                <p className="text-sm text-gray-400">You have not published any shops yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {ownerShops.map((shop) => (
                    <div
                      key={shop.id}
                      className="rounded-xl border border-white/10 bg-black/30 p-4"
                    >
                      <p className="font-semibold text-white">{shop.name}</p>
                      <p className="text-sm text-sky-300 mt-1">{shop.category}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
                        <span>{shop.city}</span>
                        <span className="px-2 py-1 rounded-full bg-sky-500/20 text-sky-200">
                          {shop.rating}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Create Shop For Customers</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreateShop}>
                <input
                  className="p-3 bg-black/40 border border-white/10 rounded-lg"
                  placeholder="Shop Name"
                  value={shopForm.name}
                  onChange={(e) => setShopForm((prev) => ({ ...prev, name: e.target.value }))}
                />
                <input
                  className="p-3 bg-black/40 border border-white/10 rounded-lg"
                  placeholder="Category"
                  value={shopForm.category}
                  onChange={(e) => setShopForm((prev) => ({ ...prev, category: e.target.value }))}
                />
                <input
                  className="p-3 bg-black/40 border border-white/10 rounded-lg"
                  placeholder="City"
                  value={shopForm.city}
                  onChange={(e) => setShopForm((prev) => ({ ...prev, city: e.target.value }))}
                />
                <input
                  className="p-3 bg-black/40 border border-white/10 rounded-lg"
                  placeholder="Rating"
                  value={shopForm.rating}
                  onChange={(e) => setShopForm((prev) => ({ ...prev, rating: e.target.value }))}
                />
                <button
                  type="submit"
                  disabled={isSubmittingShop}
                  className="p-3 bg-sky-600 hover:bg-sky-700 rounded-lg font-semibold disabled:opacity-60"
                >
                  {isSubmittingShop ? "Publishing..." : "Publish Shop"}
                </button>
              </form>
              {shopError && <p className="text-rose-400 text-sm mt-3">{shopError}</p>}

              <div className="mt-4 text-sm text-gray-300">
                Live shops available to customers: <span className="font-semibold text-white">{shops.length}</span>
              </div>
            </div>
          </>
        ) : null}

        <UsersTable
          users={visibleUsers}
          isLoadingUsers={isLoadingUsers}
          title={tableTitle}
          emptyMessage={emptyMessage}
        />
      </main>
    </div>
  );
}
