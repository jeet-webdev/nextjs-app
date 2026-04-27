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
import { toast } from "react-toastify";
import TableSection from "../components/TableSection";
import { clearStoredUserRole } from "@/shared/lib/auth-storage";
import RestaurantMenuPage from "../components/RestaurantMenuPage";

type RestaurantMutationResponse = {
  error?: string;
  restaurant?: RestaurantRecord;
};

type UsersPaginationState = {
  page: number;
  rowsPerPage: number;
  totalItems: number;
  totalPages: number;
};

type UserStats = {
  total: number;
  admins: number;
  owners: number;
  customers: number;
};

type UsersResponse = {
  currentUser: CurrentUser;
  users: UserRecord[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  stats: UserStats;

};


type RoleDashboardPageProps = {
  expectedRole?: "ADMIN" | "OWNER" | undefined;
  ownedRestaurants?: number | null;
  restaurants: RestaurantRecord[];
  totalRestaurants: number;
};

export type DashboardSection =
  | "overview"
  | "users"
  | "restaurants"
  | "create-restaurant"
  | "menu-items"
  | "table-reservations";
  

export default function RoleDashboardPage({
  expectedRole
}: RoleDashboardPageProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmittingShop, setIsSubmittingShop] = useState(false);
  const [error, setError] = useState("");
  const [restaurantError, setRestaurantError] = useState("");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantRecord[]>([]);
  const [totalRestaurants, setTotalRestaurants] = useState(0);

  const [ownedRestaurants, setOwnedRestaurants] = useState<number | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    admins: 0,
    owners: 0,
    customers: 0,
  });
  const [userPagination, setUserPagination] = useState<UsersPaginationState>({
    page: 0,
    rowsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("overview");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [restaurantForm, setRestaurantForm] = useState<RestaurantFormState>(
    EMPTY_RESTAURANT_FORM,
  );

  const [menuItems, setMenuItems] = useState<MenuRecord[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantRecord | null>(null);
  const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);
  const [editingRestaurantId, setEditingRestaurantId] = useState<string | null>(
    null,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSectionChange = useCallback((section: DashboardSection) => {
    setActiveSection(section);

    if (section !== "restaurants") {
      setSelectedRestaurant(null);
    }
  }, []);

  const creatableUserTypes = useMemo(
    () => getCreatableUserTypes(currentUser?.userType),
    [currentUser],
  );

  const stats = useMemo(() => {
    return userStats;
  }, [userStats]);





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
    if (activeSection !== "menu-items") return;

    const fetchMenu = async () => {
      try {
        const response = await fetch("/api/menu?public=true", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setMenuItems(data.menuItems || []);
        }
      } catch {}
    };

    void fetchMenu();
  }, [activeSection]);
  const fetchUsers = useCallback(
    async (
      page = userPagination.page,
      rowsPerPage = userPagination.rowsPerPage,
    ) => {
      setIsLoadingUsers(true);
      setError("");
      try {
        const searchParams = new URLSearchParams({
          page: String(page + 1),
          limit: String(rowsPerPage),
        });
        const response = await fetch(`/api/users?${searchParams.toString()}`, {
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

        const data = (await response.json()) as UsersResponse;

        if (data.currentUser.userType !== expectedRole) {
          const nextPath = getDashboardPathForUserType(
            data.currentUser.userType as UserType,
          );
          router.push(nextPath);
          router.refresh();
          return;
        }

        setCurrentUser(data.currentUser);
        setUsers(data.users);
        setUserStats(data.stats);
        setUserPagination({
          page: data.pagination.page - 1,
          rowsPerPage: data.pagination.limit,
          totalItems: data.pagination.totalItems,
          totalPages: data.pagination.totalPages,
        });
      } catch {
        setError("Unable to load users.");
      } finally {
        setIsLoadingUsers(false);
      }
    },
    [expectedRole, router, userPagination.page, userPagination.rowsPerPage],
  );

  useEffect(() => {
    void fetchUsers(userPagination.page, userPagination.rowsPerPage);
  }, [fetchUsers, userPagination.page, userPagination.rowsPerPage]);

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
      } catch {}
    };

    void fetchRestaurants();
  }, []);

  useEffect(() => {
    if (!selectedRestaurant) {
      return;
    }

    const nextRestaurant = restaurants.find(
      (restaurant) => restaurant.id === selectedRestaurant.id,
    );

    if (!nextRestaurant) {
      setSelectedRestaurant(null);
      return;
    }

    if (nextRestaurant !== selectedRestaurant) {
      setSelectedRestaurant(nextRestaurant);
    }
  }, [restaurants, selectedRestaurant]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      clearStoredUserRole();
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
        // toast.error(data.error ?? "Failed to create restaurant.");
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
      toast.success(
        isEditingRestaurant
          ? "Restaurant updated successfully"
          : "Restaurant created successfully",
      );
    } catch {
      setRestaurantError("Unable to create restaurant.");
      // toast.error(error instanceof Error ? error.message : "An error occurred while creating the restaurant. Please try again.");
    } finally {
      setIsSubmittingShop(false);
      toast.dismiss("Not able to create restaurant.");
    }
  };
  const handleEditClick = (restaurant: RestaurantRecord) => {
    setSelectedRestaurant(null);
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
        heroImageUrl: restaurant.content?.heroImageUrl ?? "",
        heroTitle: restaurant.content?.heroTitle ?? "",
        heroDescription: restaurant.content?.heroDescription ?? "",
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

  ///  delete resturent modaL can make here

  const handleDeleteRestaurant = async (restaurant: RestaurantRecord) => {
    if (!confirm(`Are you sure you want to delete ${restaurant.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${restaurant.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        toast.error(data.error ?? "Failed to delete restaurant.");
        return;
      }

      setRestaurants((prev) =>
        prev.filter((item) => item.id !== restaurant.id),
      );
      setTotalRestaurants((prev) => Math.max(prev - 1, 0));
      setOwnedRestaurants((prev) =>
        prev === null ? prev : Math.max(prev - 1, 0),
      );

      if (editingRestaurantId === restaurant.id) {
        setIsEditingRestaurant(false);
        setEditingRestaurantId(null);
        setRestaurantForm(EMPTY_RESTAURANT_FORM);
      }

      if (selectedRestaurant?.id === restaurant.id) {
        setSelectedRestaurant(null);
      }

      toast.success("Restaurant deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the restaurant. Please try again.",
      );
    }
  };

  const handleCancelEdit = () => {
    setIsEditingRestaurant(false);
    setEditingRestaurantId(null);
    setRestaurantForm(EMPTY_RESTAURANT_FORM);
  };

  const handleViewRestaurantMenu = (restaurant: RestaurantRecord) => {
    setSelectedRestaurant(restaurant);
    setActiveSection("restaurants");
  };

  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#020205] text-gray-100">
      <MobileNav
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isOpen={mobileMenuOpen}
        onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      {expectedRole && (
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          ownedRestaurants={ownedRestaurants}
          expectedRole={expectedRole}
        />
      )}

      <main className="flex-1 sticky top-0 z-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <DashboardHeader
          isLoggingOut={isLoggingOut}
          onLogout={handleLogout}
          userType={currentUser?.userType ?? null}
          user={
            currentUser
              ? { name: currentUser.name, email: currentUser.email }
              : null
          }
          onCreateUser={
            creatableUserTypes.length > 0
              ? () => setCreateUserModalOpen(true)
              : undefined
          }
          onCreateRestaurant={
            currentUser &&
            (currentUser.userType === "ADMIN" ||
              currentUser.userType === "OWNER")
              ? () => {
                  setRestaurantForm(EMPTY_RESTAURANT_FORM);
                  setRestaurantError("");
                  setIsEditingRestaurant(false);
                  setEditingRestaurantId(null);
                  setSelectedRestaurant(null);
                  setActiveSection("create-restaurant");
                }
              : undefined
          }
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
          onCreated={() => void fetchUsers(0, userPagination.rowsPerPage)}
        />

        {activeSection === "overview" ? (
          <StatsGrid
            total={stats.total}
            admins={stats.admins}
            owners={stats.owners}
            customers={stats.customers}
            restaurants={
              expectedRole === "OWNER" ? totalRestaurants : restaurants.length
            }
            ownedRestaurants={
              expectedRole === "OWNER"
                ? (ownedRestaurants ?? restaurants.length)
                : null
            }
            isOwnerView={expectedRole === "OWNER"}
          />
        ) : null}

        {activeSection === "users" ? (
          <>
            <UsersTable
              users={visibleUsers}
              isLoadingUsers={isLoadingUsers}
              title={tableTitle}
              emptyMessage={emptyMessage}
              userTypeOptions={creatableUserTypes}  // this was missing for usertype in patch api
              onCreateUser={
                creatableUserTypes.length > 0
                  ? () => setCreateUserModalOpen(true)
                  : undefined
              }
              onRefresh={fetchUsers}
              pagination={{
                count: userPagination.totalItems,
                page: userPagination.page,
                rowsPerPage: userPagination.rowsPerPage,
                onPageChange: (page) => {
                  setUserPagination((prev) => ({ ...prev, page }));
                },
                onRowsPerPageChange: (rowsPerPage) => {
                  setUserPagination((prev) => ({
                    ...prev,
                    page: 0,
                    rowsPerPage,
                  }));
                },
              }}
            />
            {error ? (
              <p className="mt-4 text-sm text-rose-400">{error}</p>
            ) : null}
          </>
        ) : null}

        {activeSection === "restaurants" ? (
          selectedRestaurant ? (
            <RestaurantMenuPage
              restaurant={selectedRestaurant}
              onBack={() => setSelectedRestaurant(null)}
            />
          ) : (
            <RestaurantsSection
              restaurants={restaurantsForSection}
              onEdit={handleEditClick}
              onDelete={handleDeleteRestaurant}
              onViewMenu={handleViewRestaurantMenu}
              onCreateRestaurant={
                currentUser &&
                (currentUser.userType === "ADMIN" ||
                  currentUser.userType === "OWNER")
                  ? () => {
                      setRestaurantForm(EMPTY_RESTAURANT_FORM);
                      setRestaurantError("");
                      setIsEditingRestaurant(false);
                      setEditingRestaurantId(null);
                      setSelectedRestaurant(null);
                      setActiveSection("create-restaurant");
                    }
                  : undefined
              }
            />
          )
        ) : null}

       
        {activeSection === "menu-items" ? (
          <MenuSection localMenuItems={menuItems} menuItems={menuItems} />
        ) : null}
        {activeSection === "table-reservations" ? <TableSection /> : null}

        {activeSection === "create-restaurant" ? (
          <RestaurantsForm
            onSubmit={handleCreateRestaurant}
            form={restaurantForm}
            setForm={setRestaurantForm}
            isSubmitting={isSubmittingShop}
            error={restaurantError}
            allCount={
              expectedRole === "OWNER" ? totalRestaurants : restaurants.length
            }
            isEditing={isEditingRestaurant}
            onCancel={handleCancelEdit}
          />
        ) : null}
      </main>
    </div>
  );
}
