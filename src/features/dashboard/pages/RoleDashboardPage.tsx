"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getCreatableUserTypes,
  getDashboardPathForUserType,
  type CurrentUser,
  type UserRecord,
  type UserType,
} from "@/features/users/types";
import {
  EMPTY_RESTAURANT_FORM,
  type RestaurantRecord,
  type RestaurantFormState,
} from "@/features/restaurants/types";
import Sidebar from "@/features/dashboard/components/Sidebar";
import MobileNav from "@/features/dashboard/components/MobileNav";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import CreateUserModal from "@/features/home/components/CreateUserModal";
import StatsGrid from "@/features/dashboard/components/StatsGrid";
import UsersTable from "@/features/dashboard/components/UsersTable";
import RestaurantsSection from "@/features/dashboard/components/RestaurantsSection";
import MenuSection from "@/features/dashboard/components/MenuSection";
import RestaurantsForm from "@/features/dashboard/components/RestaurantsForm";
import { type MenuRecord } from "@/features/menu/types/menuTypes";

type RestaurantMutationResponse = {
  error?: string;
  restaurant?: RestaurantRecord;
};

type RoleDashboardPageProps = {
  expectedRole: "ADMIN" | "OWNER";
};

type DashboardSection = "overview" | "users" | "restaurants" | "create-restaurant" | "menu-items" | "table-reservations";

export default function RoleDashboardPage({ expectedRole }: RoleDashboardPageProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmittingShop, setIsSubmittingShop] = useState(false);
  const [error, setError] = useState("");
  const [restaurantError, setRestaurantError] = useState("");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantRecord[]>([]);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [ownedRestaurants, setOwnedRestaurants] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [restaurantForm, setRestaurantForm] = useState<RestaurantFormState>(
    EMPTY_RESTAURANT_FORM,
  );
   const [isLoading, setIsLoading] = useState(true);
 
const [menuItems, setMenuItems] = useState<MenuRecord[]>([]);
const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);
  const [editingRestaurantId, setEditingRestaurantId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const creatableUserTypes = useMemo(
    () => getCreatableUserTypes(currentUser?.userType),
    [currentUser],
  );

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((user) => user.userType === "ADMIN").length;
    const owners = users.filter((user) => user.userType === "OWNER").length;
    const customers = users.filter((user) => user.userType === "CUSTOMER").length;

    return { total, admins, owners, customers };
  }, [users]);

  const visibleUsers = useMemo(() => {
    if (expectedRole === "OWNER") {
      return users.filter((user) => user.userType === "CUSTOMER");
    }

    return users;
  }, [expectedRole, users]);

  const tableTitle = expectedRole === "OWNER" ? "Customers" : "All Users";
  const emptyMessage =
    expectedRole === "OWNER" ? "No customers yet." : "No users found.";
  const restaurantsForSection = restaurants;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

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
  // Only fetch if we are in the menu-items section
  if (activeSection !== "menu-items") return;

  const fetchMenu = async () => {
    setIsLoadingMenu(true);
    try {
      const response = await fetch("/api/menu?public=true", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.menuItems || []);
      }
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  void fetchMenu();
}, [activeSection]);
const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users"); // This hits your GET api
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      
      // Based on your GET API response structure: { currentUser, users }
      setUsers(data.users);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("/api/restaurants", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as {
          restaurants: RestaurantRecord[];
          totalRestaurants?: number;
          ownedRestaurants?: number | null;
        };
        setRestaurants(data.restaurants);
        setTotalRestaurants(data.totalRestaurants ?? data.restaurants.length);
        setOwnedRestaurants(data.ownedRestaurants ?? null);
      } catch {
       
      }
    };

    void fetchRestaurants();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.push("/");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    setRestaurantError("");
    setIsSubmittingShop(true);

    try {
      const response = await fetch(
        isEditingRestaurant && editingRestaurantId
          ? `/api/restaurants/${editingRestaurantId}`
          : "/api/restaurants",
        {
          method: isEditingRestaurant && editingRestaurantId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(restaurantForm),
        },
      );
      const responseText = await response.text();
      const data = (() => {
        try {
          return JSON.parse(responseText) as RestaurantMutationResponse;
        } catch {
          return {} as RestaurantMutationResponse;
        }
      })();

      if (!response.ok || !data.restaurant) {
        setRestaurantError(data.error ?? "Unable to create restaurant.");
        return;
      }
      
      setRestaurants((prev) => {
        const next = [...prev];
        if (isEditingRestaurant && editingRestaurantId) {
          const idx = next.findIndex((s) => s.id === editingRestaurantId);
          if (idx !== -1) {
            next[idx] = data.restaurant as RestaurantRecord;
            return next;
          }
        }

        return [data.restaurant as RestaurantRecord, ...next];
      });

      setRestaurantForm(EMPTY_RESTAURANT_FORM);
      setIsEditingRestaurant(false);
      setEditingRestaurantId(null);
    } catch {
      setRestaurantError("Unable to create restaurant.");
    } finally {
      setIsSubmittingShop(false);
    }
  };
  const handleEditClick = (restaurant: RestaurantRecord) => {
  setRestaurantForm({
    name: restaurant.name ?? "",
    category: restaurant.category ?? "",
    city: restaurant.city ?? "",
    slug: restaurant.slug ?? "",
    address: restaurant.address ?? "",
    content: {
      title: restaurant.content?.title ?? "",
      description: restaurant.content?.description ?? "",
      imageUrl: restaurant.content?.imageUrl ?? "",
      menuBookUrl: restaurant.content?.menuBookUrl ?? "",
    },
    contactInfo: {
      phone: restaurant.contactInfo?.phone ?? "",
      email: restaurant.contactInfo?.email ?? "",
      openingHours: restaurant.contactInfo?.openingHours ?? "",
      closingHours: restaurant.contactInfo?.closingHours ?? "",
      website: restaurant.contactInfo?.website ?? "",
    },
    logo: restaurant.logo ?? "",
    seoTitle: restaurant.seoTitle ?? "",
    seoDescription: restaurant.seoDescription ?? "",
  });

  setIsEditingRestaurant(true);
  setEditingRestaurantId(restaurant.id);

  setActiveSection("create-restaurant");

  setTimeout(() => {
    const el = document.querySelector("form");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
  };

  const handleCancelEdit = () => {
    setIsEditingRestaurant(false);
    setEditingRestaurantId(null);
    setRestaurantForm(EMPTY_RESTAURANT_FORM);
  };

  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#020205] text-gray-100">
      <MobileNav 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isOpen={mobileMenuOpen}
        onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <DashboardHeader
          isLoggingOut={isLoggingOut}
          onLogout={handleLogout}
          userType={currentUser?.userType ?? null}
          user={currentUser ? { name: currentUser.name, email: currentUser.email } : null}
          onCreateUser={creatableUserTypes.length > 0 ? () => setCreateUserModalOpen(true) : undefined}
          onCreateRestaurant={currentUser && (currentUser.userType === "ADMIN" || currentUser.userType === "OWNER") ? () => {
            setRestaurantForm(EMPTY_RESTAURANT_FORM);
            setRestaurantError("");
            setIsEditingRestaurant(false);
            setEditingRestaurantId(null);
            setActiveSection("create-restaurant");
          } : undefined}
          onCreateTableReservation={currentUser && (currentUser.userType === "ADMIN" || currentUser.userType === "OWNER") ? () => {
            setActiveSection("table-reservations");
          } : undefined}
          // allMenuItem={currentUser && (currentUser.userType === "ADMIN" || currentUser.userType === "OWNER") ? () => {
          //   setActiveSection("menu-items");
          // } : undefined}


          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <CreateUserModal
          isOpen={createUserModalOpen}
          setIsOpen={setCreateUserModalOpen}
          showTrigger={false}
          userTypeOptions={creatableUserTypes}
          onCreated={(user) => setUsers((prev) => [user, ...prev])}
        />

        {activeSection === "overview" ? (
          <StatsGrid
            total={stats.total}
            admins={stats.admins}
            owners={stats.owners}
            customers={stats.customers}
            restaurants={expectedRole === "OWNER" ? totalRestaurants : restaurants.length}
            ownedRestaurants={expectedRole === "OWNER" ? (ownedRestaurants ?? restaurants.length) : null}
            isOwnerView={expectedRole === "OWNER"}
          />
        ) : null}

        {activeSection === "users" ? (
          <>
            {/* {creatableUserTypes.length > 0 ? (
              <div id="add-user-form">
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
              </div>
            ) : error ? (
              <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-8">
                <p className="text-rose-400 text-sm">{error}</p>
              </div>
            ) : null} */}

            <UsersTable
              users={visibleUsers}
              isLoadingUsers={isLoadingUsers}
              title={tableTitle}
              emptyMessage={emptyMessage}
              userTypeOptions={creatableUserTypes}    //   this was missing for usertype in patch api
              onCreateUser={creatableUserTypes.length > 0 ? () => setCreateUserModalOpen(true) : undefined}
              onRefresh={fetchUsers}
              />
            {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
          </>
        ) : null}

        {activeSection === "restaurants" ? (
          <RestaurantsSection restaurants={restaurantsForSection} onEdit={handleEditClick} />
        ) : null}

       {activeSection === "menu-items" ? (
  <MenuSection 
    menuItems={menuItems} 
  />
) : null}

        {activeSection === "create-restaurant" ? (
          <RestaurantsForm
            onSubmit={handleCreateRestaurant}
            form={restaurantForm}
            setForm={setRestaurantForm}
            isSubmitting={isSubmittingShop}
            error={restaurantError}
            allCount={expectedRole === "OWNER" ? totalRestaurants : restaurants.length}
            isEditing={isEditingRestaurant}
            onCancel={handleCancelEdit}
          />
        ) : null}
      </main>
    </div>
  );
}
