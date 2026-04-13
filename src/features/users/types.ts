export type UserType = "OWNER" | "CUSTOMER" | "ADMIN" | "ADMINISTRATION";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  createdAt: string;
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  userType: UserType;
};

export type FormState = {
  name: string;
  email: string;
  password: string;
  phone: string;
  userType: UserType;
};

export const USER_TYPE_OPTIONS: UserType[] = [
  "OWNER",
  "CUSTOMER",
  "ADMIN",
  "ADMINISTRATION",
];

export function getCreatableUserTypes(userType: UserType | null | undefined): UserType[] {
  if (userType === "ADMIN" || userType === "ADMINISTRATION") {
    return [...USER_TYPE_OPTIONS];
  }

  if (userType === "OWNER") {
    return ["CUSTOMER"];
  }

  return [];
}
//
export function getDashboardPathForUserType(userType: UserType): string {
  if (userType === "ADMIN") {
    return "/dashboard/admin";
  }

  if (userType === "ADMINISTRATION") {
    return "/dashboard/administrator";
  }

  if (userType === "OWNER") {
    return "/dashboard/owner";
  }

  return "/dashboard/customer";
}
